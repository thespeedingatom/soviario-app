"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, Loader2 } from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import { useSearchParams } from "next/navigation"
import { verifyCheckoutSession } from "@/app/_actions/stripe-actions"
import { MayaQRCode } from "@/components/maya-qr-code"

export default function CheckoutSuccessPage() {
  const { clearCart } = useCart()
  const [orderId, setOrderId] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  interface OrderDetails {
    paymentStatus: string
    customerEmail?: string
    amountTotal: number
    shippingRegion?: string
    lineItems?: Array<{
      productId: string
      isEsim: boolean
    }>
  }

  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null)
  const [esimData, setEsimData] = useState<{
    esimId: string
    activationCode: string
  } | null>(null)
  const [esimLoading, setEsimLoading] = useState(false)
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
            clearCart()

            // Check if this is an eSIM product
            // Temporary - we'll need to modify verifyCheckoutSession to return line items
            // For now assume all orders are eSIM
            await createEsim(orderIdParam)
          } else {
            window.location.href = "/cart?payment_incomplete=true"
          }
        } catch (error) {
          console.error("Error verifying session:", error)
          window.location.href = "/cart?verification_error=true"
        } finally {
          setIsLoading(false)
        }
      } else {
        window.location.href = "/cart"
      }
    }

    async function createEsim(orderId: string) {
      try {
        setEsimLoading(true)
        const response = await fetch('/api/maya/esim', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            orderId,
            productId: 'default-esim-product', // Temporary placeholder
            customerEmail: orderDetails?.customerEmail || '',
            region: orderDetails?.shippingRegion || 'global'
          })
        })

        if (!response.ok) throw new Error('Failed to create eSIM')
        const data = await response.json()
        setEsimData(data.data)
      } catch (error) {
        console.error('eSIM creation failed:', error)
      } finally {
        setEsimLoading(false)
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
            <p className="mt-4 text-xl">Thank you for your purchase.</p>

            {esimLoading && (
              <div className="mt-6 flex items-center justify-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Preparing your eSIM...</span>
              </div>
            )}

            {esimData && (
              <div className="mt-8 space-y-4">
                <h2 className="text-xl font-bold">Your eSIM Activation</h2>
                <div className="rounded-lg bg-muted p-4">
                  <MayaQRCode activationCode={esimData.activationCode} />
                  <p className="mt-4 text-sm">
                    Scan this QR code with your device to activate your eSIM
                  </p>
                </div>
              </div>
            )}

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
              <Link href="/dashboard/orders">
                <Button className="neobrutalist-button">View My Orders</Button>
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
