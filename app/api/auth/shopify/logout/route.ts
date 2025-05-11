import { NextRequest, NextResponse } from 'next/server';
import { logout as shopifyLogout } from '@/lib/shopify-auth'; // Assuming @ is configured for src or root
import { redirect } from 'next/navigation';

export async function GET(request: NextRequest) {
  // The logout function in shopify-auth.ts handles session destruction
  // and then redirects. We call it here.
  // Since shopifyLogout itself calls redirect(), which throws an error in Next.js 13+ App Router's GET handlers,
  // we might need to adjust how redirection is handled or simply trust it.
  // For now, let's assume shopifyLogout will correctly redirect.
  // If not, we'd have it return a URL and redirect from here.

  try {
    await shopifyLogout(); 
    // shopifyLogout calls redirect, so this line might not be reached if it works as expected.
    // If redirect() in a server action called from a GET handler is problematic,
    // we might need to adjust shopifyLogout to return a URL, then redirect from here.
    // However, since it's a server action, it should be fine.
    // Fallback redirect in case shopifyLogout doesn't throw a REDIRECT error:
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    return NextResponse.redirect(new URL('/', siteUrl));

  } catch (error: any) {
    // If the error is a Next.js redirect error, it's expected.
    if (error.message === 'NEXT_REDIRECT') {
      throw error; // Re-throw to let Next.js handle the redirect
    }
    console.error('Error during logout:', error);
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    return NextResponse.redirect(new URL(`/?error=logout_failed`, siteUrl));
  }
}

// It's often better to use POST for logout to prevent CSRF,
// but GET is simpler for a link. If using a form/button, POST is preferred.
export async function POST(request: NextRequest) {
  try {
    await shopifyLogout();
    // Fallback redirect
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    return NextResponse.json({ success: true, message: 'Logged out successfully, redirecting...'}, { status: 200 });

  } catch (error: any) {
    if (error.message === 'NEXT_REDIRECT') {
      throw error;
    }
    console.error('Error during logout (POST):', error);
    return NextResponse.json({ success: false, message: 'Logout failed' }, { status: 500 });
  }
}
