"use client";
import React from 'react';
import { Shield, Globe, Users, TrendingUp } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <div className="bg-slate-900 py-24 text-center">
        <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight">
            About <span className="text-blue-500">MarkatVerse</span>
          </h1>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Your premium global marketplace connecting buyers, sellers, and services instantly and securely. We are redefining the future of commerce.
          </p>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-24">
          <div>
            <h2 className="text-3xl font-black text-slate-900 mb-6">Our Mission</h2>
            <p className="text-slate-600 mb-4 leading-relaxed text-lg">
              At MarkatVerse, our mission is to break down the barriers of traditional commerce. We empower local businesses and international sellers by providing a unified, secure, and intuitive platform to reach customers worldwide.
            </p>
            <p className="text-slate-600 leading-relaxed text-lg">
              Whether you are booking a service, shopping for electronics, or ordering wholesale, we ensure every transaction is transparent, fast, and secure.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Globe className="w-6 h-6 text-blue-600" />
              </div>
              <div className="font-bold text-slate-900 mb-1">Global Reach</div>
              <div className="text-sm text-slate-500">Connecting 100+ countries</div>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-emerald-600" />
              </div>
              <div className="font-bold text-slate-900 mb-1">Secure</div>
              <div className="text-sm text-slate-500">Bank-grade encryption</div>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <div className="font-bold text-slate-900 mb-1">Community</div>
              <div className="text-sm text-slate-500">Millions of active users</div>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center">
              <div className="w-12 h-12 bg-rose-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-6 h-6 text-rose-600" />
              </div>
              <div className="font-bold text-slate-900 mb-1">Growth</div>
              <div className="text-sm text-slate-500">Scaling your business</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
