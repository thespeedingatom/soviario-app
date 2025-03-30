import { Pool } from "pg"
import { auth } from "./lib/auth"
import { User as SupabaseUser } from "@supabase/supabase-js"

type User = SupabaseUser & {
  is_super_admin: boolean;
  raw_user_meta_data: {
    avatar_url: string;
  };
  encrypted_password: string;
  email_confirmed_at: string;
  created_at: string;
  updated_at: string;
  is_anonymous: boolean;
  identities: {
    provider: string;
    identity_data: {
      sub: string;
      email: string;
    };
    created_at: string;
    updated_at: string;
  }[];
}

const migrateFromSupabase = async () => {
  console.log("Starting migration from Supabase Auth to Better Auth...")
  
  const ctx = await auth.$context
  const db = ctx.options.database as Pool
  
  console.log("Fetching users from Supabase Auth...")
  
  // Query users from Supabase Auth schema
  const users = await db
    .query(`
      SELECT
        u.*,
        COALESCE(
          json_agg(
            i.* ORDER BY i.id
          ) FILTER (WHERE i.id IS NOT NULL),
          '[]'::json
        ) as identities
      FROM auth.users u
      LEFT JOIN auth.identities i ON u.id = i.user_id
      GROUP BY u.id
    `)
    .then((res) => res.rows as User[])
  
  console.log(`Found ${users.length} users to migrate.`)
  
  // Migrate each user
  for (const user of users) {
    if (!user.email) {
      console.log(`Skipping user ${user.id} - no email address.`)
      continue
    }
    
    console.log(`Migrating user ${user.email}...`)
    
    // Create user in Better Auth
    try {
      await ctx.adapter
        .create({
          model: "user",
          data: {
            id: user.id,
            email: user.email,
            name: user.email,
            emailVerified: !!user.email_confirmed_at,
            image: user.raw_user_meta_data?.avatar_url,
            createdAt: new Date(user.created_at),
            updatedAt: new Date(user.updated_at),
          },
        })
      
      console.log(`Created user ${user.email} in Better Auth.`)
    } catch (err) {
      console.error(`Error creating user ${user.email}:`, err)
    }
    
    // Migrate identities/accounts
    for (const identity of user.identities || []) {
      const existingAccounts = await ctx.internalAdapter.findAccounts(user.id)

      // Migrate email/password credentials
      if (identity.provider === "email") {
        const hasCredential = existingAccounts.find(
          (account) => account.providerId === "credential",
        )
        if (!hasCredential) {
          try {
            await ctx.adapter
              .create({
                model: "account",
                data: {
                  userId: user.id,
                  providerId: "credential",
                  accountId: user.id,
                  password: user.encrypted_password,
                  createdAt: new Date(user.created_at),
                  updatedAt: new Date(user.updated_at),
                },
              })
            
            console.log(`Created credential account for user ${user.email}.`)
          } catch (err) {
            console.error(`Error creating credential account for user ${user.email}:`, err)
          }
        }
      }
      
      // Migrate social providers
      const supportedProviders = Object.keys(ctx.options.socialProviders || {})
      if (supportedProviders.includes(identity.provider)) {
        const hasAccount = existingAccounts.find(
          (account) => account.providerId === identity.provider,
        )
        if (!hasAccount) {
          try {
            await ctx.adapter.create({
              model: "account",
              data: {
                userId: user.id,
                providerId: identity.provider,
                accountId: identity.identity_data?.sub,
                createdAt: new Date(identity.created_at ?? user.created_at),
                updatedAt: new Date(identity.updated_at ?? user.updated_at),
              },
            })
            
            console.log(`Created ${identity.provider} account for user ${user.email}.`)
          } catch (err) {
            console.error(`Error creating ${identity.provider} account for user ${user.email}:`, err)
          }
        }
      }
    }
    
    console.log(`Completed migration for user ${user.email}.`)
  }
  
  console.log("Migration completed successfully!")
}

// Run the migration
migrateFromSupabase().catch(console.error)
