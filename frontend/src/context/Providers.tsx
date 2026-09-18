"use client";
import React from 'react';
import { CartProvider } from './CartContext';
import { ProductProvider } from './ProductContext';
import { AuthProvider } from './AuthContext';
import { SettingsProvider } from './SettingsContext';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AdminRoleProvider } from './AdminRoleContext';
import { WishlistProvider } from './WishlistContext';

export function Providers({ children }: { children: React.ReactNode }) {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID_HERE';
  return (
    <GoogleOAuthProvider clientId={clientId}>
      <AdminRoleProvider>
        <SettingsProvider>
          <AuthProvider>
            <ProductProvider>
              <WishlistProvider>
                <CartProvider>
                  {children}
                </CartProvider>
              </WishlistProvider>
            </ProductProvider>
          </AuthProvider>
        </SettingsProvider>
      </AdminRoleProvider>
    </GoogleOAuthProvider>
  );
}
