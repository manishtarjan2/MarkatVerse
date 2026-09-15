"use client";
import React from 'react';
import { CartProvider } from './CartContext';
import { ProductProvider } from './ProductContext';
import { AuthProvider } from './AuthContext';
import { SettingsProvider } from './SettingsContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SettingsProvider>
      <AuthProvider>
        <ProductProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </ProductProvider>
      </AuthProvider>
    </SettingsProvider>
  );
}
