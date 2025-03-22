import { createServerSupabaseClient } from "./supabase"

export type Product = {
  id: string
  name: string
  slug: string
  description: string
  price: number
  data_amount: string
  duration: string
  region: string
  countries: number
  is_featured: boolean
  color: string
  created_at: string
  updated_at: string
  features?: string[]
  country_list?: string[]
}

export async function getAllProducts(): Promise<Product[]> {
  try {
    const supabase = createServerSupabaseClient()

    const { data, error } = await supabase.from("products").select("*").order("price")

    if (error) {
      console.error("Error fetching products:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Error in getAllProducts:", error)
    return []
  }
}

export async function getProductsByRegion(region: string): Promise<Product[]> {
  try {
    const supabase = createServerSupabaseClient()

    const { data, error } = await supabase.from("products").select("*").eq("region", region).order("price")

    if (error) {
      console.error(`Error fetching products for region ${region}:`, error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Error in getProductsByRegion:", error)
    return []
  }
}

export async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const supabase = createServerSupabaseClient()

    const { data, error } = await supabase.from("products").select("*").eq("is_featured", true)

    if (error) {
      console.error("Error fetching featured products:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Error in getFeaturedProducts:", error)
    return []
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const supabase = createServerSupabaseClient()

    // Get the product
    const { data: product, error } = await supabase.from("products").select("*").eq("slug", slug).single()

    if (error) {
      console.error(`Error fetching product with slug ${slug}:`, error)
      return null
    }

    if (!product) {
      return null
    }

    // Initialize features and country_list with empty arrays
    let features: string[] = []
    let country_list: string[] = []

    try {
      // Get product features
      const { data: featuresData, error: featuresError } = await supabase
        .from("product_features")
        .select("feature")
        .eq("product_id", product.id)

      if (featuresError) {
        console.error(`Error fetching features for product ${product.id}:`, featuresError)
      } else if (featuresData) {
        features = featuresData.map((f) => f.feature)
      }
    } catch (featuresErr) {
      console.error(`Failed to fetch features for product ${product.id}:`, featuresErr)
    }

    try {
      // Get country coverage
      const { data: countriesData, error: countriesError } = await supabase
        .from("country_coverage")
        .select("country_name")
        .eq("product_id", product.id)

      if (countriesError) {
        console.error(`Error fetching countries for product ${product.id}:`, countriesError)
      } else if (countriesData) {
        country_list = countriesData.map((c) => c.country_name)
      }
    } catch (countriesErr) {
      console.error(`Failed to fetch countries for product ${product.id}:`, countriesErr)
    }

    // Return the product with features and countries, using empty arrays as fallbacks
    return {
      ...product,
      features,
      country_list,
    }
  } catch (error) {
    console.error("Error in getProductBySlug:", error)
    return null
  }
}

export async function getRelatedProducts(region: string, excludeSlug: string): Promise<Product[]> {
  try {
    const supabase = createServerSupabaseClient()

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("region", region)
      .neq("slug", excludeSlug)
      .limit(3)

    if (error) {
      console.error(`Error fetching related products for region ${region}:`, error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Error in getRelatedProducts:", error)
    return []
  }
}

