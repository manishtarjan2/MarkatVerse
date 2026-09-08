"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export default function SellerOnboarding() {
  const router = useRouter();
  const { user, login } = useAuth();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Auto-skip step 1 if already logged in as a consumer
  React.useEffect(() => {
    if (user && step === 1) {
      setOwnerName(user.name);
      setEmail(user.email || '');
      setPhone(user.phone || '');
      setStep(2);
    }
  }, [user, step]);

  // Step 1: Account credentials
  const [ownerName, setOwnerName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [registeredToken, setRegisteredToken] = useState('');

  const [sellerRole, setSellerRole] = useState('Manufacturer');
  const [businessSector, setBusinessSector] = useState('Construction');
  const [businessCategory, setBusinessCategory] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [businessLocation, setBusinessLocation] = useState('');
  const [gstNumber, setGstNumber] = useState('');

  const [otpArray, setOtpArray] = useState(['', '', '', '']);

  const taxonomy: Record<string, Record<string, string[]>> = {
    'Manufacturer': {
      'Construction': ['All', 'Plumbing', 'Civil / Building', 'Electrical Fittings', 'Hardware Tools', 'Raw Materials (Cement/Steel)'],
      'Electronics': ['All', 'Mobiles', 'Computers', 'Home Appliances', 'Accessories'],
      'Fashion': ['All', 'Men\'s Wear', 'Women\'s Wear', 'Kids', 'Footwear'],
      'Home & Kitchen': ['All', 'Furniture', 'Kitchenware', 'Decor', 'Bedding']
    },
    'Wholesaler': {
      'Construction': ['All', 'Plumbing', 'Civil / Building', 'Electrical Fittings', 'Hardware Tools', 'Raw Materials (Cement/Steel)'],
      'Electronics': ['All', 'Mobiles', 'Computers', 'Home Appliances', 'Accessories'],
      'Fashion': ['All', 'Men\'s Wear', 'Women\'s Wear', 'Kids', 'Footwear'],
      'FMCG & Groceries': ['All', 'Packaged Food', 'Beverages', 'Personal Care', 'Cleaning Supplies']
    },
    'Retailer': {
      'Electronics': ['All', 'Mobiles', 'Computers', 'Home Appliances', 'Accessories'],
      'Fashion': ['All', 'Men\'s Wear', 'Women\'s Wear', 'Kids', 'Footwear'],
      'Home & Kitchen': ['All', 'Furniture', 'Kitchenware', 'Decor', 'Bedding'],
      'Grocery & Essentials': ['All', 'Fresh Produce', 'Dairy', 'Snacks', 'Household']
    },
    'Service Provider': {
      'Salon & Parlor': ['All', 'Haircut', 'Hair Dye', 'Facial', 'Manicure & Pedicure', 'Bridal Makeup'],
      'Home Repairs': ['All', 'AC Repair', 'Plumbing', 'Electrical', 'Appliance Repair', 'Carpentry'],
      'Cleaning & Pest Control': ['All', 'Deep Cleaning', 'Sofa Cleaning', 'Pest Control', 'Disinfection'],
      'Professional Services': ['All', 'IT & Software', 'Marketing Agency', 'Legal Consulting', 'Tax & Accounting']
    },
    'Organizer': {
      'Event & Party': ['All', 'Weddings', 'Corporate Events', 'Parties & Catering', 'Stage Decorators', 'Photography'],
      'Transport & Logistics': ['All', 'Heavy Freight', 'Local Courier', 'Passenger Transport (Taxi/Auto)', 'Packers & Movers'],
      'Travel & Tours': ['All', 'Domestic Packages', 'International Packages', 'Pilgrimage', 'Hotel Booking']
    }
  };

  const currentSectors = Object.keys(taxonomy[sellerRole] || {});
  const currentCategories = taxonomy[sellerRole]?.[businessSector] || ['Other'];

  // Step 1: Create seller account
  const handleAccountSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) { setError('Passwords do not match'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters'); return; }
    if (!email && !phone) { setError('Email or phone is required'); return; }
    setIsSubmitting(true);
    try {
      // Register as SELLER role
      const res = await fetch(`${API_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: ownerName,
          email: email || undefined,
          phone: phone || undefined,
          password,
          role: 'SELLER',
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(Array.isArray(data.message) ? data.message[0] : data.message || 'Registration failed');
      setRegisteredToken(data.access_token);
      // Also log them in
      login(
        { id: data.user.id, name: data.user.name, email: data.user.email, role: 'business', phone: data.user.phone || '' },
        data.access_token
      );
      setStep(2);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value;
    if (isNaN(Number(value))) return;
    const newOtpArray = [...otpArray];
    newOtpArray[index] = value.substring(value.length - 1);
    setOtpArray(newOtpArray);
    if (value && index < otpArray.length - 1) {
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
    }, 500);
  };

  const handleDocumentUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    try {
      const res = await fetch(`${API_URL}/sellers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(registeredToken || (typeof window !== 'undefined' && localStorage.getItem('token')) ? { Authorization: `Bearer ${registeredToken || localStorage.getItem('token')}` } : {}),
        },
        body: JSON.stringify({
          ownerName,
          businessName: businessName || 'My Business',
          businessType: sellerRole,
          sector: businessSector,
          category: businessCategory || 'Other',
          address: businessLocation,
          email,
          phone,
          gstNumber,
        }),
      });
      if (res.ok) {
        setIsSubmitting(false);
        setStep(4);
      } else {
        const data = await res.json();
        throw new Error(data.message || 'Failed to register. Please try again.');
      }
    } catch (err: any) {
      setError(err.message);
      setIsSubmitting(false);
    }
  };

  const steps = [
    { num: 1, label: 'Account Setup' },
    { num: 2, label: 'Business Info' },
    { num: 3, label: 'Documents' },
  ];

  const inputClasses = "w-full p-3.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 focus:bg-white transition-all placeholder:text-slate-400 text-sm";
  const selectClasses = "w-full p-3.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 focus:bg-white transition-all text-sm";
  const labelClasses = "block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide";
  const btnPrimary = "flex-1 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl font-semibold transition-all shadow-lg shadow-emerald-600/20 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm";

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

          {/* ─── STEP 1: Account Setup ─── */}
          {step === 1 && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
              <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
                <span className="text-2xl">👤</span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 text-center mb-1">Create Seller Account</h2>
              <p className="text-slate-500 text-sm text-center mb-7">Set up your login credentials to get started</p>

              {/* Tabs */}
              <div className="flex bg-slate-100 rounded-xl p-1 mb-8">
                <Link href="/seller/login" className="flex-1 py-2.5 text-sm font-semibold text-center text-slate-500 hover:text-slate-700 transition-all">
                  Sign In
                </Link>
                <div className="flex-1 py-2.5 text-sm font-semibold text-center rounded-lg bg-white text-emerald-600 shadow-sm transition-all">
                  Register
                </div>
              </div>

              {error && (
                <div className="mb-5 p-4 bg-red-50 text-red-700 rounded-xl text-sm border border-red-100 flex items-start gap-2">
                  <span className="mt-0.5">⚠️</span> {error}
                </div>
              )}

              <form onSubmit={handleAccountSetup} className="flex flex-col gap-4">
                <div>
                  <label className={labelClasses}>Full Name (Owner)</label>
                  <input required type="text" value={ownerName} onChange={e => setOwnerName(e.target.value)}
                    placeholder="John Doe" className={inputClasses} />
                </div>

                <div>
                  <label className={labelClasses}>Email Address</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                    placeholder="seller@example.com" className={inputClasses} />
                </div>

                <div>
                  <label className={labelClasses}>Phone Number <span className="normal-case font-normal text-slate-400">(optional if email given)</span></label>
                  <input type="tel" value={phone} onChange={e => setPhone(e.target.value)}
                    placeholder="9876543210" className={inputClasses} />
                </div>

                <div>
                  <label className={labelClasses}>Password</label>
                  <div className="relative">
                    <input required type={showPassword ? 'text' : 'password'} value={password}
                      onChange={e => setPassword(e.target.value)} placeholder="Min. 6 characters"
                      className={`${inputClasses} pr-11`} />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-sm">
                      {showPassword ? '🙈' : '👁️'}
                    </button>
                  </div>
                </div>

                <div>
                  <label className={labelClasses}>Confirm Password</label>
                  <input required type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter password" className={inputClasses} />
                  {confirmPassword && password !== confirmPassword && (
                    <p className="text-xs text-red-500 mt-1">Passwords don't match</p>
                  )}
                  {confirmPassword && password === confirmPassword && password.length >= 6 && (
                    <p className="text-xs text-emerald-500 mt-1">✅ Passwords match</p>
                  )}
                </div>

                <button type="submit" disabled={isSubmitting || !ownerName || (!email && !phone)}
                  className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl font-semibold transition-all shadow-lg shadow-emerald-600/20 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm mt-2">
                  {isSubmitting
                    ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Creating account...</>
                    : 'Create Account & Continue →'
                  }
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-slate-400">
                Already a seller?{' '}
                <Link href="/seller/login" className="text-emerald-600 hover:underline font-semibold">Sign In</Link>
              </p>
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
                      {currentSectors.map(sec => (
                        <option key={sec} value={sec}>{sec}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={labelClasses}>Specialization Category</label>
                    <select required value={businessCategory} onChange={e => setBusinessCategory(e.target.value)} className={selectClasses}>
                      <option value="" disabled>Select category...</option>
                      {currentCategories.map((cat: string) => (
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
                  <input required type="text" value={gstNumber} onChange={e => setGstNumber(e.target.value)} placeholder="e.g. 22AAAAA0000A1Z5" className={inputClasses} />
                </div>

                <div className="flex gap-3 mt-2">
                  <button type="button" onClick={() => setStep(1)}
                    className="px-6 py-3.5 border border-slate-300 text-slate-700 rounded-xl font-medium text-sm cursor-pointer hover:bg-slate-50 transition-colors bg-white">
                    ← Back
                  </button>
                  <button type="submit" disabled={isSubmitting}
                    className={btnPrimary}>
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

              {error && (
                <div className="mb-5 p-4 bg-red-50 text-red-700 rounded-xl text-sm border border-red-100 flex items-start gap-2">
                  <span className="mt-0.5">⚠️</span> {error}
                </div>
              )}

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
                        <div className="font-medium text-sm text-slate-900">{doc.title}</div>
                      </div>
                      <input type="file" className="text-xs text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 file:cursor-pointer hover:file:bg-emerald-100" />
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
                    className="px-6 py-3.5 border border-slate-300 text-slate-700 rounded-xl font-medium text-sm cursor-pointer hover:bg-slate-50 transition-colors bg-white">
                    ← Back
                  </button>
                  <button type="submit" disabled={isSubmitting}
                    className={btnPrimary}>
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
                  <div className="flex items-center gap-2"><span>🚀</span> Start listing {['Service Provider', 'Organizer'].includes(sellerRole) ? 'services' : 'products'}!</div>
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
