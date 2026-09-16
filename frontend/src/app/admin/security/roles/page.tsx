"use client";

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { useAdminRole } from '@/context/AdminRoleContext';
import { ShieldAlert, Shield, Users } from 'lucide-react';
import Link from 'next/link';

export default function AdminRolesPage() {
  const { allUsers } = useAuth();
  const { currentAdminRole } = useAdminRole();
  const isSuperAdmin = currentAdminRole === 'super_admin';

  const staffUsers = allUsers.filter(u => u.role?.endsWith('_admin'));

  const roleCounts = {
    super_admin: staffUsers.filter(u => u.role === 'super_admin').length,
    catalog_admin: staffUsers.filter(u => u.role === 'catalog_admin').length,
    onboarding_admin: staffUsers.filter(u => u.role === 'onboarding_admin').length,
    support_admin: staffUsers.filter(u => u.role === 'support_admin').length,
  };

  const roles = [
    {
      id: 'super_admin',
      name: 'Super Admin',
      description: 'Full unrestricted access to all platform features, including security, billing, and system configuration.',
      color: 'rose',
      count: roleCounts.super_admin
    },
    {
      id: 'catalog_admin',
      name: 'Catalog Admin',
      description: 'Can manage categories, products, category relationships, and all marketplace content.',
      color: 'emerald',
      count: roleCounts.catalog_admin
    },
    {
      id: 'onboarding_admin',
      name: 'Onboarding Admin',
      description: 'Manages new seller applications, store subscriptions, and general business verification.',
      color: 'amber',
      count: roleCounts.onboarding_admin
    },
    {
      id: 'support_admin',
      name: 'Support Admin',
      description: 'Handles customer support, live token overrides, refunds, and user management.',
      color: 'blue',
      count: roleCounts.support_admin
    }
  ];

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in duration-300 w-full relative">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Admin Roles</h1>
          <p className="text-slate-400 mt-2 text-sm">View system-defined administrative roles and their current staff allocations.</p>
        </div>
        {isSuperAdmin && (
          <Link href="/admin/users/staff">
            <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-[0_0_15px_rgba(79,70,229,0.3)] hover:shadow-[0_0_25px_rgba(79,70,229,0.5)]">
              Manage Staff
            </button>
          </Link>
        )}
      </header>

      {!isSuperAdmin && (
        <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-xl flex items-center gap-3 mb-8">
          <ShieldAlert className="w-5 h-5" />
          <p className="text-sm font-medium">Only Super Admins can view and manage system roles.</p>
        </div>
      )}

      {isSuperAdmin && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {roles.map(role => (
            <div key={role.id} className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-lg relative overflow-hidden group hover:-translate-y-1 transition-transform">
              <div className={`absolute top-0 right-0 w-32 h-32 bg-${role.color}-500/10 rounded-full blur-3xl group-hover:bg-${role.color}-500/20 transition-colors`}></div>
              
              <div className="flex justify-between items-start mb-4 relative z-10">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl bg-${role.color}-500/20 flex items-center justify-center border border-${role.color}-500/30 text-${role.color}-400`}>
                    <Shield className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">{role.name}</h3>
                    <div className="text-xs text-slate-500 font-mono mt-0.5">{role.id}</div>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-bold border bg-${role.color}-500/10 text-${role.color}-400 border-${role.color}-500/30 flex items-center gap-1`}>
                  <Users className="w-3 h-3" /> {role.count} Staff
                </div>
              </div>
              
              <p className="text-slate-400 text-sm leading-relaxed relative z-10 min-h-[40px]">
                {role.description}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
