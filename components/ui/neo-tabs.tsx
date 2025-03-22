"use client"

import type React from "react"

import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { useState } from "react"

interface NeoTabsProps {
  tabs: {
    id: string
    label: string
    content: React.ReactNode
  }[]
  defaultTab?: string
  className?: string
  tabsClassName?: string
  contentClassName?: string
}

export function NeoTabs({ tabs, defaultTab, className, tabsClassName, contentClassName }: NeoTabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id)

  return (
    <div className={cn("space-y-4", className)}>
      <div className={cn("flex flex-wrap gap-2 border-4 border-black bg-white p-2", tabsClassName)}>
        {tabs.map((tab) => (
          <motion.button
            key={tab.id}
            className={cn(
              "px-4 py-2 font-bold uppercase",
              activeTab === tab.id ? "bg-black text-white" : "bg-white text-black hover:bg-gray-100",
            )}
            onClick={() => setActiveTab(tab.id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.1 }}
          >
            {tab.label}
          </motion.button>
        ))}
      </div>

      <div className={cn("border-4 border-black bg-white p-6", contentClassName)}>
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={cn(
              "transition-opacity duration-300",
              activeTab === tab.id ? "block opacity-100" : "hidden opacity-0",
            )}
          >
            {tab.content}
          </div>
        ))}
      </div>
    </div>
  )
}

