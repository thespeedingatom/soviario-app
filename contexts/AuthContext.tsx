'use client';

import React, { createContext, useContext, ReactNode } from 'react';

// Define the shape of the user data you expect from Saleor's 'me' query
// Adjust this based on the fields you query in saleorGetCurrentUser
interface User {
  id: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  // Add other relevant user fields
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  // Potentially add loading state if fetching client-side later
  // isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
  initialUser: User | null; // User data fetched server-side
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children, initialUser }) => {
  const user = initialUser;
  const isAuthenticated = !!user;

  // You could add logic here for client-side fetching or token refresh checks if needed,
  // but for RSC-first approach, relying on server-fetched initialUser is common.

  return (
    <AuthContext.Provider value={{ user, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
