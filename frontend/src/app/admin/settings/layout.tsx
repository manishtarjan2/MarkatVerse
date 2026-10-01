"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const tabs = [
    { name: 'Platform', href: '/admin/settings/platform' },
    { name: 'Payment', href: '/admin/settings/payment' },
    { name: 'Authentication', href: '/admin/settings/authentication' },
    { name: 'Commission', href: '/admin/settings/commission' },
    { name: 'Tax', href: '/admin/settings/tax' },
    { name: 'Booking', href: '/admin/settings/booking' },
    { name: 'SEO', href: '/admin/settings/seo' },
    { name: 'Integrations', href: '/admin/settings/integrations' },
  ];

  return (
    <div className="max-w-6xl mx-auto w-full animate-in fade-in duration-300 pb-20">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-white tracking-tight">Settings</h1>
        <p className="text-slate-400 mt-2 text-sm">Configure global platform settings, integrations, and policies.</p>
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
