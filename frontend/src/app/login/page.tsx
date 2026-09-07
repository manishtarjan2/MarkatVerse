"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { Eye, EyeOff, Mail, Phone, Lock, User, ArrowRight, ArrowLeft, CheckCircle, ShieldCheck } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

type View = 'signin' | 'register' | 'forgot' | 'otp' | 'reset-password' | 'success';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [view, setView] = useState<View>('signin');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Sign In fields
  const [siIdentifier, setSiIdentifier] = useState('');
  const [siPassword, setSiPassword] = useState('');

  // Register fields
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');

  // Forgot password fields
  const [fpIdentifier, setFpIdentifier] = useState('');
  const [fpOtp, setFpOtp] = useState('');
  const [fpResetToken, setFpResetToken] = useState('');
  const [fpNewPassword, setFpNewPassword] = useState('');
  const [fpConfirmPassword, setFpConfirmPassword] = useState('');

  const clearErrors = () => { setError(''); setSuccessMsg(''); };

  // ── Sign In ──────────────────────────────────────────────────
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    clearErrors();
    setIsLoading(true);
    try {
      const isPhone = !siIdentifier.includes('@') && siIdentifier.length >= 10;
      let endpoint: string;
      let payload: any;

      if (isPhone) {
        endpoint = '/auth/phone-login';
        payload = { phone: siIdentifier };
      } else {
        endpoint = '/auth/login';
        payload = { email: siIdentifier, password: siPassword };
      }

      const res = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(Array.isArray(data.message) ? data.message[0] : data.message || 'Sign in failed');

      login(
        { id: data.user.id, name: data.user.name, email: data.user.email, role: data.user.role.toLowerCase() as any, phone: data.user.phone || '' },
        data.access_token
      );
      router.push('/');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // ── Register ─────────────────────────────────────────────────
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    clearErrors();
    if (regPassword !== regConfirmPassword) { setError("Passwords do not match"); return; }
    if (regPassword.length < 6) { setError("Password must be at least 6 characters"); return; }
    if (!regEmail && !regPhone) { setError("Email or Phone is required"); return; }

    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: regName,
          email: regEmail || undefined,
          phone: regPhone || undefined,
          password: regPassword,
          role: 'CONSUMER',
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(Array.isArray(data.message) ? data.message[0] : data.message || 'Registration failed');

      login(
        { id: data.user.id, name: data.user.name, email: data.user.email, role: data.user.role.toLowerCase() as any, phone: data.user.phone || '' },
        data.access_token
      );
      router.push('/');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // ── Forgot Password Step 1: send OTP ─────────────────────────
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
      // Store reset token returned from backend (in prod this would come via email/SMS)
      setFpResetToken(data.reset_token);
      setSuccessMsg(`OTP sent! For demo, use any 4-digit code.`);
      setView('otp');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // ── Forgot Password Step 2: verify OTP ───────────────────────
  const handleOtpVerify = (e: React.FormEvent) => {
    e.preventDefault();
    clearErrors();
    if (fpOtp.length < 4) { setError("Please enter a valid 4-digit OTP"); return; }
    setView('reset-password');
  };

  // ── Forgot Password Step 3: new password ─────────────────────
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    clearErrors();
    if (fpNewPassword !== fpConfirmPassword) { setError("Passwords do not match"); return; }
    if (fpNewPassword.length < 6) { setError("Password must be at least 6 characters"); return; }

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

  const inputCls = "w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all text-sm";
  const labelCls = "block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide";
  const btnPrimary = "w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl font-semibold transition-all shadow-lg shadow-blue-600/20 hover:shadow-blue-600/40 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex">
      {/* ── Left Branding Panel ── */}
      <div className="hidden lg:flex w-[440px] bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 relative overflow-hidden flex-col justify-between p-12 shrink-0">
        {/* Decorative circles */}
        <div className="absolute top-[-80px] left-[-80px] w-[360px] h-[360px] border border-white/10 rounded-full" />
        <div className="absolute bottom-[-100px] right-[-100px] w-[440px] h-[440px] border border-white/10 rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-white/5 rounded-full blur-3xl" />

        <div className="relative z-10">
          <img src="/logo.png" alt="MarkatVerse" className="h-10 brightness-0 invert object-contain" />
        </div>

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-8">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="text-white/90 text-xs font-semibold">Trusted by 2M+ users</span>
          </div>
          <h1 className="text-4xl font-bold text-white leading-tight mb-5">
            Your gateway to the<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-amber-500">global marketplace</span>
          </h1>
          <p className="text-blue-100/80 text-sm leading-relaxed mb-10">
            Join millions of buyers and sellers worldwide. Discover products, services, and opportunities — all in one place.
          </p>

          <div className="space-y-4">
            {[
              { icon: '🛒', text: 'Shop from millions of products' },
              { icon: '💼', text: 'Sell and grow your business' },
              { icon: '🔒', text: 'Secure & encrypted payments' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center text-base shrink-0">{item.icon}</div>
                <span className="text-blue-100 text-sm">{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-6 text-blue-200/60 text-xs">
          <span>🛡️ Secure Platform</span>
          <span>🔒 SSL Encrypted</span>
          <span>✅ Verified Sellers</span>
        </div>
      </div>

      {/* ── Right Form Panel ── */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 lg:p-12 overflow-y-auto">
        <div className="w-full max-w-[440px]">

          {/* ── Sign In View ── */}
          {view === 'signin' && (
            <div>
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-slate-900 mb-1">Welcome back</h2>
                <p className="text-slate-500 text-sm">Sign in to your MarkatVerse account</p>
              </div>

              {/* Tabs */}
              <div className="flex bg-slate-100 rounded-xl p-1 mb-8">
                <button className="flex-1 py-2.5 text-sm font-semibold rounded-lg bg-white text-blue-600 shadow-sm transition-all">
                  Sign In
                </button>
                <button
                  onClick={() => { setView('register'); clearErrors(); }}
                  className="flex-1 py-2.5 text-sm font-semibold text-slate-500 hover:text-slate-700 transition-all"
                >
                  Register
                </button>
              </div>

              {error && (
                <div className="mb-5 p-3.5 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100 flex items-start gap-2">
                  <span className="text-red-500 mt-0.5">⚠️</span> {error}
                </div>
              )}

              <form onSubmit={handleSignIn} className="space-y-5">
                <div>
                  <label className={labelCls}>Email or Phone</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      required type="text" value={siIdentifier}
                      onChange={e => setSiIdentifier(e.target.value)}
                      placeholder="john@example.com or 9876543210"
                      className={inputCls}
                    />
                  </div>
                </div>

                {/* Only show password field if it looks like an email */}
                {siIdentifier.includes('@') && (
                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <label className={labelCls} style={{ margin: 0 }}>Password</label>
                      <button
                        type="button"
                        onClick={() => { setView('forgot'); clearErrors(); }}
                        className="text-xs text-blue-600 hover:text-blue-700 font-semibold hover:underline"
                      >
                        Forgot password?
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        required type={showPassword ? 'text' : 'password'} value={siPassword}
                        onChange={e => setSiPassword(e.target.value)}
                        placeholder="••••••••"
                        className={`${inputCls} pr-11`}
                      />
                      <button type="button" onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                )}

                <button type="submit" className={btnPrimary} disabled={isLoading || siIdentifier.length < 5}>
                  {isLoading
                    ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Signing in...</>
                    : <>{siIdentifier.includes('@') ? 'Sign In' : 'Continue with Phone'}<ArrowRight className="w-4 h-4" /></>
                  }
                </button>
              </form>

              <p className="text-center text-sm text-slate-500 mt-6">
                Don't have an account?{' '}
                <button onClick={() => { setView('register'); clearErrors(); }} className="text-blue-600 font-semibold hover:underline">
                  Create one free
                </button>
              </p>

              <div className="mt-8 pt-6 border-t border-slate-100 text-center">
                <Link href="/admin/login" className="text-xs text-slate-400 hover:text-slate-600 transition-colors">
                  Admin Portal →
                </Link>
              </div>
            </div>
          )}

          {/* ── Register View ── */}
          {view === 'register' && (
            <div>
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-slate-900 mb-1">Create account</h2>
                <p className="text-slate-500 text-sm">Join MarkatVerse for free today</p>
              </div>

              {/* Tabs */}
              <div className="flex bg-slate-100 rounded-xl p-1 mb-8">
                <button
                  onClick={() => { setView('signin'); clearErrors(); }}
                  className="flex-1 py-2.5 text-sm font-semibold text-slate-500 hover:text-slate-700 transition-all"
                >
                  Sign In
                </button>
                <button className="flex-1 py-2.5 text-sm font-semibold rounded-lg bg-white text-blue-600 shadow-sm transition-all">
                  Register
                </button>
              </div>

              {error && (
                <div className="mb-5 p-3.5 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100 flex items-start gap-2">
                  <span className="mt-0.5">⚠️</span> {error}
                </div>
              )}

              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label className={labelCls}>Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input required type="text" value={regName} onChange={e => setRegName(e.target.value)}
                      placeholder="John Doe" className={inputCls} />
                  </div>
                </div>

                <div>
                  <label className={labelCls}>Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input type="email" value={regEmail} onChange={e => setRegEmail(e.target.value)}
                      placeholder="john@example.com" className={inputCls} />
                  </div>
                </div>

                <div>
                  <label className={labelCls}>Phone Number <span className="normal-case font-normal text-slate-400">(optional if email given)</span></label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input type="tel" value={regPhone} onChange={e => setRegPhone(e.target.value)}
                      placeholder="9876543210" className={inputCls} />
                  </div>
                </div>

                <div>
                  <label className={labelCls}>Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input required type={showPassword ? 'text' : 'password'} value={regPassword}
                      onChange={e => setRegPassword(e.target.value)}
                      placeholder="Min. 6 characters" className={`${inputCls} pr-11`} />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className={labelCls}>Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input required type={showConfirmPassword ? 'text' : 'password'} value={regConfirmPassword}
                      onChange={e => setRegConfirmPassword(e.target.value)}
                      placeholder="Re-enter password" className={`${inputCls} pr-11`} />
                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {regConfirmPassword && regPassword !== regConfirmPassword && (
                    <p className="text-xs text-red-500 mt-1">Passwords don't match</p>
                  )}
                  {regConfirmPassword && regPassword === regConfirmPassword && regPassword.length >= 6 && (
                    <p className="text-xs text-emerald-500 mt-1 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Passwords match</p>
                  )}
                </div>

                <p className="text-xs text-slate-400">
                  By registering, you agree to our{' '}
                  <span className="text-blue-600 cursor-pointer hover:underline">Terms of Service</span> and{' '}
                  <span className="text-blue-600 cursor-pointer hover:underline">Privacy Policy</span>.
                </p>

                <button type="submit" className={btnPrimary} disabled={isLoading || !regName}>
                  {isLoading
                    ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Creating account...</>
                    : <>Create Account <ArrowRight className="w-4 h-4" /></>
                  }
                </button>
              </form>

              <p className="text-center text-sm text-slate-500 mt-6">
                Already have an account?{' '}
                <button onClick={() => { setView('signin'); clearErrors(); }} className="text-blue-600 font-semibold hover:underline">
                  Sign In
                </button>
              </p>
            </div>
          )}

          {/* ── Forgot Password Step 1 ── */}
          {view === 'forgot' && (
            <div>
              <button onClick={() => { setView('signin'); clearErrors(); }}
                className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 mb-8 transition-colors">
                <ArrowLeft className="w-4 h-4" /> Back to Sign In
              </button>
              <div className="mb-8">
                <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mb-4">
                  <Lock className="w-7 h-7 text-blue-600" />
                </div>
                <h2 className="text-3xl font-bold text-slate-900 mb-1">Forgot password?</h2>
                <p className="text-slate-500 text-sm">Enter your registered email or phone and we'll send you an OTP to reset your password.</p>
              </div>

              {error && (
                <div className="mb-5 p-3.5 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100 flex items-start gap-2">
                  <span className="mt-0.5">⚠️</span> {error}
                </div>
              )}

              <form onSubmit={handleForgotSend} className="space-y-5">
                <div>
                  <label className={labelCls}>Email or Phone Number</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input required type="text" value={fpIdentifier} onChange={e => setFpIdentifier(e.target.value)}
                      placeholder="john@example.com or 9876543210" className={inputCls} />
                  </div>
                </div>

                <button type="submit" className={btnPrimary} disabled={isLoading || fpIdentifier.length < 5}>
                  {isLoading
                    ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Sending OTP...</>
                    : <>Send OTP <ArrowRight className="w-4 h-4" /></>
                  }
                </button>
              </form>
            </div>
          )}

          {/* ── OTP Verification ── */}
          {view === 'otp' && (
            <div>
              <button onClick={() => { setView('forgot'); clearErrors(); }}
                className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 mb-8 transition-colors">
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <div className="mb-8">
                <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center mb-4">
                  <Mail className="w-7 h-7 text-emerald-600" />
                </div>
                <h2 className="text-3xl font-bold text-slate-900 mb-1">Enter OTP</h2>
                <p className="text-slate-500 text-sm">
                  A 4-digit OTP was sent to <span className="font-semibold text-slate-700">{fpIdentifier}</span>
                </p>
              </div>

              {successMsg && (
                <div className="mb-5 p-3.5 bg-emerald-50 text-emerald-700 rounded-xl text-sm border border-emerald-100">
                  ✅ {successMsg}
                </div>
              )}
              {error && (
                <div className="mb-5 p-3.5 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100 flex items-start gap-2">
                  <span className="mt-0.5">⚠️</span> {error}
                </div>
              )}

              <form onSubmit={handleOtpVerify} className="space-y-5">
                <div>
                  <label className={labelCls}>4-Digit OTP</label>
                  <input
                    required type="text" value={fpOtp} onChange={e => setFpOtp(e.target.value.replace(/\D/g, '').slice(0, 4))}
                    placeholder="● ● ● ●" maxLength={4}
                    className="w-full py-4 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-center tracking-[16px] text-2xl font-bold outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all"
                  />
                </div>

                <button type="submit" className={btnPrimary} disabled={fpOtp.length < 4}>
                  Verify OTP <ArrowRight className="w-4 h-4" />
                </button>

                <p className="text-center text-sm text-slate-500">
                  Didn't receive it?{' '}
                  <button type="button" onClick={handleForgotSend as any} className="text-blue-600 font-semibold hover:underline">
                    Resend OTP
                  </button>
                </p>
              </form>
            </div>
          )}

          {/* ── Reset Password ── */}
          {view === 'reset-password' && (
            <div>
              <div className="mb-8">
                <div className="w-14 h-14 bg-indigo-100 rounded-2xl flex items-center justify-center mb-4">
                  <Lock className="w-7 h-7 text-indigo-600" />
                </div>
                <h2 className="text-3xl font-bold text-slate-900 mb-1">Set new password</h2>
                <p className="text-slate-500 text-sm">Choose a strong password for your account.</p>
              </div>

              {error && (
                <div className="mb-5 p-3.5 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100 flex items-start gap-2">
                  <span className="mt-0.5">⚠️</span> {error}
                </div>
              )}

              <form onSubmit={handleResetPassword} className="space-y-5">
                <div>
                  <label className={labelCls}>New Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input required type={showPassword ? 'text' : 'password'} value={fpNewPassword}
                      onChange={e => setFpNewPassword(e.target.value)} placeholder="Min. 6 characters"
                      className={`${inputCls} pr-11`} />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className={labelCls}>Confirm New Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input required type={showConfirmPassword ? 'text' : 'password'} value={fpConfirmPassword}
                      onChange={e => setFpConfirmPassword(e.target.value)} placeholder="Re-enter password"
                      className={`${inputCls} pr-11`} />
                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {fpConfirmPassword && fpNewPassword !== fpConfirmPassword && (
                    <p className="text-xs text-red-500 mt-1">Passwords don't match</p>
                  )}
                </div>

                <button type="submit" className={btnPrimary} disabled={isLoading || fpNewPassword.length < 6}>
                  {isLoading
                    ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Updating...</>
                    : <>Update Password <ArrowRight className="w-4 h-4" /></>
                  }
                </button>
              </form>
            </div>
          )}

          {/* ── Success View ── */}
          {view === 'success' && (
            <div className="text-center">
              <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-emerald-600" />
              </div>
              <h2 className="text-3xl font-bold text-slate-900 mb-2">Password Updated!</h2>
              <p className="text-slate-500 text-sm mb-8">Your password has been successfully reset. You can now sign in with your new password.</p>
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
