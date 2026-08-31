"use client";
import React, { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { useProducts } from '@/context/ProductContext';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ShieldCheck, Camera, Ruler, ZoomIn, Package, Star, Building2, MapPin } from 'lucide-react';

export default function ProductDetails() {
  const params = useParams();
  const id = params?.id as string;
  const { addToCart } = useCart();
  const { products } = useProducts();
  const [activeImage, setActiveImage] = useState(0);
  
  const product = products.find(p => p.id === id);

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] p-10 bg-slate-50">
        <h1 className="text-2xl font-bold text-slate-800 mb-6">Product Not Found</h1>
        <Link href="/">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
            Go Back
          </button>
        </Link>
      </div>
    );
  }

  // Get related products from the same seller (excluding current product)
  const relatedProducts = products.filter(p => p.seller === product.seller && p.id !== product.id).slice(0, 4);
  // If no related products from the same seller, just show some random ones
  const displayedRelated = relatedProducts.length > 0 ? relatedProducts : products.filter(p => p.id !== product.id).slice(0, 4);

  // Mock multiple image variations using lucide icons/text placeholders
  const mockImages = [
    { icon: <Camera className="w-16 h-16 opacity-50 mb-4" strokeWidth={1.5} />, label: 'Front View', url: product.image },
    { icon: <Ruler className="w-16 h-16 opacity-50 mb-4" strokeWidth={1.5} />, label: 'Side View' },
    { icon: <ZoomIn className="w-16 h-16 opacity-50 mb-4" strokeWidth={1.5} />, label: 'Close Up' },
    { icon: <Package className="w-16 h-16 opacity-50 mb-4" strokeWidth={1.5} />, label: 'In Box' }
  ];

  return (
    <div className="max-w-[1400px] mx-auto p-6 lg:p-10 bg-white">
      
      {/* Top Section: Images and Details */}
      <div className="flex flex-col lg:flex-row gap-10">
        
        {/* Left: Product Image Gallery */}
        <div className="flex-1">
          {/* Main Image */}
          <div className="w-full h-[500px] bg-slate-50 rounded-2xl flex flex-col items-center justify-center text-slate-500 border border-slate-200 overflow-hidden shadow-sm">
            {mockImages[activeImage].url ? (
              <img src={mockImages[activeImage].url} alt={product.name} className="w-full h-full object-contain p-4" />
            ) : (
              <>
                {mockImages[activeImage].icon}
                <span className="text-lg font-medium">{mockImages[activeImage].label}</span>
              </>
            )}
          </div>
          
          {/* Thumbnails */}
          <div className="flex gap-4 mt-4">
            {mockImages.map((img, index) => (
              <div 
                key={index} 
                onClick={() => setActiveImage(index)}
                className={`w-20 h-20 bg-slate-50 rounded-xl cursor-pointer flex flex-col items-center justify-center border-2 transition-all overflow-hidden shadow-sm
                  ${activeImage === index ? 'border-blue-600 ring-2 ring-blue-100' : 'border-slate-200 hover:border-blue-300 opacity-70 hover:opacity-100'}
                `}
              >
                {img.url ? (
                  <img src={img.url} alt="thumbnail" className="w-full h-full object-cover" />
                ) : (
                  <div className="scale-50 text-slate-400">{img.icon}</div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right: Product Info & Seller Card */}
        <div className="flex-1">
          <div className="text-blue-600 uppercase tracking-widest text-xs font-bold mb-3">
            {product.seller}
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4 leading-tight">{product.name}</h1>
          
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <span className="text-amber-500 font-medium flex items-center gap-1">
              <Star className="w-4 h-4 fill-amber-500" /> {product.rating} <span className="text-slate-500 font-normal">({product.reviews} ratings)</span>
            </span>
          </div>

          <div className="p-6 bg-slate-50 rounded-2xl mb-8 border border-slate-200 shadow-sm">
            <div className="text-4xl font-bold text-slate-900">₹{product.price.toLocaleString('en-IN')}</div>
            {product.originalPrice > product.price && (
              <>
                <div className="text-slate-500 line-through mt-2 text-sm">M.R.P: ₹{product.originalPrice.toLocaleString('en-IN')}</div>
                <div className="text-emerald-600 font-bold mt-1 text-sm">You Save: {product.discount}</div>
              </>
            )}
            
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <button 
                className="flex-1 px-6 py-4 bg-white border-2 border-slate-300 hover:border-blue-500 hover:bg-blue-50 text-slate-800 rounded-xl font-bold text-base transition-colors"
                onClick={() => {
                  alert(`Quote request sent for ${product.name}!`);
                }}
              >
                Get Latest Price
              </button>
              <button 
                className="flex-1 px-6 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-base transition-colors shadow-md shadow-blue-600/20"
                onClick={() => {
                  addToCart(product);
                  alert(`Added ${product.name} to cart!`);
                }}
              >
                Add to Cart
              </button>
            </div>
          </div>

          <div className="mb-10">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Important Details</h3>
            <ul className="pl-5 text-slate-600 leading-loose list-disc">
              <li>Premium build quality with durable materials</li>
              <li>1 Year International Warranty included</li>
              <li>7 Days Replacement Policy available</li>
              <li>Free Express Shipping for Prime Members</li>
              <li>Cash on Delivery eligible in your location</li>
            </ul>
          </div>

          {/* Sold By - Company Details Card */}
          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-4">Sold by Company</div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0 border border-blue-100">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <Link href={`/seller/${encodeURIComponent(product.seller)}`} className="no-underline">
                    <div className="font-bold text-lg text-slate-900 hover:text-blue-600 transition-colors flex items-center gap-2">
                      {product.seller}
                      <span className="bg-emerald-100 text-emerald-700 border border-emerald-200 text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1 font-bold tracking-tight">
                        <ShieldCheck className="w-3 h-3" /> TrustSEAL Verified
                      </span>
                    </div>
                  </Link>
                  <div className="text-sm text-slate-500 mt-1 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" /> {product.location}
                  </div>
                </div>
              </div>
              <button className="px-5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg font-semibold text-sm transition-colors border border-slate-200 shrink-0">
                + Follow
              </button>
            </div>
            
            <div className="flex gap-10 mt-6 pt-6 border-t border-slate-100">
              <div>
                <div className="text-xs text-slate-500 font-medium mb-1">Seller Rating</div>
                <div className="font-bold text-amber-500 flex items-center gap-1">
                  4.9/5 <span className="text-slate-400 font-normal text-xs ml-1">(10k+ Reviews)</span>
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-500 font-medium mb-1">Active Since</div>
                <div className="font-bold text-slate-900">2021</div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Section: Related Products */}
      <div className="mt-20 pt-10 border-t border-slate-200">
        <h2 className="text-2xl font-bold text-slate-900 mb-8">More from {product.seller}</h2>
        
        <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-6">
          {displayedRelated.map(relatedItem => (
            <Link key={relatedItem.id} href={`/product/${relatedItem.id}`} className="no-underline group">
              <div className="p-4 bg-white rounded-xl border border-slate-200 hover:border-blue-400 transition-colors shadow-sm group-hover:shadow-md">
                <div className="h-48 bg-slate-50 rounded-lg flex items-center justify-center overflow-hidden mb-4 border border-slate-100">
                  {relatedItem.image ? (
                    <img src={relatedItem.image} alt={relatedItem.name} className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform" />
                  ) : (
                    <Camera className="w-10 h-10 text-slate-300" strokeWidth={1.5} />
                  )}
                </div>
                <div className="text-xs text-blue-600 font-bold uppercase tracking-widest mb-1">
                  {relatedItem.seller}
                </div>
                <div className="text-sm font-medium text-slate-800 mb-2 line-clamp-2 leading-tight">
                  {relatedItem.name}
                </div>
                <div className="text-lg font-bold text-slate-900">
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
