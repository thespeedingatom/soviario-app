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
import { Input } from "@/components/ui/input" // Assuming NeoInput is a styled Input
import { Minus, Plus, ShoppingCart, Trash2, ArrowRight } from "lucide-react"
// import { useCart } from "@/contexts/cart-context" // Removed useCart
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { useEffect, useState } from "react"
import { NeoButton } from "./ui/neo-button" // Assuming this is your custom button
import { NeoInput } from "./ui/neo-input" // Assuming this is your custom input
import { shopify } from "@/lib/shopify"
import { CartItem } from "../types" // Changed to relative path for debugging
import { useCartStore } from "../store/cart-store" // Import Zustand store

export function CartSheet() {
  const {
    items,
    promoCode,
    discount,
    itemCount,
    subtotal,
    removeItem,
    updateQuantity,
    clearCart,
    applyPromoCode,
    removePromoCode,
  } = useCartStore()

  const [promoInput, setPromoInput] = useState("") // promoInput remains local to the sheet
  const [isAnimating, setIsAnimating] = useState(false)
  const [prevCount, setPrevCount] = useState(itemCount) // Initialize with itemCount from store

  useEffect(() => {
    if (itemCount > prevCount) {
      setIsAnimating(true)
      const timer = setTimeout(() => setIsAnimating(false), 1000)
      return () => clearTimeout(timer)
    }
    setPrevCount(itemCount)
  }, [itemCount, prevCount]) // Depend on itemCount from store

  const handleApplyPromo = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (promoInput.trim()) {
      // applyPromoCode is now from the store
      applyPromoCode(promoInput.trim())
      setPromoInput("")
    }
  }

  const handleCheckout = async () => {
    if (items.length === 0) {
      alert("Your cart is empty.")
      return
    }

    const lineItems = items.map(item => ({
      merchandiseId: item.id, // This should be the Shopify Variant ID
      quantity: item.quantity,
    }));

    const cartCreateMutation = `
      mutation cartCreate($input: CartInput!) {
        cartCreate(input: $input) {
          cart {
            id
            checkoutUrl
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

    const variables = {
      input: {
        lines: lineItems,
      },
    };

    try {
      // Define a type for Shopify user errors for better type safety
      type ShopifyUserError = {
        field: string[] | null;
        message: string;
      };

      type CartCreateResponse = {
        cartCreate: {
          cart?: {
            id: string;
            checkoutUrl: string;
          };
          userErrors: ShopifyUserError[];
        };
      };

      const response: CartCreateResponse = await shopify.request(cartCreateMutation, variables);

      if (response.cartCreate.userErrors && response.cartCreate.userErrors.length > 0) {
        console.error("Shopify User Errors:", response.cartCreate.userErrors);
        alert(`Error creating cart: ${response.cartCreate.userErrors.map((e: ShopifyUserError) => e.message).join(", ")}`);
        return;
      }

      if (response.cartCreate.cart && response.cartCreate.cart.checkoutUrl) {
        window.location.href = response.cartCreate.cart.checkoutUrl;
      } else {
        console.error("Failed to create Shopify cart or get checkout URL:", response);
        alert("Could not proceed to checkout. Please try again.");
      }
    } catch (error) {
      console.error("Shopify Checkout Error:", error);
      alert("An unexpected error occurred while trying to checkout. Please try again.");
    }
  };

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
                transition={{ duration: 1 }} // Corresponds to setTimeout duration
                className="absolute inset-0 rounded-full bg-primary"
              />
            )}
          </AnimatePresence>
        </Button>
      </SheetTrigger>
      <SheetContent className="neobrutalist-sheet w-full max-w-md border-l-4 border-black p-0 sm:max-w-lg">
        <SheetHeader className="border-b-4 border-black p-6">
          <SheetTitle className="text-2xl font-bold">Your Cart</SheetTitle>
          {items.length > 0 && (
            <SheetDescription>
              Manage your eSIM plans before checkout.
            </SheetDescription>
          )}
        </SheetHeader>

        {items.length === 0 ? (
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
        ) : (
          <div className="flex h-full flex-col">
            <div className="flex-1 overflow-y-auto p-6">
              <div className="flex items-center justify-between pb-4">
                <span className="text-sm text-muted-foreground">
                  {itemCount} item{itemCount > 1 ? "s" : ""} in your cart
                </span>
                <SheetClose asChild>
                  <Button variant="outline" className="neobrutalist-border h-auto px-3 py-1.5 text-xs" onClick={clearCart}>
                    Clear Cart
                  </Button>
                </SheetClose>
              </div>

              <AnimatePresence initial={false}>
                {items.map((item: CartItem) => (
                  <motion.div
                    key={item.id}
                    layout // Added layout for smoother animations on remove/add
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden border-b border-dashed border-black py-4 last:border-b-0"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="font-bold">{item.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {item.duration}
                          {item.data ? ` - ${item.data}` : ""}
                        </p>
                      </div>

                      <div className="flex flex-col items-end gap-2">
                        <div className="w-20 text-right font-bold">${(item.price * item.quantity).toFixed(2)}</div>
                        <div className="flex items-center">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 rounded-r-none border-black"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <div className="flex h-8 w-10 items-center justify-center border-y border-black bg-background text-sm">
                            {item.quantity}
                          </div>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 rounded-l-none border-black"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="ml-2 h-8 w-8 text-red-500 hover:bg-red-50 hover:text-red-600"
                            onClick={() => removeItem(item.id)}
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
                    />
                    <Button type="submit" variant="outline" className="neobrutalist-border">
                      Apply
                    </Button>
                  </div>
                </form>

                {promoCode && (
                  <div className="flex items-center justify-between rounded-lg bg-green-50 p-3 text-sm">
                    <div>
                      <span className="font-bold">Promo applied:</span> {promoCode}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-auto p-1 text-red-500 hover:bg-red-50 hover:text-red-600"
                      onClick={removePromoCode}
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

                  {discount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <div className="flex items-center gap-1">
                        <span>Discount</span>
                        <span className="rounded bg-green-100 px-1.5 py-0.5 text-xs font-bold text-green-800">
                          {promoCode}
                        </span>
                      </div>
                      <span>-${discount.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="border-t border-dashed border-black pt-2">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span>${(subtotal - discount).toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <SheetClose asChild>
                  <NeoButton
                    className="neobrutalist-button w-full"
                    onClick={handleCheckout}
                    disabled={items.length === 0}
                  >
                    Proceed to Checkout
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </NeoButton>
                </SheetClose>
              </div>
            </SheetFooter>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
