"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, ShoppingCart, User, Grid, Store } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

export default function BottomNav() {
  const pathname = usePathname();
  const { items } = useCart();
  const { user } = useAuth();
  const cartItemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const isActive = (path: string) => pathname === path;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex items-center justify-around py-2 px-1 z-[100] shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
      <Link href="/" className={`flex flex-col items-center gap-1 p-2 ${isActive('/') ? 'text-blue-600' : 'text-slate-500 hover:text-blue-500'}`}>
        <Home className="w-5 h-5" strokeWidth={isActive('/') ? 2 : 1.5} />
        <span className="text-[10px] font-medium">Home</span>
      </Link>
      
      <Link href="/categories" className={`flex flex-col items-center gap-1 p-2 ${isActive('/categories') ? 'text-blue-600' : 'text-slate-500 hover:text-blue-500'}`}>
        <Grid className="w-5 h-5" strokeWidth={isActive('/categories') ? 2 : 1.5} />
        <span className="text-[10px] font-medium">Categories</span>
      </Link>

      <Link href="/cart" className={`flex flex-col items-center gap-1 p-2 relative ${isActive('/cart') ? 'text-blue-600' : 'text-slate-500 hover:text-blue-500'}`}>
        {cartItemCount > 0 && (
          <div className="absolute top-1 right-2 bg-amber-400 text-slate-900 font-bold text-[9px] py-[1px] px-[5px] rounded-full border border-white leading-none">
            {cartItemCount}
          </div>
        )}
        <ShoppingCart className="w-5 h-5" strokeWidth={isActive('/cart') ? 2 : 1.5} />
        <span className="text-[10px] font-medium">Cart</span>
      </Link>

      {user ? (
        <Link href="/profile" className={`flex flex-col items-center gap-1 p-2 ${pathname?.startsWith('/profile') ? 'text-blue-600' : 'text-slate-500 hover:text-blue-500'}`}>
          <User className="w-5 h-5" strokeWidth={pathname?.startsWith('/profile') ? 2 : 1.5} />
          <span className="text-[10px] font-medium">Profile</span>
        </Link>
      ) : (
        <Link href="/login" className={`flex flex-col items-center gap-1 p-2 ${isActive('/login') ? 'text-blue-600' : 'text-slate-500 hover:text-blue-500'}`}>
          <User className="w-5 h-5" strokeWidth={isActive('/login') ? 2 : 1.5} />
          <span className="text-[10px] font-medium">Sign In</span>
        </Link>
      )}
    </div>
  );
}
