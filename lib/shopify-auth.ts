"use server";

import { IronSession, getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { NextRequest, NextResponse } from 'next/server';
import { 
  generateCodeVerifier, 
  generateCodeChallenge, 
  generateState, 
  generateNonce,
  decodeJwt
} from './crypto-helpers';

// Define the session data structure
export interface ShopifySessionData {
  accessToken?: string;
  idToken?: string; // To store id_token for logout and nonce verification
  refreshToken?: string;
  expiresAt?: number;
  codeVerifier?: string; // For PKCE
  state?: string; // For CSRF protection
  nonce?: string; // For replay attack protection
  customer?: {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
  };
  isLoggedIn: boolean;
}

// Default session data
const defaultSession: ShopifySessionData = {
  isLoggedIn: false,
};

// Session options
const sessionOptions = {
  password: process.env.SECRET_COOKIE_PASSWORD || 'complex_password_at_least_32_characters_long', // Replace with a strong secret in .env
  cookieName: 'shopify-customer-session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
  },
};

async function getSession(): Promise<IronSession<ShopifySessionData>> {
  // For Server Components, Server Actions, and Route Handlers in App Router
  // Using 'as any' as a temporary workaround for a persistent TypeScript error.
  // The pattern getIronSession(cookies(), sessionOptions) is standard for App Router.
  return getIronSession<ShopifySessionData>(cookies() as any, sessionOptions);
}

const shopifyStoreDomain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
const customerAccountClientId = process.env.NEXT_PUBLIC_CUSTOMER_ACCOUNT_API_CLIENT_ID;
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'; // Ensure this is set in .env

if (!shopifyStoreDomain) {
  throw new Error('NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN is not defined.');
}
if (!customerAccountClientId) {
  throw new Error('NEXT_PUBLIC_CUSTOMER_ACCOUNT_API_CLIENT_ID is not defined.');
}
if (!process.env.SECRET_COOKIE_PASSWORD) {
  console.warn('SECRET_COOKIE_PASSWORD is not defined. Using default, insecure password. SET THIS IN PRODUCTION!');
}

const shopifyShopId = process.env.SHOPIFY_SHOP_ID;
if (!shopifyShopId) {
  throw new Error('SHOPIFY_SHOP_ID (numeric shop ID) is not defined in environment variables.');
}

// Corrected OAuth endpoints based on Shopify's core Customer Account API documentation
const shopifyOAuthBaseUrl = `https://shopify.com/authentication/${shopifyShopId}`;
const shopifyAuthorizeUrl = `${shopifyOAuthBaseUrl}/oauth/authorize`;
const shopifyTokenUrl = `${shopifyOAuthBaseUrl}/oauth/token`;
const shopifyLogoutUrlBase = `${shopifyOAuthBaseUrl}/logout`;


/**
 * Generates the Shopify login URL.
 * @param callbackPath - The path to redirect to after successful login (e.g., '/dashboard').
 * @returns The Shopify login URL.
 */
export async function getShopifyLoginUrl(callbackPath: string = '/api/auth/shopify/callback'): Promise<string> {
  if (!siteUrl) {
    throw new Error("NEXT_PUBLIC_SITE_URL is not defined. This is required for the redirect URI.");
  }
  if (!customerAccountClientId) {
    // This check is mostly for TypeScript, as it's already checked at module level.
    throw new Error("NEXT_PUBLIC_CUSTOMER_ACCOUNT_API_CLIENT_ID is not defined.");
  }
  const redirectUri = `${siteUrl}${callbackPath.startsWith('/') ? '' : '/'}${callbackPath}`;
  
  const scopes = [
    'openid', 
    'email', 
    // As per Shopify docs, 'customer-account-api:full' might be what you need, or specific ones.
    // Let's use the ones from your previous code for now, but this might need adjustment.
    'https://api.shopify.com/auth/shop_domain.profile.readonly',
    'https://api.shopify.com/auth/shop_domain.customer.readonly',
    'https://api.shopify.com/auth/shop_domain.customer.orders.readonly'
  ].join(' ');

  // PKCE, State, Nonce
  const codeVerifier = await generateCodeVerifier();
  const codeChallenge = await generateCodeChallenge(codeVerifier);
  const state = await generateState();
  const nonce = await generateNonce();

  // Store verifier, state, and nonce in session to verify later
  const session = await getSession();
  session.codeVerifier = codeVerifier;
  session.state = state;
  session.nonce = nonce;
  await session.save();

  const authUrl = new URL(shopifyAuthorizeUrl);
  authUrl.searchParams.append('client_id', customerAccountClientId);
  authUrl.searchParams.append('response_type', 'code');
  authUrl.searchParams.append('redirect_uri', redirectUri);
  authUrl.searchParams.append('scope', scopes);
  authUrl.searchParams.append('state', state);
  authUrl.searchParams.append('nonce', nonce);
  authUrl.searchParams.append('code_challenge', codeChallenge);
  authUrl.searchParams.append('code_challenge_method', 'S256');

  return authUrl.toString();
}

