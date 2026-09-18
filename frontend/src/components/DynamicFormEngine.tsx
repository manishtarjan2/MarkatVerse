"use client";
import React, { useState, useEffect } from 'react';
import { PlusCircle, Trash2, ChevronUp, ChevronDown } from 'lucide-react';
import { useProducts, Category, FormField, useCategoryRules, BusinessModel } from '@/context/ProductContext';
import { useAuth } from '@/context/AuthContext';

interface DynamicFormEngineProps {
  initialData?: any;
  onSave: (data: any) => Promise<void>;
  onCancel: () => void;
  isService?: boolean;
}

export default function DynamicFormEngine({ initialData, onSave, onCancel, isService = false }: DynamicFormEngineProps) {
  const { categories } = useProducts();
  const { user } = useAuth();
  
  // Basic Fields
  const [name, setName] = useState(initialData?.name || '');
  const [description, setDescription] = useState(initialData?.description || '');
  
  // Hierarchy Fields
  const [primaryType, setPrimaryType] = useState<'PRODUCT'|'SERVICE'|'VEHICLE'>(initialData?.primaryType || (isService ? 'SERVICE' : 'PRODUCT'));
  const [category, setCategory] = useState(initialData?.category || '');
  const [subcategory, setSubcategory] = useState(initialData?.subcategory || '');
  const [nestedSubcategory, setNestedSubcategory] = useState(initialData?.nestedSubcategory || '');

  // Pricing
  const [sellingType, setSellingType] = useState<'B2C'|'B2B'>(initialData?.isB2B ? 'B2B' : 'B2C');
  const [b2cPrice, setB2cPrice] = useState(initialData?.price?.toString() || '');
  const [wholesaleTiers, setWholesaleTiers] = useState<{ minQty: number, price: number }[]>(initialData?.wholesaleTiers || [
    { minQty: 10, price: 0 },
    { minQty: 50, price: 0 },
    { minQty: 100, price: 0 }
  ]);
  
  // Dynamic Attributes
  const [parameters, setParameters] = useState<Record<string, string | string[]>>(initialData?.parameters || {});
  
  // Custom Options (Variants/Services Menu)
  const [options, setOptions] = useState<{ id: string, name: string, price: number, discountPercentage?: number }[]>(initialData?.options || []);
  
  // Media
  const [uploadedImages, setUploadedImages] = useState<string[]>(initialData?.images || (initialData?.image ? [initialData.image] : []));
  const [isUploadingFiles, setIsUploadingFiles] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageInputMode, setImageInputMode] = useState<'upload' | 'url'>('upload');
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [imageUrlError, setImageUrlError] = useState('');

  // Location
  const [location, setLocation] = useState(initialData?.location || '');
  const [pincode, setPincode] = useState(initialData?.pincode || '');

  // Cascading Logic
  const catRules = useCategoryRules(category);
  const B2C_LIKE: BusinessModel[] = ['B2C', 'Appointment', 'Token', 'Meeting'];
  const B2B_LIKE: BusinessModel[] = ['B2B', 'Bulk Pricing', 'MOQ', 'RFQ', 'Quote', 'Sample'];
  const noModelRules = catRules.businessModels.length === 0;
  const canSellB2C = noModelRules || catRules.businessModels.some(m => B2C_LIKE.includes(m));
  const canSellB2B = noModelRules || catRules.businessModels.some(m => B2B_LIKE.includes(m));

  const primaryTypes = ['PRODUCT', 'SERVICE', 'VEHICLE'];
  const availableCategories = categories.filter(c => c.primaryType === primaryType);
  const selectedCategory = availableCategories.find(c => c.name === category);
  const availableSubcategories = selectedCategory?.subcategories || [];
  const selectedSubcategory = availableSubcategories.find(s => s.name === subcategory);
  const availableNestedSubcategories = selectedSubcategory?.nestedSubcategories || [];
  const selectedNestedSubcategory = availableNestedSubcategories.find(n => n.name === nestedSubcategory);

  const activeParameters: FormField[] = selectedNestedSubcategory?.parameters 
    || selectedSubcategory?.parameters 
    || selectedCategory?.parameters 
    || [];
  const hasPricelist = activeParameters.some(p => p.type === 'pricelist');

  // Reset downstream selections when a parent changes
  useEffect(() => {
    if (!availableCategories.find(c => c.name === category)) setCategory('');
  }, [primaryType]);

  useEffect(() => {
    if (!availableSubcategories.find(s => s.name === subcategory)) setSubcategory('');
  }, [category]);

  useEffect(() => {
    if (!availableNestedSubcategories.find(n => n.name === nestedSubcategory)) setNestedSubcategory('');
  }, [subcategory]);

  // Auto-adjust selling type when admin rules for the selected category dictate only one model
  useEffect(() => {
    if (catRules.businessModels.length === 0) return;
    const hasB2C = catRules.businessModels.some(m => (['B2C', 'Appointment', 'Token', 'Meeting'] as BusinessModel[]).includes(m));
    const hasB2B = catRules.businessModels.some(m => (['B2B', 'Bulk Pricing', 'MOQ', 'RFQ', 'Quote', 'Sample'] as BusinessModel[]).includes(m));
    if (!hasB2B && hasB2C) setSellingType('B2C');
    if (!hasB2C && hasB2B) setSellingType('B2B');
  }, [category]); // eslint-disable-line react-hooks/exhaustive-deps

  // Handle Image Upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    setIsUploadingFiles(true);
    
    const files = Array.from(e.target.files);
    const base64Images: string[] = [];

    for (const file of files) {
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
      });
      base64Images.push(base64);
    }

    setUploadedImages(prev => [...prev, ...base64Images]);
    setIsUploadingFiles(false);
  };

  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleAddImageUrl = () => {
    const trimmed = imageUrlInput.trim();
    if (!trimmed) { setImageUrlError('Please enter a URL.'); return; }
    try { new URL(trimmed); } catch { setImageUrlError('Please enter a valid URL (starting with http/https).'); return; }
    setUploadedImages(prev => [...prev, trimmed]);
    setImageUrlInput('');
    setImageUrlError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const payload = {
      name,
      description,
      primaryType,
      category,
      subcategory,
      nestedSubcategory,
      isB2B: sellingType === 'B2B',
      price: sellingType === 'B2C' ? Number(b2cPrice) : wholesaleTiers[0].price, // Fallback price
      wholesaleTiers: sellingType === 'B2B' ? wholesaleTiers : undefined,
      images: uploadedImages.length > 0 ? uploadedImages : undefined,
      image: uploadedImages.length > 0 ? uploadedImages[0] : '/hero-left-logo.png',
      parameters,
      options: options.length > 0 ? options : undefined,
      location,
      pincode
    };

    await onSave(payload);
    setIsSubmitting(false);
  };

  const handleCheckboxChange = (paramName: string, option: string, isChecked: boolean) => {
    setParameters(prev => {
      const current = (prev[paramName] as string[]) || [];
      if (isChecked) {
        return { ...prev, [paramName]: [...current, option] };
      } else {
        return { ...prev, [paramName]: current.filter(item => item !== option) };
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-8">
      
      {/* 1. CLASSIFICATION BLOCK */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider border-b pb-2">1. Classification</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-600">Primary Type</label>
            <select 
              value={primaryType} 
              onChange={e => setPrimaryType(e.target.value as any)} 
              className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-blue-500 outline-none text-sm bg-slate-50"
            >
              {primaryTypes.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-600">Category</label>
            <select 
              required
              value={category} 
              onChange={e => setCategory(e.target.value)} 
              className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-blue-500 outline-none text-sm bg-slate-50"
            >
              <option value="">Select Category...</option>
              {availableCategories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
            </select>
          </div>

          {availableSubcategories.length > 0 && (
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-600">Subcategory</label>
              <select 
                value={subcategory} 
                onChange={e => setSubcategory(e.target.value)} 
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-blue-500 outline-none text-sm bg-slate-50"
              >
                <option value="">Select Subcategory...</option>
                {availableSubcategories.map(s => <option key={s.name} value={s.name}>{s.name}</option>)}
              </select>
            </div>
          )}

          {availableNestedSubcategories.length > 0 && (
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-600">Type</label>
              <select 
                value={nestedSubcategory} 
                onChange={e => setNestedSubcategory(e.target.value)} 
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-blue-500 outline-none text-sm bg-slate-50"
              >
                <option value="">Select Type...</option>
                {availableNestedSubcategories.map(n => <option key={n.name} value={n.name}>{n.name}</option>)}
              </select>
            </div>
          )}

        </div>

        {/* Workflow & Optional Features badge — powered by Admin Relationship Manager */}
        {catRules.workflow && (
          <div className="flex flex-wrap items-center gap-2 mt-2 px-4 py-2.5 bg-violet-50 rounded-xl border border-violet-100">
            <span className="text-[10px] font-black text-violet-500 uppercase tracking-widest">Workflow</span>
            <span className="text-xs font-semibold text-violet-800 bg-white border border-violet-200 px-2.5 py-1 rounded-full">{catRules.workflow}</span>
            {catRules.optionalFeatures.length > 0 && (
              <>
                <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest ml-2">Optional</span>
                {catRules.optionalFeatures.map(f => (
                  <span key={f} className="text-xs text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full font-semibold">{f}</span>
                ))}
              </>
            )}
          </div>
        )}

      </div>

      {/* 2. BASIC INFO */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider border-b pb-2">2. Basic Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Listing Title</label>
            <input required type="text" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Samsung Galaxy S23 Ultra" className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 outline-none text-slate-900" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Description</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Detailed description..." rows={1} className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 outline-none text-slate-900 resize-none" />
          </div>
          <div className="space-y-2 md:col-span-2 bg-blue-50/50 p-4 rounded-xl border border-blue-100">
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-semibold text-slate-700">Location Details</label>
              <button 
                type="button" 
                onClick={() => {
                  if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(
                      (position) => {
                        alert(`Location pinned! Lat: ${position.coords.latitude.toFixed(4)}, Lng: ${position.coords.longitude.toFixed(4)}`);
                        // Ideally we would reverse geocode here. For now, just set dummy or preserve existing location text,
                        // and perhaps we could save the lat/lng in state if we had it, but let's just show success to the user.
                      },
                      (error) => alert('Error getting location: ' + error.message)
                    );
                  } else {
                    alert('Geolocation is not supported by your browser.');
                  }
                }}
                className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                Pin My Location
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500">Address / City</label>
                <input type="text" value={location} onChange={e => setLocation(e.target.value)} placeholder="e.g. Mumbai, Maharashtra" className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 outline-none text-slate-900 bg-white" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500">PIN Code / ZIP</label>
                <input type="text" value={pincode} onChange={e => setPincode(e.target.value)} placeholder="e.g. 400001" className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 outline-none text-slate-900 bg-white" />
              </div>
            </div>
            <p className="text-[10px] text-slate-500 mt-2">Pinning your location helps local customers find your services easily in the 'Near Me' section.</p>
          </div>
        </div>
      </div>

      {/* 3. DYNAMIC ATTRIBUTES */}
      {activeParameters.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider border-b pb-2">3. Product Specifications</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-5 bg-slate-50 rounded-2xl border border-slate-100">
            {activeParameters.map(param => (
              <div key={param.name} className={`space-y-3 ${param.type === 'pricelist' ? 'col-span-1 md:col-span-2 lg:col-span-3' : ''}`}>
                <label className="text-sm font-semibold text-slate-700">{param.name}</label>
                
                {param.type === 'text' && (
                  <input type="text" value={(parameters[param.name] as string) || ''} onChange={e => setParameters({...parameters, [param.name]: e.target.value})} placeholder={param.placeholder} className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-blue-500 outline-none text-sm" />
                )}

                {param.type === 'number' && (
                  <input type="number" value={(parameters[param.name] as string) || ''} onChange={e => setParameters({...parameters, [param.name]: e.target.value})} placeholder={param.placeholder} className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-blue-500 outline-none text-sm" />
                )}

                {param.type === 'radio' && param.options && (
                  <div className="flex flex-col gap-2">
                    {param.options.map(opt => (
                      <label key={opt} className="flex items-center gap-2 cursor-pointer text-sm text-slate-600">
                        <input type="radio" name={param.name} value={opt} checked={parameters[param.name] === opt} onChange={e => setParameters({...parameters, [param.name]: e.target.value})} className="w-4 h-4 text-blue-600" />
                        {opt}
                      </label>
                    ))}
                  </div>
                )}

                {param.type === 'checkbox' && param.options && (
                  <div className="flex flex-col gap-2">
                    {param.options.map(opt => {
                      const isChecked = ((parameters[param.name] as string[]) || []).includes(opt);
                      return (
                        <label key={opt} className="flex items-center gap-2 cursor-pointer text-sm text-slate-600">
                          <input type="checkbox" checked={isChecked} onChange={e => handleCheckboxChange(param.name, opt, e.target.checked)} className="w-4 h-4 text-blue-600 rounded" />
                          {opt}
                        </label>
                      );
                    })}
                  </div>
                )}

                {param.type === 'pricelist' && (
                  <div className="flex flex-col gap-4 w-full bg-white p-4 rounded-xl border border-slate-200 shadow-sm mt-1">
                    <p className="text-xs text-slate-500 font-medium">Select the options you offer and set your pricing.</p>
                    <div className="space-y-3">
                      {Array.from(new Set([...(param.options || []), ...options.map(o => o.name)])).map(optName => {
                        const existingOption = options.find(o => o.name === optName);
                        const isChecked = !!existingOption;
                        return (
                          <div key={optName} className={`flex flex-wrap items-center gap-4 p-3 rounded-xl border transition-colors ${isChecked ? 'bg-blue-50/50 border-blue-200' : 'bg-slate-50 border-slate-100'}`}>
                            <label className="flex items-center gap-3 cursor-pointer min-w-[150px] flex-1">
                              <input 
                                type="checkbox" 
                                checked={isChecked}
                                onChange={e => {
                                  if (e.target.checked) {
                                    setOptions([...options, { id: Math.random().toString(36).substr(2, 9), name: optName, price: 0 }]);
                                  } else {
                                    setOptions(options.filter(o => o.name !== optName));
                                  }
                                }}
                                className="w-5 h-5 text-blue-600 rounded border-slate-300 focus:ring-blue-500" 
                              />
                              <span className={`font-semibold ${isChecked ? 'text-blue-800' : 'text-slate-600'}`}>{optName}</span>
                            </label>
                            {isChecked && (
                              <div className="flex gap-3 flex-wrap items-center">
                                <div className="w-32">
                                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Price</label>
                                  <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium">₹</span>
                                    <input type="number" value={existingOption.price || ''} onChange={e => setOptions(options.map(o => o.name === optName ? { ...o, price: Number(e.target.value) } : o))} className="w-full pl-7 pr-3 py-1.5 rounded-lg border border-slate-300 outline-none text-sm bg-white focus:border-blue-500" />
                                  </div>
                                </div>
                                <div className="w-24">
                                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Discount</label>
                                  <div className="relative">
                                    <input type="number" value={existingOption.discountPercentage || ''} onChange={e => setOptions(options.map(o => o.name === optName ? { ...o, discountPercentage: Number(e.target.value) } : o))} placeholder="0" className="w-full pl-3 pr-7 py-1.5 rounded-lg border border-slate-300 outline-none text-sm bg-white focus:border-blue-500" />
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium">%</span>
                                  </div>
                                </div>
                                {!(param.options || []).includes(optName) && (
                                  <button type="button" onClick={() => setOptions(options.filter(o => o.name !== optName))} className="mt-5 p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                    <button type="button" onClick={() => {
                        const customName = prompt('Enter custom option name:');
                        if (customName && customName.trim()) {
                          if (!options.find(o => o.name.toLowerCase() === customName.trim().toLowerCase()) && !(param.options || []).some(o => o.toLowerCase() === customName.trim().toLowerCase())) {
                            setOptions([...options, { id: Math.random().toString(36).substr(2, 9), name: customName.trim(), price: 0 }]);
                          }
                        }
                      }} className="mt-2 w-full p-3 border-2 border-dashed border-blue-200 bg-blue-50/50 rounded-xl text-blue-600 flex items-center justify-center gap-2 hover:bg-blue-50 hover:border-blue-300 transition-colors font-semibold text-sm">
                      <PlusCircle className="w-4 h-4" /> Add Custom {param.name}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. PRICING & SELLING TYPE */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider border-b pb-2">4. Pricing & Sales Model</h3>
        
        <div className="flex gap-4 mb-4">
          {canSellB2C && (
            <label className={`flex-1 flex items-center justify-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${sellingType === 'B2C' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-200 bg-white text-slate-500'}`}>
              <input type="radio" name="sellingType" value="B2C" checked={sellingType === 'B2C'} onChange={() => setSellingType('B2C')} className="hidden" />
              <div className="text-center">
                <div className="font-bold text-lg">B2C / Service</div>
                <div className="text-xs opacity-80">Fixed Price per Unit / Session</div>
              </div>
            </label>
          )}
          {canSellB2B && (
            <label className={`flex-1 flex items-center justify-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${sellingType === 'B2B' ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-slate-200 bg-white text-slate-500'}`}>
              <input type="radio" name="sellingType" value="B2B" checked={sellingType === 'B2B'} onChange={() => setSellingType('B2B')} className="hidden" />
              <div className="text-center">
                <div className="font-bold text-lg">B2B / Wholesale</div>
                <div className="text-xs opacity-80">Tiered Bulk Pricing</div>
              </div>
            </label>
          )}
        </div>
        {/* Admin-allowed business models info row */}
        {catRules.businessModels.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mb-4 px-3 py-2.5 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-1">Admin-approved:</span>
            {catRules.businessModels.map(bm => (
              <span key={bm} className="text-xs bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-1 rounded-full font-semibold">{bm}</span>
            ))}
          </div>
        )}

        {sellingType === 'B2C' ? (
          <div className="max-w-xs space-y-2">
            <label className="text-sm font-semibold text-slate-700">Selling Price (₹)</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">₹</span>
              <input required={options.length === 0} type="number" value={b2cPrice} onChange={e => setB2cPrice(e.target.value)} placeholder="0.00" className="w-full pl-8 pr-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 outline-none text-slate-900 font-medium" />
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <label className="text-sm font-semibold text-slate-700">Wholesale Pricing Tiers</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {wholesaleTiers.map((tier, index) => (
                <div key={index} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tier {index + 1}</span>
                    {index > 0 && (
                      <button type="button" onClick={() => setWholesaleTiers(prev => prev.filter((_, i) => i !== index))} className="text-red-400 hover:text-red-600">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <div>
                    <label className="text-xs text-slate-500">Min Quantity (+)</label>
                    <input type="number" value={tier.minQty} onChange={e => {
                      const newTiers = [...wholesaleTiers];
                      newTiers[index].minQty = Number(e.target.value);
                      setWholesaleTiers(newTiers);
                    }} className="w-full px-3 py-2 rounded-lg border border-slate-300 outline-none text-sm mt-1" />
                  </div>
                  <div>
                    <label className="text-xs text-slate-500">Unit Price (₹)</label>
                    <input type="number" value={tier.price} onChange={e => {
                      const newTiers = [...wholesaleTiers];
                      newTiers[index].price = Number(e.target.value);
                      setWholesaleTiers(newTiers);
                    }} className="w-full px-3 py-2 rounded-lg border border-slate-300 outline-none text-sm mt-1" />
                  </div>
                </div>
              ))}
              <button type="button" onClick={() => setWholesaleTiers(prev => [...prev, { minQty: 0, price: 0 }])} className="p-4 border-2 border-dashed border-slate-300 rounded-xl text-slate-500 flex flex-col items-center justify-center gap-2 hover:bg-slate-50 hover:text-blue-600 hover:border-blue-300 transition-colors">
                <PlusCircle className="w-6 h-6" />
                <span className="text-sm font-semibold">Add Tier</span>
              </button>
            </div>
          </div>
        )}

        {/* Dynamic Options (Variants/Services) */}
        {!hasPricelist && (canSellB2C || isService) && (
          <div className="space-y-4 pt-6 border-t border-slate-100">
            <h4 className="text-sm font-bold text-slate-800">Custom Options & Variants</h4>
            <p className="text-xs text-slate-500">Add variations like specific services (e.g. Haircut, Massage) or product variants (e.g. Size, Material) with custom pricing.</p>
            
            <div className="grid grid-cols-1 gap-3">
              {options.map((opt, index) => (
                <div key={opt.id} className="flex gap-3 items-center p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="flex flex-col gap-1">
                    <button type="button" disabled={index === 0} onClick={() => {
                      const newOpts = [...options];
                      const temp = newOpts[index - 1];
                      newOpts[index - 1] = newOpts[index];
                      newOpts[index] = temp;
                      setOptions(newOpts);
                    }} className="text-slate-400 hover:text-blue-600 disabled:opacity-30 disabled:hover:text-slate-400 p-0.5 rounded transition">
                      <ChevronUp className="w-4 h-4" />
                    </button>
                    <button type="button" disabled={index === options.length - 1} onClick={() => {
                      const newOpts = [...options];
                      const temp = newOpts[index + 1];
                      newOpts[index + 1] = newOpts[index];
                      newOpts[index] = temp;
                      setOptions(newOpts);
                    }} className="text-slate-400 hover:text-blue-600 disabled:opacity-30 disabled:hover:text-slate-400 p-0.5 rounded transition">
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex-1">
                    <input type="text" value={opt.name} onChange={e => {
                      const newOpts = [...options];
                      newOpts[index].name = e.target.value;
                      setOptions(newOpts);
                    }} placeholder="Option Name (e.g. Haircut, Size L)" className="w-full px-3 py-2 rounded-lg border border-slate-300 outline-none text-sm" />
                  </div>
                  <div className="w-32">
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">₹</span>
                      <input type="number" value={opt.price} onChange={e => {
                        const newOpts = [...options];
                        newOpts[index].price = Number(e.target.value);
                        setOptions(newOpts);
                      }} placeholder="0" className="w-full pl-7 pr-3 py-2 rounded-lg border border-slate-300 outline-none text-sm" />
                    </div>
                  </div>
                  <button type="button" onClick={() => setOptions(options.filter((_, i) => i !== index))} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button type="button" onClick={() => setOptions([...options, { id: Math.random().toString(36).substr(2, 9), name: '', price: 0 }])} className="w-full p-3 border-2 border-dashed border-blue-200 bg-blue-50/50 rounded-xl text-blue-600 flex items-center justify-center gap-2 hover:bg-blue-50 hover:border-blue-300 transition-colors font-semibold text-sm">
                <PlusCircle className="w-4 h-4" /> Add Option / Variant
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 5. MEDIA UPLOAD */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider border-b pb-2">5. Media & Images</h3>

        {/* Tab toggle */}
        <div className="flex gap-2 mb-2">
          <button
            type="button"
            onClick={() => setImageInputMode('upload')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-colors border ${
              imageInputMode === 'upload'
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-slate-500 border-slate-300 hover:border-blue-400 hover:text-blue-600'
            }`}
          >
            📁 Upload File
          </button>
          <button
            type="button"
            onClick={() => { setImageInputMode('url'); setImageUrlError(''); }}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-colors border ${
              imageInputMode === 'url'
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-slate-500 border-slate-300 hover:border-blue-400 hover:text-blue-600'
            }`}
          >
            🔗 Add URL
          </button>
        </div>

        {/* URL input row */}
        {imageInputMode === 'url' && (
          <div className="space-y-2">
            <div className="flex gap-2">
              <input
                type="url"
                value={imageUrlInput}
                onChange={e => { setImageUrlInput(e.target.value); setImageUrlError(''); }}
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddImageUrl())}
                placeholder="https://example.com/image.jpg"
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 outline-none text-sm text-slate-900"
              />
              <button
                type="button"
                onClick={handleAddImageUrl}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold transition-colors whitespace-nowrap"
              >
                Add Image
              </button>
            </div>
            {imageUrlError && <p className="text-red-500 text-xs font-medium">{imageUrlError}</p>}
          </div>
        )}

        {/* Thumbnail grid */}
        <div className="flex flex-wrap gap-4">
          {uploadedImages.map((url, i) => (
            <div key={i} className="relative w-32 h-32 rounded-xl border border-slate-200 overflow-hidden group">
              <img src={url} alt={`Upload ${i}`} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button type="button" onClick={() => removeImage(i)} className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
          {imageInputMode === 'upload' && (
            <label className="w-32 h-32 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors text-slate-500">
              {isUploadingFiles ? <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div> : <PlusCircle className="w-6 h-6" />}
              <span className="text-xs font-semibold">{isUploadingFiles ? 'Uploading...' : 'Add Images'}</span>
              <input type="file" multiple accept="image/*" className="hidden" onChange={handleFileUpload} disabled={isUploadingFiles} />
            </label>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-6 border-t border-slate-200">
        <button type="button" onClick={onCancel} className="px-6 py-3 rounded-xl font-bold text-slate-600 hover:bg-slate-100 transition-colors">Cancel</button>
        <button type="submit" disabled={isSubmitting} className="px-8 py-3 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors disabled:opacity-70 shadow-sm hover:shadow">
          {isSubmitting ? 'Saving...' : 'Publish Listing'}
        </button>
      </div>
    </form>
  );
}
