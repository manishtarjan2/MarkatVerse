"use client";

import React, { useState } from 'react';
import { useAdminRole } from '@/context/AdminRoleContext';
import { ShieldAlert, Map, Hexagon, Crosshair, Save, Check } from 'lucide-react';

export default function AdminLocationsPage() {
  const { canToggleSector } = useAdminRole();
  const hasSettingsPermission = canToggleSector(); // Super Admin only for core platform settings

  const [hexagonalRouting, setHexagonalRouting] = useState(true);
  const [defaultRadius, setDefaultRadius] = useState(50);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    if (!hasSettingsPermission) return;
    setIsSaving(true);
    // Simulate API call to save platform settings
    setTimeout(() => {
      setIsSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }, 800);
  };

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in duration-300 w-full">
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Hyperlocal Locations</h1>
          <p className="text-slate-400 mt-2 text-sm">Configure routing, distance search parameters, and hexagonal indexing.</p>
        </div>
        {hasSettingsPermission && (
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className={`px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg flex items-center gap-2 ${saved ? 'bg-emerald-600 text-white shadow-emerald-900/30' : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-900/30'} disabled:opacity-50`}
          >
            {saved ? <Check className="w-5 h-5" /> : <Save className="w-5 h-5" />}
            {saved ? 'Saved!' : isSaving ? 'Saving...' : 'Save Configuration'}
          </button>
        )}
      </header>

      {!hasSettingsPermission && (
        <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-xl flex items-center gap-3 mb-8">
          <ShieldAlert className="w-5 h-5" />
          <p className="text-sm font-medium">You do not have permission to modify platform location algorithms. Contact a Super Admin.</p>
        </div>
      )}

      <div className="space-y-6">
        {/* Hexagonal Routing */}
        <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6 shadow-lg">
          <div className="flex items-start justify-between">
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-xl bg-violet-500/20 flex items-center justify-center border border-violet-500/30 text-violet-400 shrink-0">
                <Hexagon className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">H3 Hexagonal Spatial Indexing</h2>
                <p className="text-sm text-slate-400 mt-1 max-w-xl">
                  When enabled, the platform uses Uber's H3 Hexagonal Grid system to partition geographic areas. 
                  This significantly speeds up "nearest to me" searches for products and services.
                </p>
              </div>
            </div>
            
            <label className={`relative inline-flex items-center cursor-pointer ${!hasSettingsPermission && 'opacity-50 cursor-not-allowed'}`}>
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={hexagonalRouting}
                disabled={!hasSettingsPermission}
                onChange={(e) => setHexagonalRouting(e.target.checked)}
              />
              <div className="w-14 h-7 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-violet-600"></div>
            </label>
          </div>
          
          {hexagonalRouting && (
            <div className="mt-6 ml-16 bg-slate-900/50 p-4 rounded-xl border border-slate-700">
              <div className="flex items-center gap-2 text-emerald-400 text-sm font-bold mb-2">
                <Check className="w-4 h-4" /> Hexagonal Sorting is Active
              </div>
              <p className="text-xs text-slate-500">
                Search queries will first locate the user's current H3 hexagon, then expand search outwards to neighboring rings. 
                Products inside the inner hexagon rings are always prioritized in search results.
              </p>
            </div>
          )}
        </div>

        {/* Global Radius Limits */}
        <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6 shadow-lg">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center border border-blue-500/30 text-blue-400 shrink-0">
              <Crosshair className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Default Discovery Radius</h2>
              <p className="text-sm text-slate-400 mt-1 max-w-xl">
                Set the default maximum radius constraint for discovering products and businesses when a user lands on the platform.
              </p>
            </div>
          </div>

          <div className="ml-16">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Radius (km)</span>
              <span className="text-xl font-black text-white">{defaultRadius} km</span>
            </div>
            <input 
              type="range" 
              min="1" 
              max="500" 
              value={defaultRadius}
              disabled={!hasSettingsPermission}
              onChange={(e) => setDefaultRadius(parseInt(e.target.value))}
              className={`w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500 ${!hasSettingsPermission && 'opacity-50 cursor-not-allowed'}`}
            />
            <div className="flex justify-between text-xs font-semibold text-slate-500 mt-2">
              <span>1 km (Hyperlocal)</span>
              <span>250 km (Regional)</span>
              <span>500 km (National)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
