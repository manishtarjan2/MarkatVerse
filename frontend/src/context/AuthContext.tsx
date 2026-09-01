"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';

type User = {
  id?: string;
  name: string;
  phone: string;
  email?: string;
  role: 'buyer' | 'business' | 'elite' | 'super_admin' | 'catalog_admin' | 'onboarding_admin' | 'support_admin';
  status?: 'active' | 'suspended';
};

type AuthContextType = {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  allUsers: User[];
  updateUserRole: (id: string, role: User['role']) => void;
  deleteUser: (id: string) => void;
  addUser: (user: User) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const mockUsers: User[] = [
  { id: 'u1', name: 'John Doe', phone: '9876543210', email: 'john@example.com', role: 'buyer', status: 'active' },
  { id: 'u2', name: 'Jane Smith', phone: '9123456789', email: 'jane@example.com', role: 'business', status: 'active' },
  { id: 'u3', name: 'Admin Super', phone: '9999999999', email: 'admin@markatverse.com', role: 'super_admin', status: 'active' },
  { id: 'u4', name: 'Elite Buyer', phone: '8888888888', email: 'elite@example.com', role: 'elite', status: 'active' },
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Start with no user to simulate a fresh session where they need to login
  const [user, setUser] = useState<User | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>(mockUsers);

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

  const updateUserRole = (id: string, role: User['role']) => {
    setAllUsers(prev => prev.map(u => u.id === id ? { ...u, role } : u));
    if (user?.id === id) {
      setUser(prev => prev ? { ...prev, role } : null);
    }
  };

  const deleteUser = (id: string) => {
    setAllUsers(prev => prev.filter(u => u.id !== id));
    if (user?.id === id) {
      setUser(null);
    }
  };

  const addUser = (newUser: User) => {
    setAllUsers(prev => [...prev, { ...newUser, id: `u${Date.now()}`, status: 'active' }]);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, allUsers, updateUserRole, deleteUser, addUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
