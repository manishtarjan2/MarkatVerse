"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';

export default function AdvertisementWidget({ position, className = "" }: { position: string, className?: string }) {
  const [ads, setAds] = useState<any[]>([]);

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
        const res = await fetch(`${API_URL}/commercial/advertisements`);
        if (res.ok) {
          const data = await res.json();
          const filteredAds = data.filter((ad: any) => ad.status === 'ACTIVE' && ad.position === position);
          setAds(filteredAds);
        }
      } catch (e) {
        console.error(`Failed to fetch advertisements for position ${position}`, e);
      }
    };
    fetchAds();
  }, [position]);

  if (!ads || ads.length === 0) return null;

  return (
    <div className={`w-full flex flex-col gap-4 ${className}`}>
      {ads.map((ad: any) => (
        <a key={ad.id} href={ad.linkUrl || '#'} className="block w-full bg-slate-900 rounded-2xl p-6 md:p-8 text-white shadow-md hover:shadow-lg transition-all relative overflow-hidden group min-h-[120px] md:min-h-[160px] flex items-center">
          
          {/* Background Image or Gradient */}
          {ad.mediaUrl ? (
            <div className="absolute inset-0 z-0">
              <img src={ad.mediaUrl} alt={ad.title} className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-transparent"></div>
            </div>
          ) : (
            <div className="absolute inset-0 z-0 bg-gradient-to-r from-emerald-500 to-teal-500"></div>
          )}
          
          <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors z-0"></div>
          
          <div className="relative z-10 flex items-center justify-between w-full">
            <h3 className="text-xl md:text-3xl font-black tracking-tight drop-shadow-md w-2/3 leading-tight">{ad.title}</h3>
            <span className="bg-white text-emerald-600 px-3 py-1.5 md:px-5 md:py-2.5 rounded-xl font-bold text-xs md:text-sm shadow-xl group-hover:scale-105 transition-transform whitespace-nowrap">
              Explore &rarr;
            </span>
          </div>
        </a>
      ))}
    </div>
  );
}
