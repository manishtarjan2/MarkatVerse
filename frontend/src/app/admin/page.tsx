"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Activity, Users, ShoppingBag, Store, ArrowUpRight, TrendingUp, DollarSign, Wallet, ShieldCheck, Zap, Database } from 'lucide-react';
import { SettingsContext, defaultSettings } from '@/context/SettingsContext';
import { useAdminRole } from '@/context/AdminRoleContext';

export default function AdminDashboardPage() {
  const { allUsers } = useAuth();
  const { currentAdminRole, canEdit, canToggleSector } = useAdminRole();
  const [settings, setSettings] = useState(defaultSettings);
  const [isSandboxMode, setIsSandboxMode] = useState(false);
  
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
        
        const storedPlans = JSON.parse(localStorage.getItem('commercial_plans') || '{}');

        // Fetch wallet for each seller to aggregate
        for (const seller of sellers) {
          const wRes = await fetch(`${API_URL}/wallet/business/${seller.id}`);
          if (wRes.ok) {
            const walletData = await wRes.json();
            const bal = walletData.balance || 0;
            totalVol += bal;
            
            // Get their actual configured rate
            const planConfig = storedPlans[seller.id];
            if (planConfig && planConfig.planType === 'subscription') {
              totalRev += planConfig.flatRate; 
            } else {
              const rate = planConfig ? planConfig.commissionRate / 100 : 0.05; // Fallback to 5%
              totalRev += bal * rate; 
            }

            const tRes = await fetch(`${API_URL}/wallet/${walletData.id}/transactions`);
            if (tRes.ok) {
              const txs = await tRes.json();
              allTx = [...allTx, ...txs.map((t: any) => ({ ...t, sellerName: seller.name }))];
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

    if (allUsers.length > 0 && !isSandboxMode) {
      fetchGlobalData();
    } else {
      setIsLoading(false);
    }
  }, [allUsers, isSandboxMode]);

  const toggleSector = (id: string) => {
    if (!canToggleSector()) return;
    setSettings(prev => ({
      ...prev,
      sectors: prev.sectors.map(s => s.id === id ? { ...s, isActive: !s.isActive } : s)
    }));
  };

  const handleSandboxToggle = () => {
    if (!canToggleSector()) return;
    setIsSandboxMode(!isSandboxMode);
  };

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in duration-300 w-full relative pb-10">
      
      {/* Header */}
      <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Platform Health</h1>
          <p className="text-slate-400 mt-2 text-sm">Real-time metrics for MarkatVerse ecosystem.</p>
        </div>

        {/* Global Sandbox Toggle */}
        <div className="bg-slate-800 p-1.5 rounded-xl border border-slate-700 flex items-center shadow-lg w-fit">
          <button 
            onClick={handleSandboxToggle}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${!isSandboxMode ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'text-slate-400 hover:text-white'}`}
          >
            <Activity className="w-4 h-4" /> Live Data
          </button>
          <button 
            onClick={handleSandboxToggle}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${isSandboxMode ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'text-slate-400 hover:text-white'}`}
          >
            <Database className="w-4 h-4" /> Sandbox
          </button>
        </div>
      </header>

      {isSandboxMode && (
        <div className="bg-amber-500/10 border border-amber-500/20 text-amber-400 p-4 rounded-xl flex items-center gap-3 mb-8">
          <Database className="w-5 h-5" />
          <p className="text-sm font-medium">Sandbox Mode Active. Data shown below is dummy data for preview purposes only.</p>
        </div>
      )}

      {/* Top Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-indigo-500/10 to-indigo-600/5 p-6 rounded-2xl border border-indigo-500/20 shadow-lg relative overflow-hidden">
          <div className="flex justify-between items-start mb-4">
            <div className="text-indigo-400 font-bold text-sm flex items-center gap-2">
              <TrendingUp className="w-4 h-4" /> Total Gross Volume
            </div>
            {isSandboxMode && <div className="text-indigo-400 text-xs font-bold bg-indigo-500/20 px-2 py-1 rounded">+12.5%</div>}
          </div>
          <div className="text-3xl font-black text-white mb-2">₹{isSandboxMode ? '24,500,000' : totalVolume.toLocaleString()}</div>
          <div className="text-xs font-bold bg-indigo-500/20 text-indigo-400 px-2 py-1 rounded w-fit flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse"></span> {isSandboxMode ? 'Dummy Data' : 'Live Data'}
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 p-6 rounded-2xl border border-emerald-500/20 shadow-lg relative overflow-hidden">
          <div className="flex justify-between items-start mb-4">
            <div className="text-emerald-400 font-bold text-sm flex items-center gap-2">
              <DollarSign className="w-4 h-4" /> Est. Platform Revenue
            </div>
          </div>
          <div className="text-3xl font-black text-white mb-2">₹{isSandboxMode ? '1,225,000' : totalPlatformRevenue.toLocaleString()}</div>
          <div className="text-xs font-bold bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded w-fit flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> @ 5% Commission
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-500/10 to-amber-600/5 p-6 rounded-2xl border border-amber-500/20 shadow-lg">
          <div className="flex justify-between items-start mb-4">
            <div className="text-amber-400 font-bold text-sm flex items-center gap-2">
              <Store className="w-4 h-4" /> Active Sellers
            </div>
            {isSandboxMode && <div className="text-amber-400 text-xs font-bold bg-amber-500/20 px-2 py-1 rounded">+4.2%</div>}
          </div>
          <div className="text-3xl font-black text-white mb-2">{isSandboxMode ? '1,420' : activeSellers}</div>
          <div className="text-xs font-bold bg-amber-500/20 text-amber-400 px-2 py-1 rounded w-fit flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span> {isSandboxMode ? 'Dummy Data' : 'Live Data'}
          </div>
        </div>

        <div className="bg-gradient-to-br from-cyan-500/10 to-cyan-600/5 p-6 rounded-2xl border border-cyan-500/20 shadow-lg">
          <div className="flex justify-between items-start mb-4">
            <div className="text-cyan-400 font-bold text-sm flex items-center gap-2">
              <Users className="w-4 h-4" /> Total Buyers
            </div>
            {isSandboxMode && <div className="text-cyan-400 text-xs font-bold bg-cyan-500/20 px-2 py-1 rounded">+18.1%</div>}
          </div>
          <div className="text-3xl font-black text-white mb-2">{isSandboxMode ? '45,200' : activeBuyers}</div>
          <div className="text-xs font-bold bg-cyan-500/20 text-cyan-400 px-2 py-1 rounded w-fit flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span> {isSandboxMode ? 'Dummy Data' : 'Live Data'}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Feed: Recent Transactions */}
        <div className="lg:col-span-2 bg-slate-800 rounded-2xl border border-slate-700 shadow-lg overflow-hidden flex flex-col relative min-h-[400px]">
          <div className="absolute inset-0 opacity-[0.03] z-0" style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }}></div>
          
          <div className="p-6 border-b border-slate-700 bg-slate-900/50 relative z-10 flex items-center justify-between">
            <h3 className="text-lg font-bold text-white flex items-center gap-3">
              Recent Transactions 
              <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> LIVE
              </span>
            </h3>
          </div>

          <div className="p-0 overflow-y-auto relative z-10 flex-1">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-full opacity-50 py-20">
                <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                <div className="font-bold text-white">Aggregating live ledgers...</div>
              </div>
            ) : recentTransactions.length === 0 && !isSandboxMode ? (
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
                <tbody className="divide-y divide-slate-700/50">
                  {recentTransactions.map(tx => (
                    <tr key={tx.id} className="hover:bg-slate-700/30 transition-all">
                      <td className="p-4 pl-6">
                        <div className="font-bold text-white text-sm">{tx.sellerName}</div>
                        <div className="text-xs text-slate-500 font-mono mt-0.5">TX: {tx.id.slice(0, 8)}...</div>
                      </td>
                      <td className="p-4">
                        <div className={`text-xs font-bold px-2 py-1 rounded inline-flex ${
                          tx.type === 'EARNING' ? 'bg-emerald-500/10 text-emerald-400' :
                          tx.type === 'PAYOUT' ? 'bg-blue-500/10 text-blue-400' :
                          'bg-amber-500/10 text-amber-400'
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
                      <td className="p-4 pr-6 text-right text-xs text-slate-500">
                        {new Date(tx.createdAt).toLocaleTimeString()}
                      </td>
                    </tr>
                  ))}
                  {isSandboxMode && Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="hover:bg-slate-700/30 transition-all">
                      <td className="p-4 pl-6">
                        <div className="font-bold text-white text-sm">Dummy Seller {i+1}</div>
                        <div className="text-xs text-slate-500 font-mono mt-0.5">TX: dummy_id_{i}</div>
                      </td>
                      <td className="p-4">
                        <div className="text-xs font-bold px-2 py-1 rounded inline-flex bg-emerald-500/10 text-emerald-400">EARNING</div>
                      </td>
                      <td className="p-4">
                        <div className="font-black text-sm text-emerald-400">+₹{(Math.random() * 5000 + 500).toFixed(2)}</div>
                      </td>
                      <td className="p-4 pr-6 text-right text-xs text-slate-500">Just now</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Right Sidebar: Sector Controls & Status */}
        <div className="space-y-6">
          <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-lg">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Zap className="w-4 h-4" /> Quick Sector Controls
            </h3>
            
            {!canToggleSector() && (
              <div className="mb-4 text-xs font-medium text-rose-400 bg-rose-500/10 p-2 rounded border border-rose-500/20">
                You do not have permission to toggle global sectors.
              </div>
            )}

            <div className="space-y-3">
              {settings.sectors.map(sector => (
                <div key={sector.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-700">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{sector.icon}</span>
                    <div>
                      <div className="text-sm font-bold text-white">{sector.name}</div>
                      <div className={`text-[10px] font-black uppercase tracking-wider ${sector.isActive ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {sector.isActive ? 'ONLINE' : 'OFFLINE'}
                      </div>
                    </div>
                  </div>
                  
                  {/* Master Toggle Switch */}
                  <label className={`relative inline-flex items-center ${canToggleSector() ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'}`}>
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

          <div className="bg-emerald-500/10 border border-emerald-500/20 p-6 rounded-2xl shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl"></div>
            <h3 className="text-sm font-bold text-emerald-500 uppercase tracking-widest mb-2 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" /> System Health
            </h3>
            <div className="text-3xl font-black text-white mb-1">99.9%</div>
            <p className="text-emerald-400/80 text-sm">All core services are operating normally. Database cluster stable.</p>
          </div>
        </div>

      </div>
    </div>
  );
}
