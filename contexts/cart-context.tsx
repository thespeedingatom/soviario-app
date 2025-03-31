"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { toast } from "@/components/ui/use-toast"

export type CartItem = {
  id: string
  name: string
  duration: string
  price: number
  quantity: number
  region?: string
  data?: string
  slug: string // Add slug property
}

type CartContextType = {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  subtotal: number
  discount: number
  applyPromoCode: (code: string) => boolean
  removePromoCode: () => void
  promoCode: string | null
  itemCount: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

// Valid promo codes and their discount percentages
const PROMO_CODES: Record<string, number> = {
  TRAVEL10: 0.1, // 10% off
  WELCOME15: 0.15, // 15% off
  SUMMER20: 0.2, // 20% off
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [promoCode, setPromoCode] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  // Calculate derived values
  const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0)
  const discountRate = promoCode ? PROMO_CODES[promoCode] || 0 : 0
  const discount = subtotal * discountRate
  const itemCount = items.reduce((count, item) => count + item.quantity, 0)

  // Load cart from localStorage on mount
  useEffect(() => {
    const storedCart = localStorage.getItem("cart")
    const storedPromoCode = localStorage.getItem("promoCode")

    if (storedCart) {
      try {
        setItems(JSON.parse(storedCart))
      } catch (error) {
        console.error("Failed to parse cart from localStorage:", error)
      }
    }

    if (storedPromoCode) {
      setPromoCode(storedPromoCode)
    }

    setMounted(true)
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (mounted) {
      localStorage.setItem("cart", JSON.stringify(items))
    }
  }, [items, mounted])

  // Save promo code to localStorage whenever it changes
  useEffect(() => {
    if (mounted) {
      if (promoCode) {
        localStorage.setItem("promoCode", promoCode)
      } else {
        localStorage.removeItem("promoCode")
      }
    }
  }, [promoCode, mounted])

  // Add item to cart
  const addItem = (newItem: CartItem) => {
    setItems((prevItems) => {
      // Check if item already exists in cart
      const existingItemIndex = prevItems.findIndex((item) => item.id === newItem.id)

      if (existingItemIndex > -1) {
        // Update quantity if item exists
        const updatedItems = [...prevItems]
        updatedItems[existingItemIndex].quantity += newItem.quantity

        toast({
          title: "Cart updated",
          description: `${newItem.name} quantity increased to ${updatedItems[existingItemIndex].quantity}`,
        })

        return updatedItems
      } else {
        // Add new item if it doesn't exist
        toast({
          title: "Added to cart",
          description: `${newItem.name} added to your cart`,
        })

        return [...prevItems, newItem]
      }
    })
  }

  // Remove item from cart
  const removeItem = (id: string) => {
    setItems((prevItems) => {
      const itemToRemove = prevItems.find((item) => item.id === id)
      if (itemToRemove) {
        toast({
          title: "Removed from cart",
          description: `${itemToRemove.name} removed from your cart`,
        })
      }
      return prevItems.filter((item) => item.id !== id)
    })
  }

  // Update item quantity
  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) return

    setItems((prevItems) => prevItems.map((item) => (item.id === id ? { ...item, quantity } : item)))
  }

  // Clear cart
  const clearCart = () => {
    setItems([])
    setPromoCode(null)
    toast({
      title: "Cart cleared",
      description: "All items have been removed from your cart",
    })
  }

  // Apply promo code
  const applyPromoCode = (code: string): boolean => {
    const normalizedCode = code.toUpperCase()
    if (PROMO_CODES[normalizedCode]) {
      setPromoCode(normalizedCode)
      const discountPercent = PROMO_CODES[normalizedCode] * 100
      toast({
        title: "Promo code applied",
        description: `${discountPercent}% discount has been applied to your order`,
      })
      return true
    } else {
      toast({
        title: "Invalid promo code",
        description: "The promo code you entered is invalid or expired",
        variant: "destructive",
      })
      return false
    }
  }

  // Remove promo code
  const removePromoCode = () => {
    setPromoCode(null)
    toast({
      title: "Promo code removed",
      description: "The promo code has been removed from your order",
    })
  }

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        subtotal,
        discount,
        applyPromoCode,
        removePromoCode,
        promoCode,
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
