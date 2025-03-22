"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Minus, Plus, ShoppingCart, Trash2, ArrowRight } from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import { motion, AnimatePresence } from "framer-motion"

export default function CartPage() {
  const {
    items,
    removeItem,
    updateQuantity,
    clearCart,
    subtotal,
    discount,
    applyPromoCode,
    removePromoCode,
    promoCode,
  } = useCart()
  const [promoInput, setPromoInput] = useState("")

  const handleApplyPromo = (e) => {
    e.preventDefault()
    if (promoInput.trim()) {
      applyPromoCode(promoInput.trim())
      setPromoInput("")
    }
  }

  if (items.length === 0) {
    return (
      <div className="py-16">
        <div className="container max-w-4xl">
          <h1 className="text-4xl font-bold">Your Cart</h1>

          <div className="mt-8 text-center">
            <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-muted">
              <ShoppingCart className="h-12 w-12 text-muted-foreground" />
            </div>

            <h2 className="text-2xl font-bold">Your cart is empty</h2>
            <p className="mt-2 text-muted-foreground">Looks like you haven't added any eSIMs to your cart yet.</p>

            <div className="mt-8">
              <Link href="/plans">
                <Button className="neobrutalist-button">Browse eSIM Plans</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="py-16">
      <div className="container max-w-4xl">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold">Your Cart</h1>
          <Button variant="outline" className="neobrutalist-border" onClick={clearCart}>
            Clear Cart
          </Button>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card className="neobrutalist-card">
              <CardContent className="p-6">
                <AnimatePresence initial={false}>
                  {items.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="flex items-center justify-between border-b border-dashed border-black py-4 last:border-b-0">
                        <div className="flex-1">
                          <h3 className="font-bold">{item.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {item.duration}
                            {item.data ? ` - ${item.data}` : ""}
                          </p>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="flex items-center">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 rounded-r-none"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <div className="flex h-8 w-10 items-center justify-center border border-x-0 border-input">
                              {item.quantity}
                            </div>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 rounded-l-none"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>

                          <div className="w-20 text-right font-bold">${(item.price * item.quantity).toFixed(2)}</div>

                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-500 hover:bg-red-50 hover:text-red-600"
                            onClick={() => removeItem(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="neobrutalist-card">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold">Order Summary</h2>

                <div className="mt-6 space-y-4">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>

                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <div className="flex items-center gap-2">
                        <span>Discount</span>
                        {promoCode && (
                          <span className="rounded bg-green-100 px-2 py-0.5 text-xs font-bold text-green-800">
                            {promoCode}
                          </span>
                        )}
                      </div>
                      <span>-${discount.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="border-t border-dashed border-black pt-4">
                    <div className="flex justify-between text-xl font-bold">
                      <span>Total</span>
                      <span>${(subtotal - discount).toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  {promoCode ? (
                    <div className="mb-4 flex items-center justify-between rounded-lg bg-green-50 p-3">
                      <div>
                        <span className="font-bold">Promo code applied:</span> {promoCode}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:bg-red-50 hover:text-red-600"
                        onClick={removePromoCode}
                      >
                        Remove
                      </Button>
                    </div>
                  ) : (
                    <form onSubmit={handleApplyPromo} className="mb-4">
                      <div className="flex gap-2">
                        <Input
                          placeholder="Promo code"
                          className="neobrutalist-input"
                          value={promoInput}
                          onChange={(e) => setPromoInput(e.target.value)}
                        />
                        <Button type="submit" variant="outline" className="neobrutalist-border">
                          Apply
                        </Button>
                      </div>
                    </form>
                  )}

                  <Link href="/checkout">
                    <Button className="neobrutalist-button w-full">
                      Checkout
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

