// Environment Variables - Ensure these are set in your .env files
const SALEOR_API_URL = process.env.NEXT_PUBLIC_SALEOR_API_URL;
const SALEOR_CHANNEL_SLUG = process.env.NEXT_PUBLIC_SALEOR_CHANNEL_SLUG || 'default-channel'; // Provide a default if needed

if (!SALEOR_API_URL) {
  throw new Error("Missing NEXT_PUBLIC_SALEOR_API_URL environment variable");
}

interface SaleorFetchOptions {
  query: string;
  variables?: Record<string, unknown>;
  accessToken?: string | null; // Optional user access token
  cache?: RequestCache;
  revalidate?: number | false; // Next.js fetch revalidation option
}

interface SaleorResponse<T> {
  data: T;
  errors?: Array<{ message: string; extensions?: any; code?: string; field?: string }>;
}

/**
 * Generic fetch function for Saleor GraphQL API
 */
async function saleorFetch<T>({
  query,
  variables,
  accessToken,
  cache = 'force-cache', // Default cache strategy
  revalidate,
}: SaleorFetchOptions): Promise<SaleorResponse<T>> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  // Add Authorization header if access token is provided
  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  const nextOptions: NextFetchRequestConfig = {};
  if (revalidate !== undefined) {
    nextOptions.revalidate = revalidate;
  }

  try {
    const response = await fetch(SALEOR_API_URL!, {
      method: 'POST',
      headers,
      body: JSON.stringify({ query, variables }),
      cache,
      next: nextOptions,
    });

    if (!response.ok) {
      // Handle non-2xx HTTP responses
      const errorBody = await response.text();
      throw new Error(`Saleor API request failed with status ${response.status}: ${errorBody}`);
    }

    const result: SaleorResponse<T> = await response.json();

    if (result.errors) {
      // Log detailed errors for debugging
      console.error("Saleor GraphQL Errors:", JSON.stringify(result.errors, null, 2));
      // Throw a more specific error or handle based on error codes
      const firstError = result.errors[0];
      throw new SaleorError(firstError.message, firstError.code, firstError.field, result.errors);
    }

    return result;

  } catch (error) {
    console.error("Error in saleorFetch:", error);
    // Re-throw the error or handle it as needed
    if (error instanceof SaleorError) {
      throw error; // Re-throw Saleor-specific errors
    }
    throw new Error(`Failed to fetch from Saleor API: ${error instanceof Error ? error.message : String(error)}`);
  }
}

// ==================================
// Authentication Functions
// ==================================

interface TokenCreateResult {
  tokenCreate: {
    token: string | null;
    refreshToken: string | null;
    csrfToken: string | null;
    user: { id: string; email: string } | null;
    errors: Array<{ field: string; message: string; code: string }>;
  } | null;
}

export async function saleorLogin(email: string, password: string) {
  const query = `
    mutation TokenCreate($email: String!, $password: String!) {
      tokenCreate(email: $email, password: $password) {
        token
        refreshToken
        csrfToken
        user {
          id
          email
        }
        errors {
          field
          message
          code
        }
      }
    }
  `;
  return saleorFetch<TokenCreateResult>({ query, variables: { email, password }, cache: 'no-store' });
}

interface AccountRegisterResult {
  accountRegister: {
    user: { id: string; email: string } | null;
    errors: Array<{ field: string; message: string; code: string }>;
  } | null;
}

export async function saleorRegister(email: string, password: string) {
  const query = `
    mutation AccountRegister($email: String!, $password: String!, $channel: String!) {
      accountRegister(input: {email: $email, password: $password, channel: $channel}) {
        user {
          id
          email
        }
        errors {
          field
          message
          code
        }
      }
    }
  `;
  return saleorFetch<AccountRegisterResult>({
    query,
    variables: { email, password, channel: SALEOR_CHANNEL_SLUG },
    cache: 'no-store',
  });
}

interface TokenRefreshResult {
  tokenRefresh: {
    token: string | null;
    refreshToken: string | null;
    user: { id: string } | null;
    errors: Array<{ field: string; message: string; code: string }>;
  } | null;
}

export async function saleorRefreshToken(refreshToken: string) {
  const query = `
    mutation TokenRefresh($refreshToken: String!) {
      tokenRefresh(refreshToken: $refreshToken) {
        token
        refreshToken
        user {
          id
        }
        errors {
          field
          message
          code
        }
      }
    }
  `;
  return saleorFetch<TokenRefreshResult>({ query, variables: { refreshToken }, cache: 'no-store' });
}

interface RequestPasswordResetResult {
  requestPasswordReset: {
    errors: Array<{ field: string; message: string; code: string }>;
  } | null;
}