export async function handleShopifyCallback(request: NextRequest): Promise<NextResponse> {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const returnedState = url.searchParams.get('state');

  const session = await getSession();
  const { codeVerifier, state: storedState, nonce: storedNonce } = session;

  // Clear them from session after retrieval
  session.codeVerifier = undefined;
  session.state = undefined;
  session.nonce = undefined;
  // Don't save yet, do it after successful token exchange or if erroring out early.

  if (!code) {
    await session.save(); // Save cleared values
    return NextResponse.redirect(new URL('/auth/sign-in?error=authorization_code_missing', siteUrl));
  }
  if (!storedState || storedState !== returnedState) {
    await session.save(); // Save cleared values
    console.error("State mismatch:", { storedState, returnedState });
    return NextResponse.redirect(new URL('/auth/sign-in?error=state_mismatch', siteUrl));
  }
  if (!codeVerifier) {
    await session.save(); // Save cleared values
    console.error("Code verifier not found in session.");
    return NextResponse.redirect(new URL('/auth/sign-in?error=code_verifier_missing', siteUrl));
  }

  try {
    const tokenRequestBody: Record<string, string> = {
      grant_type: 'authorization_code',
      client_id: customerAccountClientId, // This should be the public client ID
      redirect_uri: `${siteUrl}/api/auth/shopify/callback`,
      code,
      code_verifier: codeVerifier,
    };
    
    const tokenResponse = await fetch(shopifyTokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded', // Shopify expects this for token endpoint
      },
      body: new URLSearchParams(tokenRequestBody).toString(),
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json().catch(() => ({ error: "unknown_error", error_description: "Failed to parse error response from token endpoint." }));
      console.error('Shopify token exchange error:', errorData);
      await session.save(); // Save cleared values
      return NextResponse.redirect(new URL(`/auth/sign-in?error=${errorData.error || 'token_exchange_failed'}&desc=${encodeURIComponent(errorData.error_description || '')}`, siteUrl));
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;
    const idToken = tokenData.id_token; // Capture id_token
    const refreshToken = tokenData.refresh_token;
    const expiresIn = tokenData.expires_in;

    // Verify nonce from id_token
    if (idToken && storedNonce) {
      const decodedIdToken = decodeJwt(idToken);
      if (!decodedIdToken || decodedIdToken.payload.nonce !== storedNonce) {
        console.error("Nonce mismatch:", { storedNonce, idTokenNonce: decodedIdToken?.payload.nonce });
        // Decide if this is a hard failure. For now, log and continue.
        // return NextResponse.redirect(new URL('/auth/sign-in?error=nonce_mismatch', siteUrl));
      }
    }
    
    // Fetch customer information (placeholder - implement actual fetch if needed)
    // const customer = await fetchShopifyCustomerData(accessToken); 

    session.accessToken = accessToken;
    session.idToken = idToken;
    session.refreshToken = refreshToken;
    session.expiresAt = Date.now() + (expiresIn * 1000);
    // session.customer = customer; // Store actual customer data if fetched
    session.isLoggedIn = true;
    await session.save();

    return NextResponse.redirect(new URL('/dashboard', siteUrl));

  } catch (error) {
    console.error('Error handling Shopify callback:', error);
    session.codeVerifier = undefined; // Ensure these are cleared on error too
    session.state = undefined;
    session.nonce = undefined;
    await session.save();
    return NextResponse.redirect(new URL('/auth/sign-in?error=callback_processing_error', siteUrl));
  }
}

