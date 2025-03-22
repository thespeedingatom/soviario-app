"use client"

import { ShoppingCart } from "lucide-react"
import { NeoButton } from "@/components/ui/neo-button"
import { useCart } from "@/contexts/cart-context"
import { trackEvent } from "@/lib/analytics"

interface ProductData {
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
  const { addItem } = useCart()

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      duration: product.duration,
      price: product.price,
      quantity: 1,
      region: product.region,
      data: product.data,
    })

    // Track add to cart event
    trackEvent("add_to_cart", {
      product_id: product.id,
      product_name: product.name,
      value: product.price,
      currency: "USD",
      region: product.region || "unknown",
    })
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

