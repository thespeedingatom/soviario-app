"use client";

import { CartItem } from "@/types";
import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { useRouter } from "next/navigation";

export function CartSheet() {
  const { items, removeItem, updateQuantity } = useCart();
  const router = useRouter();

  const handleCheckout = async () => {
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        body: JSON.stringify({ items }),
      });
      const { url } = await response.json();
      window.location.href = url;
    } catch (err) {
      console.error("Checkout error:", err);
    }
  };

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div key={item.id} className="flex items-center justify-between">
          <div>
            <h3>{item.name}</h3>
            <p>${item.price} x {item.quantity}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="icon"
              variant="outline"
              onClick={() => updateQuantity(item.id, item.quantity - 1)}
            >
              <Icons.minus className="h-4 w-4" />
            </Button>
            <span>{item.quantity}</span>
            <Button
              size="icon"
              variant="outline"
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
            >
              <Icons.plus className="h-4 w-4" />
            </Button>
            <Button
              variant="destructive"
              size="icon"
              onClick={() => removeItem(item.id)}
            >
              <Icons.trash className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
      <Button className="w-full" onClick={handleCheckout}>
        Checkout
      </Button>
    </div>
  );
        ) : (
          <div className="mt-6 space-y-6">
            <div className="flex justify-between">
              <SheetClose asChild>
                <Button variant="outline" className="neobrutalist-border" onClick={clearCart}>
                  Clear Cart
                </Button>
              </SheetClose>
              <span className="font-bold">Subtotal: ${(subtotal - discount).toFixed(2)}</span>
            </div>

            <AnimatePresence initial={false}>
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden border-b border-dashed border-black pb-4 last:border-b-0"
                >
                  <div className="flex items-center justify-between">
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

                      <SheetClose asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-500 hover:bg-red-50 hover:text-red-600"
                          onClick={() => removeItem(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </SheetClose>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            <div className="mt-6">
              <form onSubmit={handleApplyPromo} className="mb-6">
                <div className="flex gap-2">
                  <NeoInput
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

              {promoCode && (
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
              )}

              <div className="space-y-4">
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

              <div className="mt-8">
                <NeoButton 
                  className="neobrutalist-button w-full"
                  onClick={async () => {
                    try {
                      const cart = await shopifyClient.createCart();
                      for (const item of items) {
                        // Use the first variant ID for Shopify
                        const variantId = item.id; // Assuming item.id is the variant ID
                        await shopifyClient.addToCart(
                          cart.cartCreate.cart.id,
                          variantId,
                          item.quantity
                        );
                      }
                      window.location.href = cart.cartCreate.cart.checkoutUrl;
                    } catch (error) {
                      console.error("Checkout error:", error);
                      alert("Error during checkout. Please try again.");
                    }
                  }}
                >
                  Checkout
                  <span className="ml-2 h-4 w-4">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12l14 0" />
                      <path d="M12 5l7 7-7 7" />
                    </svg>
                  </span>
                </NeoButton>
              </div>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
