"use client"

import type React from "react"
import { createContext, useContext } from "react"
import { authClient } from "@/lib/auth-client"

// Create a wrapper context to maintain compatibility with existing code
type AuthContextType = {
  user: { id: string; name: string; email: string; image?: string | null } | null
  session: {
    user: { id: string; name: string; email: string; image?: string | null }
    session: { id: string; [key: string]: any }
  } | null
  isPending: boolean
  signUp: (email: string, password: string, name: string, image?: string) => Promise<{ error?: any }>
  signIn: (email: string, password: string) => Promise<{ error?: any; data?: any }>
  signInWithGoogle: () => Promise<{ error?: any; data?: any }>
  signOut: () => Promise<void>
  resetPassword: (newPassword: string, token?: string) => Promise<{ error?: any }>
  sendVerificationEmail: (email: string) => Promise<{ error?: any }>
  isAuthenticated: () => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Create wrapper functions to maintain the same API
  const signUp = async (email: string, password: string, name: string, image?: string) => {
    try {
      const result = await authClient.signUp.email({
        email,
        password,
        name,
        image,
      })
      
      return { error: result.error }
    } catch (err) {
      console.error("Error in signUp:", err)
      return { error: err }
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      const result = await authClient.signIn.email({
        email,
        password,
      })

      if (result.error) {
        return { error: result.error }
      }

      return { error: null, data: result.data }
    } catch (err) {
      console.error("Error in signIn:", err)
      return { error: err }
    }
  }

  const signInWithGoogle = async () => {
    try {
      const result = await authClient.signIn.social({
        provider: "google",
      })

      if (result.error) {
        console.error("Google sign-in error:", result.error)
        return { error: result.error }
      }

      return { data: result.data }
    } catch (err) {
      console.error("Error in signInWithGoogle:", err)
      return { error: err }
    }
  }

  const signOutWrapper = async () => {
    try {
      await authClient.signOut()
    } catch (err) {
      console.error("Error in signOut:", err)
    }
  }

  const resetPasswordWrapper = async (newPassword: string, token?: string) => {
    try {
      const result = await authClient.resetPassword({
        newPassword,
        token,
      })
      return { error: result.error }
    } catch (err) {
      console.error("Error in resetPassword:", err)
      return { error: err }
    }
  }

  const sendVerificationEmail = async (email: string) => {
    try {
      const result = await authClient.sendVerificationEmail({
        email,
      })
      return { error: result.error }
    } catch (err) {
      console.error("Error in sendVerificationEmail:", err)
      return { error: err }
    }
  }

  // Use the Better Auth session hook
  const { data: session, isPending } = authClient.useSession()
  const user = session?.user || null

  const isAuthenticated = () => {
    return !!user && !!session
  }

  const value = {
    user,
    session,
    isPending,
    signUp,
    signIn,
    signInWithGoogle,
    signOut: signOutWrapper,
    resetPassword: resetPasswordWrapper,
    sendVerificationEmail,
    isAuthenticated,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

// Also export the direct Better Auth hooks for new code
export const useBetterAuth = authClient.useSession
