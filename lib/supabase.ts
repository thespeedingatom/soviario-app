import { createClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"

// This is a singleton pattern to ensure we only create one client per environment
let browserClient: ReturnType<typeof createClient> | null = null

export function getSupabaseBrowserClient() {
  if (!browserClient) {
    browserClient = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storageKey: "soravio-auth-token",
      },
    })
  }
  return browserClient
}

// For server components
export function createServerSupabaseClient() {
  // Don't use cookies() in client components
  const cookieStore = typeof window === "undefined" ? { toString: () => cookies().toString() } : undefined

  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: {
      persistSession: false,
    },
    ...(cookieStore && {
      global: {
        headers: {
          cookie: cookieStore.toString(),
        },
      },
    }),
  })
}

export function getSupabaseServerClient() {
  return createServerSupabaseClient()
}