export async function saleorRequestPasswordReset(email: string, redirectUrl: string) {
  const query = `
    mutation RequestPasswordReset($email: String!, $redirectUrl: String!, $channel: String!) {
      requestPasswordReset(email: $email, redirectUrl: $redirectUrl, channel: $channel) {
        errors {
          field
          message
          code
        }
      }
    }
  `;
  return saleorFetch<RequestPasswordResetResult>({
    query,
    variables: { email, redirectUrl, channel: SALEOR_CHANNEL_SLUG },
    cache: 'no-store',
  });
}

interface SetPasswordResult {
  setPassword: {
    token: string | null;
    refreshToken: string | null;
    csrfToken: string | null;
    user: { id: string } | null;
    errors: Array<{ field: string; message: string; code: string }>;
  } | null;
}

export async function saleorSetNewPassword(token: string, password: string) {
  const query = `
    mutation SetPassword($token: String!, $password: String!) {
      setPassword(token: $token, password: $password) {
        token
        refreshToken
        csrfToken
        user {
          id
        }
        errors {
          field
          message
          code
        }
      }
    }
  `;
  return saleorFetch<SetPasswordResult>({ query, variables: { token, password }, cache: 'no-store' });
}

interface MeQueryResult {
  me: {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
    // Add other fields as needed
  } | null;
}

export async function saleorGetCurrentUser(accessToken: string) {
  const query = `
    query Me {
      me {
        id
        email
        firstName
        lastName
        # Add other fields as needed
      }
    }
  `;
  // Use user's access token for this request
  return saleorFetch<MeQueryResult>({ query, accessToken, cache: 'no-store' });
}


// ==================================
// Existing Functions (Refactored)
// ==================================

// Define types for your data structures (example)
interface SaleorProduct {
  id: string;
  name: string;
  slug: string;
  description?: string; // Make optional if not always queried
}

interface SaleorProductListResult {
  products: {
    edges: Array<{ node: SaleorProduct }>;
  } | null;
}

export async function fetchSaleorProducts(): Promise<SaleorProduct[]> {
  const query = `
    query FetchProducts($channel: String) {
      products(first: 10, channel: $channel) {
        edges {
          node {
            id
            name
            slug
          }
        }
      }
    }
  `;
  // Fetch public data, no access token needed
  const result = await saleorFetch<SaleorProductListResult>({
    query,
    variables: { channel: SALEOR_CHANNEL_SLUG },
    revalidate: 3600 // Example: Revalidate products every hour
  });
  return result.data?.products?.edges.map((edge) => edge.node) ?? [];
}

interface SaleorProductDetailsResult {
  product: SaleorProduct | null;
}

export async function fetchSaleorProductBySlug(slug: string): Promise<SaleorProduct | null> {
  const query = `
    query FetchProductBySlug($slug: String!, $channel: String) {
      product(slug: $slug, channel: $channel) {
        id
        name
        slug
        description
        # Add other fields as needed
      }
    }
  `;
  // Fetch public data, no access token needed
  const result = await saleorFetch<SaleorProductDetailsResult>({
    query,
    variables: { slug, channel: SALEOR_CHANNEL_SLUG },
    revalidate: 3600 // Example: Revalidate product details every hour
  });
  return result.data?.product ?? null;
}

// --- Add refactored versions of createSaleorOrder, getSaleorOrderById, etc. ---
// These might require an *app token* or a *user token* depending on Saleor permissions
// Example: createSaleorOrder might need the user's access token if creating on their behalf

// NOTE: The original createSaleorOrder, getSaleorOrderById, etc., used a hardcoded token.
// You'll need to decide if these operations should use:
// 1. The logged-in user's access token (passed into the function).
// 2. A dedicated Saleor App Token (read from env vars, e.g., process.env.SALEOR_APP_TOKEN) for server-to-server actions.
// 3. No token if Saleor permissions allow anonymous access for these actions.

// Placeholder for refactored order functions - adjust token strategy as needed
// export async function createSaleorOrder(...) { ... use saleorFetch ... }
// export async function getSaleorOrderById(...) { ... use saleorFetch ... }
// export async function getSaleorUserOrders(...) { ... use saleorFetch ... }
// export async function updateSaleorOrderStatus(...) { ... use saleorFetch ... }

// Define a simple SaleorError class (optional but helpful)
// You might want to place this in a separate errors.ts file within the domain
export class SaleorError extends Error {
  code?: string;
  field?: string;
  originalErrors?: any[];

  constructor(message: string, code?: string, field?: string, originalErrors?: any[]) {
    super(message);
    this.name = 'SaleorError';
    this.code = code;
    this.field = field;
    this.originalErrors = originalErrors;
    // Ensure the prototype chain is correct
    Object.setPrototypeOf(this, SaleorError.prototype);
  }
}
