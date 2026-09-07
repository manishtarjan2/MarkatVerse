"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import {
  Eye, EyeOff, Mail, Phone, Lock, ArrowRight, ArrowLeft,
  CheckCircle, Store, TrendingUp, Package, DollarSign
} from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

type View = 'signin' | 'forgot' | 'otp' | 'reset' | 'success';

const BENEFITS = [
  { icon: <TrendingUp className="w-5 h-5" />, title: '0% Commission', desc: 'For your first 3 months' },
  { icon: <Package className="w-5 h-5" />, title: 'Easy Logistics', desc: 'Pan-India shipping support' },
  { icon: <DollarSign className="w-5 h-5" />, title: 'Fast Payouts', desc: 'Within 7 business days' },
  { icon: <Store className="w-5 h-5" />, title: 'Seller Dashboard', desc: 'Full analytics & tools' },
];

export default function SellerLoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [view, setView] = useState<View>('signin');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Sign In fields
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');

  // Forgot password fields
  const [fpIdentifier, setFpIdentifier] = useState('');
  const [fpOtp, setFpOtp] = useState('');
  const [fpResetToken, setFpResetToken] = useState('');
  const [fpNewPassword, setFpNewPassword] = useState('');
  const [fpConfirmPassword, setFpConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);

  const clearErrors = () => { setError(''); setSuccessMsg(''); };
  const isPhone = !identifier.includes('@') && identifier.length >= 10;

  // ── Sign In ──────────────────────────────────────────────────
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    clearErrors();
    setIsLoading(true);
    try {
      const endpoint = isPhone ? '/auth/phone-login' : '/auth/login';
      const payload = isPhone
        ? { phone: identifier }
        : { email: identifier, password };

      const res = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(Array.isArray(data.message) ? data.message[0] : data.message || 'Sign in failed');

      // Check if user has seller role
      const role = data.user.role?.toUpperCase();
      if (role !== 'SELLER' && role !== 'ADMIN') {
        throw new Error('This account is not registered as a seller. Please register your business first.');
      }

      login(
        { id: data.user.id, name: data.user.name, email: data.user.email, role: data.user.role.toLowerCase() as any, phone: data.user.phone || '' },
        data.access_token
      );
      router.push('/seller/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // ── Forgot Password ──────────────────────────────────────────
  const handleForgotSend = async (e: React.FormEvent) => {
    e.preventDefault();
    clearErrors();
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: fpIdentifier }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to send OTP');
      setFpResetToken(data.reset_token);
      setSuccessMsg('OTP sent successfully! For demo, enter any 4-digit code.');
      setView('otp');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpVerify = (e: React.FormEvent) => {
    e.preventDefault();
    clearErrors();
    if (fpOtp.length < 4) { setError('Please enter a valid 4-digit OTP'); return; }
    setView('reset');
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    clearErrors();
    if (fpNewPassword !== fpConfirmPassword) { setError('Passwords do not match'); return; }
    if (fpNewPassword.length < 6) { setError('Password must be at least 6 characters'); return; }
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reset_token: fpResetToken, new_password: fpNewPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to reset password');
      setView('success');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const inputCls = "w-full pl-10 pr-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 focus:bg-white transition-all text-sm";
  const labelCls = "block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide";
  const btnPrimary = "w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl font-semibold transition-all shadow-lg shadow-emerald-600/20 hover:shadow-emerald-600/40 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-teal-50 flex">

      {/* ── Left Branding ── */}
      <div className="hidden lg:flex w-[440px] bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 relative overflow-hidden flex-col justify-between p-12 shrink-0">
        <div className="absolute top-[-80px] left-[-80px] w-[360px] h-[360px] border border-white/10 rounded-full" />
        <div className="absolute bottom-[-100px] right-[-100px] w-[440px] h-[440px] border border-white/10 rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-white/5 rounded-full blur-3xl" />

        <div className="relative z-10">
          <img src="/logo.png" alt="MarkatVerse" className="h-10 brightness-0 invert object-contain" />
          <div className="mt-2 text-emerald-200 text-xs font-bold tracking-[0.2em] uppercase">Seller Portal</div>
        </div>

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-8">
            <span className="text-amber-400 text-sm">⭐</span>
            <span className="text-white/90 text-xs font-semibold">50,000+ active sellers</span>
          </div>
          <h1 className="text-4xl font-bold text-white leading-tight mb-5">
            Grow your business<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-amber-500">with MarkatVerse</span>
          </h1>
          <p className="text-emerald-100/80 text-sm leading-relaxed mb-10">
            Reach millions of customers across India. Manage products, orders, and payouts — all from one powerful dashboard.
          </p>

          <div className="grid grid-cols-2 gap-3">
            {BENEFITS.map((b, i) => (
              <div key={i} className="flex items-start gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                <div className="text-emerald-300 mt-0.5 shrink-0">{b.icon}</div>
                <div>
                  <div className="text-white text-sm font-semibold">{b.title}</div>
                  <div className="text-emerald-200/70 text-xs mt-0.5">{b.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-5 text-emerald-200/60 text-xs">
          <span>🛡️ TrustSEAL Verified</span>
          <span>🔒 SSL Encrypted</span>
        </div>
      </div>

      {/* ── Right Form ── */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 lg:p-12 overflow-y-auto">
        <div className="w-full max-w-[420px]">

          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <img src="/logo.png" alt="MarkatVerse" className="h-8 mx-auto object-contain" />
            <div className="text-emerald-600 text-xs font-bold tracking-[0.2em] uppercase mt-1">Seller Portal</div>
          </div>

          {/* ── Sign In View ── */}
          {view === 'signin' && (
            <div>
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-slate-900 mb-1">Seller Sign In</h2>
                <p className="text-slate-500 text-sm">Access your seller dashboard</p>
              </div>

              {/* Tabs */}
              <div className="flex bg-slate-100 rounded-xl p-1 mb-8">
                <div className="flex-1 py-2.5 text-sm font-semibold text-center rounded-lg bg-white text-emerald-600 shadow-sm transition-all">
                  Sign In
                </div>
                <Link href="/seller/onboarding" className="flex-1 py-2.5 text-sm font-semibold text-center text-slate-500 hover:text-slate-700 transition-all">
                  Register
                </Link>
              </div>

              {error && (
                <div className="mb-5 p-4 bg-red-50 text-red-700 rounded-xl text-sm border border-red-100 flex items-start gap-2">
                  <span className="mt-0.5 shrink-0">⚠️</span> {error}
                </div>
              )}

              <form onSubmit={handleSignIn} className="space-y-5">
                <div>
                  <label className={labelCls}>Email or Phone</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      required type="text" value={identifier}
                      onChange={e => setIdentifier(e.target.value)}
                      placeholder="seller@example.com or 9876543210"
                      className={inputCls}
                    />
                  </div>
                </div>

                {identifier.includes('@') && (
                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <label className={labelCls} style={{ margin: 0 }}>Password</label>
                      <button type="button" onClick={() => { setView('forgot'); clearErrors(); }}
                        className="text-xs text-emerald-600 hover:text-emerald-700 font-semibold hover:underline">
                        Forgot password?
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        required type={showPassword ? 'text' : 'password'} value={password}
                        onChange={e => setPassword(e.target.value)} placeholder="••••••••"
                        className={`${inputCls} pr-11`}
                      />
                      <button type="button" onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                )}

                <button type="submit" className={btnPrimary} disabled={isLoading || identifier.length < 5}>
                  {isLoading
                    ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Signing in...</>
                    : <>{isPhone ? 'Continue with Phone' : 'Sign In to Seller Portal'} <ArrowRight className="w-4 h-4" /></>
                  }
                </button>
              </form>

              <div className="mt-6 pt-6 border-t border-slate-100 space-y-3 text-center">
                <p className="text-sm text-slate-500">
                  New seller?{' '}
                  <Link href="/seller/onboarding" className="text-emerald-600 font-semibold hover:underline">
                    Register your business →
                  </Link>
                </p>
                <p className="text-sm text-slate-400">
                  Regular customer?{' '}
                  <Link href="/login" className="text-blue-600 hover:underline font-medium">
                    Buyer Sign In
                  </Link>
                </p>
              </div>
            </div>
          )}

          {/* ── Forgot Password ── */}
          {view === 'forgot' && (
            <div>
              <button onClick={() => { setView('signin'); clearErrors(); }}
                className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 mb-8 transition-colors">
                <ArrowLeft className="w-4 h-4" /> Back to Sign In
              </button>
              <div className="mb-8">
                <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center mb-4">
                  <Lock className="w-7 h-7 text-emerald-600" />
                </div>
                <h2 className="text-3xl font-bold text-slate-900 mb-1">Forgot password?</h2>
                <p className="text-slate-500 text-sm">Enter your registered email or phone number.</p>
              </div>

              {error && <div className="mb-5 p-4 bg-red-50 text-red-700 rounded-xl text-sm border border-red-100 flex gap-2"><span>⚠️</span>{error}</div>}

              <form onSubmit={handleForgotSend} className="space-y-5">
                <div>
                  <label className={labelCls}>Email or Phone</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input required type="text" value={fpIdentifier} onChange={e => setFpIdentifier(e.target.value)}
                      placeholder="seller@example.com or 9876543210" className={inputCls} />
                  </div>
                </div>
                <button type="submit" className={btnPrimary} disabled={isLoading || fpIdentifier.length < 5}>
                  {isLoading ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Sending...</> : <>Send OTP <ArrowRight className="w-4 h-4" /></>}
                </button>
              </form>
            </div>
          )}

          {/* ── OTP Verify ── */}
          {view === 'otp' && (
            <div>
              <button onClick={() => { setView('forgot'); clearErrors(); }}
                className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 mb-8">
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <div className="mb-8">
                <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center mb-4">
                  <Phone className="w-7 h-7 text-emerald-600" />
                </div>
                <h2 className="text-3xl font-bold text-slate-900 mb-1">Enter OTP</h2>
                <p className="text-slate-500 text-sm">Sent to <span className="font-semibold text-slate-700">{fpIdentifier}</span></p>
              </div>

              {successMsg && <div className="mb-5 p-4 bg-emerald-50 text-emerald-700 rounded-xl text-sm border border-emerald-100">✅ {successMsg}</div>}
              {error && <div className="mb-5 p-4 bg-red-50 text-red-700 rounded-xl text-sm border border-red-100 flex gap-2"><span>⚠️</span>{error}</div>}

              <form onSubmit={handleOtpVerify} className="space-y-5">
                <div>
                  <label className={labelCls}>4-Digit OTP</label>
                  <input
                    required type="text" value={fpOtp}
                    onChange={e => setFpOtp(e.target.value.replace(/\D/g, '').slice(0, 4))}
                    placeholder="● ● ● ●" maxLength={4}
                    className="w-full py-4 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-center tracking-[16px] text-2xl font-bold outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 focus:bg-white transition-all"
                  />
                </div>
                <button type="submit" className={btnPrimary} disabled={fpOtp.length < 4}>
                  Verify OTP <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}

          {/* ── Reset Password ── */}
          {view === 'reset' && (
            <div>
              <div className="mb-8">
                <div className="w-14 h-14 bg-teal-100 rounded-2xl flex items-center justify-center mb-4">
                  <Lock className="w-7 h-7 text-teal-600" />
                </div>
                <h2 className="text-3xl font-bold text-slate-900 mb-1">Set New Password</h2>
                <p className="text-slate-500 text-sm">Choose a strong password for your seller account.</p>
              </div>

              {error && <div className="mb-5 p-4 bg-red-50 text-red-700 rounded-xl text-sm border border-red-100 flex gap-2"><span>⚠️</span>{error}</div>}

              <form onSubmit={handleResetPassword} className="space-y-5">
                <div>
                  <label className={labelCls}>New Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input required type={showNewPassword ? 'text' : 'password'} value={fpNewPassword}
                      onChange={e => setFpNewPassword(e.target.value)} placeholder="Min. 6 characters"
                      className={`${inputCls} pr-11`} />
                    <button type="button" onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                      {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className={labelCls}>Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input required type="password" value={fpConfirmPassword}
                      onChange={e => setFpConfirmPassword(e.target.value)} placeholder="Re-enter password"
                      className={inputCls} />
                  </div>
                  {fpConfirmPassword && fpNewPassword !== fpConfirmPassword && (
                    <p className="text-xs text-red-500 mt-1">Passwords don't match</p>
                  )}
                </div>
                <button type="submit" className={btnPrimary} disabled={isLoading || fpNewPassword.length < 6}>
                  {isLoading ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Updating...</> : <>Update Password <ArrowRight className="w-4 h-4" /></>}
                </button>
              </form>
            </div>
          )}

          {/* ── Success ── */}
          {view === 'success' && (
            <div className="text-center">
              <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-emerald-600" />
              </div>
              <h2 className="text-3xl font-bold text-slate-900 mb-2">Password Updated!</h2>
              <p className="text-slate-500 text-sm mb-8">You can now sign in with your new password.</p>
              <button onClick={() => { setView('signin'); clearErrors(); }} className={btnPrimary}>
                Go to Sign In <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
