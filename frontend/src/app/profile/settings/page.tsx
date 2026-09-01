"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { User, CreditCard, MapPin, Package, Settings, Camera, ShieldCheck, Bell, ChevronRight, LogOut, Edit3, Trash2, Plus, Star } from 'lucide-react';

export default function ProfileSettings() {
  const [activeTab, setActiveTab] = useState('personal');
  const { user, logout } = useAuth();
  
  // Fallbacks if user is null
  const [firstName, lastName] = user?.name ? user.name.split(' ') : ['Amit', 'Verma'];
  const email = user?.email || 'amit.verma@example.com';
  const phone = user?.phone || '+91 98765 43210';

  const navItems = [
    { id: 'personal', label: 'Personal Info', icon: <User className="w-5 h-5" /> },
    { id: 'elite', label: 'Elite Membership', icon: <Star className="w-5 h-5 text-amber-500" /> },
    { id: 'payment', label: 'Payment Methods', icon: <CreditCard className="w-5 h-5" /> },
    { id: 'shipping', label: 'Shipping Addresses', icon: <MapPin className="w-5 h-5" /> },
    { id: 'orders', label: 'Order History', icon: <Package className="w-5 h-5" /> },
    { id: 'security', label: 'Security & Privacy', icon: <ShieldCheck className="w-5 h-5" /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen bg-slate-950 py-10 px-4 sm:px-6 relative overflow-hidden font-sans">
      {/* Dynamic Background Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] mix-blend-screen pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-[100px] mix-blend-screen pointer-events-none"></div>

      <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row gap-8 relative z-10">
        
        {/* Sidebar Navigation */}
        <aside className="w-full md:w-[300px] shrink-0">
          <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col h-full relative overflow-hidden">
            {/* Glossy top edge highlight */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

            <div className="text-center mb-10 relative">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 p-1 mx-auto mb-4 relative shadow-lg shadow-blue-500/20 group cursor-pointer">
                <div className="w-full h-full bg-slate-900 rounded-full flex items-center justify-center relative overflow-hidden">
                  <span className="text-3xl font-bold text-white tracking-widest">{firstName[0]}{lastName[0]}</span>
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Camera className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div className="absolute bottom-0 right-0 w-8 h-8 bg-emerald-500 rounded-full border-4 border-slate-900 flex items-center justify-center">
                  <span className="w-3 h-3 bg-white rounded-full"></span>
                </div>
              </div>
              <h3 className="text-xl font-bold text-white mb-1">{user?.name || 'Amit Verma'}</h3>
              <div className="text-blue-400 text-sm font-medium">{email}</div>
              <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-xs font-semibold text-slate-300">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Fully Verified
              </div>
            </div>
            
            <nav className="flex flex-col gap-2 flex-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all duration-300 group ${
                    activeTab === item.id 
                      ? 'bg-blue-600/10 border-blue-500/30 text-blue-400 border shadow-[inset_0_0_20px_rgba(37,99,235,0.1)]' 
                      : 'bg-transparent border-transparent text-slate-400 hover:bg-white/5 border hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className={`transition-transform duration-300 ${activeTab === item.id ? 'scale-110' : 'group-hover:scale-110'}`}>
                      {item.icon}
                    </span>
                    <span className="font-semibold text-sm">{item.label}</span>
                  </div>
                  {activeTab === item.id && <ChevronRight className="w-4 h-4 text-blue-500 animate-pulse" />}
                </button>
              ))}
            </nav>

            <div className="mt-8 pt-6 border-t border-slate-800">
              <button 
                onClick={() => {
                  logout();
                  window.location.href = '/login';
                }}
                className="w-full flex items-center gap-3 p-4 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors font-semibold text-sm">
                <LogOut className="w-5 h-5" /> Sign Out
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1">
          <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 lg:p-12 shadow-2xl min-h-full relative overflow-hidden">
            {/* Top highlight line */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent"></div>

            {activeTab === 'personal' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex justify-between items-end mb-8 border-b border-slate-800 pb-6">
                  <div>
                    <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">Personal Information</h2>
                    <p className="text-slate-400 text-sm">Update your profile details and contact information.</p>
                  </div>
                  <button className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 transition-colors border border-slate-700">
                    <Edit3 className="w-5 h-5" />
                  </button>
                </div>

                <form className="grid grid-cols-1 md:grid-cols-2 gap-8" onSubmit={(e) => { e.preventDefault(); alert('Profile Saved!'); }}>
                  <div className="group">
                    <label className="block mb-2 text-xs font-bold tracking-widest uppercase text-slate-400 group-focus-within:text-blue-400 transition-colors">First Name</label>
                    <input 
                      type="text" 
                      defaultValue={firstName} 
                      className="w-full p-4 bg-slate-950/50 border border-slate-700 rounded-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-white transition-all shadow-inner font-medium text-lg" 
                    />
                  </div>
                  <div className="group">
                    <label className="block mb-2 text-xs font-bold tracking-widest uppercase text-slate-400 group-focus-within:text-blue-400 transition-colors">Last Name</label>
                    <input 
                      type="text" 
                      defaultValue={lastName} 
                      className="w-full p-4 bg-slate-950/50 border border-slate-700 rounded-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-white transition-all shadow-inner font-medium text-lg" 
                    />
                  </div>

                  <div className="md:col-span-2 group">
                    <label className="block mb-2 text-xs font-bold tracking-widest uppercase text-slate-400 group-focus-within:text-blue-400 transition-colors">Email Address</label>
                    <div className="relative">
                      <input 
                        type="email" 
                        defaultValue={email} 
                        className="w-full p-4 pl-12 bg-slate-950/50 border border-slate-700 rounded-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-white transition-all shadow-inner font-medium text-lg" 
                      />
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                    </div>
                  </div>

                  <div className="md:col-span-2 group">
                    <label className="block mb-2 text-xs font-bold tracking-widest uppercase text-slate-400 group-focus-within:text-blue-400 transition-colors">Phone Number</label>
                    <div className="relative">
                      <input 
                        type="tel" 
                        defaultValue={phone} 
                        className="w-full p-4 pl-12 bg-slate-950/50 border border-slate-700 rounded-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-white transition-all shadow-inner font-medium text-lg" 
                      />
                      <PhoneIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                    </div>
                  </div>

                  <div className="md:col-span-2 mt-4 pt-6 border-t border-slate-800 flex justify-end gap-4">
                    <button type="button" className="px-6 py-3 rounded-xl font-bold text-slate-300 hover:text-white transition-colors">
                      Cancel
                    </button>
                    <button type="submit" className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 hover:-translate-y-0.5 active:translate-y-0">
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            )}

            {activeTab === 'elite' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex justify-between items-end mb-8 border-b border-slate-800 pb-6">
                  <div>
                    <h2 className="text-3xl font-bold text-white mb-2 tracking-tight flex items-center gap-3">
                      <Star className="w-8 h-8 text-amber-500 fill-amber-500" /> Elite Membership
                    </h2>
                    <p className="text-slate-400 text-sm">Unlock wholesale pricing, direct seller contact, and priority support.</p>
                  </div>
                </div>
                
                <div className="max-w-3xl mx-auto">
                  <div className="relative p-1 rounded-3xl bg-gradient-to-br from-amber-400 via-amber-600 to-amber-900 shadow-[0_0_40px_rgba(245,158,11,0.2)]">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/20 rounded-full blur-3xl -mr-20 -mt-20"></div>
                    <div className="bg-slate-950 rounded-[22px] p-8 lg:p-12 relative z-10 overflow-hidden">
                      {/* Decorative elements */}
                      <div className="absolute top-0 right-0 p-8 opacity-10">
                        <Star className="w-48 h-48 text-amber-500 fill-amber-500" />
                      </div>
                      
                      <div className="flex flex-col md:flex-row gap-8 items-center md:items-start relative z-10">
                        <div className="flex-1">
                          <div className="inline-block px-3 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold text-xs uppercase tracking-widest rounded-full mb-4">
                            Premium Plan
                          </div>
                          <h3 className="text-4xl font-bold text-white mb-4">MarkatVerse <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-200">Elite</span></h3>
                          
                          <ul className="space-y-4 mb-8">
                            <li className="flex items-center gap-3 text-slate-300">
                              <ShieldCheck className="w-5 h-5 text-amber-500 shrink-0" />
                              <span>Access to <strong className="text-white">Wholesale Pricing</strong> on retail items</span>
                            </li>
                            <li className="flex items-center gap-3 text-slate-300">
                              <ShieldCheck className="w-5 h-5 text-amber-500 shrink-0" />
                              <span>Directly <strong className="text-white">call and contact suppliers</strong></span>
                            </li>
                            <li className="flex items-center gap-3 text-slate-300">
                              <ShieldCheck className="w-5 h-5 text-amber-500 shrink-0" />
                              <span>0% Platform convenience fees on bulk orders</span>
                            </li>
                            <li className="flex items-center gap-3 text-slate-300">
                              <ShieldCheck className="w-5 h-5 text-amber-500 shrink-0" />
                              <span>24/7 Priority VIP Support</span>
                            </li>
                          </ul>
                        </div>
                        
                        <div className="w-full md:w-[280px] bg-slate-900 rounded-2xl p-6 border border-slate-800 text-center shrink-0">
                          <div className="text-slate-400 text-sm font-semibold mb-2">Annual Subscription</div>
                          <div className="text-5xl font-bold text-white mb-2">₹1,999</div>
                          <div className="text-slate-500 text-xs mb-6">per year, billed annually</div>
                          
                          <button 
                            className="w-full py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-900 rounded-xl font-bold text-lg transition-all shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:shadow-[0_0_30px_rgba(245,158,11,0.5)] hover:-translate-y-0.5 active:translate-y-0"
                            onClick={() => alert("Redirecting to Elite payment gateway...")}
                          >
                            Upgrade to Elite
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'payment' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">Payment Methods</h2>
                <p className="text-slate-400 text-sm mb-8 border-b border-slate-800 pb-6">Manage your saved cards and preferred payment options securely.</p>
                
                <h3 className="text-sm font-bold tracking-widest uppercase text-slate-400 mb-4">Saved Credit/Debit Cards</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                  {/* Mock Card */}
                  <div className="relative p-6 bg-gradient-to-br from-indigo-900 to-slate-900 rounded-2xl border border-indigo-500/30 shadow-xl overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl -mr-10 -mt-10"></div>
                    <div className="flex justify-between items-start mb-8 relative z-10">
                      <div className="text-indigo-300 font-bold tracking-widest">HDFC VISA</div>
                      <button className="text-slate-400 hover:text-red-400 transition-colors p-1 bg-slate-900/50 rounded-md backdrop-blur-md opacity-0 group-hover:opacity-100">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="text-2xl font-mono text-white tracking-widest mb-6 relative z-10">**** **** **** 4111</div>
                    <div className="flex justify-between items-end relative z-10">
                      <div>
                        <div className="text-[10px] text-indigo-300 uppercase tracking-widest mb-1">Card Holder</div>
                        <div className="text-white font-medium text-sm">{firstName} {lastName}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-indigo-300 uppercase tracking-widest mb-1">Expires</div>
                        <div className="text-white font-medium text-sm">12/28</div>
                      </div>
                    </div>
                  </div>

                  {/* Add New Card Button */}
                  <button className="flex flex-col items-center justify-center gap-3 p-6 border-2 border-dashed border-slate-700 rounded-2xl text-slate-400 hover:border-blue-500 hover:text-blue-400 hover:bg-blue-500/5 transition-all group">
                    <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center group-hover:bg-blue-500/20 group-hover:scale-110 transition-all">
                      <Plus className="w-6 h-6" />
                    </div>
                    <span className="font-bold text-sm">Add New Card</span>
                  </button>
                </div>

                <h3 className="text-sm font-bold tracking-widest uppercase text-slate-400 mb-4">Saved UPI IDs</h3>
                <div className="bg-slate-950/50 border border-slate-800 rounded-xl p-4 flex items-center justify-between max-w-md">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-500/20 text-emerald-400 rounded-lg flex items-center justify-center font-bold">U</div>
                    <div>
                      <div className="text-white font-medium">{email.split('@')[0]}@okicici</div>
                      <div className="text-xs text-slate-500">Verified</div>
                    </div>
                  </div>
                  <button className="text-slate-400 hover:text-red-400 transition-colors p-2">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'shipping' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex justify-between items-end mb-8 border-b border-slate-800 pb-6">
                  <div>
                    <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">Shipping Addresses</h2>
                    <p className="text-slate-400 text-sm">Manage where your orders get delivered.</p>
                  </div>
                  <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-sm transition-colors shadow-lg shadow-blue-600/20 flex items-center gap-2">
                    <Plus className="w-4 h-4" /> Add Address
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Address 1 - Default */}
                  <div className="bg-slate-950/50 border border-amber-500/40 rounded-2xl p-6 relative shadow-[0_0_15px_rgba(245,158,11,0.05)]">
                    <div className="absolute top-0 right-0 bg-amber-500 text-amber-950 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-bl-xl rounded-tr-2xl">Default</div>
                    <div className="flex items-center gap-3 mb-4 text-white font-bold text-lg">
                      <MapPin className="w-5 h-5 text-amber-500" /> Home
                    </div>
                    <div className="text-slate-300 text-sm leading-relaxed mb-6">
                      <span className="text-white font-semibold">{firstName} {lastName}</span><br/>
                      123 Tech Park, Phase 2, Whitefield<br/>
                      Bengaluru, Karnataka 560066<br/>
                      India<br/>
                      {phone}
                    </div>
                    <div className="flex gap-4 border-t border-slate-800 pt-4">
                      <button className="text-sm font-semibold text-blue-400 hover:text-blue-300">Edit</button>
                      <button className="text-sm font-semibold text-slate-500 hover:text-red-400">Remove</button>
                    </div>
                  </div>

                  {/* Address 2 */}
                  <div className="bg-slate-950/50 border border-slate-800 rounded-2xl p-6 relative hover:border-slate-600 transition-colors group">
                    <div className="flex items-center gap-3 mb-4 text-white font-bold text-lg">
                      <BuildingIcon className="w-5 h-5 text-slate-500" /> Office
                    </div>
                    <div className="text-slate-400 text-sm leading-relaxed mb-6">
                      <span className="text-white font-semibold">{firstName} {lastName} (Global Exports LLC)</span><br/>
                      45 Business Center, MG Road<br/>
                      Bengaluru, Karnataka 560001<br/>
                      India<br/>
                      +91 99999 88888
                    </div>
                    <div className="flex gap-4 border-t border-slate-800 pt-4">
                      <button className="text-sm font-semibold text-blue-400 hover:text-blue-300">Edit</button>
                      <button className="text-sm font-semibold text-slate-500 hover:text-red-400">Remove</button>
                      <button className="text-sm font-semibold text-slate-500 hover:text-white ml-auto opacity-0 group-hover:opacity-100 transition-opacity">Set Default</button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Placeholder for other tabs */}
            {['orders', 'security', 'notifications'].includes(activeTab) && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 flex flex-col items-center justify-center py-20 text-center">
                <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center mb-6 shadow-inner border border-slate-800">
                  {activeTab === 'orders' && <Package className="w-10 h-10 text-slate-600" />}
                  {activeTab === 'security' && <ShieldCheck className="w-10 h-10 text-slate-600" />}
                  {activeTab === 'notifications' && <Bell className="w-10 h-10 text-slate-600" />}
                </div>
                <h3 className="text-2xl font-bold text-white mb-2 tracking-tight capitalize">{activeTab} Details</h3>
                <p className="text-slate-400 max-w-sm">This section is currently being updated. Please check back later for your detailed {activeTab} information.</p>
              </div>
            )}

          </div>
        </main>
      </div>
    </div>
  );
}

// Helper icons missing from standard import
function PhoneIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
    </svg>
  );
}

function BuildingIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="2" width="16" height="20" rx="2" ry="2"/>
      <path d="M9 22v-4h6v4"/>
      <path d="M8 6h.01"/>
      <path d="M16 6h.01"/>
      <path d="M12 6h.01"/>
      <path d="M12 10h.01"/>
      <path d="M12 14h.01"/>
      <path d="M16 10h.01"/>
      <path d="M16 14h.01"/>
      <path d="M8 10h.01"/>
      <path d="M8 14h.01"/>
    </svg>
  );
}
