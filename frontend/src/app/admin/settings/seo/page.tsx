"use client";
import React, { useState, useEffect } from 'react';
import { Save, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SettingsSeoPage() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/system-config/seo`)
      .then(res => res.json())
      .then(data => {
        setTitle(data.title || '');
        setDescription(data.description || '');
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        toast.error('Failed to load SEO settings');
        setLoading(false);
      });
  }, [API_URL]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`${API_URL}/system-config/seo`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description }),
      });
      if (res.ok) {
        toast.success('SEO settings saved successfully');
      } else {
        toast.error('Failed to save SEO settings');
      }
    } catch (err) {
      console.error(err);
      toast.error('Error saving SEO settings');
    }
    setSaving(false);
  };

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in duration-300 w-full">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">SEO Settings</h1>
          <p className="text-slate-400 mt-2 text-sm">Manage global search engine optimization tags for your platform.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving || loading}
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-[0_0_15px_rgba(79,70,229,0.3)] hover:shadow-[0_0_25px_rgba(79,70,229,0.5)] flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          Save Changes
        </button>
      </header>

      <div className="bg-slate-800 rounded-2xl border border-slate-700 shadow-lg p-6 space-y-6">
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
          </div>
        ) : (
          <>
            <div>
              <label className="block text-sm font-bold text-slate-300 mb-2">Global Site Title</label>
              <input 
                type="text" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. MARKATVERSE - Everything. Everyone. Everywhere."
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
              />
              <p className="text-xs text-slate-500 mt-2">This is the default title that appears in browser tabs and search engine results.</p>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-300 mb-2">Global Meta Description</label>
              <textarea 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                placeholder="e.g. The global marketplace connecting people, businesses and opportunities."
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors resize-y"
              />
              <p className="text-xs text-slate-500 mt-2">A brief description of your platform. Recommended length is 150-160 characters.</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
