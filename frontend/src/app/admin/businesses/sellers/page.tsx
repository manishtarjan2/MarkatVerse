"use client";

import React, { useState, useEffect } from 'react';
import { useAdminRole } from '@/context/AdminRoleContext';
import { ShieldAlert, Search, Check, X, Store, Info } from 'lucide-react';

export default function AdminSellersPage() {
  const { canEdit } = useAdminRole();
  const hasEditPermission = canEdit('sellers');

  const [pendingSellers, setPendingSellers] = useState<any[]>([]);
  const [activeSellers, setActiveSellers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  useEffect(() => {
    fetch(`${API_URL}/sellers`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setPendingSellers(data.filter(s => s.status !== 'Approved'));
          setActiveSellers(data.filter(s => s.status === 'Approved'));
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [API_URL]);

  const approveSeller = async (id: string) => {
    if (!hasEditPermission) return;
    try {
      const res = await fetch(`${API_URL}/sellers/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Approved' })
      });
      if (res.ok) {
        const approved = pendingSellers.find(s => s.id === id);
        setPendingSellers(pendingSellers.filter(s => s.id !== id));
        if (approved) setActiveSellers([...activeSellers, { ...approved, status: 'Approved' }]);
      }
    } catch (e) {
      console.error(e);
      alert('Error approving seller');
    }
  };

  const rejectSeller = async (id: string) => {
    if (!hasEditPermission) return;
    try {
      const res = await fetch(`${API_URL}/sellers/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Rejected' })
      });
      if (res.ok) {
        setPendingSellers(pendingSellers.filter(s => s.id !== id));
      }
    } catch (e) {
      console.error(e);
      alert('Error rejecting seller');
    }
  };

  const filterSellers = (sellers: any[]) => {
    return sellers.filter(s => 
      s.businessName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      s.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const displayPending = filterSellers(pendingSellers);
  const displayActive = filterSellers(activeSellers);

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in duration-300 w-full">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Seller Onboarding & Approvals</h1>
          <p className="text-slate-400 mt-2 text-sm">Review incoming seller applications and manage active sellers.</p>
        </div>
      </header>

      {!hasEditPermission && (
        <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-xl flex items-center gap-3 mb-8">
          <ShieldAlert className="w-5 h-5" />
          <p className="text-sm font-medium">You do not have permission to approve or reject sellers. Contact an Onboarding Admin.</p>
        </div>
      )}

      <div className="mb-6 relative w-full sm:w-96">
        <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
        <input 
          type="text" 
          placeholder="Search by business name or email..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 w-full text-sm transition-colors" 
        />
      </div>

      <div className="space-y-10">
        {/* Pending Sellers Section */}
        <div>
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            Pending Approvals
            <span className="bg-amber-500/20 text-amber-400 text-xs py-0.5 px-2 rounded-full border border-amber-500/30">
              {displayPending.length}
            </span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              <p className="text-slate-500">Loading...</p>
            ) : displayPending.map(seller => (
              <div key={seller.id} className="bg-slate-800 rounded-2xl p-6 border border-amber-500/20 shadow-lg shadow-amber-900/5 relative overflow-hidden transition-transform hover:-translate-y-1">
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl transform translate-x-16 -translate-y-16"></div>
                
                <div className="flex justify-between items-start mb-4 relative z-10">
                  <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center text-slate-400 shadow-inner">
                    <Store className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-black uppercase tracking-wider text-amber-500 bg-amber-500/10 px-2 py-1 rounded-md border border-amber-500/20">Action Required</span>
                </div>
                
                <div className="relative z-10 space-y-1">
                  <h3 className="text-lg font-bold text-white">{seller.businessName}</h3>
                  <div className="text-sm text-slate-400">{seller.email}</div>
                  <div className="text-xs text-slate-500 font-mono mt-1">ID: {seller.id.slice(0,8)}...</div>
                </div>

                {hasEditPermission && (
                  <div className="mt-6 pt-4 border-t border-slate-700/50 flex gap-3 relative z-10">
                    <button 
                      onClick={() => rejectSeller(seller.id)}
                      className="flex-1 bg-slate-900 hover:bg-rose-500/10 text-slate-300 hover:text-rose-400 border border-slate-700 hover:border-rose-500/30 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2"
                    >
                      <X className="w-4 h-4" /> Reject
                    </button>
                    <button 
                      onClick={() => approveSeller(seller.id)}
                      className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.2)] py-2.5 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2"
                    >
                      <Check className="w-4 h-4" /> Approve
                    </button>
                  </div>
                )}
              </div>
            ))}
            {!loading && displayPending.length === 0 && (
              <div className="col-span-full py-12 bg-slate-800/50 rounded-2xl border border-slate-700 border-dashed flex flex-col items-center justify-center text-slate-500">
                <Check className="w-12 h-12 mb-3 text-slate-600" />
                <p>No pending approvals. You're all caught up!</p>
              </div>
            )}
          </div>
        </div>

        {/* Active Sellers Section */}
        <div>
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            Active Sellers
            <span className="bg-emerald-500/20 text-emerald-400 text-xs py-0.5 px-2 rounded-full border border-emerald-500/30">
              {displayActive.length}
            </span>
          </h2>
          
          <div className="bg-slate-800 rounded-2xl border border-slate-700 shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-900 border-b border-slate-700 text-slate-400 text-[10px] uppercase tracking-widest font-black">
                  <tr>
                    <th className="p-4 pl-6">Business</th>
                    <th className="p-4">Contact</th>
                    <th className="p-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50">
                  {displayActive.map(seller => (
                    <tr key={seller.id} className="hover:bg-slate-700/30 transition-all">
                      <td className="p-4 pl-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-slate-500">
                            <Store className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="font-bold text-white text-sm">{seller.businessName}</div>
                            <div className="text-xs text-slate-500 mt-0.5 font-mono">{seller.id.slice(0,8)}...</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm text-slate-300">{seller.email}</div>
                        <div className="text-xs text-slate-500 mt-0.5">{seller.phone || 'No phone'}</div>
                      </td>
                      <td className="p-4">
                        <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide">
                          Approved
                        </span>
                      </td>
                    </tr>
                  ))}
                  {!loading && displayActive.length === 0 && (
                    <tr>
                      <td colSpan={3} className="p-8 text-center text-slate-500">
                        No active sellers found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
