"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Users, Store, TrendingUp, CheckCircle, XCircle, ArrowLeft, Activity, ShieldCheck } from 'lucide-react';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  
  // Mock data for sellers needing approval
  const [pendingSellers, setPendingSellers] = useState([
    { id: 'S-8872', name: 'Sagar Sports', type: 'Construction Raw Material', location: 'Bihar', phone: '0909090909', status: 'Pending', date: '2026-08-31' },
    { id: 'S-8798', name: 'ZoomDrive Rentals', type: 'Car Rentals', location: 'Mumbai', phone: '9876543210', status: 'Pending', date: '2026-09-01' }
  ]);

  const approveSeller = (id: string) => {
    setPendingSellers(pendingSellers.filter(s => s.id !== id));
    alert(`Seller ${id} approved successfully!`);
  };

  const rejectSeller = (id: string) => {
    setPendingSellers(pendingSellers.filter(s => s.id !== id));
    alert(`Seller ${id} rejected.`);
  };

  return (
    <div className="min-h-screen w-full bg-slate-900 text-slate-100 flex font-sans">
      
      {/* Sidebar - Dark Admin Theme */}
      <aside className="w-[280px] bg-slate-950 border-r border-slate-800 flex flex-col shrink-0">
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <Link href="/" className="text-emerald-500 flex items-center gap-2 hover:opacity-80 transition-opacity font-bold">
            <ArrowLeft className="w-5 h-5" /> Main Site
          </Link>
        </div>
        
        <div className="p-6 text-center">
          <div className="w-20 h-20 rounded-full bg-emerald-900/50 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto mb-4">
            <ShieldCheck className="w-10 h-10" />
          </div>
          <h3 className="text-lg font-bold text-white">Super Admin</h3>
          <div className="flex items-center justify-center gap-1 text-emerald-500 text-sm font-medium mt-1">
            System Online
          </div>
        </div>
        
        <nav className="flex-1 px-4 py-2 space-y-1">
          <button 
            onClick={() => setActiveTab('overview')} 
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'overview' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'}`}
          >
            <Activity className="w-5 h-5" /> Platform Health
          </button>
          <button 
            onClick={() => setActiveTab('approvals')} 
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'approvals' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'}`}
          >
            <div className="flex items-center gap-3">
              <Store className="w-5 h-5" /> Seller Approvals
            </div>
            {pendingSellers.length > 0 && (
              <span className="bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                {pendingSellers.length}
              </span>
            )}
          </button>
          <button 
            onClick={() => setActiveTab('users')} 
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'users' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'}`}
          >
            <Users className="w-5 h-5" /> Manage Users
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-10 bg-slate-900">
        
        {activeTab === 'overview' && (
          <div className="max-w-6xl mx-auto animate-in fade-in duration-300">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-white">Platform Health</h1>
              <p className="text-slate-400 mt-2">Real-time metrics for MarkatVerse ecosystem.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
              <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-sm">
                <div className="text-slate-400 text-sm font-medium mb-2">Total Gross Volume</div>
                <div className="text-3xl font-bold text-white">₹4.2 Cr</div>
                <div className="text-emerald-400 text-sm font-medium mt-2">↑ 8.4% this week</div>
              </div>
              <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-sm">
                <div className="text-slate-400 text-sm font-medium mb-2">Active Sellers</div>
                <div className="text-3xl font-bold text-white">1,204</div>
                <div className="text-emerald-400 text-sm font-medium mt-2">↑ 12 new today</div>
              </div>
              <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-sm">
                <div className="text-slate-400 text-sm font-medium mb-2">Total Buyers</div>
                <div className="text-3xl font-bold text-white">45.2K</div>
                <div className="text-emerald-400 text-sm font-medium mt-2">↑ 450 new today</div>
              </div>
              <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-sm">
                <div className="text-slate-400 text-sm font-medium mb-2">Active Services</div>
                <div className="text-3xl font-bold text-emerald-400">892</div>
                <div className="text-slate-500 text-sm font-medium mt-2">Bookable right now</div>
              </div>
            </div>

            <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700">
              <h3 className="text-xl font-bold text-white mb-6">Recent Transactions</h3>
              <div className="space-y-4">
                {[
                  { id: 'TXN-9982', type: 'Product Sale', amount: '₹1,34,900', status: 'Completed', time: '2 mins ago' },
                  { id: 'TXN-9981', type: 'Service Token', amount: '₹299', status: 'Completed', time: '15 mins ago' },
                  { id: 'TXN-9980', type: 'B2B Freight', amount: '₹4,500', status: 'Pending', time: '1 hour ago' },
                  { id: 'TXN-9979', type: 'Premium Subscription', amount: '₹15,000', status: 'Completed', time: '2 hours ago' },
                ].map((txn, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
                    <div>
                      <div className="font-bold text-white">{txn.id}</div>
                      <div className="text-sm text-slate-400">{txn.type}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-white">{txn.amount}</div>
                      <div className="text-sm text-slate-400 flex items-center gap-2 justify-end">
                        <span className={`w-2 h-2 rounded-full ${txn.status === 'Completed' ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                        {txn.time}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'approvals' && (
          <div className="max-w-6xl mx-auto animate-in fade-in duration-300">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-white">Seller Approvals</h1>
              <p className="text-slate-400 mt-2">Review and verify new business onboardings.</p>
            </div>
            
            <div className="bg-slate-800 rounded-2xl border border-slate-700 shadow-sm overflow-hidden">
              {pendingSellers.length === 0 ? (
                <div className="p-16 text-center">
                  <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">All caught up!</h3>
                  <p className="text-slate-400">There are no pending seller approvals right now.</p>
                </div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-900/50 border-b border-slate-700 text-slate-400 text-xs uppercase tracking-wider font-semibold">
                      <th className="p-4 pl-6">Business Name</th>
                      <th className="p-4">Type/Category</th>
                      <th className="p-4">Location</th>
                      <th className="p-4">Contact</th>
                      <th className="p-4">Date Applied</th>
                      <th className="p-4 pr-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/50">
                    {pendingSellers.map((seller) => (
                      <tr key={seller.id} className="hover:bg-slate-700/30 transition-colors">
                        <td className="p-4 pl-6 font-bold text-white">
                          <div>{seller.name}</div>
                          <div className="text-xs text-slate-500 font-normal">{seller.id}</div>
                        </td>
                        <td className="p-4 text-slate-300">
                          <span className="bg-slate-900 px-2 py-1 rounded text-xs">{seller.type}</span>
                        </td>
                        <td className="p-4 text-slate-300">{seller.location}</td>
                        <td className="p-4 text-slate-300 text-sm">{seller.phone}</td>
                        <td className="p-4 text-slate-400 text-sm">{seller.date}</td>
                        <td className="p-4 pr-6 text-right">
                          <div className="flex justify-end gap-2">
                            <button 
                              onClick={() => approveSeller(seller.id)}
                              className="bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors flex items-center gap-1"
                            >
                              <CheckCircle className="w-4 h-4" /> Approve
                            </button>
                            <button 
                              onClick={() => rejectSeller(seller.id)}
                              className="bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors flex items-center gap-1"
                            >
                              <XCircle className="w-4 h-4" /> Reject
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="max-w-6xl mx-auto animate-in fade-in duration-300 text-center py-20">
            <Users className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">User Management</h2>
            <p className="text-slate-400">View and manage B2B and B2C user accounts.</p>
          </div>
        )}

      </main>
    </div>
  );
}
