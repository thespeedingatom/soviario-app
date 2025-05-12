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

// Cart Related Interfaces from Shopify Storefront API Docs
interface CartLine {
  id: string;
  quantity: number;
  merchandise: {
    id: string; // ProductVariant ID
    // Potentially add title, image, price from merchandise if needed directly on line
  };
  // attributes?: { key: string; value: string }[]; // If you use line item attributes
}

interface CartCost {
  totalAmount: { amount: string; currencyCode: string };
  subtotalAmount: { amount: string; currencyCode: string };
  totalTaxAmount?: { amount: string; currencyCode: string } | null;
  totalDutyAmount?: { amount: string; currencyCode: string } | null;
}

interface DiscountCodeApplication {
  code: string;
  applicable: boolean;
}

export interface ShopifyCart {
  id: string;
  createdAt: string;
  updatedAt: string;
  checkoutUrl: string;
  lines: {
    edges: { node: CartLine }[];
  };
  attributes: { key: string; value: string }[];
  cost: CartCost;
  buyerIdentity?: any; // Define further if used
  discountCodes: DiscountCodeApplication[];
}

interface CartResponse {
  cart: ShopifyCart;
}

interface CartCreateResponse {
  cartCreate: {
    cart: ShopifyCart;
    userErrors: ShopifyUserError[];
  };
}

interface CartLinesAddResponse {
  cartLinesAdd: {
    cart: ShopifyCart;
    userErrors: ShopifyUserError[];
  };
}

interface CartLinesUpdateResponse {
  cartLinesUpdate: {
    cart: ShopifyCart;
    userErrors: ShopifyUserError[];
  };
}

interface CartLinesRemoveResponse {
  cartLinesRemove: {
    cart: ShopifyCart;
    userErrors: ShopifyUserError[];
  };
}

interface CartDiscountCodesUpdateResponse {
  cartDiscountCodesUpdate: {
    cart: ShopifyCart;
    userErrors: ShopifyUserError[];
  };
}

export interface ShopifyUserError {
  field: string[] | null;
  message: string;
}


// Input types for mutations
export interface CartLineInput {
  merchandiseId: string;
  quantity: number;
  attributes?: { key: string; value: string }[];
}

export interface CartLineUpdateInput {
  id: string; // CartLine ID
  merchandiseId?: string;
  quantity?: number;
  attributes?: { key: string; value: string }[];
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
  dataAmount?: string;
  region?: string;
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
  dataAmount: metafield(namespace: "custom", key: "data_amount") {
    value
  }
  region: metafield(namespace: "custom", key: "region") {
    value
  }
`;

// Fragment for Cart details, to be reused in cart mutations and queries
const cartFragment = `
  id
  createdAt
  updatedAt
  checkoutUrl
  lines(first: 10) { # Adjust count as needed
    edges {
      node {
        id
        quantity
        merchandise {
          ... on ProductVariant {
            id
            title # Added for display
            price { amount currencyCode } # Added for display
            image { url altText } # Added for display
            product { 
              title 
              handle
              dataAmount: metafield(namespace: "custom", key: "data_amount") {
                value
              }
              region: metafield(namespace: "custom", key: "region") {
                value
              }
            } # Added for context
          }
        }
        attributes { # If you use line item attributes
          key
          value
        }
      }
    }
  }
  attributes {
    key
    value
  }
  cost {
    totalAmount {
      amount
      currencyCode
    }
    subtotalAmount {
      amount
      currencyCode
    }
    totalTaxAmount {
      amount
      currencyCode
    }
    totalDutyAmount {
      amount
      currencyCode
    }
  }
  buyerIdentity { # Basic buyer identity, expand if needed
    email
    phone
    countryCode
    customer {
      id
    }
  }
  discountCodes {
    code
    applicable
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
    price: node.priceRange?.minVariantPrice?.amount || '0.00',
    imageUrl: node.featuredImage?.url || '',
    dataAmount: node.dataAmount?.value,
    region: node.region?.value,
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
      dataAmount: productByHandle.dataAmount?.value,
      region: productByHandle.region?.value,
    };
  } catch (error) {
    console.error(`Error fetching product by handle '${handle}':`, error);
    return null;
  }
}

// --- Cart Functions ---

