"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import { useSearchParams } from "next/navigation"
import { verifyCheckoutSession } from "@/app/actions/stripe-actions"

export default function CheckoutSuccessPage() {
  const { clearCart } = useCart()
  const [orderId, setOrderId] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [orderDetails, setOrderDetails] = useState<any>(null)
  const searchParams = useSearchParams()
  const sessionId = searchParams.get("session_id")
  const orderIdParam = searchParams.get("order_id")

  useEffect(() => {
    async function verifySession() {
      if (sessionId && orderIdParam) {
        try {
          setIsLoading(true)
          const result = await verifyCheckoutSession(sessionId, orderIdParam)

          if (result.paymentStatus === "paid") {
            setOrderId(orderIdParam)
            setOrderDetails(result)
            // Clear the cart after successful checkout
            clearCart()
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
  }, [sessionId, orderIdParam, clearCart])

  if (isLoading) {
    return (
      <div className="py-16">
        <div className="container max-w-3xl text-center">
          <Card className="neobrutalist-card">
            <CardContent className="p-8">
              <div className="animate-pulse">
                <div className="mx-auto h-20 w-20 rounded-full bg-gray-200"></div>
                <div className="mt-6 h-8 w-3/4 bg-gray-200 mx-auto"></div>
                <div className="mt-4 h-6 w-1/2 bg-gray-200 mx-auto"></div>
              </div>
              <p className="mt-8">Verifying your order...</p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="py-16">
      <div className="container max-w-3xl">
        <Card className="neobrutalist-card">
          <CardContent className="p-8 text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>

            <h1 className="text-3xl font-bold">Order Confirmed!</h1>
            <p className="mt-4 text-xl">Thank you for your purchase. Your eSIM details have been sent to your email.</p>

            <div className="mt-8 space-y-4">
              <div className="rounded-lg bg-muted p-4">
                <h2 className="font-bold">Order #{orderId.slice(0, 8)}</h2>
                <p className="text-muted-foreground">{new Date().toLocaleDateString()}</p>
              </div>

              {orderDetails && (
                <div className="rounded-lg bg-muted p-4">
                  <h2 className="font-bold">Total Amount</h2>
                  <p className="text-xl font-bold">${orderDetails.amountTotal.toFixed(2)}</p>
                </div>
              )}
            </div>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Link href="/dashboard/my-esims">
                <Button className="neobrutalist-button">View My eSIMs</Button>
              </Link>
              <Link href="/">
                <Button variant="outline" className="neobrutalist-border">
                  Return to Home
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

