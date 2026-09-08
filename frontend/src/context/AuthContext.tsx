"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

type User = {
  id?: string;
  name: string;
  phone: string;
  email?: string;
  role: 'buyer' | 'business' | 'elite' | 'super_admin' | 'catalog_admin' | 'onboarding_admin' | 'support_admin' | 'CONSUMER' | 'SELLER' | 'ADMIN';
  status?: 'active' | 'suspended';
  business?: any;
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  login: (user: User, token?: string) => void;
  logout: () => void;
  allUsers: User[];
  updateUserRole: (id: string, role: User['role']) => void;
  deleteUser: (id: string) => void;
  addUser: (user: User) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true); // true until token is verified

  // On mount: try to restore session from localStorage token
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setIsLoading(false);
      return;
    }

    fetch(`${API_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => {
        if (!res.ok) throw new Error('Token invalid');
        return res.json();
      })
      .then(data => {
        setUser({
          id: data.id,
          name: data.name,
          email: data.email,
          phone: data.phone || '',
          role: data.role?.toLowerCase() as User['role'],
          status: 'active',
          business: data.business,
        });
      })
      .catch(() => {
        // Token expired or invalid — clear it
        localStorage.removeItem('token');
      })
      .finally(() => setIsLoading(false));
  }, []);

  const login = (userData: User, token?: string) => {
    if (token) {
      localStorage.setItem('token', token);
    }
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
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
      logout();
    }
  };

  const addUser = (newUser: User) => {
    setAllUsers(prev => [...prev, { ...newUser, id: `u${Date.now()}`, status: 'active' }]);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, allUsers, updateUserRole, deleteUser, addUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
