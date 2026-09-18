"use client";

import React, { useState } from 'react';
import { useProducts, Category } from '@/context/ProductContext';
import { useAdminRole } from '@/context/AdminRoleContext';
import { ShieldAlert, Search, Trash2, Edit2, Plus, ListTree, Check, X, RefreshCw } from 'lucide-react';

export default function AdminCategoriesPage() {
  const { categories, addCategory, updateCategory, deleteCategory } = useProducts();
  const { canEdit } = useAdminRole();
  const hasEditPermission = canEdit('categories');
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  const [searchTerm, setSearchTerm] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form state
  const [draft, setDraft] = useState<Partial<Category>>({
    name: '',
    theme: 'slate',
    icon: '',
    primaryType: 'PRODUCT',
    defaultCommissionRate: 5.0,
    defaultFlatRate: 999.0,
    allowedListingTypes: [],
    businessModels: [],
    workflow: '',
    allowedFeatures: []
  });

  const filteredCategories = categories.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleStartAdd = () => {
    if (!hasEditPermission) return;
    setDraft({ name: '', theme: 'slate', icon: '', primaryType: 'PRODUCT', defaultCommissionRate: 5.0, defaultFlatRate: 999.0 });
    setIsAdding(true);
    setEditingId(null);
  };

  const handleStartEdit = (cat: Category) => {
    if (!hasEditPermission) return;
    setDraft({ ...cat });
    setEditingId(cat.id);
    setIsAdding(false);
  };

  const handleSave = () => {
    if (!hasEditPermission) return;
    if (!draft.name) return alert('Name is required');

    if (isAdding) {
      addCategory({ ...draft, id: Date.now().toString() } as Category);
      setIsAdding(false);
    } else if (editingId) {
      updateCategory(editingId, draft);
      setEditingId(null);
    }
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
  };

  const handleDelete = (id: string) => {
    if (!hasEditPermission) return;
    if (window.confirm("Are you sure you want to delete this category?")) {
      deleteCategory(id);
    }
  };

  const handleSyncBilling = async (id: string) => {
    if (!hasEditPermission) return;
    if (id.length < 20) {
      alert("This is a placeholder category. Please Edit and Save it first to register it in the live database before syncing.");
      return;
    }
    if (!window.confirm("This will overwrite the billing rates of all businesses selling in this category. Are you sure?")) return;
    try {
      const res = await fetch(`${API_URL}/categories/${id}/apply-billing-defaults`, {
        method: 'POST'
      });
      if (!res.ok) throw new Error('Failed to sync billing defaults');
      const data = await res.json();
      alert(`Successfully updated billing rates for ${data.updatedCount} businesses.`);
    } catch (err) {
      console.error(err);
      alert('Error syncing billing defaults');
    }
  };

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in duration-300 w-full">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Categories</h1>
          <p className="text-slate-400 mt-2 text-sm">Organize products and services across the platform.</p>
        </div>
        {hasEditPermission && (
          <button 
            onClick={handleStartAdd}
            disabled={isAdding || !!editingId}
            className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_25px_rgba(16,185,129,0.5)] flex items-center gap-2 disabled:opacity-50"
          >
            <Plus className="w-5 h-5" />
            Add Category
          </button>
        )}
      </header>

      {!hasEditPermission && (
        <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-xl flex items-center gap-3 mb-8">
          <ShieldAlert className="w-5 h-5" />
          <p className="text-sm font-medium">You do not have permission to manage categories. Contact a Catalog Admin.</p>
        </div>
      )}

      {(isAdding || editingId) && hasEditPermission && (
        <div className="bg-slate-800 p-6 rounded-2xl border border-indigo-500/50 shadow-lg mb-8">
          <h3 className="text-lg font-bold text-white mb-4">{isAdding ? 'Create New Category' : 'Edit Category'}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase">Name</label>
              <input 
                type="text" 
                value={draft.name || ''}
                onChange={e => setDraft(d => ({ ...d, name: e.target.value }))}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500" 
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase">Primary Type</label>
              <select 
                value={draft.primaryType || 'PRODUCT'}
                onChange={e => setDraft(d => ({ ...d, primaryType: e.target.value as any }))}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="PRODUCT">Product</option>
                <option value="SERVICE">Service</option>
                <option value="VEHICLE">Vehicle</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase">Theme</label>
              <select 
                value={draft.theme || 'slate'}
                onChange={e => setDraft(d => ({ ...d, theme: e.target.value }))}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="slate">Slate</option>
                <option value="indigo">Indigo</option>
                <option value="emerald">Emerald</option>
                <option value="rose">Rose</option>
                <option value="amber">Amber</option>
                <option value="cyan">Cyan</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase">Default Commission (%)</label>
              <input 
                type="number" 
                min="0" max="100" step="0.1"
                value={draft.defaultCommissionRate ?? 5.0}
                onChange={e => setDraft(d => ({ ...d, defaultCommissionRate: parseFloat(e.target.value) || 0 }))}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500" 
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase">Default Flat Rate (₹)</label>
              <input 
                type="number" 
                min="0"
                value={draft.defaultFlatRate ?? 999.0}
                onChange={e => setDraft(d => ({ ...d, defaultFlatRate: parseFloat(e.target.value) || 0 }))}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500" 
              />
            </div>
            
            {/* Relationship Manager Fields */}
            <div className="col-span-1 sm:col-span-2 lg:col-span-4 border-t border-slate-700 pt-4 mt-2">
              <h4 className="text-sm font-bold text-slate-300 mb-3">Relationship Rules</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase">Business Models (comma separated)</label>
                  <input 
                    type="text" 
                    placeholder="e.g. B2C, B2B, Appointment"
                    value={draft.businessModels?.join(', ') || ''}
                    onChange={e => setDraft(d => ({ ...d, businessModels: e.target.value.split(',').map(s=>s.trim()).filter(Boolean) as any }))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase">Workflow</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Standard Delivery, Booking"
                    value={draft.workflow || ''}
                    onChange={e => setDraft(d => ({ ...d, workflow: e.target.value }))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase">Allowed Features (comma separated)</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Service, Token"
                    value={draft.allowedFeatures?.join(', ') || ''}
                    onChange={e => setDraft(d => ({ ...d, allowedFeatures: e.target.value.split(',').map(s=>s.trim()).filter(Boolean) as any }))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase">Listing Types (comma separated)</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Product, Service"
                    value={draft.allowedListingTypes?.join(', ') || ''}
                    onChange={e => setDraft(d => ({ ...d, allowedListingTypes: e.target.value.split(',').map(s=>s.trim()).filter(Boolean) as any }))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500" 
                  />
                </div>
              </div>
            </div>

            <div className="flex items-end gap-2 col-span-1 sm:col-span-2 lg:col-span-4 mt-4">
              <button onClick={handleSave} className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 rounded-lg transition-colors flex items-center justify-center gap-2">
                <Check className="w-4 h-4" /> Save
              </button>
              <button onClick={handleCancel} className="bg-slate-700 hover:bg-slate-600 text-white font-bold px-3 py-2 rounded-lg transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-slate-800 rounded-2xl border border-slate-700 shadow-lg overflow-hidden">
        <div className="p-4 border-b border-slate-700 bg-slate-900/50 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search categories..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 w-full text-sm transition-colors" 
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-900 border-b border-slate-700 text-slate-400 text-[10px] uppercase tracking-widest font-black">
              <tr>
                <th className="p-4 pl-6">Category</th>
                <th className="p-4">Type</th>
                <th className="p-4">Theme</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {filteredCategories.map((cat) => (
                <tr key={cat.id} className="hover:bg-slate-700/30 transition-all group">
                  <td className="p-4 pl-6">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl bg-${cat.theme}-500/20 flex items-center justify-center border border-${cat.theme}-500/30 text-${cat.theme}-400`}>
                        <ListTree className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-bold text-white text-sm">{cat.name}</div>
                        <div className="text-xs text-slate-500 mt-0.5 font-mono">ID: {cat.id.slice(0,8)}...</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="bg-slate-900 text-slate-300 font-bold px-2 py-1 rounded border border-slate-700 text-xs">
                      {cat.primaryType || 'PRODUCT'}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full bg-${cat.theme}-500`}></div>
                      <span className="text-xs font-semibold text-slate-400 capitalize">{cat.theme}</span>
                    </div>
                  </td>
                  <td className="p-4 pr-6 text-right">
                    {hasEditPermission && (
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => handleSyncBilling(cat.id)}
                          title="Apply Billing Defaults to Sellers"
                          className="p-1.5 text-slate-400 hover:text-amber-400 hover:bg-amber-500/10 rounded-lg transition-colors"
                        >
                          <RefreshCw className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleStartEdit(cat)}
                          className="p-1.5 text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(cat.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {filteredCategories.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-slate-500">
                    No categories found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
