"use client"

import { createAuthClient } from "better-auth/react"

// Create the auth client
export const authClient = createAuthClient({
  // Optional configuration
  baseURL: process.env.NEXT_PUBLIC_SITE_URL,
})

// Export convenience methods for easier usage
export const { 
  signIn, 
  signUp, 
  signOut, 
  useSession,
  getSession,
  resetPassword
} = authClient
