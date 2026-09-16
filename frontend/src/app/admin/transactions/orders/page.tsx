"use client";

import React, { useState, useEffect } from 'react';
import { useAdminRole } from '@/context/AdminRoleContext';
import { ShieldAlert, Search, ShoppingBag, Eye, RefreshCw, CheckCircle, Clock, Truck, XCircle } from 'lucide-react';

export default function AdminOrdersPage() {
  const { canEdit } = useAdminRole();
  // We'll restrict editing orders to catalog_admin or super_admin
  const hasEditPermission = canEdit('orders'); // We'll map 'orders' to super_admin and support_admin maybe? Wait, support_admin handles customer service so they should edit orders! Let's just use the boolean.

  const [orders, setOrders] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/orders`);
      const data = await res.json();
      if (Array.isArray(data)) setOrders(data);
    } catch (e) {
      console.error("Failed to fetch orders", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateOrderStatus = async (id: string, newStatus: string) => {
    if (!hasEditPermission) return;
    try {
      const res = await fetch(`${API_URL}/orders/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus } : o));
      }
    } catch (e) {
      console.error(e);
      alert('Failed to update status');
    }
  };

  const filteredOrders = orders.filter(o => 
    o.id?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    o.customerId?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'PENDING':
        return <span className="flex items-center gap-1.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide"><Clock className="w-3 h-3" /> Pending</span>;
      case 'PROCESSING':
        return <span className="flex items-center gap-1.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide"><RefreshCw className="w-3 h-3" /> Processing</span>;
      case 'SHIPPED':
        return <span className="flex items-center gap-1.5 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide"><Truck className="w-3 h-3" /> Shipped</span>;
      case 'DELIVERED':
        return <span className="flex items-center gap-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide"><CheckCircle className="w-3 h-3" /> Delivered</span>;
      case 'CANCELLED':
        return <span className="flex items-center gap-1.5 bg-rose-500/10 text-rose-400 border border-rose-500/20 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide"><XCircle className="w-3 h-3" /> Cancelled</span>;
      default:
        return <span className="bg-slate-500/10 text-slate-400 border border-slate-500/20 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide">{status || 'UNKNOWN'}</span>;
    }
  };

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in duration-300 w-full">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Order Management</h1>
          <p className="text-slate-400 mt-2 text-sm">Track, manage, and update customer orders in real-time.</p>
        </div>
        <button 
          onClick={fetchOrders}
          className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 border border-slate-700"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </header>

      {!hasEditPermission && (
        <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-xl flex items-center gap-3 mb-8">
          <ShieldAlert className="w-5 h-5" />
          <p className="text-sm font-medium">You do not have permission to modify orders. Contact a Support Admin or Super Admin.</p>
        </div>
      )}

      <div className="bg-slate-800 rounded-2xl border border-slate-700 shadow-lg overflow-hidden">
        <div className="p-4 border-b border-slate-700 bg-slate-900/50 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search by Order ID or Customer ID..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 w-full text-sm transition-colors" 
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-900 border-b border-slate-700 text-slate-400 text-[10px] uppercase tracking-widest font-black">
              <tr>
                <th className="p-4 pl-6">Order ID</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Status</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-indigo-400" />
                    Loading orders...
                  </td>
                </tr>
              ) : filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-700/30 transition-all group">
                  <td className="p-4 pl-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center border border-blue-500/30 text-blue-400">
                        <ShoppingBag className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-bold text-white text-sm font-mono">{order.id.slice(0,8)}...</div>
                        <div className="text-xs text-slate-500 mt-0.5">{new Date(order.createdAt || Date.now()).toLocaleDateString()}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-xs font-mono text-slate-400 bg-slate-900 px-2 py-1 rounded border border-slate-700">
                      {order.customerId?.slice(0,8) || 'GUEST'}
                    </span>
                  </td>
                  <td className="p-4 font-bold text-white">
                    ₹{order.totalAmount || 0}
                  </td>
                  <td className="p-4">
                    {hasEditPermission ? (
                      <select 
                        value={order.status || 'PENDING'}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                        className="bg-slate-900 border border-slate-700 text-slate-300 text-xs font-bold rounded-lg px-2 py-1 focus:outline-none focus:border-indigo-500"
                      >
                        <option value="PENDING">Pending</option>
                        <option value="PROCESSING">Processing</option>
                        <option value="SHIPPED">Shipped</option>
                        <option value="DELIVERED">Delivered</option>
                        <option value="CANCELLED">Cancelled</option>
                      </select>
                    ) : (
                      getStatusBadge(order.status || 'PENDING')
                    )}
                  </td>
                  <td className="p-4 pr-6 text-right">
                    <button className="p-1.5 text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-colors inline-flex">
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {!loading && filteredOrders.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500">
                    No orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
