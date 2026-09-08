"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function JoinSellerButton() {
  const { user, isLoading } = useAuth();

  // role can be stored as 'seller', 'SELLER', or 'business' depending on login path
  const isSeller = ['seller', 'SELLER', 'business'].includes(user?.role ?? '');
  const targetUrl = isSeller ? '/seller/dashboard' : '/seller/onboarding';

  // While auth is resolving, show a skeleton so no wrong label flashes
  if (isLoading) {
    return (
      <button
        disabled
        className="bg-white/30 backdrop-blur text-[#0f1928]/40 border-2 border-[#0f1928]/20 px-6 py-3 rounded-xl font-bold cursor-wait animate-pulse min-w-[160px]">
        &nbsp;
      </button>
    );
  }

  return (
    <Link href={targetUrl}>
      <button
        className={`px-6 py-3 rounded-xl font-bold transition-all border-2 ${
          isSeller
            ? 'bg-[#0f1928] text-white border-[#0f1928] hover:bg-slate-700 shadow-lg'
            : 'bg-white/50 backdrop-blur hover:bg-white text-[#0f1928] border-[#0f1928]'
        }`}>
        {isSeller ? '🏪 Seller Dashboard →' : 'Join as Seller'}
      </button>
    </Link>
  );
}
