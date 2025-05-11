import { NextRequest, NextResponse } from 'next/server';
import { getShopifyLoginUrl } from '@/lib/shopify-auth'; // Assuming @ is configured for src or root

export async function GET(request: NextRequest) {
  try {
    // You could pass a dynamic redirect_path from query params if needed,
    // for example, to redirect back to the page that initiated login.
    // const { searchParams } = new URL(request.url);
    // const customCallbackPath = searchParams.get('callback_path_after_shopify_redirect');
    
    // For now, using the default callback path defined in getShopifyLoginUrl
    const loginUrl = getShopifyLoginUrl(); 
    return NextResponse.redirect(loginUrl);
  } catch (error) {
    console.error('Error generating Shopify login URL:', error);
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    return NextResponse.redirect(new URL('/auth/sign-in?error=login_url_generation_failed', siteUrl));
  }
}
