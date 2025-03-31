import { type NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import {
  updateOrderStatus,
  updateOrderStripeIds,
  getOrderById, // Import function to get order details
  updateOrderWithEsimData, // Import function to save eSIM data
} from "@/lib/db-service";
// Use the existing sendEsimEmail function
import { sendEsimEmail } from "@/app/_actions/email-actions"; 
import { createMayaEsim } from "@/app/_actions/maya-actions"; // Import eSIM creation action

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-02-24.acacia", // Use the same API version as stripe-actions
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(req: NextRequest) {
  try {
    const body = await req.text()
    const signature = req.headers.get("stripe-signature")!

    // Verify webhook signature
    let event: Stripe.Event
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err: any) {
      console.error(`Webhook signature verification failed: ${err.message}`)
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
    }

    // Handle the event
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session
        const orderId = session.metadata?.order_id

        if (orderId) {
          // Update order with payment intent ID
          if (session.payment_status === "paid" && session.payment_intent) {
            await updateOrderStripeIds(
              orderId,
              session.id,
              typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent.id,
            )

            // Update order status to processing
            const updatedOrder = await updateOrderStatus(orderId, "processing");

            // Fetch full order details to get items
            const fullOrder = await getOrderById(orderId);
            const customerEmail = session.customer_details?.email;

            if (fullOrder && fullOrder.items && fullOrder.items.length > 0 && customerEmail) {
              // Assuming only one item per order for now, adjust if multiple eSIMs per order are possible
              const orderItem = fullOrder.items[0]; 
              
              try {
                // Provision eSIM via Maya Mobile using planTypeId (product_id)
                const esimDetails = await createMayaEsim(
                  orderItem.product_id // Pass only the product_id as planTypeId
                );

                // Save eSIM data to the order
                await updateOrderWithEsimData(orderId, esimDetails);

                // Send QR code email using the existing function
                await sendEsimEmail(customerEmail, esimDetails.activationCode, orderId);

                // Optionally update order status to 'completed' after provisioning and email
                await updateOrderStatus(orderId, "completed");

              } catch (provisionError) {
                console.error(`Failed to provision eSIM or send email for order ${orderId}:`, provisionError);
                // Handle provisioning failure - maybe set order status to 'provisioning_failed'
                await updateOrderStatus(orderId, "failed"); // Example error status
              }
            } else {
               console.error(`Could not find order items or customer email for order ${orderId} to provision eSIM.`);
               // Handle missing data - maybe set order status to 'failed'
               await updateOrderStatus(orderId, "failed"); 
            }
          } else {
             console.warn(`Order ${orderId} not paid or payment intent missing in checkout session ${session.id}`);
          }
        } else {
           console.error(`Missing order_id in metadata for checkout session ${session.id}`);
        }
        break
      }

      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        // Find order by payment intent ID
        // This is useful for orders created outside of checkout sessions
        // Implementation depends on your database structure
        break
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        // Handle failed payment
        // Implementation depends on your database structure
        break
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Error handling webhook:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
