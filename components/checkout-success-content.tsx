"use client"

// Add this import at the top of the file
import { trackEvent } from "@/lib/analytics"
import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { clearCart } from "@/lib/cart" // Assuming clearCart is in this location
import { verifyCheckoutSession } from "@/lib/api" // Assuming verifyCheckoutSession is in this location

// Inside the useEffect where you verify the session, add this after clearing the cart:
const CheckoutSuccessContent = () => {
  const router = useRouter()
  const { sessionId: sessionIdParam, orderId: orderIdParam } = router.query
  const sessionId = typeof sessionIdParam === "string" ? sessionIdParam : undefined
  const orderId = typeof orderIdParam === "string" ? orderIdParam : undefined

  const [isLoading, setIsLoading] = useState(false)
  const [orderIdState, setOrderId] = useState<string | null>(null)
  const [orderDetails, setOrderDetails] = useState<any>(null)

  useEffect(() => {
    async function verifySession() {
      if (sessionId && orderId) {
        try {
          setIsLoading(true)
          const result = await verifyCheckoutSession(sessionId, orderId)

          if (result.paymentStatus === "paid") {
            setOrderId(orderId)
            setOrderDetails(result)

            // Clear the cart after successful checkout
            clearCart()

            // Track purchase event
            trackEvent("purchase", {
              transaction_id: orderId,
              value: result.amountTotal,
              currency: "USD",
              tax: 0,
              shipping: 0,
            })
          } else {
            // Payment not completed
            window.location.href = "/cart?payment_incomplete=true"
          }
        } catch (error) {
          console.error("Error verifying session:", error)
          window.location.href = "/cart?verification_error=true"
        } finally {
          setIsLoading(false)
        }
      } else {
        // Redirect if no session ID or order ID is present
        window.location.href = "/cart"
      }
    }

    verifySession()
  }, [sessionId, orderId, clearCart, router])

  if (isLoading) {
    return <p>Loading...</p>
  }

  if (!orderIdState) {
    return <p>Verifying order...</p>
  }

  return (
    <div>
      <h1>Thank you for your order!</h1>
      <p>Your order ID is: {orderIdState}</p>
      {orderDetails && (
        <div>
          <p>Total: ${orderDetails.amountTotal / 100}</p>
          {/* Display other order details as needed */}
        </div>
      )}
    </div>
  )
}

export default CheckoutSuccessContent

