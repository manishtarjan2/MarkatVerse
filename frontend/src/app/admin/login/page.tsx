"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { Eye, EyeOff, Mail, Lock, ArrowRight, ArrowLeft, ShieldCheck } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const { login, user } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (user) {
      const role = user.role?.toUpperCase();
      if (role === 'ADMIN' || role === 'SUPER_ADMIN') {
        router.replace('/admin');
      } else if (['SELLER', 'BUSINESS'].includes(role)) {
        router.replace('/seller/dashboard');
      } else {
        router.replace('/');
      }
    }
  }, [user, router]);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed');

      if (data.user.role.toUpperCase() !== 'SUPER_ADMIN' && data.user.role.toUpperCase() !== 'ADMIN') {
        throw new Error('Unauthorized. Admin access required.');
      }

      login(
        { 
          id: data.user.id, 
          name: data.user.name, 
          email: data.user.email, 
          role: data.user.role.toLowerCase() as any, 
          phone: data.user.phone || '' 
        },
        data.access_token
      );
      router.push('/admin');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const inputCls = "w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100 focus:bg-white transition-all text-sm";
  const labelCls = "block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide";
  const btnPrimary = "w-full py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-white rounded-xl font-semibold transition-all shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-amber-50 to-orange-50 flex">
      
      {/* ── Left Branding Panel ── */}
      <div className="hidden lg:flex w-[440px] bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 relative overflow-hidden flex-col justify-between p-12 shrink-0">
        
        {/* Back Button */}
        <Link href="/" className="absolute top-8 left-8 text-slate-300 hover:text-white flex items-center gap-2 text-sm font-semibold z-20 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>

        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 border border-amber-500/30 rounded-full"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 border border-amber-500/20 rounded-full"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-white/5 rounded-full blur-3xl" />
        </div>

        {/* Logo */}
        <div className="relative z-10 mt-12">
          <img src="/logo.png" alt="MarkatVerse" className="h-16 brightness-0 invert object-contain" />
          <div className="mt-2 text-amber-400 text-sm font-bold tracking-widest uppercase">Admin Portal</div>
        </div>

        {/* Center Content */}
        <div className="relative z-10 mb-8">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-8">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span className="text-white/90 text-sm font-semibold">Authorized Access Only</span>
          </div>
          <h1 className="text-5xl font-extrabold text-white leading-tight mb-6">
            Command center for<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-amber-500">MarkatVerse</span>
          </h1>
          <p className="text-slate-200 text-base leading-relaxed mb-10">
            Manage sellers, moderate products, oversee finances, and keep the platform running smoothly — all from one dashboard.
          </p>
          
          {/* Features */}
          <div className="space-y-6">
            {[
              { icon: '🛡️', text: 'Review & verify new businesses' },
              { icon: '📊', text: 'Real-time platform metrics' },
              { icon: '👥', text: 'Full control over accounts' },
              { icon: '💰', text: 'Revenue & payout tracking' },
            ].map((f, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-xl shrink-0">{f.icon}</div>
                <span className="text-slate-200 text-base font-medium">{f.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Trust badges */}
        <div className="relative z-10 flex items-center gap-6 text-slate-400/60 text-xs">
          <span>🔒 End-to-End Encrypted</span>
          <span>🛡️ 2FA Protected</span>
          <span>📋 Audit Logged</span>
        </div>
      </div>

      {/* ── Right Form Panel ── */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 lg:p-12 overflow-y-auto">
        <div className="w-full max-w-[440px]">
          
          <div className="mb-8">
            <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center mb-4 lg:hidden">
              <ShieldCheck className="w-7 h-7 text-amber-600" />
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-1">Secure Admin Login</h2>
            <p className="text-slate-500 text-sm">Authorized Personnel Only</p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-5 p-3.5 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100 flex items-start gap-2">
              <span className="text-red-500 mt-0.5">⚠️</span> {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleAdminLogin} className="space-y-5">
            <div>
              <label className={labelCls}>Admin Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  required type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com" 
                  className={inputCls} 
                />
              </div>
            </div>

            <div>
              <label className={labelCls}>Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  required type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password" 
                  className={`${inputCls} pr-11`} 
                />
                <button 
                  type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button 
              type="submit" disabled={isLoading || email.length < 5}
              className={btnPrimary}
            >
              {isLoading ? (
                <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Authenticating...</>
              ) : (
                <>Secure Login <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          {/* Footer Link */}
          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <Link href="/login" className="text-xs text-slate-400 hover:text-slate-600 transition-colors">
              ← Return to Main Portal
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
