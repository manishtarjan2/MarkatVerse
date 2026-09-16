"use client";

import React from 'react';
import { useAdminRole } from '@/context/AdminRoleContext';
import { ShieldAlert, Check, X, ShieldCheck } from 'lucide-react';

export default function AdminPermissionsPage() {
  const { currentAdminRole } = useAdminRole();
  const isSuperAdmin = currentAdminRole === 'super_admin';

  const permissions = [
    { section: 'Dashboard Overview', super_admin: true, catalog_admin: true, onboarding_admin: true, support_admin: true },
    { section: 'Users & Customers', super_admin: true, catalog_admin: false, onboarding_admin: false, support_admin: true },
    { section: 'Internal Staff (Add/Remove)', super_admin: true, catalog_admin: false, onboarding_admin: false, support_admin: false },
    { section: 'Businesses & Storefronts', super_admin: true, catalog_admin: false, onboarding_admin: true, support_admin: false },
    { section: 'Marketplace (Products/Categories)', super_admin: true, catalog_admin: true, onboarding_admin: false, support_admin: false },
    { section: 'Category Relations & Workflows', super_admin: true, catalog_admin: true, onboarding_admin: false, support_admin: false },
    { section: 'Transactions (Orders, Bookings)', super_admin: true, catalog_admin: false, onboarding_admin: false, support_admin: true },
    { section: 'Wallet & Payouts (Modify)', super_admin: true, catalog_admin: false, onboarding_admin: false, support_admin: false },
    { section: 'Commercial (Subscriptions, Commission)', super_admin: true, catalog_admin: false, onboarding_admin: true, support_admin: false },
    { section: 'Operations (Tokens & Delivery)', super_admin: true, catalog_admin: false, onboarding_admin: false, support_admin: true },
    { section: 'Customer Support (Tickets, Disputes)', super_admin: true, catalog_admin: false, onboarding_admin: false, support_admin: true },
    { section: 'Content (CMS, Banners, SEO)', super_admin: true, catalog_admin: true, onboarding_admin: false, support_admin: false },
    { section: 'Security (Roles, Permissions)', super_admin: true, catalog_admin: false, onboarding_admin: false, support_admin: false },
    { section: 'Settings (Global Platform Toggles)', super_admin: true, catalog_admin: false, onboarding_admin: false, support_admin: false },
  ];

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in duration-300 w-full relative">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Permissions Matrix</h1>
          <p className="text-slate-400 mt-2 text-sm">Visual overview of Role-Based Access Control (RBAC) boundaries across the platform.</p>
        </div>
      </header>

      {!isSuperAdmin && (
        <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-xl flex items-center gap-3 mb-8">
          <ShieldAlert className="w-5 h-5" />
          <p className="text-sm font-medium">Only Super Admins can view the system permissions matrix.</p>
        </div>
      )}

      {isSuperAdmin && (
        <div className="bg-slate-800 rounded-2xl border border-slate-700 shadow-lg overflow-hidden">
          <div className="p-6 border-b border-slate-700 flex items-center gap-3 bg-slate-900/50">
            <ShieldCheck className="w-6 h-6 text-indigo-400" />
            <h3 className="text-xl font-bold text-white">System Access Configuration</h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-900 border-b border-slate-700 text-slate-300 text-xs font-bold">
                <tr>
                  <th className="p-4 pl-6 border-r border-slate-700/50 w-1/3">Feature / Section</th>
                  <th className="p-4 text-center border-r border-slate-700/50">Super Admin</th>
                  <th className="p-4 text-center border-r border-slate-700/50">Catalog Admin</th>
                  <th className="p-4 text-center border-r border-slate-700/50">Onboarding Admin</th>
                  <th className="p-4 text-center">Support Admin</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50 text-sm">
                {permissions.map((perm, idx) => (
                  <tr key={idx} className="hover:bg-slate-700/30 transition-all">
                    <td className="p-4 pl-6 font-medium text-slate-200 border-r border-slate-700/50">
                      {perm.section}
                    </td>
                    <td className="p-4 border-r border-slate-700/50">
                      <div className="flex justify-center">
                        {perm.super_admin ? <Check className="w-5 h-5 text-emerald-400" /> : <X className="w-5 h-5 text-rose-500 opacity-50" />}
                      </div>
                    </td>
                    <td className="p-4 border-r border-slate-700/50">
                      <div className="flex justify-center">
                        {perm.catalog_admin ? <Check className="w-5 h-5 text-emerald-400" /> : <X className="w-5 h-5 text-rose-500 opacity-50" />}
                      </div>
                    </td>
                    <td className="p-4 border-r border-slate-700/50">
                      <div className="flex justify-center">
                        {perm.onboarding_admin ? <Check className="w-5 h-5 text-emerald-400" /> : <X className="w-5 h-5 text-rose-500 opacity-50" />}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex justify-center">
                        {perm.support_admin ? <Check className="w-5 h-5 text-emerald-400" /> : <X className="w-5 h-5 text-rose-500 opacity-50" />}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-4 bg-slate-900/80 border-t border-slate-700 text-xs text-slate-500 text-center">
            These permissions are hard-coded into the system context and cannot be modified without code-level changes.
          </div>
        </div>
      )}
    </div>
  );
}
