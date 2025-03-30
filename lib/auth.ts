"use server"

import { betterAuth } from "better-auth"
import { Pool } from "pg"
import { nextCookies } from "better-auth/next-js"


export const auth = betterAuth({
  // Connect to the existing Supabase PostgreSQL database
  database: new Pool({
    connectionString: process.env.DATABASE_URL
  }),
  // Enable email/password authentication
  emailAndPassword: {
    enabled: true,
  },
  // Configure social providers (Google in this case)
  socialProviders: {
    google: {
      // Google Client ID
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      // Google Client Secret
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      // Where to redirect after authentication
      redirectUrl: `${process.env.NEXT_PUBLIC_SITE_URL || ""}/dashboard`,
    }
  },
  // Add plugins as needed
  plugins: [
    nextCookies() // For handling cookies in Next.js server actions
  ],
  // Session configuration
  session: {
    // Map Supabase session fields to Better Auth fields if needed
    fields: {
      expiresAt: "expires", // Map expiresAt to expires
      token: "sessionToken" // Map token to sessionToken
    }
  },
  // Accounts configuration
  accounts: {
    // Map Supabase account fields to Better Auth fields if needed
    fields: {
      accountId: "providerAccountId",
      refreshToken: "refresh_token",
      accessToken: "access_token",
      accessTokenExpiresAt: "access_token_expires",
      idToken: "id_token",
    }
  }
})

// Export the type of the auth instance for type inference
export type Auth = typeof auth
