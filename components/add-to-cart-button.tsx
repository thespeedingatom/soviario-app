"use client"

import { ShoppingCart } from "lucide-react"
import { NeoButton } from "@/components/ui/neo-button"
import { useCartStore } from "../store/cart-store" // Changed to useCartStore
import { CartItem } from "../types" // Import CartItem for type consistency

interface ProductData { // This interface can be simplified or aligned with CartItem
  id: string
  name: string
  duration: string
  price: number
  region?: string
  data?: string
}

interface AddToCartButtonProps {
  product: ProductData
  buttonProps?: {
    color?: "primary" | "secondary" | "accent" | "black" | "white"
    size?: "default" | "sm" | "lg" | "icon"
    className?: string
  }
}

export default function AddToCartButton({ product, buttonProps }: AddToCartButtonProps) {
  const { addItem } = useCartStore()

  const handleAddToCart = () => {
    const cartItem: CartItem = {
      id: product.id, // This should be the Shopify Variant ID
      name: product.name,
      price: product.price,
      quantity: 1,
      duration: product.duration,
      data: product.data,
      // region is not part of CartItem in types.ts, so it's omitted here
      // If region is needed in the cart, add it to CartItem type
    };
    addItem(cartItem)
  }

  return (
    <NeoButton
      className="w-full"
      size={buttonProps?.size || "lg"}
      color={buttonProps?.color || "primary"}
      onClick={handleAddToCart}
    >
      <ShoppingCart className="mr-2 h-5 w-5" />
      Add to Cart
    </NeoButton>
  )
}
