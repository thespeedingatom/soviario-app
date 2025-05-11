"use server"

import {
  getAllProducts as shopifyGetAllProducts,
  getProductByHandle as shopifyGetProductByHandle,
  type ShopifyProduct,
} from "@/lib/shopify"

export async function fetchAllProducts(): Promise<ShopifyProduct[]> {
  return shopifyGetAllProducts()
}

// export async function fetchProductsByRegion(region: string): Promise<ShopifyProduct[]> {
//   // TODO: Implement logic to filter products by region if needed,
//   // or decide if this function is still relevant with Shopify.
//   // Shopify might handle regions via collections or tags.
//   console.warn(`fetchProductsByRegion for region '${region}' is not implemented for Shopify yet.`);
//   return [];
// }

// export async function fetchFeaturedProducts(): Promise<ShopifyProduct[]> {
//   // TODO: Implement logic for featured products.
//   // This might involve a specific Shopify collection or product tags.
//   console.warn("fetchFeaturedProducts is not implemented for Shopify yet.");
//   return [];
// }

export async function fetchProductBySlug(slug: string): Promise<ShopifyProduct | null> {
  // Assuming 'slug' corresponds to Shopify's 'handle'
  try {
    return await shopifyGetProductByHandle(slug);
  } catch (error) {
    console.error(`Error fetching product by slug (handle) '${slug}':`, error);
    return null;
  }
}

// export async function fetchRelatedProducts(region: string, excludeSlug: string): Promise<ShopifyProduct[]> {
//   // TODO: Implement logic for related products.
//   console.warn(`fetchRelatedProducts for region '${region}' excluding '${excludeSlug}' is not implemented for Shopify yet.`);
//   return [];
// }
