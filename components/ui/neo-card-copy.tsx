"use client"

import type React from "react"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { ArrowRight, Lock } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface NeoCardCopyProps { // Renamed from NeoCardProps
  title: string
  description?: string
  imageSrc?: string
  imageAlt?: string
  tags?: string[]
  link?: string
  color?: "blue" | "yellow" | "pink" | "green" | "purple" | "beige" | "red"
  classified?: boolean
  className?: string
  children?: React.ReactNode
}

export function NeoCardCopy({ // Renamed from NeoCard
  title,
  description,
  imageSrc,
  imageAlt = "Card image",
  tags = [],
  link,
  color = "blue",
  classified = false,
  className,
  children,
}: NeoCardCopyProps) { // Renamed from NeoCardProps
  const [isHovered, setIsHovered] = useState(false)

  const colorClasses = {
    blue: "bg-[#B8E3FF]",
    yellow: "bg-[#FFE566]",
    pink: "bg-[#FFBDBD]",
    green: "bg-[#C1FFBD]",
    purple: "bg-[#E0BDFF]",
    beige: "bg-[#F5E8C9]",
    red: "bg-[#FF6666] text-white",
  }

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
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {classified && (
        <div className="absolute right-3 top-3 z-10 flex items-center gap-1 rounded bg-red-600 px-2 py-1 text-xs font-bold text-white">
          <Lock className="h-3 w-3" />
          CLASSIFIED
        </div>
      )}

      <div className="relative h-48 w-full overflow-hidden border-b-4 border-black bg-gray-300">
        {imageSrc ? (
          <Image
            src={imageSrc || "/placeholder.svg"}
            alt={imageAlt}
            fill
            className={cn("object-cover transition-transform duration-500", isHovered ? "scale-110" : "scale-100")}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="text-gray-400">No image available</span>
          </div>
        )}
      </div>

      <div className={cn("flex flex-1 flex-col p-4", colorClasses[color])}>
        <h3 className="text-xl font-bold uppercase tracking-tight">{title}</h3>

        {description && <p className="mt-2 flex-1 text-sm">{description}</p>}

        {children && <div className="mt-2 flex-1">{children}</div>}

        {tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center rounded border-2 border-black bg-white px-2 py-1 text-xs font-bold"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {link && (
          <Link href={link} className="mt-4 inline-flex items-center font-bold uppercase hover:underline">
            VIEW DETAILS
            <motion.span initial={{ x: 0 }} animate={{ x: isHovered ? 5 : 0 }} transition={{ duration: 0.2 }}>
              <ArrowRight className="ml-1 h-4 w-4" />
            </motion.span>
          </Link>
        )}
      </div>
    </motion.div>
  )
}
