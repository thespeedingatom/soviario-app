"use client"

import { ShoppingCart } from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useState } from "react"

export function CartIcon() {
  const { itemCount } = useCart()
  const [isAnimating, setIsAnimating] = useState(false)
  const [prevCount, setPrevCount] = useState(itemCount)

  // Trigger animation when item count changes
  useEffect(() => {
    if (itemCount > prevCount) {
      setIsAnimating(true)
      const timer = setTimeout(() => setIsAnimating(false), 1000)
      return () => clearTimeout(timer)
    }
    setPrevCount(itemCount)
  }, [itemCount, prevCount])

  return (
    <Link href="/cart">
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
    </Link>
  )
}

