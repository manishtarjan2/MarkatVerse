"use client";
import React, { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  if (!user) return null;

  return (
    <div className="max-w-[800px] mx-auto p-10 min-h-[60vh] text-white">
      <h1 className="text-3xl font-medium mb-8">My Profile</h1>
      
      <div className="bg-slate-800 p-8 rounded-xl border border-slate-700">
        <div className="flex items-center gap-6 mb-8 pb-8 border-b border-slate-700">
          <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-3xl font-bold">
            {user.name.charAt(0)}
          </div>
          <div>
            <h2 className="text-2xl font-bold">{user.name}</h2>
            <p className="text-slate-400">{user.email || 'No email provided'}</p>
            <p className="text-slate-400 mt-1">Phone: +91 {user.phone}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <Link href="/wishlist">
            <div className="bg-slate-900 p-5 rounded-lg border border-slate-700 hover:border-blue-500 cursor-pointer transition-colors">
              <div className="text-xl mb-2">❤️</div>
              <div className="font-medium">My Wishlist</div>
              <div className="text-xs text-slate-400 mt-1">View saved items</div>
            </div>
          </Link>
          <div className="bg-slate-900 p-5 rounded-lg border border-slate-700 hover:border-blue-500 cursor-pointer transition-colors">
            <div className="text-xl mb-2">📦</div>
            <div className="font-medium">My Orders</div>
            <div className="text-xs text-slate-400 mt-1">Track & manage orders</div>
          </div>
        </div>

        <button 
          onClick={() => {
            logout();
            router.push('/');
          }}
          className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors border-none cursor-pointer"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}
