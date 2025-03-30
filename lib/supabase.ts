import { createClient } from "@supabase/supabase-js"

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

// For server components, import from supabase-server.ts instead
// This is provided for backward compatibility only
export function getSupabaseServerClient() {
  console.warn(
    "getSupabaseServerClient() called from client module. Import from supabase-server.ts for server components."
  )
  if (typeof window === "undefined") {
    // We're on the server, dynamically import the server version
    // This will throw an error in client components, which is expected
    try {
      // @ts-ignore - This is intentionally avoiding type checking
      const { getSupabaseServerClient: serverClient } = require("./supabase-server")
      return serverClient()
    } catch (e) {
      console.error("Failed to load server Supabase client:", e)
      throw new Error("Cannot use server client in this context")
    }
  }
  
  // Return browser client as fallback, but it won't have server capabilities
  return getSupabaseBrowserClient()
}

