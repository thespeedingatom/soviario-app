"use client"

import type React from "react"

import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { forwardRef, useState } from "react"

export interface NeoInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  className?: string
  inputClassName?: string
}

const NeoInput = forwardRef<HTMLInputElement, NeoInputProps>(
  ({ className, label, error, inputClassName, ...props }, ref) => {
    const [focused, setFocused] = useState(false)

    return (
      <div className={cn("space-y-2", className)}>
        {label && (
          <label htmlFor={props.id} className="block font-bold uppercase">
            {label}
          </label>
        )}

        <motion.div
          className="relative"
          animate={{
            boxShadow: focused ? "6px 6px 0px 0px rgba(0,0,0,1)" : "4px 4px 0px 0px rgba(0,0,0,1)",
            translateY: focused ? -2 : 0,
            translateX: focused ? -2 : 0,
          }}
          transition={{ duration: 0.2 }}
        >
          <input
            className={cn(
              "w-full border-4 border-black bg-white px-4 py-3 font-medium focus:outline-none",
              error && "border-red-600",
              inputClassName,
            )}
            ref={ref}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            {...props}
          />
        </motion.div>

        {error && <p className="text-sm font-medium text-red-600">{error}</p>}
      </div>
    )
  },
)
NeoInput.displayName = "NeoInput"

export { NeoInput }

