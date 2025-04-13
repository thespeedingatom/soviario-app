import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
// import { getSessionCookie } from 'better-auth/cookies' // Removed old auth import

export async function middleware(request: NextRequest) {
  try {
    // Check for the Saleor access token cookie
    const accessToken = request.cookies.get('saleor-access-token')?.value;
    const isAuthenticated = !!accessToken; // Basic check: token exists

    // Define protected routes and auth routes
    const protectedPaths = ['/dashboard', '/checkout', '/account']; // Add other protected paths
    const authPaths = ['/auth/sign-in', '/auth/sign-up', '/auth/forgot-password', '/auth/reset-password']; // Auth flow pages
    const currentPath = request.nextUrl.pathname;

    const isProtectedRoute = protectedPaths.some(path => currentPath.startsWith(path));
    const isAuthRoute = authPaths.some(path => currentPath.startsWith(path));

    // If accessing a protected route and not authenticated, redirect to sign-in
    if (isProtectedRoute && !isAuthenticated) {
      const signInUrl = new URL('/auth/sign-in', request.url);
      signInUrl.searchParams.set('redirect', currentPath); // Pass redirect path
      return NextResponse.redirect(signInUrl);
    }

    // If accessing an auth route and already authenticated, redirect to dashboard
    if (isAuthRoute && isAuthenticated) {
      const dashboardUrl = new URL('/dashboard', request.url);
      return NextResponse.redirect(dashboardUrl);
    }

    // Allow the request to proceed if none of the above conditions are met
    return NextResponse.next();

  } catch (error) {
    console.error('Middleware error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500 }
    )
  }
}

// Matcher config - Apply middleware to relevant paths
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes - unless specific API routes need auth protection)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public assets (e.g., /images/)
     */
    '/((?!api|_next/static|_next/image|images|favicon.ico).*)',
    // Include specific API routes if they need auth protection via middleware
    // '/api/protected-route/:path*',
  ],
};