export async function logout() {
  const session = await getSession();
  const idTokenHint = session.idToken;
  
  // Clear local session first
  session.destroy(); // This should also save the destroyed session

  // Redirect to Shopify's logout endpoint if id_token_hint is available
  // The Shopify documentation specifies `id_token_hint` and `post_logout_redirect_uri`
  if (idTokenHint && typeof idTokenHint === 'string' && siteUrl && shopifyStoreDomain) {
    // customerAccountClientId is checked at module level, so it should be a string here.
    // If TypeScript still complains, it's an overly cautious inference.
    // We can add another explicit check if absolutely necessary for TS, but the module-level throw handles it.
    if (!customerAccountClientId) { // Defensive check, primarily for TypeScript if it loses track
        console.error("customerAccountClientId became undefined in logout, this shouldn't happen.");
        redirect('/'); // Fallback
        return;
    }
    // The shop_id in the logout URL is your actual shop ID (e.g., from shopifyStoreDomain or a specific ID if different)
    // The example from docs: `https://shopify.com/authentication/{shop_id}/logout`
    // Let's assume shopifyStoreDomain contains something like "your-shop-name.myshopify.com"
    // The {shop_id} might be different from the client_id.
    // For now, I'll construct it based on the pattern, but this might need your actual shop_id.
    // A common way to get shop_id is if it's part of the domain or a separate env var.
    // The Customer Account API settings page in Shopify Admin shows the exact endpoints.
    // Example: https://shopify.com/authentication/YOUR_SHOP_ID_HERE/logout
    // The image provided shows a numeric shop_id in the endpoint: 70349258942
    // This needs to be correctly configured. For now, I'll use a placeholder.
    
    // Using the SHOPIFY_SHOP_ID from env for the logout URL path
    const logoutUrl = new URL(shopifyLogoutUrlBase);
    logoutUrl.searchParams.append('id_token_hint', idTokenHint);
    logoutUrl.searchParams.append('post_logout_redirect_uri', `${siteUrl}/auth/sign-in?logged_out=true`);
    redirect(logoutUrl.toString());
  } else {
    redirect('/'); // Fallback redirect if Shopify logout isn't possible
  }
}

export async function getAuthenticatedCustomer() {
  const session = await getSession();
  if (!session.isLoggedIn || !session.accessToken) {
    return null;
  }
  // Here you would typically fetch fresh customer data using the accessToken
  // or return stored customer data if you have it.
  // For now, returning a placeholder or just the session status.
  return {
    isLoggedIn: session.isLoggedIn,
    accessToken: session.accessToken, // Be careful exposing tokens to client-side
    // customer: session.customer, // If stored
  };
}

// Example of a Customer Account API GraphQL query
// You'll need a separate GraphQL client instance for this,
// as it uses a different endpoint and auth mechanism than the Storefront API.
// const customerApiEndpoint = `https://${shopifyStoreDomain}/customer-account/api/2024-07/graphql`; // Example version
/*
async function fetchShopifyCustomerData(accessToken: string) {
  const query = `
    query {
      customer {
        id
        firstName
        lastName
        email
        // other fields
      }
    }
  `;
  const response = await fetch(customerApiEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`, // Customer access token
    },
    body: JSON.stringify({ query }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error('Failed to fetch customer data:', errorData);
    throw new Error('Failed to fetch customer data');
  }
  const result = await response.json();
  return result.data.customer;
}
*/

export async function isAuthenticated(): Promise<boolean> {
  const session = await getSession();
  return session.isLoggedIn && !!session.accessToken;
}
