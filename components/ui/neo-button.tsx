"use client"

import type React from "react"

import { forwardRef } from "react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { Slot } from "@radix-ui/react-slot"

interface NeoButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
  color?: "primary" | "secondary" | "accent" | "black" | "white"
  asChild?: boolean
  className?: string
}

const NeoButton = forwardRef<HTMLButtonElement, NeoButtonProps>(
  ({ className, variant = "default", size = "default", color = "primary", asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : motion.button

    const variantClasses = {
      default: "border-4 border-black bg-primary text-white",
      outline: "border-4 border-black bg-white",
      ghost: "border-0 bg-transparent hover:bg-gray-100",
      link: "border-0 bg-transparent underline-offset-4 hover:underline",
    }

    const sizeClasses = {
      default: "h-12 px-6 py-3 text-base",
      sm: "h-9 px-4 py-2 text-sm",
      lg: "h-14 px-8 py-4 text-lg",
      icon: "h-12 w-12 p-3",
    }

    const colorClasses = {
      primary: variant === "default" ? "bg-primary text-white" : "text-primary",
      secondary: variant === "default" ? "bg-secondary text-black" : "text-secondary",
      accent: variant === "default" ? "bg-accent text-black" : "text-accent",
      black: variant === "default" ? "bg-black text-white" : "text-black",
      white: variant === "default" ? "bg-white text-black" : "text-white",
    }

    return (
      <Comp
        className={cn(
          "relative inline-flex items-center justify-center whitespace-nowrap rounded-none font-bold uppercase tracking-wide focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          variantClasses[variant],
          sizeClasses[size],
          colorClasses[color],
          className,
        )}
        ref={ref}
        {...props}
        whileTap={{
          scale: 0.95,
          boxShadow: "0px 0px 0px 0px rgba(0,0,0,1)",
          translateY: variant === "default" || variant === "outline" ? 4 : 0,
          translateX: variant === "default" || variant === "outline" ? 4 : 0,
        }}
        whileHover={{
          boxShadow: variant === "default" || variant === "outline" ? "6px 6px 0px 0px rgba(0,0,0,1)" : "none",
          translateY: variant === "default" || variant === "outline" ? -2 : 0,
          translateX: variant === "default" || variant === "outline" ? -2 : 0,
        }}
        initial={{
          boxShadow: variant === "default" || variant === "outline" ? "4px 4px 0px 0px rgba(0,0,0,1)" : "none",
        }}
        transition={{ duration: 0.1 }}
      />
    )
  },
)
NeoButton.displayName = "NeoButton"

export { NeoButton }

