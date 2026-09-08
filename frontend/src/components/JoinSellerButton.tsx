"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

export default function JoinSellerButton() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  const isSeller = user?.role === 'business' || user?.role === 'SELLER';
  const targetUrl = isSeller ? '/seller/dashboard' : '/seller/onboarding';

  // If a logged-in seller clicks this, instantly navigate to dashboard
  useEffect(() => {
    // nothing to do here — navigation happens via the Link href
  }, []);

  // While auth is resolving, show a neutral placeholder
  if (isLoading) {
    return (
      <button
        disabled
        className="bg-white/30 backdrop-blur text-[#0f1928]/50 border-2 border-[#0f1928]/20 px-6 py-3 rounded-xl font-bold cursor-wait animate-pulse">
        Loading…
      </button>
    );
  }

  return (
    <Link href={targetUrl}>
      <button
        className={`px-6 py-3 rounded-xl font-bold transition-all border-2 ${
          isSeller
            ? 'bg-[#0f1928] text-white border-[#0f1928] hover:bg-slate-800 shadow-lg'
            : 'bg-white/50 backdrop-blur hover:bg-white text-[#0f1928] border-[#0f1928]'
        }`}>
        {isSeller ? '🏪 Go to Dashboard →' : 'Join as Seller'}
      </button>
    </Link>
  );
}
