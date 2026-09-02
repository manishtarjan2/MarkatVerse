"use client";
import React, { useState } from 'react';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import { MapPin, CreditCard, CheckCircle2, ChevronRight, Lock, Package, ArrowRight, Smartphone, Banknote, Building2 } from 'lucide-react';

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart();
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'cod'>('card');

  if (items.length === 0 && step !== 3) {
    return (
      <div className="min-h-[calc(100vh-80px)] bg-slate-50 flex items-center justify-center p-6">
        <div className="bg-white p-10 rounded-3xl shadow-sm border border-slate-200 text-center max-w-md w-full">
          <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Package className="w-10 h-10 text-blue-500" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Your Cart is Empty</h2>
          <p className="text-slate-500 mb-8">Looks like you haven't added anything to your cart yet.</p>
          <Link href="/">
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-6 rounded-xl transition-colors shadow-lg shadow-blue-500/20">
              Continue Shopping
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const handlePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      clearCart();
      setStep(3); // Success step
    }, 2000);
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-slate-50 py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* Secure Checkout Header */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <Lock className="w-5 h-5 text-emerald-500" />
          <h1 className="text-2xl font-bold text-slate-800">Secure Checkout</h1>
        </div>

        {/* Stepper */}
        <div className="flex items-center justify-center max-w-2xl mx-auto mb-10 relative">
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-200 -z-10 rounded-full -translate-y-1/2 mx-12"></div>
          <div className={`absolute top-1/2 left-0 h-1 bg-blue-600 -z-10 rounded-full -translate-y-1/2 mx-12 transition-all duration-500 ${step === 1 ? 'w-0' : step === 2 ? 'w-1/2' : 'w-full'}`}></div>
          
          <div className="flex justify-between w-full">
            <div className="flex flex-col items-center gap-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors shadow-sm ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-white text-slate-400 border-2 border-slate-200'}`}>
                {step > 1 ? <CheckCircle2 className="w-6 h-6" /> : '1'}
              </div>
              <span className={`text-xs font-bold ${step >= 1 ? 'text-blue-600' : 'text-slate-400'}`}>Shipping</span>
            </div>
            
            <div className="flex flex-col items-center gap-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors shadow-sm ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-white text-slate-400 border-2 border-slate-200'}`}>
                {step > 2 ? <CheckCircle2 className="w-6 h-6" /> : '2'}
              </div>
              <span className={`text-xs font-bold ${step >= 2 ? 'text-blue-600' : 'text-slate-400'}`}>Payment</span>
            </div>
            
            <div className="flex flex-col items-center gap-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors shadow-sm ${step >= 3 ? 'bg-emerald-500 text-white' : 'bg-white text-slate-400 border-2 border-slate-200'}`}>
                {step === 3 ? <CheckCircle2 className="w-6 h-6" /> : '3'}
              </div>
              <span className={`text-xs font-bold ${step >= 3 ? 'text-emerald-500' : 'text-slate-400'}`}>Complete</span>
            </div>
          </div>
        </div>

        {step < 3 && (
          <div className="flex flex-col lg:flex-row gap-8">
            
            {/* Left Column: Form */}
            <div className="flex-[2] animate-in slide-in-from-right-4 fade-in duration-300">
              
              {step === 1 && (
                <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200">
                  <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-blue-600" /> Delivery Address
                  </h2>
                  
                  <div className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">First Name</label>
                        <input type="text" defaultValue="Amit" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Last Name</label>
                        <input type="text" defaultValue="Verma" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all" />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Street Address</label>
                      <input type="text" defaultValue="123 Tech Park, Phase 2, Electronic City" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all" />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">City</label>
                        <input type="text" defaultValue="Bengaluru" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Postal Code</label>
                        <input type="text" defaultValue="560001" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Phone Number</label>
                      <input type="tel" defaultValue="+91 98765 43210" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all" />
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end">
                    <button 
                      onClick={() => setStep(2)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-xl font-bold transition-all shadow-lg shadow-blue-500/20 flex items-center gap-2"
                    >
                      Continue to Payment <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200">
                  <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-blue-600" /> Payment Method
                  </h2>

                  <div className="space-y-4">
                    {/* Card Option */}
                    <label className={`block cursor-pointer border-2 rounded-2xl p-4 transition-all ${paymentMethod === 'card' ? 'border-blue-500 bg-blue-50/50' : 'border-slate-200 hover:border-blue-200'}`}>
                      <div className="flex items-center gap-4">
                        <input type="radio" name="payment" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} className="w-5 h-5 text-blue-600 focus:ring-blue-500" />
                        <div className="flex-1 flex justify-between items-center">
                          <span className="font-bold text-slate-800">Credit / Debit Card</span>
                          <CreditCard className="w-6 h-6 text-slate-400" />
                        </div>
                      </div>
                      
                      {paymentMethod === 'card' && (
                        <div className="mt-6 space-y-4 animate-in slide-in-from-top-2 fade-in duration-200">
                          <div>
                            <input type="text" placeholder="Card Number" defaultValue="4111 1111 1111 1111" className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <input type="text" placeholder="MM/YY" defaultValue="12/28" className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
                            <input type="password" placeholder="CVV" defaultValue="123" className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
                          </div>
                        </div>
                      )}
                    </label>

                    {/* UPI Option */}
                    <label className={`block cursor-pointer border-2 rounded-2xl p-4 transition-all ${paymentMethod === 'upi' ? 'border-blue-500 bg-blue-50/50' : 'border-slate-200 hover:border-blue-200'}`}>
                      <div className="flex items-center gap-4">
                        <input type="radio" name="payment" checked={paymentMethod === 'upi'} onChange={() => setPaymentMethod('upi')} className="w-5 h-5 text-blue-600 focus:ring-blue-500" />
                        <div className="flex-1 flex justify-between items-center">
                          <span className="font-bold text-slate-800">UPI (GPay, PhonePe, Paytm)</span>
                          <Smartphone className="w-6 h-6 text-slate-400" />
                        </div>
                      </div>
                      {paymentMethod === 'upi' && (
                        <div className="mt-6 animate-in slide-in-from-top-2 fade-in duration-200">
                          <input type="text" placeholder="Enter UPI ID (e.g., amit@okaxis)" className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
                        </div>
                      )}
                    </label>

                    {/* Net Banking */}
                    <label className={`block cursor-pointer border-2 rounded-2xl p-4 transition-all ${paymentMethod === 'cod' ? 'border-blue-500 bg-blue-50/50' : 'border-slate-200 hover:border-blue-200'}`}>
                      <div className="flex items-center gap-4">
                        <input type="radio" name="payment" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} className="w-5 h-5 text-blue-600 focus:ring-blue-500" />
                        <div className="flex-1 flex justify-between items-center">
                          <span className="font-bold text-slate-800">Cash on Delivery</span>
                          <Banknote className="w-6 h-6 text-slate-400" />
                        </div>
                      </div>
                    </label>
                  </div>

                  <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
                    <button 
                      onClick={() => setStep(1)}
                      className="text-slate-500 hover:text-slate-800 font-bold px-4 py-2 rounded-xl transition-colors"
                    >
                      ← Back
                    </button>
                    <button 
                      onClick={handlePayment}
                      disabled={isProcessing}
                      className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3.5 rounded-xl font-bold transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {isProcessing ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          Processing...
                        </>
                      ) : (
                        `Pay ₹${total.toLocaleString('en-IN')}`
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Order Summary (Sticky) */}
            <div className="flex-1">
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 sticky top-[100px]">
                <h3 className="text-lg font-bold text-slate-800 mb-4 pb-4 border-b border-slate-100">Order Summary</h3>
                
                <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                  {items.map(item => (
                    <div key={item.id} className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-slate-100 rounded-lg overflow-hidden shrink-0 flex items-center justify-center">
                        {item.image ? (
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                          <Package className="w-6 h-6 text-slate-300" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-bold text-slate-800 truncate">{item.name}</div>
                        <div className="text-xs text-slate-500">Qty: {item.quantity}</div>
                      </div>
                      <div className="font-bold text-slate-800 whitespace-nowrap">
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-3 pt-4 border-t border-slate-100 text-sm">
                  <div className="flex justify-between text-slate-500 font-medium">
                    <span>Subtotal</span>
                    <span>₹{total.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-slate-500 font-medium">
                    <span>Shipping</span>
                    <span className="text-emerald-500 font-bold">FREE</span>
                  </div>
                  <div className="flex justify-between text-slate-500 font-medium">
                    <span>Tax (GST 18%)</span>
                    <span>Included</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-200 flex justify-between items-center">
                  <span className="text-lg font-bold text-slate-800">Total</span>
                  <span className="text-2xl font-black text-blue-600">₹{total.toLocaleString('en-IN')}</span>
                </div>
                
                <div className="mt-6 flex items-start gap-2 bg-emerald-50 text-emerald-700 p-3 rounded-xl text-xs font-medium">
                  <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" />
                  <p>Safe and secure payments. 100% Authentic products.</p>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* Success Step */}
        {step === 3 && (
          <div className="bg-white rounded-3xl p-10 md:p-16 shadow-sm border border-slate-200 text-center max-w-2xl mx-auto animate-in zoom-in-95 duration-500">
            <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-12 h-12 text-emerald-500" />
            </div>
            <h1 className="text-3xl font-black text-slate-800 mb-4">Order Confirmed!</h1>
            <p className="text-slate-500 text-lg mb-8 max-w-md mx-auto">
              Thank you for your purchase. Your order <span className="font-bold text-slate-800">#MKV-{Math.floor(Math.random() * 1000000)}</span> has been placed successfully and will be shipped soon.
            </p>
            
            <div className="bg-slate-50 rounded-2xl p-6 mb-10 text-left border border-slate-100 flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Delivering To</h4>
                <div className="font-bold text-slate-800">Amit Verma</div>
                <div className="text-sm text-slate-600">123 Tech Park, Phase 2</div>
                <div className="text-sm text-slate-600">Bengaluru, 560001</div>
              </div>
              <div className="hidden md:block w-px bg-slate-200"></div>
              <div className="flex-1">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Estimated Delivery</h4>
                <div className="font-bold text-slate-800 text-lg text-emerald-600">Arriving Tomorrow</div>
                <div className="text-sm text-slate-600 mt-1">By 9:00 PM</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/">
                <button className="w-full sm:w-auto bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-3.5 px-8 rounded-xl transition-colors">
                  Continue Shopping
                </button>
              </Link>
              <Link href="/profile/orders">
                <button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-8 rounded-xl transition-colors shadow-lg shadow-blue-500/20">
                  Track Order
                </button>
              </Link>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

// Just defining ShieldCheck here since it wasn't imported from lucide-react above
function ShieldCheck(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2-1 4-3 7-3s5 2 7 3a1 1 0 0 1 1 1v7z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
