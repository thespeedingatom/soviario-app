"use server"

import { Resend } from "resend"

// Initialize Resend with API key
const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendTestEmail() {
  try {
    // Get admin email from environment variables or use a default
    const adminEmail = process.env.ADMIN_EMAIL || process.env.RESEND_FROM_EMAIL || "test@example.com"

    const { data, error } = await resend.emails.send({
      from: `Soravio eSIM <${process.env.RESEND_FROM_EMAIL || "noreply@soravio.com"}>`,
      to: adminEmail,
      subject: "Soravio eSIM - Test Email",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #000; padding: 20px; text-align: center;">
            <h1 style="color: #fff; margin: 0;">Test Email</h1>
          </div>
          
          <div style="padding: 20px;">
            <p>This is a test email from your Soravio eSIM application.</p>
            
            <div style="background-color: #f5f5f5; padding: 15px; margin: 20px 0; border: 3px solid #000;">
              <h2 style="margin-top: 0;">Email Integration Test</h2>
              <p>If you're seeing this, your Resend email integration is working correctly!</p>
              <p>Time sent: ${new Date().toLocaleString()}</p>
            </div>
            
            <p>You can now use the email service for sending order confirmations, password resets, and other notifications.</p>
          </div>
          
          <div style="background-color: #000; padding: 20px; text-align: center; color: #fff;">
            <p>&copy; ${new Date().getFullYear()} Soravio eSIM. All rights reserved.</p>
          </div>
        </div>
      `,
    })

    if (error) {
      console.error("Error sending test email:", error)
      return { success: false, error: error.message }
    }

    return { success: true, id: data?.id }
  } catch (error) {
    console.error("Error sending test email:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unknown error occurred",
    }
  }
}

