"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useProducts } from '@/context/ProductContext';
import { ChevronRight, Filter, Search } from 'lucide-react';

export default function DynamicExplorePage({ params }: { params: Promise<{ slug?: string[] }> }) {
  const { products, categories } = useProducts();
  const resolvedParams = React.use(params);
  const slug = resolvedParams.slug || [];
  
  // Levels: 
  // slug[0] = mainType (e.g. b2b, b2c, services)
  // slug[1] = businessType (e.g. retail, wholesale)
  // slug[2] = sector (e.g. fashion, electronics)
  
  const mainType = slug[0];
  const businessType = slug[1];
  const sector = slug[2];

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
  
  const [hierarchy, setHierarchy] = useState<any>(null);
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // In a real V2 backend integration, we would fetch from /configuration/business-hierarchy
  // and /listings based on the path.
  useEffect(() => {
    // For now, we simulate the progressive disclosure using the context data
    setLoading(true);
    
    setTimeout(() => {
      // Fetch dynamic listings if we are at the sector level
      if (sector) {
        // Find products matching the sector/category
        // We use case-insensitive matching
        const matched = products.filter(p => p.category?.toLowerCase() === sector.toLowerCase() || p.subcategory?.toLowerCase() === sector.toLowerCase());
        setListings(matched);
      }
      setLoading(false);
    }, 500);
  }, [slug, products]);

  // Determine what to show based on current path depth
  const renderBreadcrumbs = () => {
    return (
      <div className="flex items-center gap-2 text-sm text-slate-500 mb-8 overflow-x-auto pb-2 whitespace-nowrap">
        <Link href="/explore" className="hover:text-blue-600 font-medium transition-colors">Explore</Link>
        {mainType && (
          <>
            <ChevronRight className="w-4 h-4" />
            <Link href={`/explore/${mainType}`} className="hover:text-blue-600 font-medium transition-colors capitalize">{mainType}</Link>
          </>
        )}
        {businessType && (
          <>
            <ChevronRight className="w-4 h-4" />
            <Link href={`/explore/${mainType}/${businessType}`} className="hover:text-blue-600 font-medium transition-colors capitalize">{businessType.replace('-', ' ')}</Link>
          </>
        )}
        {sector && (
          <>
            <ChevronRight className="w-4 h-4" />
            <span className="text-slate-900 font-bold capitalize">{sector.replace('-', ' ')}</span>
          </>
        )}
      </div>
    );
  };

  // View: Main Models (Level 0)
  if (slug.length === 0) {
    return (
      <div className="max-w-7xl mx-auto p-6 lg:p-10 min-h-screen bg-slate-50">
        {renderBreadcrumbs()}
        <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-4">Explore MarkatVerse</h1>
        <p className="text-lg text-slate-500 mb-10 max-w-3xl">Select a market segment to begin browsing thousands of products, services, and B2B opportunities.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/explore/b2c" className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group">
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors">🛍️</div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">B2C Retail</h2>
            <p className="text-slate-500">Shop directly from retailers, brands, and local stores for everyday consumer products.</p>
          </Link>
          
          <Link href="/explore/b2b" className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group">
            <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:bg-amber-600 group-hover:text-white transition-colors">🏢</div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">B2B Wholesale</h2>
            <p className="text-slate-500">Connect with manufacturers, distributors, and wholesalers for bulk purchasing.</p>
          </Link>
          
          <Link href="/explore/services" className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:bg-emerald-600 group-hover:text-white transition-colors">✨</div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Services</h2>
            <p className="text-slate-500">Book appointments with salons, consultants, contractors, and service professionals.</p>
          </Link>
        </div>
      </div>
    );
  }

  // View: Business Types (Level 1)
  if (slug.length === 1) {
    const types = mainType === 'b2c' ? ['retailer', 'brand-store', 'home-business'] :
                  mainType === 'b2b' ? ['manufacturer', 'wholesaler', 'distributor'] :
                  ['salon-spa', 'consultant', 'contractor', 'freelancer'];
                  
    return (
      <div className="max-w-7xl mx-auto p-6 lg:p-10 min-h-screen bg-slate-50">
        {renderBreadcrumbs()}
        <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-4 capitalize">{mainType} Marketplace</h1>
        <p className="text-lg text-slate-500 mb-10 max-w-3xl">Select a business type to view specific categories.</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {types.map(type => (
            <Link key={type} href={`/explore/${mainType}/${type}`} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all flex items-center gap-4">
              <div className="w-12 h-12 bg-slate-100 text-slate-600 rounded-xl flex items-center justify-center font-bold text-xl uppercase">
                {type.charAt(0)}
              </div>
              <div className="font-bold text-slate-900 capitalize text-lg">{type.replace('-', ' ')}</div>
            </Link>
          ))}
        </div>
      </div>
    );
  }

  // View: Sectors / Categories (Level 2)
  if (slug.length === 2) {
    // We map backend categories
    const displayedCategories = mainType === 'services' 
      ? categories.filter(c => ['Services', 'Beauty', 'Transport', 'Organizers'].includes(c.name))
      : categories.filter(c => !['Services', 'Transport', 'Organizers'].includes(c.name));

    return (
      <div className="max-w-7xl mx-auto p-6 lg:p-10 min-h-screen bg-slate-50">
        {renderBreadcrumbs()}
        <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-4 capitalize">{businessType.replace('-', ' ')} Sectors</h1>
        <p className="text-lg text-slate-500 mb-10 max-w-3xl">Select a specific sector or category to view listings.</p>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {displayedCategories.map(cat => (
            <Link key={cat.id} href={`/explore/${mainType}/${businessType}/${cat.name.toLowerCase()}`} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-300 hover:-translate-y-1 transition-all flex flex-col items-center text-center gap-3 group">
              <div className="text-4xl group-hover:scale-110 transition-transform">{cat.icon || '📁'}</div>
              <div className="font-bold text-slate-900 text-sm">{cat.name}</div>
            </Link>
          ))}
        </div>
      </div>
    );
  }

  // View: Listings (Level 3)
  if (slug.length === 3) {
    return (
      <div className="max-w-7xl mx-auto p-6 lg:p-10 min-h-screen bg-slate-50">
        {renderBreadcrumbs()}
        
        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="w-full md:w-64 shrink-0 space-y-6">
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight capitalize mb-2">{sector.replace('-', ' ')}</h1>
              <p className="text-sm text-slate-500 capitalize">{mainType} / {businessType.replace('-', ' ')}</p>
            </div>
            
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-6">
              <div className="flex items-center gap-2 font-bold text-slate-900 pb-4 border-b border-slate-100">
                <Filter className="w-5 h-5" /> Filters
              </div>
              
              <div className="space-y-3">
                <label className="text-sm font-semibold text-slate-700">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input type="text" placeholder="Search in category..." className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-300 focus:border-blue-500 outline-none text-sm" />
                </div>
              </div>
              
              <div className="space-y-3">
                <label className="text-sm font-semibold text-slate-700">Price Range</label>
                <div className="flex items-center gap-2">
                  <input type="number" placeholder="Min" className="w-full px-3 py-2 rounded-lg border border-slate-300 outline-none text-sm" />
                  <span className="text-slate-400">-</span>
                  <input type="number" placeholder="Max" className="w-full px-3 py-2 rounded-lg border border-slate-300 outline-none text-sm" />
                </div>
              </div>
            </div>
          </div>

          {/* Listings Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1,2,3,4,5,6].map(i => (
                  <div key={i} className="bg-white rounded-2xl border border-slate-200 h-80 animate-pulse flex flex-col">
                    <div className="h-48 bg-slate-200 rounded-t-2xl"></div>
                    <div className="p-4 space-y-3">
                      <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                      <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : listings.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">No listings found</h3>
                <p className="text-slate-500">We couldn't find any active listings in the {sector} sector for {businessType.replace('-', ' ')}s.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {listings.map(item => (
                  <Link href={`/${mainType === 'services' ? 'service' : 'product'}/${item.id}`} key={item.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all overflow-hidden group flex flex-col">
                    <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
                      <img src={item.image || item.images?.[0] || 'https://via.placeholder.com/400x300'} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      {item.isB2B && (
                        <div className="absolute top-3 left-3 bg-blue-600 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md">B2B Wholesale</div>
                      )}
                    </div>
                    <div className="p-5 flex flex-col flex-1">
                      <div className="text-xs text-slate-500 mb-1">{item.seller}</div>
                      <h3 className="font-bold text-slate-900 text-lg leading-tight mb-2 line-clamp-2">{item.name}</h3>
                      <div className="mt-auto">
                        <div className="text-2xl font-black text-slate-900">₹{item.price?.toLocaleString()}</div>
                        {item.originalPrice > item.price && (
                          <div className="text-sm text-slate-400 line-through">₹{item.originalPrice?.toLocaleString()}</div>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return <div>Not found</div>;
}
