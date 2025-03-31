"use server"

import { Resend } from "resend";
import { render } from '@react-email/render';
import QRCode from 'qrcode';
// Use relative path instead of alias
import { MayaQRCode } from '../emails/maya-qr-code'; 

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEsimEmail(
  email: string, 
  activationCode: string,
  orderId: string
) {
  try {
    // Generate QR code image
    const qrCodeDataUrl = await QRCode.toDataURL(activationCode, {
      width: 300,
      margin: 2
    })

    // Convert data URL to buffer
    const qrCodeBuffer = Buffer.from(qrCodeDataUrl.split(',')[1], 'base64')

    // Render email template
    const emailHtml = await render(MayaQRCode({ 
      activationCode,
      orderId
    }))

    const { data, error } = await resend.emails.send({
      from: `Soravio eSIM <${process.env.RESEND_FROM_EMAIL}>`,
      to: email,
      subject: `Your eSIM Activation Code - Order #${orderId.slice(0, 8)}`,
      html: emailHtml,
      attachments: [{
        filename: `esim-activation-${orderId}.png`,
        content: qrCodeBuffer
      }]
    })

    if (error) throw error

    return { success: true, id: data?.id }
  } catch (error) {
    console.error('Failed to send eSIM email:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

// Existing sendTestEmail function remains unchanged
export async function sendTestEmail() {
  // ... existing implementation ...
}
