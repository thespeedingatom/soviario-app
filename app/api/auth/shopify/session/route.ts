import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedCustomer, ShopifySessionData } from '@/lib/shopify-auth';

export async function GET(request: NextRequest) {
  try {
    const customerSession = await getAuthenticatedCustomer(); // This function is from lib/shopify-auth.ts

    if (customerSession && customerSession.isLoggedIn) {
      // Adapt the session data to the structure your AuthContext might expect,
      // or return the ShopifySessionData directly.
      // For now, let's assume getAuthenticatedCustomer returns something like ShopifySessionData
      return NextResponse.json(customerSession, { status: 200 });
    } else {
      return NextResponse.json({ isLoggedIn: false, user: null, accessToken: null }, { status: 200 });
    }
  } catch (error) {
    console.error('Error fetching Shopify session:', error);
    return NextResponse.json({ error: 'Failed to fetch session' }, { status: 500 });
  }
}
