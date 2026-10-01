"use client";
import React, { useEffect } from 'react';

export default function MarketplacegtIndustriesPage() {
  useEffect(() => {
    const handleAdd = () => {
      alert('Add Industry clicked');
    };
    window.addEventListener('marketplace:add-industry', handleAdd);
    return () => window.removeEventListener('marketplace:add-industry', handleAdd);
  }, []);

  return (
    <div className="w-full relative">

      <div className="bg-slate-800 rounded-2xl border border-slate-700 shadow-lg overflow-hidden">
        <div className="p-4 border-b border-slate-700 flex justify-between">
          <input type="text" placeholder="Search..." className="bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500 w-64" />
          <select className="bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500">
            <option>All Status</option>
            <option>Active</option>
            <option>Inactive</option>
          </select>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-900/80 border-b border-slate-700 text-slate-400 text-[10px] uppercase tracking-widest font-black">
              <tr>
                <th className="p-4 pl-6">ID</th>
                <th className="p-4">Name / Title</th>
                <th className="p-4">Status</th>
                <th className="p-4">Date Modified</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              <tr className="hover:bg-slate-700/50 transition-all">
                <td className="p-4 pl-6 font-mono text-xs text-slate-500">#1001</td>
                <td className="p-4 font-bold text-white">Sample Entry A</td>
                <td className="p-4">
                  <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-full text-xs font-bold">Active</span>
                </td>
                <td className="p-4 text-slate-400 text-sm">Just now</td>
                <td className="p-4 pr-6 text-right">
                  <button className="text-slate-500 hover:text-blue-400 px-2">Edit</button>
                  <button className="text-slate-500 hover:text-rose-400 px-2">Delete</button>
                </td>
              </tr>
              <tr className="hover:bg-slate-700/50 transition-all">
                <td className="p-4 pl-6 font-mono text-xs text-slate-500">#1002</td>
                <td className="p-4 font-bold text-white">Sample Entry B</td>
                <td className="p-4">
                  <span className="bg-rose-500/10 text-rose-400 border border-rose-500/20 px-2.5 py-1 rounded-full text-xs font-bold">Inactive</span>
                </td>
                <td className="p-4 text-slate-400 text-sm">2 hours ago</td>
                <td className="p-4 pr-6 text-right">
                  <button className="text-slate-500 hover:text-blue-400 px-2">Edit</button>
                  <button className="text-slate-500 hover:text-rose-400 px-2">Delete</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
