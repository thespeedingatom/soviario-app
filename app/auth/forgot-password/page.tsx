"use client"

import type React from "react"

import { useState, useRef } from "react"
import { NeoButton } from "@/components/ui/neo-button"
import { NeoCardPlain } from "@/components/ui/neo-card-plain"
import { NeoBanner } from "@/components/ui/neo-banner"
import { NeoInput } from "@/components/ui/neo-input"
import { NeoAlert } from "@/components/ui/neo-alert"
import { Mail, ArrowLeft, Send } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { useEffect } from "react"

export default function ForgotPasswordPage() {
  const { resetPassword } = useAuth()
  const isMounted = useRef(true)

  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMounted.current = false
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const { error: resetError } = await resetPassword(email)

      if (resetError) {
        throw resetError
      }

      if (isMounted.current) {
        setIsSubmitted(true)
      }
    } catch (err: any) {
      console.error("Password reset error:", err)
      if (isMounted.current) {
        setError(err.message || "An error occurred. Please try again.")
      }
    } finally {
      if (isMounted.current) {
        setIsLoading(false)
      }
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
                  <h1 className="mt-4 text-3xl font-black uppercase tracking-tight">FORGOT PASSWORD</h1>
                  <div className="mx-auto mt-2 h-1 w-16 bg-[#FF6666]"></div>
                  <p className="mt-4 text-muted-foreground">
                    Enter your email address and we'll send you a link to reset your password.
                  </p>
                </div>

                {error && (
                  <div className="mt-6">
                    <NeoAlert variant="error" dismissible>
                      {error}
                    </NeoAlert>
                  </div>
                )}

                {isSubmitted ? (
                  <div className="mt-8">
                    <NeoAlert variant="success" title="Check Your Email">
                      We've sent a password reset link to <strong>{email}</strong>. Please check your inbox and follow
                      the instructions to reset your password.
                    </NeoAlert>

                    <div className="mt-8 text-center">
                      <Link href="/auth/sign-in">
                        <NeoButton variant="outline">
                          <ArrowLeft className="mr-2 h-5 w-5" />
                          Back to Sign In
                        </NeoButton>
                      </Link>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                    <NeoInput
                      label="Email Address"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      inputClassName="pl-10"
                    />
                    <div className="relative">
                      <Mail className="absolute left-4 top-[42px] h-5 w-5 text-gray-400" />
                    </div>

                    <div>
                      <NeoButton type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? (
                          "Sending..."
                        ) : (
                          <>
                            <Send className="mr-2 h-5 w-5" />
                            Send Reset Link
                          </>
                        )}
                      </NeoButton>
                    </div>

                    <div className="text-center">
                      <Link href="/auth/sign-in" className="text-sm hover:underline">
                        <ArrowLeft className="mr-1 inline-block h-4 w-4" />
                        Back to Sign In
                      </Link>
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

