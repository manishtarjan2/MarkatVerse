"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useProducts, Product } from '@/context/ProductContext';
import { MapPin, Heart, Share2 } from 'lucide-react';

export default function ProductGrid({ products: propProducts, limit, category }: { products?: Product[], limit?: number, category?: string }) {
  const { products: contextProducts, userLocation } = useProducts();
  const router = useRouter();
  const [showLocationToast, setShowLocationToast] = useState(false);

  useEffect(() => {
    if (contextProducts.length > 0) setShowLocationToast(true);
    const timer = setTimeout(() => setShowLocationToast(false), 3000);
    return () => clearTimeout(timer);
  }, [contextProducts]);

  const items = propProducts || contextProducts;
  const productsToRender = [...(items || [])].filter(p => category ? p.category === category : true);

  // Sort by nearest (matching location first)
  productsToRender.sort((a, b) => {
    const aMatch = (a.location || '').toLowerCase().includes(userLocation.toLowerCase());
    const bMatch = (b.location || '').toLowerCase().includes(userLocation.toLowerCase());
    if (aMatch && !bMatch) return -1;
    if (!aMatch && bMatch) return 1;
    return 0;
  });

  // Limit items if specified
  const finalProducts = limit ? productsToRender.slice(0, limit) : productsToRender;

  if (finalProducts.length === 0) {
    return <div className="text-center p-10 text-slate-400">No products found.</div>;
  }

  return (
    <div className="relative">
      {showLocationToast && (
        <div className="absolute -top-12 right-0 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 shadow-sm z-10 border border-blue-200">
          <MapPin className="w-4 h-4 text-blue-600" />
          Showing nearest results to {userLocation}
        </div>
      )}
      <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-4">
      {finalProducts.map(product => {
        const isService = ['Services', 'Home Services', 'Transport', 'Rentals', 'Organizers'].includes(product.category);
        const route = isService ? `/service/${product.id}` : `/product/${product.id}`;
        return (
        <div key={product.id} onClick={() => router.push(route)} className="cursor-pointer no-underline text-inherit group">
          <div className="bg-white rounded-xl p-4 text-black relative h-full flex flex-col group-hover:-translate-y-1 transition-transform shadow-sm">
            {product.badge && (
              <div
                className={`absolute top-2.5 left-2.5 px-2 py-1 rounded text-[10px] font-medium uppercase z-10 ${product.badgeColor === 'badge-gold' ? 'bg-amber-500 text-black' : 'bg-red-500 text-white'}`}
              >
                {product.badge}
              </div>
            )}
            <div className="w-full h-[180px] bg-[#f1f5f9] rounded-lg mb-3 flex items-center justify-center overflow-hidden shrink-0 relative">
              {/* Quick Actions (Wishlist & Share) */}
              <div className="absolute top-2 right-2 z-20 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button 
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    // Add toast or state logic for wishlist here in the future
                    alert('Added to Wishlist!'); 
                  }} 
                  className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm text-slate-500 hover:text-red-500 hover:bg-red-50 transition-colors"
                  title="Add to Wishlist"
                >
                  <Heart className="w-4 h-4" />
                </button>
                <button 
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    const url = encodeURIComponent(`Check out ${product.name} on MarkatVerse: ${window.location.origin}${route}`);
                    window.open(`https://wa.me/?text=${url}`, '_blank');
                  }} 
                  className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm text-slate-500 hover:text-emerald-500 hover:bg-emerald-50 transition-colors"
                  title="Share on WhatsApp"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
              
              {product.image ? (
                <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              ) : (
                <span className="text-[40px] opacity-50">📸</span>
              )}
            </div>
            <div className="text-[11px] text-blue-600 uppercase tracking-[1px] font-medium flex items-center gap-1">
              <Link href={`/shop/${encodeURIComponent(product.seller.toLowerCase().replace(/ /g, '-'))}`} onClick={(e) => e.stopPropagation()} className="hover:underline">
                <span>{product.seller}</span>
              </Link>
              <span className="text-[#10B981] text-[10px]" title="TrustSEAL Verified">🛡️</span>
            </div>
            <div className="font-medium text-sm text-slate-800 mb-2 mt-1 line-clamp-2 h-10 leading-tight">
              {product.name}
            </div>
            <div className="mt-auto">
              <div className="font-bold text-base text-slate-900 flex items-center gap-2">
                ₹{product.price.toLocaleString('en-IN')}
                {product.originalPrice > product.price && (
                  <span className="text-[#94A3B8] line-through text-[10px] font-normal">₹{product.originalPrice.toLocaleString('en-IN')}</span>
                )}
                {product.discount && (
                  <span className="text-emerald-500 text-[10px] font-medium">{product.discount}</span>
                )}
              </div>
              <div className="flex justify-between items-center mt-3 text-[10px]">
                <span className="text-amber-500 font-normal">★ {product.rating} <span className="text-gray-500">({product.reviews})</span></span>
                <span className="text-gray-500">{product.location}</span>
              </div>
            </div>
          </div>
        </div>
        );
      })}
    </div>
    </div>
  );
}
