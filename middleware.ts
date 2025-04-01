import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getSessionCookie } from 'better-auth/cookies'

export async function middleware(request: NextRequest) {
  try {
    // Check if the session cookie exists using the recommended lightweight method
    const sessionCookie = getSessionCookie(request, {
      // Using default cookie name and prefix as they are not customized in lib/auth.ts
      cookieName: "session_token", 
      cookiePrefix: "better-auth",
    });

    // Check protected routes (matcher already filters, but good for fine-grained control within matched paths)
    // Check protected UI routes (matcher already filters, but this provides fine-grained control)
    const isProtectedUIRoute = [
      '/dashboard',
      '/checkout',
      '/account',
      // NOTE: /api/auth/* is handled by the matcher, but we don't block it here based on cookie.
      // The better-auth handler itself manages which of its routes require auth.
    ].some(path => request.nextUrl.pathname.startsWith(path))

    // If it's a protected UI route and there's no session cookie, redirect or deny access
    if (isProtectedUIRoute && !sessionCookie) {
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

    // If the route is protected and the session cookie exists, allow the request
    return NextResponse.next()
  } catch (error) {
    console.error('Middleware error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500 }
    )
  }
}

// Matcher config
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/checkout/:path*', 
    '/account/:path*',
    '/api/auth/:path*'
  ]
}
