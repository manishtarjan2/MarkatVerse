"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useProducts } from '@/context/ProductContext';
import { Store, BarChart3, Package, PlusCircle, ArrowLeft, Trash2, Edit2, CheckCircle2 } from 'lucide-react';

export default function SellerDashboard() {
  const searchParams = useSearchParams();
  const isAdding = searchParams.get('action') === 'add';
  const [activeTab, setActiveTab] = useState(isAdding ? 'add' : 'overview');
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
      }, 2500);
    }, 1000);
  };

  const myListings = products.filter(p => p.seller === sellerName || p.seller === 'Apple Authorized India');

  return (
    <div className="min-h-screen w-full bg-slate-50 flex font-sans">
      
      {/* Sidebar */}
      <aside className="w-[280px] bg-white border-r border-slate-200 flex flex-col shrink-0">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <Link href="/" className="text-blue-600 flex items-center gap-2 hover:opacity-80 transition-opacity font-bold">
            <ArrowLeft className="w-5 h-5" /> Marketplace
          </Link>
        </div>
        
        <div className="p-6 text-center">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center text-3xl font-bold mx-auto mb-4 shadow-md shadow-blue-600/20">
            {sellerName.charAt(0)}
          </div>
          <h3 className="text-lg font-bold text-slate-900">{sellerName}</h3>
          <div className="flex items-center justify-center gap-1 text-emerald-600 text-sm font-medium mt-1">
            <CheckCircle2 className="w-4 h-4" /> Verified Seller
          </div>
        </div>
        
        <nav className="flex-1 px-4 py-2 space-y-1">
          <button 
            onClick={() => setActiveTab('overview')} 
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'overview' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
          >
            <BarChart3 className="w-5 h-5" /> Overview
          </button>
          <button 
            onClick={() => setActiveTab('listings')} 
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'listings' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
          >
            <Store className="w-5 h-5" /> My Listings
          </button>
          <button 
            onClick={() => setActiveTab('add')} 
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'add' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
          >
            <PlusCircle className="w-5 h-5" /> Add Product
          </button>
          <button 
            onClick={() => setActiveTab('orders')} 
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'orders' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
          >
            <Package className="w-5 h-5" /> Orders
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-10">
        
        {activeTab === 'overview' && (
          <div className="max-w-6xl mx-auto animate-in fade-in duration-300">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-slate-900">Dashboard Overview</h1>
              <p className="text-slate-500 mt-2">Welcome back, {sellerName}. Here's what's happening today.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <div className="text-slate-500 text-sm font-medium mb-2">Total Sales</div>
                <div className="text-3xl font-bold text-slate-900">₹1,45,200</div>
                <div className="text-emerald-600 text-sm font-medium mt-2 flex items-center gap-1">↑ 12% vs last month</div>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <div className="text-slate-500 text-sm font-medium mb-2">Active Listings</div>
                <div className="text-3xl font-bold text-slate-900">{myListings.length}</div>
                <div className="text-slate-400 text-sm font-medium mt-2">Live products</div>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <div className="text-slate-500 text-sm font-medium mb-2">Pending Orders</div>
                <div className="text-3xl font-bold text-amber-500">3</div>
                <div className="text-slate-400 text-sm font-medium mt-2 cursor-pointer hover:text-blue-600 transition-colors">View details →</div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'listings' && (
          <div className="max-w-6xl mx-auto animate-in fade-in duration-300">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-slate-900">My Listings</h1>
                <p className="text-slate-500 mt-2">Manage your active products and services.</p>
              </div>
              <button 
                onClick={() => setActiveTab('add')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold shadow-md shadow-blue-600/20 transition-colors flex items-center gap-2"
              >
                <PlusCircle className="w-5 h-5" /> Add New
              </button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {myListings.map(product => (
                <div key={product.id} className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm flex flex-col group">
                  <div className="h-48 bg-slate-100 flex items-center justify-center relative overflow-hidden">
                    {product.image ? (
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <Store className="w-12 h-12 text-slate-300" />
                    )}
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur text-blue-700 text-xs font-bold px-2.5 py-1 rounded-md shadow-sm">
                      {product.category || 'Uncategorized'}
                    </div>
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <div className="font-bold text-base text-slate-900 mb-2 line-clamp-2 leading-snug">{product.name}</div>
                    <div className="flex justify-between items-end mb-5 mt-auto">
                      <span className="text-xl font-bold text-slate-900">₹{product.price.toLocaleString('en-IN')}</span>
                      <span className="text-xs text-emerald-600 font-medium flex items-center gap-1.5 bg-emerald-50 px-2 py-1 rounded-md">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span> Active
                      </span>
                    </div>
                    <div className="flex gap-3">
                      <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg font-medium text-sm transition-colors">
                        <Edit2 className="w-4 h-4" /> Edit
                      </button>
                      <button 
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 border border-red-100 rounded-lg font-medium text-sm transition-colors"
                        onClick={() => {
                          if (confirm('Are you sure you want to delete this listing?')) {
                            deleteProduct(product.id);
                          }
                        }}
                      >
                        <Trash2 className="w-4 h-4" /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {myListings.length === 0 && (
                <div className="col-span-full py-16 text-center bg-white rounded-2xl border border-slate-200 shadow-sm">
                  <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Package className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">No listings yet</h3>
                  <p className="text-slate-500 mb-6">Start growing your business by adding your first product.</p>
                  <button 
                    onClick={() => setActiveTab('add')}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-bold transition-colors"
                  >
                    Add Product
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'add' && (
          <div className="max-w-3xl mx-auto animate-in fade-in duration-300">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-slate-900">Add New Product</h1>
              <p className="text-slate-500 mt-2">Create a new listing to start selling.</p>
            </div>
            
            {showSuccess ? (
              <div className="bg-emerald-50 border border-emerald-200 p-8 rounded-2xl text-center">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-emerald-800 mb-2">Product Published Successfully!</h3>
                <p className="text-emerald-600">Your product is now live on MarkatVerse. Redirecting to listings...</p>
              </div>
            ) : (
              <form onSubmit={handleAddProduct} className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Product Title</label>
                    <input 
                      required 
                      type="text" 
                      value={name} 
                      onChange={e => setName(e.target.value)} 
                      placeholder="E.g., Wireless Noise-Cancelling Headphones" 
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-slate-900" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Category</label>
                    <select 
                      required 
                      value={category} 
                      onChange={e => setCategory(e.target.value)} 
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all bg-white text-slate-900"
                    >
                      <option value="Electronics">Electronics</option>
                      <option value="Fashion">Fashion</option>
                      <option value="Home">Home & Garden</option>
                      <option value="Beauty">Beauty</option>
                      <option value="Automotive">Automotive</option>
                      <option value="B2B">B2B Wholesale</option>
                      <option value="Services">Services</option>
                      <option value="Transport">Transport</option>
                      <option value="Organizers">Organizers & Contractors</option>
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Selling Price (₹)</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">₹</span>
                      <input 
                        required 
                        type="number" 
                        value={price} 
                        onChange={e => setPrice(e.target.value)} 
                        placeholder="0.00" 
                        className="w-full pl-8 pr-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-slate-900" 
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Original M.R.P (₹) <span className="text-slate-400 font-normal">(Optional)</span></label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">₹</span>
                      <input 
                        type="number" 
                        value={originalPrice} 
                        onChange={e => setOriginalPrice(e.target.value)} 
                        placeholder="0.00" 
                        className="w-full pl-8 pr-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-slate-900" 
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Product Image URL <span className="text-slate-400 font-normal">(Optional)</span></label>
                  <input 
                    type="url" 
                    value={imageUrl} 
                    onChange={e => setImageUrl(e.target.value)} 
                    placeholder="https://example.com/image.jpg" 
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-slate-900" 
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Description</label>
                  <textarea 
                    rows={5} 
                    value={description} 
                    onChange={e => setDescription(e.target.value)} 
                    placeholder="Describe your product's key features, specifications, and benefits..." 
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-slate-900 resize-none"
                  ></textarea>
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-end">
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-xl font-bold shadow-md shadow-blue-600/20 transition-all disabled:opacity-70 flex items-center gap-2"
                  >
                    {isSubmitting ? 'Publishing...' : 'Publish Product'}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="max-w-6xl mx-auto animate-in fade-in duration-300">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-slate-900">Recent Orders</h1>
              <p className="text-slate-500 mt-2">Track and manage your customer orders.</p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-16 text-center">
              <div className="w-16 h-16 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">No active orders</h3>
              <p className="text-slate-500">When customers place orders for your products, they will appear here.</p>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
