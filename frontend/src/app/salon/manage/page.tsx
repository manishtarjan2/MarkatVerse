"use client";
import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Scissors, Users, Clock, TrendingUp, ChevronRight, Plus, RefreshCw,
  PlayCircle, XCircle, CheckCircle2, Settings, Loader2, IndianRupee,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

interface TokenItem {
  id: string;
  tokenNumber: number;
  customerName: string;
  service: string;
  status: string;
  joinedAt: string;
}

interface QueueStatus {
  queue: {
    id: string;
    shopName: string;
    currentToken: number;
    lastToken: number;
    avgMinutes: number;
    pricePerHour: number;
    isOpen: boolean;
  };
  serving: TokenItem | null;
  waiting: TokenItem[];
  waitingCount: number;
  doneToday: number;
}

interface Stats {
  done: number;
  noShow: number;
  waiting: number;
  serving: number;
  totalHours: number;
  estimatedRevenue: number;
  queue: { shopName: string; pricePerHour: number } | null;
}

interface QueueOption { id: string; shopName: string; isOpen: boolean; }

export default function SalonManagePage() {
  const [queues, setQueues] = useState<QueueOption[]>([]);
  const [selectedQueueId, setSelectedQueueId] = useState<string>("");
  const [status, setStatus] = useState<QueueStatus | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"queue" | "stats" | "settings">("queue");
  const { user } = useAuth();

  // Create queue form
  const [showCreate, setShowCreate] = useState(false);
  const [newShopName, setNewShopName] = useState("");
  const [newAvgMin, setNewAvgMin] = useState("20");
  const [newPricePerHour, setNewPricePerHour] = useState("500");
  const [creating, setCreating] = useState(false);

  // Settings form
  const [settingsAvgMin, setSettingsAvgMin] = useState("");
  const [settingsPricePerHour, setSettingsPricePerHour] = useState("");
  const [settingsSaving, setSettingsSaving] = useState(false);

  const loadQueues = async () => {
    if (user?.id) {
      try {
        const res = await fetch(`${API}/salon/seller/${user.id}`);
        const text = await res.text();
        const data = text ? JSON.parse(text) : null;
        if (data && data.id) {
          setQueues([data]);
          if (!selectedQueueId) setSelectedQueueId(data.id);
        } else {
          setQueues([]);
        }
      } catch (e) {
        console.error(e);
      }
    } else {
      // Fallback
      const res = await fetch(`${API}/salon/queues`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setQueues(data);
        if (!selectedQueueId && data.length > 0) {
          setSelectedQueueId(data[0].id);
        }
      }
    }
  };

  const fetchStatus = useCallback(async () => {
    if (!selectedQueueId) return;
    setLoading(true);
    try {
      const [statusRes, statsRes] = await Promise.all([
        fetch(`${API}/salon/${selectedQueueId}/status`),
        fetch(`${API}/salon/${selectedQueueId}/stats`),
      ]);
      const statusData = await statusRes.json();
      const statsData = await statsRes.json();
      setStatus(statusData);
      setStats(statsData);
      if (statusData?.queue) {
        setSettingsAvgMin(String(statusData.queue.avgMinutes));
        setSettingsPricePerHour(String(statusData.queue.pricePerHour));
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [selectedQueueId]);

  useEffect(() => {
    loadQueues();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 15000);
    return () => clearInterval(interval);
  }, [fetchStatus]);

  const callNext = async () => {
    if (!selectedQueueId) return;
    setActionLoading("next");
    try {
      await fetch(`${API}/salon/${selectedQueueId}/next`, { method: "POST" });
      await fetchStatus();
    } finally {
      setActionLoading(null);
    }
  };

  const markNoShow = async (tokenId: string) => {
    setActionLoading(tokenId);
    try {
      await fetch(`${API}/salon/token/${tokenId}/no-show`, { method: "PATCH" });
      await fetchStatus();
    } finally {
      setActionLoading(null);
    }
  };

  const markDone = async (tokenId: string) => {
    setActionLoading(tokenId);
    try {
      await fetch(`${API}/salon/token/${tokenId}/done`, { method: "PATCH" });
      await fetchStatus();
    } finally {
      setActionLoading(null);
    }
  };

  const resetQueue = async () => {
    if (!selectedQueueId || !confirm("Reset queue? This removes all tokens for a fresh start.")) return;
    await fetch(`${API}/salon/${selectedQueueId}/reset`, { method: "DELETE" });
    await fetchStatus();
  };

  const createQueue = async () => {
    if (!newShopName.trim()) return;
    setCreating(true);
    try {
      const res = await fetch(`${API}/salon/queue`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          shopName: newShopName.trim(), 
          avgMinutes: Number(newAvgMin), 
          pricePerHour: Number(newPricePerHour),
          sellerId: user?.id || null 
        }),
      });
      const data = await res.json();
      await loadQueues();
      setSelectedQueueId(data.id);
      setShowCreate(false);
      setNewShopName("");
    } finally {
      setCreating(false);
    }
  };

  const saveSettings = async () => {
    if (!selectedQueueId) return;
    setSettingsSaving(true);
    try {
      await fetch(`${API}/salon/${selectedQueueId}/settings`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ avgMinutes: Number(settingsAvgMin), pricePerHour: Number(settingsPricePerHour) }),
      });
      await fetchStatus();
    } finally {
      setSettingsSaving(false);
    }
  };

  const toggleOpen = async () => {
    if (!selectedQueueId || !status) return;
    await fetch(`${API}/salon/${selectedQueueId}/settings`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isOpen: !status.queue.isOpen }),
    });
    await fetchStatus();
  };

  return (
    <div className="min-h-screen bg-[#0d0d14] text-white">

      {/* Header */}
      <header className="border-b border-white/5 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-purple-600/30 border border-purple-500/30 rounded-xl flex items-center justify-center">
            <Scissors className="w-5 h-5 text-purple-300" />
          </div>
          <div>
            <div className="font-black text-white text-base leading-none">Salon Manager</div>
            <div className="text-slate-500 text-xs">Queue Control Panel</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => fetchStatus()}
            className="p-2 text-slate-400 hover:text-white transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <Link
            href="/salon/queue"
            className="text-sm text-purple-400 hover:text-purple-300 font-semibold border border-purple-500/30 px-3 py-1.5 rounded-lg transition-colors"
          >
            📺 Live Board
          </Link>
          <Link
            href="/salon/join"
            className="text-sm bg-purple-600 hover:bg-purple-500 text-white font-semibold px-3 py-1.5 rounded-lg transition-colors"
          >
            + Join
          </Link>
        </div>
      </header>

      <div className="max-w-5xl mx-auto p-4 sm:p-6">

        {/* Queue Selector + Create */}
        <div className="flex items-center gap-3 mb-6">
          {queues.length > 0 ? (
            <select
              value={selectedQueueId}
              onChange={(e) => setSelectedQueueId(e.target.value)}
              className="flex-1 bg-white/5 border border-white/10 text-white px-4 py-3 rounded-xl outline-none font-semibold text-sm"
            >
              {queues.map((q) => (
                <option key={q.id} value={q.id} className="bg-slate-900">
                  {q.shopName} {q.isOpen ? "🟢" : "🔴"}
                </option>
              ))}
            </select>
          ) : (
            <div className="flex-1 text-slate-500 text-sm">No queues yet. Create one →</div>
          )}
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white font-bold px-4 py-3 rounded-xl transition-all whitespace-nowrap text-sm"
          >
            <Plus className="w-4 h-4" /> New Queue
          </button>
        </div>

        {/* Create Queue Modal */}
        {showCreate && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-[#1a1a2e] border border-white/10 rounded-3xl p-6 w-full max-w-sm shadow-2xl">
              <h3 className="text-white font-bold text-lg mb-5 flex items-center gap-2">
                <Scissors className="w-5 h-5 text-purple-400" /> Create Salon Queue
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-slate-400 text-xs font-semibold uppercase tracking-wider block mb-1.5">Salon Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Raja&apos;s Hair Studio"
                    value={newShopName}
                    onChange={(e) => setNewShopName(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 focus:border-purple-400 text-white px-4 py-3 rounded-xl outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-400 text-xs font-semibold uppercase tracking-wider block mb-1.5">Avg Min/Person</label>
                    <input
                      type="number"
                      value={newAvgMin}
                      onChange={(e) => setNewAvgMin(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 focus:border-purple-400 text-white px-4 py-3 rounded-xl outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 text-xs font-semibold uppercase tracking-wider block mb-1.5">₹/Hour Rate</label>
                    <input
                      type="number"
                      value={newPricePerHour}
                      onChange={(e) => setNewPricePerHour(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 focus:border-purple-400 text-white px-4 py-3 rounded-xl outline-none"
                    />
                  </div>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowCreate(false)}
                  className="flex-1 border border-white/10 text-slate-400 hover:text-white py-3 rounded-xl font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={createQueue}
                  disabled={creating || !newShopName.trim()}
                  className="flex-1 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white py-3 rounded-xl font-bold transition-colors"
                >
                  {creating ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Create"}
                </button>
              </div>
            </div>
          </div>
        )}

        {status && (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              {[
                { label: "Waiting", value: status.waitingCount, icon: <Users className="w-4 h-4" />, color: "text-amber-400" },
                { label: "Serving", value: status.serving ? 1 : 0, icon: <PlayCircle className="w-4 h-4" />, color: "text-emerald-400" },
                { label: "Done Today", value: status.doneToday, icon: <CheckCircle2 className="w-4 h-4" />, color: "text-blue-400" },
                { label: "Est. Revenue", value: `₹${stats ? Math.round(stats.estimatedRevenue) : 0}`, icon: <IndianRupee className="w-4 h-4" />, color: "text-purple-400" },
              ].map((card) => (
                <div key={card.label} className="bg-white/5 border border-white/5 rounded-2xl p-4">
                  <div className={`flex items-center gap-1.5 ${card.color} text-xs font-semibold uppercase tracking-wider mb-2`}>
                    {card.icon} {card.label}
                  </div>
                  <div className="text-white font-black text-2xl">{card.value}</div>
                </div>
              ))}
            </div>

            {/* Open/Close toggle */}
            <div className="flex items-center justify-between bg-white/5 border border-white/5 rounded-2xl px-5 py-3 mb-5">
              <div>
                <div className="text-white font-bold">{status.queue.shopName}</div>
                <div className="text-slate-400 text-xs">{status.queue.isOpen ? "Accepting customers" : "Queue is closed"}</div>
              </div>
              <button
                onClick={toggleOpen}
                className={`font-bold text-sm px-4 py-2 rounded-xl transition-all ${
                  status.queue.isOpen
                    ? "bg-red-500/20 text-red-400 border border-red-400/30 hover:bg-red-500/30"
                    : "bg-emerald-500/20 text-emerald-400 border border-emerald-400/30 hover:bg-emerald-500/30"
                }`}
              >
                {status.queue.isOpen ? "🔴 Close Queue" : "🟢 Open Queue"}
              </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 bg-white/5 border border-white/5 rounded-xl p-1 mb-5">
              {([["queue", "Queue"], ["stats", "Stats"], ["settings", "Settings"]] as const).map(([t, label]) => (
                <button
                  key={t}
                  onClick={() => setActiveTab(t)}
                  className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${
                    activeTab === t ? "bg-purple-600 text-white shadow-lg" : "text-slate-400 hover:text-white"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* TAB: Queue */}
            {activeTab === "queue" && (
              <div className="space-y-4">

                {/* Call Next Button */}
                <button
                  onClick={callNext}
                  disabled={actionLoading === "next" || status.waitingCount === 0}
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 text-white font-black text-xl py-5 rounded-2xl transition-all shadow-xl shadow-purple-600/20 flex items-center justify-center gap-3"
                >
                  {actionLoading === "next" ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    <ChevronRight className="w-6 h-6" />
                  )}
                  Call Next Customer
                </button>

                {/* Currently Serving */}
                {status.serving && (
                  <div className="bg-emerald-500/10 border border-emerald-400/20 rounded-2xl p-5">
                    <div className="text-emerald-400 text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-1.5">
                      <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                      Currently Serving
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-emerald-600/30 border border-emerald-400/30 rounded-2xl flex items-center justify-center text-emerald-300 font-black text-xl">
                          #{status.serving.tokenNumber}
                        </div>
                        <div>
                          <div className="text-white font-bold">{status.serving.customerName}</div>
                          <div className="text-slate-400 text-sm">{status.serving.service}</div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => markDone(status.serving!.id)}
                          disabled={!!actionLoading}
                          className="bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-400/30 p-2.5 rounded-xl transition-all"
                          title="Mark Done"
                        >
                          {actionLoading === status.serving.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => markNoShow(status.serving!.id)}
                          disabled={!!actionLoading}
                          className="bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-400/30 p-2.5 rounded-xl transition-all"
                          title="No Show"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Waiting list */}
                <div>
                  <div className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-3 flex items-center justify-between">
                    <span>Waiting ({status.waitingCount})</span>
                    <span className="text-purple-400">↑ Fair queue order</span>
                  </div>

                  {status.waiting.length === 0 ? (
                    <div className="bg-white/3 border border-white/5 rounded-2xl p-8 text-center text-slate-500">
                      <div className="text-3xl mb-2">✅</div>
                      No one is waiting right now
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {status.waiting.map((t, i) => (
                        <div
                          key={t.id}
                          className={`flex items-center gap-3 px-4 py-3 rounded-2xl border ${
                            i === 0
                              ? "bg-purple-600/10 border-purple-400/20"
                              : "bg-white/3 border-white/5"
                          }`}
                        >
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm shrink-0 ${
                            i === 0 ? "bg-purple-600 text-white" : "bg-white/5 text-slate-400"
                          }`}>
                            #{t.tokenNumber}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-white font-semibold text-sm">{t.customerName}</div>
                            <div className="text-slate-500 text-xs flex items-center gap-2">
                              <span>{t.service}</span>
                              <span>·</span>
                              <Clock className="w-3 h-3" />
                              <span>~{i * status.queue.avgMinutes + (status.serving ? status.queue.avgMinutes : 0)}m wait</span>
                            </div>
                          </div>
                          {i === 0 && (
                            <div className="text-purple-300 text-xs font-bold">NEXT</div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Reset */}
                <div className="pt-4 border-t border-white/5">
                  <button
                    onClick={resetQueue}
                    className="text-sm text-red-400/60 hover:text-red-400 transition-colors"
                  >
                    🔄 Reset Queue (New Day)
                  </button>
                </div>
              </div>
            )}

            {/* TAB: Stats */}
            {activeTab === "stats" && stats && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: "Customers Done", value: stats.done, icon: "✅", color: "text-emerald-400" },
                    { label: "No Shows", value: stats.noShow, icon: "❌", color: "text-red-400" },
                    { label: "Total Hours Worked", value: `${stats.totalHours.toFixed(1)}h`, icon: "⏱️", color: "text-blue-400" },
                    { label: "Est. Revenue Today", value: `₹${Math.round(stats.estimatedRevenue)}`, icon: "💰", color: "text-purple-400" },
                  ].map((s) => (
                    <div key={s.label} className="bg-white/5 border border-white/5 rounded-2xl p-5">
                      <div className="text-2xl mb-2">{s.icon}</div>
                      <div className={`font-black text-3xl ${s.color} mb-1`}>{s.value}</div>
                      <div className="text-slate-400 text-xs font-semibold">{s.label}</div>
                    </div>
                  ))}
                </div>

                {stats.queue && (
                  <div className="bg-white/5 border border-white/5 rounded-2xl p-5">
                    <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-wider mb-3">
                      <TrendingUp className="w-4 h-4" /> Revenue Calculation
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Rate</span>
                        <span className="text-white font-semibold">₹{stats.queue.pricePerHour}/hour</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Customers × Avg time</span>
                        <span className="text-white font-semibold">{stats.done} × {stats.queue ? 20 : 20}min</span>
                      </div>
                      <div className="flex justify-between border-t border-white/10 pt-2 mt-2">
                        <span className="text-white font-bold">Total Estimated</span>
                        <span className="text-purple-400 font-black">₹{Math.round(stats.estimatedRevenue)}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB: Settings */}
            {activeTab === "settings" && (
              <div className="space-y-4">
                <div className="bg-white/5 border border-white/5 rounded-2xl p-5">
                  <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                    <Settings className="w-4 h-4 text-purple-400" /> Queue Settings
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-slate-400 text-xs font-semibold uppercase tracking-wider block mb-2">
                        Average Minutes Per Customer
                      </label>
                      <div className="flex items-center gap-3">
                        <input
                          type="number"
                          value={settingsAvgMin}
                          onChange={(e) => setSettingsAvgMin(e.target.value)}
                          className="flex-1 bg-white/5 border border-white/10 focus:border-purple-400 text-white px-4 py-3 rounded-xl outline-none"
                        />
                        <Clock className="w-4 h-4 text-slate-500" />
                      </div>
                      <p className="text-slate-500 text-xs mt-1.5">Used to calculate wait time estimates shown to customers.</p>
                    </div>
                    <div>
                      <label className="text-slate-400 text-xs font-semibold uppercase tracking-wider block mb-2">
                        Premium Rate (₹ per hour)
                      </label>
                      <div className="flex items-center gap-3">
                        <input
                          type="number"
                          value={settingsPricePerHour}
                          onChange={(e) => setSettingsPricePerHour(e.target.value)}
                          className="flex-1 bg-white/5 border border-white/10 focus:border-purple-400 text-white px-4 py-3 rounded-xl outline-none"
                        />
                        <IndianRupee className="w-4 h-4 text-slate-500" />
                      </div>
                      <p className="text-slate-500 text-xs mt-1.5">Used to estimate daily revenue in the Stats tab.</p>
                    </div>
                    <button
                      onClick={saveSettings}
                      disabled={settingsSaving}
                      className="w-full bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2"
                    >
                      {settingsSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                      Save Settings
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {!status && !loading && (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">✂️</div>
            <p className="text-slate-400 text-lg">Create a queue to get started!</p>
            <button
              onClick={() => setShowCreate(true)}
              className="mt-4 bg-purple-600 hover:bg-purple-500 text-white font-bold px-6 py-3 rounded-xl transition-all inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Create Your First Queue
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
