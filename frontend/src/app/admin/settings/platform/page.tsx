"use client";

import React, { useState } from 'react';
import { useSettings } from '@/context/SettingsContext';
import { useAdminRole } from '@/context/AdminRoleContext';
import { useProducts } from '@/context/ProductContext';
import { ShieldAlert, Info, Edit2, X, Check } from 'lucide-react';

export default function SettingsPlatformPage() {
  const { sectors, toggleSector, editSector, systemConfig, updateSystemConfig } = useSettings();
  const { allProducts } = useProducts();
  const { canToggleSector } = useAdminRole();
  const hasTogglePermission = canToggleSector();

  const [isDummyActive, setIsDummyActive] = useState<boolean>(false);
  const [editingSectorId, setEditingSectorId] = useState<string | null>(null);

  React.useEffect(() => {
    const fetchDummyStatus = async () => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
        const res = await fetch(`${API_URL}/products/dummy-status`);
        if (res.ok) {
          const data = await res.json();
          setIsDummyActive(data.enabled);
        }
      } catch (e) {
        console.error("Failed to fetch dummy status", e);
      }
    };
    fetchDummyStatus();
  }, []);
  const [editName, setEditName] = useState('');
  const [editDesc, setEditDesc] = useState('');

  const handleEditClick = (sector: any) => {
    if (!hasTogglePermission) return;
    setEditingSectorId(sector.id);
    setEditName(sector.name);
    setEditDesc(sector.description || '');
  };

  const handleCancelEdit = () => {
    setEditingSectorId(null);
  };

  const handleSaveEdit = async (id: string) => {
    if (!hasTogglePermission) return;
    try {
      await editSector(id, { name: editName, description: editDesc });
      setEditingSectorId(null);
    } catch (e) {
      alert("Failed to update sector");
    }
  };

  const toggleDummyData = async () => {
    if (!hasTogglePermission) return;
    const enable = !isDummyActive;
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    await fetch(`${API_URL}/products/toggle-dummy`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ enable })
    });
    window.location.reload();
  };

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in duration-300 w-full">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Platform Sectors</h1>
          <p className="text-slate-400 mt-2 text-sm">Manage global settings, turn major platform features on and off, and configure sectors.</p>
        </div>
      </header>

      {!hasTogglePermission && (
        <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-xl flex items-center gap-3 mb-8">
          <ShieldAlert className="w-5 h-5" />
          <p className="text-sm font-medium">You do not have permission to toggle or edit platform sectors. Contact a Super Admin.</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Dummy Data Toggle */}
        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-sm flex flex-col justify-between h-full relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl transform translate-x-8 -translate-y-8" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white capitalize">Dummy Test Data</h3>
              <button
                onClick={toggleDummyData}
                disabled={!hasTogglePermission}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed ${isDummyActive ? 'bg-amber-500' : 'bg-slate-600'}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isDummyActive ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>
            <p className="text-sm text-slate-400 line-clamp-3">
              Enable or disable the dummy sellers, products, and services across the entire platform.
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-slate-700/50 flex justify-between items-center relative z-10">
            <span className={`text-xs font-bold px-2 py-1 rounded ${isDummyActive ? 'bg-amber-500/10 text-amber-400' : 'bg-slate-500/10 text-slate-400'}`}>
              {isDummyActive ? 'Active' : 'Suspended'}
            </span>
            <span className="text-xs text-slate-500">Global Sandbox</span>
          </div>
        </div>
        
        {/* Global Search Radius */}
        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-sm flex flex-col justify-between h-full relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white capitalize">Nearby Search Radius</h3>
            </div>
            <p className="text-sm text-slate-400 mb-4">
              Set the maximum distance (km) to show services/products. Out of range items are pushed to the bottom.
            </p>
            <div className="flex gap-2">
              <input
                type="number"
                value={systemConfig?.searchRadius || 50}
                onChange={(e) => updateSystemConfig({ ...systemConfig, searchRadius: parseInt(e.target.value) || 50 })}
                disabled={!hasTogglePermission}
                className="w-24 bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-white font-bold focus:outline-none focus:border-indigo-500"
              />
              <span className="text-slate-400 flex items-center">km</span>
            </div>
            <label className="flex items-center gap-2 mt-4 text-sm text-slate-300">
              <input 
                type="checkbox" 
                checked={systemConfig?.strictRadius || false} 
                onChange={(e) => updateSystemConfig({ ...systemConfig, strictRadius: e.target.checked })}
                disabled={!hasTogglePermission}
                className="rounded border-slate-600 bg-slate-700 text-indigo-500 focus:ring-indigo-500"
              />
              Strict limit (hide items outside radius)
            </label>
          </div>
        </div>

        {/* Dynamic Sectors */}
        {sectors.map(sector => (
          <div key={sector.id} className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-sm flex flex-col justify-between h-full transition-all hover:-translate-y-1">
            {editingSectorId === sector.id ? (
              <div className="flex flex-col h-full">
                <div className="mb-4 space-y-3">
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full bg-slate-900 border border-indigo-500 rounded-lg px-3 py-2 text-white font-bold focus:outline-none text-xl"
                    placeholder="Sector Name"
                  />
                  <textarea
                    value={editDesc}
                    onChange={(e) => setEditDesc(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-300 text-sm focus:outline-none focus:border-indigo-500 h-24 resize-none"
                    placeholder="Sector Description"
                  />
                </div>
                <div className="mt-auto pt-4 border-t border-slate-700/50 flex justify-end gap-2">
                  <button onClick={handleCancelEdit} className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                  <button onClick={() => handleSaveEdit(sector.id)} className="p-2 text-emerald-400 hover:text-white hover:bg-emerald-600 rounded-lg transition-colors">
                    <Check className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-white capitalize">{sector.name}</h3>
                    <div className="flex items-center gap-3">
                      {hasTogglePermission && (
                        <button onClick={() => handleEditClick(sector)} className="text-slate-500 hover:text-indigo-400 transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => hasTogglePermission && toggleSector(sector.id, !sector.isActive)}
                        disabled={!hasTogglePermission}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed ${sector.isActive ? 'bg-emerald-500' : 'bg-slate-600'}`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${sector.isActive ? 'translate-x-6' : 'translate-x-1'}`} />
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-slate-400 line-clamp-3">
                    {sector.description || `Manage the settings and availability for the ${sector.name} sector of the platform.`}
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-700/50 flex justify-between items-center">
                  <span className={`text-xs font-bold px-2 py-1 rounded ${sector.isActive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                    {sector.isActive ? 'Live' : 'Maintenance'}
                  </span>
                  <span className="text-xs text-slate-500">ID: {sector.id.slice(-6)}</span>
                </div>
              </>
            )}
          </div>
        ))}

        {sectors.length === 0 && (
          <div className="col-span-full text-center py-12 bg-slate-800/50 rounded-2xl border border-slate-700 flex flex-col items-center justify-center">
            <Info className="w-12 h-12 text-slate-500 mb-4" />
            <p className="text-slate-400 font-medium text-lg">No platform sectors found.</p>
            <p className="text-slate-500 text-sm mt-1">Make sure the backend is configured.</p>
          </div>
        )}
      </div>
    </div>
  );
}
