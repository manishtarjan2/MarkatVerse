"use client";
import React, { useState } from 'react';
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { Search, MapPin, Headphones, Store, MessageSquare, Bell, Heart, ShoppingCart, User, ChevronDown } from "lucide-react";

export default function Navbar() {
  const { items } = useCart();
  const { user } = useAuth();
  const cartItemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const [isLocationPopupOpen, setIsLocationPopupOpen] = useState(false);
  const [locationStr, setLocationStr] = useState("Select Location");
  const [locationInput, setLocationInput] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.set("q", searchQuery);
    router.push(`/search?${params.toString()}`);
  };

  return (
    <nav className="flex items-center justify-between py-2 px-6 bg-white border-b border-slate-200 sticky top-0 z-[100] shadow-sm">
      <div className="flex items-center gap-6">
        <Link href="/" className="flex items-center no-underline hover:opacity-90 transition-opacity mr-16 lg:mr-28">
          <img src="/logo.png" alt="MarkatVerse" className="h-10 lg:h-12 object-contain scale-[2.5] origin-left" />
        </Link>
      </div>

      {user?.role !== 'super_admin' && (
        <>
          <div
            className="hidden lg:flex items-center gap-2 px-3 py-1.5 cursor-pointer relative hover:bg-slate-50 rounded-lg transition-colors border border-transparent hover:border-slate-200 ml-4"
            onClick={() => setIsLocationPopupOpen(!isLocationPopupOpen)}
          >
            <MapPin className="w-5 h-5 text-slate-600" strokeWidth={1.5} />
            <div className="flex flex-col gap-0">
              <span className="text-[11px] text-slate-500 font-medium">Deliver to</span>
              <span className="text-sm font-semibold text-slate-800 flex items-center gap-1">
                {locationStr}
                <ChevronDown className="w-3 h-3 text-slate-500" />
              </span>
            </div>

            {isLocationPopupOpen && (
              <div
                className="absolute top-full left-0 mt-3 bg-white p-5 rounded-xl shadow-xl w-[320px] z-[1000] border border-slate-200 cursor-default"
                onClick={(e) => e.stopPropagation()}
              >
                <h4 className="mb-2 text-sm font-bold text-slate-800">Choose your location</h4>
                <p className="text-xs text-slate-500 mb-4 leading-relaxed">Delivery options and speeds may vary depending on your specific location</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter Pincode or City"
                    value={locationInput}
                    onChange={(e) => setLocationInput(e.target.value)}
                    className="flex-1 p-2.5 rounded-lg border border-slate-300 bg-white text-slate-800 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                  />
                  <button
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-medium transition-colors text-sm"
                    onClick={() => {
                      if (locationInput.trim()) {
                        setLocationStr(locationInput.trim());
                      }
                      setIsLocationPopupOpen(false);
                    }}
                  >
                    Apply
                  </button>
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-[700px] bg-slate-50 rounded-xl overflow-hidden mx-8 border border-slate-300 hover:border-blue-400 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all shadow-inner">
            <input
              type="text"
              placeholder="Search for products, brands, services and more..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent text-slate-800 border-none py-2.5 px-4 outline-none placeholder:text-slate-400 text-sm"
            />
            
            <button type="submit" className="cursor-pointer px-6 bg-blue-600 hover:bg-blue-700 text-white border-none flex items-center justify-center transition-colors">
              <Search className="w-5 h-5" strokeWidth={2.5} />
            </button>
          </form>
        </>
      )}

      {user?.role === 'super_admin' && (
        <div className="flex-1 flex justify-center">
          <div className="bg-amber-50 px-5 py-2 rounded-lg border border-amber-500/50 flex items-center gap-2 shadow-sm">
            <span className="text-amber-500">🛡️</span>
            <span className="text-amber-600 font-bold text-sm tracking-wide">ADMIN MODE</span>
          </div>
        </div>
      )}

      <div className="flex items-center gap-5 text-slate-600">
        {user?.role !== 'super_admin' && (
          <>
            <Link href="/help" className="hidden lg:flex flex-col items-center gap-1 cursor-pointer hover:text-blue-600 transition-colors group">
              <Headphones className="w-5 h-5 group-hover:scale-110 transition-transform" strokeWidth={1.5} />
              <span className="text-[11px] font-medium">Help</span>
            </Link>

            {!user && (
              <Link href="/seller/onboarding" className="hidden lg:flex flex-col items-center gap-1 cursor-pointer hover:text-blue-600 transition-colors group ml-2">
                <Store className="w-5 h-5 group-hover:scale-110 transition-transform" strokeWidth={1.5} />
                <span className="text-[11px] font-medium">Become a Seller</span>
              </Link>
            )}
          </>
        )}

        {user && (
          <>
            {user.role !== 'buyer' && (
              <div className="hidden sm:flex flex-col items-center gap-1 cursor-pointer relative hover:text-blue-600 transition-colors group">
                <div className="absolute -top-1.5 -right-2 bg-red-500 text-white text-[10px] py-[1px] px-1.5 rounded-full font-bold border border-white">12</div>
                <MessageSquare className="w-5 h-5 group-hover:scale-110 transition-transform" strokeWidth={1.5} />
                <span className="text-[11px] font-medium">Messages</span>
              </div>
            )}
            <div className="hidden sm:flex flex-col items-center gap-1 cursor-pointer relative hover:text-blue-600 transition-colors group ml-2">
              <div className="absolute -top-1.5 -right-2 bg-red-500 text-white text-[10px] py-[1px] px-1.5 rounded-full font-bold border border-white">23</div>
              <Bell className="w-5 h-5 group-hover:scale-110 transition-transform" strokeWidth={1.5} />
              <span className="text-[11px] font-medium">Alerts</span>
            </div>
          </>
        )}

        {user?.role !== 'super_admin' && (
          <>
            {user && (
              <>
                <Link href="/wishlist" className="hidden sm:flex flex-col items-center gap-1 cursor-pointer hover:text-red-500 transition-colors group ml-2">
                  <Heart className="w-5 h-5 group-hover:scale-110 transition-transform group-hover:fill-red-50" strokeWidth={1.5} />
                  <span className="text-[11px] font-medium">Wishlist</span>
                </Link>
                <Link href="/cart" className="flex flex-col items-center gap-1 cursor-pointer relative hover:text-blue-600 transition-colors group ml-2">
                  {cartItemCount > 0 && (
                    <div className="absolute -top-1.5 -right-2 bg-amber-400 text-slate-900 font-bold text-[10px] py-[1px] px-1.5 rounded-full border border-white">{cartItemCount}</div>
                  )}
                  <ShoppingCart className="w-5 h-5 group-hover:scale-110 transition-transform" strokeWidth={1.5} />
                  <span className="text-[11px] font-medium">Cart</span>
                </Link>
              </>
            )}
          </>
        )}

        <div className="ml-2 pl-4 border-l border-slate-200">
          {user ? (
            <Link href="/profile/settings" className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold shadow-sm border-2 border-white ring-2 ring-slate-100">
                {user.name.charAt(0)}
              </div>
              <div className="hidden lg:flex flex-col items-start gap-0">
                <span className="font-semibold text-sm text-slate-800">{user.name}</span>
                <span className="text-[11px] text-slate-500 font-medium">My Account <ChevronDown className="inline w-3 h-3" /></span>
              </div>
            </Link>
          ) : (
            <Link href="/login" className="flex items-center gap-2 cursor-pointer bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-lg transition-colors group">
              <User className="w-4 h-4 text-slate-600 group-hover:text-blue-600 transition-colors" strokeWidth={2} />
              <span className="font-semibold text-sm text-slate-800 group-hover:text-blue-600 transition-colors">Sign In</span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
