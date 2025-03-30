"use server"

import {
  getAllProducts,
  getProductsByRegion,
  getFeaturedProducts,
  getProductBySlug,
  getRelatedProducts,
  type Product,
} from "@/lib/db-products"

export async function fetchAllProducts(): Promise<Product[]> {
  return getAllProducts()
}

export async function fetchProductsByRegion(region: string): Promise<Product[]> {
  return getProductsByRegion(region)
}

export async function fetchFeaturedProducts(): Promise<Product[]> {
  return getFeaturedProducts()
}

export async function fetchProductBySlug(slug: string): Promise<Product | null> {
  return getProductBySlug(slug)
}

export async function fetchRelatedProducts(region: string, excludeSlug: string): Promise<Product[]> {
  try {
    return await getRelatedProducts(region, excludeSlug)
  } catch (error) {
    console.error(`Error fetching related products for region ${region}:`, error)
    return []
  }
}

