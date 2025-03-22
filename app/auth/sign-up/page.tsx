"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { NeoButton } from "@/components/ui/neo-button"
import { NeoCardPlain } from "@/components/ui/neo-card-plain"
import { NeoBanner } from "@/components/ui/neo-banner"
import { NeoInput } from "@/components/ui/neo-input"
import { NeoAlert } from "@/components/ui/neo-alert"
import { Mail, Lock, User, UserPlus } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { GoogleSignInButton } from "@/components/google-sign-in-button"

export default function SignUpPage() {
  const router = useRouter()
  const { signUp, user, isLoading: authLoading } = useAuth()
  const isMounted = useRef(true)

  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // Check if user is already logged in
  useEffect(() => {
    if (!authLoading && user) {
      router.push("/dashboard")
    }

    return () => {
      isMounted.current = false
    }
  }, [user, router, authLoading])

  const validateForm = () => {
    if (!firstName.trim()) {
      setError("First name is required")
      return false
    }

    if (!lastName.trim()) {
      setError("Last name is required")
      return false
    }

    if (!email.trim()) {
      setError("Email is required")
      return false
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address")
      return false
    }

    if (!password) {
      setError("Password is required")
      return false
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long")
      return false
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      const { error: signUpError } = await signUp(email, password, {
        first_name: firstName,
        last_name: lastName,
        full_name: `${firstName} ${lastName}`,
      })

      if (signUpError) {
        throw signUpError
      }

      // Redirect to sign-in page with success message
      router.push("/auth/sign-in?registered=true")
    } catch (err: any) {
      console.error("Sign up error:", err)
      if (isMounted.current) {
        setError(err.message || "Failed to create account. Please try again.")
      }
    } finally {
      if (isMounted.current) {
        setIsLoading(false)
      }
    }
  }

  return (
    <div className="flex flex-col">
      <NeoBanner color="blue">CREATE ACCOUNT • SECURE SIGNUP • JOIN SOVARIO</NeoBanner>

      <section className="py-16">
        <div className="container">
          <div className="mx-auto max-w-md">
            <NeoCardPlain>
              <div className="p-8">
                <div className="text-center">
                  <div className="inline-block bg-black px-4 py-2 text-sm font-bold uppercase text-white">ACCOUNT</div>
                  <h1 className="mt-4 text-3xl font-black uppercase tracking-tight">SIGN UP</h1>
                  <div className="mx-auto mt-2 h-1 w-16 bg-[#FF6666]"></div>
                  <p className="mt-4 text-muted-foreground">Create an account to get started with Sovario eSIM.</p>
                </div>

                {error && (
                  <div className="mt-6">
                    <NeoAlert variant="error" dismissible>
                      {error}
                    </NeoAlert>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <NeoInput
                        label="First Name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                        inputClassName="pl-10"
                      />
                      <div className="relative">
                        <User className="absolute left-4 top-[42px] h-5 w-5 text-gray-400" />
                      </div>
                    </div>

                    <div>
                      <NeoInput
                        label="Last Name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                        inputClassName="pl-10"
                      />
                      <div className="relative">
                        <User className="absolute left-4 top-[42px] h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                  </div>

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

                  <NeoInput
                    label="Password"
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
                    label="Confirm Password"
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
                        "Creating Account..."
                      ) : (
                        <>
                          <UserPlus className="mr-2 h-5 w-5" />
                          Create Account
                        </>
                      )}
                    </NeoButton>
                  </div>
                </form>

                <div className="mt-6 relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="bg-white px-2 text-gray-500">Or continue with</span>
                  </div>
                </div>

                <div className="mt-6">
                  <GoogleSignInButton />
                </div>

                <div className="mt-6 text-center">
                  <p>
                    Already have an account?{" "}
                    <Link href="/auth/sign-in" className="font-bold hover:underline">
                      Sign in
                    </Link>
                  </p>
                </div>
              </div>
            </NeoCardPlain>
          </div>
        </div>
      </section>

      <NeoBanner color="black">SECURE CONNECTION • ENCRYPTED DATA • PRIVACY FIRST</NeoBanner>
    </div>
  )
}

