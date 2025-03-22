import { createServerSupabaseClient } from "./supabase"

// Define storage bucket names
export const STORAGE_BUCKETS = {
  ESIM_QR_CODES: "esim-qr-codes",
  USER_PROFILES: "user-profiles",
  PRODUCT_IMAGES: "product-images",
}

// Initialize storage buckets
export async function initializeStorageBuckets() {
  const supabase = createServerSupabaseClient()

  // Create buckets if they don't exist
  for (const bucket of Object.values(STORAGE_BUCKETS)) {
    const { data, error } = await supabase.storage.getBucket(bucket)

    if (error && error.message.includes("The resource was not found")) {
      await supabase.storage.createBucket(bucket, {
        public: false,
        fileSizeLimit: 5242880, // 5MB
      })
    }
  }
}

// Upload file to storage
export async function uploadFile(bucketName: string, filePath: string, file: File | Blob, contentType?: string) {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase.storage.from(bucketName).upload(filePath, file, {
    contentType,
    upsert: true,
  })

  if (error) {
    throw new Error(`Error uploading file: ${error.message}`)
  }

  return data
}

// Get file URL
export async function getFileUrl(bucketName: string, filePath: string) {
  const supabase = createServerSupabaseClient()

  const { data } = await supabase.storage.from(bucketName).getPublicUrl(filePath)

  return data.publicUrl
}

// Delete file from storage
export async function deleteFile(bucketName: string, filePath: string) {
  const supabase = createServerSupabaseClient()

  const { error } = await supabase.storage.from(bucketName).remove([filePath])

  if (error) {
    throw new Error(`Error deleting file: ${error.message}`)
  }

  return true
}

