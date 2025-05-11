import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getIronSession } from 'iron-session'
import { cookies } from 'next/headers'
import type { ShopifySessionData } from '@/lib/shopify-auth'

export async function middleware(request: NextRequest) {
  try {
    // Get session using iron-session (same method as in lib/shopify-auth.ts)
    const session = await getIronSession<ShopifySessionData>(cookies(), {
      password: process.env.SECRET_COOKIE_PASSWORD || 'complex_password_at_least_32_characters_long',
      cookieName: 'shopify-customer-session',
      cookieOptions: {
        secure: process.env.NODE_ENV === 'production',
      },
    })

    // Check protected routes
    const isProtectedRoute = [
      '/dashboard',
      '/checkout',
      '/account',
    ].some(path => request.nextUrl.pathname.startsWith(path))

    // If it's a protected route and user is not authenticated
    if (isProtectedRoute && !session.isLoggedIn) {
      // For API routes, return 401
      if (request.nextUrl.pathname.startsWith('/api')) {
        return new Response(
          JSON.stringify({ error: 'Authentication required' }),
          { status: 401, headers: { 'Content-Type': 'application/json' } }
        )
      }
      
      // For UI routes, redirect to sign-in page
      const signInUrl = new URL('/auth/sign-in', request.url)
      signInUrl.searchParams.set('redirect', request.nextUrl.pathname)
      return NextResponse.redirect(signInUrl)
    }

    // Allow the request to proceed
    return NextResponse.next()
  } catch (error) {
    console.error('Middleware error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500 }
    )
  }
}

// Matcher config - protect these routes
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/checkout/:path*',
    '/account/:path*',
    // Exclude API auth routes from middleware since they handle their own auth
  ]
}
