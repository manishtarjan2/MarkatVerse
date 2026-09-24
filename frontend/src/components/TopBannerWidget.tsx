"use client";
import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';

export default function TopBannerWidget() {
  const [banner, setBanner] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
        const res = await fetch(`${API_URL}/content/banners`);
        if (res.ok) {
          const data = await res.json();
          const topBarBanners = data.filter((b: any) => b.status === 'ACTIVE' && b.position === 'TOP_BAR');
          if (topBarBanners.length > 0) {
            setBanner(topBarBanners[0]);
          }
        }
      } catch (e) {
        console.error("Failed to fetch top bar banner", e);
      }
    };
    fetchBanners();
  }, []);

  if (!banner || !isVisible) return null;

  return (
    <div className="w-full bg-[#0f1928] text-white relative z-50 overflow-hidden shadow-sm">
      {banner.imageUrl && (
        <img src={banner.imageUrl} alt={banner.title} className="absolute inset-0 w-full h-full object-cover opacity-30" />
      )}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/40 via-purple-600/40 to-emerald-600/40 z-0 mix-blend-overlay"></div>
      <div className="relative z-10 container mx-auto px-4 py-2 flex items-center justify-center min-h-[40px]">
        <span className="text-sm font-bold text-center pr-8 drop-shadow-md tracking-wide">{banner.title}</span>
        {banner.linkUrl && (
          <a href={banner.linkUrl} className="ml-3 text-xs font-black bg-white text-[#0f1928] hover:bg-emerald-400 hover:text-white px-3 py-1 rounded-full transition-colors shadow-sm">
            Learn More
          </a>
        )}
        <button 
          onClick={() => setIsVisible(false)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
