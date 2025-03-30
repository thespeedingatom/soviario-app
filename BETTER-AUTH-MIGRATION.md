# Migrating from Supabase Auth to Better Auth

This document outlines the steps to migrate from Supabase Auth to Better Auth in this Next.js application.

## Why Better Auth?

Better Auth is a framework-agnostic authentication library for TypeScript that offers more flexibility and features than Supabase Auth:

- **Framework-agnostic**: Works with any TypeScript framework
- **Comprehensive features**: Email/password, social login, 2FA, session management
- **Plugin ecosystem**: Easily add advanced features like multi-tenancy
- **Database control**: Direct access to your auth database
- **Highly customizable**: More control over the authentication flow

## Prerequisites

Before starting the migration, ensure you have:

1. A PostgreSQL database (can be the same one used by Supabase)
2. Environment variables set up (see `.env.example`)
3. Google OAuth credentials (if using Google sign-in)

## Migration Steps

### 1. Install Dependencies

```bash
npm install better-auth pg
npm install -D @types/pg
```

### 2. Run Database Migrations

Better Auth needs to create its own tables in your database:

```bash
npx @better-auth/cli migrate
```

This will create the following tables in your database:
- `user`
- `account`
- `session`
- `verification`

### 3. Migrate Users

Run the migration script to transfer users from Supabase Auth to Better Auth:

```bash
npx ts-node migration.ts
```

This script:
- Fetches all users from the Supabase Auth schema
- Creates corresponding users in Better Auth
- Migrates email/password credentials
- Migrates social provider connections

### 4. Update Environment Variables

Ensure your `.env` file contains the necessary variables:

```
DATABASE_URL=postgres://postgres:postgres@localhost:5432/your_database
NEXT_PUBLIC_SITE_URL=http://localhost:3000
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
BETTER_AUTH_SECRET=your-better-auth-secret
```

## Code Changes

The migration involves several code changes:

### 1. Auth Configuration

A new `lib/auth.ts` file configures Better Auth:

```typescript
import { betterAuth } from "better-auth"
import { Pool } from "pg"
import { nextCookies } from "better-auth/next-js"

export const auth = betterAuth({
  database: new Pool({
    connectionString: process.env.DATABASE_URL
  }),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      redirectUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    }
  },
  plugins: [
    nextCookies()
  ]
})
```

### 2. Auth Client

A new `lib/auth-client.ts` file creates the client-side auth client:

```typescript
import { createAuthClient } from "better-auth/react"

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_SITE_URL,
})

export const { 
  signIn, 
  signUp, 
  signOut, 
  useSession,
  getSession,
  resetPassword
} = authClient
```

### 3. API Route

A new API route at `app/api/auth/[...all]/route.ts` handles auth requests:

```typescript
import { auth } from "@/lib/auth"
import { toNextJsHandler } from "better-auth/next-js"

export const { GET, POST } = toNextJsHandler(auth.handler)
```

### 4. Auth Context

The `contexts/auth-context.tsx` file has been updated to use Better Auth while maintaining the same API for backward compatibility.

### 5. Middleware

The `middleware.ts` file has been updated to use Better Auth for route protection.

## Using Better Auth

### Client-Side Authentication

```typescript
// Sign up
const result = await authClient.signUp.email({
  email: "user@example.com",
  password: "password123",
  data: { name: "User Name" }
})

// Sign in with email/password
const result = await authClient.signIn.email({
  email: "user@example.com",
  password: "password123"
})

// Sign in with Google
const result = await authClient.signIn.social({
  provider: "google"
})

// Sign out
await authClient.signOut()

// Get session
const session = await authClient.getSession()

// Use session hook
const { data: session, isPending } = authClient.useSession()
```

### Server-Side Authentication

```typescript
// In a server component
import { auth } from "@/lib/auth"
import { headers } from "next/headers"

const session = await auth.api.getSession({
  headers: await headers()
})

// In a server action
"use server"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"

export async function protectedAction() {
  const session = await auth.api.getSession({
    headers: await headers()
  })
  
  if (!session) {
    throw new Error("Not authenticated")
  }
  
  // Perform protected action
}
```

## Additional Features

Better Auth offers many additional features that can be added as needed:

1. Two-factor authentication
2. Organization/team management
3. Role-based access control
4. Custom authentication flows
5. Advanced session management

Refer to the [Better Auth documentation](https://better-auth.com/docs) for more information.
