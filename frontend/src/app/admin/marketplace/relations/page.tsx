"use client";

import React, { useState, useEffect } from 'react';
import { useProducts, Category, ListingType, BusinessModel, FeatureRule } from '@/context/ProductContext';
import { useAdminRole } from '@/context/AdminRoleContext';
import { ShieldAlert, ChevronRight, Check, X, Circle, Plus } from 'lucide-react';

export default function CategoryRelationsPage() {
  const { canEdit } = useAdminRole();
  const hasEditPermission = canEdit('categories');

  const { categories, updateCategory } = useProducts();
  const ALL_LISTING_TYPES: ListingType[] = ['Product', 'Service', 'Vehicle'];
  const ALL_BUSINESS_MODELS: BusinessModel[] = ['B2C', 'B2B', 'Appointment', 'RFQ', 'Bulk Pricing', 'MOQ', 'Quote', 'Token', 'Meeting', 'Sample'];
  const ALL_FEATURE_RULES: FeatureRule[] = ['Product Stock', 'Service', 'Appointment', 'Token', 'RFQ', 'B2C', 'B2B', 'Bulk Pricing', 'MOQ', 'Quote', 'Meeting', 'Sample', 'Vehicle Test Drive'];
  const WORKFLOWS = [
    'Product Sales Workflow',
    'B2B / Manufacturer Workflow',
    'Salon Booking Workflow',
    'Doctor / Queue Workflow',
    'Home Services Workflow',
    'Meeting / Proposal Workflow',
    'Vehicle Enquiry / Asset Workflow',
    'RFQ / Quote Workflow',
    'Project Milestone Workflow',
  ];

  // Local editing state — mirrors the selected category
  const [selectedCatId, setSelectedCatId] = useState<string>(categories[0]?.id || '');
  const selectedCat = categories.find(c => c.id === selectedCatId);

  const [draft, setDraft] = useState<Partial<Category>>(selectedCat || {});
  const [attrInput, setAttrInput] = useState('');
  const [saved, setSaved] = useState(false);

  // Sync draft when user picks different category
  useEffect(() => {
    if (selectedCat) setDraft({ ...selectedCat });
    setSaved(false);
  }, [selectedCatId, selectedCat]);

  const toggleArray = <T,>(arr: T[] | undefined, item: T): T[] => {
    const list = arr || [];
    return list.includes(item) ? list.filter(x => x !== item) : [...list, item];
  };

  const getFeatureState = (feature: FeatureRule): 'allowed' | 'notApplicable' | 'optional' | 'none' => {
    if ((draft.allowedFeatures || []).includes(feature)) return 'allowed';
    if ((draft.notApplicable || []).includes(feature)) return 'notApplicable';
    if ((draft.optionalFeatures || []).includes(feature)) return 'optional';
    return 'none';
  };

  const cycleFeature = (feature: FeatureRule) => {
    if (!hasEditPermission) return;
    const state = getFeatureState(feature);
    // Remove from all three
    const remove = (arr: FeatureRule[] | undefined) => (arr || []).filter(f => f !== feature);
    let next = {
      allowedFeatures: remove(draft.allowedFeatures) as FeatureRule[],
      notApplicable: remove(draft.notApplicable) as FeatureRule[],
      optionalFeatures: remove(draft.optionalFeatures) as FeatureRule[],
    };
    // Cycle: none→allowed→optional→notApplicable→none
    if (state === 'none') next.allowedFeatures.push(feature);
    else if (state === 'allowed') next.optionalFeatures.push(feature);
    else if (state === 'optional') next.notApplicable.push(feature);
    // notApplicable → none (do nothing extra)
    setDraft(d => ({ ...d, ...next }));
  };

  const handleAddAttr = () => {
    if (!hasEditPermission) return;
    const val = attrInput.trim();
    if (!val) return;
    const newParam = { name: val, type: 'text' as const };
    setDraft(d => ({ ...d, parameters: [...(d.parameters || []), newParam] }));
    setAttrInput('');
  };

  const handleSave = () => {
    if (!hasEditPermission) return;
    if (!selectedCatId) return;
    updateCategory(selectedCatId, draft);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  // Group categories by primaryType
  const grouped = [
    { label: '📦 Product', type: 'PRODUCT' },
    { label: '🛠️ Service', type: 'SERVICE' },
    { label: '🚗 Vehicle', type: 'VEHICLE' },
  ];

  const FeatureChip = ({ feature }: { feature: FeatureRule }) => {
    const state = getFeatureState(feature);
    const styles: Record<string, string> = {
      allowed: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/25',
      optional: 'bg-amber-500/15 text-amber-300 border-amber-500/30 hover:bg-amber-500/25',
      notApplicable: 'bg-rose-500/15 text-rose-300 border-rose-500/30 hover:bg-rose-500/25',
      none: 'bg-slate-700/50 text-slate-500 border-slate-700 hover:bg-slate-700',
    };
    const icons: Record<string, React.ReactNode> = {
      allowed: <Check className="w-3 h-3" />,
      optional: <Circle className="w-3 h-3" />,
      notApplicable: <X className="w-3 h-3" />,
      none: <span className="w-3 h-3 inline-block" />,
    };
    return (
      <button
        type="button"
        onClick={() => cycleFeature(feature)}
        disabled={!hasEditPermission}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer select-none ${styles[state]} ${!hasEditPermission && 'opacity-50 cursor-not-allowed'}`}
        title="Click to cycle: Allowed → Optional → Not Applicable → Unset"
      >
        {icons[state]}
        {feature}
      </button>
    );
  };

  return (
    <div className="max-w-7xl mx-auto animate-in fade-in duration-300">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white tracking-tight">Category Relationship Manager</h1>
        <p className="text-slate-400 mt-2 text-sm">Define listing types, business models, workflows, attributes, and access rules for each category.</p>
      </div>

      {!hasEditPermission && (
        <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-xl flex items-center gap-3 mb-8">
          <ShieldAlert className="w-5 h-5" />
          <p className="text-sm font-medium">You do not have permission to edit category relationships. Contact a Catalog Admin.</p>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-6 h-auto lg:h-[calc(100vh-220px)] lg:min-h-[600px]">
        {/* LEFT - Category List */}
        <div className="w-full lg:w-[240px] shrink-0 bg-slate-800 rounded-2xl border border-slate-700 overflow-y-auto flex flex-col h-[300px] lg:h-full">
          {grouped.map(group => {
            const cats = categories.filter(c => c.primaryType === group.type);
            if (cats.length === 0) return null;
            return (
              <div key={group.type}>
                <div className="px-4 pt-4 pb-1 text-[10px] font-black text-slate-500 uppercase tracking-widest">{group.label}</div>
                {cats.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCatId(cat.id)}
                    className={`w-full flex items-center justify-between px-4 py-2.5 text-sm font-semibold transition-colors ${selectedCatId === cat.id
                        ? 'bg-slate-700 text-white'
                        : 'text-slate-400 hover:bg-slate-700/50 hover:text-slate-200'
                      }`}
                  >
                    <span>{cat.name}</span>
                    <ChevronRight className="w-4 h-4 opacity-40" />
                  </button>
                ))}
              </div>
            );
          })}
        </div>

        {/* RIGHT — Detail Editor */}
        {selectedCat ? (
          <div className="flex-1 overflow-y-auto space-y-6">
            {/* Breadcrumb */}
            <div className="bg-slate-800 rounded-2xl border border-slate-700 px-6 py-4 flex items-center gap-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{selectedCat.primaryType}</span>
              <ChevronRight className="w-4 h-4 text-slate-600" />
              <span className="text-lg font-black text-white">{selectedCat.name}</span>
              {draft.workflow && (
                <span className="ml-auto text-xs bg-violet-500/15 text-violet-300 border border-violet-500/30 px-3 py-1 rounded-full font-semibold">
                  {draft.workflow}
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Allowed Listing Types */}
              <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6 space-y-4">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Allowed Listing Types</h3>
                <div className="flex flex-wrap gap-3">
                  {ALL_LISTING_TYPES.map(lt => {
                    const on = (draft.allowedListingTypes || []).includes(lt);
                    return (
                      <label key={lt} className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl border-2 cursor-pointer transition-all font-semibold text-sm ${on ? 'border-blue-500 bg-blue-500/10 text-blue-300' : 'border-slate-700 text-slate-500 hover:border-slate-600'
                        } ${!hasEditPermission && 'opacity-50 cursor-not-allowed'}`}>
                        <input type="checkbox" className="hidden" disabled={!hasEditPermission} checked={on} onChange={() => setDraft(d => ({ ...d, allowedListingTypes: toggleArray(d.allowedListingTypes, lt) }))} />
                        {on ? <Check className="w-4 h-4" /> : <span className="w-4 h-4" />}
                        {lt}
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Business Models */}
              <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6 space-y-4">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Business Models</h3>
                <div className="flex flex-wrap gap-2">
                  {ALL_BUSINESS_MODELS.map(bm => {
                    const on = (draft.businessModels || []).includes(bm);
                    return (
                      <label key={bm} className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition-all text-xs font-bold ${on ? 'border-indigo-500 bg-indigo-500/10 text-indigo-300' : 'border-slate-700 text-slate-500 hover:border-slate-600'
                        } ${!hasEditPermission && 'opacity-50 cursor-not-allowed'}`}>
                        <input type="checkbox" className="hidden" disabled={!hasEditPermission} checked={on} onChange={() => setDraft(d => ({ ...d, businessModels: toggleArray(d.businessModels, bm) }))} />
                        {on ? <Check className="w-3 h-3" /> : <span className="w-3 h-3" />}
                        {bm}
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Workflow */}
              <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6 space-y-4">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Workflow</h3>
                <select
                  value={draft.workflow || ''}
                  onChange={e => setDraft(d => ({ ...d, workflow: e.target.value }))}
                  disabled={!hasEditPermission}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-violet-500 font-medium disabled:opacity-50"
                >
                  <option value="">— Select a workflow —</option>
                  {WORKFLOWS.map(w => <option key={w} value={w}>{w}</option>)}
                </select>
              </div>

              {/* Attributes */}
              <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6 space-y-4">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Attributes</h3>
                <div className="flex gap-2">
                  <input
                    value={attrInput}
                    onChange={e => setAttrInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddAttr())}
                    disabled={!hasEditPermission}
                    placeholder="Type attribute name + Enter"
                    className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500 disabled:opacity-50"
                  />
                  <button onClick={handleAddAttr} disabled={!hasEditPermission} className="bg-slate-700 hover:bg-slate-600 text-white px-3 py-2 rounded-lg transition-colors disabled:opacity-50">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(draft.parameters || []).map((p, i) => (
                    <span key={i} className="inline-flex items-center gap-1.5 bg-slate-700 text-slate-200 text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-600">
                      {p.name}
                      {hasEditPermission && (
                        <button
                          onClick={() => setDraft(d => ({ ...d, parameters: (d.parameters || []).filter((_, j) => j !== i) }))}
                          className="text-slate-400 hover:text-rose-400 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </span>
                  ))}
                  {(!draft.parameters || draft.parameters.length === 0) && (
                    <span className="text-slate-600 text-xs italic">No attributes yet</span>
                  )}
                </div>
              </div>
            </div>

            {/* Access Rules */}
            <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6 space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Access Rules</h3>
                <div className="flex items-center gap-4 text-xs font-semibold">
                  <span className="flex items-center gap-1.5 text-emerald-400"><Check className="w-3 h-3" /> Allowed</span>
                  <span className="flex items-center gap-1.5 text-amber-400"><Circle className="w-3 h-3" /> Optional</span>
                  <span className="flex items-center gap-1.5 text-rose-400"><X className="w-3 h-3" /> Not Applicable</span>
                  <span className="text-slate-500">(click to cycle)</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {ALL_FEATURE_RULES.map(feature => (
                  <FeatureChip key={feature} feature={feature} />
                ))}
              </div>

              {/* Legend summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 border-t border-slate-700/50">
                <div className="space-y-1">
                  <div className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-2">✓ Allowed</div>
                  <div className="flex flex-wrap gap-1.5">
                    {(draft.allowedFeatures || []).length === 0
                      ? <span className="text-xs text-slate-600 italic">None set</span>
                      : (draft.allowedFeatures || []).map(f => (
                        <span key={f} className="text-xs bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded font-semibold border border-emerald-500/20">{f}</span>
                      ))
                    }
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-2">○ Optional</div>
                  <div className="flex flex-wrap gap-1.5">
                    {(draft.optionalFeatures || []).length === 0
                      ? <span className="text-xs text-slate-600 italic">None set</span>
                      : (draft.optionalFeatures || []).map(f => (
                        <span key={f} className="text-xs bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded font-semibold border border-amber-500/20">{f}</span>
                      ))
                    }
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-[10px] font-black text-rose-500 uppercase tracking-widest mb-2">✕ Not Applicable</div>
                  <div className="flex flex-wrap gap-1.5">
                    {(draft.notApplicable || []).length === 0
                      ? <span className="text-xs text-slate-600 italic">None set</span>
                      : (draft.notApplicable || []).map(f => (
                        <span key={f} className="text-xs bg-rose-500/10 text-rose-400 px-2 py-0.5 rounded font-semibold border border-rose-500/20">{f}</span>
                      ))
                    }
                  </div>
                </div>
              </div>
            </div>

            {/* Save */}
            {hasEditPermission && (
              <div className="flex justify-end pb-6">
                <button
                  onClick={handleSave}
                  className={`px-8 py-3 rounded-xl font-black text-sm transition-all shadow-lg ${saved
                      ? 'bg-emerald-600 text-white shadow-emerald-900/30'
                      : 'bg-violet-600 hover:bg-violet-500 text-white shadow-violet-900/30'
                    }`}
                >
                  {saved ? '✓ Saved!' : 'Save Changes'}
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-slate-600">
            Select a category from the left panel
          </div>
        )}
      </div>
    </div>
  );
}
