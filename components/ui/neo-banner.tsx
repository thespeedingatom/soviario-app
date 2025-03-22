"use client"

import type React from "react"

import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

interface NeoBannerProps {
  children: React.ReactNode
  className?: string
  color?: "red" | "blue" | "yellow" | "green" | "purple" | "black"
}

export function NeoBanner({ children, className, color = "black" }: NeoBannerProps) {
  const colorClasses = {
    red: "bg-red-600 text-white",
    blue: "bg-blue-600 text-white",
    green: "bg-green-600 text-white",
    yellow: "bg-yellow-400 text-black",
    purple: "bg-purple-600 text-white",
    black: "bg-black text-white",
  }

  return (
    <motion.div
      className={cn(
        "border-y-4 border-black px-4 py-2 font-bold uppercase tracking-wider",
        colorClasses[color],
        className,
      )}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-center overflow-hidden whitespace-nowrap">
        <motion.div
          animate={{ x: ["0%", "-100%"] }}
          transition={{
            x: {
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "loop",
              duration: 20,
              ease: "linear",
            },
          }}
          className="flex"
        >
          <span className="mx-4">{children}</span>
          <span className="mx-4">{children}</span>
          <span className="mx-4">{children}</span>
          <span className="mx-4">{children}</span>
          <span className="mx-4">{children}</span>
        </motion.div>
      </div>
    </motion.div>
  )
}

