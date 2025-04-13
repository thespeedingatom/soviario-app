"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { getSupabaseBrowserClient } from "@/lib/supabase"
import { NeoButton } from "@/components/ui/neo-button"
import { NeoCardPlain } from "@/components/ui/neo-card-plain"
import { NeoBanner } from "@/components/ui/neo-banner"
import Link from "next/link"

export default function AuthDebugPage() {
  const { user, session, isLoading } = useAuth()
  const [cookieInfo, setCookieInfo] = useState<string>("Loading...")
  const [localStorageInfo, setLocalStorageInfo] = useState<string>("Loading...")
  const supabase = getSupabaseBrowserClient()

  useEffect(() => {
    // Check cookies
    setCookieInfo(document.cookie || "No cookies found")

    // Check localStorage
    try {
      const authData = localStorage.getItem("soravio-auth-token")
      setLocalStorageInfo(authData ? "Auth data found in localStorage" : "No auth data in localStorage")
    } catch (error) {
      setLocalStorageInfo("Error accessing localStorage")
    }
  }, [])

  const refreshSession = async () => {
    try {
      const { data, error } = await supabase.auth.refreshSession()
      if (error) {
        console.error("Error refreshing session:", error)
        alert(`Error refreshing session: ${error.message}`)
      } else {
        alert("Session refreshed successfully")
        window.location.reload()
      }
    } catch (error) {
      console.error("Error in refreshSession:", error)
      alert(`Error in refreshSession: ${error}`)
    }
  }

  return (
    <div className="flex flex-col">
      <NeoBanner color="blue">AUTH DEBUG • TROUBLESHOOTING • DIAGNOSTICS</NeoBanner>

      <section className="py-16">
        <div className="container">
          <div className="mx-auto max-w-3xl">
            <NeoCardPlain>
              <div className="p-8">
                <div className="text-center">
                  <div className="inline-block bg-black px-4 py-2 text-sm font-bold uppercase text-white">
                    AUTH DEBUG
                  </div>
                  <h1 className="mt-4 text-3xl font-black uppercase tracking-tight">AUTHENTICATION DIAGNOSTICS</h1>
                  <div className="mx-auto mt-2 h-1 w-16 bg-[#FF6666]"></div>
                </div>

                <div className="mt-8 space-y-6">
                  <div>
                    <h2 className="text-xl font-bold">Auth Context State</h2>
                    <div className="mt-2 rounded-md bg-gray-100 p-4">
                      <p>
                        <strong>Loading:</strong> {isLoading ? "True" : "False"}
                      </p>
                      <p>
                        <strong>User:</strong> {user ? `${user.email} (${user.id})` : "Not logged in"}
                      </p>
                      <p>
                        <strong>Session:</strong> {session ? "Active" : "None"}
                      </p>
                      <p>
                        <strong>Session Expires:</strong>{" "}
                        {session?.expires_at ? new Date(session.expires_at * 1000).toLocaleString() : "N/A"}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h2 className="text-xl font-bold">Cookie Information</h2>
                    <div className="mt-2 rounded-md bg-gray-100 p-4 overflow-auto max-h-40">
                      <pre>{cookieInfo}</pre>
                    </div>
                  </div>

                  <div>
                    <h2 className="text-xl font-bold">LocalStorage Information</h2>
                    <div className="mt-2 rounded-md bg-gray-100 p-4">
                      <p>{localStorageInfo}</p>
                    </div>
                  </div>

                  <div className="flex justify-center space-x-4">
                    <NeoButton onClick={refreshSession}>Refresh Session</NeoButton>
                    <Link href="/dashboard">
                      <NeoButton variant="outline">Try Dashboard</NeoButton>
                    </Link>
                    <Link href="/auth/sign-in">
                      <NeoButton variant="outline">Go to Sign In</NeoButton>
                    </Link>
                  </div>
                </div>
              </div>
            </NeoCardPlain>
          </div>
        </div>
      </section>

      <NeoBanner color="black">TROUBLESHOOTING • DIAGNOSTICS • DEBUGGING</NeoBanner>
    </div>
  )
}

