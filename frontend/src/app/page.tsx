import Link from "next/link";
import { ShieldCheck, Award, RefreshCw, Zap } from 'lucide-react';
import ProductGrid from "@/components/ProductGrid";
import UserWidget from "@/components/UserWidget";

export default function Home() {
  return (
    <div className="max-w-[1400px] mx-auto min-h-[calc(100vh-80px)] flex bg-white">
      {/* Main Content */}
      <main className="flex-1 p-5 flex flex-col gap-6">
        {/* Hero Section */}
        <section className="bg-slate-900 rounded-xl flex flex-col justify-between min-h-[480px] bg-[url('/hero-bg.jpg')] bg-cover bg-center border border-slate-800 shadow-xl relative overflow-hidden">
          {/* Gradient Overlay for text readability on the left */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent"></div>

          <div className="relative z-10 w-full p-10 flex flex-col h-full justify-center text-left max-w-[65%] mt-4">
            <h1 className="text-5xl font-bold leading-[1.1] mb-5 tracking-tight text-white">
              ONE WORLD.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-amber-300">ENDLESS POSSIBILITIES.</span>
            </h1>
            <p className="text-base text-slate-300 max-w-[500px] mb-8">
              The global marketplace that connects people, businesses and opportunities.
            </p>
            <div className="flex gap-4">
              <Link href="/search">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors border-none cursor-pointer">
                  Explore Now
                </button>
              </Link>
              <button className="bg-transparent border border-slate-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-white/10 transition-colors cursor-pointer flex items-center gap-2">
                <span className="text-amber-500 text-sm">▶</span> How It Works
              </button>
            </div>
          </div>

          <div className="relative z-10 mx-6 mb-6 mt-4">
            <div className="flex justify-between items-center bg-slate-950/80 backdrop-blur-md rounded-xl p-5 border border-slate-800">
              <div className="flex items-center gap-3 flex-1 border-r border-slate-700 last:border-r-0 px-2 justify-center">
                <span className="text-2xl text-amber-500">🛍️</span>
                <div className="flex flex-col">
                  <span className="text-lg font-bold text-white leading-tight">10M+</span>
                  <span className="text-[10px] text-slate-400 font-normal">Products</span>
                </div>
              </div>
              <div className="flex items-center gap-3 flex-1 border-r border-slate-700 last:border-r-0 px-2 justify-center">
                <span className="text-2xl text-amber-500">🏅</span>
                <div className="flex flex-col">
                  <span className="text-lg font-bold text-white leading-tight">500K+</span>
                  <span className="text-[10px] text-slate-400 font-normal">Sellers</span>
                </div>
              </div>
              <div className="flex items-center gap-3 flex-1 border-r border-slate-700 last:border-r-0 px-2 justify-center">
                <span className="text-2xl text-amber-500">👤</span>
                <div className="flex flex-col">
                  <span className="text-lg font-bold text-white leading-tight">50M+</span>
                  <span className="text-[10px] text-slate-400 font-normal">Customers</span>
                </div>
              </div>
              <div className="flex items-center gap-3 flex-1 border-r border-slate-700 last:border-r-0 px-2 justify-center">
                <span className="text-2xl text-amber-500">🌐</span>
                <div className="flex flex-col">
                  <span className="text-lg font-bold text-white leading-tight">200+</span>
                  <span className="text-[10px] text-slate-400 font-normal">Countries</span>
                </div>
              </div>
              <div className="flex items-center gap-3 flex-1 border-r border-slate-700 last:border-r-0 px-2 justify-center">
                <span className="text-2xl text-amber-500">🛡️</span>
                <div className="flex flex-col">
                  <span className="text-lg font-bold text-white leading-tight">100%</span>
                  <span className="text-[10px] text-slate-400 font-normal">Secure Payments</span>
                </div>
              </div>
              <div className="flex items-center gap-3 flex-1 border-r border-slate-700 last:border-r-0 px-2 justify-center">
                <span className="text-2xl text-amber-500">🎧</span>
                <div className="flex flex-col">
                  <span className="text-lg font-bold text-white leading-tight">24/7</span>
                  <span className="text-[10px] text-slate-400 font-normal">Support</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Shortcuts */}
        <section className="flex justify-between bg-slate-50 p-3 rounded-xl border border-slate-200 gap-2 overflow-x-auto">
          <Link href="/search?filter=deals" className="flex flex-col items-center justify-center gap-1.5 min-w-[70px] p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer text-inherit no-underline">
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg shadow-sm bg-red-500 text-white">🔥</div>
            <span className="text-xs font-bold text-slate-900">Top Deals</span>
          </Link>
          <Link href="/category/mobiles" className="flex flex-col items-center justify-center gap-1.5 min-w-[70px] p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer text-inherit no-underline">
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg shadow-sm bg-white border border-slate-200 shadow-sm">📱</div>
            <span className="text-xs font-bold text-slate-900">Mobiles</span>
          </Link>
          <Link href="/category/electronics" className="flex flex-col items-center justify-center gap-1.5 min-w-[70px] p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer text-inherit no-underline">
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg shadow-sm bg-white border border-slate-200 shadow-sm">💻</div>
            <span className="text-xs font-bold text-slate-900">Electronics</span>
          </Link>
          <Link href="/category/fashion" className="flex flex-col items-center justify-center gap-1.5 min-w-[70px] p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer text-inherit no-underline">
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg shadow-sm bg-white border border-slate-200 shadow-sm">👕</div>
            <span className="text-xs font-bold text-slate-900">Fashion</span>
          </Link>
          <Link href="/category/home" className="flex flex-col items-center justify-center gap-1.5 min-w-[70px] p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer text-inherit no-underline">
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg shadow-sm bg-white border border-slate-200 shadow-sm">🏠</div>
            <span className="text-xs font-bold text-slate-900">Home & Kitchen</span>
          </Link>
          <Link href="/category/beauty" className="flex flex-col items-center justify-center gap-1.5 min-w-[70px] p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer text-inherit no-underline">
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg shadow-sm bg-white border border-slate-200 shadow-sm">💄</div>
            <span className="text-xs font-bold text-slate-900">Beauty</span>
          </Link>
          <Link href="/category/automotive" className="flex flex-col items-center justify-center gap-1.5 min-w-[70px] p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer text-inherit no-underline">
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg shadow-sm bg-white border border-slate-200 shadow-sm">🚗</div>
            <span className="text-xs font-bold text-slate-900">Automotive</span>
          </Link>
          <Link href="/category/sports" className="flex flex-col items-center justify-center gap-1.5 min-w-[70px] p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer text-inherit no-underline">
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg shadow-sm bg-white border border-slate-200 shadow-sm">⚽</div>
            <span className="text-xs font-bold text-slate-900">Sports</span>
          </Link>
          <Link href="/category/services" className="flex flex-col items-center justify-center gap-1.5 min-w-[70px] p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer text-inherit no-underline">
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg shadow-sm bg-white border border-slate-200 shadow-sm">🛠️</div>
            <span className="text-xs font-bold text-slate-900">Services</span>
          </Link>
          <Link href="/categories" className="flex flex-col items-center justify-center gap-1.5 min-w-[70px] p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer text-inherit no-underline">
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg shadow-sm bg-white border border-slate-200 shadow-sm">⊞</div>
            <span className="text-xs font-bold text-slate-900">View All</span>
          </Link>
        </section>

        {/* Product Grid */}
        <section>
          <div className="flex justify-between items-end border-b border-slate-200 pb-2.5 mb-5">
            <h2 className="text-lg font-medium text-slate-900">Top Picks For You</h2>
            <Link href="/search?filter=top_picks" className="text-blue-600 font-normal hover:underline text-sm">View All ➤</Link>
          </div>

          <ProductGrid />
        </section>

        {/* B2B Wholesale & Enterprise Hub */}
        <section className="mt-[60px] bg-slate-50 p-8 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
          
          <div className="flex justify-between items-end border-b border-slate-200 pb-2.5 mb-6 relative z-10">
            <div>
              <div className="text-[10px] font-bold text-blue-600 tracking-widest uppercase mb-1">Business to Business</div>
              <h2 className="text-2xl font-bold text-slate-900">B2B Wholesale & Enterprise Hub</h2>
            </div>
            <Link href="/search?filter=b2b" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">Enter B2B Portal ➤</Link>
          </div>

          <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-5 relative z-10">
            {[
              { name: 'Global Logistics', type: 'Freight & Supply Chain', rating: '4.9', icon: '🚢', link: '/product/heavy-freight-movers' },
              { name: 'TechInfra Solutions', type: 'Enterprise Hardware', rating: '4.9', icon: '🖥️', link: '/product/enterprise-server-rack' },
              { name: 'Elite Marketing Agency', type: 'Corporate Services', rating: '4.7', icon: '📈', link: '/search?q=Elite' }
            ].map((provider, i) => (
              <Link key={i} href={provider.link} className="no-underline text-inherit">
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-[15px] hover:-translate-y-1 transition-transform cursor-pointer h-full group">
                  <div className="w-[60px] h-[60px] bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center text-2xl shrink-0 border border-blue-100 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    {provider.icon}
                  </div>
                  <div className="overflow-hidden">
                    <div className="text-[10px] text-blue-600 uppercase tracking-[1px] font-medium">{provider.type}</div>
                    <div className="font-bold text-sm mt-1 whitespace-nowrap overflow-hidden text-ellipsis text-slate-900">{provider.name}</div>
                    <div className="text-amber-500 text-[10px] mt-1 font-medium">★ {provider.rating}</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Construction & Raw Materials Hub */}
        <section className="mt-[60px] bg-amber-50 p-8 rounded-2xl border border-amber-200 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/3"></div>
          
          <div className="flex justify-between items-end border-b border-amber-200 pb-2.5 mb-6 relative z-10">
            <div>
              <div className="text-[10px] font-bold text-amber-700 tracking-widest uppercase mb-1">Building & Infrastructure</div>
              <h2 className="text-2xl font-bold text-slate-900">Construction & Raw Materials</h2>
            </div>
            <Link href="/search?cat=Raw%20Materials" className="bg-amber-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-amber-700 transition-colors shadow-lg shadow-amber-600/20">View All Materials ➤</Link>
          </div>

          <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-5 relative z-10">
            {[
              { name: 'UltraTech Cement (50kg)', type: 'Building Material', rating: '4.8', icon: '🧱', link: '/product/portland-cement-50kg' },
              { name: 'Tata Tiscon TMT Steel', type: 'Structural Steel', rating: '4.9', icon: '🏗️', link: '/product/tmt-steel-bars' },
              { name: 'High Quality River Sand', type: 'Aggregates', rating: '4.6', icon: '⏳', link: '/product/river-sand-truck' }
            ].map((provider, i) => (
              <Link key={i} href={provider.link} className="no-underline text-inherit">
                <div className="bg-white p-5 rounded-xl border border-amber-200 shadow-sm flex items-center gap-[15px] hover:-translate-y-1 transition-transform cursor-pointer h-full group">
                  <div className="w-[60px] h-[60px] bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center text-2xl shrink-0 border border-amber-100 group-hover:bg-amber-600 group-hover:text-white transition-colors shadow-sm">
                    {provider.icon}
                  </div>
                  <div className="overflow-hidden">
                    <div className="text-[10px] text-amber-700 uppercase tracking-[1px] font-medium">{provider.type}</div>
                    <div className="font-bold text-sm mt-1 whitespace-nowrap overflow-hidden text-ellipsis text-slate-900">{provider.name}</div>
                    <div className="text-amber-500 text-[10px] mt-1 font-medium">★ {provider.rating}</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* B2C Consumer Hub */}
        <section className="mt-[60px]">
          <div className="flex justify-between items-end border-b border-slate-200 pb-2.5 mb-5">
            <div>
              <div className="text-[10px] font-bold text-emerald-600 tracking-widest uppercase mb-1">Direct to Consumer</div>
              <h2 className="text-2xl font-bold text-slate-900">B2C Retail & Home Services</h2>
            </div>
            <Link href="/search?cat=Home Services" className="text-emerald-600 font-medium hover:underline text-sm">Explore Retail Services ➤</Link>
          </div>

          <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-5">
            {[
              { name: 'AC Repair Service', type: 'Cooling & HVAC', rating: '4.9', icon: '❄️', link: '/search?cat=Home%20Services&q=AC', hasHomeVisit: true },
              { name: 'Appliance Fixing', type: 'Home Maintenance', rating: '4.6', icon: '🔌', link: '/search?cat=Home%20Services&q=Appliance', hasHomeVisit: true },
              { name: 'Quick Plumbing Co.', type: 'Plumbing Services', rating: '4.7', icon: '🚰', link: '/search?cat=Home%20Services&q=Plumbing', hasHomeVisit: true },
              { name: 'Deep Clean Services', type: 'House Cleaning', rating: '4.8', icon: '🧹', link: '/search?cat=Home%20Services&q=Cleaning', hasHomeVisit: true }
            ].map((provider, i) => (
              <Link key={i} href={provider.link} className="no-underline text-inherit">
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-3 hover:-translate-y-1 transition-transform cursor-pointer h-full relative">
                  <div className="flex items-center gap-[15px]">
                    <div className="w-[60px] h-[60px] bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center text-2xl shrink-0 border border-emerald-100">
                      {provider.icon}
                    </div>
                    <div className="overflow-hidden">
                      <div className="text-[10px] text-emerald-600 uppercase tracking-[1px] font-medium">{provider.type}</div>
                      <div className="font-medium text-sm mt-1 whitespace-nowrap overflow-hidden text-ellipsis text-slate-900">{provider.name}</div>
                      <div className="text-amber-500 text-[10px] mt-1 font-medium">★ {provider.rating}</div>
                    </div>
                  </div>
                  {provider.hasHomeVisit && (
                    <div className="text-[10px] font-bold text-teal-700 bg-teal-50 border border-teal-200 py-1 px-2 rounded-md self-start flex items-center gap-1">
                      🏠 Home Visit / Per Hr Fee
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Salon & Beauty Services Section */}
        <section className="mt-[60px]">
          <div className="flex justify-between items-end border-b border-slate-200 pb-2.5 mb-5">
            <h2 className="text-lg font-medium text-slate-900">Salon, Spa & Beauty Services</h2>
            <Link href="/search?cat=Services" className="text-blue-600 font-normal hover:underline text-sm">Explore Beauty Services ➤</Link>
          </div>

          <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-5">
            {[
              { name: 'Unisex Salons & Hair', type: 'Hair Cutting', rating: '4.8', icon: '✂️', link: '/search?cat=Services&q=Hair', hasToken: true },
              { name: 'Spa & Wellness Centers', type: 'Massage & Pedicure', rating: '4.9', icon: '💆‍♀️', link: '/search?cat=Services&q=Spa', hasToken: false },
              { name: 'Nail Studios', type: 'Nail Art', rating: '4.7', icon: '💅', link: '/search?cat=Services&q=Nail', hasToken: false },
              { name: 'Makeup Artists', type: 'Bridal Styling', rating: '4.9', icon: '💄', link: '/search?cat=Services&q=Makeup', hasToken: true }
            ].map((provider, i) => (
              <Link key={i} href={provider.link} className="no-underline text-inherit">
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-3 hover:-translate-y-1 transition-transform cursor-pointer h-full relative">
                  <div className="flex items-center gap-[15px]">
                    <div className="w-[60px] h-[60px] bg-pink-50 text-pink-600 rounded-xl flex items-center justify-center text-2xl shrink-0 border border-pink-100">
                      {provider.icon}
                    </div>
                    <div className="overflow-hidden">
                      <div className="text-[10px] text-pink-600 uppercase tracking-[1px] font-medium">{provider.type}</div>
                      <div className="font-medium text-sm mt-1 whitespace-nowrap overflow-hidden text-ellipsis text-slate-900">{provider.name}</div>
                      <div className="text-amber-500 text-[10px] mt-1">★ {provider.rating}</div>
                    </div>
                  </div>
                  {provider.hasToken && (
                    <div className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 py-1 px-2 rounded-md self-start flex items-center gap-1">
                      🎟️ Online Token Available
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Organizers Section */}
        <section className="mt-[60px]">
          <div className="flex justify-between items-end border-b border-slate-200 pb-2.5 mb-5">
            <h2 className="text-lg font-medium text-slate-900">Top Organizers & Contractors</h2>
            <Link href="/search?cat=Organizers" className="text-blue-600 font-normal hover:underline text-sm">Explore Organizers ➤</Link>
          </div>

          <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-5">
            {[
              { name: 'Dream Events & Weddings', type: 'Event Organizer', rating: '4.9', icon: '🎉', link: '/search?cat=Organizers&q=Events' },
              { name: 'Prime Construction & Builders', type: 'Construction Contractor', rating: '4.7', icon: '🏗️', link: '/search?cat=Organizers&q=Construction' },
              { name: 'Luxury Party Planners', type: 'Event Organizer', rating: '4.8', icon: '🥂', link: '/search?cat=Organizers&q=Party' },
              { name: 'Grand Stage Decorators', type: 'Wedding Planner', rating: '4.9', icon: '💐', link: '/search?cat=Organizers&q=Stage' }
            ].map((provider, i) => (
              <Link key={i} href={provider.link} className="no-underline text-inherit">
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-[15px] hover:-translate-y-1 transition-transform cursor-pointer h-full">
                  <div className="w-[60px] h-[60px] bg-emerald-50 rounded-xl flex items-center justify-center text-2xl shrink-0 border border-emerald-100">
                    {provider.icon}
                  </div>
                  <div className="overflow-hidden">
                    <div className="text-[10px] text-emerald-600 uppercase tracking-[1px] font-medium">{provider.type}</div>
                    <div className="font-medium text-sm mt-1 whitespace-nowrap overflow-hidden text-ellipsis text-slate-900">{provider.name}</div>
                    <div className="text-amber-500 text-[10px] mt-1">★ {provider.rating}</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Transport & Logistics Section */}
        <section className="mt-[60px]">
          <div className="flex justify-between items-end border-b border-slate-200 pb-2.5 mb-5">
            <h2 className="text-lg font-medium text-slate-900">Transport & Vehicle Services</h2>
            <Link href="/search?cat=Transport" className="text-blue-600 font-normal hover:underline text-sm">Find Transport ➤</Link>
          </div>

          <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-5">
            {[
              { name: 'City Auto Rentals', type: 'Auto Rickshaw Service', rating: '4.6', icon: '🛺', link: '/search?q=Auto%20Rickshaw' },
              { name: 'Heavy Freight Movers', type: 'Trucking & Cargo', rating: '4.9', icon: '🚛', link: '/search?q=Freight%20Truck' },
              { name: 'Premium Car Hire', type: 'Car Rental & Taxi', rating: '4.8', icon: '🚕', link: '/search?q=Car%20Rental' },
              { name: 'Interstate Bus Tours', type: 'Bus Travel & Charter', rating: '4.7', icon: '🚌', link: '/search?q=Bus%20Tour' }
            ].map((provider, i) => (
              <Link key={i} href={provider.link} className="no-underline text-inherit">
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-[15px] hover:-translate-y-1 transition-transform cursor-pointer h-full">
                  <div className="w-[60px] h-[60px] bg-blue-50 rounded-xl flex items-center justify-center text-2xl shrink-0 border border-blue-100">
                    {provider.icon}
                  </div>
                  <div className="overflow-hidden">
                    <div className="text-[10px] text-blue-600 uppercase tracking-[1px] font-medium">{provider.type}</div>
                    <div className="font-medium text-sm mt-1 whitespace-nowrap overflow-hidden text-ellipsis text-slate-900">{provider.name}</div>
                    <div className="text-amber-500 text-[10px] mt-1">★ {provider.rating}</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Premium Trust Footer - Compact */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12 mb-6">
          
          <div className="group relative bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex items-center gap-4">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/3 group-hover:bg-blue-500/20 transition-all"></div>
            
            <div className="relative z-10 w-12 h-12 bg-gradient-to-br from-blue-50 to-indigo-50 text-blue-600 rounded-xl flex items-center justify-center shadow-inner border border-blue-100/50 shrink-0 group-hover:scale-105 group-hover:rotate-3 transition-transform duration-300">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div className="relative z-10">
              <h3 className="text-sm font-bold text-slate-900 mb-0.5">Trusted & Secure</h3>
              <p className="text-[11px] text-slate-500 font-medium leading-tight">
                Bank-grade encryption for 100% secure payments.
              </p>
            </div>
          </div>

          <div className="group relative bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex items-center gap-4">
            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/3 group-hover:bg-amber-500/20 transition-all"></div>
            
            <div className="relative z-10 w-12 h-12 bg-gradient-to-br from-amber-50 to-orange-50 text-amber-500 rounded-xl flex items-center justify-center shadow-inner border border-amber-100/50 shrink-0 group-hover:scale-105 group-hover:rotate-3 transition-transform duration-300">
              <Award className="w-6 h-6" />
            </div>
            <div className="relative z-10">
              <h3 className="text-sm font-bold text-slate-900 mb-0.5">Quality Assured</h3>
              <p className="text-[11px] text-slate-500 font-medium leading-tight">
                Genuine inventory from verified global sellers.
              </p>
            </div>
          </div>

          <div className="group relative bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex items-center gap-4">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/3 group-hover:bg-emerald-500/20 transition-all"></div>
            
            <div className="relative z-10 w-12 h-12 bg-gradient-to-br from-emerald-50 to-teal-50 text-emerald-500 rounded-xl flex items-center justify-center shadow-inner border border-emerald-100/50 shrink-0 group-hover:scale-105 group-hover:-rotate-3 transition-transform duration-300">
              <RefreshCw className="w-6 h-6" />
            </div>
            <div className="relative z-10">
              <h3 className="text-sm font-bold text-slate-900 mb-0.5">Easy Returns</h3>
              <p className="text-[11px] text-slate-500 font-medium leading-tight">
                Hassle-free refunds within 7 business days.
              </p>
            </div>
          </div>

        </div>

      </main>

    </div>
  );
}
