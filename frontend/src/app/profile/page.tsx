"use client";
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Package, Heart, FileText, Settings, LogOut, ChevronRight, MapPin, CreditCard, Bell, Shield, Camera } from 'lucide-react';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  if (!user) return null;

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20">
      
      {/* Cover Photo Area */}
      <div className="h-64 md:h-80 w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-20 w-96 h-96 bg-white rounded-full blur-3xl mix-blend-overlay"></div>
          <div className="absolute bottom-10 right-20 w-96 h-96 bg-blue-300 rounded-full blur-3xl mix-blend-overlay"></div>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-10">
        
        {/* Profile Header Card */}
        <div className="bg-white/80 backdrop-blur-xl border border-white rounded-3xl p-6 md:p-10 shadow-xl shadow-slate-200/50 flex flex-col md:flex-row items-center md:items-start gap-8 mb-8">
          
          {/* Avatar */}
          <div className="relative group">
            <div className="w-32 h-32 md:w-40 md:h-40 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full border-4 border-white shadow-lg flex items-center justify-center text-5xl font-bold text-white relative overflow-hidden">
              {getInitials(user.name)}
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <Camera className="w-8 h-8 text-white" />
              </div>
            </div>
            {user.role.toLowerCase() === 'elite' && (
              <div className="absolute -bottom-2 right-2 md:right-4 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full border-2 border-white shadow-sm flex items-center gap-1">
                <span className="text-[10px]">⭐</span> Elite
              </div>
            )}
          </div>

          {/* User Info */}
          <div className="flex-1 text-center md:text-left mt-2">
            <h1 className="text-3xl font-bold text-slate-900">{user.name}</h1>
            <p className="text-slate-500 font-medium mt-1 flex items-center justify-center md:justify-start gap-2">
              <span className="flex items-center gap-1"><MailIcon className="w-4 h-4" /> {user.email || 'No email provided'}</span>
              <span className="text-slate-300">•</span>
              <span className="flex items-center gap-1"><PhoneIcon className="w-4 h-4" /> +91 {user.phone}</span>
            </p>
            
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-6">
              <span className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg text-sm font-semibold border border-blue-100">
                Customer Since 2026
              </span>
              <span className="bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-lg text-sm font-semibold border border-emerald-100 flex items-center gap-1">
                <Shield className="w-4 h-4" /> Verified Profile
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 w-full md:w-auto">
            <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all shadow-md shadow-blue-600/20 text-sm w-full">
              Edit Profile
            </button>
            <button 
              onClick={() => {
                logout();
                router.push('/');
              }}
              className="px-6 py-3 bg-white hover:bg-red-50 text-red-600 border border-slate-200 hover:border-red-200 rounded-xl font-bold transition-all text-sm w-full flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>
        </div>

        {/* Dashboard Layout */}
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar */}
          <div className="w-full lg:w-72 shrink-0">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-4 sticky top-6">
              <nav className="flex flex-col gap-1">
                <NavItem icon={<Package />} label="Overview" active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} />
                <NavItem icon={<Package />} label="My Orders" active={activeTab === 'orders'} onClick={() => setActiveTab('orders')} badge="3" />
                <NavItem icon={<FileText />} label="B2B Quotes (RFQs)" active={activeTab === 'quotes'} onClick={() => setActiveTab('quotes')} badge="1" />
                <NavItem icon={<Heart />} label="Wishlist" active={activeTab === 'wishlist'} onClick={() => router.push('/wishlist')} />
                
                <div className="h-px bg-slate-100 my-4 mx-2"></div>
                
                <NavItem icon={<MapPin />} label="Saved Addresses" active={activeTab === 'addresses'} onClick={() => setActiveTab('addresses')} />
                <NavItem icon={<CreditCard />} label="Payment Methods" active={activeTab === 'payments'} onClick={() => setActiveTab('payments')} />
                <NavItem icon={<Bell />} label="Notifications" active={activeTab === 'notifications'} onClick={() => setActiveTab('notifications')} />
                <NavItem icon={<Settings />} label="Account Settings" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
              </nav>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1">
            
            {activeTab === 'overview' && (
              <div className="animate-in fade-in duration-300">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Dashboard Overview</h2>
                
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <StatCard title="Total Orders" value="12" subtitle="2 active orders" icon={<Package className="w-6 h-6 text-blue-600" />} bg="bg-blue-50" />
                  <StatCard title="Active Quotes" value="3" subtitle="Waiting for seller" icon={<FileText className="w-6 h-6 text-amber-600" />} bg="bg-amber-50" />
                  <StatCard title="Saved Items" value="28" subtitle="In wishlist" icon={<Heart className="w-6 h-6 text-rose-600" />} bg="bg-rose-50" />
                </div>

                {/* Recent Activity */}
                <h3 className="text-xl font-bold text-slate-900 mb-4">Recent Activity</h3>
                <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="divide-y divide-slate-100">
                    <ActivityRow title="Order Placed: iPhone 15 Pro Max" date="Today, 10:45 AM" status="Processing" statusColor="text-blue-600 bg-blue-50" />
                    <ActivityRow title="Quote Requested: Heavy Freight Movers" date="Yesterday, 2:30 PM" status="Pending" statusColor="text-amber-600 bg-amber-50" />
                    <ActivityRow title="Order Delivered: boAt Airdopes" date="Aug 28, 2026" status="Completed" statusColor="text-emerald-600 bg-emerald-50" />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="animate-in fade-in duration-300">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">My Orders</h2>
                <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-10 text-center flex flex-col items-center justify-center">
                  <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-4">
                    <Package className="w-10 h-10" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">No Active Orders</h3>
                  <p className="text-slate-500 mb-6 max-w-md mx-auto">Looks like you haven't placed any orders recently. Explore the marketplace to find great deals.</p>
                  <button onClick={() => router.push('/')} className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl shadow-md shadow-blue-600/20">Start Shopping</button>
                </div>
              </div>
            )}

            {activeTab === 'quotes' && (
              <div className="animate-in fade-in duration-300">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">B2B Quotes & RFQs</h2>
                <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <div>
                      <h3 className="font-bold text-slate-900 text-lg">Heavy Freight Transport Services</h3>
                      <p className="text-sm text-slate-500">RFQ-88921 • Sent to Logistics Pro</p>
                    </div>
                    <span className="px-3 py-1 bg-amber-100 text-amber-700 font-bold text-xs rounded-full">PENDING REPLY</span>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
                      <div>
                        <div className="text-xs text-slate-500 font-medium mb-1">Quantity Req.</div>
                        <div className="font-bold text-slate-900">50 Units</div>
                      </div>
                      <div>
                        <div className="text-xs text-slate-500 font-medium mb-1">Date Sent</div>
                        <div className="font-bold text-slate-900">Sep 1, 2026</div>
                      </div>
                      <div>
                        <div className="text-xs text-slate-500 font-medium mb-1">Target Price</div>
                        <div className="font-bold text-slate-900">₹45,000 / unit</div>
                      </div>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                      <div className="text-xs text-slate-500 font-medium mb-2">Message to Seller</div>
                      <p className="text-slate-700 text-sm leading-relaxed">
                        "We are looking for long term partnership for freight delivery across North India. Please provide your best quote for 50 units per month."
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}

// Helper Components
function NavItem({ icon, label, active, onClick, badge }: any) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all cursor-pointer border-none font-semibold text-sm ${
        active ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20' : 'bg-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-900'
      }`}
    >
      <div className="flex items-center gap-3">
        {React.cloneElement(icon, { className: 'w-5 h-5' })}
        {label}
      </div>
      {badge && (
        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${active ? 'bg-white/20 text-white' : 'bg-blue-100 text-blue-700'}`}>
          {badge}
        </span>
      )}
      {!badge && <ChevronRight className={`w-4 h-4 ${active ? 'opacity-100' : 'opacity-0 -translate-x-2'} transition-all`} />}
    </button>
  );
}

function StatCard({ title, value, subtitle, icon, bg }: any) {
  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className={`w-12 h-12 ${bg} rounded-2xl flex items-center justify-center`}>
          {icon}
        </div>
      </div>
      <div>
        <div className="text-3xl font-bold text-slate-900 mb-1">{value}</div>
        <div className="text-slate-900 font-semibold">{title}</div>
        <div className="text-slate-500 text-sm mt-1">{subtitle}</div>
      </div>
    </div>
  );
}

function ActivityRow({ title, date, status, statusColor }: any) {
  return (
    <div className="flex items-center justify-between p-5 hover:bg-slate-50 transition-colors cursor-pointer group">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 group-hover:bg-white group-hover:shadow-sm transition-all border border-transparent group-hover:border-slate-200">
          <Package className="w-5 h-5" />
        </div>
        <div>
          <div className="font-bold text-slate-900 text-sm">{title}</div>
          <div className="text-slate-500 text-xs mt-1">{date}</div>
        </div>
      </div>
      <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusColor}`}>
        {status}
      </span>
    </div>
  );
}

// Missing icons for mock user info
function MailIcon(props: any) {
  return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>;
}
function PhoneIcon(props: any) {
  return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>;
}
