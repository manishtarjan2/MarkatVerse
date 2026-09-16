"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import Sidebar from './components/Sidebar';
import { usePathname } from 'next/navigation';
import { useAdminRole, AdminRole } from '@/context/AdminRoleContext';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { currentAdminRole, setCurrentAdminRole } = useAdminRole();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  if (pathname?.startsWith('/admin/login')) {
    return <div className="min-h-screen w-full bg-slate-950 text-slate-100 font-sans flex flex-col">{children}</div>;
  }

  return (
    <div className="min-h-screen w-full bg-slate-900 text-slate-100 flex flex-col lg:flex-row font-sans relative overflow-x-hidden">
      
      {/* Top right role simulator */}
      <div className="hidden lg:flex absolute top-4 right-10 z-50 items-center gap-3 bg-slate-800 p-2 rounded-xl border border-slate-700 shadow-lg">
        <span className="text-xs font-bold text-slate-400 uppercase">Simulate Login As:</span>
        <select
          value={currentAdminRole}
          onChange={(e) => setCurrentAdminRole(e.target.value as AdminRole)}
          className="bg-slate-900 text-emerald-400 text-sm font-bold rounded-lg px-3 py-1 border border-slate-700 focus:outline-none focus:border-emerald-500"
        >
          <option value="super_admin">Super Admin</option>
          <option value="catalog_admin">Catalog Admin (Products/Cats)</option>
          <option value="onboarding_admin">Onboarding Admin (Approvals)</option>
          <option value="support_admin">Support Admin (Users/Overview)</option>
        </select>
      </div>

      {/* Mobile Header */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-slate-950 border-b border-slate-800 shrink-0 sticky top-0 z-40">
        <Link href="/" className="flex items-center no-underline">
          <img src="/logo.png" alt="MarkatVerse" className="h-8 object-contain scale-[2] origin-left brightness-0 invert" />
        </Link>
        <div className="flex items-center gap-4">
          <select
            value={currentAdminRole}
            onChange={(e) => setCurrentAdminRole(e.target.value as AdminRole)}
            className="bg-slate-900 text-emerald-400 text-xs font-bold rounded-lg px-2 py-1 border border-slate-700 focus:outline-none"
          >
            <option value="super_admin">Super</option>
            <option value="catalog_admin">Catalog</option>
            <option value="onboarding_admin">Onboard</option>
            <option value="support_admin">Support</option>
          </select>
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-slate-400 hover:text-white rounded-lg">
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      <Sidebar 
        currentAdminRole={currentAdminRole} 
        isMobileMenuOpen={isMobileMenuOpen} 
        setIsMobileMenuOpen={setIsMobileMenuOpen} 
      />

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-[calc(100vh-65px)] lg:h-screen overflow-y-auto p-4 lg:p-10 relative">
        {/* Pass the role via context or cloneElement if needed, but since we are migrating, pages should fetch their own context. 
            For now, we can render children directly. */}
        {children}
      </main>
    </div>
  );
}
