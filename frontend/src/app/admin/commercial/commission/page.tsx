"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useAdminRole } from '@/context/AdminRoleContext';
import { ShieldAlert, Receipt, DollarSign, Search, Activity, FileText, Settings, X, Calendar, Percent } from 'lucide-react';

export default function AdminCommercialCommissionPage() {
  const { canEdit } = useAdminRole();
  const hasEditPermission = canEdit('commercial') || canEdit('super_admin');
  
  const [billingData, setBillingData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Modal State
  const [editingSeller, setEditingSeller] = useState<any>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  useEffect(() => {
    const fetchBillingData = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`${API_URL}/admin/businesses`);
        if (!res.ok) throw new Error('Failed to fetch businesses');
        const businesses = await res.json();
        
        let data = [];
        
        for (const business of businesses) {
          const seller = business.user;
          const walletBal = business.wallet?.balance || 0;
          const walletId = business.wallet?.id || '';

          const planConfig = {
            planType: business.commissionType === 'PERCENTAGE' ? 'commission' : 'subscription',
            commissionRate: business.commissionRate || 5, 
            flatRate: business.commissionType === 'FIXED' ? business.commissionRate : 999,
            subStart: business.subscriptionStartDate || new Date().toISOString(),
            subNext: business.subscriptionEndDate || new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString(),
          };

          let owedToPlatform = 0;
          let totalEarnedFromShop = 0;
          
          if (planConfig.planType === 'commission') {
            owedToPlatform = walletBal * (planConfig.commissionRate / 100);
            totalEarnedFromShop = (walletBal * 3) * (planConfig.commissionRate / 100); 
          } else {
            owedToPlatform = planConfig.flatRate;
            totalEarnedFromShop = planConfig.flatRate * 4;
          }

          data.push({
            id: business.id, // we use business id for billing updates
            userId: business.userId,
            name: business.name || seller?.name || 'Unknown',
            email: seller?.email || 'N/A',
            phone: seller?.phone || 'N/A',
            walletId,
            walletBalance: walletBal,
            ...planConfig,
            owedToPlatform,
            totalEarnedFromShop,
          });
        }
        setBillingData(data.filter((d: any) => d.planType === 'commission'));
      } catch (e) {
        console.error("Failed to fetch billing data", e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBillingData();
  }, []);

  const handleChargePlatformFee = async (sellerId: string) => {
    if (!hasEditPermission) return;
    if (!confirm("Are you sure you want to deduct the platform fees directly from this seller's wallet?")) return;

    try {
      const res = await fetch(`${API_URL}/wallet/business/${sellerId}/pay-platform`, { method: 'POST' });
      if (res.ok) {
        alert("Platform fee deducted successfully.");
        setBillingData(prev => prev.map(s => s.id === sellerId ? { ...s, owedToPlatform: 0 } : s));
      } else {
        alert("Failed to charge platform fee. Ensure seller has sufficient balance.");
      }
    } catch (e) {
      alert("Network Error");
    }
  };

  const handleSavePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Recalculate
    let newOwed = 0;
    if (editingSeller.planType === 'commission') {
      newOwed = editingSeller.walletBalance * (editingSeller.commissionRate / 100);
    } else {
      newOwed = editingSeller.flatRate;
    }
    const updatedSeller = { ...editingSeller, owedToPlatform: newOwed };

    try {
      const res = await fetch(`${API_URL}/admin/businesses/${editingSeller.id}/billing`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          commissionType: editingSeller.planType === 'commission' ? 'PERCENTAGE' : 'FIXED',
          commissionRate: editingSeller.planType === 'commission' ? editingSeller.commissionRate : editingSeller.flatRate,
          subscriptionStatus: 'ACTIVE',
          subscriptionStartDate: editingSeller.subStart,
          subscriptionEndDate: editingSeller.subNext,
        })
      });

      if (!res.ok) throw new Error('Failed to update billing details');

      // Update local state 
      if (editingSeller.planType !== 'commission') {
        setBillingData(prev => prev.filter(s => s.id !== editingSeller.id));
      } else {
        setBillingData(prev => prev.map(s => s.id === editingSeller.id ? updatedSeller : s));
      }
      setEditingSeller(null);
    } catch (error) {
      console.error(error);
      alert('Error updating billing plan');
    }
  };

  const filteredData = billingData.filter(s => s.name?.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="max-w-7xl mx-auto animate-in fade-in duration-300 w-full relative pb-10">
      
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-white tracking-tight">Seller Commissions</h1>
        <p className="text-slate-400 mt-2 text-sm">Monitor and adjust custom commission rates for Pay-As-You-Go sellers, and collect platform earnings per shop.</p>
      </header>

      {!hasEditPermission && (
        <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-xl flex items-center gap-3 mb-8">
          <ShieldAlert className="w-5 h-5" />
          <p className="text-sm font-medium">You do not have permission to modify commercial plans or charge fees.</p>
        </div>
      )}

      {/* Top Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-lg relative overflow-hidden">
          <div className="text-slate-400 font-bold text-sm mb-4">Total Pending Collection</div>
          <div className="text-3xl font-black text-emerald-400 mb-1">
            ₹{billingData.reduce((acc, curr) => acc + curr.owedToPlatform, 0).toLocaleString()}
          </div>
          <div className="text-xs text-slate-500 mt-2">Sum of all outstanding platform fees</div>
        </div>
        
        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-lg relative overflow-hidden">
          <div className="text-slate-400 font-bold text-sm mb-4">Commission-based Sellers</div>
          <div className="text-3xl font-black text-white mb-1">
            {billingData.length}
          </div>
          <div className="text-xs text-slate-500 mt-2">Custom % per transaction</div>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-slate-800 rounded-2xl border border-slate-700 shadow-lg overflow-hidden flex flex-col relative min-h-[500px]">
        <div className="p-6 border-b border-slate-700 bg-slate-900/50 flex flex-col sm:flex-row justify-between items-center gap-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Receipt className="w-5 h-5 text-indigo-400" /> Active Billing Ledgers
          </h3>
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search sellers..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-4 py-2 text-white focus:outline-none focus:border-indigo-500 text-sm" 
            />
          </div>
        </div>

        <div className="overflow-x-auto relative z-10 flex-1">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-full opacity-50 py-20">
              <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
              <div className="font-bold text-white">Aggregating Seller Financials...</div>
            </div>
          ) : filteredData.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full opacity-50 py-20">
              <Activity className="w-12 h-12 mb-4 text-slate-500" />
              <div className="font-bold text-white">No active sellers found.</div>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-900/80 sticky top-0 border-b border-slate-700 text-slate-400 text-[10px] uppercase tracking-widest font-black">
                <tr>
                  <th className="p-4 pl-6">Business / Seller</th>
                  <th className="p-4">Assigned Plan</th>
                  <th className="p-4 text-right">Owed To Platform</th>
                  <th className="p-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {filteredData.map(seller => (
                  <tr key={seller.id} className="hover:bg-slate-700/30 transition-all">
                    <td className="p-4 pl-6">
                      <div className="font-bold text-white text-sm">{seller.name}</div>
                      <div className="text-xs text-indigo-400 font-medium mt-0.5">Total Earned from Shop: ₹{seller.totalEarnedFromShop.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
                    </td>
                    <td className="p-4">
                        <div className="inline-flex items-center gap-1.5 bg-indigo-500/10 text-indigo-400 px-2 py-1 rounded border border-indigo-500/20 text-xs font-bold uppercase tracking-wider">
                          <Percent className="w-3 h-3" /> Pay-As-You-Go ({seller.commissionRate}%)
                        </div>
                    </td>
                    <td className="p-4 text-right">
                      <div className="font-black text-emerald-400 bg-emerald-500/5 inline-block px-3 py-1 rounded-lg border border-emerald-500/10">
                        ₹{seller.owedToPlatform.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>
                    </td>
                    <td className="p-4 pr-6 text-right flex items-center justify-end gap-2">
                      <button 
                        onClick={() => setEditingSeller(seller)}
                        disabled={!hasEditPermission}
                        className="inline-flex items-center justify-center p-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Configure Plan"
                      >
                        <Settings className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleChargePlatformFee(seller.id)}
                        disabled={!hasEditPermission || seller.owedToPlatform <= 0}
                        className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-2 rounded-lg text-xs font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed w-28"
                      >
                        <DollarSign className="w-3.5 h-3.5" /> Collect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Edit Plan Modal */}
      {editingSeller && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-950/50">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Settings className="w-5 h-5 text-indigo-400" /> Configure Billing Plan
              </h2>
              <button onClick={() => setEditingSeller(null)} className="text-slate-500 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSavePlan} className="p-6 space-y-6">
              
              <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 flex justify-between items-center">
                <div>
                  <div className="text-sm font-bold text-white">{editingSeller.name}</div>
                  <div className="text-xs text-slate-400">Total Lifetime Earnings: <span className="text-emerald-400 font-bold">₹{editingSeller.totalEarnedFromShop.toLocaleString()}</span></div>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Plan Type</label>
                <select
                  value={editingSeller.planType}
                  onChange={(e) => setEditingSeller({ ...editingSeller, planType: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="commission">Pay-As-You-Go (Commission)</option>
                  <option value="subscription">Monthly Subscription</option>
                </select>
              </div>

              {editingSeller.planType === 'commission' ? (
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Platform Cut Percentage (%)</label>
                  <div className="relative">
                    <Percent className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input 
                      type="number" 
                      min="0" max="100" step="0.1"
                      value={isNaN(editingSeller.commissionRate) ? '' : editingSeller.commissionRate}
                      onChange={(e) => setEditingSeller({...editingSeller, commissionRate: parseFloat(e.target.value)})}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <p className="text-xs text-slate-500 mt-2">Adjust the exact percentage the platform takes from every transaction for this specific seller.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Monthly Flat Rate (₹)</label>
                    <div className="relative">
                      <DollarSign className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input 
                        type="number" 
                        value={isNaN(editingSeller.flatRate) ? '' : editingSeller.flatRate}
                        onChange={(e) => setEditingSeller({...editingSeller, flatRate: parseFloat(e.target.value)})}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Subscription Started</label>
                      <div className="relative">
                        <Calendar className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                        <input 
                          type="date" 
                          value={editingSeller.subStart.split('T')[0]}
                          onChange={(e) => setEditingSeller({...editingSeller, subStart: new Date(e.target.value).toISOString()})}
                          className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Next Billing Date</label>
                      <div className="relative">
                        <Calendar className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-amber-500" />
                        <input 
                          type="date" 
                          value={editingSeller.subNext.split('T')[0]}
                          onChange={(e) => setEditingSeller({...editingSeller, subNext: new Date(e.target.value).toISOString()})}
                          className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-amber-400 font-bold text-sm focus:outline-none focus:border-amber-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setEditingSeller(null)} className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 rounded-xl transition-colors">
                  Cancel
                </button>
                <button type="submit" className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl transition-colors shadow-lg shadow-indigo-500/20">
                  Save Plan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
