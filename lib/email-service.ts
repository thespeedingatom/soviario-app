import { Resend } from "resend"
import { getOrderById } from "./db-service"

// Initialize Resend with API key
const resend = new Resend(process.env.RESEND_API_KEY)

// Send order confirmation email
export async function sendOrderConfirmationEmail(email: string, orderId: string) {
  try {
    // Get order details
    const order = await getOrderById(orderId)

    // Format order items for email
    const itemsList = order.items
      .map(
        (item) =>
          `${item.name} - ${item.duration}${item.data ? ` (${item.data})` : ""} - Qty: ${
            item.quantity
          } - $${(item.price * item.quantity).toFixed(2)}`,
      )
      .join("<br>")

    // Calculate totals
    const subtotal = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const discount = order.discount || 0
    const total = subtotal - discount

    // Send email using Resend
    const { data, error } = await resend.emails.send({
      from: `Soravio eSIM <${process.env.RESEND_FROM_EMAIL || "noreply@soravio.com"}>`,
      to: email,
      subject: `Your Soravio eSIM Order #${orderId.slice(0, 8)}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #000; padding: 20px; text-align: center;">
            <h1 style="color: #fff; margin: 0;">Order Confirmed!</h1>
          </div>
          
          <div style="padding: 20px;">
            <p>Thank you for your purchase. Your eSIM details are below:</p>
            
            <div style="background-color: #f5f5f5; padding: 15px; margin: 20px 0; border: 3px solid #000;">
              <h2 style="margin-top: 0;">Order #${orderId.slice(0, 8)}</h2>
              <p>Date: ${new Date(order.created_at).toLocaleDateString()}</p>
              <p>Status: ${order.status.toUpperCase()}</p>
            </div>
            
            <h3>Order Items:</h3>
            <div style="margin-bottom: 20px;">
              ${itemsList}
            </div>
            
            <div style="border-top: 1px dashed #000; padding-top: 15px;">
              <p><strong>Subtotal:</strong> $${subtotal.toFixed(2)}</p>
              ${discount > 0 ? `<p><strong>Discount:</strong> -$${discount.toFixed(2)}</p>` : ""}
              <p style="font-size: 18px;"><strong>Total:</strong> $${total.toFixed(2)}</p>
            </div>
            
            <div style="background-color: #B8E3FF; padding: 15px; margin: 20px 0; border: 3px solid #000;">
              <h3 style="margin-top: 0;">How to Install Your eSIM</h3>
              <p>1. Go to your device settings</p>
              <p>2. Select "Cellular" or "Mobile Data"</p>
              <p>3. Tap "Add Cellular Plan" or "Add eSIM"</p>
              <p>4. Scan the QR code attached to this email</p>
              <p>5. Follow the on-screen instructions to complete setup</p>
            </div>
            
            <p>If you have any questions, please contact our support team at support@soravio.com</p>
          </div>
          
          <div style="background-color: #000; padding: 20px; text-align: center; color: #fff;">
            <p>&copy; ${new Date().getFullYear()} Soravio eSIM. All rights reserved.</p>
          </div>
        </div>
      `,
    })

    if (error) {
      throw error
    }

    return { success: true, id: data?.id }
  } catch (error) {
    console.error("Error sending order confirmation email:", error)
    throw new Error("Failed to send order confirmation email")
  }
}

// Send eSIM QR code email
export async function sendESIMQRCodeEmail(email: string, orderId: string, qrCodeUrl: string) {
  try {
    // Get order details
    const order = await getOrderById(orderId)

    // Send email using Resend
    const { data, error } = await resend.emails.send({
      from: `Soravio eSIM <${process.env.RESEND_FROM_EMAIL || "noreply@soravio.com"}>`,
      to: email,
      subject: `Your Soravio eSIM QR Code - Order #${orderId.slice(0, 8)}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #000; padding: 20px; text-align: center;">
            <h1 style="color: #fff; margin: 0;">Your eSIM QR Code</h1>
          </div>
          
          <div style="padding: 20px;">
            <p>Thank you for your purchase. Your eSIM QR code is ready to be scanned:</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <img src="${qrCodeUrl}" alt="eSIM QR Code" style="max-width: 300px; border: 3px solid #000;" />
            </div>
            
            <div style="background-color: #B8E3FF; padding: 15px; margin: 20px 0; border: 3px solid #000;">
              <h3 style="margin-top: 0;">How to Install Your eSIM</h3>
              <p>1. Go to your device settings</p>
              <p>2. Select "Cellular" or "Mobile Data"</p>
              <p>3. Tap "Add Cellular Plan" or "Add eSIM"</p>
              <p>4. Scan the QR code above</p>
              <p>5. Follow the on-screen instructions to complete setup</p>
            </div>
            
            <p>If you have any questions, please contact our support team at support@soravio.com</p>
          </div>
          
          <div style="background-color: #000; padding: 20px; text-align: center; color: #fff;">
            <p>&copy; ${new Date().getFullYear()} Soravio eSIM. All rights reserved.</p>
          </div>
        </div>
      `,
    })

    if (error) {
      throw error
    }

    return { success: true, id: data?.id }
  } catch (error) {
    console.error("Error sending eSIM QR code email:", error)
    throw new Error("Failed to send eSIM QR code email")
  }
}

// Send password reset email
export async function sendPasswordResetEmail(email: string, resetLink: string) {
  try {
    const { data, error } = await resend.emails.send({
      from: `Soravio eSIM <${process.env.RESEND_FROM_EMAIL || "noreply@soravio.com"}>`,
      to: email,
      subject: "Reset Your Soravio Password",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #000; padding: 20px; text-align: center;">
            <h1 style="color: #fff; margin: 0;">Reset Your Password</h1>
          </div>
          
          <div style="padding: 20px;">
            <p>We received a request to reset your password. Click the button below to create a new password:</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetLink}" style="background-color: #FF6666; color: white; padding: 12px 24px; text-decoration: none; font-weight: bold; border: 3px solid #000; display: inline-block;">
                Reset Password
              </a>
            </div>
            
            <p>If you didn't request a password reset, you can safely ignore this email.</p>
            
            <p>This link will expire in 1 hour for security reasons.</p>
          </div>
          
          <div style="background-color: #000; padding: 20px; text-align: center; color: #fff;">
            <p>&copy; ${new Date().getFullYear()} Soravio eSIM. All rights reserved.</p>
          </div>
        </div>
      `,
    })

    if (error) {
      throw error
    }

    return { success: true, id: data?.id }
  } catch (error) {
    console.error("Error sending password reset email:", error)
    throw new Error("Failed to send password reset email")
  }
}

