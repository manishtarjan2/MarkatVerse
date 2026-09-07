"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Scissors, Users, Clock, ChevronRight, Loader2, RefreshCw,
  Search, Ticket, CheckCircle2, AlertCircle, X
} from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

interface TokenItem {
  id: string;
  tokenNumber: number;
  customerName: string;
  service: string;
  status: string;
}

interface QueueStatus {
  queue: {
    id: string; shopName: string; currentToken: number;
    avgMinutes: number; pricePerHour: number; isOpen: boolean;
  };
  serving: TokenItem | null;
  waiting: TokenItem[];
  waitingCount: number;
  doneToday: number;
  estimatedWaitForNext: number;
}

interface QueueOption {
  id: string; shopName: string; currentToken: number; isOpen: boolean;
}

interface TrackResult {
  found: boolean;
  token?: {
    id: string; tokenNumber: number; customerName: string;
    service: string; status: string;
  };
  ahead?: number;
  estimatedWaitMin?: number;
  serving?: { tokenNumber: number; customerName: string } | null;
  message?: string;
}

import { Suspense } from "react";

function QueueBoardContent() {
  const searchParams = useSearchParams();
  const queueIdParam = searchParams.get("queueId");

  const [queues, setQueues] = useState<QueueOption[]>([]);
  const [selectedQueueId, setSelectedQueueId] = useState<string>(queueIdParam ?? "");
  const [status, setStatus] = useState<QueueStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [tick, setTick] = useState(0);

  // Token tracker state
  const [trackInput, setTrackInput] = useState("");
  const [tracking, setTracking] = useState(false);
  const [trackResult, setTrackResult] = useState<TrackResult | null>(null);
  const trackInputRef = useRef<HTMLInputElement>(null);

  // Load available queues
  useEffect(() => {
    fetch(`${API}/salon/queues`)
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setQueues(data);
          if (!queueIdParam && data.length > 0) setSelectedQueueId(data[0].id);
        }
      })
      .catch(() => {});
  }, [queueIdParam]);

  const fetchStatus = useCallback(async () => {
    if (!selectedQueueId) return;
    setLoading(true);
    try {
      const res = await fetch(`${API}/salon/${selectedQueueId}/status`);
      if (!res.ok) return;
      const data = await res.json();
      setStatus(data);
      setLastUpdated(new Date());
    } catch { /* silently fail */ } finally { setLoading(false); }
  }, [selectedQueueId]);

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(() => { fetchStatus(); setTick((t) => t + 1); }, 10000);
    return () => clearInterval(interval);
  }, [fetchStatus]);

  // ── Track a token number ────────────────────────────────────────────────────
  const handleTrack = async () => {
    const num = parseInt(trackInput.trim());
    if (!num || isNaN(num) || !status) {
      setTrackResult({ found: false, message: "Enter a valid token number" });
      return;
    }
    setTracking(true);
    setTrackResult(null);

    // Find token in waiting list or serving
    const inWaiting = status.waiting.find(t => t.tokenNumber === num);
    const inServing = status.serving?.tokenNumber === num ? status.serving : null;

    if (inServing) {
      setTrackResult({
        found: true,
        token: { ...inServing, status: "SERVING" } as TrackResult["token"],
        ahead: 0,
        estimatedWaitMin: 0,
        serving: status.serving,
      });
    } else if (inWaiting) {
      const ahead = status.waiting.filter(t => t.tokenNumber < num).length;
      const servingTime = status.serving ? status.queue.avgMinutes : 0;
      const estimatedWaitMin = ahead * status.queue.avgMinutes + servingTime;
      setTrackResult({ found: true, token: inWaiting, ahead, estimatedWaitMin, serving: status.serving });
    } else if (num <= status.queue.currentToken) {
      // Token number is already done (below or equal to current)
      setTrackResult({
        found: true,
        token: { id: "", tokenNumber: num, customerName: "—", service: "—", status: "DONE" },
        ahead: 0, estimatedWaitMin: 0,
      });
    } else {
      setTrackResult({ found: false, message: `Token #${num} not found in this queue` });
    }
    setTracking(false);
  };

  const nextInLine = status?.waiting.slice(0, 6) ?? [];
  const _ = tick; // suppress lint

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white flex flex-col">

      {/* ── Top Bar ──────────────────────────────────────────────────────── */}
      <header className="flex items-center justify-between px-5 py-4 border-b border-white/5 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-violet-600/30 border border-violet-500/30 rounded-xl flex items-center justify-center">
            <Scissors className="w-5 h-5 text-violet-300" />
          </div>
          <div>
            <div className="font-black text-white text-sm leading-none">Smart Queue</div>
            <div className="text-[10px] text-slate-500 font-semibold">Live Board</div>
          </div>
        </div>

        {queues.length > 1 && (
          <select value={selectedQueueId} onChange={(e) => setSelectedQueueId(e.target.value)}
            className="bg-white/5 border border-white/10 text-white text-sm px-3 py-2 rounded-xl outline-none">
            {queues.map((q) => (
              <option key={q.id} value={q.id} className="bg-slate-900">{q.shopName}</option>
            ))}
          </select>
        )}

        <div className="flex items-center gap-2">
          <button onClick={() => fetchStatus()}
            className="text-slate-400 hover:text-white transition-colors p-2">
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-violet-400" : ""}`} />
          </button>
          <Link href="/salon/join"
            className="bg-violet-600 hover:bg-violet-500 text-white font-bold px-4 py-2 rounded-xl text-sm transition-all shadow-lg shadow-violet-900/30">
            Get Token 🎫
          </Link>
        </div>
      </header>

      {/* ── No Queue ─────────────────────────────────────────────────────── */}
      {!status ? (
        <div className="flex-1 flex items-center justify-center">
          {loading ? (
            <div className="text-center">
              <Loader2 className="w-10 h-10 text-violet-400 animate-spin mx-auto mb-3" />
              <p className="text-slate-400">Loading queue…</p>
            </div>
          ) : (
            <div className="text-center">
              <div className="text-5xl mb-4">✂️</div>
              <p className="text-slate-400 text-lg">{queues.length === 0 ? "No salon queues found." : "Select a salon above."}</p>
              <Link href="/salon/manage" className="mt-4 inline-block text-violet-400 underline text-sm">Set up a queue →</Link>
            </div>
          )}
        </div>
      ) : (
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">

          {/* ── LEFT: Big Live Display ──────────────────────────────────── */}
          <div className="flex-1 flex flex-col items-center justify-center p-8 lg:p-16 relative overflow-hidden">

            {/* Glow */}
            <div className={`absolute w-[500px] h-[500px] rounded-full blur-3xl opacity-15 pointer-events-none transition-colors duration-1000 ${status.serving ? "bg-emerald-500" : "bg-violet-600"}`} />

            <div className="relative z-10 text-center w-full max-w-sm">
              {/* Shop name */}
              <div className="text-slate-500 text-xs font-black uppercase tracking-[0.3em] mb-4">
                {status.queue.shopName}
              </div>

              {/* NOW SERVING — Big Number */}
              <div className="text-slate-500 text-xs font-black uppercase tracking-widest mb-1">NOW SERVING</div>
              {status.serving ? (
                <div className="mb-6">
                  <div className="text-[9rem] lg:text-[12rem] font-black leading-none text-emerald-400 drop-shadow-2xl" style={{ textShadow: "0 0 80px rgba(52,211,153,0.35)" }}>
                    #{status.serving.tokenNumber}
                  </div>
                  <div className="text-emerald-200/80 text-xl font-bold">{status.serving.customerName}</div>
                  <div className="text-slate-500 text-sm mt-1 flex items-center justify-center gap-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                    ✂️ {status.serving.service} — In Progress
                  </div>
                </div>
              ) : (
                <div className="mb-6">
                  <div className="text-[9rem] lg:text-[12rem] font-black leading-none text-slate-700">—</div>
                  <div className="text-slate-600 text-lg mt-2">Queue not started</div>
                </div>
              )}

              {/* Stats row */}
              <div className="flex items-center justify-center gap-8">
                <div className="text-center">
                  <div className="text-slate-500 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-1 mb-1"><Users className="w-3 h-3" /> Waiting</div>
                  <div className="text-white text-3xl font-black">{status.waitingCount}</div>
                </div>
                <div className="w-px h-8 bg-white/10" />
                <div className="text-center">
                  <div className="text-slate-500 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-1 mb-1"><Clock className="w-3 h-3" /> Avg Time</div>
                  <div className="text-white text-3xl font-black">{status.queue.avgMinutes}m</div>
                </div>
                <div className="w-px h-8 bg-white/10" />
                <div className="text-center">
                  <div className="text-slate-500 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-1 mb-1"><CheckCircle2 className="w-3 h-3" /> Done</div>
                  <div className="text-white text-3xl font-black">{status.doneToday}</div>
                </div>
              </div>

              {/* ── TRACK YOUR TOKEN ──────────────────────────────────── */}
              <div className="mt-8 w-full">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                  <div className="text-slate-400 text-xs font-black uppercase tracking-widest mb-3 flex items-center gap-2">
                    <Search className="w-3.5 h-3.5 text-violet-400" /> Track Your Token Number
                  </div>
                  <div className="flex gap-2">
                    <div className="flex-1 flex items-center bg-white/5 border border-white/10 focus-within:border-violet-400 rounded-xl px-3 transition-colors">
                      <span className="text-violet-400 font-black text-lg mr-1">#</span>
                      <input
                        ref={trackInputRef}
                        type="number"
                        placeholder="Enter token no."
                        value={trackInput}
                        onChange={e => { setTrackInput(e.target.value); setTrackResult(null); }}
                        onKeyDown={e => e.key === 'Enter' && handleTrack()}
                        className="flex-1 bg-transparent py-3 text-white font-bold text-lg outline-none placeholder-slate-600"
                      />
                      {trackInput && (
                        <button onClick={() => { setTrackInput(''); setTrackResult(null); }}
                          className="text-slate-600 hover:text-white transition-colors">
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    <button
                      onClick={handleTrack}
                      disabled={tracking || !trackInput}
                      className="bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white font-black px-5 py-3 rounded-xl transition-all flex items-center gap-2 text-sm whitespace-nowrap"
                    >
                      {tracking ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                      Check
                    </button>
                  </div>

                  {/* Track Result */}
                  {trackResult && (
                    <div className={`mt-3 rounded-xl p-4 border ${
                      !trackResult.found
                        ? 'bg-red-500/10 border-red-400/20'
                        : trackResult.token?.status === 'SERVING'
                          ? 'bg-emerald-500/10 border-emerald-400/30'
                          : trackResult.token?.status === 'DONE'
                            ? 'bg-blue-500/10 border-blue-400/20'
                            : 'bg-violet-500/10 border-violet-400/30'
                    }`}>
                      {!trackResult.found ? (
                        <div className="flex items-center gap-2 text-red-300 text-sm">
                          <AlertCircle className="w-4 h-4 shrink-0" />
                          <span className="font-semibold">{trackResult.message}</span>
                        </div>
                      ) : trackResult.token?.status === 'SERVING' ? (
                        <div className="text-center">
                          <div className="text-emerald-400 font-black text-xl mb-1">🎉 It&apos;s Your Turn!</div>
                          <div className="text-emerald-200/80 text-sm font-semibold">Token #{trackResult.token.tokenNumber} — Please head in now</div>
                        </div>
                      ) : trackResult.token?.status === 'DONE' ? (
                        <div className="text-center">
                          <div className="text-blue-400 font-black text-base mb-1">✅ Token #{trackResult.token.tokenNumber} — Completed</div>
                          <div className="text-slate-400 text-xs">This token has already been served.</div>
                        </div>
                      ) : (
                        <div>
                          {/* Token found — waiting */}
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <div className="text-violet-300 text-xs font-black uppercase tracking-widest mb-0.5">Your Token</div>
                              <div className="text-white font-black text-2xl">#{trackResult.token?.tokenNumber}</div>
                              <div className="text-slate-400 text-xs">{trackResult.token?.customerName} · {trackResult.token?.service}</div>
                            </div>
                            <Link href={`/salon/token/${trackResult.token?.id}`}
                              className="bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs px-3 py-2 rounded-xl transition-all flex items-center gap-1">
                              <Ticket className="w-3.5 h-3.5" /> Full View
                            </Link>
                          </div>

                          <div className="grid grid-cols-3 gap-2">
                            {[
                              { val: trackResult.ahead ?? 0, label: 'Ahead', icon: '👥' },
                              { val: `${trackResult.estimatedWaitMin ?? 0}m`, label: 'Est. Wait', icon: '⏱️' },
                              { val: trackResult.serving ? `#${trackResult.serving.tokenNumber}` : '—', label: 'Serving Now', icon: '✂️' },
                            ].map(s => (
                              <div key={s.label} className="bg-white/5 rounded-xl p-2.5 text-center">
                                <div className="text-base mb-0.5">{s.icon}</div>
                                <div className="text-white font-black text-base leading-none">{s.val}</div>
                                <div className="text-slate-500 text-[9px] font-semibold mt-0.5">{s.label}</div>
                              </div>
                            ))}
                          </div>

                          {(trackResult.ahead ?? 0) === 0 && (
                            <div className="mt-3 bg-amber-500/10 border border-amber-400/20 rounded-xl px-3 py-2 text-amber-300 text-xs font-bold text-center">
                              ⚡ You&apos;re next! Get ready to head in.
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Last updated */}
              <div className="mt-4 text-slate-600 text-[10px]">
                {lastUpdated && `Auto-refreshes · Last: ${lastUpdated.toLocaleTimeString()}`}
              </div>
            </div>
          </div>

          {/* ── RIGHT: Waiting List ─────────────────────────────────────── */}
          <div className="w-full lg:w-[320px] shrink-0 border-t lg:border-t-0 lg:border-l border-white/5 flex flex-col">

            <div className="px-5 py-4 border-b border-white/5">
              <h2 className="text-white font-black text-sm flex items-center gap-2">
                <ChevronRight className="w-4 h-4 text-violet-400" /> Up Next in Queue
              </h2>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {nextInLine.length === 0 ? (
                <div className="text-center py-12 text-slate-600">
                  <div className="text-4xl mb-3">🎉</div>
                  <div className="font-bold text-sm">Queue is clear!</div>
                  <div className="text-xs mt-1 text-slate-700">No one is waiting right now.</div>
                </div>
              ) : (
                nextInLine.map((t, i) => (
                  <div key={t.id}
                    className={`flex items-center gap-3 px-4 py-3 rounded-2xl border transition-all ${
                      i === 0 ? "bg-violet-600/15 border-violet-400/25" : "bg-white/3 border-white/5"
                    }`}>
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm shrink-0 ${
                      i === 0 ? "bg-violet-600 text-white shadow-lg shadow-violet-900/50" : "bg-white/5 text-slate-400"
                    }`}>
                      #{t.tokenNumber}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-white font-semibold text-sm truncate">{t.customerName}</div>
                      <div className="text-slate-500 text-[10px] flex items-center gap-1.5">
                        <span>{t.service}</span>
                        <span>·</span>
                        <span>~{(i) * status.queue.avgMinutes + (status.serving ? status.queue.avgMinutes : 0)}m</span>
                      </div>
                    </div>
                    {i === 0 && <div className="text-violet-400 text-[10px] font-black shrink-0">NEXT</div>}
                  </div>
                ))
              )}

              {status.waitingCount > 6 && (
                <div className="text-center text-slate-600 text-xs py-2">
                  +{status.waitingCount - 6} more in queue
                </div>
              )}
            </div>

            {/* Bottom: Join CTA */}
            <div className="p-4 border-t border-white/5 space-y-3">
              <Link href="/salon/join"
                className="block w-full bg-violet-600 hover:bg-violet-500 text-white font-black text-center py-3.5 rounded-2xl transition-all shadow-lg shadow-violet-900/30">
                🎫 Get Your Token
              </Link>
              <div className="text-center text-slate-600 text-xs">
                Est. wait if you join now: <span className="text-slate-400 font-bold">~{(status.waitingCount + 1) * status.queue.avgMinutes} min</span>
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}

export default function LiveQueueBoardPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0a0a0f] text-white flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-violet-400 animate-spin" />
      </div>
    }>
      <QueueBoardContent />
    </Suspense>
  );
}
