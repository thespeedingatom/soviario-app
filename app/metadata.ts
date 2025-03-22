import type { Metadata } from "next"

export const defaultMetadata: Metadata = {
  title: {
    default: "Sovario eSIM | Global Connectivity Made Simple",
    template: "%s | Sovario eSIM",
  },
  description: "Travel the world with affordable eSIM plans. Instant activation, no physical SIM needed.",
  keywords: ["eSIM", "travel", "data plan", "international", "roaming", "mobile data"],
  authors: [{ name: "Sovario" }],
  creator: "Sovario",
  publisher: "Sovario",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
}

