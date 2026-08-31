"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';

type User = {
  name: string;
  phone: string;
  email?: string;
  role: 'buyer' | 'business' | 'admin';
};

type AuthContextType = {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Start with no user to simulate a fresh session where they need to login
  const [user, setUser] = useState<User | null>(null);

  // In a real app, we might check localStorage or a token cookie here on mount
  useEffect(() => {
    // For this MVP, we just leave them logged out initially.
  }, []);

  const login = (userData: User) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
