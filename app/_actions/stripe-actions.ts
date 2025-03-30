"use server"

import type { CartItem } from "@/contexts/cart-context"
import Stripe from "stripe"
import { createOrder, updateOrderStripeIds } from "@/lib/db-service"
import { createServerSupabaseClient } from "@/lib/supabase-server"

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-02-24.acacia",
})

// Create a checkout session
export async function createCheckoutSession(items: CartItem[], email: string, discountAmount = 0) {
  try {
    // Get the current user
    const supabase = await createServerSupabaseClient()
    const {
      data: { session: supabaseSession },
    } = await supabase.auth.getSession()
    const userId = supabaseSession?.user?.id

    if (!userId) {
      throw new Error("User not authenticated")
    }

    // Create an order in the database
    const order = await createOrder(userId, items, discountAmount)

    // Create line items for Stripe
    const lineItems = items.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.name,
          description: `${item.duration}${item.data ? ` - ${item.data} Data` : ""}`,
        },
        unit_amount: Math.round(item.price * 100), // Stripe expects amounts in cents
      },
      quantity: item.quantity,
    }))

    // Add discount as a negative line item if applicable
    if (discountAmount > 0) {
      lineItems.push({
        price_data: {
          currency: "usd",
          product_data: {
            name: "Discount",
            description: "Promotional discount",
          },
          unit_amount: -Math.round(discountAmount * 100), // Negative amount for discount
        },
        quantity: 1,
      })
    }

    // Create a checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}&order_id=${order.id}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/cart?canceled=true`,
      customer_email: email,
      payment_method_options: {
        card: {
          setup_future_usage: "on_session",
        },
      },
      shipping_address_collection: {
        allowed_countries: ["US", "CA", "GB", "AU", "DE", "FR", "ES", "IT"],
      },
      billing_address_collection: "auto",
      phone_number_collection: {
        enabled: true,
      },
      allow_promotion_codes: true,
      metadata: {
        order_id: order.id,
        user_id: userId,
      },
    })

    // Update the order with Stripe checkout ID
    await updateOrderStripeIds(order.id, session.id)

    return {
      sessionId: session.id,
      url: session.url,
      orderId: order.id,
    }
  } catch (error) {
    console.error("Error creating checkout session:", error)
    throw new Error("Failed to create checkout session")
  }
}

// Verify a checkout session
export async function verifyCheckoutSession(sessionId: string, orderId: string) {
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId)

    if (session.metadata?.order_id !== orderId) {
      throw new Error("Order ID mismatch")
    }

    // Update order with payment intent ID if payment was successful
    if (session.payment_status === "paid" && session.payment_intent) {
      await updateOrderStripeIds(
        orderId,
        session.id,
        typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent.id,
      )

      // Update order status to processing
      await updateOrderStatus(orderId, "processing")
    }

    return {
      paymentStatus: session.payment_status,
      customerDetails: session.customer_details,
      amountTotal: session.amount_total ? session.amount_total / 100 : 0,
    }
  } catch (error) {
    console.error("Error verifying checkout session:", error)
    throw new Error("Failed to verify checkout session")
  }
}
// Update order status - ensure this is async
export async function updateOrderStatus(orderId: string, status: string) {
  const supabase = await createServerSupabaseClient()

  await supabase
    .from("orders")
    .update({
      status,
      updated_at: new Date().toISOString(),
    })
    .eq("id", orderId)
}
