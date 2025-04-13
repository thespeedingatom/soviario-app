"use server";

import { fetchAllEsimProducts, fetchEsimProductsByRegion, fetchEsimProductBySlug, fetchFeaturedEsimProducts, fetchRelatedEsimProducts } from "@/domains/esim/services/productService";

/**
 * Server action to fetch all eSIM products
 */
export async function fetchAllProducts() {
  return await fetchAllEsimProducts();
}

/**
 * Server action to fetch eSIM products by region
 */
export async function fetchProductsByRegion(region: string) {
  return await fetchEsimProductsByRegion(region);
}

/**
 * Server action to fetch a single eSIM product by slug
 */
export async function fetchProductBySlug(slug: string) {
  return await fetchEsimProductBySlug(slug);
}

/**
 * Server action to fetch featured eSIM products
 */
export async function fetchFeaturedProducts() {
  return await fetchFeaturedEsimProducts();
}

/**
 * Server action to fetch related eSIM products
 */
export async function fetchRelatedProducts(region: string, excludeSlug: string) {
  return await fetchRelatedEsimProducts(region, excludeSlug);
}
