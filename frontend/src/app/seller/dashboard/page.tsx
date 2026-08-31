"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useProducts } from '@/context/ProductContext';

export default function SellerDashboard() {
  const searchParams = useSearchParams();
  const isAdding = searchParams.get('action') === 'add';
  const [activeTab, setActiveTab] = useState(isAdding ? 'add' : 'listings');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const { addProduct, deleteProduct, products } = useProducts();

  // Form states
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Electronics');
  const [sellerName, setSellerName] = useState('Amit Verma');
  const [location, setLocation] = useState('New Delhi, Delhi');
  const [imageUrl, setImageUrl] = useState('');

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    setTimeout(() => {
      // Add to global context
      addProduct({
        id: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        name: name,
        price: parseFloat(price),
        originalPrice: parseFloat(originalPrice) || parseFloat(price),
        discount: originalPrice && parseFloat(originalPrice) > parseFloat(price) ? `${Math.round(((parseFloat(originalPrice) - parseFloat(price)) / parseFloat(originalPrice)) * 100)}% OFF` : '',
        rating: 'New',
        reviews: '0',
        seller: sellerName,
        location: location,
        category: category,
        image: imageUrl || undefined,
        badge: 'New Arrival',
        badgeColor: 'badge-gold'
      });

      setIsSubmitting(false);
      setShowSuccess(true);
      
      // Reset form
      setName('');
      setPrice('');
      setOriginalPrice('');
      setDescription('');
      setImageUrl('');

      setTimeout(() => {
        setShowSuccess(false);
        setActiveTab('listings');
      }, 3000);
    }, 1500);
  };

  // Filter listings to show only the ones the seller just added (for realism, we show all mock ones + user's ones, or just user's)
  // Let's just show all for the prototype, or we could filter by seller name.
  const myListings = products.filter(p => p.seller === sellerName || p.seller === 'Apple Authorized India');

  return (
    <div style={{ padding: '40px', width: '100%', maxWidth: '100%', margin: '0 auto', display: 'flex', gap: '30px', boxSizing: 'border-box' }}>
      
      {/* Sidebar */}
      <aside style={{ width: '250px' }}>
        <div style={{ backgroundColor: '#1E293B', padding: '20px', borderRadius: '12px' }}>
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#334155', margin: '0 auto 10px' }}></div>
            <h3>{sellerName}</h3>
            <div style={{ color: '#10B981', fontSize: '12px' }}>Verified Seller ✓</div>
          </div>
          
          <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <li 
              onClick={() => setActiveTab('overview')} 
              style={{ padding: '10px', backgroundColor: activeTab === 'overview' ? '#0F172A' : 'transparent', borderRadius: '8px', cursor: 'pointer' }}
            >
              📊 Overview
            </li>
            <li 
              onClick={() => setActiveTab('listings')} 
              style={{ padding: '10px', backgroundColor: activeTab === 'listings' ? '#0F172A' : 'transparent', borderRadius: '8px', cursor: 'pointer' }}
            >
              📋 My Listings
            </li>
            <li 
              onClick={() => setActiveTab('add')} 
              style={{ padding: '10px', backgroundColor: activeTab === 'add' ? '#0F172A' : 'transparent', borderRadius: '8px', cursor: 'pointer' }}
            >
              ➕ Add Product
            </li>
            <li 
              onClick={() => setActiveTab('orders')} 
              style={{ padding: '10px', backgroundColor: activeTab === 'orders' ? '#0F172A' : 'transparent', borderRadius: '8px', cursor: 'pointer' }}
            >
              📦 Orders
            </li>
          </ul>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, backgroundColor: '#1E293B', padding: '30px', borderRadius: '12px' }}>
        {activeTab === 'overview' && (
          <div>
            <h2 style={{ marginBottom: '20px' }}>Dashboard Overview</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
              <div style={{ backgroundColor: '#0F172A', padding: '20px', borderRadius: '8px' }}>
                <div style={{ color: '#94A3B8', fontSize: '14px' }}>Total Sales</div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#10B981' }}>₹1,45,200</div>
              </div>
              <div style={{ backgroundColor: '#0F172A', padding: '20px', borderRadius: '8px' }}>
                <div style={{ color: '#94A3B8', fontSize: '14px' }}>Active Listings</div>
                <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{myListings.length}</div>
              </div>
              <div style={{ backgroundColor: '#0F172A', padding: '20px', borderRadius: '8px' }}>
                <div style={{ color: '#94A3B8', fontSize: '14px' }}>Pending Orders</div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#F59E0B' }}>3</div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'listings' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2>My Listings</h2>
              <button className="btn-primary" onClick={() => setActiveTab('add')}>Add New Product</button>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
              {myListings.map(product => (
                <div key={product.id} style={{ backgroundColor: '#0F172A', borderRadius: '12px', overflow: 'hidden', border: '1px solid #334155', position: 'relative' }}>
                  <div style={{ height: '150px', backgroundColor: '#1E293B', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {product.image ? (
                      <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <span style={{ fontSize: '40px', opacity: 0.5 }}>📸</span>
                    )}
                  </div>
                  <div style={{ padding: '15px' }}>
                    <div style={{ color: '#10B981', fontSize: '12px', fontWeight: 'bold', marginBottom: '5px', display: 'inline-block', backgroundColor: 'rgba(16, 185, 129, 0.1)', padding: '4px 8px', borderRadius: '4px' }}>
                      {product.category || 'Uncategorized'}
                    </div>
                    <div style={{ fontWeight: 'bold', fontSize: '16px', marginBottom: '10px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{product.name}</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                      <span style={{ fontSize: '18px', fontWeight: 'bold' }}>₹{product.price.toLocaleString('en-IN')}</span>
                      <span style={{ fontSize: '12px', color: '#10B981', display: 'flex', alignItems: 'center', gap: '4px' }}><span style={{width:'8px', height:'8px', backgroundColor:'#10B981', borderRadius:'50%', display:'inline-block'}}></span> Active</span>
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button style={{ flex: 1, padding: '8px', backgroundColor: '#334155', border: 'none', color: 'white', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}>Edit</button>
                      <button style={{ flex: 1, padding: '8px', backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#EF4444', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }} onClick={() => {
                        if (confirm('Are you sure you want to delete this product?')) {
                          deleteProduct(product.id);
                        }
                      }}>Delete</button>
                    </div>
                  </div>
                </div>
              ))}
              {myListings.length === 0 && (
                <div style={{ gridColumn: '1 / -1', padding: '40px', textAlign: 'center', color: '#94A3B8', backgroundColor: '#0F172A', borderRadius: '12px' }}>
                  <div style={{ fontSize: '40px', marginBottom: '10px' }}>📦</div>
                  <div>No products found. Start by adding a new product!</div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'add' && (
          <div>
            <h2 style={{ marginBottom: '20px' }}>Add New Product</h2>
            {showSuccess ? (
              <div style={{ padding: '20px', backgroundColor: 'rgba(16, 185, 129, 0.2)', color: '#10B981', borderRadius: '8px', textAlign: 'center' }}>
                Product published successfully! Redirecting to listings...
              </div>
            ) : (
              <form onSubmit={handleAddProduct} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', gap: '20px' }}>
                  <div style={{ flex: 2 }}>
                    <label style={{ display: 'block', marginBottom: '8px', color: '#94A3B8' }}>Product Title</label>
                    <input required type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Enter product name" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #334155', backgroundColor: '#0F172A', color: 'white' }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: '8px', color: '#94A3B8' }}>Category</label>
                    <select required value={category} onChange={e => setCategory(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #334155', backgroundColor: '#0F172A', color: 'white' }}>
                      <option value="Electronics">Electronics</option>
                      <option value="Fashion">Fashion</option>
                      <option value="Home">Home & Garden</option>
                      <option value="Beauty">Beauty</option>
                      <option value="Automotive">Automotive</option>
                      <option value="B2B">B2B Wholesale</option>
                    </select>
                  </div>
                </div>
                
                <div style={{ display: 'flex', gap: '20px' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: '8px', color: '#94A3B8' }}>Selling Price (₹)</label>
                    <input required type="number" value={price} onChange={e => setPrice(e.target.value)} placeholder="0.00" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #334155', backgroundColor: '#0F172A', color: 'white' }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: '8px', color: '#94A3B8' }}>Original M.R.P (₹)</label>
                    <input type="number" value={originalPrice} onChange={e => setOriginalPrice(e.target.value)} placeholder="0.00" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #334155', backgroundColor: '#0F172A', color: 'white' }} />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '20px' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: '8px', color: '#94A3B8' }}>Seller Name</label>
                    <input required type="text" value={sellerName} onChange={e => setSellerName(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #334155', backgroundColor: '#0F172A', color: 'white' }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: '8px', color: '#94A3B8' }}>Seller Location</label>
                    <input required type="text" value={location} onChange={e => setLocation(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #334155', backgroundColor: '#0F172A', color: 'white' }} />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#94A3B8' }}>Product Image URL</label>
                  <input type="url" value={imageUrl} onChange={e => setImageUrl(e.target.value)} placeholder="https://example.com/image.jpg" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #334155', backgroundColor: '#0F172A', color: 'white' }} />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#94A3B8' }}>Description</label>
                  <textarea rows={5} value={description} onChange={e => setDescription(e.target.value)} placeholder="Describe your product..." style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #334155', backgroundColor: '#0F172A', color: 'white', resize: 'none' }}></textarea>
                </div>

                <button type="submit" className="btn-primary" disabled={isSubmitting}>
                  {isSubmitting ? 'Publishing...' : 'Publish Product'}
                </button>
              </form>
            )}
          </div>
        )}

      </main>
    </div>
  );
}
