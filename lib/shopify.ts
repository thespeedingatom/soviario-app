// lib/shopify.ts
import { GraphQLClient } from 'graphql-request';

interface ProductsResponse {
  products: {
    edges: { node: any }[];
  };
}

interface ProductByHandleResponse {
  productByHandle: any;
}

const storefrontAccessToken = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;
const storefrontApiVersion = process.env.NEXT_PUBLIC_SHOPIFY_API_VERSION;
const storefrontDomain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;

if (!storefrontAccessToken) {
  throw new Error(
    'The NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN environment variable is not defined.'
  );
}

if (!storefrontApiVersion) {
  throw new Error(
    'The NEXT_PUBLIC_SHOPIFY_API_VERSION environment variable is not defined.'
  );
}

if (!storefrontDomain) {
  throw new Error(
    'The NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN environment variable is not defined.'
  );
}

const endpoint = `https://${storefrontDomain}/api/${storefrontApiVersion}/graphql.json`;

export const shopify = new GraphQLClient(endpoint, {
  headers: {
    'X-Shopify-Storefront-Access-Token': storefrontAccessToken,
  },
});

export interface ShopifyProduct {
  id: string;
  title: string;
  handle: string;
  description: string;
  price: string;
  imageUrl: string;
}

const productFragment = `
  id
  title
  handle
  description
  priceRange {
    minVariantPrice {
      amount
    }
  }
  featuredImage {
    url
  }
`;

export async function getAllProducts(): Promise<ShopifyProduct[]> {
  const query = `
    query {
      products(first: 100) {
        edges {
          node {
            ${productFragment}
          }
        }
      }
    }
  `;

  const response = await shopify.request<ProductsResponse>(query);
  // console.log("Raw Shopify Response:", response); // Keep for debugging if needed

  if (!response || !response.products || !response.products.edges) {
    console.error("Invalid response structure from Shopify:", response);
    return [];
  }

  return response.products.edges.map(({ node }: { node: any }) => ({
    id: node.id,
    title: node.title,
    handle: node.handle,
    description: node.description,
    price: node.priceRange?.minVariantPrice?.amount || '0.00', // Add optional chaining and default
    imageUrl: node.featuredImage?.url || '', // Add optional chaining and default
  }));
}

export async function getProductByHandle(handle: string): Promise<ShopifyProduct | null> {
  const query = `
    query getProductByHandle($handle: String!) {
      productByHandle(handle: $handle) {
        ${productFragment}
      }
    }
  `;

  const variables = { handle };
  try {
    const response = await shopify.request<ProductByHandleResponse>(query, variables);

    if (!response || !response.productByHandle) {
      console.error(`Product with handle '${handle}' not found or invalid response structure.`);
      return null;
    }
    const { productByHandle } = response;

    return {
      id: productByHandle.id,
      title: productByHandle.title,
      handle: productByHandle.handle,
      description: productByHandle.description,
      price: productByHandle.priceRange?.minVariantPrice?.amount || '0.00',
      imageUrl: productByHandle.featuredImage?.url || '',
    };
  } catch (error) {
    console.error(`Error fetching product by handle '${handle}':`, error);
    return null;
  }
}
