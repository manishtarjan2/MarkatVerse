"use client";
import React, { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { useProducts } from '@/context/ProductContext';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function ProductDetails() {
  const params = useParams();
  const id = params?.id as string;
  const { addToCart } = useCart();
  const { products } = useProducts();
  const [activeImage, setActiveImage] = useState(0);
  
  const product = products.find(p => p.id === id);

  if (!product) {
    return <div style={{ padding: '40px', textAlign: 'center' }}><h1>Product Not Found</h1><Link href="/"><button className="btn-primary" style={{marginTop: '20px'}}>Go Back</button></Link></div>;
  }

  // Get related products from the same seller (excluding current product)
  const relatedProducts = products.filter(p => p.seller === product.seller && p.id !== product.id).slice(0, 4);
  // If no related products from the same seller, just show some random ones
  const displayedRelated = relatedProducts.length > 0 ? relatedProducts : products.filter(p => p.id !== product.id).slice(0, 4);

  // Mock multiple image variations using emoji/text placeholders
  const mockImages = [
    { icon: '📸', label: 'Front View', url: product.image },
    { icon: '📐', label: 'Side View' },
    { icon: '🔍', label: 'Close Up' },
    { icon: '📦', label: 'In Box' }
  ];

  return (
    <div style={{ padding: '40px', width: '100%', margin: '0 auto', maxWidth: '100%' }}>
      
      {/* Top Section: Images and Details */}
      <div style={{ display: 'flex', gap: '40px' }}>
        
        {/* Left: Product Image Gallery */}
        <div style={{ flex: 1 }}>
          {/* Main Image */}
          <div style={{ width: '100%', height: '500px', backgroundColor: '#1E293B', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#64748B', border: '1px solid #334155', overflow: 'hidden' }}>
            {mockImages[activeImage].url ? (
              <img src={mockImages[activeImage].url} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <>
                <span style={{ fontSize: '80px', opacity: 0.5, marginBottom: '20px' }}>{mockImages[activeImage].icon}</span>
                <span style={{ fontSize: '18px' }}>{mockImages[activeImage].label}</span>
              </>
            )}
          </div>
          
          {/* Thumbnails */}
          <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
            {mockImages.map((img, index) => (
              <div 
                key={index} 
                onClick={() => setActiveImage(index)}
                style={{ 
                  width: '80px', 
                  height: '80px', 
                  backgroundColor: '#1E293B', 
                  borderRadius: '8px', 
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px',
                  border: activeImage === index ? '2px solid var(--accent-gold)' : '1px solid #334155',
                  opacity: activeImage === index ? 1 : 0.6,
                  overflow: 'hidden'
                }}
              >
                {img.url ? (
                  <img src={img.url} alt="thumbnail" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  img.icon
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right: Product Info & Seller Card */}
        <div style={{ flex: 1 }}>
          <div style={{ color: 'var(--accent-blue)', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '14px', fontWeight: 'bold', marginBottom: '8px' }}>
            {product.seller}
          </div>
          <h1 style={{ fontSize: '32px', marginBottom: '10px' }}>{product.name}</h1>
          
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
            <span style={{ color: '#F59E0B' }}>★ {product.rating} ({product.reviews} ratings)</span>
          </div>

          <div style={{ padding: '20px', backgroundColor: '#1E293B', borderRadius: '12px', marginBottom: '30px' }}>
            <div style={{ fontSize: '36px', fontWeight: 'bold' }}>₹{product.price.toLocaleString('en-IN')}</div>
            {product.originalPrice > product.price && (
              <>
                <div style={{ color: '#94A3B8', textDecoration: 'line-through', marginTop: '4px' }}>M.R.P: ₹{product.originalPrice.toLocaleString('en-IN')}</div>
                <div style={{ color: '#EF4444', fontWeight: 'bold', marginTop: '4px' }}>You Save: {product.discount}</div>
              </>
            )}
            
            <div style={{ marginTop: '20px', display: 'flex', gap: '16px' }}>
              <button 
                className="btn-primary" 
                style={{ flex: 1, padding: '16px', fontSize: '18px' }}
                onClick={() => {
                  alert(`Quote request sent for ${product.name}!`);
                }}
              >
                Get Latest Price 📉
              </button>
              <button 
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg border-none cursor-pointer transition-colors" 
                style={{ flex: 1, padding: '16px', fontSize: '18px' }}
                onClick={() => {
                  addToCart(product);
                  alert(`Added ${product.name} to cart!`);
                }}
              >
                Add to Cart 🛒
              </button>
            </div>
          </div>

          <div style={{ marginBottom: '30px' }}>
            <h3 style={{ marginBottom: '10px' }}>Important Details</h3>
            <ul style={{ paddingLeft: '20px', color: '#CBD5E1', lineHeight: '1.8' }}>
              <li>Premium build quality with durable materials</li>
              <li>1 Year International Warranty included</li>
              <li>7 Days Replacement Policy available</li>
              <li>Free Express Shipping for Prime Members</li>
              <li>Cash on Delivery eligible in your location</li>
            </ul>
          </div>

          {/* Sold By - Company Details Card */}
          <div style={{ padding: '20px', backgroundColor: '#0F172A', borderRadius: '12px', border: '1px solid #334155' }}>
            <div style={{ fontSize: '12px', color: '#94A3B8', marginBottom: '10px' }}>Sold by Company</div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <div style={{ width: '50px', height: '50px', backgroundColor: '#1E293B', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
                  🏢
                </div>
                <div>
                  <Link href={`/seller/${encodeURIComponent(product.seller)}`} style={{ textDecoration: 'none' }}>
                    <div style={{ fontWeight: 'bold', fontSize: '18px', color: 'var(--accent-blue)', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                      {product.seller}
                      <span style={{ backgroundColor: '#10B981', color: '#fff', fontSize: '10px', padding: '2px 6px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span style={{ fontSize: '12px' }}>🛡️</span> TrustSEAL Verified
                      </span>
                    </div>
                  </Link>
                  <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '4px' }}>📍 {product.location}</div>
                </div>
              </div>
              <button className="btn-outline" style={{ padding: '8px 16px', fontSize: '14px' }}>+ Follow</button>
            </div>
            <div style={{ display: 'flex', gap: '30px', marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #334155' }}>
              <div>
                <div style={{ fontSize: '12px', color: '#94A3B8' }}>Seller Rating</div>
                <div style={{ fontWeight: 'bold', color: '#F59E0B' }}>4.9/5 (10k+ Reviews)</div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: '#94A3B8' }}>Active Since</div>
                <div style={{ fontWeight: 'bold' }}>2021</div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Section: Related Products */}
      <div style={{ marginTop: '60px', paddingTop: '40px', borderTop: '1px solid #334155' }}>
        <h2 style={{ marginBottom: '20px' }}>More from {product.seller}</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '20px' }}>
          {displayedRelated.map(relatedItem => (
            <Link key={relatedItem.id} href={`/product/${relatedItem.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="product-card" style={{ padding: '15px' }}>
                <div className="product-image" style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#1E293B', borderRadius: '8px', overflow: 'hidden' }}>
                  {relatedItem.image ? (
                    <img src={relatedItem.image} alt={relatedItem.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <span style={{ fontSize: '30px', opacity: 0.5 }}>📸</span>
                  )}
                </div>
                <div style={{ fontSize: '10px', color: 'var(--accent-blue)', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '10px', fontWeight: 'bold' }}>
                  {relatedItem.seller}
                </div>
                <div className="product-title" style={{ fontSize: '14px', marginTop: '4px' }}>{relatedItem.name}</div>
                <div className="product-price" style={{ fontSize: '16px' }}>
                  ₹{relatedItem.price.toLocaleString('en-IN')}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

    </div>
  );
}
