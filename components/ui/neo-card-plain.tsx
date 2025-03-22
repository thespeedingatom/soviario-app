"use client"

import type React from "react"

import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

interface NeoCardPlainProps {
  className?: string
  children?: React.ReactNode
}

export function NeoCardPlain({ className, children }: NeoCardPlainProps) {
  return (
    <motion.div
      className={cn("group relative flex flex-col overflow-hidden border-4 border-black bg-white", className)}
      initial={{ boxShadow: "8px 8px 0px 0px rgba(0,0,0,1)" }}
      whileHover={{
        boxShadow: "12px 12px 0px 0px rgba(0,0,0,1)",
        translateY: -4,
        translateX: -4,
      }}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.div>
  )
}

