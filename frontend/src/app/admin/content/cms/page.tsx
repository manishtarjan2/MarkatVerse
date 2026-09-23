"use client";
import React, { useEffect, useState } from 'react';

export default function ContentCmsPage() {
  const [pages, setPages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ title: '', slug: '', content: '', status: 'PUBLISHED' });

  const fetchPages = async () => {
    try {
      const res = await fetch('http://localhost:3001/content/cms');
      if (res.ok) {
        const data = await res.json();
        setPages(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPages();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this CMS page?')) {
      try {
        await fetch(`http://localhost:3001/content/cms/${id}`, { method: 'DELETE' });
        fetchPages();
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingId 
        ? `http://localhost:3001/content/cms/${editingId}` 
        : 'http://localhost:3001/content/cms';
      const method = editingId ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setShowModal(false);
        setEditingId(null);
        setFormData({ title: '', slug: '', content: '', status: 'PUBLISHED' });
        fetchPages();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleEdit = (page: any) => {
    setFormData({
      title: page.title,
      slug: page.slug,
      content: page.content,
      status: page.status,
    });
    setEditingId(page.id);
    setShowModal(true);
  };

  const handleToggleStatus = async (page: any) => {
    const newStatus = page.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED';
    try {
      await fetch(`http://localhost:3001/content/cms/${page.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      fetchPages();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in duration-300 w-full relative">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Content &gt; CMS</h1>
          <p className="text-slate-400 mt-2 text-sm">Manage and configure CMS pages.</p>
        </div>
        <button
          onClick={() => {
            setEditingId(null);
            setFormData({ title: '', slug: '', content: '', status: 'PUBLISHED' });
            setShowModal(true);
          }}
          className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_25px_rgba(16,185,129,0.5)] flex items-center gap-2">
          + Add New Page
        </button>
      </header>

      <div className="bg-slate-800 rounded-2xl border border-slate-700 shadow-lg overflow-hidden">
        <div className="p-4 border-b border-slate-700 flex justify-between">
          <input type="text" placeholder="Search pages..." className="bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500 w-64" />
          <select className="bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500">
            <option>All Status</option>
            <option>Published</option>
            <option>Draft</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-8 text-center text-slate-400">Loading CMS pages...</div>
          ) : pages.length === 0 ? (
            <div className="p-8 text-center text-slate-400">No CMS pages found.</div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-900/80 border-b border-slate-700 text-slate-400 text-[10px] uppercase tracking-widest font-black">
                <tr>
                  <th className="p-4 pl-6">ID</th>
                  <th className="p-4">Title / Slug</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Date Modified</th>
                  <th className="p-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {pages.map((page) => (
                  <tr key={page.id} className="hover:bg-slate-700/50 transition-all">
                    <td className="p-4 pl-6 font-mono text-xs text-slate-500">{page.id.substring(0, 8)}...</td>
                    <td className="p-4">
                      <div className="font-bold text-white">{page.title}</div>
                      <div className="text-xs text-slate-400">/{page.slug}</div>
                    </td>
                    <td className="p-4">
                      {page.status === 'PUBLISHED' ? (
                        <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-full text-xs font-bold">Published</span>
                      ) : (
                        <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2.5 py-1 rounded-full text-xs font-bold">Draft</span>
                      )}
                    </td>
                    <td className="p-4 text-slate-400 text-sm">{new Date(page.updatedAt).toLocaleDateString()}</td>
                    <td className="p-4 pr-6 text-right space-x-2">
                      <button className="text-slate-500 hover:text-white px-2 transition-colors" onClick={() => handleToggleStatus(page)}>Toggle</button>
                      <button className="text-slate-500 hover:text-indigo-400 px-2 transition-colors" onClick={() => handleEdit(page)}>Edit</button>
                      <button className="text-slate-500 hover:text-rose-400 px-2 transition-colors" onClick={() => handleDelete(page.id)}>Delete</button>
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
            <h2 className="text-2xl font-bold text-white mb-4">{editingId ? 'Edit CMS Page' : 'Add CMS Page'}</h2>
            <form onSubmit={handleSave} className="flex flex-col gap-4">
              <input type="text" placeholder="Page Title" required value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className="bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500" />
              <input type="text" placeholder="URL Slug (e.g. about-us)" required value={formData.slug} onChange={e => setFormData({ ...formData, slug: e.target.value })} className="bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500" />
              <textarea placeholder="Page HTML Content..." required rows={5} value={formData.content} onChange={e => setFormData({ ...formData, content: e.target.value })} className="bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500"></textarea>
              <select value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })} className="bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500">
                <option value="DRAFT">Draft</option>
                <option value="PUBLISHED">Published</option>
              </select>
              <div className="flex justify-end gap-3 mt-4">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-slate-400 hover:text-white">Cancel</button>
                <button type="submit" className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2 rounded-lg font-bold">{editingId ? 'Update Page' : 'Save Page'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
