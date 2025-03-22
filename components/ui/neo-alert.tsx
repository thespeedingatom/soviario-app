"use client"

import type React from "react"

import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { AlertCircle, CheckCircle, Info, X } from "lucide-react"
import { useState } from "react"

interface NeoAlertProps {
  title?: string
  children: React.ReactNode
  variant?: "info" | "warning" | "error" | "success"
  className?: string
  dismissible?: boolean
}

export function NeoAlert({ title, children, variant = "info", className, dismissible = false }: NeoAlertProps) {
  const [dismissed, setDismissed] = useState(false)

  if (dismissed) return null

  const variantClasses = {
    info: "bg-blue-100 border-blue-600",
    warning: "bg-yellow-100 border-yellow-600",
    error: "bg-red-100 border-red-600",
    success: "bg-green-100 border-green-600",
  }

  const variantIcon = {
    info: <Info className="h-5 w-5 text-blue-600" />,
    warning: <AlertCircle className="h-5 w-5 text-yellow-600" />,
    error: <AlertCircle className="h-5 w-5 text-red-600" />,
    success: <CheckCircle className="h-5 w-5 text-green-600" />,
  }

  return (
    <motion.div
      className={cn("relative border-4 border-black p-4", variantClasses[variant], className)}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5">{variantIcon[variant]}</div>
        <div className="flex-1">
          {title && <div className="font-bold uppercase">{title}</div>}
          <div className={title ? "mt-1" : ""}>{children}</div>
        </div>

        {dismissible && (
          <button onClick={() => setDismissed(true)} className="rounded-full p-1 hover:bg-black/10">
            <X className="h-5 w-5" />
            <span className="sr-only">Dismiss</span>
          </button>
        )}
      </div>
    </motion.div>
  )
}

