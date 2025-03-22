import { getSupabaseServerClient } from "./supabase"

export async function checkOAuthConfiguration() {
  try {
    const supabase = getSupabaseServerClient()
    const { data, error } = await supabase.auth.getSession()

    // Check if we can access the auth API
    if (error) {
      return {
        isConfigured: false,
        error: error.message,
      }
    }

    return {
      isConfigured: true,
      error: null,
    }
  } catch (error) {
    return {
      isConfigured: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

