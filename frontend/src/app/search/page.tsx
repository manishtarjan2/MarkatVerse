"use client";
import { useSearchParams } from 'next/navigation';
import { useProducts } from '@/context/ProductContext';
import ProductGrid from '@/components/ProductGrid';
import { useState, useEffect, Suspense } from 'react';

function SearchContent() {
  const searchParams = useSearchParams();
  const q = searchParams.get('q') || '';
  const loc = searchParams.get('loc') || '';
  const cat = searchParams.get('cat') || '';
  
  const { products } = useProducts();
  const [filteredProducts, setFilteredProducts] = useState(products);

  useEffect(() => {
    let result = products;
    
    if (q) {
      result = result.filter(p => p.name.toLowerCase().includes(q.toLowerCase()) || p.seller.toLowerCase().includes(q.toLowerCase()));
    }
    if (loc) {
      result = result.filter(p => p.location.toLowerCase().includes(loc.toLowerCase()));
    }
    if (cat && cat !== 'All Categories') {
      result = result.filter(p => p.category.toLowerCase() === cat.toLowerCase());
    }
    
    setFilteredProducts(result);
  }, [q, loc, cat, products]);

  return (
    <div className="max-w-[1400px] mx-auto p-5 min-h-[calc(100vh-80px)] text-white">
      <h1 className="text-3xl font-medium mb-2">Search Results</h1>
      <p className="text-slate-400 mb-6">
        {filteredProducts.length} results found
        {q && ` for "${q}"`}
        {loc && ` in ${loc}`}
        {cat && cat !== 'All Categories' && ` under ${cat}`}
      </p>
      
      <ProductGrid products={filteredProducts} />
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="p-10 text-white text-center">Loading search results...</div>}>
      <SearchContent />
    </Suspense>
  );
}
