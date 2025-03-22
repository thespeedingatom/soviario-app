import type React from "react"
import { cn } from "@/lib/utils"

interface NeoGridProps {
  children: React.ReactNode
  columns?: 1 | 2 | 3 | 4
  gap?: "sm" | "md" | "lg"
  className?: string
}

export function NeoGrid({ children, columns = 3, gap = "md", className }: NeoGridProps) {
  const columnsClasses = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
  }

  const gapClasses = {
    sm: "gap-4",
    md: "gap-6",
    lg: "gap-8",
  }

  return <div className={cn("grid", columnsClasses[columns], gapClasses[gap], className)}>{children}</div>
}

