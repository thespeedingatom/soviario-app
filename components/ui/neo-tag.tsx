"use client"

import type React from "react"

import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

interface NeoTagProps {
  children: React.ReactNode
  active?: boolean
  className?: string
  onClick?: () => void
}

export function NeoTag({ children, active = false, className, onClick }: NeoTagProps) {
  return (
    <motion.button
      className={cn(
        "inline-flex items-center justify-center rounded-none border-2 border-black bg-white px-3 py-1 text-sm font-bold uppercase",
        active && "bg-black text-white",
        onClick && "cursor-pointer",
        className,
      )}
      whileHover={{
        scale: 1.05,
        boxShadow: "2px 2px 0px 0px rgba(0,0,0,1)",
      }}
      whileTap={{
        scale: 0.95,
        boxShadow: "0px 0px 0px 0px rgba(0,0,0,1)",
      }}
      transition={{ duration: 0.1 }}
      onClick={onClick}
    >
      {children}
    </motion.button>
  )
}

