"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function JoinSellerButton() {
  const { user } = useAuth();
  
  const isSeller = user?.role === 'business' || user?.role === 'SELLER';
  const targetUrl = isSeller ? '/seller/dashboard' : '/seller/onboarding';

  return (
    <Link href={targetUrl}>
      <button className="bg-white/50 backdrop-blur hover:bg-white text-[#0f1928] border-2 border-[#0f1928] px-6 py-3 rounded-xl font-bold transition-all">
        {isSeller ? 'Seller Dashboard' : 'Join as Seller'}
      </button>
    </Link>
  );
}
