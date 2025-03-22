"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState, useRef } from "react"
import type { User, Session } from "@supabase/supabase-js"
import { getSupabaseBrowserClient } from "@/lib/supabase"

type AuthContextType = {
  user: User | null
  session: Session | null
  isLoading: boolean
  signUp: (email: string, password: string, metadata?: any) => Promise<{ error: any }>
  signIn: (email: string, password: string) => Promise<{ error: any; data?: any }>
  signInWithGoogle: () => Promise<{ error: any; data?: any }>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<{ error: any }>
  resendVerificationEmail: (email: string) => Promise<{ error: any }>
  isAuthenticated: () => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const isMounted = useRef(true)
  const supabase = getSupabaseBrowserClient()

  useEffect(() => {
    // Set isMounted to true when the component mounts
    isMounted.current = true

    const fetchSession = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession()

        if (error) {
          console.error("Error fetching session:", error)
        }

        // Only update state if the component is still mounted
        if (isMounted.current) {
          setSession(session)
          setUser(session?.user || null)
          setIsLoading(false)
        }
      } catch (err) {
        console.error("Error in fetchSession:", err)
        if (isMounted.current) {
          setIsLoading(false)
        }
      }
    }

    fetchSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (isMounted.current) {
        setSession(session)
        setUser(session?.user || null)
        setIsLoading(false)
      }
    })

    // Cleanup function to prevent memory leaks
    return () => {
      isMounted.current = false
      subscription.unsubscribe()
    }
  }, [])

  const signUp = async (email: string, password: string, metadata?: any) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
        },
      })
      return { error }
    } catch (err) {
      console.error("Error in signUp:", err)
      return { error: err }
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        return { error }
      }

      // Explicitly update the user and session state
      if (isMounted.current) {
        setUser(data.user)
        setSession(data.session)
      }

      return { error: null, data }
    } catch (err) {
      console.error("Error in signIn:", err)
      return { error: err }
    }
  }

  const signInWithGoogle = async () => {
    try {
      // Check if the required environment variables are set
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        console.error("Missing Supabase environment variables")
        return {
          error: {
            message: "Authentication configuration error. Please contact support.",
          },
        }
      }

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
        },
      })

      if (error) {
        console.error("Google sign-in error:", error)
        return { error }
      }

      return { data }
    } catch (err) {
      console.error("Error in signInWithGoogle:", err)
      return { error: err }
    }
  }

  const signOut = async () => {
    try {
      await supabase.auth.signOut()
    } catch (err) {
      console.error("Error in signOut:", err)
    }
  }

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/reset-password`,
      })
      return { error }
    } catch (err) {
      console.error("Error in resetPassword:", err)
      return { error: err }
    }
  }

  const resendVerificationEmail = async (email: string) => {
    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email,
      })
      return { error }
    } catch (err) {
      console.error("Error in resendVerificationEmail:", err)
      return { error: err }
    }
  }

  const isAuthenticated = () => {
    return !!user && !!session
  }

  const value = {
    user,
    session,
    isLoading,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    resetPassword,
    resendVerificationEmail,
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

