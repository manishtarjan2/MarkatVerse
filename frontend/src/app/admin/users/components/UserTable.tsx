"use client";

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useAdminRole } from '@/context/AdminRoleContext';
import { ShieldAlert, Search, Trash2, Edit2, Check, X, User } from 'lucide-react';

export default function UserTable({ title, subtitle, allowedRoles }: { title: string, subtitle: string, allowedRoles?: string[] }) {
  const { allUsers, deleteUser, updateUserRole } = useAuth();
  const { canEdit } = useAdminRole();
  const hasEditPermission = canEdit('users');

  const [searchTerm, setSearchTerm] = useState('');
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editingRole, setEditingRole] = useState<string>('');

  const filteredUsers = allUsers
    .filter(u => allowedRoles ? allowedRoles.some(r => r.toLowerCase() === u.role?.toLowerCase()) : true)
    .filter(u => 
      u.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.phone?.includes(searchTerm)
    );

  const handleEditClick = (user: any) => {
    if (!hasEditPermission) return;
    setEditingUserId(user.id);
    setEditingRole(user.role);
  };

  const handleSaveEdit = (id: string) => {
    if (!hasEditPermission) return;
    updateUserRole(id, editingRole as any);
    setEditingUserId(null);
  };

  const handleDelete = (id: string) => {
    if (!hasEditPermission) return;
    if (window.confirm("Are you sure you want to delete this user?")) {
      deleteUser(id);
    }
  };

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in duration-300 w-full">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">{title}</h1>
          <p className="text-slate-400 mt-2 text-sm">{subtitle}</p>
        </div>
      </header>

      {!hasEditPermission && (
        <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-xl flex items-center gap-3 mb-8">
          <ShieldAlert className="w-5 h-5" />
          <p className="text-sm font-medium">You do not have permission to edit users. Contact a Super Admin or Support Admin.</p>
        </div>
      )}

      <div className="bg-slate-800 rounded-2xl border border-slate-700 shadow-lg overflow-hidden">
        <div className="p-4 border-b border-slate-700 bg-slate-900/50">
          <div className="relative w-full sm:w-80">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search by name or email..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 w-full text-sm transition-colors" 
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-900 border-b border-slate-700 text-slate-400 text-[10px] uppercase tracking-widest font-black">
              <tr>
                <th className="p-4 pl-6">User</th>
                <th className="p-4">Contact</th>
                <th className="p-4">Role</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {filteredUsers.map((user: any) => (
                <tr key={user.id} className="hover:bg-slate-700/30 transition-all group">
                  <td className="p-4 pl-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30 text-indigo-400">
                        <User className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-bold text-white text-sm">{user.name}</div>
                        <div className="text-xs text-slate-500 mt-0.5 font-mono">
                          {user.markatId || `${user.id.slice(0,8)}...`}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm text-slate-300">{user.email || 'No email provided'}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{user.phone || 'No phone provided'}</div>
                  </td>
                  <td className="p-4">
                    {editingUserId === user.id ? (
                      <select 
                        value={editingRole}
                        onChange={(e) => setEditingRole(e.target.value)}
                        className="bg-slate-900 text-indigo-400 text-xs font-bold rounded-lg px-2 py-1 border border-indigo-500 focus:outline-none"
                      >
                        <option value="super_admin">Super Admin</option>
                        <option value="catalog_admin">Catalog Admin</option>
                        <option value="onboarding_admin">Onboarding Admin</option>
                        <option value="support_admin">Support Admin</option>
                        <option value="user">Regular User</option>
                      </select>
                    ) : (
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border ${
                        user.role.includes('admin') 
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' 
                          : 'bg-slate-500/10 text-slate-400 border-slate-500/20'
                      }`}>
                        {user.role.replace('_', ' ')}
                      </span>
                    )}
                  </td>
                  <td className="p-4 pr-6 text-right">
                    {(() => {
                      const isRegularUser = ['seller', 'business', 'consumer', 'buyer', 'user'].includes(user.role?.toLowerCase() || '');
                      const canEditThisUser = hasEditPermission && !isRegularUser;
                      
                      if (isRegularUser) {
                        return (
                          <div className="flex items-center justify-end gap-2">
                            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Active
                            </span>
                          </div>
                        );
                      }

                      return canEditThisUser && (
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          {editingUserId === user.id ? (
                            <>
                              <button onClick={() => setEditingUserId(null)} className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors">
                                <X className="w-4 h-4" />
                              </button>
                              <button onClick={() => handleSaveEdit(user.id)} className="p-1.5 text-emerald-400 hover:text-emerald-300 rounded-lg transition-colors">
                                <Check className="w-4 h-4" />
                              </button>
                            </>
                          ) : (
                            <button 
                              onClick={() => handleEditClick(user)}
                              className="p-1.5 text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-colors"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                          )}
                          <button 
                            onClick={() => handleDelete(user.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      );
                    })()}
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-slate-500">
                    No users found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
