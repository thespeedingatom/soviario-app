"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { NeoButton } from "@/components/ui/neo-button"
import { NeoCardPlain } from "@/components/ui/neo-card-plain"
import { NeoBanner } from "@/components/ui/neo-banner"
import { NeoInput } from "@/components/ui/neo-input"
import { NeoAlert } from "@/components/ui/neo-alert"
import { LogIn, AlertTriangle } from "lucide-react"
import Link from "next/link";
// import { useAuth } from "@/contexts/auth-context"; // Removed useAuth
// import { GoogleSignInButton } from "@/components/google-sign-in-button"; // Removed GoogleSignInButton
// import { toast } from "@/components/ui/use-toast"; // Removed toast if not used elsewhere

export default function SignInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isMounted = useRef(true);

  // const [email, setEmail] = useState(""); // Removed
  // const [password, setPassword] = useState("") // Removed
  const [error, setError] = useState("") // Keep for general errors from Shopify redirect
  const [success, setSuccess] = useState("") // Keep for messages like "check your email" if Shopify flow involves that
  // const [isLoading, setIsLoading] = useState(false) // Removed, Shopify handles loading state on their page
  // const [isResendingEmail, setIsResendingEmail] = useState(false) // Removed
  // const [showResendButton, setShowResendButton] = useState(false) // Removed
  // const [unconfirmedEmail, setUnconfirmedEmail] = useState("") // Removed
  const [oauthError, setOauthError] = useState<string | null>(null) // Keep for OAuth specific errors

  // Check if user is already logged in (this will need to be adapted for Shopify auth)
  // For now, this effect might not be fully functional until Shopify session check is in place
  useEffect(() => {
    // Placeholder: Add logic here to check Shopify session if needed on client-side
    // e.g., by calling an API route that checks isAuthenticated() from shopify-auth.ts
    // If logged in, redirect:
    // const redirectTo = searchParams.get("redirect") || "/dashboard"
    // router.push(redirectTo)

    return () => {
      isMounted.current = false
    }
  }, [router, searchParams])

  // Check for error messages from Shopify redirect
  useEffect(() => {
    const errorParam = searchParams.get("error")
    const messageParam = searchParams.get("message") // For general messages

    if (errorParam) {
      const decodedError = decodeURIComponent(errorParam)
      setError(decodedError)
      // You might want to categorize Shopify errors if they provide specific codes
      if (decodedError.includes("OAuth") || decodedError.includes("access_denied") || decodedError.includes("configuration")) {
        setOauthError(decodedError)
      }
    }
    if (messageParam) {
      setSuccess(decodeURIComponent(messageParam));
    }

    return () => {
      isMounted.current = false
    }
  }, [searchParams])

  // Removed handleSubmit, handleResendVerification

  const handleShopifySignIn = () => {
    // Redirect to our backend API route that initiates Shopify login
    router.push("/api/auth/shopify/login");
  };

  const isOAuthError = searchParams.get("error") === "oauth_config"; // This specific error might change based on Shopify's responses

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

                {/* Display general errors or OAuth specific errors */}
                {(error || oauthError) && (
                  <div className="mt-6">
                    <NeoAlert variant="error" dismissible>
                      {oauthError || error}
                    </NeoAlert>
                  </div>
                )}

                {success && (
                  <div className="mt-6">
                    <NeoAlert variant="success" dismissible>
                      {success}
                    </NeoAlert>
                  </div>
                )}

                <div className="mt-8">
                  <NeoButton onClick={handleShopifySignIn} className="w-full">
                    <LogIn className="mr-2 h-5 w-5" />
                    Sign In / Sign Up with Shopify
                  </NeoButton>
                  <p className="mt-2 text-center text-sm text-muted-foreground">
                    You will be redirected to Shopify to sign in or create an account.
                    This may include options for email/password and Google Sign-In.
                  </p>
                </div>
                
                {/* Removed email/password form and GoogleSignInButton */}
                {/* The "Forgot password?" and "Sign up" links might be handled by Shopify's page */}
                {/* Or you might need a separate flow for Shopify account recovery if not part of their page */}
                <div className="mt-6 text-center text-sm">
                  <p>
                    Need help?{" "}
                    <Link href="/contact" className="font-bold hover:underline">
                      Contact Support
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
