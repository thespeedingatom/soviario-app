"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { NeoButton } from "@/components/ui/neo-button"
import { NeoCardPlain } from "@/components/ui/neo-card-plain"
import { NeoBanner } from "@/components/ui/neo-banner"
import { NeoInput } from "@/components/ui/neo-input"
import { NeoAlert } from "@/components/ui/neo-alert"
import { Lock, Save } from "lucide-react"
import { getSupabaseBrowserClient } from "@/lib/supabase"

export default function ResetPasswordPage() {
  const router = useRouter()
  const supabase = getSupabaseBrowserClient()

  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  // Check if we have a hash in the URL (from the reset password email)
  useEffect(() => {
    const checkHashParams = async () => {
      const hash = window.location.hash
      if (hash && hash.includes("type=recovery")) {
        // Hash exists, we're in a recovery flow
        const { data, error } = await supabase.auth.getSession()

        if (error || !data.session) {
          setError("Invalid or expired recovery link. Please try again.")
        }
      } else {
        // No hash, redirect to forgot password
        router.push("/auth/forgot-password")
      }
    }

    checkHashParams()
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Validate passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    // Validate password strength
    if (password.length < 8) {
      setError("Password must be at least 8 characters long")
      return
    }

    setIsLoading(true)

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password,
      })

      if (updateError) {
        throw updateError
      }

      setIsSuccess(true)

      // Redirect to sign-in after 3 seconds
      setTimeout(() => {
        router.push("/auth/sign-in")
      }, 3000)
    } catch (err: any) {
      console.error("Password update error:", err)
      setError(err.message || "An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col">
      <NeoBanner color="pink">PASSWORD RESET • ACCOUNT RECOVERY • SECURE ACCESS</NeoBanner>

      <section className="py-16">
        <div className="container">
          <div className="mx-auto max-w-md">
            <NeoCardPlain>
              <div className="p-8">
                <div className="text-center">
                  <div className="inline-block bg-black px-4 py-2 text-sm font-bold uppercase text-white">ACCOUNT</div>
                  <h1 className="mt-4 text-3xl font-black uppercase tracking-tight">RESET PASSWORD</h1>
                  <div className="mx-auto mt-2 h-1 w-16 bg-[#FF6666]"></div>
                  <p className="mt-4 text-muted-foreground">Enter your new password below.</p>
                </div>

                {error && (
                  <div className="mt-6">
                    <NeoAlert variant="error" dismissible>
                      {error}
                    </NeoAlert>
                  </div>
                )}

                {isSuccess ? (
                  <div className="mt-8">
                    <NeoAlert variant="success" title="Password Updated">
                      Your password has been successfully updated. You will be redirected to the sign-in page.
                    </NeoAlert>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                    <NeoInput
                      label="New Password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      inputClassName="pl-10"
                    />
                    <div className="relative">
                      <Lock className="absolute left-4 top-[42px] h-5 w-5 text-gray-400" />
                    </div>

                    <NeoInput
                      label="Confirm New Password"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      inputClassName="pl-10"
                    />
                    <div className="relative">
                      <Lock className="absolute left-4 top-[42px] h-5 w-5 text-gray-400" />
                    </div>

                    <div>
                      <NeoButton type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? (
                          "Updating Password..."
                        ) : (
                          <>
                            <Save className="mr-2 h-5 w-5" />
                            Update Password
                          </>
                        )}
                      </NeoButton>
                    </div>
                  </form>
                )}
              </div>
            </NeoCardPlain>
          </div>
        </div>
      </section>

      <NeoBanner color="black">SECURE CONNECTION • ENCRYPTED DATA • PRIVACY FIRST</NeoBanner>
    </div>
  )
}

