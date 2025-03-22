import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { updateOrderStatus, updateOrderStripeIds } from "@/lib/db-service"
import { sendOrderConfirmationEmail } from "@/lib/email-service"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
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
            await updateOrderStatus(orderId, "processing")

            // Send confirmation email
            if (session.customer_details?.email) {
              await sendOrderConfirmationEmail(session.customer_details.email, orderId)
            }
          }
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

