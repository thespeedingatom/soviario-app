type EventOptions = {
  // Define properties that can be tracked with events
  value?: number
  category?: string
  label?: string
  [key: string]: any
}

/**
 * Track custom events with Vercel Analytics
 */
export function trackEvent(eventName: string, options?: EventOptions) {
  // Check if window and vercelAnalytics are available (client-side only)
  if (typeof window !== "undefined" && "va" in window) {
    // @ts-ignore - Vercel Analytics adds 'va' to the window object
    window.va?.event(eventName, options)
  }
}

/**
 * Track page views manually
 */
export function trackPageView(url: string) {
  if (typeof window !== "undefined" && "va" in window) {
    // @ts-ignore - Vercel Analytics adds 'va' to the window object
    window.va?.track("pageview", { url })
  }
}

