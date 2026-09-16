"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Ticket } from 'lucide-react';
import LiveBookingWidget from './LiveBookingWidget';

export default function LiveTokenToggle() {
  const [hasToken, setHasToken] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const checkToken = () => {
    setHasToken(!!localStorage.getItem('markatverse_active_token_id'));
  };

  useEffect(() => {
    checkToken();
    window.addEventListener('storage', checkToken);
    
    // Quick polling to check if token exists (in case widget modifies it without storage event)
    const interval = setInterval(checkToken, 2000);
    return () => {
      window.removeEventListener('storage', checkToken);
      clearInterval(interval);
    };
  }, []);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!hasToken) return null;

  return (
    <div className="relative ml-2" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="hidden sm:flex flex-col items-center gap-1 cursor-pointer relative hover:text-emerald-600 transition-colors group"
      >
        <span className="relative flex h-2.5 w-2.5 absolute -top-0.5 -right-1">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 border border-white"></span>
        </span>
        <Ticket className={`w-5 h-5 group-hover:scale-110 transition-transform ${isOpen ? 'text-emerald-600' : 'text-slate-600'}`} strokeWidth={1.5} />
        <span className={`text-[11px] font-medium ${isOpen ? 'text-emerald-600' : ''}`}>Token</span>
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-3 z-50">
          <LiveBookingWidget compact={true} onClose={() => setIsOpen(false)} />
        </div>
      )}
    </div>
  );
}
