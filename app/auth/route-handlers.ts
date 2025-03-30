"use server"

import { authClient } from "@/lib/auth-client"
import { redirect } from "next/navigation"

export async function signIn(formData: FormData) {
  const { email, password, redirectTo } = Object.fromEntries(formData)
  
  const { error } = await authClient.signIn.email({
    email: email.toString(),
    password: password.toString()
  })

  if (error) {
    return { error: error.message }
  }

  redirect(redirectTo?.toString() || "/dashboard")
}

export async function signUp(formData: FormData) {
  const { email, password, name } = Object.fromEntries(formData)
  
  const { error } = await authClient.signUp.email({
    email: email.toString(),
    password: password.toString(),
    name: name?.toString()
  })

  if (error) {
    return { error: error.message }
  }

  return { success: true, message: "Check your email to confirm your account" }
}

export async function signOut() {
  await authClient.signOut()
  redirect("/")
}

export async function forgetPassword(formData: FormData) {
  const { email } = Object.fromEntries(formData)
  
  const { error } = await authClient.forgetPassword({
    email: email.toString(),
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/reset-password`
  })

  if (error) {
    return { error: error.message }
  }

  return { success: true, message: "Check your email for the password reset link" }
}

export async function sendVerificationEmail(formData: FormData) {
  const { email } = Object.fromEntries(formData)
  
  const { error } = await authClient.sendVerificationEmail({
    email: email.toString()
  })

  if (error) {
    return { error: error.message }
  }

  return { success: true, message: "Verification email sent" }
}
