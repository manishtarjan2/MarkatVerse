import Link from "next/link";
import { ShieldCheck, Award, RefreshCw, Zap } from 'lucide-react';
import ProductGrid from "@/components/ProductGrid";
import UserWidget from "@/components/UserWidget";

export default function Home() {
  return (
    <div className="w-full min-h-[calc(100vh-80px)] flex bg-slate-50">
      
      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 flex flex-col gap-8 overflow-hidden">
        
        {/* Quick Shortcuts */}
        <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 lg:p-5 flex items-center justify-between overflow-x-auto hide-scrollbar gap-4 lg:gap-8 w-full">
          {[
            { name: "Top Deals", icon: "🔥", style: "bg-red-50 text-2xl" },
            { name: "Mobiles", icon: "📱", style: "bg-white border border-slate-200 text-xl shadow-sm" },
            { name: "Electronics", icon: "💻", style: "bg-white border border-slate-200 text-xl shadow-sm" },
            { name: "Fashion", icon: "👕", style: "bg-white border border-slate-200 text-xl shadow-sm" },
            { name: "Home", icon: "🏠", style: "bg-white border border-slate-200 text-xl shadow-sm" },
            { name: "Beauty", icon: "💄", style: "bg-white border border-slate-200 text-xl shadow-sm" },
            { name: "Auto", icon: "🚗", style: "bg-white border border-slate-200 text-xl shadow-sm" },
            { name: "Sports", icon: "⚽", style: "bg-white border border-slate-200 text-xl shadow-sm" },
            { name: "View All", icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>, style: "bg-[#0f1928] text-white" }
          ].map((cat, idx) => (
            <div key={idx} className="flex flex-col items-center gap-3 min-w-[65px] cursor-pointer group">
              <div className={`w-[52px] h-[52px] rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-105 ${cat.style}`}>
                {cat.icon}
              </div>
              <span className="text-[11px] font-bold text-[#0f1928] whitespace-nowrap">{cat.name}</span>
            </div>
          ))}
        </section>

        {/* Dual Hero Section */}
        <section className="grid grid-cols-1 md:grid-cols-10 gap-3 lg:gap-4 w-full h-[440px]">
          
          {/* Left Banner - Light Theme */}
          <div className="md:col-span-7 bg-white rounded-3xl p-6 lg:p-10 flex flex-col items-start justify-center border border-slate-200 shadow-sm relative overflow-hidden group">
            
            {/* Background Image seamlessly blended */}
            <div className="absolute top-0 right-0 w-full sm:w-[55%] h-full z-0">
              <div className="absolute inset-0 bg-gradient-to-r from-white via-transparent to-transparent z-10 sm:block hidden"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent z-10 sm:hidden block"></div>
              <img src="/hero-left-graphic.jpg" alt="Online Store Cart and Phone" className="w-full h-full object-cover object-center sm:object-right" />
            </div>

            <div className="flex flex-col z-10 w-full sm:w-[60%] relative h-full justify-center">
              <h1 className="text-3xl lg:text-4xl xl:text-[2.8rem] font-black text-[#0f1928] leading-[1.1] mb-3 tracking-tight relative z-20">
                One Platform.<br />Endless Possibilities.
              </h1>
              <p className="text-slate-600 font-medium mb-6 text-base relative z-20">
                Shop, Sell & Grow with Markatverse
              </p>
              
              <div className="flex flex-wrap gap-3 mb-6 relative z-20">
                <div className="flex items-center gap-3 bg-white/90 backdrop-blur shadow-sm border border-slate-100 rounded-2xl py-3 px-4">
                  <div className="text-blue-600"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg></div>
                  <div className="flex flex-col"><span className="text-xs font-bold text-slate-900 leading-tight">B2B</span><span className="text-[10px] text-slate-500 leading-tight">Business to<br/>Business</span></div>
                </div>
                <div className="flex items-center gap-3 bg-white/90 backdrop-blur shadow-sm border border-slate-100 rounded-2xl py-3 px-4">
                  <div className="text-orange-500"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg></div>
                  <div className="flex flex-col"><span className="text-xs font-bold text-slate-900 leading-tight">B2C</span><span className="text-[10px] text-slate-500 leading-tight">Business to<br/>Consumer</span></div>
                </div>
                <div className="flex items-center gap-3 bg-white/90 backdrop-blur shadow-sm border border-slate-100 rounded-2xl py-3 px-4">
                  <div className="text-emerald-500"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" /></svg></div>
                  <div className="flex flex-col"><span className="text-xs font-bold text-slate-900 leading-tight">Services</span><span className="text-[10px] text-slate-500 leading-tight">Solutions for<br/>Every Need</span></div>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 relative z-20 mt-auto">
                <Link href="/search">
                  <button className="bg-[#0f1928] hover:bg-slate-800 text-white px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2">
                    Shop Now <span className="font-normal">→</span>
                  </button>
                </Link>
                <Link href="/seller/onboarding">
                  <button className="bg-white/50 backdrop-blur hover:bg-white text-[#0f1928] border-2 border-[#0f1928] px-6 py-3 rounded-xl font-bold transition-all">
                    Join as Seller
                  </button>
                </Link>
              </div>
            </div>
          </div>

          {/* Right Banner - Dark Theme */}
          <div className="md:col-span-3 bg-[#061224] rounded-3xl p-6 lg:p-8 flex flex-col shadow-xl relative overflow-hidden group border border-slate-800">
            
            {/* Background glowing effects & Image */}
            <div className="absolute inset-0 z-0 opacity-100 transition-opacity duration-700">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3 z-10"></div>
              <div className="absolute inset-0 bg-gradient-to-b from-[#061224]/80 via-transparent to-[#061224]/90 z-10 pointer-events-none"></div>
              <img src="/hero-right-graphic.jpg" alt="Global Delivery Network" className="w-full h-full object-cover object-bottom" />
            </div>
            
            <div className="flex flex-col z-10 w-full mb-4 relative h-full">
              <div className="flex flex-col relative z-20">
                <h2 className="text-2xl lg:text-3xl xl:text-4xl font-black text-white leading-[1.15] mb-2 tracking-tight drop-shadow-md">
                  Empowering<br/>Businesses.<br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-teal-300 to-emerald-400">Enriching Lives.</span>
                </h2>
                <p className="text-slate-200 font-medium mb-6 text-xs lg:text-sm leading-relaxed drop-shadow-sm">
                  B2B, B2C & Services<br/>All in One Place.
                </p>
                
                <Link href="/about" className="self-start">
                  <button className="bg-white/95 backdrop-blur hover:bg-white text-[#0f1928] px-5 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 shadow-lg">
                    Explore More <span className="font-normal">→</span>
                  </button>
                </Link>
              </div>
              
              <div className="flex flex-row justify-between items-center mt-auto relative z-20 bg-[#061224]/20 backdrop-blur-md pt-3 pb-2 lg:pt-4 lg:pb-3 px-4 lg:px-6 -mx-6 -mb-6 lg:-mx-8 lg:-mb-8 rounded-b-3xl border-t border-white/10">
                <div className="flex items-center gap-2 flex-1 justify-center">
                  <div className="text-blue-400 drop-shadow"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg></div>
                  <span className="text-[9px] xl:text-[10px] text-white font-medium leading-tight">Wide Range<br/>of Products</span>
                </div>
                
                <div className="w-[1px] h-8 bg-white/10 mx-1"></div>
                
                <div className="flex items-center gap-2 flex-1 justify-center">
                  <div className="text-blue-400 drop-shadow"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg></div>
                  <span className="text-[9px] xl:text-[10px] text-white font-medium leading-tight">Trusted<br/>& Secure</span>
                </div>
                
                <div className="w-[1px] h-8 bg-white/10 mx-1"></div>
                
                <div className="flex items-center gap-2 flex-1 justify-center">
                  <div className="text-blue-400 drop-shadow"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg></div>
                  <span className="text-[9px] xl:text-[10px] text-white font-medium leading-tight">Fast & Reliable<br/>Delivery</span>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Browse Categories & Services */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full mt-2">
          
          {/* Categories Panel */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 lg:p-8 flex flex-col md:flex-row justify-between items-center md:items-start gap-8">
            <div className="flex flex-col gap-4 min-w-[200px] shrink-0">
              <h2 className="text-2xl font-bold text-[#0f1928] leading-tight">
                Everything You Need,<br/>All in One Place
              </h2>
              <div className="h-1 w-12 bg-gradient-to-r from-blue-500 via-teal-400 to-emerald-400 rounded-full mb-2"></div>
              <Link href="/categories">
                <button className="bg-[#0f1928] hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 mt-auto w-fit">
                  Browse Categories <span className="font-normal">→</span>
                </button>
              </Link>
            </div>
            
            <div className="flex items-center gap-3 overflow-x-auto hide-scrollbar w-full md:w-auto pb-2">
              {[
                { name: "Electronics", icon: "📱", bg: "bg-blue-50" },
                { name: "Home & Living", icon: "🛋️", bg: "bg-slate-100" },
                { name: "Industrial", icon: "👷", bg: "bg-amber-50" },
                { name: "Beauty & Personal Care", icon: "🧴", bg: "bg-pink-50" },
                { name: "Grocery", icon: "🛒", bg: "bg-emerald-50" },
                { name: "More Categories", icon: "🔠", bg: "bg-slate-100" }
              ].map((cat, idx) => (
                <div key={idx} className="flex flex-col items-center gap-2 min-w-[75px] text-center cursor-pointer group">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl transition-transform group-hover:scale-105 shadow-inner ${cat.bg}`}>
                    {cat.icon}
                  </div>
                  <span className="text-[10px] font-bold text-[#0f1928] leading-tight max-w-[75px]">{cat.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Services Panel */}
          <div className="bg-[#f0fdf4] rounded-3xl border border-emerald-100 shadow-sm p-6 lg:p-8 flex flex-col md:flex-row justify-between items-center md:items-start gap-8 relative overflow-hidden">
            {/* Dot pattern background */}
            <div className="absolute right-0 top-0 bottom-0 w-48 bg-[radial-gradient(#a7f3d0_2px,transparent_2px)] [background-size:16px_16px] opacity-40 z-0 mask-image-linear-gradient"></div>
            
            <div className="flex flex-col gap-2 min-w-[200px] shrink-0 relative z-10">
              <span className="text-emerald-600 font-bold text-sm">Services</span>
              <h2 className="text-2xl font-bold text-[#0f1928] leading-tight mb-4">
                Solutions That<br/>Drive Your Success
              </h2>
              <Link href="/services">
                <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 w-fit">
                  Explore Services <span className="font-normal">→</span>
                </button>
              </Link>
            </div>
            
            <div className="flex items-center gap-3 overflow-x-auto hide-scrollbar w-full md:w-auto relative z-10 pb-2">
              {[
                { name: "Logistics & Delivery", icon: "🚚" },
                { name: "Installation & Setup", icon: "🔧" },
                { name: "Maintenance & Support", icon: "👨‍🔧" },
                { name: "Business Consulting", icon: "💼" }
              ].map((srv, idx) => (
                <div key={idx} className="flex flex-col items-center gap-3 bg-white p-3 rounded-2xl border border-emerald-50 shadow-sm min-w-[90px] h-[100px] justify-center text-center cursor-pointer group hover:border-emerald-200 transition-colors">
                  <div className="text-3xl transition-transform group-hover:scale-110">
                    {srv.icon}
                  </div>
                  <span className="text-[10px] font-bold text-[#0f1928] leading-tight">{srv.name}</span>
                </div>
              ))}
            </div>
          </div>
          
        </section>

        {/* Top Picks For You (Product Grid) */}
        <section className="mt-4">
          <div className="flex justify-between items-end border-b border-slate-200 pb-3 mb-6">
            <h2 className="text-xl lg:text-2xl font-bold text-slate-900">Top Picks For You</h2>
            <Link href="/search?filter=top_picks" className="text-blue-600 font-bold hover:underline text-sm flex items-center gap-1">View All <span className="text-lg leading-none">›</span></Link>
          </div>
          <ProductGrid />
        </section>

        {/* Global Markets & Hubs (Grid Layout replacing the long scrolling lists) */}
        <section className="mt-8">
          <div className="flex justify-between items-end border-b border-slate-200 pb-3 mb-6">
            <div>
              <div className="text-[10px] font-bold text-slate-500 tracking-widest uppercase mb-1">Discover</div>
              <h2 className="text-xl lg:text-2xl font-bold text-slate-900">Global Markets & Hubs</h2>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* B2B Hub Card */}
            <Link href="/search?filter=b2b" className="group rounded-3xl overflow-hidden border border-slate-200 bg-white shadow-sm hover:shadow-xl transition-all block">
              <div className="h-32 bg-gradient-to-br from-blue-600 to-indigo-700 relative p-6 flex flex-col justify-end">
                <div className="absolute top-4 right-4 w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-2xl shadow-inner border border-white/30">🏭</div>
                <div className="text-white/80 text-[10px] uppercase tracking-widest font-bold mb-1">Business to Business</div>
                <h3 className="text-xl font-bold text-white leading-tight">Wholesale & Enterprise</h3>
              </div>
              <div className="p-5 text-sm text-slate-600 font-medium bg-white group-hover:bg-blue-50 transition-colors flex justify-between items-center">
                Explore bulk deals & suppliers <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">›</span>
              </div>
            </Link>

            {/* Construction Hub Card */}
            <Link href="/search?cat=Raw%20Materials" className="group rounded-3xl overflow-hidden border border-slate-200 bg-white shadow-sm hover:shadow-xl transition-all block">
              <div className="h-32 bg-gradient-to-br from-amber-500 to-orange-600 relative p-6 flex flex-col justify-end">
                <div className="absolute top-4 right-4 w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-2xl shadow-inner border border-white/30">🏗️</div>
                <div className="text-white/80 text-[10px] uppercase tracking-widest font-bold mb-1">Building & Infrastructure</div>
                <h3 className="text-xl font-bold text-white leading-tight">Construction Materials</h3>
              </div>
              <div className="p-5 text-sm text-slate-600 font-medium bg-white group-hover:bg-amber-50 transition-colors flex justify-between items-center">
                Cement, steel, & raw goods <span className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-white transition-colors">›</span>
              </div>
            </Link>

            {/* B2C Services Card */}
            <Link href="/search?cat=Home Services" className="group rounded-3xl overflow-hidden border border-slate-200 bg-white shadow-sm hover:shadow-xl transition-all block">
              <div className="h-32 bg-gradient-to-br from-emerald-500 to-teal-600 relative p-6 flex flex-col justify-end">
                <div className="absolute top-4 right-4 w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-2xl shadow-inner border border-white/30">🔧</div>
                <div className="text-white/80 text-[10px] uppercase tracking-widest font-bold mb-1">Direct to Consumer</div>
                <h3 className="text-xl font-bold text-white leading-tight">Retail & Home Services</h3>
              </div>
              <div className="p-5 text-sm text-slate-600 font-medium bg-white group-hover:bg-emerald-50 transition-colors flex justify-between items-center">
                AC repair, plumbing, & cleaning <span className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">›</span>
              </div>
            </Link>

            {/* Beauty & Spa Card */}
            <Link href="/search?cat=Services" className="group rounded-3xl overflow-hidden border border-slate-200 bg-white shadow-sm hover:shadow-xl transition-all block">
              <div className="h-32 bg-gradient-to-br from-pink-500 to-rose-600 relative p-6 flex flex-col justify-end">
                <div className="absolute top-4 right-4 w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-2xl shadow-inner border border-white/30">💆‍♀️</div>
                <div className="text-white/80 text-[10px] uppercase tracking-widest font-bold mb-1">Wellness & Care</div>
                <h3 className="text-xl font-bold text-white leading-tight">Salon, Spa & Beauty</h3>
              </div>
              <div className="p-5 text-sm text-slate-600 font-medium bg-white group-hover:bg-pink-50 transition-colors flex justify-between items-center">
                Book tokens for premium salons <span className="w-8 h-8 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center group-hover:bg-pink-600 group-hover:text-white transition-colors">›</span>
              </div>
            </Link>

            {/* Organizers Card */}
            <Link href="/search?cat=Organizers" className="group rounded-3xl overflow-hidden border border-slate-200 bg-white shadow-sm hover:shadow-xl transition-all block">
              <div className="h-32 bg-gradient-to-br from-violet-500 to-purple-700 relative p-6 flex flex-col justify-end">
                <div className="absolute top-4 right-4 w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-2xl shadow-inner border border-white/30">🎉</div>
                <div className="text-white/80 text-[10px] uppercase tracking-widest font-bold mb-1">Events & Planning</div>
                <h3 className="text-xl font-bold text-white leading-tight">Top Organizers</h3>
              </div>
              <div className="p-5 text-sm text-slate-600 font-medium bg-white group-hover:bg-violet-50 transition-colors flex justify-between items-center">
                Weddings, parties, & corporate <span className="w-8 h-8 rounded-full bg-violet-100 text-violet-600 flex items-center justify-center group-hover:bg-violet-600 group-hover:text-white transition-colors">›</span>
              </div>
            </Link>

            {/* Transport Card */}
            <Link href="/search?cat=Transport" className="group rounded-3xl overflow-hidden border border-slate-200 bg-white shadow-sm hover:shadow-xl transition-all block">
              <div className="h-32 bg-gradient-to-br from-cyan-500 to-blue-600 relative p-6 flex flex-col justify-end">
                <div className="absolute top-4 right-4 w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-2xl shadow-inner border border-white/30">🚛</div>
                <div className="text-white/80 text-[10px] uppercase tracking-widest font-bold mb-1">Mobility & Freight</div>
                <h3 className="text-xl font-bold text-white leading-tight">Transport Services</h3>
              </div>
              <div className="p-5 text-sm text-slate-600 font-medium bg-white group-hover:bg-cyan-50 transition-colors flex justify-between items-center">
                Autos, cabs, buses, & logistics <span className="w-8 h-8 rounded-full bg-cyan-100 text-cyan-600 flex items-center justify-center group-hover:bg-cyan-600 group-hover:text-white transition-colors">›</span>
              </div>
            </Link>

          </div>
        </section>

        {/* Premium Trust Footer */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 mb-6">
          <div className="group relative bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex items-center gap-4">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/3 group-hover:bg-blue-500/20 transition-all"></div>
            <div className="relative z-10 w-12 h-12 bg-gradient-to-br from-blue-50 to-indigo-50 text-blue-600 rounded-xl flex items-center justify-center shadow-inner border border-blue-100/50 shrink-0 group-hover:scale-105 group-hover:rotate-3 transition-transform duration-300">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div className="relative z-10">
              <h3 className="text-sm font-bold text-slate-900 mb-0.5">Trusted & Secure</h3>
              <p className="text-[11px] text-slate-500 font-medium leading-tight">Bank-grade encryption for 100% secure payments.</p>
            </div>
          </div>
          <div className="group relative bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex items-center gap-4">
            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/3 group-hover:bg-amber-500/20 transition-all"></div>
            <div className="relative z-10 w-12 h-12 bg-gradient-to-br from-amber-50 to-orange-50 text-amber-500 rounded-xl flex items-center justify-center shadow-inner border border-amber-100/50 shrink-0 group-hover:scale-105 group-hover:rotate-3 transition-transform duration-300">
              <Award className="w-6 h-6" />
            </div>
            <div className="relative z-10">
              <h3 className="text-sm font-bold text-slate-900 mb-0.5">Quality Assured</h3>
              <p className="text-[11px] text-slate-500 font-medium leading-tight">Genuine inventory from verified global sellers.</p>
            </div>
          </div>
          <div className="group relative bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex items-center gap-4">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/3 group-hover:bg-emerald-500/20 transition-all"></div>
            <div className="relative z-10 w-12 h-12 bg-gradient-to-br from-emerald-50 to-teal-50 text-emerald-500 rounded-xl flex items-center justify-center shadow-inner border border-emerald-100/50 shrink-0 group-hover:scale-105 group-hover:-rotate-3 transition-transform duration-300">
              <RefreshCw className="w-6 h-6" />
            </div>
            <div className="relative z-10">
              <h3 className="text-sm font-bold text-slate-900 mb-0.5">Easy Returns</h3>
              <p className="text-[11px] text-slate-500 font-medium leading-tight">Hassle-free refunds within 7 business days.</p>
            </div>
          </div>
        </div>
      </main>

    </div>
  );
}
