"use server";

import { IronSession, getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { NextRequest, NextResponse } from 'next/server';

// Define the session data structure
export interface ShopifySessionData {
  accessToken?: string;
  expiresAt?: number;
  refreshToken?: string;
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

async function getSession(
  req?: NextRequest,
  res?: NextResponse
): Promise<IronSession<ShopifySessionData>> {
  if (req && res) {
    // For API routes
    return getIronSession<ShopifySessionData>(req, res, sessionOptions);
  }
  // For Server Components and Server Actions
  return getIronSession<ShopifySessionData>(cookies(), sessionOptions);
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


const shopifyCustomerAccountApiUrl = `https://${shopifyStoreDomain}/api/login/customer-account`; // Main auth endpoint

/**
 * Generates the Shopify login URL.
 * @param callbackPath - The path to redirect to after successful login (e.g., '/dashboard').
 * @returns The Shopify login URL.
 */
export function getShopifyLoginUrl(callbackPath: string = '/api/auth/shopify/callback'): string {
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
    'https://api.shopify.com/auth/shop_domain.profile.readonly', // Basic profile
    'https://api.shopify.com/auth/shop_domain.customer.readonly', // Read customer data
    'https://api.shopify.com/auth/shop_domain.customer.orders.readonly', // Read orders
    // Add more scopes as needed, e.g., for address management
  ].join(' ');

  const authUrl = new URL(`${shopifyCustomerAccountApiUrl}/oauth/authorize`);
  authUrl.searchParams.append('client_id', customerAccountClientId);
  authUrl.searchParams.append('response_type', 'code');
  authUrl.searchParams.append('redirect_uri', redirectUri);
  authUrl.searchParams.append('scope', scopes);
  // authUrl.searchParams.append('state', 'YOUR_CSRF_TOKEN_HERE'); // Recommended for security
  // authUrl.searchParams.append('nonce', 'YOUR_NONCE_HERE'); // Recommended for security

  return authUrl.toString();
}

// Placeholder for handling the callback
export async function handleShopifyCallback(request: NextRequest): Promise<NextResponse> {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  // const state = url.searchParams.get('state'); // Verify state here

  if (!code) {
    return NextResponse.redirect(new URL('/auth/sign-in?error=authorization_code_missing', siteUrl));
  }

  try {
    // 1. Exchange authorization code for access token
    const tokenResponse = await fetch(`${shopifyCustomerAccountApiUrl}/oauth/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        grant_type: 'authorization_code',
        client_id: customerAccountClientId,
        redirect_uri: `${siteUrl}/api/auth/shopify/callback`,
        code,
        // client_secret: 'IF_APPLICABLE_YOUR_CLIENT_SECRET', // Usually not for public clients
      }),
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json();
      console.error('Shopify token exchange error:', errorData);
      return NextResponse.redirect(new URL(`/auth/sign-in?error=${errorData.error || 'token_exchange_failed'}`, siteUrl));
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;
    // const refreshToken = tokenData.refresh_token; // Store if available and needed
    // const expiresIn = tokenData.expires_in; // In seconds

    // 2. Fetch customer information (optional, or do it on demand)
    //    This requires a GraphQL client configured for Customer Account API
    //    For now, we'll just store the token.

    // 3. Create session
    const session = await getSession();
    session.accessToken = accessToken;
    session.isLoggedIn = true;
    // session.expiresAt = Date.now() + (expiresIn * 1000);
    // session.refreshToken = refreshToken;
    await session.save();

    return NextResponse.redirect(new URL('/dashboard', siteUrl)); // Redirect to dashboard or intended page

  } catch (error) {
    console.error('Error handling Shopify callback:', error);
    return NextResponse.redirect(new URL('/auth/sign-in?error=callback_processing_error', siteUrl));
  }
}


export async function logout() {
  const session = await getSession();
  session.destroy();
  // Optionally, redirect to Shopify's logout endpoint if available/needed
  // For Customer Account API, clearing the local session is often sufficient.
  // const logoutUrl = `${shopifyCustomerAccountApiUrl}/logout?client_id=${customerAccountClientId}&return_to=${siteUrl}`;
  // redirect(logoutUrl); 
  redirect('/'); // Redirect to homepage
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
