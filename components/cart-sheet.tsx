"use client"

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Minus, Plus, ShoppingCart, Trash2, ArrowRight, Loader2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { useEffect, useState } from "react"
import { NeoButton } from "./ui/neo-button"
import { NeoInput } from "./ui/neo-input"
import { useCartStore, DisplayCartLine } from "../store/cart-store"

export function CartSheet() {
  const {
    displayLines,
    itemCount,
    subtotal,
    total,
    checkoutUrl,
    discountCodes,
    isLoading,
    error,
    removeItem,
    updateQuantity,
    clearCart,
    applyPromoCode,
    removePromoCode,
    initializeCart, // Added to initialize cart on mount
  } = useCartStore()

  const [promoInput, setPromoInput] = useState("")
  const [isAnimating, setIsAnimating] = useState(false)
  const [prevCount, setPrevCount] = useState(itemCount)

  useEffect(() => {
    // Initialize cart when component mounts or becomes visible
    // This ensures cart is loaded from Shopify or a new one is created
    initializeCart();
  }, [initializeCart]);

  useEffect(() => {
    if (itemCount > prevCount) {
      setIsAnimating(true)
      const timer = setTimeout(() => setIsAnimating(false), 1000)
      return () => clearTimeout(timer)
    }
    setPrevCount(itemCount)
  }, [itemCount, prevCount])

  const handleApplyPromo = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (promoInput.trim()) {
      await applyPromoCode(promoInput.trim())
      // Do not clear promoInput here, let user see what they typed if it failed.
      // If successful, discountCodes state will update and UI will reflect it.
    }
  }

  const handleRemovePromo = async (code: string) => {
    // Assuming removePromoCode in store handles removing a specific code
    // or simply clears all codes if Shopify API requires that.
    // For now, let's assume it clears all.
    await removePromoCode()
  }


  const handleCheckout = () => {
    if (checkoutUrl && displayLines.length > 0) {
      window.location.href = checkoutUrl
    } else if (displayLines.length === 0) {
      alert("Your cart is empty.") // Or use a toast
    } else {
      alert("Checkout is not available at the moment. Please try again.") // Or use a toast
    }
  }

  const activeDiscount = discountCodes.find(dc => dc.applicable);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" className="relative p-2">
          <ShoppingCart className="h-5 w-5" />
          <AnimatePresence>
            {itemCount > 0 && (
              <motion.div
                key="badge"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground"
              >
                {itemCount}
              </motion.div>
            )}
          </AnimatePresence>
          <AnimatePresence>
            {isAnimating && (
              <motion.div
                key="pulse"
                initial={{ scale: 1, opacity: 0.8 }}
                animate={{ scale: 1.8, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1 }}
                className="absolute inset-0 rounded-full bg-primary"
              />
            )}
          </AnimatePresence>
        </Button>
      </SheetTrigger>
      <SheetContent className="neobrutalist-sheet w-full max-w-md border-l-4 border-black p-0 sm:max-w-lg">
        <SheetHeader className="border-b-4 border-black p-6">
          <SheetTitle className="text-2xl font-bold">Your Cart</SheetTitle>
          {displayLines.length > 0 && (
            <SheetDescription>
              Manage your eSIM plans before checkout.
            </SheetDescription>
          )}
        </SheetHeader>

        {isLoading && displayLines.length === 0 && ( // Show loader only if cart is empty and loading
          <div className="flex h-full flex-col items-center justify-center p-6">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="mt-4 text-muted-foreground">Loading your cart...</p>
          </div>
        )}

        {!isLoading && displayLines.length === 0 && (
          <div className="flex h-full flex-col items-center justify-center p-6 text-center">
            <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-muted">
              <ShoppingCart className="h-12 w-12 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-bold">Your cart is empty</h2>
            <p className="mt-2 text-muted-foreground">
              Looks like you haven't added any eSIMs to your cart yet.
            </p>
            <SheetClose asChild>
              <Link href="/plans" className="mt-8">
                <NeoButton className="neobrutalist-button">Browse eSIM Plans</NeoButton>
              </Link>
            </SheetClose>
          </div>
        )}

        {displayLines.length > 0 && (
          <div className="flex h-full flex-col">
            <div className="flex-1 overflow-y-auto p-6">
              {error && <div className="mb-4 rounded border border-red-500 bg-red-50 p-3 text-sm text-red-700">{error}</div>}
              <div className="flex items-center justify-between pb-4">
                <span className="text-sm text-muted-foreground">
                  {itemCount} item{itemCount !== 1 ? "s" : ""} in your cart
                </span>
                <Button variant="outline" className="neobrutalist-border h-auto px-3 py-1.5 text-xs" onClick={clearCart} disabled={isLoading}>
                  {isLoading ? <Loader2 className="mr-2 h-3 w-3 animate-spin" /> : null}
                  Clear Cart
                </Button>
              </div>

              <AnimatePresence initial={false}>
                {displayLines.map((item: DisplayCartLine) => (
                  <motion.div
                    key={item.id} // Use CartLine ID as key
                    layout
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden border-b border-dashed border-black py-4 last:border-b-0"
                  >
                    <div className="flex items-start justify-between gap-4">
                      {item.imageUrl && (
                        <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded border border-gray-200">
                          <Image src={item.imageUrl} alt={item.productTitle || 'Product Image'} layout="fill" objectFit="cover" />
                        </div>
                      )}
                      <div className="flex-1">
                        <h3 className="font-bold">{item.productTitle || item.variantTitle}</h3>
                        {item.variantTitle && item.productTitle !== item.variantTitle && <p className="text-xs text-muted-foreground">{item.variantTitle}</p>}
                        <p className="text-sm text-muted-foreground">
                          {item.dataAmount ? `${item.dataAmount} Data` : ""}
                          {item.region ? ` - ${item.region}` : ""}
                        </p>
                      </div>

                      <div className="flex flex-col items-end gap-2">
                        <div className="w-20 text-right font-bold">${item.linePrice.toFixed(2)}</div>
                        <div className="flex items-center">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 rounded-r-none border-black"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1 || isLoading}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <div className="flex h-8 w-10 items-center justify-center border-y border-black bg-background text-sm">
                            {/* Simplified: Show quantity or a generic loader if global isLoading is true. 
                                A more complex solution would involve item-specific loading states. */}
                            {isLoading ? <Loader2 className="h-4 w-4 animate-spin"/> : item.quantity}
                          </div>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 rounded-l-none border-black"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            disabled={isLoading}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="ml-2 h-8 w-8 text-red-500 hover:bg-red-50 hover:text-red-600"
                            onClick={() => removeItem(item.id)}
                            disabled={isLoading}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <SheetFooter className="border-t-4 border-black bg-background p-6">
              <div className="w-full space-y-6">
                <form onSubmit={handleApplyPromo}>
                  <div className="flex gap-2">
                    <NeoInput
                      placeholder="Promo code"
                      className="neobrutalist-input flex-grow"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      disabled={isLoading}
                    />
                    <Button type="submit" variant="outline" className="neobrutalist-border" disabled={isLoading}>
                      {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Apply"}
                    </Button>
                  </div>
                </form>

                {activeDiscount && (
                  <div className="flex items-center justify-between rounded-lg bg-green-50 p-3 text-sm">
                    <div>
                      <span className="font-bold">Promo applied:</span> {activeDiscount.code}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-auto p-1 text-red-500 hover:bg-red-50 hover:text-red-600"
                      onClick={() => handleRemovePromo(activeDiscount.code)}
                      disabled={isLoading}
                    >
                      Remove
                    </Button>
                  </div>
                )}

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>

                  {/* Discount display can be more sophisticated if needed, based on cart.cost.totalAmount vs subtotalAmount */}
                  {total < subtotal && activeDiscount && (
                     <div className="flex justify-between text-sm text-green-600">
                       <div className="flex items-center gap-1">
                         <span>Discount</span>
                         <span className="rounded bg-green-100 px-1.5 py-0.5 text-xs font-bold text-green-800">
                           {activeDiscount.code}
                         </span>
                       </div>
                       <span>-${(subtotal - total).toFixed(2)}</span> {/* Calculate discount amount */}
                     </div>
                   )}


                  <div className="border-t border-dashed border-black pt-2">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <NeoButton
                  className="neobrutalist-button w-full"
                  onClick={handleCheckout}
                  disabled={displayLines.length === 0 || isLoading || !checkoutUrl}
                >
                  {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Proceed to Checkout"}
                  {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
                </NeoButton>
              </div>
            </SheetFooter>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
