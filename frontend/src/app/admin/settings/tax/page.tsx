"use client";

import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, X, Percent, Check } from 'lucide-react';

interface TaxRule {
  id: string;
  name: string;
  rate: number;
  status: string;
  updatedAt: string;
}

export default function SettingsTaxPage() {
  const [rules, setRules] = useState<TaxRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Form State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [rate, setRate] = useState<number | string>('');
  const [status, setStatus] = useState('ACTIVE');

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  const fetchRules = async () => {
    try {
      const res = await fetch(`${API_URL}/system-config/tax`);
      if (res.ok) {
        setRules(await res.json());
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRules();
  }, []);

  const handleOpenModal = (rule?: TaxRule) => {
    if (rule) {
      setEditingId(rule.id);
      setName(rule.name);
      setRate(rule.rate);
      setStatus(rule.status);
    } else {
      setEditingId(null);
      setName('');
      setRate('');
      setStatus('ACTIVE');
    }
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!name || rate === '') return alert('Name and Rate are required');
    const method = editingId ? 'PATCH' : 'POST';
    const endpoint = editingId ? `/system-config/tax/${editingId}` : '/system-config/tax';
    
    try {
      const res = await fetch(`${API_URL}${endpoint}`, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, rate: parseFloat(rate as string), status })
      });
      if (res.ok) {
        setShowModal(false);
        fetchRules();
      } else {
        alert('Failed to save tax rule');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this tax rule?')) return;
    try {
      const res = await fetch(`${API_URL}/system-config/tax/${id}`, { method: 'DELETE' });
      if (res.ok) fetchRules();
    } catch (e) {
      console.error(e);
    }
  };

  const filteredRules = rules.filter(r => 
    r.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
    (statusFilter === 'All' || r.status === statusFilter.toUpperCase())
  );

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in zoom-in-95 duration-500 w-full relative pb-20">
      
      {/* Background decorations */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px] -z-10 pointer-events-none" />

      <header className="flex justify-between items-end mb-10 relative z-10 border-b border-white/5 pb-8">
        <div className="flex gap-4 items-center">
          <div className="p-4 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl border border-blue-500/30 shadow-[0_0_30px_rgba(59,130,246,0.15)]">
            <Percent className="w-8 h-8 text-blue-400" />
          </div>
          <div>
            <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 tracking-tight">Tax Configuration</h1>
            <p className="text-slate-400 mt-2 text-sm font-medium">Manage global tax rates, VAT, and regional compliance structures.</p>
          </div>
        </div>
        
        <button 
          onClick={() => handleOpenModal()}
          className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(37,99,235,0.5)] flex items-center gap-2 hover:-translate-y-1"
        >
          <Plus className="w-5 h-5" /> Add Tax Rule
        </button>
      </header>

      <div className="bg-slate-900/40 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
        <div className="p-6 border-b border-white/5 flex flex-wrap gap-4 justify-between items-center bg-slate-900/50">
          <div className="relative w-full sm:w-80">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search tax rules..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950/50 border border-slate-700 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm" 
            />
          </div>
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-950/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm min-w-[150px]"
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-950/50 border-b border-white/5 text-slate-400 text-[10px] uppercase tracking-widest font-black">
              <tr>
                <th className="p-5 pl-8">Tax Name</th>
                <th className="p-5">Rate (%)</th>
                <th className="p-5">Status</th>
                <th className="p-5">Last Updated</th>
                <th className="p-5 pr-8 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500 font-medium">Loading tax rules...</td>
                </tr>
              ) : filteredRules.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500 font-medium">No tax rules found.</td>
                </tr>
              ) : (
                filteredRules.map(rule => (
                  <tr key={rule.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="p-5 pl-8 font-bold text-white flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                        <Percent className="w-4 h-4" />
                      </div>
                      {rule.name}
                    </td>
                    <td className="p-5 font-mono text-blue-400 font-bold text-lg">{rule.rate}%</td>
                    <td className="p-5">
                      <span className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                        rule.status === 'ACTIVE' 
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]' 
                          : 'bg-rose-500/10 text-rose-400 border-rose-500/20 shadow-[0_0_10px_rgba(244,63,94,0.1)]'
                      }`}>
                        {rule.status}
                      </span>
                    </td>
                    <td className="p-5 text-slate-400 text-sm font-medium">
                      {new Date(rule.updatedAt).toLocaleDateString()}
                    </td>
                    <td className="p-5 pr-8 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => handleOpenModal(rule)}
                          className="p-2 bg-slate-800 hover:bg-slate-700 text-blue-400 rounded-lg transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(rule.id)}
                          className="p-2 bg-slate-800 hover:bg-rose-900/30 hover:text-rose-400 text-slate-500 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="flex justify-between items-center p-6 border-b border-slate-700 bg-slate-800/50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400">
                  <Percent className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-white">{editingId ? 'Edit Tax Rule' : 'New Tax Rule'}</h3>
              </div>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white transition-colors bg-slate-800 p-2 rounded-full hover:bg-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-5">
              <div>
                <label className="text-xs font-black uppercase tracking-wider text-slate-400 mb-2 block">Rule Name (e.g. VAT, GST)</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-950/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                  placeholder="e.g. Standard VAT"
                />
              </div>

              <div>
                <label className="text-xs font-black uppercase tracking-wider text-slate-400 mb-2 block">Tax Rate (%)</label>
                <div className="relative">
                  <input 
                    type="number" 
                    step="0.01"
                    value={rate}
                    onChange={(e) => setRate(e.target.value)}
                    className="w-full bg-slate-950/50 border border-slate-700 rounded-xl pl-4 pr-10 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors font-mono font-bold"
                    placeholder="e.g. 15.00"
                  />
                  <Percent className="w-4 h-4 text-slate-500 absolute right-4 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div>
                <label className="text-xs font-black uppercase tracking-wider text-slate-400 mb-2 block">Status</label>
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => setStatus('ACTIVE')}
                    className={`py-3 rounded-xl border font-bold text-sm transition-all flex items-center justify-center gap-2 ${status === 'ACTIVE' ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]' : 'bg-slate-950/50 border-slate-700 text-slate-500 hover:bg-slate-800'}`}
                  >
                    {status === 'ACTIVE' && <Check className="w-4 h-4" />} Active
                  </button>
                  <button 
                    onClick={() => setStatus('INACTIVE')}
                    className={`py-3 rounded-xl border font-bold text-sm transition-all flex items-center justify-center gap-2 ${status === 'INACTIVE' ? 'bg-rose-500/10 border-rose-500/50 text-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.2)]' : 'bg-slate-950/50 border-slate-700 text-slate-500 hover:bg-slate-800'}`}
                  >
                    {status === 'INACTIVE' && <Check className="w-4 h-4" />} Inactive
                  </button>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-slate-700 bg-slate-800/30 flex justify-end gap-3">
              <button 
                onClick={() => setShowModal(false)}
                className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleSave}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-all shadow-[0_0_15px_rgba(37,99,235,0.4)]"
              >
                Save Tax Rule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
