"use client";
import React, { useState, useEffect } from 'react';
import { Trash2, Edit } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export default function SecuritygtLoginsPage() {
  const [logins, setLogins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(`${API_URL}/users`);
        if (res.ok) {
          const data = await res.json();
          setLogins(data);
        }
      } catch (err) {
        console.error('Failed to fetch logins:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this login?')) return;
    try {
      await fetch(`${API_URL}/users/${id}`, { method: 'DELETE' });
      setLogins(logins.filter(u => u.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in duration-300 w-full">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Security &gt; Logins</h1>
          <p className="text-slate-400 mt-2 text-sm">Manage and configure user logins and security.</p>
        </div>
        <button className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_25px_rgba(16,185,129,0.5)] flex items-center gap-2">
          + Add New Login
        </button>
      </header>

      <div className="bg-slate-800 rounded-2xl border border-slate-700 shadow-lg overflow-hidden">
        <div className="p-4 border-b border-slate-700 flex justify-between">
          <input type="text" placeholder="Search logins..." className="bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500 w-64" />
          <select className="bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500">
            <option>All Roles</option>
            <option>CONSUMER</option>
            <option>SELLER</option>
            <option>ADMIN</option>
          </select>
        </div>
        
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-8 text-center text-slate-400">Loading live data...</div>
          ) : logins.length === 0 ? (
            <div className="p-8 text-center text-slate-400">No active logins found.</div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-900/80 border-b border-slate-700 text-slate-400 text-[10px] uppercase tracking-widest font-black">
                <tr>
                  <th className="p-4 pl-6">ID</th>
                  <th className="p-4">Name / Email</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Created Date</th>
                  <th className="p-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {logins.map((login) => (
                  <tr key={login.id} className="hover:bg-slate-700/50 transition-all">
                    <td className="p-4 pl-6 font-mono text-xs text-slate-500">#{login.markatId || login.id.slice(-6)}</td>
                    <td className="p-4">
                      <div className="font-bold text-white">{login.name}</div>
                      <div className="text-xs text-slate-400">{login.email}</div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
                        login.role === 'ADMIN' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : 
                        login.role === 'SELLER' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 
                        'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      }`}>
                        {login.role || 'USER'}
                      </span>
                    </td>
                    <td className="p-4 text-slate-400 text-sm">
                      {new Date(login.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 pr-6 text-right">
                      <button className="text-slate-500 hover:text-blue-400 px-2 transition-colors"><Edit className="w-4 h-4 inline" /></button>
                      <button onClick={() => handleDelete(login.id)} className="text-slate-500 hover:text-rose-400 px-2 transition-colors"><Trash2 className="w-4 h-4 inline" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
