"use client";
import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Clock, CheckCircle2, Loader2, RefreshCw, ArrowLeft,
  AlertCircle, Scissors, Users
} from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

interface QueueToken {
  id: string;
  tokenNumber: number;
  customerName: string;
  service: string;
  status: string;
  doneAt?: string | null;
}

interface TokenData {
  token: QueueToken & { joinedAt: string };
  queue: { shopName: string; currentToken: number; avgMinutes: number; isOpen: boolean };
  ahead: number;
  serving: QueueToken | null;
  estimatedWaitMin: number;
  recentDone: QueueToken[];
  waitingTokens: QueueToken[];
  doneToday: number;
}

// Helper — time ago
function timeAgo(dateStr: string) {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 60000);
  if (diff < 1) return 'just now';
  if (diff < 60) return `${diff}m ago`;
  return `${Math.floor(diff / 60)}h ago`;
}

export default function TokenTrackerPage() {
  const params = useParams();
  const tokenId = params?.tokenId as string;
  const [data, setData] = useState<TokenData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [countdown, setCountdown] = useState(30);

  const fetchStatus = useCallback(async (showRefreshing = false) => {
    if (showRefreshing) setRefreshing(true);
    try {
      const res = await fetch(`${API}/salon/token/${tokenId}`);
      if (!res.ok) throw new Error("Token not found");
      setData(await res.json());
      setLastUpdated(new Date());
      setCountdown(30);
      setError("");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [tokenId]);

  // Auto-refresh every 30 sec + countdown
  useEffect(() => {
    fetchStatus();
    const interval = setInterval(() => fetchStatus(), 30000);
    const tick = setInterval(() => setCountdown(c => Math.max(0, c - 1)), 1000);
    return () => { clearInterval(interval); clearInterval(tick); };
  }, [fetchStatus]);

  // ── Loading ──────────────────────────────────────────────────────────────────
  if (loading) return (
    <div className="min-h-screen bg-[#0d0d14] flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 bg-violet-600/20 border border-violet-500/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Loader2 className="w-8 h-8 text-violet-400 animate-spin" />
        </div>
        <p className="text-slate-400 font-medium">Loading your token…</p>
      </div>
    </div>
  );

  // ── Error ────────────────────────────────────────────────────────────────────
  if (error || !data) return (
    <div className="min-h-screen bg-[#0d0d14] flex items-center justify-center p-4">
      <div className="text-center">
        <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
        <h2 className="text-white font-bold text-xl mb-2">Token Not Found</h2>
        <p className="text-slate-400 mb-6">{error}</p>
        <Link href="/salon/join" className="bg-violet-600 text-white px-6 py-3 rounded-2xl font-bold">Join a Queue</Link>
      </div>
    </div>
  );

  const { token, queue, ahead, serving, estimatedWaitMin, recentDone, waitingTokens, doneToday } = data;
  const isServing = token.status === "SERVING";
  const isDone    = token.status === "DONE";
  const isNoShow  = token.status === "NO_SHOW";
  const isWaiting = token.status === "WAITING";

  // Build the visual timeline:
  // [✅ done...] → [🔄 serving] → [⏳ you] → [⏳ waiting after you...]
  const waitingBefore = waitingTokens.filter(t => t.tokenNumber < token.tokenNumber);
  const waitingAfter  = waitingTokens.filter(t => t.tokenNumber > token.tokenNumber);

  return (
    <div className="min-h-screen bg-[#0d0d14] text-white pb-10">

      {/* Fixed background glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-violet-600/10 rounded-full blur-3xl" />
        {isServing && <div className="absolute inset-0 bg-emerald-600/5 animate-pulse" />}
      </div>

      <div className="relative z-10 max-w-lg mx-auto px-4 pt-6">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Link href="/salon/join" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-semibold">Back</span>
          </Link>
          <div className="flex items-center gap-2 text-slate-500 text-xs">
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-violet-400' : ''}`} />
            <button onClick={() => fetchStatus(true)} className="hover:text-violet-400 transition-colors font-medium">
              Refresh ({countdown}s)
            </button>
          </div>
        </div>

        {/* Salon name */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full mb-3">
            <Scissors className="w-3.5 h-3.5 text-violet-400" />
            <span className="text-slate-300 font-semibold text-sm">{queue.shopName}</span>
          </div>
          <h1 className="text-2xl font-black text-white">Queue Status</h1>
        </div>

        {/* ── Your Turn Alert ────────────────────────────────────────────── */}
        {isServing && (
          <div className="mb-5 bg-emerald-500/15 border-2 border-emerald-400/40 rounded-3xl p-5 text-center">
            <div className="text-4xl mb-2 animate-bounce">🎉</div>
            <div className="text-emerald-300 font-black text-2xl">It&apos;s Your Turn!</div>
            <div className="text-emerald-200/70 text-sm mt-1 font-medium">Please head to the salon now</div>
          </div>
        )}

        {/* ── YOUR TOKEN CARD ────────────────────────────────────────────── */}
        <div className={`rounded-3xl p-6 mb-5 border-2 relative overflow-hidden ${
          isServing  ? 'bg-emerald-600/10 border-emerald-400/40' :
          isDone     ? 'bg-blue-600/10 border-blue-400/30' :
          isNoShow   ? 'bg-red-600/10 border-red-400/30' :
                       'bg-violet-600/10 border-violet-400/30'
        }`}>
          {/* Subtle glow inside card */}
          <div className={`absolute -top-10 -right-10 w-40 h-40 rounded-full blur-2xl opacity-30 ${
            isServing ? 'bg-emerald-500' : isDone ? 'bg-blue-500' : 'bg-violet-500'
          }`} />

          <div className="relative z-10 flex items-start justify-between mb-4">
            {/* Status pill */}
            <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black border ${
              isServing ? 'bg-emerald-500/20 border-emerald-400/40 text-emerald-300' :
              isDone    ? 'bg-blue-500/20 border-blue-400/40 text-blue-300' :
              isNoShow  ? 'bg-red-500/20 border-red-400/40 text-red-300' :
                          'bg-violet-500/20 border-violet-400/40 text-violet-300'
            }`}>
              <div className={`w-1.5 h-1.5 rounded-full ${
                isServing ? 'bg-emerald-400 animate-pulse' :
                isDone    ? 'bg-blue-400' :
                isNoShow  ? 'bg-red-400' :
                            'bg-amber-400 animate-pulse'
              }`} />
              {isServing ? 'NOW SERVING YOU' : isDone ? 'COMPLETED' : isNoShow ? 'NO SHOW' : 'WAITING'}
            </div>
            <div className="text-right">
              <div className="text-slate-400 text-[10px] font-semibold uppercase tracking-wider">Service</div>
              <div className="text-white font-bold text-sm">{token.service}</div>
            </div>
          </div>

          {/* Big token number */}
          <div className="relative z-10 flex items-end gap-4 mb-5">
            <div>
              <div className="text-slate-400 text-xs font-black uppercase tracking-widest mb-1">Your Token</div>
              <div className={`text-[5.5rem] font-black leading-none tracking-tighter ${
                isServing ? 'text-emerald-300' : isDone ? 'text-blue-300' : 'text-white'
              }`}>
                #{token.tokenNumber}
              </div>
              <div className="text-slate-400 text-sm mt-1">{token.customerName}</div>
            </div>
          </div>

          {/* Stats — only if waiting or serving */}
          {!isDone && !isNoShow && (
            <div className="relative z-10 grid grid-cols-3 gap-3">
              {[
                { icon: <Users className="w-4 h-4" />, val: ahead, label: 'Ahead of you' },
                { icon: <Clock className="w-4 h-4" />, val: `${estimatedWaitMin}m`, label: 'Est. wait' },
                { icon: <CheckCircle2 className="w-4 h-4" />, val: doneToday, label: 'Done today' },
              ].map(s => (
                <div key={s.label} className="bg-black/20 border border-white/10 rounded-2xl p-3 text-center">
                  <div className="text-violet-400 flex justify-center mb-1">{s.icon}</div>
                  <div className="text-white font-black text-lg leading-none">{s.val}</div>
                  <div className="text-slate-500 text-[10px] font-semibold mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          )}

          {isDone && (
            <div className="relative z-10 text-center py-3">
              <CheckCircle2 className="w-10 h-10 text-blue-400 mx-auto mb-2" />
              <div className="text-blue-300 font-black text-lg">Service Complete 😊</div>
              <div className="text-slate-500 text-sm mt-1">Thank you for visiting!</div>
            </div>
          )}
        </div>

        {/* ── VISUAL QUEUE TIMELINE ──────────────────────────────────────── */}
        <div className="bg-white/3 border border-white/8 rounded-3xl p-5 mb-5">
          <h2 className="text-white font-black text-base mb-5 flex items-center justify-between">
            <span>Queue Timeline</span>
            {lastUpdated && (
              <span className="text-slate-500 text-xs font-medium">
                Updated {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            )}
          </h2>

          <div className="space-y-1">

            {/* ── DONE tokens ─────────────────────────────────────────── */}
            {recentDone.length > 0 && (
              <>
                <div className="text-slate-600 text-[10px] font-black uppercase tracking-widest px-2 pb-1">✅ Completed</div>
                {recentDone.map(t => {
                  const isYou = t.tokenNumber === token.tokenNumber;
                  return (
                    <div key={t.id} className={`flex items-center gap-3 px-3 py-2.5 rounded-2xl ${isYou ? 'bg-blue-600/15 border border-blue-400/30' : 'opacity-50'}`}>
                      <div className="w-9 h-9 bg-emerald-900/50 border border-emerald-700/50 rounded-xl flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-slate-300 font-bold text-sm">#{t.tokenNumber}</span>
                          {isYou && <span className="text-blue-400 text-[10px] font-black bg-blue-500/20 px-2 py-0.5 rounded-full">YOU</span>}
                          <span className="text-slate-500 text-xs truncate">{t.customerName}</span>
                        </div>
                        <div className="text-slate-600 text-[10px]">{t.service}{t.doneAt ? ` · ${timeAgo(t.doneAt)}` : ''}</div>
                      </div>
                      <div className="text-emerald-600 text-[10px] font-bold shrink-0">Done</div>
                    </div>
                  );
                })}
                <div className="flex items-center gap-2 px-4 py-1">
                  <div className="flex-1 h-px bg-white/5" />
                </div>
              </>
            )}

            {/* ── NOW SERVING ─────────────────────────────────────────── */}
            {serving && (
              <div className={`flex items-center gap-3 px-3 py-3 rounded-2xl border-2 ${
                serving.tokenNumber === token.tokenNumber
                  ? 'bg-emerald-600/20 border-emerald-400/50'
                  : 'bg-emerald-600/10 border-emerald-400/20'
              }`}>
                <div className="w-9 h-9 bg-emerald-500/20 border border-emerald-400/40 rounded-xl flex items-center justify-center shrink-0 relative">
                  <Scissors className="w-4 h-4 text-emerald-400" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#0d0d14] animate-pulse" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-300 font-black text-sm">#{serving.tokenNumber}</span>
                    {serving.tokenNumber === token.tokenNumber && (
                      <span className="text-emerald-300 text-[10px] font-black bg-emerald-500/20 px-2 py-0.5 rounded-full">YOU 🎉</span>
                    )}
                    <span className="text-slate-300 text-xs truncate">{serving.customerName}</span>
                  </div>
                  <div className="text-emerald-600 text-[10px] font-bold">✂️ In Service Now</div>
                </div>
                <div className="text-emerald-400 text-[10px] font-black shrink-0 flex items-center gap-1">
                  <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                  LIVE
                </div>
              </div>
            )}

            {/* ── If YOU are waiting — show your token in sequence ─────── */}
            {isWaiting && (
              <>
                {/* Tokens waiting before you */}
                {waitingBefore.map((t, i) => (
                  <div key={t.id} className="flex items-center gap-3 px-3 py-2.5 rounded-2xl opacity-60">
                    <div className="w-9 h-9 bg-amber-900/30 border border-amber-700/30 rounded-xl flex items-center justify-center shrink-0">
                      <span className="text-amber-500 text-xs font-black">#{t.tokenNumber}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-slate-400 text-sm font-semibold truncate">{t.customerName}</div>
                      <div className="text-slate-600 text-[10px]">{t.service} · ~{(i + 1) * queue.avgMinutes}m wait</div>
                    </div>
                    <div className="text-amber-700 text-[10px] font-bold shrink-0">Waiting</div>
                  </div>
                ))}

                {/* ── YOUR TOKEN (highlighted) ───────────────────────── */}
                <div className="flex items-center gap-3 px-3 py-3 rounded-2xl bg-violet-600/20 border-2 border-violet-400/50">
                  <div className="w-9 h-9 bg-violet-600/40 border border-violet-400/50 rounded-xl flex items-center justify-center shrink-0 relative">
                    <span className="text-violet-200 text-xs font-black">#{token.tokenNumber}</span>
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-violet-500 rounded-full border-2 border-[#0d0d14]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-violet-200 font-black text-sm">#{token.tokenNumber}</span>
                      <span className="text-violet-300 text-[10px] font-black bg-violet-500/20 px-2 py-0.5 rounded-full">👆 YOU</span>
                    </div>
                    <div className="text-violet-400/70 text-[10px]">
                      {token.service}
                      {ahead === 0 ? ' · You\'re next!' : ` · ~${estimatedWaitMin}m wait · ${ahead} ahead`}
                    </div>
                  </div>
                  <div className="text-violet-400 text-[10px] font-black shrink-0">Your turn</div>
                </div>

                {/* Tokens waiting after you (dimmed) */}
                {waitingAfter.slice(0, 3).map(t => (
                  <div key={t.id} className="flex items-center gap-3 px-3 py-2 rounded-xl opacity-30">
                    <div className="w-8 h-8 bg-white/5 border border-white/5 rounded-xl flex items-center justify-center shrink-0">
                      <span className="text-slate-500 text-xs font-bold">#{t.tokenNumber}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-slate-500 text-xs font-semibold truncate">{t.customerName}</div>
                    </div>
                  </div>
                ))}
                {waitingAfter.length > 3 && (
                  <div className="text-center text-slate-700 text-xs py-1 opacity-40">
                    +{waitingAfter.length - 3} more in queue after you
                  </div>
                )}
              </>
            )}

            {/* Empty queue state */}
            {!serving && recentDone.length === 0 && waitingTokens.length === 0 && (
              <div className="text-center py-6 text-slate-600">
                <div className="text-3xl mb-2">🎉</div>
                <div>Queue is empty</div>
              </div>
            )}
          </div>
        </div>

        {/* ── Bottom action strip ────────────────────────────────────────── */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <Link href="/salon/queue"
            className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold py-3.5 rounded-2xl text-sm transition-all">
            📺 Live Board
          </Link>
          <Link href="/salon/join"
            className="flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-500 text-white font-bold py-3.5 rounded-2xl text-sm transition-all shadow-lg shadow-violet-900/30">
            🎫 New Token
          </Link>
        </div>

        {/* Auto-refresh note */}
        {isWaiting && (
          <div className="bg-white/3 border border-white/8 rounded-2xl px-4 py-3 text-center">
            <p className="text-slate-500 text-xs">
              ⏱️ Auto-refreshes every 30s · Come back in <strong className="text-white">{estimatedWaitMin} min</strong>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
