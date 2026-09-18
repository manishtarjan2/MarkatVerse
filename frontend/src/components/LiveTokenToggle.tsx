"use client";
import React, { useState, useEffect } from 'react';
import { Ticket } from 'lucide-react';
import Link from 'next/link';

export default function LiveTokenToggle() {
  const [hasToken, setHasToken] = useState(false);

  const checkToken = () => {
    setHasToken(!!localStorage.getItem('markatverse_active_token_id'));
  };

  useEffect(() => {
    checkToken();
    window.addEventListener('storage', checkToken);
    
    // Quick polling to check if token exists (in case widget modifies it without storage event)
    const interval = setInterval(checkToken, 2000);
    return () => {
      window.removeEventListener('storage', checkToken);
      clearInterval(interval);
    };
  }, []);



  if (!hasToken) return null;

  return (
    <Link 
      href="/salon/token/active"
      className="ml-2 hidden sm:flex flex-col items-center gap-1 cursor-pointer relative hover:text-emerald-600 transition-colors group"
    >
      <span className="relative flex h-2.5 w-2.5 absolute -top-0.5 -right-1">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 border border-white"></span>
      </span>
      <Ticket className="w-5 h-5 text-emerald-600 group-hover:scale-110 transition-transform" strokeWidth={1.5} />
      <span className="text-[11px] font-medium text-emerald-600">Token</span>
    </Link>
  );
}
