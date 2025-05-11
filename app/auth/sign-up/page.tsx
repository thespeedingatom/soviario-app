"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { NeoButton } from "@/components/ui/neo-button"
import { NeoCardPlain } from "@/components/ui/neo-card-plain"
import { NeoBanner } from "@/components/ui/neo-banner"
import { NeoInput } from "@/components/ui/neo-input"
import { NeoAlert } from "@/components/ui/neo-alert"
import { UserPlus } from "lucide-react" // Keep if used for the button icon
import Link from "next/link"
// import { useAuth } from "@/contexts/auth-context"; // Removed
// import { GoogleSignInButton } from "@/components/google-sign-in-button"; // Removed

export default function SignUpPage() {
  const router = useRouter()
  // const { user, isPending: authLoading } = useAuth(); // Removed, session check might be different
  const isMounted = useRef(true)
  const [error, setError] = useState("") // Keep for potential errors passed via URL from Shopify

  // Check if user is already logged in (this will need to be adapted for Shopify auth)
  // For now, this effect might not be fully functional until Shopify session check is in place
  useEffect(() => {
    // Placeholder: Add logic here to check Shopify session if needed on client-side
    // e.g., by calling an API route that checks isAuthenticated() from shopify-auth.ts
    // If logged in, redirect:
    // router.push("/dashboard")

    // Check for errors from Shopify redirect if any are relevant to sign-up
    const searchParams = new URLSearchParams(window.location.search);
    const errorParam = searchParams.get("error");
    if (errorParam) {
      setError(decodeURIComponent(errorParam));
    }

    return () => {
      isMounted.current = false
    }
  }, [router])


  const handleShopifySignUp = () => {
    // Redirect to our backend API route that initiates Shopify login/signup
    router.push("/api/auth/shopify/login");
  };

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

                <div className="mt-8">
                  <NeoButton onClick={handleShopifySignUp} className="w-full">
                    <UserPlus className="mr-2 h-5 w-5" />
                    Create Account / Sign In with Shopify
                  </NeoButton>
                  <p className="mt-2 text-center text-sm text-muted-foreground">
                    You will be redirected to Shopify to create an account or sign in.
                    This may include options for email/password and Google Sign-In.
                  </p>
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
