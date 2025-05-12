"use client"

import type React from "react"
import { ThemeProvider } from "@/components/theme-provider"
// import { AuthProvider } from "@/contexts/auth-context" // Old auth provider removed
import { ShopifyAuthProvider } from "@/contexts/shopify-auth-context" // New Shopify auth provider
// import { CartProvider } from "@/contexts/cart-context" // CartProvider removed, Zustand store is used instead
import { Toaster } from "@/components/ui/toaster"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <ShopifyAuthProvider>
        {/* CartProvider is removed as Zustand handles cart state globally */}
        {children}
        <Toaster />
      </ShopifyAuthProvider>
    </ThemeProvider>
  )
}
