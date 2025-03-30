"use client"

import { useState } from "react"
import { NeoButton } from "@/components/ui/neo-button"
import { NeoCard } from "@/components/ui/neo-card"
import { NeoBanner } from "@/components/ui/neo-banner"
import { NeoAlert } from "@/components/ui/neo-alert"
import { Mail } from "lucide-react"
import { sendTestEmail } from "@/app/_actions/email-actions"

export default function TestEmailPage() {
  const [isSending, setIsSending] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)

  const handleSendTestEmail = async () => {
    try {
      setIsSending(true)
      setResult(null)

      const response = await sendTestEmail()

      setResult({
        success: response.success,
        message: response.success
          ? "Test email sent successfully! Check your inbox."
          : `Failed to send test email: ${response.error}`,
      })
    } catch (error) {
      setResult({
        success: false,
        message: `An unexpected error occurred: ${error instanceof Error ? error.message : String(error)}`,
      })
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className="flex flex-col">
      <NeoBanner color="blue">EMAIL TEST • RESEND INTEGRATION • VERIFICATION</NeoBanner>

      <section className="py-16">
        <div className="container max-w-2xl">
          <NeoCard>
            <div className="p-8">
              <div className="text-center">
                <div className="inline-block bg-black px-4 py-2 text-sm font-bold uppercase text-white">TEST</div>
                <h1 className="mt-4 text-3xl font-black uppercase tracking-tight">EMAIL INTEGRATION</h1>
                <div className="mx-auto mt-2 h-1 w-16 bg-[#FF6666]"></div>
                <p className="mt-4 text-muted-foreground">
                  Test the Resend email integration by sending a test email to the admin account.
                </p>
              </div>

              {result && (
                <div className="mt-6">
                  <NeoAlert variant={result.success ? "success" : "error"} dismissible>
                    {result.message}
                  </NeoAlert>
                </div>
              )}

              <div className="mt-8 flex justify-center">
                <NeoButton onClick={handleSendTestEmail} disabled={isSending} size="lg">
                  <Mail className="mr-2 h-5 w-5" />
                  {isSending ? "Sending..." : "Send Test Email"}
                </NeoButton>
              </div>
            </div>
          </NeoCard>
        </div>
      </section>

      <NeoBanner color="black">EMAIL TESTING • INTEGRATION VERIFICATION • SYSTEM CHECK</NeoBanner>
    </div>
  )
}

