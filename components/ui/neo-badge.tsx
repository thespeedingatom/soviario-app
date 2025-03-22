"use client"

import type React from "react"

import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

interface NeoBadgeProps {
  children: React.ReactNode
  color?: "red" | "blue" | "green" | "yellow" | "purple" | "black"
  variant?: "filled" | "outline"
  size?: "sm" | "default" | "lg"
  className?: string
}

export function NeoBadge({
  children,
  color = "black",
  variant = "filled",
  size = "default",
  className,
}: NeoBadgeProps) {
  const colorClasses = {
    red: variant === "filled" ? "bg-red-600 text-white" : "border-red-600 text-red-600",
    blue: variant === "filled" ? "bg-blue-600 text-white" : "border-blue-600 text-blue-600",
    green: variant === "filled" ? "bg-green-600 text-black" : "border-green-600 text-green-600",
    yellow: variant === "filled" ? "bg-yellow-400 text-black" : "border-yellow-400 text-yellow-600",
    purple: variant === "filled" ? "bg-purple-600 text-white" : "border-purple-600 text-purple-600",
    black: variant === "filled" ? "bg-black text-white" : "border-black text-black",
  }

  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs",
    default: "px-2.5 py-1 text-sm",
    lg: "px-3 py-1.5 text-base",
  }

  return (
    <motion.span
      className={cn(
        "inline-flex items-center justify-center font-bold uppercase",
        variant === "outline" ? "border-2" : "",
        colorClasses[color],
        sizeClasses[size],
        className,
      )}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.span>
  )
}

