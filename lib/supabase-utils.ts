"use server"

import { createServerSupabaseClient } from "@/lib/supabase-server"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

// Server action to get the current session
export async function getServerSession() {
  const supabase = createServerSupabaseClient()
  const { data: { session } } = await supabase.auth.getSession()
  return session
}

// Server action to check authentication and redirect if not authenticated
export async function requireAuthentication() {
  const session = await getServerSession()
  
  if (!session) {
    // Get referer from headers to redirect back after login
    const headersList = headers()
    const referer = headersList.get("referer") || ""
    const path = new URL(referer).pathname
    
    redirect(`/auth/sign-in?redirect=${encodeURIComponent(path)}`)
  }
  
  return session
}

// Server action to get current user
export async function getCurrentUser() {
  const session = await getServerSession()
  return session?.user || null
}