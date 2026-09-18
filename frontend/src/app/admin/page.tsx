"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Activity, Users, ShoppingBag, Store, ArrowUpRight, TrendingUp, DollarSign, Wallet, ShieldCheck, Zap, Database } from 'lucide-react';
import { SettingsContext } from '@/context/SettingsContext';
import { useAdminRole } from '@/context/AdminRoleContext';

const defaultSettings = {
  sectors: [
    { id: 'b2b', name: 'B2B Wholesale', icon: '🏭', isActive: true },
    { id: 'b2c', name: 'B2C Retail', icon: '🛍️', isActive: true },
    { id: 'services', name: 'Services & Bookings', icon: '🔧', isActive: true }
  ]
};

export default function AdminDashboardPage() {
  const { allUsers } = useAuth();
  const { currentAdminRole, canEdit, canToggleSector } = useAdminRole();
  const [settings, setSettings] = useState(defaultSettings);
  const [dummyStatus, setDummyStatus] = useState<boolean | null>(null);
  
  // States for real data aggregation
  const [totalVolume, setTotalVolume] = useState(0);
  const [totalPlatformRevenue, setTotalPlatformRevenue] = useState(0);
  const [recentTransactions, setRecentTransactions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  // Calculate Users
  const activeSellers = allUsers.filter(u => u.role === 'business' || u.role === 'seller' || u.role === 'SELLER').length;
  const activeBuyers = allUsers.filter(u => u.role === 'buyer' || u.role === 'CONSUMER').length;
  const totalProducts = 124; // Static for now, as products API isn't globally fetching all

  useEffect(() => {
    const fetchGlobalData = async () => {
      setIsLoading(true);
      try {
        const sellers = allUsers.filter(u => u.role === 'business' || u.role === 'seller' || u.role === 'SELLER');
        let totalVol = 0;
        let totalRev = 0;
        let allTx: any[] = [];
        
        // Fetch all businesses from the backend directly
        const bRes = await fetch(`${API_URL}/admin/businesses`);
        if (bRes.ok) {
          const businesses = await bRes.json();
          for (const business of businesses) {
            const bal = business.wallet?.balance || 0;
            totalVol += bal;
            
            // Calculate revenue based on live database values
            if (business.commissionType === 'FIXED') {
              totalRev += business.commissionRate || 999;
            } else {
              const rate = (business.commissionRate || 5) / 100;
              totalRev += bal * rate;
            }
            
            if (business.wallet?.id) {
              const tRes = await fetch(`${API_URL}/wallet/${business.wallet.id}/transactions`);
              if (tRes.ok) {
                const txs = await tRes.json();
                allTx = [...allTx, ...txs.map((t: any) => ({ ...t, sellerName: business.name || business.user?.name || 'Unknown' }))];
              }
            }
          }
        }

        // Sort all transactions by date descending
        allTx.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        setTotalVolume(totalVol);
        setTotalPlatformRevenue(totalRev);
        setRecentTransactions(allTx.slice(0, 10)); // Top 10 recent
      } catch (e) {
        console.error("Failed to fetch live aggregated data", e);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchDummyStatus = async () => {
      try {
        const res = await fetch(`${API_URL}/products/dummy-status`);
        if (res.ok) {
          const data = await res.json();
          setDummyStatus(data.enabled);
        }
      } catch (e) {
        console.error("Failed to fetch dummy status", e);
      }
    };

    if (allUsers.length > 0) {
      fetchGlobalData();
    } else {
      setIsLoading(false);
    }
    fetchDummyStatus();
  }, [allUsers]);

  const toggleSector = (id: string) => {
    if (!canToggleSector()) return;
    setSettings(prev => ({
      ...prev,
      sectors: prev.sectors.map(s => s.id === id ? { ...s, isActive: !s.isActive } : s)
    }));
  };

  const handleDummyToggle = async (enable: boolean) => {
    setDummyStatus(enable); // optimistic UI update
    try {
      const res = await fetch(`${API_URL}/products/toggle-dummy`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enable })
      });
      if (!res.ok) {
        setDummyStatus(!enable); // revert on failure
        alert('Failed to toggle dummy data.');
      }
    } catch(err) {
      setDummyStatus(!enable);
      alert('Error toggling dummy data.');
    }
  };

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in duration-300 w-full relative pb-10">
      
      {/* Header */}
      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4 relative z-10">
        <div>
          <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 tracking-tight">Platform Health</h1>
          <p className="text-slate-400 mt-2 text-sm font-medium">Real-time metrics for MarkatVerse ecosystem.</p>
        </div>
      </header>

      {/* Top Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10 relative z-10">
        <div className="group bg-gradient-to-br from-indigo-500/10 to-indigo-600/5 hover:from-indigo-500/20 hover:to-indigo-600/10 p-6 rounded-3xl border border-indigo-500/20 hover:border-indigo-500/40 shadow-xl hover:shadow-indigo-500/20 relative overflow-hidden transition-all duration-300 transform hover:-translate-y-1 backdrop-blur-sm">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-indigo-500/20 rounded-full blur-2xl group-hover:bg-indigo-500/30 transition-colors"></div>
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div className="text-indigo-400 font-bold text-sm flex items-center gap-2">
              <TrendingUp className="w-5 h-5" /> Total Gross Volume
            </div>
          </div>
          <div className="text-3xl font-black text-white mb-2 relative z-10 drop-shadow-md">₹{totalVolume.toLocaleString()}</div>
          <div className="text-[10px] font-black uppercase tracking-wider bg-indigo-500/20 text-indigo-400 px-2.5 py-1 rounded-full w-fit flex items-center gap-1.5 relative z-10">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse shadow-[0_0_8px_rgba(129,140,248,0.8)]"></span> Live Data
          </div>
        </div>
        
        <div className="group bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 hover:from-emerald-500/20 hover:to-emerald-600/10 p-6 rounded-3xl border border-emerald-500/20 hover:border-emerald-500/40 shadow-xl hover:shadow-emerald-500/20 relative overflow-hidden transition-all duration-300 transform hover:-translate-y-1 backdrop-blur-sm">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-emerald-500/20 rounded-full blur-2xl group-hover:bg-emerald-500/30 transition-colors"></div>
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div className="text-emerald-400 font-bold text-sm flex items-center gap-2">
              <DollarSign className="w-5 h-5" /> Est. Platform Revenue
            </div>
          </div>
          <div className="text-3xl font-black text-white mb-2 relative z-10 drop-shadow-md">₹{totalPlatformRevenue.toLocaleString()}</div>
          <div className="text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-400 px-2.5 py-1 rounded-full w-fit flex items-center gap-1.5 relative z-10">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]"></span> @ 5% Commission
          </div>
        </div>

        <div className="group bg-gradient-to-br from-amber-500/10 to-amber-600/5 hover:from-amber-500/20 hover:to-amber-600/10 p-6 rounded-3xl border border-amber-500/20 hover:border-amber-500/40 shadow-xl hover:shadow-amber-500/20 relative overflow-hidden transition-all duration-300 transform hover:-translate-y-1 backdrop-blur-sm">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-amber-500/20 rounded-full blur-2xl group-hover:bg-amber-500/30 transition-colors"></div>
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div className="text-amber-400 font-bold text-sm flex items-center gap-2">
              <Store className="w-5 h-5" /> Active Sellers
            </div>
          </div>
          <div className="text-3xl font-black text-white mb-2 relative z-10 drop-shadow-md">{activeSellers}</div>
          <div className="text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-400 px-2.5 py-1 rounded-full w-fit flex items-center gap-1.5 relative z-10">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse shadow-[0_0_8px_rgba(251,191,36,0.8)]"></span> Live Data
          </div>
        </div>

        <div className="group bg-gradient-to-br from-cyan-500/10 to-cyan-600/5 hover:from-cyan-500/20 hover:to-cyan-600/10 p-6 rounded-3xl border border-cyan-500/20 hover:border-cyan-500/40 shadow-xl hover:shadow-cyan-500/20 relative overflow-hidden transition-all duration-300 transform hover:-translate-y-1 backdrop-blur-sm">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-cyan-500/20 rounded-full blur-2xl group-hover:bg-cyan-500/30 transition-colors"></div>
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div className="text-cyan-400 font-bold text-sm flex items-center gap-2">
              <Users className="w-5 h-5" /> Total Buyers
            </div>
          </div>
          <div className="text-3xl font-black text-white mb-2 relative z-10 drop-shadow-md">{activeBuyers}</div>
          <div className="text-[10px] font-black uppercase tracking-wider bg-cyan-500/20 text-cyan-400 px-2.5 py-1 rounded-full w-fit flex items-center gap-1.5 relative z-10">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_rgba(34,211,238,0.8)]"></span> Live Data
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
        
        {/* Main Feed: Recent Transactions */}
        <div className="lg:col-span-2 bg-slate-900/40 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden flex flex-col relative min-h-[400px]">
          <div className="absolute inset-0 opacity-[0.03] z-0" style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }}></div>
          
          <div className="p-6 border-b border-white/5 bg-slate-900/50 relative z-10 flex items-center justify-between">
            <h3 className="text-xl font-bold text-white flex items-center gap-3">
              Recent Transactions 
              <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-400 px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-[0_0_15px_rgba(52,211,153,0.15)]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]"></span> LIVE
              </span>
            </h3>
          </div>

          <div className="p-0 overflow-y-auto relative z-10 flex-1">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-full opacity-50 py-20">
                <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                <div className="font-bold text-white">Aggregating live ledgers...</div>
              </div>
            ) : recentTransactions.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full opacity-50 py-20">
                <Activity className="w-12 h-12 mb-4 text-slate-500" />
                <div className="font-bold text-white">Waiting for transactions</div>
                <div className="text-sm text-slate-400 mt-1">New transactions will appear here in real-time as they are processed on the platform.</div>
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-900/80 sticky top-0 border-b border-slate-700 text-slate-400 text-[10px] uppercase tracking-widest font-black">
                  <tr>
                    <th className="p-4 pl-6">Seller</th>
                    <th className="p-4">Type</th>
                    <th className="p-4">Amount</th>
                    <th className="p-4 pr-6 text-right">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {recentTransactions.map(tx => (
                    <tr key={tx.id} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="p-4 pl-6 relative">
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-transparent group-hover:bg-indigo-500 transition-colors"></div>
                        <div className="font-bold text-white text-sm group-hover:text-indigo-400 transition-colors">{tx.sellerName}</div>
                        <div className="text-xs text-slate-500 font-mono mt-0.5">TX: {tx.id.slice(0, 8)}...</div>
                      </td>
                      <td className="p-4">
                        <div className={`text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-md inline-flex ${
                          tx.type === 'EARNING' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                          tx.type === 'PAYOUT' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                          'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        }`}>
                          {tx.type}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className={`font-black text-sm ${
                          tx.type === 'EARNING' ? 'text-emerald-400' : 'text-slate-300'
                        }`}>
                          {tx.type === 'EARNING' ? '+' : '-'}₹{tx.amount}
                        </div>
                      </td>
                      <td className="p-4 pr-6 text-right text-xs font-medium text-slate-500">
                        {new Date(tx.createdAt).toLocaleTimeString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Right Sidebar: Sector Controls & Status */}
        <div className="space-y-6">
          <div className="bg-slate-900/60 backdrop-blur-xl p-6 rounded-3xl border border-white/10 shadow-2xl">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Zap className="w-4 h-4 text-indigo-400" /> Quick Sector Controls
            </h3>
            
            {!canToggleSector() && (
              <div className="mb-4 text-xs font-medium text-rose-400 bg-rose-500/10 p-3 rounded-xl border border-rose-500/20">
                You do not have permission to toggle global sectors.
              </div>
            )}

            <div className="space-y-3">
              {settings.sectors.map(sector => (
                <div key={sector.id} className="flex items-center justify-between p-4 rounded-2xl bg-black/20 border border-white/5 hover:border-white/10 transition-colors shadow-inner">
                  <div className="flex items-center gap-3">
                    <span className="text-xl drop-shadow-md">{sector.icon}</span>
                    <div>
                      <div className="text-sm font-bold text-white">{sector.name}</div>
                      <div className={`text-[10px] font-black uppercase tracking-wider ${sector.isActive ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {sector.isActive ? 'ONLINE' : 'OFFLINE'}
                      </div>
                    </div>
                  </div>
                  
                  {/* Master Toggle Switch */}
                  <label className={`relative inline-flex items-center ${canToggleSector() ? 'cursor-pointer hover:scale-105 transition-transform' : 'cursor-not-allowed opacity-50'}`}>
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={sector.isActive} 
                      onChange={() => toggleSector(sector.id)}
                      disabled={!canToggleSector()}
                    />
                    <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-900/60 backdrop-blur-xl p-6 rounded-3xl border border-white/10 shadow-2xl">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Database className="w-4 h-4 text-blue-400" /> Database Controls
            </h3>
            
            <div className="flex items-center justify-between p-4 rounded-2xl bg-black/20 border border-white/5 hover:border-white/10 transition-colors shadow-inner">
              <div className="flex items-center gap-3">
                <span className="text-xl drop-shadow-md">🧪</span>
                <div>
                  <div className="text-sm font-bold text-white">Dummy Data</div>
                  <div className={`text-[10px] font-black uppercase tracking-wider ${dummyStatus === true ? 'text-emerald-400' : dummyStatus === false ? 'text-rose-400' : 'text-slate-500'}`}>
                    {dummyStatus === true ? 'ENABLED' : dummyStatus === false ? 'DISABLED' : 'LOADING...'}
                  </div>
                </div>
              </div>
              
              <label className={`relative inline-flex items-center cursor-pointer hover:scale-105 transition-transform ${dummyStatus === null ? 'opacity-50' : ''}`}>
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={dummyStatus || false} 
                  onChange={(e) => handleDummyToggle(e.target.checked)}
                  disabled={dummyStatus === null}
                />
                <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
              </label>
            </div>
          </div>

          <div className="bg-emerald-500/10 border border-emerald-500/30 p-8 rounded-3xl shadow-[0_0_30px_rgba(16,185,129,0.15)] relative overflow-hidden backdrop-blur-md">
            <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/20 rounded-full blur-[50px]"></div>
            <h3 className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-3 flex items-center gap-2 relative z-10">
              <ShieldCheck className="w-5 h-5" /> System Health
            </h3>
            <div className="text-4xl font-black text-white mb-2 relative z-10 drop-shadow-md">99.9%</div>
            <p className="text-emerald-400/90 text-sm font-medium relative z-10">All core services are operating normally. Database cluster stable.</p>
          </div>
        </div>

      </div>
    </div>
  );
}
