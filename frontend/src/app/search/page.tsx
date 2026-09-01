"use client";
import { useSearchParams } from 'next/navigation';
import { useProducts } from '@/context/ProductContext';
import ProductGrid from '@/components/ProductGrid';
import ServiceDirectoryList from '@/components/ServiceDirectoryList';
import { useState, useEffect, Suspense, useMemo } from 'react';

function SearchContent() {
  const searchParams = useSearchParams();
  const initialQ = searchParams.get('q') || '';
  const initialLoc = searchParams.get('loc') || '';
  const initialCat = searchParams.get('cat') || '';
  
  const { products } = useProducts();
  
  // Local filter states
  const [q, setQ] = useState(initialQ);
  const [selectedCategory, setSelectedCategory] = useState(initialCat === 'All Categories' ? '' : initialCat);
  const [priceRange, setPriceRange] = useState('all'); // all, under_500, 500_2000, over_2000
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState('recommended');
  const [locationFilter, setLocationFilter] = useState(initialLoc);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [b2bOnly, setB2BOnly] = useState(false);
  const [premiumOnly, setPremiumOnly] = useState(false);

  // Sync with URL if it changes
  useEffect(() => {
    setQ(searchParams.get('q') || '');
    const cat = searchParams.get('cat');
    if (cat && cat !== 'All Categories') setSelectedCategory(cat);
  }, [searchParams]);

  // Derived filtered products
  const filteredProducts = useMemo(() => {
    let result = products;
    
    // Search Query
    if (q) {
      result = result.filter(p => p.name.toLowerCase().includes(q.toLowerCase()) || p.seller.toLowerCase().includes(q.toLowerCase()));
    }
    
    // Location Filter (from text input)
    if (locationFilter) {
      result = result.filter(p => (p.location || '').toLowerCase().includes(locationFilter.toLowerCase()));
    }
    
    // Category Filter
    if (selectedCategory) {
      result = result.filter(p => p.category.toLowerCase() === selectedCategory.toLowerCase());
    }
    
    // Price Filter
    if (priceRange !== 'all') {
      result = result.filter(p => {
        if (priceRange === 'under_500') return p.price < 500;
        if (priceRange === '500_2000') return p.price >= 500 && p.price <= 2000;
        if (priceRange === 'over_2000') return p.price > 2000;
        return true;
      });
    }

    // Rating Filter
    if (minRating > 0) {
      result = result.filter(p => parseFloat(p.rating) >= minRating);
    }
    
    // Feature Toggles
    if (verifiedOnly) result = result.filter(p => !!p.badge);
    if (b2bOnly) result = result.filter(p => p.isB2B);
    if (premiumOnly) result = result.filter(p => p.isPremium);

    // Sorting
    result = [...result];
    if (sortBy === 'price_low') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price_high') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating));
    }
    
    return result;
  }, [q, locationFilter, selectedCategory, priceRange, minRating, verifiedOnly, b2bOnly, premiumOnly, sortBy, products]);

  // Get unique categories from products
  const availableCategories = Array.from(new Set(products.map(p => p.category)));

  return (
    <div className="max-w-[1400px] mx-auto p-5 min-h-[calc(100vh-80px)] bg-slate-50 flex flex-col md:flex-row gap-8">
      
      {/* Sidebar Filters */}
      <aside className="w-full md:w-[280px] shrink-0 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm self-start">
        <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
          <span>⚙️</span> Filters
        </h2>

        {/* Categories */}
        <div className="mb-8">
          <h3 className="text-sm font-semibold text-slate-900 mb-3 uppercase tracking-wide">Category</h3>
          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-3 cursor-pointer group">
              <input 
                type="radio" 
                name="category"
                checked={selectedCategory === ''} 
                onChange={() => setSelectedCategory('')}
                className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500" 
              />
              <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">All Categories</span>
            </label>
            {availableCategories.map(cat => (
              <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                <input 
                  type="radio" 
                  name="category"
                  checked={selectedCategory === cat} 
                  onChange={() => setSelectedCategory(cat)}
                  className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500" 
                />
                <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">{cat}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div className="mb-8">
          <h3 className="text-sm font-semibold text-slate-900 mb-3 uppercase tracking-wide">Price</h3>
          <div className="flex flex-col gap-2">
            {[
              { id: 'all', label: 'Any Price' },
              { id: 'under_500', label: 'Under ₹500' },
              { id: '500_2000', label: '₹500 - ₹2,000' },
              { id: 'over_2000', label: 'Over ₹2,000' },
            ].map(range => (
              <label key={range.id} className="flex items-center gap-3 cursor-pointer group">
                <input 
                  type="radio" 
                  name="price"
                  checked={priceRange === range.id} 
                  onChange={() => setPriceRange(range.id)}
                  className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500" 
                />
                <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">{range.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Ratings */}
        <div className="mb-8">
          <h3 className="text-sm font-semibold text-slate-900 mb-3 uppercase tracking-wide">Customer Rating</h3>
          <div className="flex flex-col gap-2">
            {[
              { val: 0, label: 'Any Rating' },
              { val: 4.5, label: '4.5 & up ⭐' },
              { val: 4.0, label: '4.0 & up ⭐' },
              { val: 3.0, label: '3.0 & up ⭐' },
            ].map(rating => (
              <label key={rating.val} className="flex items-center gap-3 cursor-pointer group">
                <input 
                  type="radio" 
                  name="rating"
                  checked={minRating === rating.val} 
                  onChange={() => setMinRating(rating.val)}
                  className="w-4 h-4 text-amber-500 border-slate-300 focus:ring-amber-500" 
                />
                <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">{rating.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Special Features */}
        <div className="mb-8">
          <h3 className="text-sm font-semibold text-slate-900 mb-3 uppercase tracking-wide">Features</h3>
          <div className="flex flex-col gap-3">
            <label className="flex items-center gap-3 cursor-pointer group">
              <input 
                type="checkbox" 
                checked={verifiedOnly} 
                onChange={(e) => setVerifiedOnly(e.target.checked)}
                className="w-4 h-4 text-emerald-500 border-slate-300 rounded focus:ring-emerald-500" 
              />
              <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">Verified Sellers Only</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer group">
              <input 
                type="checkbox" 
                checked={b2bOnly} 
                onChange={(e) => setB2BOnly(e.target.checked)}
                className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500" 
              />
              <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">B2B Wholesale Only</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer group">
              <input 
                type="checkbox" 
                checked={premiumOnly} 
                onChange={(e) => setPremiumOnly(e.target.checked)}
                className="w-4 h-4 text-purple-600 border-slate-300 rounded focus:ring-purple-500" 
              />
              <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">Premium Services Only</span>
            </label>
          </div>
        </div>

        {/* Location Filter */}
        <div className="mb-8">
          <h3 className="text-sm font-semibold text-slate-900 mb-3 uppercase tracking-wide">Location</h3>
          <input 
            type="text"
            placeholder="e.g. Mumbai, Delhi"
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="w-full p-2.5 text-sm border border-slate-300 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Clear Filters */}
        <button 
          onClick={() => {
            setSelectedCategory('');
            setPriceRange('all');
            setMinRating(0);
            setLocationFilter('');
            setVerifiedOnly(false);
            setB2BOnly(false);
            setPremiumOnly(false);
            setSortBy('recommended');
          }}
          className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-bold transition-colors"
        >
          Clear Filters
        </button>
      </aside>

      {/* Main Results Area */}
      <main className="flex-1">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Search Results</h1>
            <p className="text-slate-500 font-medium">
              {filteredProducts.length} results found
              {q && ` for "${q}"`}
            </p>
          </div>
          <div className="flex items-center gap-3 bg-white p-2 border border-slate-200 rounded-lg shadow-sm w-fit">
            <span className="text-sm text-slate-500 font-medium pl-2">Sort by:</span>
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="text-sm border-none outline-none bg-transparent font-semibold text-slate-800 cursor-pointer pr-4"
            >
              <option value="recommended">Recommended</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>
        
        {selectedCategory === 'Services' || selectedCategory === 'Home Services' ? (
          <ServiceDirectoryList products={filteredProducts} />
        ) : (
          <ProductGrid products={filteredProducts} />
        )}
      </main>

    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="p-10 text-slate-500 text-center font-medium">Loading search results...</div>}>
      <SearchContent />
    </Suspense>
  );
}
