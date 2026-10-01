"use client";
import React, { useEffect, useState } from 'react';

export default function ActionLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [actionFilter, setActionFilter] = useState('All Interventions');

  const filteredLogs = logs.filter(log => {
    // Only show relevant action logs (interventions on users/businesses)
    const isIntervention = log.entityType === 'User' || log.entityType === 'Business' || log.entityType === 'Ticket' || log.action.includes('UPDATE') || log.action.includes('RESOLVE') || log.action.includes('DELETE');
    if (!isIntervention) return false;

    const matchesSearch = (log.resource || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (log.details || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (log.action || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesAction = actionFilter === 'All Interventions' || log.action === actionFilter;
    return matchesSearch && matchesAction;
  });

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const getApiUrl = () => { if (process.env.NEXT_PUBLIC_API_URL) return process.env.NEXT_PUBLIC_API_URL; if (typeof window !== 'undefined') { return 'http://' + window.location.hostname + ':3001'; } return 'http://localhost:3001'; }; const API_URL = getApiUrl();
      const res = await fetch(`${API_URL}/security/audit`);
      if (res.ok) {
        const data = await res.json();
        setLogs(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <div className="w-full relative">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-white">Intervention & Action Logs</h2>
        <button 
          onClick={fetchLogs}
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-[0_0_15px_rgba(79,70,229,0.3)] hover:shadow-[0_0_25px_rgba(79,70,229,0.5)] flex items-center gap-2">
          Refresh Logs
        </button>
      </div>

      <div className="bg-slate-800 rounded-2xl border border-slate-700 shadow-lg overflow-hidden">
        <div className="p-4 border-b border-slate-700 flex flex-col md:flex-row justify-between gap-4">
          <input 
            type="text" 
            placeholder="Search by ID, email, or action..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500 w-full md:w-80" 
          />
          <select 
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500"
          >
            <option>All Interventions</option>
            <option>UPDATE_USER_ROLE</option>
            <option>DELETE_USER</option>
            <option>RESOLVE_TICKET</option>
          </select>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-900/80 border-b border-slate-700 text-slate-400 text-[10px] uppercase tracking-widest font-black">
              <tr>
                <th className="p-4 pl-6">Timestamp</th>
                <th className="p-4">Admin Action</th>
                <th className="p-4">Target Entity</th>
                <th className="p-4">Details</th>
                <th className="p-4 text-right pr-6">Admin User ID</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500 font-bold">
                    Loading intervention logs...
                  </td>
                </tr>
              ) : filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500 font-bold">
                    No intervention logs found. Admin actions will appear here automatically.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-700/50 transition-all group">
                    <td className="p-4 pl-6">
                      <div className="text-sm text-slate-300 font-bold">{new Date(log.createdAt).toLocaleDateString()}</div>
                      <div className="text-xs text-slate-500">{new Date(log.createdAt).toLocaleTimeString()}</div>
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/10 text-amber-500 border border-amber-500/20">
                        {log.action}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="text-sm text-white">{log.resource || log.entityType || 'N/A'}</div>
                      {log.entityId && <div className="text-xs text-slate-500 font-mono mt-0.5">ID: {log.entityId}</div>}
                    </td>
                    <td className="p-4">
                      <div className="text-sm text-slate-400 max-w-xs truncate">
                        {log.details || (log.detailsJson ? JSON.stringify(log.detailsJson) : 'No specific details provided.')}
                      </div>
                    </td>
                    <td className="p-4 text-right pr-6">
                      <div className="text-sm font-mono text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded inline-block">
                        {log.userId || 'SYSTEM'}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