export async function createCart(lines: CartLineInput[], buyerIdentity?: any, attributes?: {key: string, value: string}[]): Promise<ShopifyCart | null> {
  const query = `
    mutation createCart($cartInput: CartInput!) {
      cartCreate(input: $cartInput) {
        cart {
          ${cartFragment}
        }
        userErrors {
          field
          message
        }
      }
    }
  `;
  const cartInput: { lines: CartLineInput[]; buyerIdentity?: any; attributes?: any[] } = { lines };
  if (buyerIdentity) cartInput.buyerIdentity = buyerIdentity;
  if (attributes) cartInput.attributes = attributes;

  try {
    const response = await shopify.request<CartCreateResponse>(query, { cartInput });
    if (response.cartCreate.userErrors && response.cartCreate.userErrors.length > 0) {
      console.error("Error creating cart:", response.cartCreate.userErrors);
      // Optionally throw an error or return a specific error object
      return null; 
    }
    return response.cartCreate.cart;
  } catch (error) {
    console.error("Exception creating cart:", error);
    return null;
  }
}

export async function getCart(cartId: string): Promise<ShopifyCart | null> {
  const query = `
    query getCart($cartId: ID!) {
      cart(id: $cartId) {
        ${cartFragment}
      }
    }
  `;
  try {
    const response = await shopify.request<{ cart: ShopifyCart }>(query, { cartId });
    return response.cart;
  } catch (error) {
    console.error(`Error fetching cart ${cartId}:`, error);
    return null;
  }
}

export async function addCartLines(cartId: string, lines: CartLineInput[]): Promise<ShopifyCart | null> {
  const query = `
    mutation addCartLines($cartId: ID!, $lines: [CartLineInput!]!) {
      cartLinesAdd(cartId: $cartId, lines: $lines) {
        cart {
          ${cartFragment}
        }
        userErrors {
          field
          message
        }
      }
    }
  `;
  try {
    const response = await shopify.request<CartLinesAddResponse>(query, { cartId, lines });
    if (response.cartLinesAdd.userErrors && response.cartLinesAdd.userErrors.length > 0) {
      console.error("Error adding cart lines:", response.cartLinesAdd.userErrors);
      return null;
    }
    return response.cartLinesAdd.cart;
  } catch (error) {
    console.error("Exception adding cart lines:", error);
    return null;
  }
}

export async function removeCartLines(cartId: string, lineIds: string[]): Promise<ShopifyCart | null> {
  const query = `
    mutation removeCartLines($cartId: ID!, $lineIds: [ID!]!) {
      cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
        cart {
          ${cartFragment}
        }
        userErrors {
          field
          message
        }
      }
    }
  `;
  try {
    const response = await shopify.request<CartLinesRemoveResponse>(query, { cartId, lineIds });
     if (response.cartLinesRemove.userErrors && response.cartLinesRemove.userErrors.length > 0) {
      console.error("Error removing cart lines:", response.cartLinesRemove.userErrors);
      return null;
    }
    return response.cartLinesRemove.cart;
  } catch (error) {
    console.error("Exception removing cart lines:", error);
    return null;
  }
}

export async function updateCartLines(cartId: string, lines: CartLineUpdateInput[]): Promise<ShopifyCart | null> {
  const query = `
    mutation updateCartLines($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
      cartLinesUpdate(cartId: $cartId, lines: $lines) {
        cart {
          ${cartFragment}
        }
        userErrors {
          field
          message
        }
      }
    }
  `;
  try {
    const response = await shopify.request<CartLinesUpdateResponse>(query, { cartId, lines });
    if (response.cartLinesUpdate.userErrors && response.cartLinesUpdate.userErrors.length > 0) {
      console.error("Error updating cart lines:", response.cartLinesUpdate.userErrors);
      return null;
    }
    return response.cartLinesUpdate.cart;
  } catch (error) {
    console.error("Exception updating cart lines:", error);
    return null;
  }
}

export async function updateCartDiscountCodes(cartId: string, discountCodes: string[]): Promise<ShopifyCart | null> {
  const query = `
    mutation updateCartDiscountCodes($cartId: ID!, $discountCodes: [String!]) {
      cartDiscountCodesUpdate(cartId: $cartId, discountCodes: $discountCodes) {
        cart {
          ${cartFragment}
        }
        userErrors {
          field
          message
        }
      }
    }
  `;
  try {
    const response = await shopify.request<CartDiscountCodesUpdateResponse>(query, { cartId, discountCodes });
    if (response.cartDiscountCodesUpdate.userErrors && response.cartDiscountCodesUpdate.userErrors.length > 0) {
      console.error("Error updating discount codes:", response.cartDiscountCodesUpdate.userErrors);
      // Note: Shopify might return userErrors if a code is invalid but still return the cart.
      // Depending on desired behavior, you might still return the cart here.
      // For now, treating userErrors as a reason to return null for simplicity.
      return null;
    }
    return response.cartDiscountCodesUpdate.cart;
  } catch (error) {
    console.error("Exception updating discount codes:", error);
    return null;
  }
}
