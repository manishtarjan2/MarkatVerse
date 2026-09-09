"use client";
import React, { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { useProducts, useCategoryRules } from '@/context/ProductContext';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ShieldCheck, Camera, Ruler, ZoomIn, Package, Star, Building2, MapPin, PhoneCall, CalendarClock } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export default function ProductDetails() {
  const params = useParams();
  const id = params?.id as string;
  const { addToCart } = useCart();
  const { products } = useProducts();
  const { user, updateUserRole, login } = useAuth();
  const [activeImage, setActiveImage] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rfqQuantity, setRfqQuantity] = useState(1);
  const [bundleMultiplier, setBundleMultiplier] = useState(1);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const [rfqMessage, setRfqMessage] = useState('');
  
  const product = products.find(p => p.id === id);

  // ── Category Rules — from Admin Relationship Manager ──
  const rules = useCategoryRules(product?.category);
  const noRulesDefined = rules.allowedFeatures.length === 0;
  const hasProductStock    = rules.allows('Product Stock');
  const hasB2B             = rules.allows('B2B');
  const hasBulkPricing     = rules.allows('Bulk Pricing') || rules.allows('MOQ');
  const hasToken           = rules.allows('Token');
  const hasAppointment     = rules.allows('Appointment');
  const hasRFQ             = rules.allows('RFQ') || rules.allows('Quote');
  const hasMeeting         = rules.allows('Meeting') || rules.isOptional('Meeting');
  const hasVehicleTestDrive = rules.allows('Vehicle Test Drive');
  const hasService         = rules.allows('Service');

  // Initialize RFQ quantity and variants
  useEffect(() => {
    if (product?.category === 'B2B' || product?.category === 'Construction Materials') {
      setRfqQuantity(12);
    }
    
    if (product?.parameters) {
      const initialVariants: Record<string, string> = {};
      Object.keys(product.parameters).forEach(key => {
        if (product.parameters![key].length > 0) {
          initialVariants[key] = product.parameters![key][0];
        }
      });
      setSelectedVariants(initialVariants);
    }
  }, [product]);

  const printRate = (product?.originalPrice && product?.price && product.originalPrice > product.price) ? product.originalPrice : (product?.price || 0);
  let currentActivePrice = product?.price || 0;
  
  const isElite = user?.role === 'elite';
  const isRetail = noRulesDefined
    ? !['Services', 'Home Services', 'Organizers', 'Transport', 'Rentals', 'Subscriptions', 'B2B', 'Construction Materials'].includes(product?.category || '')
    : hasProductStock;
  const isWholesaleConfig = noRulesDefined
    ? (product?.category === 'B2B' || product?.category === 'Construction Materials' || (isRetail && isElite))
    : ((hasB2B && hasBulkPricing) || (isRetail && isElite));
  
  if (product) {
    if (isWholesaleConfig) {
      if (product.wholesaleTiers && product.wholesaleTiers.length > 0) {
        const sortedTiers = [...product.wholesaleTiers].sort((a, b) => b.minQty - a.minQty);
        const activeTier = sortedTiers.find(tier => rfqQuantity >= tier.minQty);
        if (activeTier) {
          currentActivePrice = Math.round(printRate * (1 - activeTier.margin / 100));
        } else {
          currentActivePrice = isRetail && isElite ? Math.round(product.price * 0.7) : printRate;
        }
      } else {
        // Fallback to defaults
        if (rfqQuantity >= 150) currentActivePrice = Math.round(printRate * 0.60); // 40% Margin
        else if (rfqQuantity >= 100) currentActivePrice = Math.round(printRate * 0.70); // 30% Margin
        else if (rfqQuantity >= 12) currentActivePrice = Math.round(printRate * 0.80); // 20% Margin
        else {
          currentActivePrice = isRetail && isElite ? Math.round(product.price * 0.7) : printRate;
        }
      }
    }
  }

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

  // Map actual images from product, falling back to mock structure if none exist
  const productImages = product.images && product.images.length > 0 
    ? product.images.map((img, i) => ({ url: img, label: `View ${i + 1}`, icon: <Camera className="w-16 h-16 opacity-50 mb-4" strokeWidth={1.5} /> }))
    : [
        { icon: <Camera className="w-16 h-16 opacity-50 mb-4" strokeWidth={1.5} />, label: 'Front View', url: product.image },
        { icon: <Ruler className="w-16 h-16 opacity-50 mb-4" strokeWidth={1.5} />, label: 'Side View' },
        { icon: <ZoomIn className="w-16 h-16 opacity-50 mb-4" strokeWidth={1.5} />, label: 'Close Up' },
        { icon: <Package className="w-16 h-16 opacity-50 mb-4" strokeWidth={1.5} />, label: 'In Box' }
      ];

  const submitRfq = async () => {
    if (!user) {
      alert("Please log in to request a quote.");
      return;
    }
    if (!product?.sellerId) {
      alert("Seller information not available.");
      return;
    }
    
    try {
      const res = await fetch(`${API_URL}/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          buyerId: user.id,
          sellerId: product.sellerId,
          productId: product.id,
          message: rfqMessage || `I am interested in ${product.name}. Please provide a quote.`,
          quantityRequested: rfqQuantity
        })
      });
      if (res.ok) {
        alert('Request for quotation sent successfully!');
        setIsModalOpen(false);
      } else {
        alert('Failed to send request.');
      }
    } catch (e) {
      console.error(e);
      alert('Error sending RFQ.');
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto p-6 lg:p-10 bg-white relative">
      
      {/* Elite Toggle removed for real auth */}
      
      {/* Top Section: Images and Details */}
      <div className="flex flex-col lg:flex-row gap-10">
        
        {/* Left: Product Image Gallery */}
        <div className="flex-1">
          {/* Main Image */}
          <div className="w-full h-[500px] bg-slate-50 rounded-2xl flex flex-col items-center justify-center text-slate-500 border border-slate-200 overflow-hidden shadow-sm">
            {productImages[activeImage]?.url ? (
              <img src={productImages[activeImage].url} alt={product.name} className="w-full h-full object-contain p-4" />
            ) : (
              <>
                {productImages[activeImage]?.icon}
                <span className="text-lg font-medium">{productImages[activeImage]?.label}</span>
              </>
            )}
          </div>
          
          {/* Thumbnails */}
          <div className="flex gap-4 mt-4 overflow-x-auto pb-2">
            {productImages.map((img, index) => (
              <div 
                key={index} 
                onClick={() => setActiveImage(index)}
                className={`w-20 h-20 shrink-0 bg-slate-50 rounded-xl cursor-pointer flex flex-col items-center justify-center border-2 transition-all overflow-hidden shadow-sm
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
          
          {/* Sold By - Company Details Card */}
          <div className="mt-8 p-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
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

            {isElite && (
              <div className="mt-6 pt-6 border-t border-slate-100">
                <div className="w-full bg-gradient-to-r from-amber-50 to-orange-50 p-4 rounded-xl border border-amber-200 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-amber-900 font-bold text-sm flex items-center gap-2">
                      <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                      Elite Member Privilege: Direct Seller Contact
                    </div>
                    <span className="bg-amber-100 text-amber-800 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded shadow-sm">Verified</span>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-6">
                    <div className="flex items-center gap-3 text-slate-800 font-medium">
                      <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                        <PhoneCall className="w-4 h-4" />
                      </div>
                      +91-9876543210
                    </div>
                    <div className="flex items-center gap-3 text-slate-800 font-medium">
                      <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 font-bold text-lg">
                        @
                      </div>
                      contact@{product.seller.toLowerCase().replace(/[^a-z0-9]/g, '')}.com
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
        </div>

        {/* Right: Product Info & Actions */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-3 text-xs font-bold uppercase tracking-widest">
            {product.brand && (
              <>
                <span className="text-slate-800">{product.brand}</span>
                <span className="text-slate-300">•</span>
              </>
            )}
            <span className="text-blue-600">{product.seller}</span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4 leading-tight">{product.name}</h1>
          
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <span className="text-amber-500 font-medium flex items-center gap-1">
              <Star className="w-4 h-4 fill-amber-500" /> {product.rating} <span className="text-slate-500 font-normal">({product.reviews} ratings)</span>
            </span>
          </div>

          <div className="p-6 bg-slate-50 rounded-2xl mb-8 border border-slate-200 shadow-sm">
            <div className="text-4xl font-bold text-slate-900 flex items-center gap-3">
              {product.category === 'Organizers' ? (
                'Project Based'
              ) : (
                <>
                  ₹{currentActivePrice.toLocaleString('en-IN')}
                  {product.category === 'Transport' && <span className="text-lg text-slate-500 font-medium ml-1">/ km</span>}
                  {isWholesaleConfig && <span className="text-lg text-slate-500 font-medium ml-1">/ unit</span>}
                  {isElite && isRetail && (
                    <span className="text-sm text-amber-700 bg-amber-100 border border-amber-200 px-2 py-1 rounded-md font-bold tracking-tight">Elite Rate</span>
                  )}
                </>
              )}
            </div>
            
            {isWholesaleConfig && (() => {
              const printRate = product.originalPrice > product.price ? product.originalPrice : product.price;
              
              return (
                <div className="mt-5 border border-blue-200 rounded-xl overflow-hidden shadow-sm">
                  <div className="bg-blue-50 px-4 py-3 text-sm font-bold text-blue-900 border-b border-blue-200 flex justify-between items-center">
                    <span>{isRetail ? 'Elite Wholesale Tiered Pricing' : 'Wholesale Tiered Pricing'}</span>
                    <span className="text-xs bg-white text-blue-700 px-2 py-1 rounded border border-blue-200">MOQ: 12 Units</span>
                  </div>
                  <div 
                    className="grid text-center divide-x divide-slate-200 bg-white" 
                    style={{ gridTemplateColumns: `repeat(${(product.wholesaleTiers ? product.wholesaleTiers.length : 3) + (isRetail && isElite ? 1 : 0)}, minmax(0, 1fr))` }}
                  >
                    {isRetail && isElite && (
                      <div 
                        onClick={() => {
                          setRfqQuantity(1);
                          setBundleMultiplier(1);
                        }}
                        className={`p-3 flex flex-col transition-colors cursor-pointer hover:bg-blue-50 ${rfqQuantity === 1 ? 'bg-blue-50/50 ring-2 ring-blue-500 ring-inset' : ''}`}
                      >
                        <span className="text-xs text-slate-500 font-bold mb-1">1 Unit (Retail)</span>
                        <span className="font-bold text-slate-800">₹{Math.round(product.price * 0.7).toLocaleString('en-IN')}</span>
                        <span className="text-[10px] text-amber-600 font-bold mt-1">30% Elite Discount</span>
                      </div>
                    )}
                    {product.wholesaleTiers && product.wholesaleTiers.length > 0 ? (
                      product.wholesaleTiers.map((tier, index) => {
                        const nextTier = product.wholesaleTiers![index + 1];
                        const isActive = rfqQuantity >= tier.minQty && (!nextTier || rfqQuantity < nextTier.minQty);
                        return (
                          <div 
                            key={index} 
                            onClick={() => {
                              setRfqQuantity(tier.minQty);
                              setBundleMultiplier(1);
                            }}
                            className={`p-3 flex flex-col transition-colors cursor-pointer hover:bg-blue-50 ${isActive ? 'bg-blue-50/50 ring-2 ring-blue-500 ring-inset' : ''}`}
                          >
                            <span className="text-xs text-slate-500 font-bold mb-1">
                              {tier.minQty}-Pack Bundle
                            </span>
                            <span className="font-bold text-slate-800">
                              ₹{Math.round(printRate * (1 - tier.margin / 100)).toLocaleString('en-IN')}
                            </span>
                            <span className="text-[10px] text-emerald-600 font-bold mt-1">
                              {tier.margin}% Margin on MRP
                            </span>
                          </div>
                        );
                      })
                    ) : (
                      <>
                        <div 
                          onClick={() => {
                            setRfqQuantity(12);
                            setBundleMultiplier(1);
                          }}
                          className={`p-3 flex flex-col transition-colors cursor-pointer hover:bg-blue-50 ${rfqQuantity === 12 ? 'bg-blue-50/50 ring-2 ring-blue-500 ring-inset' : ''}`}
                        >
                          <span className="text-xs text-slate-500 font-bold mb-1">12-Pack Bundle</span>
                          <span className="font-bold text-slate-800">₹{Math.round(printRate * 0.80).toLocaleString('en-IN')}</span>
                          <span className="text-[10px] text-emerald-600 font-bold mt-1">20% Margin on MRP</span>
                        </div>
                        <div 
                          onClick={() => {
                            setRfqQuantity(100);
                            setBundleMultiplier(1);
                          }}
                          className={`p-3 flex flex-col transition-colors cursor-pointer hover:bg-blue-50 ${rfqQuantity === 100 ? 'bg-blue-50/50 ring-2 ring-blue-500 ring-inset' : ''}`}
                        >
                          <span className="text-xs text-slate-500 font-bold mb-1">100-Pack Bundle</span>
                          <span className="font-bold text-slate-800">₹{Math.round(printRate * 0.70).toLocaleString('en-IN')}</span>
                          <span className="text-[10px] text-emerald-600 font-bold mt-1">30% Margin on MRP</span>
                        </div>
                        <div 
                          onClick={() => {
                            setRfqQuantity(150);
                            setBundleMultiplier(1);
                          }}
                          className={`p-3 flex flex-col transition-colors cursor-pointer hover:bg-blue-50 ${rfqQuantity === 150 ? 'bg-blue-50/50 ring-2 ring-blue-500 ring-inset' : ''}`}
                        >
                          <span className="text-xs text-slate-500 font-bold mb-1">150-Pack Bundle</span>
                          <span className="font-bold text-slate-800">₹{Math.round(printRate * 0.60).toLocaleString('en-IN')}</span>
                          <span className="text-[10px] text-emerald-600 font-bold mt-1">40% Margin on MRP</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              );
            })()}
            
            {product.originalPrice > product.price && product.category !== 'Organizers' && (
              <>
                <div className="text-slate-500 line-through mt-2 text-sm">
                  M.R.P: ₹{product.originalPrice.toLocaleString('en-IN')}
                  {product.category === 'Transport' && ' / km'}
                  {product.category === 'B2B' && ' / unit'}
                </div>
                <div className="text-emerald-600 font-bold mt-1 text-sm">You Save: {product.discount}</div>
              </>
            )}

            {(noRulesDefined ? !['Services', 'Home Services', 'Organizers', 'Transport', 'Rentals', 'Subscriptions', 'B2B', 'Construction Materials'].includes(product.category) : hasProductStock) && (
              <div className="mt-6 p-5 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 border border-amber-400 shadow-lg shadow-amber-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-2xl"></div>
                <div className="flex flex-col relative z-10">
                  <span className="font-extrabold text-white text-lg flex items-center gap-2 tracking-wide">
                    <Star className="w-5 h-5 fill-white text-white drop-shadow-md" /> MarkatVerse Elite
                  </span>
                  <span className="text-sm text-white/90 mt-1 font-medium">
                    {isElite ? '✓ Elite Active: You unlocked wholesale bulk pricing!' : 'Unlock wholesale tiered pricing & direct seller contact.'}
                  </span>
                </div>
                <button 
                  onClick={() => {
                    if (user && user.id) {
                      updateUserRole(user.id, isElite ? 'buyer' : 'elite');
                    } else {
                      login({ id: 'u4', name: 'Elite Buyer', phone: '8888888888', email: 'elite@example.com', role: 'elite', status: 'active' });
                    }
                  }}
                  className={`relative z-10 px-6 py-3 text-sm font-bold rounded-xl transition-all shadow-md shrink-0 ${isElite ? 'bg-white text-amber-700 hover:bg-slate-50' : 'bg-slate-900 text-white hover:bg-slate-800 hover:scale-105 border border-slate-700'}`}
                >
                  {isElite ? 'Elite Subscribed' : 'Join Elite Now'}
                </button>
              </div>
            )}
            
            {/* Dynamic Variant Selectors */}
            {product.parameters && Object.keys(product.parameters).length > 0 && (
              <div className="mt-8 space-y-6 pt-6 border-t border-slate-200">
                {Object.entries(product.parameters).map(([paramName, options]) => (
                  <div key={paramName}>
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-bold text-slate-800 text-sm uppercase tracking-wider">
                        {paramName}: <span className="text-blue-600 font-extrabold">{selectedVariants[paramName]}</span>
                      </span>
                      {paramName.toLowerCase().includes('size') && (
                        <button className="text-xs font-bold text-blue-600 hover:underline">Size Guide</button>
                      )}
                    </div>
                    
                    <div className={paramName.toLowerCase() === 'color' ? "flex gap-3" : "flex flex-wrap gap-3"}>
                      {options.map(option => {
                        const isSelected = selectedVariants[paramName] === option;
                        
                        // Special rendering for 'Color' variants
                        if (paramName.toLowerCase() === 'color') {
                          const hexMap: Record<string, string> = {
                            'white': '#f8fafc',
                            'black': '#0f172a',
                            'red': '#ef4444',
                            'blue': '#3b82f6',
                            'green': '#22c55e',
                            'grey': '#94a3b8',
                            'navy': '#1e3a8a',
                            'natural titanium': '#a3a3a3',
                            'blue titanium': '#334155',
                            'white titanium': '#f1f5f9',
                            'black titanium': '#1e293b',
                            'active black': '#09090b',
                            'cyan cider': '#06b6d4',
                            'navy blue': '#172554',
                            'olive green': '#3f6212',
                            'maroon': '#831843',
                            'silver': '#e2e8f0'
                          };
                          const colorHex = hexMap[option.toLowerCase()] || '#cbd5e1';
                          
                          return (
                            <button 
                              key={option} 
                              onClick={() => setSelectedVariants(prev => ({...prev, [paramName]: option}))}
                              className={`w-10 h-10 rounded-full border-2 transition-all shadow-sm ${isSelected ? 'border-blue-600 ring-2 ring-blue-100 scale-110' : 'border-slate-300 hover:scale-105'}`}
                              style={{ backgroundColor: colorHex }}
                              title={option}
                            />
                          );
                        }
                        
                        // Default pill rendering for other variants
                        return (
                          <button 
                            key={option}
                            onClick={() => setSelectedVariants(prev => ({...prev, [paramName]: option}))}
                            className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all border-2 ${isSelected ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-600/20' : 'bg-white text-slate-700 border-slate-200 hover:border-blue-300'}`}
                          >
                            {option}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {/* ── Workflow Badge ── */}
            {!noRulesDefined && rules.workflow && (
              <div className="mt-6 flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Workflow</span>
                <span className="text-xs bg-violet-50 text-violet-700 border border-violet-200 px-2.5 py-1 rounded-full font-semibold">{rules.workflow}</span>
                {rules.optionalFeatures.length > 0 && (
                  <>
                    <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest ml-3">Optional:</span>
                    {rules.optionalFeatures.map(f => (
                      <span key={f} className="text-xs bg-amber-50 text-amber-600 border border-amber-200 px-2.5 py-1 rounded-full font-semibold">{f}</span>
                    ))}
                  </>
                )}
              </div>
            )}

            <div className="mt-4 flex flex-col gap-4">

              {/* ── TOKEN BOOKING ── */}
              {hasToken && (
                <div className="flex flex-col gap-3 w-full p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                  <div className="text-emerald-800 font-bold text-sm mb-1">Pre-Book Your Token Online</div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input type="date" className="flex-1 p-3 border border-emerald-200 rounded-xl outline-none focus:border-emerald-500 text-slate-700 bg-white shadow-sm" />
                    <input type="time" className="flex-1 p-3 border border-emerald-200 rounded-xl outline-none focus:border-emerald-500 text-slate-700 bg-white shadow-sm" />
                    <select className="flex-[0.5] p-3 border border-emerald-200 rounded-xl outline-none focus:border-emerald-500 bg-white text-slate-700 shadow-sm">
                      <option value="1">1 Person</option>
                      <option value="2">2 People</option>
                      <option value="3">3 People</option>
                    </select>
                  </div>
                  <button
                    className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-lg transition-colors shadow-md shadow-emerald-600/20 flex items-center justify-center gap-3 mt-1"
                    onClick={() => {
                      const tokenNo = Math.floor(Math.random() * 50) + 10;
                      alert(`Success! Your pre-booking Token #${tokenNo} has been generated for ${product.seller}. Show this upon arrival.`);
                    }}
                  >
                    <CalendarClock className="w-6 h-6" /> Generate Pre-Booking Token
                  </button>
                  <button
                    className="w-full py-2 bg-transparent text-emerald-700 hover:underline font-semibold text-sm transition-colors flex items-center justify-center gap-2 mt-1"
                    onClick={() => alert(`Calling ${product.seller} at +91-9876543210`)}
                  >
                    <PhoneCall className="w-4 h-4" /> Prefer to Call? (+91-9876543210)
                  </button>
                </div>
              )}

              {/* ── APPOINTMENT BOOKING ── */}
              {hasAppointment && !hasToken && (
                <div className="flex flex-col gap-3 w-full p-4 bg-blue-50 rounded-2xl border border-blue-100">
                  <div className="text-blue-800 font-bold text-sm mb-1">Schedule an Appointment</div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input type="date" className="flex-1 p-3 border border-blue-200 rounded-xl outline-none focus:border-blue-500 text-slate-700 bg-white shadow-sm" />
                    <input type="time" className="flex-1 p-3 border border-blue-200 rounded-xl outline-none focus:border-blue-500 text-slate-700 bg-white shadow-sm" />
                  </div>
                  <button
                    className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-lg transition-colors shadow-md shadow-blue-600/20 flex items-center justify-center gap-3"
                    onClick={() => alert(`Appointment request sent to ${product.seller}! You will receive a confirmation shortly.`)}
                  >
                    <CalendarClock className="w-6 h-6" /> Book Appointment
                  </button>
                  <button
                    className="w-full py-2 bg-transparent text-blue-700 hover:underline font-semibold text-sm transition-colors flex items-center justify-center gap-2"
                    onClick={() => alert(`Calling ${product.seller} at +91-9876543210`)}
                  >
                    <PhoneCall className="w-4 h-4" /> Prefer to Call? (+91-9876543210)
                  </button>
                </div>
              )}

              {/* ── VEHICLE TEST DRIVE / ENQUIRY ── */}
              {hasVehicleTestDrive && (
                <div className="flex flex-col gap-3 w-full p-4 bg-red-50 rounded-2xl border border-red-100">
                  <div className="text-red-800 font-bold text-sm mb-1">Schedule a Test Drive / Enquiry</div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input type="date" className="flex-1 p-3 border border-red-200 rounded-xl outline-none focus:border-red-500 text-slate-700 bg-white shadow-sm" />
                    <input type="text" placeholder="Your Phone Number" className="flex-1 p-3 border border-red-200 rounded-xl outline-none focus:border-red-500 text-slate-700 bg-white shadow-sm" />
                  </div>
                  <div className="flex gap-3">
                    <button
                      className="flex-1 px-4 py-3 bg-white border-2 border-red-200 hover:border-red-500 hover:bg-red-50 text-red-700 rounded-xl font-bold text-sm transition-colors"
                      onClick={() => setIsModalOpen(true)}
                    >
                      Get Price Quote
                    </button>
                    <button
                      className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-sm transition-colors shadow-md shadow-red-600/20"
                      onClick={() => alert(`Test drive request sent to ${product.seller}! They will contact you to confirm.`)}
                    >
                      Schedule Test Drive
                    </button>
                  </div>
                </div>
              )}

              {/* ── WHOLESALE / B2B (tiers shown in price card above) ── */}
              {isWholesaleConfig && !hasToken && !hasAppointment && !hasVehicleTestDrive && (
                <div className="flex flex-col w-full gap-5">
                  <div className="flex flex-col sm:flex-row items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <div className="w-full sm:w-auto flex items-center shrink-0">
                      <span className="text-sm font-bold text-slate-600 mr-3">Bundle:</span>
                      <select
                        className="h-[48px] px-4 font-bold text-slate-800 bg-white border border-slate-300 rounded-xl outline-none focus:border-blue-500 cursor-pointer shadow-sm w-full sm:w-auto"
                        value={rfqQuantity}
                        onChange={(e) => { setRfqQuantity(parseInt(e.target.value)); setBundleMultiplier(1); }}
                      >
                        {isRetail && isElite && <option value={1}>1 Unit (Retail)</option>}
                        {product.wholesaleTiers && product.wholesaleTiers.length > 0 ? (
                          product.wholesaleTiers.map((tier, idx) => (
                            <option key={idx} value={tier.minQty}>{tier.minQty}-Pack Bundle</option>
                          ))
                        ) : (
                          <>
                            <option value={12}>12-Pack Bundle</option>
                            <option value={100}>100-Pack Bundle</option>
                            <option value={150}>150-Pack Bundle</option>
                          </>
                        )}
                      </select>
                    </div>
                    <div className="w-full sm:w-auto flex items-center sm:ml-4 shrink-0">
                      <span className="text-sm font-bold text-slate-600 mr-3">Qty:</span>
                      <div className="flex items-center bg-white border border-slate-300 rounded-xl h-[48px] overflow-hidden shadow-sm">
                        <button className="px-4 text-xl font-medium text-slate-500 hover:bg-slate-50 h-full transition-colors border-r border-slate-200" onClick={() => setBundleMultiplier(q => Math.max(1, q - 1))}>-</button>
                        <input type="number" min="1" className="w-16 text-center font-bold text-slate-800 outline-none border-none h-full bg-transparent p-0 m-0" value={bundleMultiplier} onChange={(e) => setBundleMultiplier(Math.max(1, parseInt(e.target.value) || 1))} />
                        <button className="px-4 text-xl font-medium text-slate-500 hover:bg-slate-50 h-full transition-colors border-l border-slate-200" onClick={() => setBundleMultiplier(q => q + 1)}>+</button>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4">
                    {isRetail && isElite ? (
                      <button
                        className="flex-1 px-6 py-4 bg-white border-2 border-slate-300 hover:border-amber-500 hover:bg-amber-50 text-slate-800 rounded-xl font-bold text-base transition-colors"
                        onClick={() => { addToCart(product); alert(`Added ${rfqQuantity} of ${product.name} to cart!`); }}
                      >
                        Add to Cart
                      </button>
                    ) : (
                      <button
                        className="flex-1 px-6 py-4 bg-white border-2 border-blue-600 hover:bg-blue-50 text-blue-700 rounded-xl font-bold text-base transition-colors"
                        onClick={() => setIsModalOpen(true)}
                      >
                        Contact Supplier
                      </button>
                    )}
                    <div className="flex-1 flex flex-col gap-2">
                      <button
                        className={`w-full px-6 py-4 text-white rounded-xl font-bold text-base transition-colors shadow-md ${isRetail && isElite ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/20' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/20'}`}
                        onClick={() => { if (isRetail && isElite) { alert(`Proceeding to checkout for ${rfqQuantity * bundleMultiplier} units...`); } else { setIsModalOpen(true); } }}
                      >
                        {isRetail && isElite ? 'Buy Wholesale Now' : 'Request Quote'}
                      </button>
                      <div className="text-sm font-bold text-slate-700 text-center bg-slate-100 rounded-lg py-3 mt-1 border border-slate-200">
                        Total Estimate: <span className={isRetail && isElite ? 'text-amber-600 ml-1 text-lg' : 'text-blue-700 ml-1 text-lg'}>&#8377;{(currentActivePrice * rfqQuantity * bundleMultiplier).toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ── RFQ / QUOTE (no wholesale tiers) ── */}
              {hasRFQ && !isWholesaleConfig && !hasToken && !hasAppointment && !hasVehicleTestDrive && (
                <div className="flex flex-col gap-3 w-full p-4 bg-amber-50 rounded-2xl border border-amber-200">
                  <div className="text-amber-900 font-bold text-sm mb-1">Request for Quotation</div>
                  <div className="flex gap-2 items-center bg-white border border-amber-200 p-2 rounded-xl shadow-sm">
                    <label className="text-xs font-semibold text-slate-600 px-2 whitespace-nowrap">Qty Needed:</label>
                    <input type="number" value={rfqQuantity} onChange={e => setRfqQuantity(parseInt(e.target.value) || 1)} min="1" className="flex-1 p-2 outline-none text-slate-800 font-bold bg-transparent" />
                  </div>
                  <textarea
                    value={rfqMessage}
                    onChange={e => setRfqMessage(e.target.value)}
                    placeholder="Describe your requirements, timeline, and any special needs..."
                    rows={2}
                    className="w-full p-3 border border-amber-200 rounded-xl outline-none focus:border-amber-500 text-slate-700 bg-white shadow-sm resize-none"
                  />
                  <button
                    className="w-full py-4 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold text-lg transition-colors shadow-md shadow-amber-500/20 mt-1"
                    onClick={submitRfq}
                  >
                    Send RFQ
                  </button>
                </div>
              )}

              {/* ── MEETING / PROPOSAL ── */}
              {hasMeeting && !hasToken && !hasAppointment && !hasVehicleTestDrive && !isWholesaleConfig && !hasRFQ && (
                <div className="flex flex-col gap-3 w-full p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
                  <div className="text-indigo-800 font-bold text-sm mb-1">Request a Meeting / Proposal</div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      className="flex-1 px-6 py-4 bg-white border-2 border-indigo-300 hover:border-indigo-500 hover:bg-indigo-50 text-indigo-800 rounded-xl font-bold text-base transition-colors"
                      onClick={() => alert(`Requesting portfolio and quote from ${product.seller}...`)}
                    >
                      Request a Quote
                    </button>
                    <button
                      className="flex-1 px-6 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-base transition-colors shadow-md shadow-indigo-600/20"
                      onClick={() => alert(`Connecting you with ${product.seller} to discuss your project.`)}
                    >
                      Schedule Meeting
                    </button>
                  </div>
                </div>
              )}

              {/* ── PRODUCT STOCK / RETAIL (Buy Now + Add to Cart) ── */}
              {(hasProductStock || noRulesDefined) && !hasToken && !hasAppointment && !hasVehicleTestDrive && !isWholesaleConfig && (
                <div className="flex flex-col sm:flex-row gap-4 w-full">
                  <button
                    className="flex-1 px-6 py-4 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold text-base transition-colors shadow-md shadow-amber-500/20"
                    onClick={() => alert(`Redirecting to checkout for ${product.name}!`)}
                  >
                    Buy Now
                  </button>
                  <button
                    className="flex-1 px-6 py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-base transition-colors shadow-md"
                    onClick={() => { addToCart(product); alert(`Added ${product.name} to cart!`); }}
                  >
                    Add to Cart
                  </button>
                </div>
              )}

              {/* ── SERVICE-ONLY FALLBACK (no other CTA applies) ── */}
              {hasService && !hasToken && !hasAppointment && !hasRFQ && !hasMeeting && !hasProductStock && !noRulesDefined && (
                <div className="flex flex-col gap-3 w-full">
                  <button
                    className="w-full py-4 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold text-lg transition-colors shadow-md shadow-teal-600/20 flex items-center justify-center gap-3"
                    onClick={() => alert(`Call ${product.seller} at +91-9876543210`)}
                  >
                    <PhoneCall className="w-6 h-6 animate-pulse" /> Call to Book (+91-9876543210)
                  </button>
                </div>
              )}

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

      {/* RFQ Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl relative">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              ✕
            </button>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Request Quote</h3>
            <p className="text-sm text-slate-500 mb-6">Send an inquiry directly to {product.seller}</p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Required Quantity</label>
                <input 
                  type="number" 
                  value={rfqQuantity}
                  onChange={(e) => setRfqQuantity(parseInt(e.target.value) || 1)}
                  min={product.moq || 1}
                  className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:border-blue-500" 
                />
                {product.moq && <p className="text-xs text-amber-600 mt-1">Minimum Order Quantity is {product.moq}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Message / Requirements</label>
                <textarea 
                  value={rfqMessage}
                  onChange={(e) => setRfqMessage(e.target.value)}
                  placeholder="Describe your requirements, customisation needs, etc."
                  className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:border-blue-500 h-32 resize-none"
                />
              </div>
              <button 
                onClick={submitRfq}
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-lg transition-colors shadow-md"
              >
                Send Request
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
