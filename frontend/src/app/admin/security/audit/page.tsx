"use client";
import React, { useEffect, useState } from 'react';

export default function SecurityAuditPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [actionFilter, setActionFilter] = useState('All Actions');

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.resource.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (log.details || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
                          log.action.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesAction = actionFilter === 'All Actions' || log.action === actionFilter;
    return matchesSearch && matchesAction;
  });

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:3001/security/audit');
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
    <div className="max-w-6xl mx-auto animate-in fade-in duration-300 w-full">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Security &gt; Audit Logs</h1>
          <p className="text-slate-400 mt-2 text-sm">Review system actions, logins, and administrative changes.</p>
        </div>
        <button 
          onClick={fetchLogs}
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-[0_0_15px_rgba(79,70,229,0.3)] hover:shadow-[0_0_25px_rgba(79,70,229,0.5)] flex items-center gap-2">
          Refresh Logs
        </button>
      </header>

      <div className="bg-slate-800 rounded-2xl border border-slate-700 shadow-lg overflow-hidden">
        <div className="p-4 border-b border-slate-700 flex justify-between">
          <input 
            type="text" 
            placeholder="Search logs..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500 w-64" 
          />
          <select 
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500"
          >
            <option>All Actions</option>
            <option>LOGIN</option>
            <option>UPDATE_SETTINGS</option>
            <option>DELETE_USER</option>
          </select>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-900/80 border-b border-slate-700 text-slate-400 text-[10px] uppercase tracking-widest font-black">
              <tr>
                <th className="p-4 pl-6">ID / Timestamp</th>
                <th className="p-4">Action</th>
                <th className="p-4">Resource</th>
                <th className="p-4">Details</th>
                <th className="p-4">User ID</th>
                <th className="p-4 pr-6 text-right">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500 font-bold">
                    Loading logs...
                  </td>
                </tr>
              ) : filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500 font-bold">
                    No audit logs found matching your filters.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-700/50 transition-all group">
                    <td className="p-4 pl-6">
                      <div className="font-mono text-xs text-slate-500">#{log.id.slice(-6)}</div>
                      <div className="text-xs text-slate-400 mt-1">{new Date(log.createdAt).toLocaleString()}</div>
                    </td>
                    <td className="p-4 font-bold text-white">
                      <span className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-1 rounded text-xs">
                        {log.action}
                      </span>
                    </td>
                    <td className="p-4 text-slate-300 text-sm">
                      {log.resource}
                    </td>
                    <td className="p-4 text-slate-400 text-sm max-w-[200px] truncate" title={log.details}>
                      {log.details || 'N/A'}
                    </td>
                    <td className="p-4 text-slate-500 text-sm font-mono truncate" title={log.userId}>
                      {log.userId || 'System'}
                    </td>
                    <td className="p-4 pr-6 text-right font-mono text-xs text-slate-500">
                      {log.ipAddress || 'Unknown'}
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
