import Link from "next/link";
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
          <Link href="/category/all" className="flex flex-col items-center justify-center gap-1.5 min-w-[70px] p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer text-inherit no-underline">
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

        {/* Service Providers Section */}
        <section className="mt-[60px]">
          <div className="flex justify-between items-end border-b border-slate-200 pb-2.5 mb-5">
            <h2 className="text-lg font-medium text-slate-900">Featured Service Providers (B2C & B2B)</h2>
            <Link href="/services" className="text-blue-600 font-normal hover:underline text-sm">Find Services ➤</Link>
          </div>

          <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-5">
            {[
              { name: 'Urban Home Services Co.', type: 'B2C Service Provider', rating: '4.8', icon: '🛠️' },
              { name: 'Global Logistics', type: 'B2B Service Provider', rating: '4.9', icon: '🚢' },
              { name: 'Elite Marketing Agency', type: 'B2B Service Provider', rating: '4.7', icon: '📈' },
              { name: 'Home Appliances Repair', type: 'B2C Service Provider', rating: '4.6', icon: '🔌' }
            ].map((provider, i) => (
              <div key={i} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-[15px] hover:-translate-y-1 transition-transform cursor-pointer">
                <div className="w-[60px] h-[60px] bg-slate-50 rounded-xl flex items-center justify-center text-lg shrink-0">
                  {provider.icon}
                </div>
                <div className="overflow-hidden">
                  <div className="text-[10px] text-amber-600 uppercase tracking-[1px] font-medium">{provider.type}</div>
                  <div className="font-medium text-sm mt-1 whitespace-nowrap overflow-hidden text-ellipsis text-slate-900">{provider.name}</div>
                  <div className="text-amber-500 text-[10px] mt-1">★ {provider.rating}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Salon & Beauty Services Section */}
        <section className="mt-[60px]">
          <div className="flex justify-between items-end border-b border-slate-200 pb-2.5 mb-5">
            <h2 className="text-lg font-medium text-slate-900">Salon, Spa & Beauty Services</h2>
            <Link href="/services/beauty" className="text-blue-600 font-normal hover:underline text-sm">Explore Beauty Services ➤</Link>
          </div>

          <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-5">
            {[
              { name: 'Men & Women Hair Cutting', type: 'Unisex Salon', rating: '4.8', icon: '✂️', link: '/product/hair-cutting-styling' },
              { name: 'Premium Spa Pedicure', type: 'Spa & Wellness', rating: '4.9', icon: '💆‍♀️', link: '/product/premium-pedicure' },
              { name: 'Nail Art & Extensions', type: 'Nail Studio', rating: '4.7', icon: '💅', link: '/product/nail-art-extensions' },
              { name: 'Bridal Makeup & Styling', type: 'Makeup Artist', rating: '4.9', icon: '💄', link: '#' }
            ].map((provider, i) => (
              <Link key={i} href={provider.link} className="no-underline text-inherit">
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-[15px] hover:-translate-y-1 transition-transform cursor-pointer h-full">
                  <div className="w-[60px] h-[60px] bg-pink-50 text-pink-600 rounded-xl flex items-center justify-center text-2xl shrink-0 border border-pink-100">
                    {provider.icon}
                  </div>
                  <div className="overflow-hidden">
                    <div className="text-[10px] text-pink-600 uppercase tracking-[1px] font-medium">{provider.type}</div>
                    <div className="font-medium text-sm mt-1 whitespace-nowrap overflow-hidden text-ellipsis text-slate-900">{provider.name}</div>
                    <div className="text-amber-500 text-[10px] mt-1">★ {provider.rating}</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Organizers Section */}
        <section className="mt-[60px]">
          <div className="flex justify-between items-end border-b border-slate-200 pb-2.5 mb-5">
            <h2 className="text-lg font-medium text-slate-900">Top Organizers & Contractors</h2>
            <Link href="/organizers" className="text-blue-600 font-normal hover:underline text-sm">Explore Organizers ➤</Link>
          </div>

          <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-5">
            {[
              { name: 'Dream Events & Weddings', type: 'Event Organizer', rating: '4.9', icon: '🎉' },
              { name: 'Prime Construction & Builders', type: 'Construction Contractor', rating: '4.7', icon: '🏗️' },
              { name: 'Luxury Party Planners', type: 'Event Organizer', rating: '4.8', icon: '🥂' },
              { name: 'Grand Stage Decorators', type: 'Wedding Planner', rating: '4.9', icon: '💐' }
            ].map((provider, i) => (
              <div key={i} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-[15px] hover:-translate-y-1 transition-transform cursor-pointer">
                <div className="w-[60px] h-[60px] bg-slate-50 rounded-xl flex items-center justify-center text-lg shrink-0">
                  {provider.icon}
                </div>
                <div className="overflow-hidden">
                  <div className="text-[10px] text-emerald-600 uppercase tracking-[1px] font-medium">{provider.type}</div>
                  <div className="font-medium text-sm mt-1 whitespace-nowrap overflow-hidden text-ellipsis text-slate-900">{provider.name}</div>
                  <div className="text-amber-500 text-[10px] mt-1">★ {provider.rating}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Transport & Logistics Section */}
        <section className="mt-[60px]">
          <div className="flex justify-between items-end border-b border-slate-200 pb-2.5 mb-5">
            <h2 className="text-lg font-medium text-slate-900">Transport & Vehicle Services</h2>
            <Link href="/transport" className="text-blue-600 font-normal hover:underline text-sm">Find Transport ➤</Link>
          </div>

          <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-5">
            {[
              { name: 'City Auto Rentals', type: 'Auto Rickshaw Service', rating: '4.6', icon: '🛺' },
              { name: 'Premium Car Hire', type: 'Car Rental & Taxi', rating: '4.8', icon: '🚕' },
              { name: 'Interstate Bus Tours', type: 'Bus Travel & Charter', rating: '4.7', icon: '🚌' },
              { name: 'Heavy Freight Movers', type: 'Trucking & Cargo', rating: '4.9', icon: '🚛' }
            ].map((provider, i) => (
              <div key={i} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-[15px] hover:-translate-y-1 transition-transform cursor-pointer">
                <div className="w-[60px] h-[60px] bg-slate-50 rounded-xl flex items-center justify-center text-lg shrink-0">
                  {provider.icon}
                </div>
                <div className="overflow-hidden">
                  <div className="text-[10px] text-blue-600 uppercase tracking-[1px] font-medium">{provider.type}</div>
                  <div className="font-medium text-sm mt-1 whitespace-nowrap overflow-hidden text-ellipsis text-slate-900">{provider.name}</div>
                  <div className="text-amber-500 text-[10px] mt-1">★ {provider.rating}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Trust Footer */}
        <div className="flex justify-around bg-slate-50 p-5 rounded-xl border border-slate-200 mt-10 flex-wrap gap-5">
          <div className="flex items-center gap-[15px] min-w-[250px]">
            <div className="text-2xl bg-white w-[60px] h-[60px] rounded-full flex items-center justify-center border border-slate-200 shadow-sm">🛡️</div>
            <div>
              <div className="font-normal text-xs text-slate-900">Trusted & Secure</div>
              <div className="text-[10px] text-slate-500 mt-1">100% secure payments and privacy protection</div>
            </div>
          </div>
          <div className="flex items-center gap-[15px] min-w-[250px]">
            <div className="text-2xl bg-white w-[60px] h-[60px] rounded-full flex items-center justify-center border border-slate-200 shadow-sm">⭐</div>
            <div>
              <div className="font-normal text-xs text-slate-900">Quality Assured</div>
              <div className="text-[10px] text-slate-500 mt-1">Genuine products from verified sellers</div>
            </div>
          </div>
          <div className="flex items-center gap-[15px] min-w-[250px]">
            <div className="text-2xl bg-white w-[60px] h-[60px] rounded-full flex items-center justify-center border border-slate-200 shadow-sm">🔄</div>
            <div>
              <div className="font-normal text-xs text-slate-900">Easy Returns</div>
              <div className="text-[10px] text-slate-500 mt-1">Hassle-free returns within 7 days</div>
            </div>
          </div>
        </div>

      </main>

    </div>
  );
}
