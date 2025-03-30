"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, CreditCard, Globe, Lock } from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import { createCheckoutSession } from "@/app/_actions/stripe-actions"
import { toast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { User } from "lucide-react"

export default function CheckoutPage() {
  const { items, subtotal, discount } = useCart()
  const { user, isPending: authLoading } = useAuth() // Use isPending for loading state
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")

  // Redirect to cart if cart is empty (wait for auth check)
  useEffect(() => {
    if (!authLoading && items.length === 0) {
      router.push("/cart")
    }

    // Pre-fill email if user is logged in
    if (user?.email) {
      setEmail(user.email)
    }
    // Clear email if user logs out
    if (!user) {
      setEmail("")
    }
  }, [items, router, user, authLoading])

  const handleStripeCheckout = async (e: React.FormEvent) => { // Add type for event
    e.preventDefault()

    if (!email || !firstName || !lastName) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    // Ensure user is logged in before proceeding
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in or sign up to complete your purchase.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsLoading(true)

      // Create a Stripe checkout session (use user.email)
      const { url } = await createCheckoutSession(items, user.email, discount)

      if (url) {
        // Redirect to Stripe Checkout
        window.location.href = url
      } else {
        toast({
          title: "Checkout error",
          description: "Unable to create checkout session",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error during checkout:", error)
      toast({
        title: "Checkout failed",
        description: "There was a problem processing your payment. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="py-16">
      <div className="container">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-4xl font-bold">Checkout</h1>
          <Link href="/cart">
            <Button variant="ghost" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Cart
            </Button>
          </Link>
        </div>

        <div className="grid gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2">
            {authLoading ? (
              <Card className="neobrutalist-card">
                <CardContent className="p-6 text-center">Loading...</CardContent>
              </Card>
            ) : !user ? (
              <Alert className="neobrutalist-alert border-primary">
                <User className="h-4 w-4" />
                <AlertTitle className="font-bold">Authentication Required</AlertTitle>
                <AlertDescription>
                  Please{" "}
                  <Link href="/auth/sign-in?redirect=/checkout" className="font-bold underline">
                    Sign In
                  </Link>{" "}
                  or{" "}
                  <Link href="/auth/sign-up?redirect=/checkout" className="font-bold underline">
                    Sign Up
                  </Link>{" "}
                  to complete your purchase.
                </AlertDescription>
              </Alert>
            ) : (
              <Card className="neobrutalist-card">
                <CardContent className="p-6">
                  <form onSubmit={handleStripeCheckout}>
                    <div className="space-y-6">
                      <div className="grid gap-6 sm:grid-cols-2">
                        <div>
                        <Label htmlFor="first-name">First Name</Label>
                        <Input
                          id="first-name"
                          className="neobrutalist-input mt-1"
                          required
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="last-name">Last Name</Label>
                        <Input
                          id="last-name"
                          className="neobrutalist-input mt-1"
                          required
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          className="neobrutalist-input mt-1"
                          required
                          value={email}
                          readOnly // Make email read-only if logged in
                          // onChange={(e) => setEmail(e.target.value)} // Remove onChange
                        />
                        <p className="mt-1 text-sm text-muted-foreground">
                          Your eSIM details will be sent to this email address.
                      </p>
                    </div>

                    <div className="rounded-none border-4 border-black bg-muted p-4">
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-5 w-5 text-primary" />
                        <h3 className="font-bold">Stripe Link Payment</h3>
                      </div>
                      <p className="mt-2 text-sm">
                        We use Stripe for secure payments. You'll be redirected to Stripe to complete your purchase.
                      </p>
                    </div>

                    <div className="flex items-center gap-2 rounded-lg bg-muted p-4">
                      <Lock className="h-5 w-5 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        Your payment information is secure. We use encryption to protect your data.
                      </span>
                    </div>

                    <div className="pt-4">
                      <Button
                        type="submit"
                        className="neobrutalist-button text-lg w-full"
                        disabled={isLoading || !user || authLoading} // Disable if loading or not logged in
                      >
                        {isLoading ? "Processing..." : "Complete Purchase with Stripe"}
                      </Button>
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>
            )}
          </div>

          <div>
            <Card className="neobrutalist-card">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold">Order Summary</h2>

                <div className="mt-6 space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between">
                      <div>
                        <div className="font-bold">
                          {item.name} - {item.duration}
                        </div>
                        <div className="text-sm text-muted-foreground">Qty: {item.quantity}</div>
                      </div>
                      <div className="font-bold">${(item.price * item.quantity).toFixed(2)}</div>
                    </div>
                  ))}

                  <div className="border-t border-dashed border-black pt-4">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Discount</span>
                        <span>-${discount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="mt-2 flex justify-between text-xl font-bold">
                      <span>Total</span>
                      <span>${(subtotal - discount).toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex items-center justify-center gap-2 rounded-lg bg-muted p-4">
                  <Globe className="h-5 w-5 text-primary" />
                  <span className="text-sm">
                    Your eSIM details will be delivered instantly to your email after purchase.
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
