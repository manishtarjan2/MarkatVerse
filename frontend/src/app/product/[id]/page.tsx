"use client";
import React, { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { useProducts } from '@/context/ProductContext';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ShieldCheck, Camera, Ruler, ZoomIn, Package, Star, Building2, MapPin, PhoneCall, CalendarClock } from 'lucide-react';

export default function ProductDetails() {
  const params = useParams();
  const id = params?.id as string;
  const { addToCart } = useCart();
  const { products } = useProducts();
  const [activeImage, setActiveImage] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rfqQuantity, setRfqQuantity] = useState(1);
  const [rfqMessage, setRfqMessage] = useState('');
  const [isElite, setIsElite] = useState(false);
  
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

  const submitRfq = async () => {
    try {
      const res = await fetch('http://localhost:3001/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          buyerId: 'demo-buyer-id', // Using a demo ID for now
          sellerId: 'demo-seller-id', // Using a demo ID for now
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
      
      {/* Mock Elite Toggle */}
      <div className="absolute top-6 right-6 z-10 flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl shadow-sm border border-slate-200">
        <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">Elite Buyer Mode:</span>
        <button 
          onClick={() => setIsElite(!isElite)}
          className={`w-12 h-6 rounded-full relative transition-colors shadow-inner ${isElite ? 'bg-amber-500' : 'bg-slate-300'}`}
        >
          <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 shadow-sm transition-all ${isElite ? 'left-[26px]' : 'left-0.5'}`} />
        </button>
      </div>
      
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
            <div className="text-4xl font-bold text-slate-900 flex items-center gap-3">
              {product.category === 'Organizers' ? (
                'Project Based'
              ) : (
                <>
                  ₹{(isElite && !['Services', 'Home Services', 'Organizers', 'Transport', 'Rentals', 'Subscriptions', 'B2B'].includes(product.category)) ? Math.round(product.price * 0.7).toLocaleString('en-IN') : product.price.toLocaleString('en-IN')}
                  {product.category === 'Transport' && <span className="text-lg text-slate-500 font-medium ml-1">/ km</span>}
                  {product.category === 'B2B' && <span className="text-lg text-slate-500 font-medium ml-1">/ unit</span>}
                  {isElite && !['Services', 'Home Services', 'Organizers', 'Transport', 'Rentals', 'Subscriptions', 'B2B'].includes(product.category) && (
                    <span className="text-sm text-amber-700 bg-amber-100 border border-amber-200 px-2 py-1 rounded-md font-bold tracking-tight">Wholesale Rate</span>
                  )}
                </>
              )}
            </div>
            {product.category === 'B2B' && (
              <div className="text-blue-600 font-bold mt-2 text-sm bg-blue-50 inline-block px-3 py-1.5 rounded-md border border-blue-100">
                Minimum Order Quantity (MOQ): 50 Units
              </div>
            )}
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
            
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              {product.category === 'Organizers' ? (
                <>
                  <button 
                    className="flex-1 px-6 py-4 bg-white border-2 border-slate-300 hover:border-indigo-500 hover:bg-indigo-50 text-slate-800 rounded-xl font-bold text-base transition-colors"
                    onClick={() => {
                      alert(`Requesting portfolio and quote from ${product.seller}...`);
                    }}
                  >
                    Request a Quote
                  </button>
                  <button 
                    className="flex-1 px-6 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-base transition-colors shadow-md shadow-indigo-600/20"
                    onClick={() => {
                      alert(`Connecting you directly with ${product.seller} to discuss your function.`);
                    }}
                  >
                    Contact Company
                  </button>
                </>
              ) : product.category === 'B2B' ? (
                <>
                  <button 
                    className="flex-1 px-6 py-4 bg-white border-2 border-slate-300 hover:border-blue-500 hover:bg-blue-50 text-slate-800 rounded-xl font-bold text-base transition-colors"
                    onClick={() => {
                      alert(`Contacting ${product.seller} for business inquiry...`);
                    }}
                  >
                    Contact Supplier
                  </button>
                  <button 
                    className="flex-1 px-6 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-base transition-colors shadow-md shadow-blue-600/20"
                    onClick={() => {
                      alert(`Requesting bulk quote for ${product.name}...`);
                    }}
                  >
                    Request Bulk Quote
                  </button>
                </>
              ) : product.category === 'Transport' ? (
                <div className="flex flex-col gap-3 w-full p-4 bg-blue-50 rounded-2xl border border-blue-100">
                  <div className="text-blue-800 font-bold text-sm mb-1">Plan Your Trip / Route</div>
                  <div className="flex flex-col gap-2">
                    <select className="w-full p-3 border border-blue-200 rounded-xl outline-none focus:border-blue-500 bg-white text-slate-700 shadow-sm font-medium">
                      <option value="">-- Select Preferred Vehicle --</option>
                      {product.id === 'heavy-freight-movers' ? (
                        <>
                          <option value="minitruck">Mini Truck (1 Ton)</option>
                          <option value="mediumtruck">Medium Truck (3-5 Tons)</option>
                          <option value="heavytruck">Heavy Freight Truck (10+ Tons)</option>
                          <option value="trailer">Trailer (20+ Tons)</option>
                        </>
                      ) : product.id === 'premium-suv-rental' ? (
                        <>
                          <option value="sedan">Premium Sedan (4 Seater)</option>
                          <option value="suv">Premium SUV (6 Seater)</option>
                          <option value="luxurysuv">Luxury SUV (7 Seater)</option>
                        </>
                      ) : (
                        <>
                          <option value="standard">Standard Vehicle</option>
                          <option value="premium">Premium Vehicle</option>
                        </>
                      )}
                    </select>
                    <div className="flex gap-2">
                      <div className="flex-1 bg-white border border-blue-200 rounded-xl flex items-center px-3 shadow-sm focus-within:border-blue-500">
                        <span className="text-slate-400">📍</span>
                        <input type="text" placeholder="Pickup Location" className="w-full p-3 outline-none text-slate-700 bg-transparent" />
                      </div>
                      <div className="flex-1 bg-white border border-blue-200 rounded-xl flex items-center px-3 shadow-sm focus-within:border-blue-500">
                        <span className="text-slate-400">🚩</span>
                        <input type="text" placeholder="Drop Location" className="w-full p-3 outline-none text-slate-700 bg-transparent" />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <input type="date" className="flex-1 p-3 border border-blue-200 rounded-xl outline-none focus:border-blue-500 text-slate-700 bg-white shadow-sm" />
                      <input type="time" className="flex-1 p-3 border border-blue-200 rounded-xl outline-none focus:border-blue-500 text-slate-700 bg-white shadow-sm" />
                    </div>
                  </div>
                  <div className="flex gap-3 mt-2">
                    <button 
                      className="flex-1 px-4 py-3 bg-white border-2 border-blue-200 hover:border-blue-500 hover:bg-blue-50 text-blue-700 rounded-xl font-bold text-sm transition-colors"
                      onClick={() => alert(`Requesting route estimate for ${product.name}...`)}
                    >
                      Get Estimate
                    </button>
                    <button 
                      className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm transition-colors shadow-md shadow-blue-600/20"
                      onClick={() => alert(`Booking transport service: ${product.name}`)}
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              ) : product.category === 'Rentals' ? (
                <div className="flex flex-col gap-3 w-full p-4 bg-purple-50 rounded-2xl border border-purple-100">
                  <div className="text-purple-800 font-bold text-sm mb-1">Schedule Your Rental</div>
                  <div className="flex flex-col gap-3">
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <label className="text-xs text-purple-600 font-semibold ml-1">Start Date</label>
                        <input type="date" className="w-full p-3 border border-purple-200 rounded-xl outline-none focus:border-purple-500 text-slate-700 bg-white shadow-sm mt-1" />
                      </div>
                      <div className="flex-1">
                        <label className="text-xs text-purple-600 font-semibold ml-1">End Date</label>
                        <input type="date" className="w-full p-3 border border-purple-200 rounded-xl outline-none focus:border-purple-500 text-slate-700 bg-white shadow-sm mt-1" />
                      </div>
                    </div>
                    <select className="w-full p-3 border border-purple-200 rounded-xl outline-none focus:border-purple-500 bg-white text-slate-700 shadow-sm">
                      <option value="daily">Daily Rental Rate</option>
                      <option value="weekly">Weekly Rental Rate (-10%)</option>
                      <option value="monthly">Monthly Rental Rate (-20%)</option>
                    </select>
                  </div>
                  <button 
                    className="w-full py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold text-lg transition-colors shadow-md shadow-purple-600/20 flex items-center justify-center gap-3 mt-1"
                    onClick={() => alert(`Calculating rent for ${product.name} and redirecting to booking...`)}
                  >
                    Calculate & Book Rental
                  </button>
                </div>
              ) : product.category === 'Subscriptions' ? (
                <div className="flex flex-col gap-3 w-full p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
                  <div className="text-indigo-800 font-bold text-sm mb-1">Select Billing Cycle</div>
                  <div className="flex flex-col gap-2">
                    <label className="flex items-center justify-between p-3 bg-white border-2 border-indigo-500 rounded-xl cursor-pointer">
                      <div className="flex items-center gap-3">
                        <input type="radio" name="billing" defaultChecked className="w-4 h-4 text-indigo-600 focus:ring-indigo-500" />
                        <span className="font-semibold text-slate-700">Monthly Retainer</span>
                      </div>
                      <span className="font-bold text-indigo-700">₹{product.price}/mo</span>
                    </label>
                    <label className="flex items-center justify-between p-3 bg-white border-2 border-transparent hover:border-indigo-200 rounded-xl cursor-pointer transition-colors">
                      <div className="flex items-center gap-3">
                        <input type="radio" name="billing" className="w-4 h-4 text-indigo-600 focus:ring-indigo-500" />
                        <div>
                          <span className="font-semibold text-slate-700 block">Annual Plan</span>
                          <span className="text-xs text-emerald-600 font-bold">Save 20%</span>
                        </div>
                      </div>
                      <span className="font-bold text-slate-500">₹{product.price * 12 * 0.8}/yr</span>
                    </label>
                  </div>
                  <button 
                    className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-lg transition-colors shadow-md shadow-indigo-600/20 flex items-center justify-center gap-3 mt-2"
                    onClick={() => alert(`Subscribing to ${product.name} on selected billing cycle!`)}
                  >
                    Subscribe Now
                  </button>
                  <button 
                    className="w-full py-2 bg-transparent text-indigo-700 hover:underline font-semibold text-sm transition-colors flex items-center justify-center gap-2 mt-1"
                    onClick={() => alert(`Contacting sales for Enterprise plan...`)}
                  >
                    Contact for Custom/Enterprise Plan
                  </button>
                </div>
              ) : product.category === 'Home Services' ? (
                product.isPremium ? (
                  <div className="flex flex-col gap-3 w-full p-4 bg-teal-50 rounded-2xl border border-teal-100">
                    <div className="text-teal-800 font-bold text-sm mb-1">Schedule Home Visit</div>
                    <div className="flex flex-col gap-2">
                      <textarea 
                        placeholder="Enter full service address..." 
                        className="w-full p-3 border border-teal-200 rounded-xl outline-none focus:border-teal-500 text-slate-700 bg-white shadow-sm resize-none" 
                        rows={2}
                      ></textarea>
                      <div className="flex gap-2">
                        <input type="date" className="flex-1 p-3 border border-teal-200 rounded-xl outline-none focus:border-teal-500 text-slate-700 bg-white shadow-sm" />
                        <select className="flex-1 p-3 border border-teal-200 rounded-xl outline-none focus:border-teal-500 bg-white text-slate-700 shadow-sm">
                          <option>Morning (9AM - 1PM)</option>
                          <option>Afternoon (1PM - 5PM)</option>
                          <option>Evening (5PM - 9PM)</option>
                        </select>
                      </div>
                    </div>
                    <button 
                      className="w-full py-4 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold text-lg transition-colors shadow-md shadow-teal-600/20 flex items-center justify-center gap-3 mt-1"
                      onClick={() => alert(`Technician visit requested! ${product.seller} will contact you for confirmation.`)}
                    >
                      <CalendarClock className="w-6 h-6" /> Request Technician
                    </button>
                    <button 
                      className="w-full py-2 bg-transparent text-teal-700 hover:underline font-semibold text-sm transition-colors flex items-center justify-center gap-2 mt-1"
                      onClick={() => alert(`Calling ${product.seller} at +91-9876543210 for an emergency visit!`)}
                    >
                      <PhoneCall className="w-4 h-4" /> Emergency / Quick Call
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3 w-full">
                    <button 
                      className="w-full py-4 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold text-lg transition-colors shadow-md shadow-teal-600/20 flex items-center justify-center gap-3"
                      onClick={() => alert(`Call ${product.seller} at +91-9876543210`)}
                    >
                      <PhoneCall className="w-6 h-6 animate-pulse" /> Call for Service (+91-9876543210)
                    </button>
                  </div>
                )
              ) : product.category === 'Services' ? (
                product.isPremium ? (
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
                      onClick={() => {
                        alert(`Calling ${product.seller} at +91-9876543210 for a bargain!`);
                      }}
                    >
                      <PhoneCall className="w-4 h-4" /> Prefer to Call? (+91-9876543210)
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3 w-full">
                    <button 
                      className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-lg transition-colors shadow-md shadow-emerald-600/20 flex items-center justify-center gap-3"
                      onClick={() => {
                        alert(`Call ${product.seller} at +91-9876543210`);
                      }}
                    >
                      <PhoneCall className="w-6 h-6 animate-pulse" /> Call to Book (+91-9876543210)
                    </button>
                  </div>
                )
              ) : product.category === 'Organizers' ? (
                <div className="flex flex-col gap-3 w-full p-4 bg-rose-50 rounded-2xl border border-rose-100">
                  <div className="text-rose-800 font-bold text-sm mb-1">Plan Your Event</div>
                  <div className="flex flex-col gap-2">
                    <select className="w-full p-3 border border-rose-200 rounded-xl outline-none focus:border-rose-500 bg-white text-slate-700 shadow-sm">
                      <option value="">Select Event Type</option>
                      <option value="wedding">Wedding / Reception</option>
                      <option value="corporate">Corporate Event</option>
                      <option value="party">Private Party</option>
                      <option value="other">Other</option>
                    </select>
                    <div className="flex gap-2">
                      <input type="date" className="flex-1 p-3 border border-rose-200 rounded-xl outline-none focus:border-rose-500 text-slate-700 bg-white shadow-sm" />
                      <input type="number" placeholder="Guest Count" className="flex-1 p-3 border border-rose-200 rounded-xl outline-none focus:border-rose-500 text-slate-700 bg-white shadow-sm" />
                    </div>
                  </div>
                  <button 
                    className="w-full py-4 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold text-lg transition-colors shadow-md shadow-rose-600/20 mt-1"
                    onClick={() => alert(`Requesting consultation with ${product.seller} for your event!`)}
                  >
                    Request Consultation
                  </button>
                </div>
              ) : product.category === 'B2B' ? (
                <div className="flex flex-col gap-3 w-full p-4 bg-amber-50 rounded-2xl border border-amber-200">
                  <div className="text-amber-900 font-bold text-sm mb-1">Wholesale & Enterprise Inquiry</div>
                  <div className="flex flex-col gap-2">
                    <div className="flex gap-2 items-center bg-white border border-amber-200 p-2 rounded-xl shadow-sm">
                      <label className="text-xs font-semibold text-slate-600 px-2 whitespace-nowrap">MOQ (Qty):</label>
                      <input type="number" defaultValue="100" min="10" className="flex-1 p-2 outline-none text-slate-800 font-bold bg-transparent" />
                    </div>
                    <button className="w-full p-3 bg-white border border-dashed border-amber-400 text-amber-700 rounded-xl font-medium hover:bg-amber-100 transition-colors text-sm text-left px-4 flex justify-between items-center">
                      <span>Upload Requirements (PDF/Doc)</span>
                      <span className="text-xl">📄</span>
                    </button>
                  </div>
                  <button 
                    className="w-full py-4 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold text-lg transition-colors shadow-md shadow-amber-500/20 mt-1 flex items-center justify-center gap-2"
                    onClick={() => setIsModalOpen(true)}
                  >
                    Request Bulk Quote
                  </button>
                  <button 
                    className="w-full py-2 bg-transparent text-amber-800 hover:underline font-semibold text-sm transition-colors mt-1"
                    onClick={() => alert(`Opening chat with supplier ${product.seller}...`)}
                  >
                    Chat with Supplier
                  </button>
                </div>
              ) : (
                <>
                  {isElite ? (
                    <div className="flex flex-col gap-4 w-full">
                      <div className="p-5 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl border border-amber-400 shadow-lg relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                        <div className="flex items-center justify-between mb-3 relative z-10">
                          <span className="bg-white text-amber-900 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-sm shadow-sm">Elite Member Access</span>
                        </div>
                        <div className="text-white font-bold text-xl mb-1 relative z-10 flex items-center gap-2">
                           <PhoneCall className="w-5 h-5" /> +91-9876543210
                        </div>
                        <div className="text-white/90 text-sm font-medium relative z-10 mb-4">Direct seller contact for wholesale (Min 10 units)</div>
                        <div className="flex gap-3 relative z-10">
                          <button 
                            className="flex-1 px-4 py-3 bg-white hover:bg-slate-50 text-amber-900 rounded-lg font-bold text-sm transition-colors shadow-md flex items-center justify-center gap-2"
                            onClick={() => alert(`Calling Seller for wholesale order...`)}
                          >
                            Call Supplier
                          </button>
                          <button 
                            className="flex-1 px-4 py-3 bg-transparent border-2 border-white/40 hover:bg-white/10 text-white rounded-lg font-bold text-sm transition-colors"
                            onClick={() => setIsModalOpen(true)}
                          >
                            Send Inquiry
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <>
                      <button 
                        className="flex-1 px-6 py-4 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold text-base transition-colors shadow-md shadow-amber-500/20"
                        onClick={() => {
                          alert(`Redirecting to Flipkart-style checkout for ${product.name}!`);
                        }}
                      >
                        Buy Now
                      </button>
                      <button 
                        className="flex-1 px-6 py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-base transition-colors shadow-md"
                        onClick={() => {
                          addToCart(product);
                          alert(`Added ${product.name} to cart!`);
                        }}
                      >
                        Add to Cart
                      </button>
                    </>
                  )}
                </>
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
