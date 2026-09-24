"use client";

import React, { useState, useEffect } from 'react';
import { useAdminRole } from '@/context/AdminRoleContext';
import { ShieldAlert, Search, Check, X, Store, Info, Phone, Mail, Settings } from 'lucide-react';

export default function AdminSellersPage() {
  const { canEdit } = useAdminRole();
  const hasEditPermission = canEdit('sellers');

  const [pendingSellers, setPendingSellers] = useState<any[]>([]);
  const [activeSellers, setActiveSellers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  // Modal State
  const [selectedSeller, setSelectedSeller] = useState<any>(null);
  const [modelType, setModelType] = useState('commission');
  const [rate, setRate] = useState<number>(10);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  useEffect(() => {
    fetchSellers();
  }, [API_URL]);

  const fetchSellers = () => {
    setLoading(true);
    fetch(`${API_URL}/sellers`, { cache: 'no-store' })
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
  };

  const openReviewModal = (seller: any) => {
    setSelectedSeller(seller);
    const mType = seller.commissionType === 'FIXED' ? 'subscription' : 'commission';
    setModelType(mType);
    setRate(seller.commissionRate ?? (mType === 'commission' ? 10 : 1000));
  };

  const closeReviewModal = () => {
    setSelectedSeller(null);
    setIsSubmitting(false);
  };

  const handleApproveAndSave = async () => {
    if (!hasEditPermission || !selectedSeller) return;
    setIsSubmitting(true);
    try {
      const resStatus = await fetch(`${API_URL}/sellers/${selectedSeller.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Approved' })
      });
      
      const resBilling = await fetch(`${API_URL}/admin/businesses/${selectedSeller.id}/billing`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          commissionType: modelType === 'commission' ? 'PERCENTAGE' : 'FIXED',
          commissionRate: rate,
          subscriptionStatus: selectedSeller.subscriptionStatus || 'ACTIVE',
          subscriptionStartDate: selectedSeller.subscriptionStartDate || null,
          subscriptionEndDate: selectedSeller.subscriptionEndDate || null
        })
      });
      
      if (resStatus.ok && resBilling.ok) {
        fetchSellers();
        closeReviewModal();
      } else {
        alert('Failed to approve seller or save settings');
      }
    } catch (e) {
      console.error(e);
      alert('Error approving seller');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateSettings = async () => {
    if (!hasEditPermission || !selectedSeller) return;
    setIsSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/admin/businesses/${selectedSeller.id}/billing`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          commissionType: modelType === 'commission' ? 'PERCENTAGE' : 'FIXED',
          commissionRate: rate,
          subscriptionStatus: selectedSeller.subscriptionStatus || 'ACTIVE',
          subscriptionStartDate: selectedSeller.subscriptionStartDate || null,
          subscriptionEndDate: selectedSeller.subscriptionEndDate || null
        })
      });
      
      if (res.ok) {
        fetchSellers();
        closeReviewModal();
      } else {
        alert('Failed to update settings');
      }
    } catch (e) {
      console.error(e);
      alert('Error updating settings');
    } finally {
      setIsSubmitting(false);
    }
  };

  const rejectSeller = async (id: string) => {
    if (!hasEditPermission) return;
    if (!confirm('Are you sure you want to reject this application?')) return;
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
    <div className="max-w-6xl mx-auto animate-in fade-in duration-300 w-full pb-20">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Seller Onboarding & Approvals</h1>
          <p className="text-slate-400 mt-2 text-sm">Review incoming applications, verify details, and configure business models.</p>
        </div>
      </header>

      {!hasEditPermission && (
        <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-xl flex items-center gap-3 mb-8">
          <ShieldAlert className="w-5 h-5" />
          <p className="text-sm font-medium">You do not have permission to approve or configure sellers. Contact an Onboarding Admin.</p>
        </div>
      )}

      <div className="mb-6 relative w-full sm:w-96">
        <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
        <input 
          type="text" 
          placeholder="Search by business name or email..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-white focus:outline-none focus:border-emerald-500 w-full text-sm transition-colors" 
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
                
                <div className="relative z-10 space-y-1 mb-6">
                  <h3 className="text-lg font-bold text-white">{seller.businessName}</h3>
                  <div className="text-sm text-slate-400 flex items-center gap-2"><Mail className="w-3 h-3"/> {seller.email}</div>
                  <div className="text-sm text-slate-400 flex items-center gap-2"><Phone className="w-3 h-3"/> {seller.phone || 'No phone provided'}</div>
                  <div className="text-xs text-slate-500 font-mono mt-1 flex gap-2">
                    <span className="bg-slate-900 px-1.5 py-0.5 rounded text-emerald-400 border border-slate-700">{seller.businessCode || 'N/A'}</span>
                    <span className="bg-slate-900 px-1.5 py-0.5 rounded text-blue-400 border border-slate-700">{seller.user?.markatId || 'N/A'}</span>
                  </div>
                </div>

                {hasEditPermission && (
                  <div className="border-t border-slate-700/50 pt-4 flex gap-3 relative z-10">
                    <button 
                      onClick={() => rejectSeller(seller.id)}
                      className="flex-1 bg-slate-900 hover:bg-rose-500/10 text-slate-300 hover:text-rose-400 border border-slate-700 hover:border-rose-500/30 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2"
                    >
                      <X className="w-4 h-4" /> Reject
                    </button>
                    <button 
                      onClick={() => openReviewModal(seller)}
                      className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.2)] py-2.5 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2"
                    >
                      <Settings className="w-4 h-4" /> Review & Setup
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
                    <th className="p-4">Model & Rate</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 pr-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50">
                  {displayActive.map(seller => (
                    <tr key={seller.id} className="hover:bg-slate-700/30 transition-all group">
                      <td className="p-4 pl-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-slate-500">
                            <Store className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="font-bold text-white text-sm">{seller.businessName}</div>
                            <div className="text-[10px] text-slate-500 mt-1 font-mono flex items-center gap-1.5">
                              <span className="text-emerald-400">{seller.businessCode || 'N/A'}</span>
                              <span className="text-slate-600">|</span>
                              <span className="text-blue-400">{seller.user?.markatId || 'N/A'}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm text-slate-300 flex items-center gap-2"><Mail className="w-3 h-3"/> {seller.email}</div>
                        <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-2"><Phone className="w-3 h-3"/> {seller.phone || 'No phone'}</div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm text-emerald-400 font-bold capitalize">{seller.commissionType === 'FIXED' ? 'Subscription' : 'Commission'}</div>
                        <div className="text-xs text-slate-400">{seller.commissionRate !== undefined ? `${seller.commissionType === 'PERCENTAGE' ? seller.commissionRate + '%' : '₹' + seller.commissionRate}` : 'N/A'}</div>
                      </td>
                      <td className="p-4">
                        <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide">
                          Approved
                        </span>
                      </td>
                      <td className="p-4 pr-6 text-right">
                        <button 
                          onClick={() => openReviewModal(seller)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 hover:bg-slate-700 text-slate-300 border border-slate-700 px-3 py-1.5 rounded-lg text-xs font-bold"
                        >
                          Configure
                        </button>
                      </td>
                    </tr>
                  ))}
                  {!loading && displayActive.length === 0 && (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-slate-500">
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

      {/* Review & Setup Modal */}
      {selectedSeller && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 rounded-3xl w-full max-w-xl border border-slate-700 shadow-[0_0_50px_rgba(0,0,0,0.5)] transform animate-in zoom-in-95 duration-300 overflow-hidden flex flex-col max-h-[90vh]">
            
            <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
              <h2 className="text-xl font-black text-white flex items-center gap-3">
                <Settings className="w-5 h-5 text-emerald-400" />
                {selectedSeller.status === 'Approved' ? 'Configure Seller' : 'Review & Setup Approval'}
              </h2>
              <button onClick={closeReviewModal} className="text-slate-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-8 flex-1">
              
              {/* Seller Information */}
              <div className="space-y-4">
                <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-500">Seller Details (Verify via Call)</h3>
                <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50 space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-xs text-slate-500 mb-1">Business Name</div>
                      <div className="text-sm font-bold text-white">{selectedSeller.businessName}</div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500 mb-1">Business & User IDs</div>
                      <div className="text-sm font-bold text-slate-300 font-mono flex gap-2">
                        <span className="text-emerald-400">{selectedSeller.businessCode || 'N/A'}</span>
                        <span className="text-slate-600">/</span>
                        <span className="text-blue-400">{selectedSeller.user?.markatId || 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-xs text-slate-500 mb-1">Contact Person / Email</div>
                      <div className="text-sm font-bold text-white">{selectedSeller.email}</div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500 mb-1">Phone Number</div>
                      <div className="text-sm font-bold text-white">{selectedSeller.phone || 'Not provided'}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Business Model Configuration */}
              <div className="space-y-4">
                <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-500">Platform Fees Configuration</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <label className={`cursor-pointer p-4 rounded-xl border-2 transition-all ${modelType === 'commission' ? 'border-emerald-500 bg-emerald-500/10' : 'border-slate-700 bg-slate-800 hover:border-slate-600'}`}>
                    <input type="radio" name="modelType" value="commission" checked={modelType === 'commission'} onChange={(e) => { setModelType('commission'); if(!selectedSeller.rate) setRate(10); }} className="sr-only" />
                    <div className={`font-bold ${modelType === 'commission' ? 'text-emerald-400' : 'text-slate-300'}`}>Commission-based</div>
                    <div className="text-xs text-slate-500 mt-1">Take a percentage of each transaction.</div>
                  </label>
                  
                  <label className={`cursor-pointer p-4 rounded-xl border-2 transition-all ${modelType === 'subscription' ? 'border-emerald-500 bg-emerald-500/10' : 'border-slate-700 bg-slate-800 hover:border-slate-600'}`}>
                    <input type="radio" name="modelType" value="subscription" checked={modelType === 'subscription'} onChange={(e) => { setModelType('subscription'); if(!selectedSeller.rate) setRate(1000); }} className="sr-only" />
                    <div className={`font-bold ${modelType === 'subscription' ? 'text-emerald-400' : 'text-slate-300'}`}>Subscription-based</div>
                    <div className="text-xs text-slate-500 mt-1">Charge a fixed monthly/flat fee.</div>
                  </label>
                </div>

                <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                  <label className="block text-sm font-bold text-slate-300 mb-2">
                    {modelType === 'commission' ? 'Commission Percentage (%)' : 'Fixed Subscription Fee (Rs)'}
                  </label>
                  <div className="relative">
                    <input 
                      type="number" 
                      min="0"
                      value={rate}
                      onChange={(e) => setRate(Math.max(0, Number(e.target.value)))}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white font-black text-lg focus:outline-none focus:border-emerald-500 pl-12"
                    />
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-slate-500">
                      {modelType === 'commission' ? '%' : '₹'}
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">
                    {modelType === 'commission' 
                      ? `The platform will automatically deduct ${rate}% from the seller's sales.` 
                      : `The seller will be billed ₹${rate} as a fixed subscription/fee.`}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-slate-800 bg-slate-900/50 flex gap-4">
              <button 
                onClick={closeReviewModal} 
                className="flex-1 px-4 py-3 border border-slate-700 bg-slate-800 hover:bg-slate-700 rounded-xl font-bold text-slate-300 transition-colors"
              >
                Cancel
              </button>
              
              {selectedSeller.status !== 'Approved' ? (
                <button 
                  onClick={handleApproveAndSave}
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Check className="w-5 h-5" />
                  {isSubmitting ? 'Approving...' : 'Approve & Save Settings'}
                </button>
              ) : (
                <button 
                  onClick={handleUpdateSettings}
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold shadow-[0_0_20px_rgba(37,99,235,0.3)] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Settings className="w-5 h-5" />
                  {isSubmitting ? 'Updating...' : 'Update Settings'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
