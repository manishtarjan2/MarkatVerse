"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function SellerOnboarding() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [sellerRole, setSellerRole] = useState('Manufacturer');
  const [businessSector, setBusinessSector] = useState('Construction');
  const [businessCategory, setBusinessCategory] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [businessLocation, setBusinessLocation] = useState('');

  const [otpArray, setOtpArray] = useState(['', '', '', '', '', '']);

  const sectors = ['Construction', 'Electronics', 'Fashion', 'Home & Kitchen', 'Logistics', 'Professional Services', 'Event Organizers'];
  
  const getCategories = () => {
    switch (businessSector) {
      case 'Construction':
        return ['Plumbing', 'Civil / Building', 'Electrical Fittings', 'Hardware Tools', 'Raw Materials (Cement/Steel)'];
      case 'Electronics':
        return ['Mobiles', 'Computers', 'Home Appliances', 'Accessories'];
      case 'Fashion':
        return ['Men\'s Wear', 'Women\'s Wear', 'Kids', 'Footwear'];
      case 'Logistics':
        return ['Heavy Freight', 'Local Courier', 'Passenger Transport (Taxi/Auto)', 'Packers & Movers'];
      case 'Professional Services':
        return ['IT & Software', 'Marketing Agency', 'Home Repairs', 'Beauty & Spa', 'Legal Consulting'];
      case 'Event Organizers':
        return ['Weddings', 'Corporate Events', 'Parties & Catering', 'Stage Decorators'];
      case 'Home & Kitchen':
        return ['Furniture', 'Kitchenware', 'Decor', 'Bedding'];
      default:
        return ['Other'];
    }
  };

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsOtpSent(true);
    }, 1000);
  };

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value;
    if (isNaN(Number(value))) return;
    const newOtpArray = [...otpArray];
    newOtpArray[index] = value.substring(value.length - 1);
    setOtpArray(newOtpArray);
    if (value && index < 5) {
      const nextSibling = document.getElementById(`otp-${index + 1}`);
      if (nextSibling) (nextSibling as HTMLInputElement).focus();
    }
  };

  const handleOtpKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !otpArray[index] && index > 0) {
      const prevSibling = document.getElementById(`otp-${index - 1}`);
      if (prevSibling) (prevSibling as HTMLInputElement).focus();
    }
  };

  const otpString = otpArray.join('');

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setStep(2);
    }, 1000);
  };

  const handleBusinessDetails = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setStep(3);
    }, 1000);
  };

  const handleDocumentUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch('http://localhost:3001/sellers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: businessName || 'Test Business',
          role: sellerRole,
          sector: businessSector,
          category: businessCategory || 'Unknown',
          type: businessCategory || 'Unknown', // Backwards compatibility for UI
          location: businessLocation || 'Unknown',
          phone: phone,
        }),
      });
      if (response.ok) {
        setIsSubmitting(false);
        setStep(4);
      } else {
        setIsSubmitting(false);
        alert("Failed to register. Please try again.");
      }
    } catch (error) {
      console.error(error);
      setIsSubmitting(false);
      alert("Error connecting to server.");
    }
  };

  const steps = [
    { num: 1, label: 'Verify Mobile' },
    { num: 2, label: 'Business Info' },
    { num: 3, label: 'Documents' },
  ];

  const inputClasses = "w-full p-3.5 rounded-lg border border-slate-300 bg-white text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all placeholder:text-slate-400 text-base";
  const selectClasses = "w-full p-3.5 rounded-lg border border-slate-300 bg-white text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all text-base";
  const labelClasses = "block text-sm font-medium text-slate-700 mb-2";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50 flex">
      
      {/* Left Side: Branding Panel */}
      <div className="hidden lg:flex w-[420px] bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 relative overflow-hidden flex-col justify-between p-10 shrink-0">
        {/* Background circles */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 border border-white/30 rounded-full"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 border border-white/20 rounded-full"></div>
        </div>

        {/* Logo */}
        <div className="relative z-10">
          <img src="/logo.png" alt="MarkatVerse" className="h-12 brightness-0 invert object-contain" />
          <div className="mt-1 text-emerald-200 text-sm font-medium tracking-wider">SELLER PORTAL</div>
        </div>

        {/* Center Content */}
        <div className="relative z-10">
          <h1 className="text-3xl font-bold text-white leading-tight mb-6">
            Grow your business<br />
            <span className="text-amber-400">with MarkatVerse</span>
          </h1>
          <p className="text-emerald-100 text-base leading-relaxed mb-8">
            Reach millions of customers across 200+ countries. List products, manage orders, and scale your business — all from one dashboard.
          </p>

          {/* Benefits */}
          <div className="flex flex-col gap-4">
            {[
              { icon: '🚀', title: '0% Commission', desc: 'for first 3 months' },
              { icon: '📦', title: 'Easy Logistics', desc: 'Pan-India shipping support' },
              { icon: '💰', title: 'Fast Payouts', desc: 'Within 7 business days' },
              { icon: '📊', title: 'Growth Tools', desc: 'Analytics & marketing support' },
            ].map((b, i) => (
              <div key={i} className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg p-3">
                <span className="text-xl">{b.icon}</span>
                <div>
                  <div className="text-white text-base font-medium">{b.title}</div>
                  <div className="text-emerald-200 text-sm">{b.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Trust */}
        <div className="relative z-10 flex items-center gap-4 text-emerald-200 text-sm">
          <span>🛡️ TrustSEAL Verified</span>
          <span>🔒 Secure Platform</span>
        </div>
      </div>

      {/* Right Side: Form */}
      <div className="flex-1 flex flex-col p-6 lg:p-10 overflow-y-auto">
        <div className="w-full max-w-[600px] mx-auto">

          {/* Mobile Logo */}
          <div className="lg:hidden mb-6 text-center">
            <img src="/logo.png" alt="MarkatVerse" className="h-10 mx-auto object-contain" />
            <div className="text-emerald-600 text-sm font-medium mt-1">SELLER PORTAL</div>
          </div>

          {/* Step Progress */}
          {step <= 3 && (
            <div className="flex items-center justify-center gap-0 mb-10">
              {steps.map((s, i) => (
                <React.Fragment key={s.num}>
                  <div className="flex flex-col items-center gap-1.5">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-base font-bold transition-all ${
                      step > s.num ? 'bg-emerald-600 text-white' :
                      step === s.num ? 'bg-emerald-600 text-white ring-4 ring-emerald-100' :
                      'bg-slate-200 text-slate-400'
                    }`}>
                      {step > s.num ? '✓' : s.num}
                    </div>
                    <span className={`text-xs font-medium ${step >= s.num ? 'text-emerald-700' : 'text-slate-400'}`}>
                      {s.label}
                    </span>
                  </div>
                  {i < steps.length - 1 && (
                    <div className={`w-16 h-0.5 mb-5 mx-1 ${step > s.num ? 'bg-emerald-600' : 'bg-slate-200'}`}></div>
                  )}
                </React.Fragment>
              ))}
            </div>
          )}

          {/* ─── STEP 1: Mobile Verification ─── */}
          {step === 1 && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
              {!isOtpSent ? (
                <>
                  <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
                    <span className="text-2xl">📱</span>
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 text-center mb-2">Verify your mobile</h2>
                  <p className="text-slate-500 text-base text-center mb-8">We'll send a 6-digit OTP to verify your number</p>

                  <form onSubmit={handleSendOtp} className="max-w-[360px] mx-auto">
                    <label className={labelClasses}>Mobile Number</label>
                    <div className="flex gap-3 mb-6">
                      <div className="w-[72px] flex items-center justify-center bg-slate-100 border border-slate-300 rounded-lg text-slate-500 text-base font-medium">
                        +91
                      </div>
                      <input 
                        required type="tel" value={phone} onChange={e => setPhone(e.target.value)}
                        placeholder="98765 43210" className={`flex-1 ${inputClasses}`}
                      />
                    </div>
                    <button type="submit" disabled={isSubmitting || phone.length < 10}
                      className="w-full p-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed border-none cursor-pointer text-base">
                      {isSubmitting ? (
                        <span className="flex items-center justify-center gap-2">
                          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                          Sending OTP...
                        </span>
                      ) : 'Send OTP'}
                    </button>
                  </form>

                  <p className="mt-6 text-center text-sm text-slate-400">
                    Already a seller? <Link href="/login" className="text-emerald-600 hover:underline font-medium">Log in here</Link>
                  </p>
                </>
              ) : (
                <>
                  <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
                    <span className="text-2xl">✉️</span>
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 text-center mb-2">Enter OTP</h2>
                  <p className="text-slate-500 text-base text-center mb-1">6-digit code sent to <strong className="text-slate-800">+91 {phone}</strong></p>
                  <button type="button" onClick={() => setIsOtpSent(false)} className="text-emerald-600 text-sm cursor-pointer bg-transparent border-none mx-auto block mb-6 hover:underline">
                    Change Number
                  </button>

                  <form onSubmit={handleVerifyOtp} className="max-w-[360px] mx-auto">
                    <div className="flex gap-2.5 justify-center mb-6">
                      {otpArray.map((data, index) => (
                        <input 
                          key={index} id={`otp-${index}`} type="text" maxLength={1} value={data}
                          onChange={e => handleOtpChange(e, index)} onKeyDown={e => handleOtpKeyDown(e, index)}
                          className="w-12 h-14 rounded-lg border border-slate-300 bg-white text-slate-900 text-xl text-center font-bold outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all"
                        />
                      ))}
                    </div>
                    <div className="flex justify-between items-center mb-6 text-sm">
                      <span className="text-slate-400">Didn&apos;t receive?</span>
                      <button type="button" className="text-emerald-600 cursor-pointer bg-transparent border-none hover:underline font-medium">Resend OTP</button>
                    </div>
                    <button type="submit" disabled={isSubmitting || otpString.length < 6}
                      className="w-full p-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed border-none cursor-pointer text-base">
                      {isSubmitting ? (
                        <span className="flex items-center justify-center gap-2">
                          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                          Verifying...
                        </span>
                      ) : 'Verify & Continue'}
                    </button>
                  </form>
                </>
              )}
            </div>
          )}

          {/* ─── STEP 2: Business Details ─── */}
          {step === 2 && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
              <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
                <span className="text-2xl">🏢</span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 text-center mb-2">Business Details</h2>
              <p className="text-slate-500 text-base text-center mb-8">Tell us about your business so we can set up your store</p>

              <form onSubmit={handleBusinessDetails} className="flex flex-col gap-5">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className={labelClasses}>Who are you?</label>
                    <select value={sellerRole} onChange={e => setSellerRole(e.target.value)} className={selectClasses}>
                      <option value="Manufacturer">Manufacturer</option>
                      <option value="Wholesaler">Wholesaler / Distributor</option>
                      <option value="Retailer">Retailer / Dealer</option>
                      <option value="Service Provider">Service Provider</option>
                      <option value="Organizer">Contractor / Organizer</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelClasses}>Business Sector</label>
                    <select value={businessSector} onChange={e => { setBusinessSector(e.target.value); setBusinessCategory(''); }} className={selectClasses}>
                      {sectors.map(sec => (
                        <option key={sec} value={sec}>{sec}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={labelClasses}>Specialization Category</label>
                    <select required value={businessCategory} onChange={e => setBusinessCategory(e.target.value)} className={selectClasses}>
                      <option value="" disabled>Select category...</option>
                      {getCategories().map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClasses}>Legal Business Name</label>
                    <input required type="text" value={businessName} onChange={e => setBusinessName(e.target.value)} placeholder="e.g. Global Exports LLC" className={inputClasses} />
                  </div>
                  <div>
                    <label className={labelClasses}>Business Location</label>
                    <input required type="text" value={businessLocation} onChange={e => setBusinessLocation(e.target.value)} placeholder="e.g. Mumbai, Maharashtra" className={inputClasses} />
                  </div>
                </div>

                <div>
                  <label className={labelClasses}>GST / PAN Number</label>
                  <input required type="text" placeholder="e.g. 22AAAAA0000A1Z5" className={inputClasses} />
                </div>

                <div className="flex gap-3 mt-2">
                  <button type="button" onClick={() => setStep(1)}
                    className="px-6 py-3.5 border border-slate-300 text-slate-700 rounded-lg font-medium text-base cursor-pointer hover:bg-slate-50 transition-colors bg-white">
                    ← Back
                  </button>
                  <button type="submit" disabled={isSubmitting}
                    className="flex-1 p-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed border-none cursor-pointer text-base">
                    {isSubmitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                        Saving...
                      </span>
                    ) : 'Next: Upload Documents →'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ─── STEP 3: Documents ─── */}
          {step === 3 && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
              <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
                <span className="text-2xl">📄</span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 text-center mb-2">Upload Documents</h2>
              <p className="text-slate-500 text-base text-center mb-8">Required for verification — your data is encrypted and secure</p>

              <form onSubmit={handleDocumentUpload} className="flex flex-col gap-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { title: 'GST / Business Certificate', desc: 'PDF, JPG, PNG (Max 5MB)', icon: '📋' },
                    { title: 'ID Proof (Aadhar/PAN)', desc: 'PDF, JPG, PNG (Max 5MB)', icon: '🪪' },
                    { title: 'Cancelled Cheque / Bank Proof', desc: 'Needed for payouts', icon: '🏦' },
                  ].map((doc, i) => (
                    <div key={i} className="bg-slate-50 p-5 rounded-xl border border-slate-200 border-dashed hover:border-emerald-400 transition-colors">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-xl">{doc.icon}</span>
                        <div className="font-medium text-base text-slate-900">{doc.title}</div>
                      </div>
                      <input type="file" required className="text-sm text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-emerald-50 file:text-emerald-700 file:cursor-pointer hover:file:bg-emerald-100" />
                      <p className="text-xs text-slate-400 mt-2">{doc.desc}</p>
                    </div>
                  ))}
                </div>

                {/* Notice */}
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl text-sm text-blue-700 flex items-start gap-2">
                  <span className="text-base mt-0.5">ℹ️</span>
                  <span>By clicking complete, you agree to our <strong>Seller Verification Process</strong> and <strong>Terms of Service</strong>. Verification usually takes 24-48 hours.</span>
                </div>

                <div className="flex gap-3 mt-2">
                  <button type="button" onClick={() => setStep(2)}
                    className="px-6 py-3.5 border border-slate-300 text-slate-700 rounded-lg font-medium text-base cursor-pointer hover:bg-slate-50 transition-colors bg-white">
                    ← Back
                  </button>
                  <button type="submit" disabled={isSubmitting}
                    className="flex-1 p-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed border-none cursor-pointer text-base">
                    {isSubmitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                        Submitting & Verifying...
                      </span>
                    ) : 'Complete Verification ✓'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ─── STEP 4: Success ─── */}
          {step === 4 && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-10 text-center">
              <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">🎉</span>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-3">Registration Complete!</h2>
              <p className="text-slate-500 text-base mb-2">
                Your seller account for <strong className="text-slate-800">{businessName}</strong> has been submitted successfully.
              </p>
              <p className="text-slate-400 text-sm mb-8">
                Our team will review your documents within 24-48 hours. You&apos;ll receive a notification once approved.
              </p>

              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 mb-8 text-left max-w-sm mx-auto">
                <h4 className="text-base font-medium text-emerald-800 mb-3">What happens next?</h4>
                <div className="flex flex-col gap-2.5 text-sm text-emerald-700">
                  <div className="flex items-center gap-2"><span>✅</span> Document verification (24-48 hrs)</div>
                  <div className="flex items-center gap-2"><span>📧</span> Approval email notification</div>
                  <div className="flex items-center gap-2"><span>🏪</span> Set up your storefront</div>
                  <div className="flex items-center gap-2"><span>🚀</span> Start listing products!</div>
                </div>
              </div>

              <div className="flex gap-3 justify-center">
                <Link href="/">
                  <button className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors border-none cursor-pointer text-base">
                    Go to Homepage
                  </button>
                </Link>
                <Link href="/seller/dashboard">
                  <button className="px-6 py-3 border border-slate-300 text-slate-700 rounded-lg font-medium text-base cursor-pointer hover:bg-slate-50 transition-colors bg-white">
                    Seller Dashboard
                  </button>
                </Link>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="mt-8 text-center text-sm text-slate-400">
            Need help? <a href="#" className="text-emerald-600 hover:underline">Contact Seller Support</a>
          </div>

        </div>
      </div>
    </div>
  );
}
