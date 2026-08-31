"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('Overview');
  const [sellers, setSellers] = useState<any[]>([]);

  const { user, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user?.role !== 'admin') {
      router.push('/admin/login');
    }
  }, [user, router]);

  useEffect(() => {
    fetch('http://localhost:3001/sellers')
      .then(res => res.json())
      .then(data => setSellers(data))
      .catch(err => console.error("Error fetching sellers:", err));
  }, []);

  const handleApprove = async (id: string) => {
    try {
      const res = await fetch(`http://localhost:3001/sellers/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Approved' })
      });
      if (res.ok) {
        setSellers(sellers.map(s => s.id === id ? { ...s, status: 'Approved' } : s));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleReject = async (id: string) => {
    try {
      const res = await fetch(`http://localhost:3001/sellers/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Rejected' })
      });
      if (res.ok) {
        setSellers(sellers.map(s => s.id === id ? { ...s, status: 'Rejected' } : s));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const pendingCount = sellers.filter(s => s.status === 'Pending').length;
  const approvedCount = sellers.filter(s => s.status === 'Approved').length;
  const rejectedCount = sellers.filter(s => s.status === 'Rejected').length;
  const totalCount = sellers.length;

  const tabs = [
    { id: 'Overview', icon: '📊', badge: '' },
    { id: 'Approvals', icon: '🛡️', badge: pendingCount > 0 ? String(pendingCount) : '' },
    { id: 'Users', icon: '👥', badge: '' },
    { id: 'Products', icon: '🛍️', badge: '' },
    { id: 'Finance', icon: '💰', badge: '' },
    { id: 'Support', icon: '🎧', badge: '' },
    { id: 'Settings', icon: '⚙️', badge: '' },
  ];

  if (user?.role !== 'admin') return null;

  return (
    <div className="flex min-h-screen bg-slate-50">
      
      {/* ── Sidebar ── */}
      <div className="w-[260px] bg-white border-r border-slate-200 flex flex-col shrink-0">
        {/* Logo Area */}
        <div className="p-5 border-b border-slate-200">
          <img src="/logo.png" alt="MarkatVerse" className="h-8 object-contain" />
          <div className="text-[10px] text-amber-600 font-bold tracking-widest mt-1">ADMIN PORTAL</div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="list-none p-0 flex flex-col gap-1">
            {tabs.map(tab => (
              <li 
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2.5 rounded-lg cursor-pointer flex items-center gap-3 transition-all text-sm ${
                  activeTab === tab.id 
                    ? 'bg-amber-50 text-amber-700 font-medium border border-amber-200' 
                    : 'bg-transparent text-slate-600 hover:bg-slate-50 font-normal border border-transparent'
                }`}
              >
                <span className="text-base">{tab.icon}</span>
                <span className="flex-1">{tab.id}</span>
                {tab.badge && (
                  <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold min-w-[18px] text-center">
                    {tab.badge}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* Admin Profile */}
        <div className="p-4 border-t border-slate-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 bg-amber-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
              SA
            </div>
            <div>
              <div className="text-sm font-medium text-slate-900">System Admin</div>
              <div className="text-[10px] text-slate-400">{user?.email}</div>
            </div>
          </div>
          <button 
            onClick={() => { logout(); router.push('/'); }}
            className="w-full px-3 py-2 text-xs text-red-500 border border-red-200 rounded-lg bg-white hover:bg-red-50 cursor-pointer transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* ── Main Content ── */}
      <div className="flex-1 p-8 overflow-y-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              {activeTab === 'Overview' ? 'Dashboard Overview' :
               activeTab === 'Approvals' ? 'Seller Approvals' :
               activeTab === 'Users' ? 'Platform Users' :
               `${activeTab}`}
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              {activeTab === 'Overview' ? 'Welcome back, Admin. Here\'s your platform summary.' :
               activeTab === 'Approvals' ? 'Review and approve new seller registrations.' :
               activeTab === 'Users' ? 'Manage all approved sellers on the platform.' :
               `Manage the ${activeTab.toLowerCase()} module.`}
            </p>
          </div>
          <div className="text-xs text-slate-400">
            {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </div>

        {/* ─── OVERVIEW TAB ─── */}
        {activeTab === 'Overview' && (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-4 gap-5 mb-8">
              {[
                { label: 'Total Sellers', value: totalCount, icon: '🏢', color: 'blue', bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
                { label: 'Pending Approvals', value: pendingCount, icon: '⏳', color: 'amber', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
                { label: 'Approved', value: approvedCount, icon: '✅', color: 'emerald', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
                { label: 'Rejected', value: rejectedCount, icon: '❌', color: 'red', bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
              ].map((stat, i) => (
                <div key={i} className={`${stat.bg} p-5 rounded-xl border ${stat.border}`}>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl">{stat.icon}</span>
                  </div>
                  <div className={`text-3xl font-bold ${stat.text}`}>{stat.value}</div>
                  <div className="text-xs text-slate-500 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Quick Actions + Recent Activity */}
            <div className="grid grid-cols-2 gap-6">
              {/* Quick Actions */}
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <h3 className="text-sm font-bold text-slate-900 mb-4">Quick Actions</h3>
                <div className="flex flex-col gap-3">
                  <button onClick={() => setActiveTab('Approvals')} className="flex items-center gap-3 p-3 rounded-lg bg-amber-50 border border-amber-200 hover:bg-amber-100 transition-colors cursor-pointer text-left">
                    <span className="text-lg">🛡️</span>
                    <div>
                      <div className="text-sm font-medium text-slate-900">Review Approvals</div>
                      <div className="text-xs text-slate-500">{pendingCount} pending requests</div>
                    </div>
                  </button>
                  <button onClick={() => setActiveTab('Users')} className="flex items-center gap-3 p-3 rounded-lg bg-blue-50 border border-blue-200 hover:bg-blue-100 transition-colors cursor-pointer text-left">
                    <span className="text-lg">👥</span>
                    <div>
                      <div className="text-sm font-medium text-slate-900">Manage Users</div>
                      <div className="text-xs text-slate-500">{approvedCount} active sellers</div>
                    </div>
                  </button>
                  <button className="flex items-center gap-3 p-3 rounded-lg bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 transition-colors cursor-pointer text-left">
                    <span className="text-lg">📊</span>
                    <div>
                      <div className="text-sm font-medium text-slate-900">View Analytics</div>
                      <div className="text-xs text-slate-500">Platform performance metrics</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Recent Sellers */}
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <h3 className="text-sm font-bold text-slate-900 mb-4">Recent Registrations</h3>
                {sellers.length > 0 ? (
                  <div className="flex flex-col gap-3">
                    {sellers.slice(0, 4).map((seller, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
                        <div className="w-9 h-9 bg-slate-200 rounded-lg flex items-center justify-center text-sm">🏢</div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-slate-900 truncate">{seller.name}</div>
                          <div className="text-[10px] text-slate-400">{seller.type} · {seller.location}</div>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-[10px] font-medium ${
                          seller.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' :
                          seller.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                          'bg-amber-100 text-amber-700'
                        }`}>
                          {seller.status}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-slate-400 py-8 text-sm">No sellers registered yet.</div>
                )}
              </div>
            </div>
          </>
        )}

        {/* ─── APPROVALS TAB ─── */}
        {activeTab === 'Approvals' && (
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="p-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Seller ID</th>
                  <th className="p-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Business Name</th>
                  <th className="p-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Category</th>
                  <th className="p-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Location</th>
                  <th className="p-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="p-4 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sellers.filter(s => s.status === 'Pending').map((seller) => (
                  <tr key={seller.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="p-4 text-xs text-slate-400 font-mono">{seller.id?.substring(0, 8)}...</td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-amber-100 text-amber-700 rounded-lg flex items-center justify-center text-xs font-bold">
                          {seller.name?.charAt(0) || 'S'}
                        </div>
                        <span className="font-medium text-sm text-slate-900">{seller.name}</span>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-slate-500">{seller.type}</td>
                    <td className="p-4 text-sm text-slate-500">{seller.location}</td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-medium bg-amber-100 text-amber-700">
                        ⏳ Pending
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="px-3 py-1.5 border border-slate-300 rounded-lg bg-white text-slate-600 text-xs cursor-pointer hover:bg-slate-50 transition-colors">
                          View
                        </button>
                        <button 
                          onClick={() => handleApprove(seller.id)} 
                          className="px-3 py-1.5 border-none rounded-lg bg-emerald-500 text-white text-xs font-medium cursor-pointer hover:bg-emerald-600 transition-colors"
                        >
                          ✓ Approve
                        </button>
                        <button 
                          onClick={() => handleReject(seller.id)} 
                          className="px-3 py-1.5 border-none rounded-lg bg-red-500 text-white text-xs font-medium cursor-pointer hover:bg-red-600 transition-colors"
                        >
                          ✕ Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {pendingCount === 0 && (
                  <tr>
                    <td colSpan={6} className="p-12 text-center">
                      <div className="text-4xl mb-3">✅</div>
                      <div className="text-slate-500 font-medium">All caught up!</div>
                      <div className="text-slate-400 text-xs mt-1">No pending approvals at the moment.</div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* ─── USERS TAB ─── */}
        {activeTab === 'Users' && (
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="p-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Seller</th>
                  <th className="p-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Category</th>
                  <th className="p-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Location</th>
                  <th className="p-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="p-4 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sellers.filter(s => s.status === 'Approved').map((seller) => (
                  <tr key={seller.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-emerald-100 text-emerald-700 rounded-lg flex items-center justify-center text-xs font-bold">
                          {seller.name?.charAt(0) || 'S'}
                        </div>
                        <div>
                          <div className="font-medium text-sm text-slate-900">{seller.name}</div>
                          <div className="text-[10px] text-slate-400">ID: {seller.id?.substring(0, 8)}...</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-slate-500">{seller.type}</td>
                    <td className="p-4 text-sm text-slate-500">{seller.location}</td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-medium bg-emerald-100 text-emerald-700">
                        ✓ Active
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button className="px-3 py-1.5 border border-slate-300 rounded-lg bg-white text-slate-600 text-xs cursor-pointer hover:bg-slate-50 transition-colors">
                        View Profile
                      </button>
                    </td>
                  </tr>
                ))}
                {approvedCount === 0 && (
                  <tr>
                    <td colSpan={5} className="p-12 text-center">
                      <div className="text-4xl mb-3">👥</div>
                      <div className="text-slate-500 font-medium">No active sellers yet</div>
                      <div className="text-slate-400 text-xs mt-1">Approve pending sellers to see them here.</div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* ─── OTHER TABS (Coming Soon) ─── */}
        {!['Overview', 'Approvals', 'Users'].includes(activeTab) && (
          <div className="bg-white rounded-xl border border-slate-200 p-16 text-center">
            <div className="w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">🚧</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">{activeTab} Module</h2>
            <p className="text-slate-500 text-sm mb-6">This module is currently under development.</p>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-500">
              <span>🔔</span> You&apos;ll be notified when this feature is ready
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
