"use client";
import React, { useEffect, useState } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export default function ContentSeoPage() {
  const [seoData, setSeoData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ pageUrl: '', title: '', description: '', keywords: '', status: 'ACTIVE' });

  const fetchSeoData = async () => {
    try {
      const res = await fetch(`${API_URL}/content/seo`);
      if (res.ok) {
        const data = await res.json();
        setSeoData(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSeoData();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this SEO entry?')) {
      try {
        await fetch(`${API_URL}/content/seo/${id}`, { method: 'DELETE' });
        fetchSeoData();
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingId 
        ? `${API_URL}/content/seo/${editingId}` 
        : `${API_URL}/content/seo`;
      const method = editingId ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setShowModal(false);
        setEditingId(null);
        setFormData({ pageUrl: '', title: '', description: '', keywords: '', status: 'ACTIVE' });
        fetchSeoData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleEdit = (seo: any) => {
    setFormData({
      pageUrl: seo.pageUrl,
      title: seo.title,
      description: seo.description,
      keywords: seo.keywords || '',
      status: seo.status,
    });
    setEditingId(seo.id);
    setShowModal(true);
  };

  const handleToggleStatus = async (seo: any) => {
    const newStatus = seo.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    try {
      await fetch(`${API_URL}/content/seo/${seo.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      fetchSeoData();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in duration-300 w-full relative">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Content &gt; SEO</h1>
          <p className="text-slate-400 mt-2 text-sm">Manage and configure SEO metadata per page URL.</p>
        </div>
        <button 
          onClick={() => {
            setEditingId(null);
            setFormData({ pageUrl: '', title: '', description: '', keywords: '', status: 'ACTIVE' });
            setShowModal(true);
          }}
          className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_25px_rgba(16,185,129,0.5)] flex items-center gap-2">
          + Add New SEO Entry
        </button>
      </header>

      <div className="bg-slate-800 rounded-2xl border border-slate-700 shadow-lg overflow-hidden">
        <div className="p-4 border-b border-slate-700 flex justify-between">
          <input type="text" placeholder="Search URLs..." className="bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500 w-64" />
          <select className="bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500">
            <option>All Status</option>
            <option>Active</option>
            <option>Inactive</option>
          </select>
        </div>
        
        <div className="overflow-x-auto">
          {loading ? (
             <div className="p-8 text-center text-slate-400">Loading SEO metadata...</div>
          ) : seoData.length === 0 ? (
             <div className="p-8 text-center text-slate-400">No SEO data found.</div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-900/80 border-b border-slate-700 text-slate-400 text-[10px] uppercase tracking-widest font-black">
                <tr>
                  <th className="p-4 pl-6">ID</th>
                  <th className="p-4">Page URL</th>
                  <th className="p-4">Meta Title</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {seoData.map((seo) => (
                  <tr key={seo.id} className="hover:bg-slate-700/50 transition-all">
                    <td className="p-4 pl-6 font-mono text-xs text-slate-500">{seo.id.substring(0,8)}...</td>
                    <td className="p-4 font-bold text-white">{seo.pageUrl}</td>
                    <td className="p-4 text-slate-300">{seo.title}</td>
                    <td className="p-4">
                      {seo.status === 'ACTIVE' ? (
                        <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-full text-xs font-bold">Active</span>
                      ) : (
                        <span className="bg-rose-500/10 text-rose-400 border border-rose-500/20 px-2.5 py-1 rounded-full text-xs font-bold">Inactive</span>
                      )}
                    </td>
                    <td className="p-4 pr-6 text-right space-x-2">
                      <button onClick={() => handleToggleStatus(seo)} className="text-slate-500 hover:text-white px-2 transition-colors">Toggle</button>
                      <button onClick={() => handleEdit(seo)} className="text-slate-500 hover:text-indigo-400 px-2 transition-colors">Edit</button>
                      <button onClick={() => handleDelete(seo.id)} className="text-slate-500 hover:text-rose-400 px-2 transition-colors">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6 w-[500px] shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-4">{editingId ? 'Edit SEO Metadata' : 'Add SEO Metadata'}</h2>
            <form onSubmit={handleSave} className="flex flex-col gap-4">
              <input type="text" placeholder="Page URL (e.g. /home or /about)" required value={formData.pageUrl} onChange={e => setFormData({...formData, pageUrl: e.target.value})} className="bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500" />
              <input type="text" placeholder="Meta Title" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500" />
              <textarea placeholder="Meta Description..." required rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500"></textarea>
              <input type="text" placeholder="Keywords (comma separated)" value={formData.keywords} onChange={e => setFormData({...formData, keywords: e.target.value})} className="bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500" />
              <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500">
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>
              <div className="flex justify-end gap-3 mt-4">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-slate-400 hover:text-white">Cancel</button>
                <button type="submit" className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2 rounded-lg font-bold">{editingId ? 'Update SEO' : 'Save SEO'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
