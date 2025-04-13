"use client"

import type React from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/contexts/AuthContext"
import { CartProvider } from "@/contexts/cart-context"
import { Toaster } from "@/components/ui/toaster"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <AuthProvider>
        <CartProvider>
          {children}
          <Toaster />
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

