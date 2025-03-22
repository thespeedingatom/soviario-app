"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getSupabaseBrowserClient } from "@/lib/supabase"
import { NeoCardPlain } from "@/components/ui/neo-card-plain"
import { NeoAlert } from "@/components/ui/neo-alert"

export default function AuthCallbackPage() {
  const router = useRouter()
  const supabase = getSupabaseBrowserClient()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get the session
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession()

        if (sessionError) {
          console.error("Error getting auth session:", sessionError.message)

          // Check for OAuth configuration errors
          if (
            sessionError.message.includes("OAuth") ||
            sessionError.message.includes("provider") ||
            sessionError.message.includes("secret")
          ) {
            setError("OAuth configuration error: " + sessionError.message)
            setTimeout(() => router.push("/auth/sign-in?error=oauth_config"), 3000)
            return
          }

          setError("Unable to authenticate with provider. Please try again.")
          setTimeout(() => router.push("/auth/sign-in?error=Authentication failed"), 3000)
          return
        }

        if (!session) {
          setError("No session found. Please try signing in again.")
          setTimeout(() => router.push("/auth/sign-in"), 3000)
          return
        }

        // Redirect to dashboard after successful authentication
        router.push("/dashboard")
      } catch (err) {
        console.error("Error in auth callback:", err)
        setError("An unexpected error occurred. Please try again.")
        setTimeout(() => router.push("/auth/sign-in"), 3000)
      }
    }

    handleAuthCallback()
  }, [router, supabase.auth])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <NeoCardPlain>
        <div className="p-8 text-center">
          {error ? (
            <>
              <h2 className="text-2xl font-bold text-red-600">Authentication Error</h2>
              <NeoAlert variant="error" className="mt-4">
                {error}
              </NeoAlert>
              <p className="mt-4 text-muted-foreground">Redirecting you back to the sign-in page...</p>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold">Authenticating...</h2>
              <p className="mt-2 text-muted-foreground">Please wait while we complete your sign-in.</p>
              <div className="mt-4 flex justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-black"></div>
              </div>
            </>
          )}
        </div>
      </NeoCardPlain>
    </div>
  )
}

