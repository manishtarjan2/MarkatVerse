"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { MapPin, Star, Shield, Phone, Mail, Clock, CheckCircle } from 'lucide-react';

export default function PublicShopPage({ params }: { params: { id: string } }) {
  const shopName = decodeURIComponent(params.id).replace(/-/g, ' ');
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:3001/products')
      .then(res => res.json())
      .then(data => {
        // Find products belonging to this shop
        // If none found for exact name, just show some mock products for demonstration
        let shopProducts = data.filter((p: any) => (p.sellerName || 'Unknown').toLowerCase().includes(shopName.toLowerCase().split(' ')[0]));
        if (shopProducts.length === 0) {
          shopProducts = data.slice(0, 4);
        }
        setProducts(shopProducts);
        setIsLoading(false);
      });
  }, [shopName]);

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20">
      
      {/* Shop Cover Banner */}
      <div className="h-64 md:h-80 w-full bg-gradient-to-r from-slate-900 to-slate-800 relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-10 left-20 w-96 h-96 bg-blue-500 rounded-full blur-3xl mix-blend-overlay"></div>
          <div className="absolute bottom-10 right-20 w-96 h-96 bg-purple-500 rounded-full blur-3xl mix-blend-overlay"></div>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-10">
        
        {/* Shop Info Card */}
        <div className="bg-white/80 backdrop-blur-xl border border-white rounded-3xl p-6 md:p-10 shadow-xl shadow-slate-200/50 flex flex-col md:flex-row items-center md:items-start gap-8 mb-8">
          
          {/* Shop Logo */}
          <div className="w-32 h-32 md:w-40 md:h-40 bg-white rounded-2xl shadow-lg border-4 border-white flex items-center justify-center text-5xl font-bold text-blue-600 relative overflow-hidden shrink-0">
            {shopName.charAt(0).toUpperCase()}
          </div>

          {/* Shop Details */}
          <div className="flex-1 text-center md:text-left mt-2">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
              <h1 className="text-3xl font-bold text-slate-900 capitalize">{shopName}</h1>
              <span className="bg-blue-100 text-blue-700 p-1 rounded-full"><Shield className="w-5 h-5" /></span>
            </div>
            
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-slate-600 font-medium text-sm mb-4">
              <span className="flex items-center gap-1"><MapPin className="w-4 h-4 text-slate-400" /> New Delhi, India</span>
              <span className="flex items-center gap-1"><Star className="w-4 h-4 text-amber-500 fill-amber-500" /> 4.9 (1,240 Reviews)</span>
              <span className="flex items-center gap-1"><CheckCircle className="w-4 h-4 text-emerald-500" /> Verified Business</span>
            </div>
            
            <p className="text-slate-500 leading-relaxed max-w-2xl">
              Welcome to our official store on MarkatVerse! We specialize in providing high-quality services and products tailored to your needs. With over 5 years of excellence, we guarantee satisfaction and top-tier support.
            </p>
          </div>

          {/* Contact Actions */}
          <div className="flex flex-col gap-3 w-full md:w-auto shrink-0">
            <button className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all shadow-md shadow-blue-600/20 w-full flex items-center justify-center gap-2">
              <Phone className="w-4 h-4" /> Contact Seller
            </button>
            <button className="px-8 py-3 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl font-bold transition-all shadow-sm w-full flex items-center justify-center gap-2">
              <Mail className="w-4 h-4" /> Send Message
            </button>
          </div>
        </div>

        {/* Shop Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm text-center">
            <div className="text-sm text-slate-500 font-medium mb-1">Response Time</div>
            <div className="text-xl font-bold text-slate-900">&lt; 2 Hours</div>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm text-center">
            <div className="text-sm text-slate-500 font-medium mb-1">Items Sold</div>
            <div className="text-xl font-bold text-slate-900">5,000+</div>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm text-center">
            <div className="text-sm text-slate-500 font-medium mb-1">On-Time Delivery</div>
            <div className="text-xl font-bold text-emerald-600">98%</div>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm text-center">
            <div className="text-sm text-slate-500 font-medium mb-1">Member Since</div>
            <div className="text-xl font-bold text-slate-900">2021</div>
          </div>
        </div>

        {/* Products / Services Catalog */}
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Our Services & Products</h2>
        
        {isLoading ? (
          <div className="flex justify-center p-20">
            <div className="w-10 h-10 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <Link href={`/product/${product.id}`} key={product.id}>
                <div className="bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer h-full flex flex-col">
                  {/* Image Container */}
                  <div className="relative aspect-square w-full bg-slate-50 overflow-hidden">
                    {product.image ? (
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-300">
                        <Shield className="w-12 h-12" />
                      </div>
                    )}
                    {product.badge && (
                      <div className={`absolute top-4 left-4 px-3 py-1 bg-${product.badgeColor || 'blue'}-500 text-white text-xs font-bold rounded-full shadow-sm`}>
                        {product.badge}
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="font-bold text-slate-900 text-lg leading-tight mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {product.name}
                    </h3>
                    
                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex items-center bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded text-xs font-bold">
                        <Star className="w-3 h-3 fill-emerald-700 mr-1" />
                        {product.rating}
                      </div>
                      <span className="text-xs text-slate-400">({product.reviews})</span>
                    </div>

                    <div className="mt-auto">
                      <div className="flex items-baseline gap-2">
                        <span className="text-xl font-bold text-slate-900">
                          ₹{product.price.toLocaleString()}
                        </span>
                        {product.originalPrice && (
                          <span className="text-sm text-slate-400 line-through">
                            ₹{product.originalPrice.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
