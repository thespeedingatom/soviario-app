import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"

export async function middleware(request: NextRequest) {
  // Create a Supabase client for server-side operations
  const supabase = createServerSupabaseClient()

  // Get the pathname from the request URL
  const { pathname } = request.nextUrl

  // Check if the path is a protected route
  const isProtectedRoute =
    pathname.startsWith("/dashboard") || pathname.startsWith("/checkout") || pathname.startsWith("/account")

  // If it's not a protected route, continue
  if (!isProtectedRoute) {
    return NextResponse.next()
  }

  try {
    // Get the session from the request cookies
    const {
      data: { session },
    } = await supabase.auth.getSession()

    // If there's no session and the route is protected, redirect to sign-in
    if (!session && isProtectedRoute) {
      const redirectUrl = new URL("/auth/sign-in", request.url)
      redirectUrl.searchParams.set("redirect", pathname)
      return NextResponse.redirect(redirectUrl)
    }

    // If there's a session, continue to the requested page
    return NextResponse.next()
  } catch (error) {
    console.error("Middleware auth error:", error)

    // If there's an error, redirect to sign-in
    const redirectUrl = new URL("/auth/sign-in", request.url)
    redirectUrl.searchParams.set("redirect", pathname)
    return NextResponse.redirect(redirectUrl)
  }
}

// Configure the middleware to run on specific paths
export const config = {
  matcher: ["/dashboard/:path*", "/checkout/:path*", "/account/:path*"],
}

