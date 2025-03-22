import { createServerSupabaseClient } from "./supabase"

export async function createOrUpdateUserProfile(userId: string, userData: any) {
  try {
    const supabase = createServerSupabaseClient()

    // Check if user profile exists
    const { data: existingProfile, error: fetchError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single()

    if (fetchError && fetchError.code !== "PGRST116") {
      // PGRST116 is the error code for "no rows returned"
      console.error("Error fetching user profile:", fetchError)
      throw fetchError
    }

    if (existingProfile) {
      // Update existing profile
      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          updated_at: new Date().toISOString(),
          ...userData,
        })
        .eq("id", userId)

      if (updateError) {
        console.error("Error updating user profile:", updateError)
        throw updateError
      }
    } else {
      // Create new profile
      const { error: insertError } = await supabase.from("profiles").insert([
        {
          id: userId,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          ...userData,
        },
      ])

      if (insertError) {
        console.error("Error creating user profile:", insertError)
        throw insertError
      }
    }

    return { success: true }
  } catch (error) {
    console.error("Error in createOrUpdateUserProfile:", error)
    return { success: false, error }
  }
}

