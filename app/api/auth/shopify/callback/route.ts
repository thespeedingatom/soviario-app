import { NextRequest, NextResponse } from 'next/server';
import { handleShopifyCallback } from '@/lib/shopify-auth'; // Assuming @ is configured for src or root

export async function GET(request: NextRequest) {
  // The handleShopifyCallback function from shopify-auth.ts
  // will exchange the code for a token, create a session, and then redirect.
  return handleShopifyCallback(request);
}
