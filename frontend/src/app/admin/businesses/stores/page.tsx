"use client";

import React, { useState, useEffect } from 'react';
import { useAdminRole } from '@/context/AdminRoleContext';
import { ShieldAlert, Search, Store, CreditCard, RefreshCw } from 'lucide-react';

export default function AdminStoresPage() {
  const { canEdit } = useAdminRole();
  const hasEditPermission = canEdit('stores');

  const [stores, setStores] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingStatus, setEditingStatus] = useState('');

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  const fetchStores = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/admin/businesses`);
      const data = await res.json();
      if (Array.isArray(data)) setStores(data);
    } catch (e) {
      console.error("Failed to fetch stores", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  const handleUpdateSubscription = async (id: string, newStatus: string) => {
    if (!hasEditPermission) return;
    try {
      const res = await fetch(`${API_URL}/admin/businesses/${id}/subscription`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          subscriptionStatus: newStatus,
          subscriptionStartDate: newStatus === 'ACTIVE' ? new Date().toISOString() : null,
          subscriptionEndDate: newStatus === 'ACTIVE' ? new Date(Date.now() + 30*24*60*60*1000).toISOString() : null,
        })
      });
      if (res.ok) {
        setStores(stores.map(s => s.id === id ? { ...s, subscriptionStatus: newStatus } : s));
        setEditingId(null);
      }
    } catch (e) {
      console.error(e);
      alert('Failed to update subscription status');
    }
  };

  const filteredStores = stores.filter(s => 
    s.businessName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in duration-300 w-full">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Store Directory</h1>
          <p className="text-slate-400 mt-2 text-sm">View all registered businesses and manage their subscriptions.</p>
        </div>
        <button 
          onClick={fetchStores}
          className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 border border-slate-700"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </header>

      {!hasEditPermission && (
        <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-xl flex items-center gap-3 mb-8">
          <ShieldAlert className="w-5 h-5" />
          <p className="text-sm font-medium">You do not have permission to manage store subscriptions. Contact a Super Admin.</p>
        </div>
      )}

      <div className="bg-slate-800 rounded-2xl border border-slate-700 shadow-lg overflow-hidden">
        <div className="p-4 border-b border-slate-700 bg-slate-900/50 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search by store name or email..." 
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
                <th className="p-4 pl-6">Store Details</th>
                <th className="p-4">Business Type</th>
                <th className="p-4">Subscription</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {loading ? (
                <tr>
                  <td colSpan={3} className="p-8 text-center text-slate-500">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-indigo-400" />
                    Loading stores...
                  </td>
                </tr>
              ) : filteredStores.map((store) => (
                <tr key={store.id} className="hover:bg-slate-700/30 transition-all">
                  <td className="p-4 pl-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center border border-orange-500/30 text-orange-400">
                        <Store className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-bold text-white text-sm">{store.businessName || 'Unnamed Store'}</div>
                        <div className="text-xs text-slate-500 mt-0.5">{store.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="bg-slate-900 text-slate-300 px-2 py-1 rounded border border-slate-700 text-xs font-semibold">
                      {store.businessType?.name || 'Standard'}
                    </span>
                  </td>
                  <td className="p-4">
                    {editingId === store.id ? (
                      <div className="flex items-center gap-2">
                        <select 
                          value={editingStatus}
                          onChange={(e) => setEditingStatus(e.target.value)}
                          className="bg-slate-900 text-indigo-400 text-xs font-bold rounded-lg px-2 py-1 border border-indigo-500 focus:outline-none"
                        >
                          <option value="ACTIVE">ACTIVE</option>
                          <option value="TRIAL">TRIAL</option>
                          <option value="EXPIRED">EXPIRED</option>
                          <option value="SUSPENDED">SUSPENDED</option>
                        </select>
                        <button onClick={() => handleUpdateSubscription(store.id, editingStatus)} className="bg-indigo-600 hover:bg-indigo-500 text-white px-2 py-1 rounded text-xs font-bold">Save</button>
                        <button onClick={() => setEditingId(null)} className="text-slate-400 hover:text-white px-2 py-1 rounded text-xs">Cancel</button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3">
                        <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border ${
                          store.subscriptionStatus === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                          store.subscriptionStatus === 'TRIAL' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                          'bg-rose-500/10 text-rose-400 border-rose-500/20'
                        }`}>
                          <CreditCard className="w-3 h-3" />
                          {store.subscriptionStatus || 'NONE'}
                        </span>
                        {hasEditPermission && (
                          <button 
                            onClick={() => { setEditingId(store.id); setEditingStatus(store.subscriptionStatus || 'ACTIVE'); }}
                            className="text-slate-500 hover:text-indigo-400 transition-colors text-xs font-semibold underline decoration-slate-700 hover:decoration-indigo-400 underline-offset-4"
                          >
                            Edit
                          </button>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {!loading && filteredStores.length === 0 && (
                <tr>
                  <td colSpan={3} className="p-8 text-center text-slate-500">
                    No stores found on the platform.
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
