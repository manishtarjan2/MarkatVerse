"use client";
import React from 'react';
import { useParams } from 'next/navigation';
import { useProducts } from '@/context/ProductContext';
import Link from 'next/link';

export default function SellerStorefront() {
  const params = useParams();
  const sellerNameRaw = params?.sellerName as string;
  const sellerName = sellerNameRaw ? decodeURIComponent(sellerNameRaw) : '';
  
  const { products } = useProducts();
  const sellerProducts = products.filter(p => p.seller === sellerName);

  return (
    <div style={{ padding: '40px', width: '100%', maxWidth: '100%', margin: '0 auto', boxSizing: 'border-box' }}>
      {/* Storefront Header */}
      <div style={{ backgroundColor: '#1E293B', padding: '40px', borderRadius: '12px', border: '1px solid #334155', marginBottom: '40px', display: 'flex', alignItems: 'center', gap: '30px' }}>
        <div style={{ width: '100px', height: '100px', backgroundColor: '#0F172A', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px', border: '2px solid #334155' }}>
          🏢
        </div>
        <div>
          <h1 style={{ fontSize: '36px', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            {sellerName}
            <span style={{ backgroundColor: '#10B981', color: '#fff', fontSize: '14px', padding: '4px 10px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ fontSize: '16px' }}>🛡️</span> TrustSEAL Verified
            </span>
          </h1>
          <div style={{ color: '#94A3B8', fontSize: '16px', display: 'flex', gap: '20px' }}>
            <span>⭐ 4.9/5 Rating</span>
            <span>📍 India</span>
            <span>📦 {sellerProducts.length} Products</span>
          </div>
        </div>
        <div style={{ marginLeft: 'auto' }}>
          <button className="btn-primary" style={{ padding: '12px 24px', fontSize: '16px', marginRight: '15px' }}>Contact Seller</button>
          <button className="btn-outline" style={{ padding: '12px 24px', fontSize: '16px' }}>+ Follow</button>
        </div>
      </div>

      <h2 style={{ marginBottom: '20px' }}>All Products from {sellerName}</h2>

      {sellerProducts.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '30px' }}>
          {sellerProducts.map(product => (
            <Link key={product.id} href={`/product/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="product-card" style={{ padding: '15px' }}>
                <div className="product-image" style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#1E293B', borderRadius: '8px', overflow: 'hidden' }}>
                  {product.image ? (
                    <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <span style={{ fontSize: '40px', opacity: 0.5 }}>📸</span>
                  )}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--accent-blue)', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '15px', fontWeight: 'bold' }}>
                  {product.category || 'Uncategorized'}
                </div>
                <div className="product-title" style={{ marginTop: '8px', fontSize: '18px' }}>{product.name}</div>
                <div className="product-price" style={{ marginTop: '10px', fontSize: '20px' }}>
                  ₹{product.price.toLocaleString('en-IN')}
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div style={{ padding: '60px', textAlign: 'center', backgroundColor: '#1E293B', borderRadius: '12px', color: '#94A3B8' }}>
          <div style={{ fontSize: '60px', marginBottom: '20px' }}>📦</div>
          <h3>No products found for this seller.</h3>
        </div>
      )}
    </div>
  );
}
