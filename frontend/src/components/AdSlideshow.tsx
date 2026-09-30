"use client";
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function AdSlideshow({ ads }: { ads: any[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const resetTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  useEffect(() => {
    if (ads.length <= 1) return;
    
    resetTimeout();
    timeoutRef.current = setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex === ads.length - 1 ? 0 : prevIndex + 1));
    }, 6000); // Auto-slide every 6 seconds

    return () => resetTimeout();
  }, [currentIndex, ads.length]);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? ads.length - 1 : prevIndex - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex === ads.length - 1 ? 0 : prevIndex + 1));
  };

  if (!ads || ads.length === 0) return null;

  return (
    <div className="w-full mb-6 relative rounded-2xl overflow-hidden shadow-sm group">
      <div 
        className="flex transition-transform duration-700 ease-in-out min-h-[160px]"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {ads.map((ad: any) => (
          <div key={ad.id} className="min-w-full relative flex items-center min-h-[160px]">
            <a href={ad.linkUrl || '#'} className="block w-full h-full bg-slate-900 text-white relative overflow-hidden group/ad flex items-center p-8">
              {/* Background Image or Gradient */}
              {ad.mediaUrl ? (
                <div className="absolute inset-0 z-0">
                  <img src={ad.mediaUrl} alt={ad.title} className="w-full h-full object-cover opacity-80 group-hover/ad:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-transparent"></div>
                </div>
              ) : (
                <div className="absolute inset-0 z-0 bg-gradient-to-r from-emerald-500 to-teal-500"></div>
              )}
              
              <div className="absolute inset-0 bg-black/10 group-hover/ad:bg-black/0 transition-colors z-0"></div>
              
              <div className="relative z-10 flex items-center justify-between w-full">
                <h3 className="text-3xl font-black tracking-tight drop-shadow-md w-2/3 leading-tight">{ad.title}</h3>
                <span className="bg-white text-emerald-600 px-5 py-2.5 rounded-xl font-bold text-sm shadow-xl group-hover/ad:scale-105 transition-transform">Explore Now &rarr;</span>
              </div>
            </a>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      {ads.length > 1 && (
        <>
          <button 
            onClick={handlePrev}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity focus:outline-none z-20"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button 
            onClick={handleNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity focus:outline-none z-20"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Dots Indicator */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
            {ads.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-1.5 rounded-full transition-all ${currentIndex === idx ? 'bg-white w-6' : 'bg-white/50 w-1.5 hover:bg-white/80'}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
