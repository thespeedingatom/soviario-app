"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  // Add other fields that your session endpoint might return,
  // aligning with ShopifySessionData.customer
}

interface ShopifyAuthContextType {
  user: User | null;
  isLoading: boolean;
  login: () => void;
  logout: () => Promise<void>;
}

const ShopifyAuthContext = createContext<ShopifyAuthContextType | undefined>(undefined);

export const ShopifyAuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/auth/shopify/session');
        if (response.ok) {
          const data = await response.json();
          setUser(data.user || null); // Assuming the session endpoint returns { user: User | null }
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Failed to fetch Shopify session:", error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSession();
  }, []);

  const login = () => {
    // Redirect to the Shopify login initiation URL
    window.location.href = '/api/auth/shopify/login';
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/shopify/logout', { method: 'POST' });
      if (response.ok) {
        setUser(null);
      } else {
        console.error("Logout failed:", await response.text());
        // Optionally, still clear user client-side or show error
      }
    } catch (error) {
      console.error("Error during logout:", error);
    } finally {
      // Even if logout API fails, clear client-side user for better UX
      setUser(null); 
      setIsLoading(false);
      // Optionally redirect to home or login page after logout
      // window.location.href = '/'; 
    }
  };

  return (
    <ShopifyAuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </ShopifyAuthContext.Provider>
  );
};

export const useShopifyAuth = () => {
  const context = useContext(ShopifyAuthContext);
  if (context === undefined) {
    throw new Error('useShopifyAuth must be used within a ShopifyAuthProvider');
  }
  return context;
};
