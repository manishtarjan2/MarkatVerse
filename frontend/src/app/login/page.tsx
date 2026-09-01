"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep(2);
    }, 1000);
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep(3);
    }, 1500);
  };

  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      login({
        name: `${firstName} ${lastName}`,
        phone: phone,
        email: email,
        role: 'buyer'
      });
      setIsLoading(false);
      router.push('/');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex">
      
      {/* Left Side: Branding Panel */}
      <div className="hidden lg:flex w-[420px] bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 relative overflow-hidden flex-col justify-between p-10 shrink-0">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 border border-white/30 rounded-full"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 border border-white/20 rounded-full"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-white/10 rounded-full"></div>
        </div>

        {/* Logo */}
        <div className="relative z-10">
          <img src="/logo.png" alt="MarkatVerse" className="h-12 brightness-0 invert object-contain" />
        </div>

        {/* Center Content */}
        <div className="relative z-10 max-w-md">
          <h1 className="text-4xl font-bold text-white leading-tight mb-6">
            Your gateway to the<br />
            <span className="text-amber-400">global marketplace</span>
          </h1>
          <p className="text-blue-100 text-base leading-relaxed mb-8">
            Join millions of buyers and sellers worldwide. Discover products, services, and opportunities — all in one place.
          </p>
          
          {/* Stats */}
          <div className="flex gap-8">
            <div>
              <div className="text-2xl font-bold text-white">10M+</div>
              <div className="text-sm text-blue-200 mt-1">Products</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">500K+</div>
              <div className="text-sm text-blue-200 mt-1">Sellers</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">200+</div>
              <div className="text-sm text-blue-200 mt-1">Countries</div>
            </div>
          </div>
        </div>

        {/* Trust badges */}
        <div className="relative z-10 flex items-center gap-6 text-blue-200 text-sm">
          <span className="flex items-center gap-1.5">🛡️ Secure Platform</span>
          <span className="flex items-center gap-1.5">🔒 Encrypted Data</span>
          <span className="flex items-center gap-1.5">✓ Verified Sellers</span>
        </div>
      </div>

      {/* Right Side: Form Panel */}
      <div className="flex-1 flex flex-col p-6 lg:p-10 overflow-y-auto">
        <div className="w-full max-w-[600px] mx-auto">
          
          {/* Mobile Logo (hidden on desktop) */}
          <div className="lg:hidden mb-8 text-center">
            <img src="/logo.png" alt="MarkatVerse" className="h-10 mx-auto object-contain" />
          </div>

          {/* Step Indicators */}
          <div className="flex items-center justify-center gap-2 mb-8">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-400'}`}>1</div>
            <div className={`w-8 h-0.5 ${step >= 2 ? 'bg-blue-600' : 'bg-slate-200'}`}></div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-400'}`}>2</div>
            <div className={`w-8 h-0.5 ${step >= 3 ? 'bg-blue-600' : 'bg-slate-200'}`}></div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 3 ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-400'}`}>3</div>
          </div>

          {/* STEP 1: Phone Number */}
          {step === 1 && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
              <h1 className="text-2xl font-bold text-slate-900 text-center mb-2">Welcome back</h1>
              <p className="text-slate-500 text-base text-center mb-8">
                Enter your mobile number to get started
              </p>

              <form onSubmit={handlePhoneSubmit} className="max-w-[360px] mx-auto">
                <label className="block text-sm font-medium text-slate-700 mb-2">Mobile Number</label>
                <div className="flex gap-3 mb-6">
                  <div className="w-[72px] flex items-center justify-center bg-slate-100 border border-slate-300 rounded-lg text-slate-500 text-base font-medium">
                    +91
                  </div>
                  <input 
                    required 
                    type="tel" 
                    value={phone} 
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="98765 43210" 
                    className="flex-1 px-4 py-3 rounded-lg border border-slate-300 bg-white text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all placeholder:text-slate-400 leading-normal" 
                  />
                </div>

                <button 
                  type="submit" 
                  className="w-full p-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed border-none cursor-pointer text-base" 
                  disabled={isLoading || phone.length < 10}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                      Sending OTP...
                    </span>
                  ) : 'Request OTP'}
                </button>

                {/* Divider */}
                <div className="flex items-center gap-4 my-6">
                  <div className="flex-1 h-px bg-slate-200"></div>
                  <span className="text-sm text-slate-400">or continue with</span>
                  <div className="flex-1 h-px bg-slate-200"></div>
                </div>

                {/* Social Logins */}
                <div className="flex gap-3">
                  <button type="button" className="flex-1 flex items-center justify-center gap-2 p-3 border border-slate-300 rounded-lg bg-white hover:bg-slate-50 transition-colors cursor-pointer text-base text-slate-700">
                    <span>🇬</span> Google
                  </button>
                  <button type="button" className="flex-1 flex items-center justify-center gap-2 p-3 border border-slate-300 rounded-lg bg-white hover:bg-slate-50 transition-colors cursor-pointer text-base text-slate-700">
                    <span>📧</span> Email
                  </button>
                </div>

                <p className="mt-6 text-xs text-slate-400 text-center leading-relaxed">
                  By continuing, you agree to MarkatVerse&apos;s{' '}
                  <span className="text-blue-600 cursor-pointer hover:underline">Terms of Use</span> and{' '}
                  <span className="text-blue-600 cursor-pointer hover:underline">Privacy Policy</span>.
                </p>
                
                <div className="mt-4 text-center">
                  <Link href="/admin/login" className="text-sm text-slate-400 hover:text-slate-600 transition-colors">
                    Admin Portal →
                  </Link>
                </div>
              </form>
            </div>
          )}

          {/* STEP 2: OTP Verification */}
          {step === 2 && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">📱</span>
              </div>
              <h1 className="text-2xl font-bold text-slate-900 text-center mb-2">Verify OTP</h1>
              <div className="text-slate-500 text-base text-center mb-1">
                We sent a 4-digit code to
              </div>
              <div className="text-slate-900 font-semibold text-center mb-1">+91 {phone}</div>
              <button 
                type="button"
                className="text-blue-600 text-sm cursor-pointer bg-transparent border-none mx-auto block mb-6 hover:underline" 
                onClick={() => setStep(1)}
              >
                Change Number
              </button>

              <form onSubmit={handleOtpSubmit} className="max-w-[360px] mx-auto">
                <label className="block text-sm font-medium text-slate-700 mb-2">Enter OTP</label>
                <input 
                  required 
                  type="text" 
                  value={otp} 
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="● ● ● ●" 
                  maxLength={4}
                  className="w-full p-3.5 rounded-lg border border-slate-300 bg-white text-slate-900 text-center tracking-[12px] text-lg font-bold outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all placeholder:tracking-[12px] placeholder:text-slate-300" 
                />
                
                <div className="flex justify-between items-center mt-3 mb-6">
                  <span className="text-sm text-slate-400">Didn&apos;t receive it?</span>
                  <button type="button" className="text-sm text-blue-600 cursor-pointer bg-transparent border-none hover:underline font-medium">
                    Resend OTP
                  </button>
                </div>

                <button 
                  type="submit" 
                  className="w-full p-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed border-none cursor-pointer text-base" 
                  disabled={isLoading || otp.length < 4}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                      Verifying...
                    </span>
                  ) : 'Verify & Continue'}
                </button>
              </form>
            </div>
          )}

          {/* STEP 3: Complete Profile */}
          {step === 3 && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
              <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">✅</span>
              </div>
              <h1 className="text-2xl font-bold text-slate-900 text-center mb-2">Almost there!</h1>
              <p className="text-emerald-600 text-sm text-center font-medium mb-1">
                ✓ Mobile verified successfully
              </p>
              <p className="text-slate-500 text-base text-center mb-8">
                Complete your profile to get started
              </p>

              <form onSubmit={handleDetailsSubmit} className="max-w-[360px] mx-auto">
                <div className="flex flex-col gap-4">
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-slate-700 mb-2">First Name</label>
                      <input 
                        required 
                        type="text" 
                        value={firstName} 
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="John" 
                        className="w-full p-3.5 rounded-lg border border-slate-300 bg-white text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all placeholder:text-slate-400" 
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-slate-700 mb-2">Last Name</label>
                      <input 
                        required 
                        type="text" 
                        value={lastName} 
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Doe" 
                        className="w-full p-3.5 rounded-lg border border-slate-300 bg-white text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all placeholder:text-slate-400" 
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Email Address <span className="text-slate-400">(Optional)</span></label>
                    <input 
                      type="email" 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="john@example.com" 
                      className="w-full p-3.5 rounded-lg border border-slate-300 bg-white text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all placeholder:text-slate-400" 
                    />
                  </div>

                  <button 
                    type="submit" 
                    className="w-full p-3.5 mt-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed border-none cursor-pointer text-base" 
                    disabled={isLoading || !firstName || !lastName}
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                        Creating Account...
                      </span>
                    ) : 'Continue to MarkatVerse →'}
                  </button>
                </div>
              </form>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
