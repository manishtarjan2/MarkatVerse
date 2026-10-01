"use client";
import React, { useState, useEffect } from 'react';

interface SmsTemplate {
  id: string;
  title: string;
  message: string;
  status: string;
  createdAt: string;
}

export default function NotificationsSmsPage() {
  const [templates, setTemplates] = useState<SmsTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({ title: '', message: '', status: 'ACTIVE' });
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/admin/notifications/sms');
      const data = await res.json();
      if (Array.isArray(data)) {
        setTemplates(data);
      } else {
        console.error('Expected array of templates, got:', data);
        setTemplates([]);
      }
    } catch (err) {
      console.error('Failed to fetch SMS templates', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/notifications/sms/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
      } else {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/notifications/sms`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
      }
      setShowModal(false);
      fetchTemplates();
    } catch (err) {
      console.error('Failed to save template', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this template?')) return;
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/notifications/sms/${id}`, {
        method: 'DELETE'
      });
      fetchTemplates();
    } catch (err) {
      console.error('Failed to delete template', err);
    }
  };

  const openAddModal = () => {
    setFormData({ title: '', message: '', status: 'ACTIVE' });
    setEditingId(null);
    setShowModal(true);
  };

  const openEditModal = (template: SmsTemplate) => {
    setFormData({ title: template.title, message: template.message, status: template.status });
    setEditingId(template.id);
    setShowModal(true);
  };

  const filteredTemplates = templates.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(searchTerm.toLowerCase()) || t.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All Status' || t.status === statusFilter.toUpperCase();
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in duration-300 w-full relative">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Notifications &gt; SMS</h1>
          <p className="text-slate-400 mt-2 text-sm">Manage and configure SMS templates.</p>
        </div>
        <button onClick={openAddModal} className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_25px_rgba(16,185,129,0.5)] flex items-center gap-2">
          + Add New
        </button>
      </header>

      <div className="bg-slate-800 rounded-2xl border border-slate-700 shadow-lg overflow-hidden">
        <div className="p-4 border-b border-slate-700 flex justify-between">
          <input 
            type="text" 
            placeholder="Search..." 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500 w-64" 
          />
          <select 
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
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
                <th className="p-4 pl-6">Title</th>
                <th className="p-4">Message Preview</th>
                <th className="p-4">Status</th>
                <th className="p-4">Date Modified</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {loading ? (
                <tr><td colSpan={5} className="p-8 text-center text-slate-400">Loading...</td></tr>
              ) : filteredTemplates.length === 0 ? (
                <tr><td colSpan={5} className="p-8 text-center text-slate-400">No templates found.</td></tr>
              ) : filteredTemplates.map(template => (
                <tr key={template.id} className="hover:bg-slate-700/50 transition-all">
                  <td className="p-4 pl-6 font-bold text-white">{template.title}</td>
                  <td className="p-4 text-slate-300 text-sm truncate max-w-xs">{template.message}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${template.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'}`}>
                      {template.status}
                    </span>
                  </td>
                  <td className="p-4 text-slate-400 text-sm">{new Date(template.createdAt).toLocaleDateString()}</td>
                  <td className="p-4 pr-6 text-right">
                    <button onClick={() => openEditModal(template)} className="text-slate-500 hover:text-blue-400 px-2 font-medium">Edit</button>
                    <button onClick={() => handleDelete(template.id)} className="text-slate-500 hover:text-rose-400 px-2 font-medium">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-lg shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <h2 className="text-xl font-bold text-white mb-6">{editingId ? 'Edit SMS Template' : 'Add SMS Template'}</h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2">Template Title</label>
                <input 
                  type="text" 
                  required
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500"
                  placeholder="e.g. Order Shipped Notification"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2">Message Body</label>
                <textarea 
                  required
                  rows={4}
                  value={formData.message}
                  onChange={e => setFormData({...formData, message: e.target.value})}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 resize-none"
                  placeholder="Hello {name}, your order {order_id} has shipped!"
                ></textarea>
                <p className="text-xs text-slate-500 mt-2">Use placeholders like {'{name}'}, {'{order_id}'} to personalize.</p>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2">Status</label>
                <select 
                  value={formData.status}
                  onChange={e => setFormData({...formData, status: e.target.value})}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-700/50 mt-6">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 rounded-xl font-bold text-slate-300 hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2.5 rounded-xl font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition-colors shadow-lg shadow-indigo-500/25"
                >
                  {editingId ? 'Save Changes' : 'Create Template'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

