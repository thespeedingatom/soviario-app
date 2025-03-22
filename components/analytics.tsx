"use client"

import { usePathname, useSearchParams } from "next/navigation"
import { Analytics as VercelAnalytics } from "@vercel/analytics/react"
import { useEffect } from "react"

export function Analytics() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Track page views when the path changes
    const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : "")

    // You can add custom tracking logic here if needed
    console.log(`Page view: ${url}`)
  }, [pathname, searchParams])

  return <VercelAnalytics />
}

