"use client"

import { auth } from "@/lib/auth"
import { toNextJsHandler } from "better-auth/next-js"

// Create handlers from the auth instance
const handlers = toNextJsHandler(auth.handler)

// Export the specific handlers for Next.js API routes
export const GET = handlers.GET
export const POST = handlers.POST
