"use client"

import { ShoppingCart } from "lucide-react"
import { NeoButton } from "@/components/ui/neo-button"
import { useCartStore } from "../store/cart-store"

// The product prop should contain at least the Shopify Product Variant ID
// This could be a subset of ShopifyProduct or a specific type for product cards.
interface ProductVariantData {
  id: string; // This MUST be the Shopify Product Variant GID, e.g., "gid://shopify/ProductVariant/12345"
  // Other fields like name, price can be part of this for display purposes if needed by parent,
  // but only 'id' is strictly needed by this button for the cart action.
  name?: string; // Optional, for context or if button needs it
  price?: number; // Optional
}

interface AddToCartButtonProps {
  productVariant: ProductVariantData; // Renamed for clarity
  buttonProps?: {
    color?: "primary" | "secondary" | "accent" | "black" | "white"
    size?: "default" | "sm" | "lg" | "icon"
    className?: string
  }
  quantity?: number; // Optional, defaults to 1
}

export default function AddToCartButton({ productVariant, buttonProps, quantity = 1 }: AddToCartButtonProps) {
  const { addItem, isLoading } = useCartStore()

  const handleAddToCart = async () => {
    if (!productVariant.id) {
      console.error("Product variant ID is missing. Cannot add to cart.");
      // Optionally, show a user-facing error
      return;
    }
    // The addItem action in the new store expects variantId and quantity
    await addItem(productVariant.id, quantity);
    // Optionally, add some user feedback here, like a toast notification
    // e.g., toast({ title: `${productVariant.name || 'Item'} added to cart` });
  }

  return (
    <NeoButton
      className={`w-full ${buttonProps?.className || ''}`}
      size={buttonProps?.size || "lg"}
      color={buttonProps?.color || "primary"}
      onClick={handleAddToCart}
      disabled={isLoading} // Disable button when cart is loading/updating
    >
      <ShoppingCart className="mr-2 h-5 w-5" />
      {isLoading ? "Adding..." : "Add to Cart"}
    </NeoButton>
  )
}
