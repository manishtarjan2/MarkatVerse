"use client";
import React, { useState, useEffect } from 'react';
import { Loader2, Plus, Edit2, Trash2, X, BellRing } from 'lucide-react';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

interface PushTemplate {
  id: string;
  title: string;
  message: string;
  status: string;
  createdAt: string;
}

export default function NotificationsPushPage() {
  const [templates, setTemplates] = useState<PushTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<PushTemplate | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('ACTIVE');

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/admin/notifications/push`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setTemplates(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (item?: PushTemplate) => {
    if (item) {
      setEditing(item);
      setTitle(item.title);
      setMessage(item.message);
      setStatus(item.status);
    } else {
      setEditing(null);
      setTitle('');
      setMessage('');
      setStatus('ACTIVE');
    }
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!title.trim() || !message.trim()) return alert("Title and Message are required");
    
    const payload = { title, message, status };
    try {
      if (editing) {
        await fetch(`${API}/admin/notifications/push/${editing.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } else {
        await fetch(`${API}/admin/notifications/push`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }
      setModalOpen(false);
      fetchTemplates();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this push template?')) return;
    try {
      await fetch(`${API}/admin/notifications/push/${id}`, { method: 'DELETE' });
      fetchTemplates();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredTemplates = templates.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(searchTerm.toLowerCase()) || t.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All Status' || t.status === statusFilter.toUpperCase();
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="w-full relative">
      <div className="flex justify-end mb-6">
        <button 
          onClick={() => openModal()}
          className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-[0_0_15px_rgba(59,130,246,0.3)] hover:shadow-[0_0_25px_rgba(59,130,246,0.5)] flex items-center gap-2">
          <Plus className="w-4 h-4" /> New Template
        </button>
      </div>

      <div className="bg-slate-800 rounded-2xl border border-slate-700 shadow-lg overflow-hidden">
        <div className="p-4 border-b border-slate-700 flex justify-between gap-4">
          <input 
            type="text" 
            placeholder="Search templates..." 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 w-64" 
          />
          <select 
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500">
            <option value="All Status">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>
        </div>
        
        {loading ? (
          <div className="p-10 text-slate-400 flex items-center justify-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin" /> Loading push templates...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-900/80 border-b border-slate-700 text-slate-400 text-[10px] uppercase tracking-widest font-black">
                <tr>
                  <th className="p-4 pl-6">Title</th>
                  <th className="p-4">Message Body</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Created Date</th>
                  <th className="p-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {filteredTemplates.length === 0 ? (
                  <tr><td colSpan={5} className="p-6 text-center text-slate-500">No push templates found.</td></tr>
                ) : filteredTemplates.map(t => (
                  <tr key={t.id} className="hover:bg-slate-700/50 transition-all">
                    <td className="p-4 pl-6 font-bold text-white">{t.title}</td>
                    <td className="p-4 text-slate-400 text-sm max-w-xs truncate" title={t.message}>{t.message}</td>
                    <td className="p-4">
                      <span className={`border px-2.5 py-1 rounded-full text-xs font-bold ${
                        t.status === 'ACTIVE' 
                          ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' 
                          : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                      }`}>
                        {t.status}
                      </span>
                    </td>
                    <td className="p-4 text-slate-500 text-sm">{t.createdAt ? t.createdAt.substring(0, 10) : ''}</td>
                    <td className="p-4 pr-6 text-right flex justify-end gap-2">
                      <button onClick={() => openModal(t)} className="text-slate-500 hover:text-blue-400 p-1"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(t.id)} className="text-slate-500 hover:text-rose-400 p-1"><Trash2 className="w-4 h-4" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 rounded-3xl border border-slate-700 shadow-2xl max-w-lg w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <BellRing className="w-5 h-5 text-blue-500" />
                {editing ? 'Edit Push Template' : 'New Push Template'}
              </h2>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-slate-400 text-sm font-bold mb-1">Notification Title</label>
                <input 
                  type="text" 
                  placeholder="e.g. Booking Confirmed!" 
                  value={title} 
                  onChange={e => setTitle(e.target.value)} 
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-white outline-none focus:border-blue-500" 
                />
              </div>

              <div>
                <label className="block text-slate-400 text-sm font-bold mb-1">Message Body</label>
                <textarea 
                  rows={4}
                  placeholder="e.g. Your token #{{tokenNumber}} is confirmed for {{time}}." 
                  value={message} 
                  onChange={e => setMessage(e.target.value)} 
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-white outline-none focus:border-blue-500 resize-none" 
                />
              </div>

              <div>
                <label className="block text-slate-400 text-sm font-bold mb-1">Status</label>
                <select value={status} onChange={e => setStatus(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-white outline-none focus:border-blue-500">
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="INACTIVE">INACTIVE</option>
                </select>
              </div>

              {/* Notification Preview */}
              <div className="mt-6 border border-slate-700 rounded-xl p-4 bg-slate-900/50">
                <p className="text-slate-500 text-xs font-black uppercase tracking-widest mb-3 text-center">Live Preview</p>
                <div className="bg-white rounded-2xl p-4 max-w-[300px] mx-auto shadow-lg flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
                    <BellRing className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h4 className="text-slate-900 font-bold text-sm leading-tight">{title || 'Push Title'}</h4>
                    <p className="text-slate-600 text-xs mt-1 leading-snug">{message || 'This is how your push notification message body will appear to users.'}</p>
                  </div>
                </div>
              </div>

              <div className="pt-6 flex justify-end gap-3">
                <button onClick={() => setModalOpen(false)} className="px-4 py-2 rounded-xl text-slate-400 hover:text-white transition-colors">Cancel</button>
                <button onClick={handleSave} className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-xl font-bold transition-all shadow-lg shadow-blue-500/20">Save Template</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

