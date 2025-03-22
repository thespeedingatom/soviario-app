"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { NeoCardPlain } from "@/components/ui/neo-card-plain"
import { NeoBanner } from "@/components/ui/neo-banner"
import { NeoButton } from "@/components/ui/neo-button"
import { LogOut } from "lucide-react"

export default function SignOutPage() {
  const router = useRouter()
  const { signOut, user } = useAuth()
  const [isSigningOut, setIsSigningOut] = useState(false)
  const [error, setError] = useState("")

  // If user is already signed out, redirect to home
  useEffect(() => {
    if (!user && !isSigningOut) {
      router.push("/")
    }
  }, [user, router, isSigningOut])

  const handleSignOut = async () => {
    setIsSigningOut(true)
    try {
      await signOut()
      // The auth state change will trigger the useEffect above
    } catch (err: any) {
      console.error("Error signing out:", err)
      setError("An error occurred while signing out. Please try again.")
      setIsSigningOut(false)
    }
  }

  const handleCancel = () => {
    router.back()
  }

  return (
    <div className="flex flex-col">
      <NeoBanner color="red">SIGN OUT • SECURE LOGOUT • ACCOUNT PROTECTION</NeoBanner>

      <section className="py-16">
        <div className="container">
          <div className="mx-auto max-w-md">
            <NeoCardPlain>
              <div className="p-8 text-center">
                <div className="inline-block bg-black px-4 py-2 text-sm font-bold uppercase text-white">ACCOUNT</div>
                <h1 className="mt-4 text-3xl font-black uppercase tracking-tight">SIGN OUT</h1>
                <div className="mx-auto mt-2 h-1 w-16 bg-[#FF6666]"></div>

                <p className="mt-6 text-lg">Are you sure you want to sign out?</p>

                {error && <p className="mt-4 text-red-500">{error}</p>}

                <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
                  <NeoButton onClick={handleSignOut} disabled={isSigningOut} className="w-full sm:w-auto">
                    {isSigningOut ? (
                      "Signing Out..."
                    ) : (
                      <>
                        <LogOut className="mr-2 h-5 w-5" />
                        Sign Out
                      </>
                    )}
                  </NeoButton>

                  <NeoButton
                    variant="outline"
                    onClick={handleCancel}
                    disabled={isSigningOut}
                    className="w-full sm:w-auto"
                  >
                    Cancel
                  </NeoButton>
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

