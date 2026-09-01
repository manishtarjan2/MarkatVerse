"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  
  const [step, setStep] = useState<1 | 2>(1);
  const [isLogin, setIsLogin] = useState(true);
  
  // Form fields
  const [identifier, setIdentifier] = useState(''); // Email or Phone
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [name, setName] = useState(''); // Only for email signup
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const isPhone = !identifier.includes('@') && identifier.length >= 10;
  const isEmail = identifier.includes('@');

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPhone && !isEmail) {
      setError("Please enter a valid email or phone number.");
      return;
    }
    setError('');
    setIsLoading(true);
    
    // Simulate sending OTP if phone
    setTimeout(() => {
      setIsLoading(false);
      setStep(2);
    }, 1000);
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      let endpoint = '';
      let payload: any = {};

      if (isPhone) {
        // Phone flow: verify OTP (simulated) then call phone-login
        if (otp.length < 4) throw new Error("Invalid OTP");
        endpoint = '/auth/phone-login';
        payload = { phone: identifier };
      } else {
        // Email flow: login or signup
        endpoint = isLogin ? '/auth/login' : '/auth/signup';
        payload = { email: identifier, password };
        if (!isLogin) {
          payload.name = name;
          payload.role = 'CONSUMER';
        }
      }

      const res = await fetch(`http://localhost:3001${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || 'Authentication failed');
      }

      localStorage.setItem('token', data.access_token);
      
      login({
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        role: data.user.role.toLowerCase() as any,
        phone: data.user.phone || 'N/A'
      });
      
      router.push('/');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex">
      {/* Left Side: Branding Panel */}
      <div className="hidden lg:flex w-[420px] bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 relative overflow-hidden flex-col justify-between p-10 shrink-0">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 border border-white/30 rounded-full"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 border border-white/20 rounded-full"></div>
        </div>
        <div className="relative z-10">
          <img src="/logo.png" alt="MarkatVerse" className="h-12 brightness-0 invert object-contain" />
        </div>
        <div className="relative z-10 max-w-md">
          <h1 className="text-4xl font-bold text-white leading-tight mb-6">
            Your gateway to the<br />
            <span className="text-amber-400">global marketplace</span>
          </h1>
          <p className="text-blue-100 text-base leading-relaxed mb-8">
            Join millions of buyers and sellers worldwide. Discover products, services, and opportunities — all in one place.
          </p>
        </div>
        <div className="relative z-10 flex items-center gap-6 text-blue-200 text-sm">
          <span className="flex items-center gap-1.5">🛡️ Secure Platform</span>
          <span className="flex items-center gap-1.5">🔒 Encrypted Data</span>
        </div>
      </div>

      {/* Right Side: Form Panel */}
      <div className="flex-1 flex flex-col p-6 lg:p-10 overflow-y-auto items-center justify-center">
        <div className="w-full max-w-[400px]">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
            <h1 className="text-2xl font-bold text-slate-900 text-center mb-2">
              {step === 1 ? 'Welcome' : (isPhone ? 'Verify OTP' : (isLogin ? 'Welcome Back' : 'Create Account'))}
            </h1>
            <p className="text-slate-500 text-base text-center mb-8">
              {step === 1 ? 'Enter your email or mobile number' : (isPhone ? `Code sent to +91 ${identifier}` : 'Enter your password to continue')}
            </p>

            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm border border-red-100 text-center">
                {error}
              </div>
            )}

            {step === 1 ? (
              <form onSubmit={handleStep1Submit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email or Mobile Number</label>
                  <input 
                    required 
                    type="text" 
                    value={identifier} 
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="john@example.com or 9876543210" 
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-white text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all" 
                  />
                </div>
                
                <button 
                  type="submit" 
                  className="w-full p-3.5 mt-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50" 
                  disabled={isLoading || identifier.length < 5}
                >
                  {isLoading ? 'Processing...' : 'Continue'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleFinalSubmit} className="space-y-4">
                {isPhone ? (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Enter OTP</label>
                    <input 
                      required 
                      type="text" 
                      value={otp} 
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="● ● ● ●" 
                      maxLength={4}
                      className="w-full p-3.5 rounded-lg border border-slate-300 bg-white text-slate-900 text-center tracking-[12px] text-lg font-bold outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all" 
                    />
                  </div>
                ) : (
                  <>
                    {!isLogin && (
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                        <input 
                          required 
                          type="text" 
                          value={name} 
                          onChange={(e) => setName(e.target.value)}
                          placeholder="John Doe" 
                          className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-white text-slate-900 outline-none focus:border-blue-500" 
                        />
                      </div>
                    )}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                      <input 
                        required 
                        type="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••" 
                        className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-white text-slate-900 outline-none focus:border-blue-500" 
                      />
                    </div>
                  </>
                )}
                
                <button 
                  type="submit" 
                  className="w-full p-3.5 mt-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50" 
                  disabled={isLoading}
                >
                  {isLoading ? 'Verifying...' : (isPhone ? 'Verify & Continue' : (isLogin ? 'Login' : 'Sign Up'))}
                </button>

                <div className="text-center mt-4 flex justify-between px-2">
                  <button type="button" className="text-sm text-slate-500 hover:text-slate-700" onClick={() => setStep(1)}>
                    ← Back
                  </button>
                  {isEmail && (
                    <button type="button" className="text-sm text-blue-600 hover:underline" onClick={() => setIsLogin(!isLogin)}>
                      {isLogin ? "Need an account?" : "Have an account?"}
                    </button>
                  )}
                </div>
              </form>
            )}

            <div className="mt-8 text-center border-t border-slate-100 pt-6">
              <Link href="/admin/login" className="text-sm text-slate-400 hover:text-slate-600 transition-colors">
                Admin Portal →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
