"use client";
import React, { useState, useEffect, useMemo } from 'react';

type Branch = {
  id: string;
  businessId: string;
  name: string;
  status: 'Active' | 'Inactive';
  createdAt: string;
  updatedAt: string;
  business: {
    name: string;
  };
};

type Business = {
  id: string;
  name: string;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export default function BusinessesgtBranchesPage() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Form State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formName, setFormName] = useState('');
  const [formStatus, setFormStatus] = useState<'Active' | 'Inactive'>('Active');
  const [formBusinessId, setFormBusinessId] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [branchesRes, businessesRes] = await Promise.all([
        fetch(`${API_URL}/admin/businesses/branches`),
        fetch(`${API_URL}/admin/businesses`)
      ]);
      const branchesData = await branchesRes.json();
      const businessesData = await businessesRes.json();
      setBranches(Array.isArray(branchesData) ? branchesData : []);
      setBusinesses(Array.isArray(businessesData) ? businessesData : []);
    } catch (error) {
      console.error('Failed to load data', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredBranches = useMemo(() => {
    return branches.filter(b => {
      const matchesSearch = b.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            b.business?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            b.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'All Status' || b.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [branches, searchTerm, statusFilter]);

  const handleOpenModal = (branch?: Branch) => {
    if (branch) {
      setEditingId(branch.id);
      setFormName(branch.name);
      setFormStatus(branch.status);
      setFormBusinessId(branch.businessId);
    } else {
      setEditingId(null);
      setFormName('');
      setFormStatus('Active');
      setFormBusinessId(businesses.length > 0 ? businesses[0].id : '');
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormName('');
    setFormStatus('Active');
    setFormBusinessId('');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formBusinessId) return;

    try {
      if (editingId) {
        await fetch(`${API_URL}/admin/businesses/branches/${editingId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: formName, status: formStatus, businessId: formBusinessId })
        });
      } else {
        await fetch(`${API_URL}/admin/businesses/branches`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: formName, status: formStatus, businessId: formBusinessId })
        });
      }
      handleCloseModal();
      fetchData(); // Refresh list
    } catch (error) {
      console.error("Failed to save branch", error);
      alert("Failed to save branch");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this branch?')) {
      try {
        await fetch(`${API_URL}/admin/businesses/branches/${id}`, {
          method: 'DELETE',
        });
        fetchData(); // Refresh list
      } catch (error) {
        console.error("Failed to delete branch", error);
        alert("Failed to delete branch");
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in duration-300 w-full relative">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Businesses &gt; Branches</h1>
          <p className="text-slate-400 mt-2 text-sm">Manage and configure businesses &gt; branches.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_25px_rgba(16,185,129,0.5)] flex items-center gap-2"
        >
          + Add New
        </button>
      </header>

      <div className="bg-slate-800 rounded-2xl border border-slate-700 shadow-lg overflow-hidden">
        <div className="p-4 border-b border-slate-700 flex justify-between gap-4">
          <input 
            type="text" 
            placeholder="Search branches or business..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500 w-full max-w-xs" 
          />
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500"
          >
            <option>All Status</option>
            <option>Active</option>
            <option>Inactive</option>
          </select>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-900/80 border-b border-slate-700 text-slate-400 text-[10px] uppercase tracking-widest font-black">
              <tr>
                <th className="p-4 pl-6">ID</th>
                <th className="p-4">Branch Name</th>
                <th className="p-4">Business</th>
                <th className="p-4">Status</th>
                <th className="p-4">Date Added</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">Loading branches...</td>
                </tr>
              ) : filteredBranches.length > 0 ? (
                filteredBranches.map(branch => (
                  <tr key={branch.id} className="hover:bg-slate-700/50 transition-all">
                    <td className="p-4 pl-6 font-mono text-xs text-slate-500" title={branch.id}>
                      ...{branch.id.slice(-6)}
                    </td>
                    <td className="p-4 font-bold text-white">{branch.name}</td>
                    <td className="p-4 text-slate-300">{branch.business?.name || 'Unknown Business'}</td>
                    <td className="p-4">
                      {branch.status === 'Active' ? (
                        <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-full text-xs font-bold">Active</span>
                      ) : (
                        <span className="bg-rose-500/10 text-rose-400 border border-rose-500/20 px-2.5 py-1 rounded-full text-xs font-bold">Inactive</span>
                      )}
                    </td>
                    <td className="p-4 text-slate-400 text-sm">{new Date(branch.createdAt).toLocaleDateString()}</td>
                    <td className="p-4 pr-6 text-right">
                      <button onClick={() => handleOpenModal(branch)} className="text-slate-500 hover:text-blue-400 px-2 transition-colors">Edit</button>
                      <button onClick={() => handleDelete(branch.id)} className="text-slate-500 hover:text-rose-400 px-2 transition-colors">Delete</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">
                    No branches found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-700 flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">
                {editingId ? 'Edit Branch' : 'Add New Branch'}
              </h2>
              <button onClick={handleCloseModal} className="text-slate-400 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Business</label>
                <select 
                  required
                  value={formBusinessId}
                  onChange={e => setFormBusinessId(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                >
                  <option value="" disabled>Select Business...</option>
                  {businesses.map(b => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Branch Name</label>
                <input 
                  type="text" 
                  required
                  value={formName}
                  onChange={e => setFormName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                  placeholder="e.g. Main Downtown Branch"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Status</label>
                <select 
                  value={formStatus}
                  onChange={e => setFormStatus(e.target.value as 'Active' | 'Inactive')}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  type="button" 
                  onClick={handleCloseModal}
                  className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-2.5 rounded-xl font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white py-2.5 rounded-xl font-semibold transition-colors shadow-lg shadow-emerald-900/20"
                >
                  {editingId ? 'Save Changes' : 'Create Branch'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
