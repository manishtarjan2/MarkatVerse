"use client";

import React, { useState, useEffect } from 'react';
import { ShieldAlert, Plus, Search, Edit2, Trash2, X, Check } from 'lucide-react';

interface SecurityAlert {
  id: string;
  title: string;
  description: string | null;
  status: string;
  updatedAt: string;
}

export default function SecurityAlertsPage() {
  const [alerts, setAlerts] = useState<SecurityAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Form State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('ACTIVE');

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  const fetchAlerts = async () => {
    try {
      const res = await fetch(`${API_URL}/security/alerts`);
      if (res.ok) {
        setAlerts(await res.json());
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  const handleOpenModal = (alert?: SecurityAlert) => {
    if (alert) {
      setEditingId(alert.id);
      setTitle(alert.title);
      setDescription(alert.description || '');
      setStatus(alert.status);
    } else {
      setEditingId(null);
      setTitle('');
      setDescription('');
      setStatus('ACTIVE');
    }
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!title) return window.alert('Title is required');
    const method = editingId ? 'PATCH' : 'POST';
    const endpoint = editingId ? `/security/alerts/${editingId}` : '/security/alerts';
    
    try {
      const res = await fetch(`${API_URL}${endpoint}`, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, status })
      });
      if (res.ok) {
        setShowModal(false);
        fetchAlerts();
      } else {
        window.alert('Failed to save security alert');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this alert?')) return;
    try {
      const res = await fetch(`${API_URL}/security/alerts/${id}`, { method: 'DELETE' });
      if (res.ok) fetchAlerts();
    } catch (e) {
      console.error(e);
    }
  };

  const filteredAlerts = alerts.filter(a => 
    a.title.toLowerCase().includes(searchTerm.toLowerCase()) && 
    (statusFilter === 'All' || a.status === statusFilter.toUpperCase())
  );

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in zoom-in-95 duration-500 w-full relative pb-20">
      
      {/* Background decorations */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-[100px] -z-10 pointer-events-none" />

      <header className="flex justify-between items-end mb-10 relative z-10 border-b border-white/5 pb-8">
        <div className="flex gap-4 items-center">
          <div className="p-4 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-2xl border border-emerald-500/30 shadow-[0_0_30px_rgba(16,185,129,0.15)]">
            <ShieldAlert className="w-8 h-8 text-emerald-400" />
          </div>
          <div>
            <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 tracking-tight">Security Alerts</h1>
            <p className="text-slate-400 mt-2 text-sm font-medium">Manage and configure security alerts and monitoring triggers.</p>
          </div>
        </div>
        
        <button 
          onClick={() => handleOpenModal()}
          className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] flex items-center gap-2 hover:-translate-y-1"
        >
          <Plus className="w-5 h-5" /> Add New Alert
        </button>
      </header>

      <div className="bg-slate-900/40 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
        <div className="p-6 border-b border-white/5 flex flex-wrap gap-4 justify-between items-center bg-slate-900/50">
          <div className="relative w-full sm:w-80">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search alerts..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950/50 border border-slate-700 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-sm" 
            />
          </div>
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-950/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-sm min-w-[150px]"
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
                <th className="p-5 pl-8">Alert Name</th>
                <th className="p-5">Status</th>
                <th className="p-5">Date Modified</th>
                <th className="p-5 pr-8 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-slate-500 font-medium">Loading security alerts...</td>
                </tr>
              ) : filteredAlerts.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-slate-500 font-medium">No alerts found.</td>
                </tr>
              ) : (
                filteredAlerts.map(alert => (
                  <tr key={alert.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="p-5 pl-8 font-bold text-white flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                        <ShieldAlert className="w-4 h-4" />
                      </div>
                      {alert.title}
                    </td>
                    <td className="p-5">
                      <span className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                        alert.status === 'ACTIVE' 
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]' 
                          : 'bg-rose-500/10 text-rose-400 border-rose-500/20 shadow-[0_0_10px_rgba(244,63,94,0.1)]'
                      }`}>
                        {alert.status}
                      </span>
                    </td>
                    <td className="p-5 text-slate-400 text-sm font-medium">
                      {new Date(alert.updatedAt).toLocaleDateString()}
                    </td>
                    <td className="p-5 pr-8 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => handleOpenModal(alert)}
                          className="p-2 bg-slate-800 hover:bg-slate-700 text-emerald-400 rounded-lg transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(alert.id)}
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
                <div className="p-2 bg-emerald-500/20 rounded-lg text-emerald-400">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-white">{editingId ? 'Edit Security Alert' : 'New Security Alert'}</h3>
              </div>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white transition-colors bg-slate-800 p-2 rounded-full hover:bg-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-5">
              <div>
                <label className="text-xs font-black uppercase tracking-wider text-slate-400 mb-2 block">Alert Title</label>
                <input 
                  type="text" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-950/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                  placeholder="e.g. Failed Login Attempt"
                />
              </div>

              <div>
                <label className="text-xs font-black uppercase tracking-wider text-slate-400 mb-2 block">Description (Optional)</label>
                <textarea 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-950/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors resize-none h-24"
                  placeholder="Description of the security trigger..."
                />
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
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold transition-all shadow-[0_0_15px_rgba(16,185,129,0.4)]"
              >
                Save Alert
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
