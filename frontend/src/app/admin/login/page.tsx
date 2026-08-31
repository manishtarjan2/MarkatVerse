"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function AdminLoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    setTimeout(() => {
      if (email === 'admin@markatverse.com' && password === 'admin123') {
        login({
          name: 'System Administrator',
          phone: '0000000000',
          email: email,
          role: 'admin'
        });
        setIsLoading(false);
        router.push('/admin');
      } else {
        setError('Invalid credentials. Please check your email and password.');
        setIsLoading(false);
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-amber-50 flex">
      
      {/* Left Side: Branding Panel */}
      <div className="hidden lg:flex w-[420px] bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 relative overflow-hidden flex-col justify-between p-10 shrink-0">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 border border-amber-500/30 rounded-full"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 border border-amber-500/20 rounded-full"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-amber-500/10 rounded-full"></div>
        </div>
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }}></div>

        {/* Logo */}
        <div className="relative z-10">
          <img src="/logo.png" alt="MarkatVerse" className="h-12 brightness-0 invert object-contain" />
          <div className="mt-1 text-amber-400 text-sm font-bold tracking-widest">ADMIN PORTAL</div>
        </div>

        {/* Center Content */}
        <div className="relative z-10 max-w-md">
          <h1 className="text-4xl font-bold text-white leading-tight mb-6">
            Command center for<br />
            <span className="text-amber-400">MarkatVerse</span>
          </h1>
          <p className="text-slate-300 text-base leading-relaxed mb-8">
            Manage sellers, moderate products, oversee finances, and keep the platform running smoothly — all from one dashboard.
          </p>
          
          {/* Features */}
          <div className="flex flex-col gap-4">
            {[
              { icon: '🛡️', title: 'Seller Approvals', desc: 'Review & verify new businesses' },
              { icon: '📊', title: 'Analytics Dashboard', desc: 'Real-time platform metrics' },
              { icon: '👥', title: 'User Management', desc: 'Full control over accounts' },
              { icon: '💰', title: 'Financial Overview', desc: 'Revenue & payout tracking' },
            ].map((f, i) => (
              <div key={i} className="flex items-center gap-3 bg-white/5 backdrop-blur-sm rounded-lg p-3">
                <span className="text-xl">{f.icon}</span>
                <div>
                  <div className="text-white text-base font-medium">{f.title}</div>
                  <div className="text-slate-400 text-sm">{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Trust badges */}
        <div className="relative z-10 flex items-center gap-6 text-slate-400 text-sm">
          <span className="flex items-center gap-1.5">🔒 End-to-End Encrypted</span>
          <span className="flex items-center gap-1.5">🛡️ 2FA Protected</span>
          <span className="flex items-center gap-1.5">📋 Audit Logged</span>
        </div>
      </div>

      {/* Right Side: Form Panel */}
      <div className="flex-1 flex flex-col p-6 lg:p-10 overflow-y-auto">
        <div className="w-full max-w-[600px] mx-auto">
          
          {/* Mobile Logo */}
          <div className="lg:hidden mb-6 text-center">
            <img src="/logo.png" alt="MarkatVerse" className="h-10 mx-auto object-contain" />
            <div className="text-amber-600 text-sm font-bold tracking-widest mt-1">ADMIN PORTAL</div>
          </div>

          {/* Admin Badge */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
            <div className="flex items-center justify-center gap-2.5 mb-6">
            <div className="w-11 h-11 bg-amber-100 border border-amber-200 rounded-xl flex items-center justify-center">
              <span className="text-xl">🛡️</span>
            </div>
            <div>
              <div className="text-slate-900 font-bold text-base">Secure Admin Login</div>
              <div className="text-slate-400 text-xs">Authorized Personnel Only</div>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 p-3.5 rounded-xl mb-6 text-sm text-center flex items-center justify-center gap-2">
              <span>⚠️</span> {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleAdminLogin} className="max-w-[360px] mx-auto">
            <div className="mb-5">
              <label className="block text-sm font-medium text-slate-700 mb-2">Admin Email</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-base">📧</span>
                <input 
                  required type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@markatverse.com" 
                  className="w-full p-3.5 pl-10 rounded-lg border border-slate-300 bg-white text-slate-900 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100 transition-all placeholder:text-slate-400 text-base" 
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-base">🔒</span>
                <input 
                  required type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••" 
                  className="w-full p-3.5 pl-10 pr-12 rounded-lg border border-slate-300 bg-white text-slate-900 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100 transition-all placeholder:text-slate-400 text-base" 
                />
                <button 
                  type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 cursor-pointer bg-transparent border-none text-base hover:text-slate-600"
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <button 
              type="submit" disabled={isLoading}
              className="w-full p-3.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-medium text-base cursor-pointer transition-all disabled:opacity-50 disabled:cursor-not-allowed border-none shadow-lg shadow-amber-500/20"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  Authenticating...
                </span>
              ) : 'Secure Login →'}
            </button>
          </form>

          {/* Demo Hint */}
          <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-200 max-w-[360px] mx-auto">
            <div className="text-xs text-slate-500 text-center">
              <span className="font-semibold text-slate-600">Demo Credentials</span><br/>
              Email: <span className="font-mono text-slate-700">admin@markatverse.com</span><br/>
              Password: <span className="font-mono text-slate-700">admin123</span>
            </div>
          </div>

          </div>

          {/* Footer Link */}
          <div className="mt-8 text-center">
            <Link href="/login" className="text-slate-400 text-sm hover:text-slate-600 transition-colors">
              ← Return to Buyer Login
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
