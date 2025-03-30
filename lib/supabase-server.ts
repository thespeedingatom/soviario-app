"use server"

import { createClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"

// For server components only - this file should never be imported in client components
export async function createServerSupabaseClient() {
  const cookieStore = cookies()
  
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        persistSession: false,
      },
      global: {
        headers: {
          cookie: cookieStore.toString(),
        },
      },
    }
  )
}

export async function getSupabaseServerClient() {
  return createServerSupabaseClient()
}