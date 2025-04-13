/**
 * Product actions using BigCommerce API.
 * This file demonstrates how to fetch products directly from BigCommerce,
 * making the storefront a pure UI layer with no local business logic.
 * 
 * Set BIGCOMMERCE_STORE_HASH and BIGCOMMERCE_API_TOKEN in your environment.
 */

const BIGCOMMERCE_API_URL = `https://api.bigcommerce.com/stores/${process.env.BIGCOMMERCE_STORE_HASH}/v3`;
const BIGCOMMERCE_API_TOKEN = process.env.BIGCOMMERCE_API_TOKEN!;

export async function fetchAllProductsFromBigCommerce() {
  const res = await fetch(`${BIGCOMMERCE_API_URL}/catalog/products`, {
    headers: {
      'X-Auth-Token': BIGCOMMERCE_API_TOKEN,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    // Revalidate as needed for ISR/SSR
    next: { revalidate: 60 }
  });

  if (!res.ok) {
    throw new Error(`BigCommerce API error: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  return data.data; // Array of products
}

export async function fetchProductByIdFromBigCommerce(productId: number) {
  const res = await fetch(`${BIGCOMMERCE_API_URL}/catalog/products/${productId}`, {
    headers: {
      'X-Auth-Token': BIGCOMMERCE_API_TOKEN,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    next: { revalidate: 60 }
  });

  if (!res.ok) {
    throw new Error(`BigCommerce API error: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  return data.data; // Product object
}
