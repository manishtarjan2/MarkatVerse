"use client";
import React, { useEffect, useState } from 'react';
import { Search, Filter, Inbox, MessageSquareWarning, ShieldAlert, CheckCircle2 } from 'lucide-react';

const getApiUrl = () => { if (process.env.NEXT_PUBLIC_API_URL) return process.env.NEXT_PUBLIC_API_URL; if (typeof window !== 'undefined') { return 'http://' + window.location.hostname + ':3001'; } return 'http://localhost:3001'; }; const API_URL = getApiUrl();

export default function SupportUnifiedInboxPage() {
  const [cases, setCases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL'); // ALL, COMPLAINT, DISPUTE, TICKET

  const fetchInbox = async () => {
    try {
      setLoading(true);
      // Fetch both complaints and disputes to unify them
      const [complaintsRes, disputesRes] = await Promise.all([
        fetch(`${API_URL}/support/complaints`),
        fetch(`${API_URL}/support/disputes`)
      ]);
      
      const complaints = complaintsRes.ok ? await complaintsRes.json() : [];
      const disputes = disputesRes.ok ? await disputesRes.json() : [];

      const unified = [
        ...complaints.map((c: any) => ({ ...c, type: 'COMPLAINT' })),
        ...disputes.map((d: any) => ({ ...d, type: 'DISPUTE' }))
      ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      setCases(unified);
    } catch (e) {
      console.error("Error fetching inbox", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInbox();
  }, []);

  const getIcon = (type: string) => {
    switch(type) {
      case 'COMPLAINT': return <MessageSquareWarning className="w-4 h-4 text-orange-400" />;
      case 'DISPUTE': return <ShieldAlert className="w-4 h-4 text-rose-400" />;
      default: return <Inbox className="w-4 h-4 text-indigo-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    const s = status.toUpperCase();
    if (s === 'ACTIVE') return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    if (s === 'INACTIVE') return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    if (s === 'RESOLVED') return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
    return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
  };

  const filteredCases = filter === 'ALL' ? cases : cases.filter(c => c.type === filter);

  return (
    <div className="w-full relative animate-in fade-in duration-300">
      
      {/* Search and Filters */}
      <div className="bg-slate-800 rounded-2xl border border-slate-700 shadow-lg overflow-hidden mb-6">
        <div className="p-4 border-b border-slate-700 flex flex-wrap items-center justify-between gap-4">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search across all cases..." 
              className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:border-indigo-500 text-sm" 
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select 
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500 text-sm font-bold"
            >
              <option value="ALL">All Cases</option>
              <option value="COMPLAINT">Complaints Only</option>
              <option value="DISPUTE">Disputes Only</option>
            </select>
          </div>
        </div>
        
        {/* Inbox List */}
        <div className="divide-y divide-slate-700/50 max-h-[600px] overflow-y-auto custom-scrollbar">
          {loading ? (
            <div className="p-8 text-center text-slate-400 animate-pulse">Loading Unified Inbox...</div>
          ) : filteredCases.length === 0 ? (
            <div className="p-12 text-center flex flex-col items-center justify-center">
              <CheckCircle2 className="w-12 h-12 text-emerald-500/50 mb-3" />
              <h3 className="text-lg font-bold text-white">Inbox Zero!</h3>
              <p className="text-slate-400 text-sm mt-1">No pending cases found for this filter.</p>
            </div>
          ) : (
            filteredCases.map(item => (
              <div key={item.id} className="p-4 hover:bg-slate-700/30 transition-all cursor-pointer group flex items-start gap-4">
                <div className="mt-1 p-2 bg-slate-900 rounded-lg border border-slate-700 group-hover:border-slate-600 transition-colors">
                  {getIcon(item.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2 truncate">
                      <span className="text-xs font-black tracking-widest text-slate-500">{item.type}</span>
                      <h4 className="text-base font-bold text-white truncate">{item.title}</h4>
                    </div>
                    <span className="text-xs text-slate-400 whitespace-nowrap">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-slate-400 truncate pr-8">{item.description}</p>
                </div>
                <div className="shrink-0">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${getStatusColor(item.status)}`}>
                    {item.status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
