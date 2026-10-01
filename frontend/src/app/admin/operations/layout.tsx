"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function OperationsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const tabs = [
    { name: 'Exception Center', href: '/admin/operations/exceptions' },
    { name: 'Tokens', href: '/admin/operations/tokens' },
    { name: 'Delivery', href: '/admin/operations/delivery' },
    { name: 'Workflows', href: '/admin/operations/workflows' },
    { name: 'Locations', href: '/admin/operations/locations' },
  ];

  return (
    <div className="max-w-6xl mx-auto w-full animate-in fade-in duration-300 pb-20">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-white tracking-tight">Operations</h1>
        <p className="text-slate-400 mt-2 text-sm">Monitor system exceptions, delivery status, and operational workflows.</p>
      </header>

      <div className="flex overflow-x-auto border-b border-slate-700/50 mb-8 gap-8">
        {tabs.map(tab => {
          const isActive = pathname === tab.href;
          return (
            <Link key={tab.name} href={tab.href}>
              <button 
                className={`pb-4 text-sm font-bold transition-colors whitespace-nowrap flex items-center gap-2 ${isActive ? 'text-indigo-400 border-b-2 border-indigo-400' : 'text-slate-400 hover:text-slate-200'}`}
              >
                {tab.name}
              </button>
            </Link>
          );
        })}
      </div>

      <div className="relative">
        {children}
      </div>
    </div>
  );
}
