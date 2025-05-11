"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react" // Added useEffect
import { NeoButton } from "@/components/ui/neo-button"
import { NeoCardPlain } from "@/components/ui/neo-card-plain"
import { NeoBanner } from "@/components/ui/neo-banner"
import { NeoInput } from "@/components/ui/neo-input"
import { NeoAlert } from "@/components/ui/neo-alert"
import { ArrowLeft, Info } from "lucide-react" // Replaced Send with Info
import Link from "next/link"
// import { useAuth } from "@/contexts/auth-context"; // Removed
import { useRouter } from "next/navigation"; // Added for redirection

export default function ForgotPasswordPage() {
  // const { resetPassword } = useAuth(); // Removed
  const router = useRouter(); // Added
  const isMounted = useRef(true); // Keep if any async operations remain or for consistency

  // const [email, setEmail] = useState(""); // Removed
  // const [isSubmitted, setIsSubmitted] = useState(false); // Removed
  // const [isLoading, setIsLoading] = useState(false); // Removed
  const [error, setError] = useState(""); // Keep for potential errors from Shopify redirect if relevant

  // Cleanup on unmount
  useEffect(() => {
    // Check for errors from Shopify redirect if any are relevant
    const searchParams = new URLSearchParams(window.location.search);
    const errorParam = searchParams.get("error");
    if (errorParam) {
      setError(decodeURIComponent(errorParam));
    }
    return () => {
      isMounted.current = false
    }
  }, [])

  const redirectToShopifyLogin = () => {
    router.push("/api/auth/shopify/login");
  };

  return (
    <div className="flex flex-col">
      <NeoBanner color="blue">PASSWORD RESET • ACCOUNT RECOVERY • SECURE ACCESS</NeoBanner>

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

                <div className="mt-8 text-center">
                  <NeoAlert variant="info" className="text-left">
                    <div className="flex items-start gap-2">
                      <Info className="h-5 w-5 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-bold">Password Reset via Shopify</p>
                        <p>
                          To reset your password, please proceed to the Shopify sign-in page.
                          You should find a "Forgot your password?" link there.
                        </p>
                      </div>
                    </div>
                  </NeoAlert>

                  <div className="mt-6">
                    <NeoButton onClick={redirectToShopifyLogin} className="w-full">
                      Proceed to Shopify Sign-In
                    </NeoButton>
                  </div>

                  <div className="mt-8">
                    <Link href="/auth/sign-in">
                      <NeoButton variant="outline">
                        <ArrowLeft className="mr-2 h-5 w-5" />
                        Back to Sign In
                      </NeoButton>
                    </Link>
                  </div>
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
