"use client";

import React, { useState } from 'react';
import { useProducts, Category } from '@/context/ProductContext';
import { useAdminRole } from '@/context/AdminRoleContext';
import { ShieldAlert, Search, Trash2, Edit2, Plus, ListTree, Check, X, RefreshCw, Smartphone, Hammer, Tractor, Scissors, HeartPulse, Home, Shirt, Car, Pizza, Wrench, Box } from 'lucide-react';

export default function AdminCategoriesPage() {
  const { categories, addCategory, updateCategory, deleteCategory } = useProducts();
  const { canEdit } = useAdminRole();
  const hasEditPermission = canEdit('categories');
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  const getCategoryIcon = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes('electronic') || n.includes('tech') || n.includes('gadget')) return <Smartphone className="w-5 h-5" />;
    if (n.includes('construct') || n.includes('build')) return <Hammer className="w-5 h-5" />;
    if (n.includes('agricultur') || n.includes('farm')) return <Tractor className="w-5 h-5" />;
    if (n.includes('beaut') || n.includes('salon') || n.includes('cosmetic')) return <Scissors className="w-5 h-5" />;
    if (n.includes('health') || n.includes('medic')) return <HeartPulse className="w-5 h-5" />;
    if (n.includes('home') || n.includes('furniture')) return <Home className="w-5 h-5" />;
    if (n.includes('fashion') || n.includes('cloth')) return <Shirt className="w-5 h-5" />;
    if (n.includes('vehicle') || n.includes('car')) return <Car className="w-5 h-5" />;
    if (n.includes('food') || n.includes('grocery')) return <Pizza className="w-5 h-5" />;
    if (n.includes('service')) return <Wrench className="w-5 h-5" />;
    return <Box className="w-5 h-5" />;
  };

  const cleanTheme = (themeStr: string | undefined | null) => {
    if (!themeStr) return 'slate';
    const t = themeStr.toLowerCase();
    if (t.includes('blue') || t.includes('indigo')) return 'indigo';
    if (t.includes('green') || t.includes('emerald') || t.includes('lime')) return 'emerald';
    if (t.includes('red') || t.includes('rose') || t.includes('pink')) return 'rose';
    if (t.includes('yellow') || t.includes('amber') || t.includes('gold')) return 'amber';
    if (t.includes('cyan') || t.includes('teal')) return 'cyan';
    return 'slate';
  };

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
    allowedFeatures: [],
    parameters: [],
    subcategories: []
  });
  
  // Local state for JSON editor strings
  const [parametersJson, setParametersJson] = useState('[]');
  const [subcategoriesJson, setSubcategoriesJson] = useState('[]');

  const filteredCategories = categories.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleStartAdd = () => {
    if (!hasEditPermission) return;
    setDraft({ name: '', theme: 'slate', icon: '', primaryType: 'PRODUCT', defaultCommissionRate: 5.0, defaultFlatRate: 999.0, parameters: [], subcategories: [] });
    setParametersJson('[]');
    setSubcategoriesJson('[]');
    setIsAdding(true);
    setEditingId(null);
  };

  const handleStartEdit = (cat: Category) => {
    if (!hasEditPermission) return;
    setDraft({ ...cat });
    setParametersJson(JSON.stringify(cat.parameters || [], null, 2));
    setSubcategoriesJson(JSON.stringify(cat.subcategories || [], null, 2));
    setEditingId(cat.id);
    setIsAdding(false);
  };

  const handleSave = () => {
    if (!hasEditPermission) return;
    if (!draft.name) return alert('Name is required');

    let parsedParameters = [];
    let parsedSubcategories = [];
    try {
      parsedParameters = JSON.parse(parametersJson);
      parsedSubcategories = JSON.parse(subcategoriesJson);
    } catch (e) {
      return alert('Invalid JSON in Parameters or Subcategories. Please fix the formatting.');
    }

    const payloadToSave = {
      ...draft,
      parameters: parsedParameters,
      subcategories: parsedSubcategories
    };

    if (isAdding) {
      addCategory({ ...payloadToSave, id: Date.now().toString() } as Category);
      setIsAdding(false);
    } else if (editingId) {
      updateCategory(editingId, payloadToSave);
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

            {/* Advanced JSON Fields */}
            <div className="col-span-1 sm:col-span-2 lg:col-span-4 border-t border-slate-700 pt-4 mt-2">
              <h4 className="text-sm font-bold text-slate-300 mb-3">Dynamic Configuration (Advanced)</h4>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase flex justify-between">
                    <span>Parameters (JSON)</span>
                    <button type="button" onClick={() => {
                      try { setParametersJson(JSON.stringify(JSON.parse(parametersJson), null, 2)); } catch(e) { alert("Invalid JSON"); }
                    }} className="text-indigo-400 hover:text-indigo-300 normal-case">Format JSON</button>
                  </label>
                  <textarea
                    rows={8}
                    value={parametersJson}
                    onChange={e => setParametersJson(e.target.value)}
                    placeholder='[\n  {\n    "name": "Size",\n    "type": "radio",\n    "options": ["S", "M", "L"]\n  }\n]'
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-300 font-mono text-xs focus:outline-none focus:border-indigo-500"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">Defines the root-level dynamic form fields for this category.</p>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase flex justify-between">
                    <span>Subcategories (JSON)</span>
                    <button type="button" onClick={() => {
                      try { setSubcategoriesJson(JSON.stringify(JSON.parse(subcategoriesJson), null, 2)); } catch(e) { alert("Invalid JSON"); }
                    }} className="text-indigo-400 hover:text-indigo-300 normal-case">Format JSON</button>
                  </label>
                  <textarea
                    rows={8}
                    value={subcategoriesJson}
                    onChange={e => setSubcategoriesJson(e.target.value)}
                    placeholder='[\n  {\n    "name": "Smartphones",\n    "parameters": []\n  }\n]'
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-300 font-mono text-xs focus:outline-none focus:border-indigo-500"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">Defines the subcategory hierarchy and their specific parameters.</p>
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
                      <div className={`w-10 h-10 rounded-xl bg-${cleanTheme(cat.theme)}-500/20 flex items-center justify-center border border-${cleanTheme(cat.theme)}-500/30 text-${cleanTheme(cat.theme)}-400 text-xl shadow-inner shadow-${cleanTheme(cat.theme)}-500/10`}>
                        {getCategoryIcon(cat.name)}
                      </div>
                      <div>
                        <div className="font-bold text-white text-sm">{cat.name}</div>
                        <div className="text-xs text-slate-500 mt-0.5 font-mono">
                          #{cat.id.length > 20 ? `CAT-${cat.id.slice(-6).toUpperCase()}` : cat.id.toUpperCase()}
                        </div>
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
                      <div className={`w-3 h-3 rounded-full bg-${cleanTheme(cat.theme)}-500 shadow-[0_0_8px_currentColor] text-${cleanTheme(cat.theme)}-500`}></div>
                      <span className="text-xs font-semibold text-slate-400 capitalize">{cleanTheme(cat.theme)}</span>
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
