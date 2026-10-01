"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AnalyticsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const tabs = [
    { name: 'Economic Engine', href: '/admin/analytics' },
    { name: 'Marketplace', href: '/admin/analytics/marketplace' },
    { name: 'Sales', href: '/admin/analytics/sales' },
    { name: 'Services', href: '/admin/analytics/services' },
    { name: 'Customers', href: '/admin/analytics/customers' },
    { name: 'Finance', href: '/admin/analytics/finance' },
  ];

  return (
    <div className="max-w-6xl mx-auto w-full animate-in fade-in duration-300 pb-20">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-white tracking-tight">Analytics</h1>
        <p className="text-slate-400 mt-2 text-sm">View comprehensive platform analytics and performance metrics.</p>
      </header>

      <div className="flex overflow-x-auto border-b border-slate-700/50 mb-8 gap-8">
        {tabs.map(tab => {
          // Special handling for the root analytics tab to avoid matching everything
          const isActive = tab.href === '/admin/analytics' 
            ? pathname === '/admin/analytics' 
            : pathname.startsWith(tab.href);
            
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
