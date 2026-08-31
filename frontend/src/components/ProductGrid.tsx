"use client";
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useProducts, Product } from '@/context/ProductContext';

export default function ProductGrid({ products: propProducts }: { products?: Product[] }) {
  const { products: contextProducts } = useProducts();
  const router = useRouter();

  const productsToRender = propProducts || contextProducts.slice(0, 8);

  if (productsToRender.length === 0) {
    return <div className="text-center p-10 text-slate-400">No products found.</div>;
  }

  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-4">
      {productsToRender.map(product => (
        <div key={product.id} onClick={() => router.push(`/product/${product.id}`)} className="cursor-pointer no-underline text-inherit group">
          <div className="bg-white rounded-xl p-4 text-black relative h-full flex flex-col group-hover:-translate-y-1 transition-transform shadow-sm">
            {product.badge && (
              <div
                className={`absolute top-2.5 left-2.5 px-2 py-1 rounded text-[10px] font-medium uppercase z-10 ${product.badgeColor === 'badge-gold' ? 'bg-amber-500 text-black' : 'bg-red-500 text-white'
                  }`}
              >
                {product.badge}
              </div>
            )}
            <div className="w-full h-[180px] bg-[#f1f5f9] rounded-lg mb-3 flex items-center justify-center overflow-hidden shrink-0">
              {product.image ? (
                <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              ) : (
                <span className="text-[40px] opacity-50">📸</span>
              )}
            </div>
            <div className="text-[11px] text-blue-600 uppercase tracking-[1px] font-medium flex items-center gap-1">
              <Link href={`/seller/${encodeURIComponent(product.seller)}`} onClick={(e) => e.stopPropagation()} className="hover:underline">
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
      ))}
    </div>
  );
}
