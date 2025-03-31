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
    const isProtectedRoute = [
      '/dashboard',
      '/checkout',
      '/account',
      '/api/auth' // Keep this check, especially if some /api/auth routes should be public (like sign-in endpoint)
    ].some(path => request.nextUrl.pathname.startsWith(path))

    // If the route isn't explicitly protected within the matched paths, allow access
    // (e.g., allow access to /api/auth/sign-in even though it matches the broader /api/auth/* pattern)
    if (!isProtectedRoute) {
      return NextResponse.next()
    }

    // If the route IS protected and there's no session cookie, deny access
    if (!sessionCookie) {
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
