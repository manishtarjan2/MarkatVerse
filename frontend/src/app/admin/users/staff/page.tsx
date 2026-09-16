"use client";

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useAdminRole } from '@/context/AdminRoleContext';
import { ShieldAlert, Users, Plus, Trash2, Mail, Phone, UserCheck, Shield } from 'lucide-react';

export default function AdminStaffUsersPage() {
  const { allUsers, addUser, deleteUser, updateUserRole } = useAuth();
  const { currentAdminRole, canEdit } = useAdminRole();
  
  // Only Super Admins should manage internal staff
  const isSuperAdmin = currentAdminRole === 'super_admin';
  
  const staffUsers = allUsers.filter(u => u.role?.endsWith('_admin'));

  const [isAdding, setIsAdding] = useState(false);
  const [newStaff, setNewStaff] = useState({ name: '', email: '', phone: '', role: 'catalog_admin' });

  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSuperAdmin) return;
    
    if (newStaff.name && (newStaff.email || newStaff.phone)) {
      addUser(newStaff as any);
      setIsAdding(false);
      setNewStaff({ name: '', email: '', phone: '', role: 'catalog_admin' });
    } else {
      alert("Name and at least one contact method (email/phone) are required.");
    }
  };

  const handleRoleChange = (id: string, newRole: string) => {
    if (!isSuperAdmin) return;
    updateUserRole(id, newRole as any);
  };

  const handleDelete = (id: string) => {
    if (!isSuperAdmin) return;
    if (confirm("Are you sure you want to revoke access for this staff member?")) {
      deleteUser(id);
    }
  };

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in duration-300 w-full relative">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Internal Staff</h1>
          <p className="text-slate-400 mt-2 text-sm">Onboard internal team members and assign administrative roles.</p>
        </div>
        {isSuperAdmin && (
          <button 
            onClick={() => setIsAdding(!isAdding)}
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-[0_0_15px_rgba(79,70,229,0.3)] hover:shadow-[0_0_25px_rgba(79,70,229,0.5)] flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Onboard Staff
          </button>
        )}
      </header>

      {!isSuperAdmin && (
        <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-xl flex items-center gap-3 mb-8">
          <ShieldAlert className="w-5 h-5" />
          <p className="text-sm font-medium">Only Super Admins can view and manage internal staff accounts.</p>
        </div>
      )}

      {isAdding && isSuperAdmin && (
        <div className="bg-slate-800 p-6 rounded-2xl border border-indigo-500/50 shadow-lg mb-8 animate-in slide-in-from-top-4">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-indigo-400" /> Generate Staff Account
          </h3>
          <form onSubmit={handleAddStaff} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase">Full Name</label>
              <input 
                type="text" 
                required
                value={newStaff.name}
                onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500" 
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase">Email Address</label>
              <input 
                type="email" 
                value={newStaff.email}
                onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500" 
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase">Admin Role</label>
              <select 
                value={newStaff.role}
                onChange={(e) => setNewStaff({ ...newStaff, role: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="catalog_admin">Catalog Admin</option>
                <option value="onboarding_admin">Onboarding Admin</option>
                <option value="support_admin">Support Admin</option>
                <option value="super_admin">Super Admin</option>
              </select>
            </div>
            <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-6 py-2 rounded-lg transition-colors h-[42px]">
              Create Account
            </button>
          </form>
        </div>
      )}

      {isSuperAdmin && (
        <div className="bg-slate-800 rounded-2xl border border-slate-700 shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-900 border-b border-slate-700 text-slate-400 text-[10px] uppercase tracking-widest font-black">
                <tr>
                  <th className="p-4 pl-6">Staff Member</th>
                  <th className="p-4">Contact</th>
                  <th className="p-4">Assigned Role</th>
                  <th className="p-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {staffUsers.map((staff) => (
                  <tr key={staff.id} className="hover:bg-slate-700/30 transition-all group">
                    <td className="p-4 pl-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center border border-slate-700 text-slate-400">
                          <Shield className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-bold text-white text-sm">{staff.name}</div>
                          <div className="text-xs text-slate-500 mt-0.5 font-mono">ID: {staff.id?.slice(0,8)}...</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-xs text-slate-400 space-y-1">
                      {staff.email && <div className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-slate-500" /> {staff.email}</div>}
                      {staff.phone && <div className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-slate-500" /> {staff.phone}</div>}
                    </td>
                    <td className="p-4">
                      <select
                        value={staff.role}
                        onChange={(e) => handleRoleChange(staff.id!, e.target.value)}
                        className={`text-xs font-bold uppercase tracking-wider px-2 py-1 rounded border appearance-none outline-none cursor-pointer ${
                          staff.role === 'super_admin' ? 'bg-rose-500/10 text-rose-400 border-rose-500/30' :
                          staff.role === 'catalog_admin' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' :
                          'bg-indigo-500/10 text-indigo-400 border-indigo-500/30'
                        }`}
                      >
                        <option value="super_admin">Super Admin</option>
                        <option value="catalog_admin">Catalog Admin</option>
                        <option value="onboarding_admin">Onboarding Admin</option>
                        <option value="support_admin">Support Admin</option>
                      </select>
                    </td>
                    <td className="p-4 pr-6 text-right">
                      {staff.role !== 'super_admin' && (
                        <button 
                          onClick={() => handleDelete(staff.id!)}
                          className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                          title="Revoke Access"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {staffUsers.length === 0 && (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-slate-500 border-2 border-dashed border-slate-700 m-4 rounded-xl">
                      No internal staff members found. Add one above.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
