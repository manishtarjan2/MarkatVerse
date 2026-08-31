"use client";
import React, { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function WishlistPage() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  if (!user) return null;

  return (
    <div className="max-w-[1200px] mx-auto p-10 min-h-[60vh] text-white">
      <h1 className="text-3xl font-medium mb-8">My Wishlist</h1>
      <div className="bg-slate-800 p-10 rounded-xl border border-slate-700 text-center">
        <div className="text-5xl mb-4">❤️</div>
        <h2 className="text-xl font-medium mb-2">Your wishlist is empty</h2>
        <p className="text-slate-400 mb-6">Save items you like and they will show up here.</p>
        <Link href="/">
          <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors border-none cursor-pointer">
            Explore Products
          </button>
        </Link>
      </div>
    </div>
  );
}
