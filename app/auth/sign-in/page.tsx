"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { NeoButton } from "@/components/ui/neo-button"
import { NeoCardPlain } from "@/components/ui/neo-card-plain"
import { NeoBanner } from "@/components/ui/neo-banner"
import { NeoInput } from "@/components/ui/neo-input"
import { NeoAlert } from "@/components/ui/neo-alert"
import { Mail, Lock, LogIn, RefreshCw, AlertTriangle } from "lucide-react"
import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";
// Remove getSupabaseBrowserClient import if only used for resend
import { GoogleSignInButton } from "@/components/google-sign-in-button";
import { toast } from "@/components/ui/use-toast";

export default function SignInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  // Import sendVerificationEmail from useAuth context
  const { signIn, user, isPending: authLoading, sendVerificationEmail } = useAuth(); // Use isPending
  const isMounted = useRef(true);
  // Remove supabase client instance if only used for resend
  // const supabase = getSupabaseBrowserClient() 

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isResendingEmail, setIsResendingEmail] = useState(false)
  const [showResendButton, setShowResendButton] = useState(false)
  const [unconfirmedEmail, setUnconfirmedEmail] = useState("")
  const [oauthError, setOauthError] = useState<string | null>(null)

  // Check if user is already logged in
  useEffect(() => {
    if (!authLoading && user) {
      // Check if there's a redirect URL in the query parameters
      const redirectTo = searchParams.get("redirect") || "/dashboard"
      router.push(redirectTo)
    }

    return () => {
      isMounted.current = false
    }
  }, [user, router, authLoading, searchParams])

  // Check for success message from registration or error from OAuth
  useEffect(() => {
    const registered = searchParams.get("registered")
    const error = searchParams.get("error")

    // Add this code to handle OAuth configuration errors
    const isOAuthError = error === "oauth_config"

    if (registered === "true") {
      setSuccess("Registration successful! Please check your email to verify your account before signing in.")
    }

    if (error) {
      const decodedError = decodeURIComponent(error)
      setError(decodedError)

      // Check if it's an OAuth error
      if (decodedError.includes("OAuth") || decodedError.includes("provider")) {
        setOauthError(decodedError)
      }
    }

    return () => {
      isMounted.current = false
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setIsLoading(true)
    setShowResendButton(false)

    try {
      const { error: signInError, data } = await signIn(email, password)

      if (signInError) {
        throw signInError
      }

      // If login is successful, get the redirect URL from query parameters or default to dashboard
      const redirectTo = searchParams.get("redirect") || "/dashboard"
      router.push(redirectTo)
    } catch (err: any) {
      console.error("Sign in error:", err)
      if (isMounted.current) {
        // Check if the error is about email confirmation
        if (
          err.message &&
          (err.message.includes("Email not confirmed") || err.message.includes("Email link is invalid or has expired"))
        ) {
          setError("Your email has not been verified. Please check your inbox and click the verification link.")
          setUnconfirmedEmail(email)
          setShowResendButton(true)
        } else {
          setError(err.message || "Invalid email or password. Please try again.")
        }
      }
    } finally {
      if (isMounted.current) {
        setIsLoading(false)
      }
    }
  }

  const handleResendVerification = async () => {
    if (!unconfirmedEmail) return

    setIsResendingEmail(true);
    try {
      // Use the context function instead of direct Supabase call
      const { error } = await sendVerificationEmail(unconfirmedEmail); 

      if (error) throw error;

      setSuccess("Verification email resent! Please check your inbox.");
      setShowResendButton(false)
      toast({
        title: "Email Sent",
        description: "Verification email has been resent to your inbox.",
      })
    } catch (err: any) {
      console.error("Error resending verification email:", err)
      setError(`Failed to resend verification email: ${err.message}`)
      toast({
        title: "Error",
        description: `Failed to resend verification email: ${err.message}`,
        variant: "destructive",
      })
    } finally {
      setIsResendingEmail(false)
    }
  }

  const isOAuthError = searchParams.get("error") === "oauth_config"

  return (
    <div className="flex flex-col">
      <NeoBanner color="blue">SECURE LOGIN • ACCOUNT ACCESS • ESIM MANAGEMENT</NeoBanner>

      <section className="py-16">
        <div className="container">
          <div className="mx-auto max-w-md">
            <NeoCardPlain>
              <div className="p-8">
                <div className="text-center">
                  <div className="inline-block bg-black px-4 py-2 text-sm font-bold uppercase text-white">ACCOUNT</div>
                  <h1 className="mt-4 text-3xl font-black uppercase tracking-tight">SIGN IN</h1>
                  <div className="mx-auto mt-2 h-1 w-16 bg-[#FF6666]"></div>
                  <p className="mt-4 text-muted-foreground">Sign in to manage your eSIMs, view orders, and more.</p>
                </div>

                {oauthError && (
                  <div className="mt-6">
                    <NeoAlert variant="error" dismissible>
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="h-5 w-5 mt-0.5" />
                        <div>
                          <p className="font-bold">OAuth Configuration Error</p>
                          <p>{oauthError}</p>
                          <p className="mt-2">
                            This is likely a server configuration issue. Please try email sign-in instead or contact
                            support.
                          </p>
                          <div className="mt-2">
                            <Link href="/auth/oauth-config-check">
                              <NeoButton variant="outline" size="sm">
                                Check OAuth Configuration
                              </NeoButton>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </NeoAlert>
                  </div>
                )}

                {error && !oauthError && (
                  <div className="mt-6">
                    <NeoAlert variant="error" dismissible>
                      {error}
                      {showResendButton && (
                        <div className="mt-2">
                          <NeoButton
                            onClick={handleResendVerification}
                            disabled={isResendingEmail}
                            size="sm"
                            variant="outline"
                          >
                            {isResendingEmail ? (
                              "Sending..."
                            ) : (
                              <>
                                <RefreshCw className="mr-2 h-4 w-4" />
                                Resend Verification Email
                              </>
                            )}
                          </NeoButton>
                        </div>
                      )}
                    </NeoAlert>
                  </div>
                )}

                {isOAuthError && (
                  <NeoAlert variant="error" className="mb-4">
                    There's an issue with the OAuth configuration. Please make sure Google OAuth is properly set up in
                    your Supabase project.
                  </NeoAlert>
                )}

                {error && !isOAuthError && (
                  <NeoAlert variant="error" className="mb-4">
                    Authentication failed. Please try again.
                  </NeoAlert>
                )}

                {success && (
                  <div className="mt-6">
                    <NeoAlert variant="success" dismissible>
                      {success}
                    </NeoAlert>
                  </div>
                )}

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

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        id="remember-me"
                        name="remember-me"
                        type="checkbox"
                        className="h-4 w-4 border-2 border-black"
                      />
                      <label htmlFor="remember-me" className="ml-2 block text-sm">
                        Remember me
                      </label>
                    </div>

                    <div className="text-sm">
                      <Link href="/auth/forgot-password" className="hover:underline">
                        Forgot password?
                      </Link>
                    </div>
                  </div>

                  <div>
                    <NeoButton type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? (
                        "Signing in..."
                      ) : (
                        <>
                          <LogIn className="mr-2 h-5 w-5" />
                          Sign In
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
                    Don't have an account?{" "}
                    <Link href="/auth/sign-up" className="font-bold hover:underline">
                      Sign up
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
