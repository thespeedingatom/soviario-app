"use client"

import type React from "react";
import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation"; // Import useRouter
import type { ShopifySessionData } from "@/lib/shopify-auth"; // Import the session data type

// Define the shape of the user object based on ShopifySessionData.customer
interface ShopifyUser {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  // Add any other fields you expect from Shopify customer data
}

type AuthContextType = {
  user: ShopifyUser | null;
  session: ShopifySessionData | null; // Full session data from our API
  isPending: boolean;
  // These functions will now mostly redirect or are placeholders
  signUp: () => Promise<void>; // Shopify handles sign-up on their page
  signIn: () => Promise<void>; // Redirects to Shopify login
  signInWithGoogle: () => Promise<void>; // Also redirects to Shopify login
  signOut: () => Promise<void>;
  resetPassword: () => Promise<void>; // Shopify handles this
  sendVerificationEmail: () => Promise<void>; // Shopify handles this
  isAuthenticated: () => boolean;
  fetchSession: () => Promise<void>; // Function to manually refresh session
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [sessionData, setSessionData] = useState<ShopifySessionData | null>(null);
  const [isPending, setIsPending] = useState(true);

  const fetchSession = useCallback(async () => {
    setIsPending(true);
    try {
      const response = await fetch('/api/auth/shopify/session');
      if (response.ok) {
        const data: ShopifySessionData = await response.json();
        setSessionData(data);
      } else {
        setSessionData({ isLoggedIn: false }); // Set to default logged out state
      }
    } catch (error) {
      console.error("Failed to fetch session:", error);
      setSessionData({ isLoggedIn: false });
    } finally {
      setIsPending(false);
    }
  }, []);

  useEffect(() => {
    fetchSession();
  }, [fetchSession]);

  const user = sessionData?.isLoggedIn ? (sessionData.customer as ShopifyUser) || null : null;

  // Simplified auth functions for Shopify flow
  const signUp = async () => {
    // Shopify's login page handles sign-up. Redirect there.
    router.push('/api/auth/shopify/login');
  };

  const signIn = async () => {
    router.push('/api/auth/shopify/login');
  };

  const signInWithGoogle = async () => {
    // Shopify's login page should handle Google Sign-In if configured
    router.push('/api/auth/shopify/login');
  };

  const signOutWrapper = async () => {
    setIsPending(true);
    try {
      // Call our backend logout, which then calls Shopify's logout and clears session
      await fetch('/api/auth/shopify/logout', { method: 'POST' }); // Or GET, depending on your route
      setSessionData({ isLoggedIn: false }); // Clear local session state
      router.push('/'); // Redirect to home
    } catch (err) {
      console.error("Error in signOut:", err);
      // Handle error if needed
    } finally {
      setIsPending(false);
    }
  };

  const resetPassword = async () => {
    // This is typically handled on Shopify's domain.
    // You might redirect to a Shopify-specific URL or provide instructions.
    alert("Password reset is handled by Shopify. Please look for a 'Forgot Password?' link on the Shopify login page.");
    // Optionally, redirect to the login page where they might find it.
    // router.push('/api/auth/shopify/login');
  };

  const sendVerificationEmail = async () => {
    // Email verification is handled by Shopify as part of their account creation.
    alert("Email verification is handled by Shopify during account creation.");
  };
  
  const isAuthenticated = () => {
    return !!sessionData?.isLoggedIn;
  };

  const value: AuthContextType = {
    user,
    session: sessionData,
    isPending,
    signUp,
    signIn,
    signInWithGoogle,
    signOut: signOutWrapper,
    resetPassword,
    sendVerificationEmail,
    isAuthenticated,
    fetchSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Remove useBetterAuth export
// export const useBetterAuth = authClient.useSession
