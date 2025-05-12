import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedCustomer, ShopifySessionData } from '@/lib/shopify-auth';

export const dynamic = 'force-dynamic'; // Ensure route is always dynamically rendered

export async function GET(request: NextRequest) {
  try {
    const customerSession = await getAuthenticatedCustomer(); // This function is from lib/shopify-auth.ts

    if (customerSession && customerSession.isLoggedIn && customerSession.customer) {
      // Return the customer data as 'user'
      return NextResponse.json({ user: customerSession.customer, isLoggedIn: true }, { status: 200 });
    } else {
      // If not logged in or customer data is missing, return null for user
      return NextResponse.json({ user: null, isLoggedIn: false }, { status: 200 });
    }
  } catch (error) {
    console.error('Error fetching Shopify session:', error);
    return NextResponse.json({ error: 'Failed to fetch session' }, { status: 500 });
  }
}
