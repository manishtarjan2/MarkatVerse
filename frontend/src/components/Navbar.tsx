"use client";
import React, { useState } from 'react';
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const { items } = useCart();
  const { user } = useAuth();
  const cartItemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const [isLocationPopupOpen, setIsLocationPopupOpen] = useState(false);
  const [locationStr, setLocationStr] = useState("Select Location");
  const [locationInput, setLocationInput] = useState("");

  const [searchLocation, setSearchLocation] = useState("");
  const [searchCategory, setSearchCategory] = useState("All Categories");
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.set("q", searchQuery);
    if (searchLocation) params.set("loc", searchLocation);
    if (searchCategory !== "All Categories") params.set("cat", searchCategory);
    router.push(`/search?${params.toString()}`);
  };

  return (
    <nav className="flex items-center justify-between py-1 px-4 bg-white border-b border-slate-200 sticky top-0 z-[100]">
      <div className="flex items-center gap-3">
        <Link href="/" className="flex items-center no-underline text-inherit">
          <img src="/logo.png" alt="MarkatVerse" className="h-10 object-contain" />
        </Link>
      </div>

      {user?.role !== 'admin' && (
        <>
          <div
            className="flex items-center gap-2 px-2 cursor-pointer relative"
            onClick={() => setIsLocationPopupOpen(!isLocationPopupOpen)}
          >
            <span className="text-base">📍</span>
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] text-slate-500">Deliver to</span>
              <span className="text-xs font-medium text-slate-800">{locationStr} {isLocationPopupOpen ? '⌃' : '⌄'}</span>
            </div>

            {isLocationPopupOpen && (
              <div
                className="absolute top-full left-0 mt-2.5 bg-slate-800 p-5 rounded-lg shadow-[0_4px_12px_rgba(0,0,0,0.5)] w-[300px] z-[1000] border border-slate-700 cursor-default"
                onClick={(e) => e.stopPropagation()}
              >
                <h4 className="mb-2.5 text-xs">Choose your location</h4>
                <p className="text-[10px] text-slate-400 mb-[15px]">Delivery options and delivery speeds may vary for different locations</p>
                <div className="flex gap-2.5">
                  <input
                    type="text"
                    placeholder="Enter Pincode or City"
                    value={locationInput}
                    onChange={(e) => setLocationInput(e.target.value)}
                    className="flex-1 p-2 rounded border border-slate-700 bg-slate-900 text-white"
                  />
                  <button
                    className="bg-blue-600 hover:bg-blue-600-hover text-white px-4 py-2 rounded font-normal transition-colors"
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

          <form onSubmit={handleSearch} className="flex flex-1 max-w-[800px] bg-slate-100 rounded-lg overflow-hidden mx-6 border border-slate-300">
            <div className="flex items-center bg-transparent pl-3 border-r border-slate-300">
              <span>📍</span>
              <input
                type="text"
                list="city-options"
                placeholder="City or Pincode"
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
                className="w-[130px] border-none bg-transparent text-slate-800 py-1.5 px-2 outline-none placeholder:text-slate-400"
              />
              <datalist id="city-options">
                <option value="Mumbai" />
                <option value="Delhi" />
                <option value="Bangalore" />
                <option value="Hyderabad" />
                <option value="Ahmedabad" />
                <option value="Chennai" />
                <option value="Kolkata" />
                <option value="Pune" />
                <option value="Jaipur" />
                <option value="Surat" />
              </datalist>
            </div>
            <select
              value={searchCategory}
              onChange={(e) => setSearchCategory(e.target.value)}
              className="bg-transparent text-slate-600 border-none p-1.5 px-3 border-r border-slate-300 outline-none"
            >
              <option>All Categories</option>
              <option>Sellers / Businesses</option>
              <option>Services</option>
              <option>Products</option>
              <option>Organizers</option>
              <option>Transport</option>
            </select>
            <input
              type="text"
              placeholder={
                searchCategory === 'Sellers / Businesses'
                  ? `Search for sellers in ${searchLocation || 'your city'}...`
                  : searchCategory === 'Services'
                    ? `Find services in ${searchLocation || 'your city'}...`
                    : "Search for products, brands and more..."
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent text-slate-800 border-none p-1.5 px-3 outline-none placeholder:text-slate-400"
            />
            <button type="submit" className="cursor-pointer h-full px-5 bg-blue-600 text-white border-none flex items-center justify-center">
              🔍
            </button>
          </form>
        </>
      )}

      {user?.role === 'admin' && (
        <div className="flex-1 flex justify-center">
          <div className="bg-[rgba(245,158,11,0.1)] px-5 py-2.5 rounded-lg border border-amber-500">
            <span className="text-amber-500 font-medium">🛡️ ADMIN MODE ACTIVE</span>
          </div>
        </div>
      )}

      <div className="flex items-center gap-6 text-[10px] text-slate-500">
        {user?.role !== 'admin' && (
          <>


            <Link href="/help" className="flex flex-col items-center gap-1 cursor-pointer relative no-underline text-inherit">
              <span className="text-base">🎧</span>
              <span>Help</span>
            </Link>

            {!user && (
              <Link href="/seller/onboarding" className="flex flex-col items-center gap-1 cursor-pointer relative no-underline text-inherit">
                <span className="text-base">🏪</span>
                <span>Become a Seller</span>
              </Link>
            )}
          </>
        )}

        {user && (
          <>
            {user.role !== 'buyer' && (
              <div className="flex flex-col items-center gap-1 cursor-pointer relative">
                <div className="absolute -top-2 -right-2.5 bg-red-500 text-white text-[10px] py-[2px] px-1.5 rounded-full">12</div>
                <span className="text-base">✉️</span>
                <span>Messages</span>
              </div>
            )}
            <div className="flex flex-col items-center gap-1 cursor-pointer relative">
              <div className="absolute -top-2 -right-2.5 bg-red-500 text-white text-[10px] py-[2px] px-1.5 rounded-full">23</div>
              <span className="text-base">🔔</span>
              <span>Notifications</span>
            </div>
          </>
        )}

        {user?.role !== 'admin' && (
          <>
            {user && (
              <>
                <Link href="/wishlist" className="flex flex-col items-center gap-1 cursor-pointer relative no-underline text-inherit">
                  <span className="text-base">❤️</span>
                  <span>Wishlist</span>
                </Link>
                <Link href="/cart" className="flex flex-col items-center gap-1 cursor-pointer relative no-underline text-inherit">
                  {cartItemCount > 0 && (
                    <div className="absolute -top-2 -right-2.5 bg-amber-500 text-black font-medium text-[10px] py-[2px] px-1.5 rounded-full">{cartItemCount}</div>
                  )}
                  <span className="text-base">🛒</span>
                  <span>Cart</span>
                </Link>
              </>
            )}
          </>
        )}

        {user ? (
          <Link href="/profile/settings" className="flex flex-row items-center gap-2.5 ml-2.5 no-underline text-inherit cursor-pointer">
            <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center">
              {user.name.charAt(0)}
            </div>
            <div className="flex flex-col items-start gap-0.5">
              <span className="font-normal text-slate-800">{user.name}</span>
              <span>Settings ⌄</span>
            </div>
          </Link>
        ) : (
          <Link href="/login" className="flex flex-col items-center gap-1 cursor-pointer relative no-underline text-inherit ml-2.5">
            <span className="text-base">👤</span>
            <span className="font-medium">Sign In</span>
          </Link>
        )}
      </div>
    </nav>
  );
}
