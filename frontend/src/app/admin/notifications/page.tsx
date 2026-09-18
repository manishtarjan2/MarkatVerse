"use client";
import React from 'react';
import { Settings } from 'lucide-react';

export default function NotificationsPage() {
  return (
    <div className="max-w-6xl mx-auto w-full animate-in fade-in duration-300">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-white tracking-tight capitalize">Notifications Management</h1>
        <p className="text-slate-400 mt-2 text-sm">Manage and configure notifications across the platform.</p>
      </header>
      
      <div className="bg-slate-800 rounded-2xl border border-slate-700 shadow-lg p-12 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center border border-slate-700 text-slate-400 mb-6 shadow-inner">
          <Settings className="w-8 h-8 animate-[spin_4s_linear_infinite]" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Module Under Construction</h2>
        <p className="text-slate-400 max-w-md mx-auto">
          The Notifications module is currently being migrated to use live API data. 
          Check back soon.
        </p>
      </div>
    </div>
  );
}
