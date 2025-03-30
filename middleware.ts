import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { authClient } from '@/lib/auth-client'

export async function middleware(request: NextRequest) {
  try {
    // Get session from auth client
    const { data: session, error } = await authClient.getSession()
    
    // Check protected routes
    const isProtectedRoute = [
      '/dashboard',
      '/checkout',
      '/account',
      '/api/auth'
    ].some(path => request.nextUrl.pathname.startsWith(path))

    if (!isProtectedRoute) {
      return NextResponse.next()
    }

    if (error || !session) {
      if (request.nextUrl.pathname.startsWith('/api')) {
        return new Response(
          JSON.stringify({ error: 'Authentication failed' }),
          { status: 401 }
        )
      }
      const signInUrl = new URL('/auth/sign-in', request.url)
      signInUrl.searchParams.set('redirect', request.nextUrl.pathname)
      return NextResponse.redirect(signInUrl)
    }

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
