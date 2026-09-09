"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { useProducts } from '@/context/ProductContext';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  MapPin, Star, ShieldCheck, Clock, Calendar, CheckCircle2, PhoneCall,
  Info, Camera, Users, Ticket, ChevronRight, Loader2, RefreshCw,
  Scissors, ArrowLeft, Share2, Heart, Zap, TrendingUp
} from 'lucide-react';

// ─── Dynamic Walk-in Services ───────────────────────────────────────────────────

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';
const WALK_IN_CATEGORIES = ['salon', 'saloon', 'beauty', 'hair', 'barber', 'spa', 'nail', 'massage', 'pedicure', 'doctor', 'clinic', 'medical', 'hospital', 'dentist'];

// ─── Types ────────────────────────────────────────────────────────────────────
interface QueueSummary {
  id: string; shopName: string; currentToken: number; lastToken: number;
  avgMinutes: number; isOpen: boolean;
}
interface QueueStatus {
  queue: { id: string; shopName: string; currentToken: number; lastToken: number; avgMinutes: number; pricePerHour: number; isOpen: boolean; };
  serving: { tokenNumber: number; customerName: string } | null;
  waiting: { id: string; tokenNumber: number; customerName: string; service: string }[];
  waitingCount: number; doneToday: number;
}
interface JoinResult {
  token: { id: string; tokenNumber: number; service: string };
  estimatedWaitMin: number; ahead: number;
}

// ─── Queue Widget ─────────────────────────────────────────────────────────────
function SmartQueueWidget({ service }: { service: any }) {
  const { user } = useAuth();
  const isSeller = user && ['seller', 'SELLER', 'business'].includes(user.role);
  const [queues, setQueues] = useState<QueueSummary[]>([]);
  const [selected, setSelected] = useState<QueueSummary | null>(null);
  const [status, setStatus] = useState<QueueStatus | null>(null);
  const [loadingQ, setLoadingQ] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [step, setStep] = useState<'view' | 'join' | 'done'>('view');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  
  const emoji = service.category?.toLowerCase().includes('doctor') || service.category?.toLowerCase().includes('clinic') ? '🩺' : 
                service.category?.toLowerCase().includes('spa') ? '💆' : '✂️';
  const availableServices = [{ label: service.name, price: service.price, emoji }];
  const [selectedServices, setSelectedServices] = useState<typeof availableServices>(availableServices);
  const totalPrice = selectedServices.reduce((sum, s) => sum + s.price, 0);
  const [joining, setJoining] = useState(false);
  const [result, setResult] = useState<JoinResult | null>(null);
  const [err, setErr] = useState('');

  useEffect(() => {
    const fetchQ = async () => {
      try {
        let list: QueueSummary[] = [];

        // Always try by sellerId first if provided
        if (service.sellerId) {
          const r = await fetch(`${API}/salon/seller/${service.sellerId}`);
          const text = await r.text();
          const d = text ? JSON.parse(text) : null;
          if (d && d.id) list = [d];
        }

        // If still no queue, search all queues filtered by shopName matching this seller
        if (list.length === 0) {
          const r = await fetch(`${API}/salon/queues`);
          const text = await r.text();
          const all: QueueSummary[] = text ? JSON.parse(text) : [];
          const targetShopName = service.seller || service.name || 'Walk-in Service';
          const scoped = Array.isArray(all)
            ? all.filter(q => q.shopName === targetShopName)
            : [];
          if (scoped.length > 0) list = scoped;
        }

        // If still no queue, create one scoped exclusively to this seller
        if (list.length === 0) {
          const createRes = await fetch(`${API}/salon/queue`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              shopName: service.seller || service.name || 'Walk-in Service', // Add strong fallbacks
              sellerId: service.sellerId || null,
            })
          });
          const newQueue = await createRes.json();
          if (newQueue && newQueue.id) list = [newQueue];
        }

        setQueues(list);
        if (list.length > 0) setSelected(list[0]);
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingQ(false);
      }
    };
    fetchQ();
  }, [service.sellerId, service.seller]);

  const fetchStatus = useCallback(async (showRefresh = false) => {
    if (!selected) return;
    if (showRefresh) setRefreshing(true);
    try {
      const r = await fetch(`${API}/salon/${selected.id}/status`);
      setStatus(await r.json());
    } catch {/* ignore */} finally { setRefreshing(false); }
  }, [selected]);

  useEffect(() => {
    fetchStatus();
    const i = setInterval(() => fetchStatus(), 12000);
    return () => clearInterval(i);
  }, [fetchStatus]);

  const join = async () => {
    if (!name.trim()) { setErr('Please enter your name'); return; }
    if (selectedServices.length === 0) { setErr('Please select at least one service'); return; }
    if (!selected) return;
    setErr(''); setJoining(true);
    try {
      const r = await fetch(`${API}/salon/${selected.id}/join`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: name.trim(),
          phone: phone.trim() || undefined,
          service: selectedServices.map(s => s.label).join(', '),
        }),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.message ?? 'Failed');
      setResult(d); setStep('done'); fetchStatus();
    } catch (e: unknown) { setErr(e instanceof Error ? e.message : 'Error'); }
    finally { setJoining(false); }
  };

  // Token received
  if (step === 'done' && result) return (
    <div className="space-y-4">
      <div className="relative bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-600 rounded-3xl p-6 overflow-hidden text-center shadow-2xl shadow-purple-300">
        <div className="absolute inset-0 opacity-10" style={{backgroundImage:'radial-gradient(circle at 20% 80%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)', backgroundSize:'30px 30px'}} />
        <div className="relative z-10">
          <div className="text-white/60 text-xs font-black uppercase tracking-widest mb-1">Your Token Number</div>
          <div className="text-[5rem] font-black text-white leading-none drop-shadow-2xl">#{result.token.tokenNumber}</div>
          <div className="text-purple-200 text-sm mt-2 font-medium">
            {result.ahead === 0 ? '🎉 You\'re next! Head in now.' : `${result.ahead} ahead · ~${result.estimatedWaitMin} min wait`}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Link href={`/salon/token/${result.token.id}`} className="flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-2xl text-sm transition-all shadow-lg">
          <Clock className="w-4 h-4" /> Track Live
        </Link>
        <Link href="/salon/queue" className="flex items-center justify-center gap-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold py-3.5 rounded-2xl text-sm transition-all">
          <Users className="w-4 h-4" /> Queue Board
        </Link>
      </div>
      <p className="text-center text-slate-400 text-xs">💡 You can leave and return when it&apos;s your turn</p>
    </div>
  );

  // Join form
  if (step === 'join') return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-black text-slate-900 flex items-center gap-2"><Ticket className="w-4 h-4 text-violet-600" /> Get Your Token</h4>
        <button onClick={() => setStep('view')} className="text-slate-400 hover:text-slate-700 text-xs font-semibold">← Back</button>
      </div>

      {/* Multi-Service Selector */}
      <div>
        <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Select Services <span className="normal-case font-medium text-slate-400">(pick one or more)</span></p>
        <div className="grid grid-cols-1 gap-2">
          {availableServices.map(svc => {
            const isChosen = selectedServices.some(s => s.label === svc.label);
            return (
              <button key={svc.label}
                onClick={() => {
                  if (isChosen && selectedServices.length === 1) return; // Prevent deselecting the only selected service
                  setSelectedServices(prev =>
                    isChosen
                      ? prev.filter(s => s.label !== svc.label)
                      : [...prev, svc]
                  );
                }}
                className={`relative flex flex-col items-center gap-1 py-3 px-2 rounded-2xl border-2 font-bold text-sm transition-all ${
                  isChosen
                    ? 'border-violet-500 bg-violet-50 text-violet-700 shadow-md shadow-violet-100'
                    : 'border-slate-100 bg-slate-50 text-slate-500 hover:border-violet-200 hover:bg-violet-50/50'
                }`}>
                {isChosen && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-violet-600 rounded-full flex items-center justify-center text-white text-[9px] font-black">✓</span>
                )}
                <span className="text-xl">{svc.emoji}</span>
                <span className="text-xs leading-tight text-center">{svc.label}</span>
                <span className={`font-black text-xs ${isChosen ? 'text-violet-600' : 'text-slate-400'}`}>₹{svc.price}</span>
              </button>
            );
          })}
        </div>

        {/* Order Summary */}
        {selectedServices.length > 0 ? (
          <div className="mt-3 bg-gradient-to-r from-violet-50 to-indigo-50 border border-violet-200 rounded-2xl px-4 py-3 space-y-1">
            <p className="text-xs font-black text-slate-400 uppercase tracking-wider mb-2">Your Order</p>
            {selectedServices.map(s => (
              <div key={s.label} className="flex justify-between text-sm">
                <span className="text-slate-700 font-medium">{s.emoji} {s.label}</span>
                <span className="text-violet-700 font-bold">₹{s.price}</span>
              </div>
            ))}
            <div className="pt-2 mt-1 border-t border-violet-200 flex justify-between">
              <span className="font-black text-slate-800 text-sm">Total</span>
              <span className="font-black text-violet-700 text-base">₹{totalPrice}</span>
            </div>
          </div>
        ) : (
          <div className="mt-3 bg-red-50 border border-red-100 rounded-xl px-3 py-2 text-xs text-red-500 font-semibold text-center">
            ⚠️ Please select at least one service
          </div>
        )}
      </div>

      {selected && (
        <div className="bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3">
          <div className="text-slate-700 font-bold text-sm">{selected.shopName}</div>
          <div className="text-slate-400 text-xs mt-0.5 flex items-center gap-3">
            <span>Now serving #{selected.currentToken}</span>
            <span>·</span>
            <span>{Math.max(0, selected.lastToken - selected.currentToken)} waiting</span>
          </div>
        </div>
      )}

      <input type="text" placeholder="Your name *" value={name} onChange={e => setName(e.target.value)}
        className="w-full px-4 py-3.5 border-2 border-slate-100 focus:border-violet-400 rounded-2xl outline-none text-slate-900 font-medium bg-slate-50 transition-colors" />
      <input type="tel" placeholder="Phone number (optional)" value={phone} onChange={e => setPhone(e.target.value)}
        className="w-full px-4 py-3.5 border-2 border-slate-100 focus:border-violet-400 rounded-2xl outline-none text-slate-900 font-medium bg-slate-50 transition-colors" />
      {err && <p className="text-red-500 text-sm bg-red-50 border border-red-100 px-4 py-3 rounded-xl">⚠️ {err}</p>}
      <button onClick={join} disabled={joining || selectedServices.length === 0}
        className="w-full py-4 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black text-base rounded-2xl transition-all shadow-xl shadow-violet-200 flex items-center justify-center gap-2">
        {joining ? <Loader2 className="w-4 h-4 animate-spin" /> : <Ticket className="w-4 h-4" />}
        {joining ? 'Getting your token…' : `Pay ₹${totalPrice} & Get Token 🎫`}
      </button>
    </div>
  );

  // Default: live status view
  if (loadingQ) return <div className="flex justify-center py-6"><Loader2 className="w-6 h-6 text-violet-400 animate-spin" /></div>;

  if (queues.length === 0) return (
    <div className="space-y-4">
      <div className="bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3 flex items-center gap-2 text-amber-700 text-sm font-medium">
        ⚡ Queue not yet set up — you can still request a spot!
      </div>
      <input type="text" placeholder="Your name *" value={name} onChange={e => setName(e.target.value)}
        className="w-full px-4 py-3.5 border-2 border-slate-100 focus:border-violet-400 rounded-2xl outline-none text-slate-900 font-medium bg-slate-50 transition-colors" />
      <input type="tel" placeholder="Phone number (optional)" value={phone} onChange={e => setPhone(e.target.value)}
        className="w-full px-4 py-3.5 border-2 border-slate-100 focus:border-violet-400 rounded-2xl outline-none text-slate-900 font-medium bg-slate-50 transition-colors" />
      {err && <p className="text-red-500 text-sm bg-red-50 border border-red-100 px-4 py-3 rounded-xl">⚠️ {err}</p>}
      <button
        onClick={async () => {
          if (!name.trim()) { setErr('Please enter your name'); return; }
          try {
            // First attempt to fetch the queue by sellerId or shopName
            let queueId = null;
            if (service.sellerId) {
              const r = await fetch(`${API}/salon/seller/${service.sellerId}`);
              const d = await r.json().catch(() => null);
              if (d && d.id) queueId = d.id;
            }
            if (!queueId) {
              const targetShopName = service.seller || service.name || 'Walk-in Service';
              const r = await fetch(`${API}/salon/queues`);
              const all = await r.json().catch(() => []);
              const matched = Array.isArray(all) ? all.find((q: any) => q.shopName === targetShopName) : null;
              if (matched) queueId = matched.id;
            }

            // If still no queue, try to create it
            if (!queueId) {
              const createRes = await fetch(`${API}/salon/queue`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  shopName: service.seller || service.name || 'Walk-in Service',
                  sellerId: service.sellerId || null,
                })
              });
              const newQueue = await createRes.json();
              queueId = newQueue.id;
            }
            
            if (!queueId) throw new Error("Could not find or create a queue for this service.");
            
            // Join the queue
            const joinRes = await fetch(`${API}/salon/${queueId}/join`, {
              method: 'POST', headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ customerName: name.trim(), phone: phone.trim() || undefined, service: service.name }),
            });
            const d = await joinRes.json();
            if (!joinRes.ok) throw new Error(d.message);
            
            setResult(d); 
            setStep('done');
          } catch (e: unknown) {
             setErr(e instanceof Error ? e.message : 'Error joining queue'); 
          }
        }}
        className="w-full py-4 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-black text-base rounded-2xl transition-all shadow-xl shadow-violet-200 flex items-center justify-center gap-2">
        <Ticket className="w-4 h-4" /> Request a Token 🎫
      </button>
    </div>
  );

  const openQueue = selected;
  const waiting = status?.waitingCount ?? 0;
  const isOpen = status?.queue.isOpen ?? openQueue?.isOpen ?? false;
  const serving = status?.serving;
  const etaIfJoinNow = (waiting + 1) * (status?.queue.avgMinutes ?? selected?.avgMinutes ?? 20);

  return (
    <div className="space-y-4">
      {/* Queue selector */}
      {queues.length > 1 && (
        <select value={selected?.id ?? ''} onChange={e => { const q = queues.find(x => x.id === e.target.value); if(q) { setSelected(q); setStatus(null); }}}
          className="w-full px-4 py-3 border-2 border-slate-100 rounded-2xl text-slate-700 font-semibold outline-none bg-slate-50 text-sm">
          {queues.map(q => <option key={q.id} value={q.id}>{q.shopName}</option>)}
        </select>
      )}

      {/* Premium Live status card */}
      <div className={`relative overflow-hidden rounded-3xl p-6 ${isOpen ? 'bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 shadow-inner' : 'bg-gradient-to-br from-red-50 to-rose-50 border border-red-100 shadow-inner'}`}>
        {isOpen && <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-400 rounded-full blur-3xl opacity-10"></div>}
        
        <div className="flex items-center justify-between mb-6 relative z-10">
          <div className="flex items-center gap-3">
            <div className="relative flex h-3 w-3">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isOpen ? 'bg-emerald-400' : 'hidden'}`}></span>
              <span className={`relative inline-flex rounded-full h-3 w-3 ${isOpen ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
            </div>
            <span className={`text-xs font-black uppercase tracking-widest ${isOpen ? 'text-emerald-700' : 'text-red-700'}`}>
              {isOpen ? 'Live Queue Active' : 'Queue Closed'}
            </span>
          </div>
          <button onClick={() => fetchStatus(true)} className="text-slate-400 hover:text-slate-700 transition-colors p-1 bg-white/50 rounded-full backdrop-blur">
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
        
        <div className="grid grid-cols-3 gap-2 relative z-10">
          <div className="text-center bg-white/60 backdrop-blur rounded-2xl py-3 border border-white">
            <div className="text-slate-900 font-black text-2xl leading-none tracking-tight">{serving ? `#${serving.tokenNumber}` : '—'}</div>
            <div className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-1">Serving</div>
          </div>
          <div className="text-center bg-white/60 backdrop-blur rounded-2xl py-3 border border-white">
            <div className="text-slate-900 font-black text-2xl leading-none tracking-tight">{waiting}</div>
            <div className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-1">Waiting</div>
          </div>
          <div className="text-center bg-white/60 backdrop-blur rounded-2xl py-3 border border-white">
            <div className="text-slate-900 font-black text-2xl leading-none tracking-tight">{etaIfJoinNow}m</div>
            <div className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-1">Est Wait</div>
          </div>
        </div>
      </div>
      {/* Up next list */}
      {status && status.waiting.slice(0, 3).length > 0 && (
        <div className="bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 space-y-2">
          <div className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Up Next</div>
          {status.waiting.slice(0, 3).map((t, i) => (
            <div key={t.id} className="flex items-center gap-3">
              <span className={`w-6 h-6 rounded-lg text-xs font-black flex items-center justify-center shrink-0 ${i === 0 ? 'bg-violet-600 text-white' : 'bg-white border border-slate-200 text-slate-500'}`}>
                {t.tokenNumber}
              </span>
              <span className="text-slate-700 text-sm font-semibold flex-1 truncate">{t.customerName}</span>
              <span className="text-slate-400 text-xs shrink-0">~{(i + 1) * (status.queue.avgMinutes)}m</span>
            </div>
          ))}
          {status.waitingCount > 3 && <p className="text-slate-400 text-xs">+{status.waitingCount - 3} more</p>}
        </div>
      )}

      {/* Action buttons */}
      {isOpen ? (
        <button onClick={() => setStep('join')}
          className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-black text-lg rounded-2xl transition-all shadow-xl shadow-emerald-200 flex items-center justify-center gap-3 relative overflow-hidden group">
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
          <Ticket className="w-6 h-6 relative z-10" />
          <span className="relative z-10 tracking-wide">Get Token Now</span>
        </button>
      ) : (
        <div className="w-full py-4 bg-slate-100 text-slate-400 font-bold text-base rounded-2xl text-center">Queue is Closed</div>
      )}

      <div className="grid grid-cols-2 gap-2">
        <Link href="/salon/queue" className="flex items-center justify-center gap-1.5 py-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 font-bold rounded-xl text-sm transition-all">
          <Users className="w-3.5 h-3.5" /> Live Board
        </Link>
        {isSeller && (
          <Link href="/salon/manage" className="flex items-center justify-center gap-1.5 py-3 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-xl text-sm transition-all shadow-lg shadow-violet-200">
            <ChevronRight className="w-3.5 h-3.5" /> Manage Shop
          </Link>
        )}
      </div>
      {!isSeller && (
        <p className="text-center text-slate-400 text-xs">Shop management is only available to the service owner.</p>
      )}
    </div>
  );
}

// ─── Service Detail Page ──────────────────────────────────────────────────────
export default function ServiceDetails() {
  const params = useParams();
  const id = params?.id as string;
  const { products } = useProducts();
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [liked, setLiked] = useState(false);
  const [activeTab, setActiveTab] = useState<'about' | 'included' | 'gallery'>('about');

  const service = products.find(p => p.id === id);

  if (!service) return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-10">
      <div className="text-6xl mb-6">✂️</div>
      <h1 className="text-2xl font-bold text-slate-800 mb-2">Service Not Found</h1>
      <p className="text-slate-500 mb-8">This service doesn&apos;t exist or was removed.</p>
      <Link href="/" className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-2xl font-bold transition-all">← Go Back</Link>
    </div>
  );

  const timeSlots = ["09:00 AM", "10:30 AM", "12:00 PM", "02:30 PM", "04:00 PM", "06:00 PM"];
  const isWalkIn = WALK_IN_CATEGORIES.some(c =>
    service.category?.toLowerCase().includes(c) || service.name?.toLowerCase().includes(c)
  );

  const isEventOrPlanning = ['event', 'wedding', 'planner', 'planning', 'function', 'party', 'construction', 'building'].some(c =>
    service.category?.toLowerCase().includes(c) || service.name?.toLowerCase().includes(c)
  );

  const TABS = [
    { key: 'about', label: 'About', icon: <Info className="w-4 h-4" /> },
    { key: 'included', label: "What's Included", icon: <CheckCircle2 className="w-4 h-4" /> },
    { key: 'gallery', label: 'Gallery', icon: <Camera className="w-4 h-4" /> },
  ] as const;

  return (
    <div className="min-h-screen bg-[#f8f9fc] font-sans">

      {/* ── Premium Hero Banner ─────────────────────────────────────────────────── */}
      <div className="relative bg-[#061224] overflow-hidden">
        {/* Dynamic mesh gradient background */}
        <div className="absolute inset-0 opacity-40">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[120%] bg-violet-600 rounded-full blur-[120px] mix-blend-screen opacity-50 animate-pulse"></div>
          <div className="absolute top-[20%] right-[-10%] w-[60%] h-[120%] bg-indigo-500 rounded-full blur-[140px] mix-blend-screen opacity-40"></div>
        </div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"></div>

        <div className="relative z-10 max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-16 lg:pt-10 lg:pb-24">
          {/* Back + actions */}
          <div className="flex items-center justify-between mb-10">
            <Link href="/" className="flex items-center gap-2 text-white/70 hover:text-white font-bold text-sm transition-colors group bg-white/5 px-4 py-2 rounded-full border border-white/10 backdrop-blur-md">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back
            </Link>
            <div className="flex items-center gap-2">
              <button onClick={() => setLiked(l => !l)} className={`w-10 h-10 rounded-full flex items-center justify-center transition-all border backdrop-blur-md ${liked ? 'bg-rose-500 border-rose-400 text-white shadow-lg shadow-rose-500/30' : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/20 hover:text-white hover:border-white/30'}`}>
                <Heart className={`w-4 h-4 ${liked ? 'fill-white' : ''}`} />
              </button>
              <button className="w-10 h-10 bg-white/5 border border-white/10 hover:bg-white/20 hover:border-white/30 text-white/70 hover:text-white rounded-full flex items-center justify-center transition-all backdrop-blur-md">
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-10 items-center lg:items-stretch">
            {/* Service Image Premium Card */}
            <div className="w-full sm:w-[80%] lg:w-[320px] aspect-[4/3] lg:aspect-[3/4] bg-white/5 backdrop-blur-xl rounded-3xl overflow-hidden border border-white/20 flex items-center justify-center shrink-0 relative shadow-2xl shadow-indigo-900/50 group">
              {service.image ? (
                <img src={service.image} alt={service.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              ) : (
                <div className="flex flex-col items-center gap-3">
                  <span className="text-8xl drop-shadow-2xl">✂️</span>
                </div>
              )}
              {/* Category badge */}
              <div className="absolute top-4 left-4 bg-black/40 backdrop-blur-md border border-white/20 text-white px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider shadow-lg">
                {service.category}
              </div>
              {isWalkIn && (
                <div className="absolute bottom-4 left-4 right-4 bg-emerald-500/90 backdrop-blur-md border border-emerald-400/50 text-white px-4 py-3 rounded-2xl text-xs font-black flex items-center gap-2 justify-center shadow-xl shadow-emerald-900/50">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse" /> Live Token Queue Active
                </div>
              )}
            </div>

            {/* Info Section */}
            <div className="flex-1 flex flex-col justify-center w-full">
              {/* Tags row */}
              <div className="flex flex-wrap items-center gap-2 mb-5">
                {isWalkIn && (
                  <span className="bg-violet-500/20 border border-violet-400/30 text-violet-200 text-xs font-bold px-4 py-1.5 rounded-full flex items-center gap-1.5">
                    <Ticket className="w-3.5 h-3.5" /> Smart Queue
                  </span>
                )}
                <span className="bg-amber-500/20 border border-amber-400/30 text-amber-200 text-xs font-bold px-4 py-1.5 rounded-full flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5" /> Instant Booking
                </span>
                <span className="bg-white/10 border border-white/20 text-white/80 text-xs font-bold px-4 py-1.5 rounded-full flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5" /> Top Rated
                </span>
              </div>

              <h1 className="text-4xl lg:text-5xl xl:text-6xl font-black text-white leading-[1.1] tracking-tight mb-6 drop-shadow-md">
                {service.name}
              </h1>

              {/* Rating + Location */}
              <div className="flex flex-wrap items-center gap-4 mb-8">
                <div className="flex items-center gap-2 bg-gradient-to-r from-amber-400/20 to-amber-500/10 border border-amber-400/30 px-5 py-2.5 rounded-2xl backdrop-blur-md">
                  <Star className="w-5 h-5 fill-amber-400 text-amber-400 drop-shadow-md" />
                  <span className="text-amber-300 font-black text-base drop-shadow-md">{service.rating}</span>
                  <span className="text-amber-400/80 text-sm font-medium">({service.reviews} reviews)</span>
                </div>
                <div className="flex items-center gap-2 text-white/70 font-medium text-base bg-white/5 border border-white/10 px-5 py-2.5 rounded-2xl backdrop-blur-md">
                  <MapPin className="w-4 h-4 text-violet-300" /> {service.location}
                </div>
              </div>

              {/* Provider card */}
              <div className="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-1 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 max-w-2xl shadow-xl">
                <div className="flex items-center gap-4 pl-4 py-2">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white font-black text-xl shadow-inner border border-white/20">
                    {service.seller.charAt(0)}
                  </div>
                  <div>
                    <div className="text-white/50 text-[10px] font-black uppercase tracking-widest mb-0.5">Service Provider</div>
                    <Link href={`/shop/${encodeURIComponent(service.seller.toLowerCase().replace(/ /g, '-'))}`}
                      className="text-white font-black text-xl hover:text-violet-300 transition-colors drop-shadow-md">
                      {service.seller}
                    </Link>
                  </div>
                </div>
                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3 pr-4 py-2 sm:py-0 border-t border-white/10 sm:border-t-0 pt-4 sm:pt-0">
                  <span className="bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5 font-black shadow-inner">
                    <ShieldCheck className="w-3.5 h-3.5" /> Verified Pro
                  </span>
                  <button className="text-white/60 hover:text-white text-sm font-semibold flex items-center gap-1.5 transition-colors"
                    onClick={() => alert(`Calling ${service.seller}...`)}>
                    <PhoneCall className="w-3.5 h-3.5" /> Call now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Body ─────────────────────────────────────────────────────────── */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col lg:flex-row gap-8">

        {/* ── Left: Detail Tabs ─────────────────────────────────────────── */}
        <div className="flex-1 min-w-0">

          {/* Premium Tab Nav */}
          <div className="flex bg-white/60 backdrop-blur-md border border-slate-200/60 rounded-2xl p-1.5 gap-1.5 mb-8 shadow-sm">
            {TABS.map(tab => (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all duration-300 ${
                  activeTab === tab.key
                    ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-indigo-200 scale-[1.02]'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-white'
                }`}>
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>

          {/* About */}
          {activeTab === 'about' && (
            <div className="space-y-5">
              <div className="bg-white rounded-3xl p-7 border border-slate-100 shadow-sm">
                <h2 className="text-xl font-black text-slate-900 mb-4 flex items-center gap-2">
                  <Info className="w-5 h-5 text-violet-600" /> About This Service
                </h2>
                <p className="text-slate-600 leading-relaxed text-base">
                  {service.description || "Experience top-tier service tailored to your needs. Our professionals use the best practices and tools to ensure your complete satisfaction."}
                </p>
              </div>

              {/* Stats strip */}
              <div className="grid grid-cols-3 gap-4">
                {[
                  { val: service.rating, label: 'Rating', icon: '⭐' },
                  { val: service.reviews, label: 'Reviews', icon: '💬' },
                  { val: '100%', label: 'Satisfaction', icon: '✅' },
                ].map(s => (
                  <div key={s.label} className="bg-white border border-slate-100 rounded-2xl p-4 text-center shadow-sm">
                    <div className="text-2xl mb-1">{s.icon}</div>
                    <div className="text-slate-900 font-black text-xl">{s.val}</div>
                    <div className="text-slate-400 text-xs font-semibold">{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Smart Queue How it Works (only for walk-in) */}
              {isWalkIn && (
                <div className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-3xl p-7 border border-violet-100 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-br from-violet-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-violet-200">
                      <Ticket className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-lg font-black text-slate-900">Smart Queue System</h2>
                      <p className="text-slate-500 text-xs">No appointments. Just walk in.</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[
                      { step: '01', icon: '🚶', title: 'Walk In Anytime', desc: 'No appointment. Show up whenever it\'s convenient.' },
                      { step: '02', icon: '🎫', title: 'Get a Token', desc: 'Enter your name, get an instant queue number.' },
                      { step: '03', icon: '📱', title: 'Track & Return', desc: 'See live wait time. Leave, come back just in time.' },
                    ].map(s => (
                      <div key={s.step} className="bg-white/70 rounded-2xl p-5 border border-violet-100/50 relative">
                        <div className="absolute top-3 right-3 text-violet-200 text-xs font-black">{s.step}</div>
                        <div className="text-3xl mb-3">{s.icon}</div>
                        <div className="font-black text-slate-900 text-sm mb-1">{s.title}</div>
                        <div className="text-slate-500 text-xs leading-relaxed">{s.desc}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* What's Included */}
          {activeTab === 'included' && (
            <div className="bg-white rounded-3xl p-7 border border-slate-100 shadow-sm">
              <h2 className="text-xl font-black text-slate-900 mb-6">What&apos;s Included</h2>
              <div className="space-y-3">
                {[
                  { item: 'Comprehensive consultation before service', tag: 'Consultation' },
                  { item: 'Professional-grade equipment and materials', tag: 'Premium' },
                  { item: 'Post-service cleanup and inspection', tag: 'Quality' },
                  { item: 'Satisfaction guarantee — redo if unhappy', tag: 'Guarantee' },
                  { item: 'Expert stylist with 5+ years experience', tag: 'Expert' },
                  { item: 'Hygienic tools, sanitized before every use', tag: 'Hygiene' },
                ].map((obj, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-violet-200 transition-colors group">
                    <div className="w-8 h-8 bg-emerald-100 rounded-xl flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    </div>
                    <span className="text-slate-700 font-semibold flex-1">{obj.item}</span>
                    <span className="text-violet-600 text-xs font-black bg-violet-50 border border-violet-100 px-2.5 py-1 rounded-full">{obj.tag}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Gallery */}
          {activeTab === 'gallery' && (
            <div className="bg-white rounded-3xl p-7 border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-black text-slate-900">Gallery / Past Work</h2>
                <span className="text-slate-400 text-sm">6 photos</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {[1,2,3,4,5,6].map(i => (
                  <div key={i} className="aspect-square bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl overflow-hidden border border-slate-100 hover:scale-[1.02] transition-transform cursor-pointer group relative">
                    <div className="w-full h-full flex items-center justify-center">
                      <Camera className="w-8 h-8 text-slate-300 group-hover:text-slate-400 transition-colors" />
                    </div>
                    <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/20 transition-colors rounded-2xl" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── Right: Booking / Queue Widget ─────────────────────────────── */}
        <div className="w-full lg:w-[380px] shrink-0">
          <div className="sticky top-6 space-y-4">

            {/* Price card */}
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-lg">
              <div className="flex items-end justify-between mb-5 pb-5 border-b border-slate-100">
                <div>
                  <div className="text-slate-400 text-xs font-black uppercase tracking-widest mb-1">
                    {service.category === 'Transport' ? 'Estimated Base Fare' : 'Starting Price'}
                  </div>
                  <div className="text-4xl font-black text-slate-900 flex items-baseline gap-1">
                    ₹{service.price.toLocaleString('en-IN')}
                    <span className="text-base font-semibold text-slate-400">
                      /{service.category === 'Transport' ? 'km' : 'session'}
                    </span>
                  </div>
                </div>
                {isWalkIn && (
                  <div className="text-right">
                    <div className="text-slate-400 text-xs font-semibold">Per Hour</div>
                    <div className="text-violet-600 font-black">Premium Rate</div>
                  </div>
                )}
              </div>

              {/* Walk-in Smart Queue OR Appointment */}
              {isWalkIn ? (
                <>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                    <h3 className="font-black text-slate-900">Live Queue Status</h3>
                  </div>
                  <SmartQueueWidget key={service.id} service={service} />
                </>
              ) : isEventOrPlanning ? (
                <div className="bg-gradient-to-br from-violet-50 to-indigo-50 border border-violet-100 rounded-3xl p-6 shadow-inner relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-violet-400 rounded-full blur-3xl opacity-10"></div>
                  <h3 className="font-black text-slate-900 mb-2 flex items-center gap-2 relative z-10">
                    <Calendar className="w-5 h-5 text-violet-600" /> Schedule Consultation
                  </h3>
                  <p className="text-slate-600 text-sm mb-5 relative z-10 font-medium">Get a custom quote & discuss your vision.</p>
                  
                  <div className="space-y-4 relative z-10">
                    <div className="bg-white/80 backdrop-blur border border-white focus-within:border-violet-300 rounded-2xl flex items-center px-4 py-1 shadow-sm transition-all">
                      <span className="text-violet-400">📅</span>
                      <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)}
                        className="w-full p-3 outline-none bg-transparent text-slate-800 font-semibold cursor-pointer" />
                    </div>
                    
                    <div className="bg-white/80 backdrop-blur border border-white focus-within:border-violet-300 rounded-2xl p-4 shadow-sm transition-all">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Project Details</label>
                      <textarea 
                        rows={3} 
                        placeholder="Briefly describe your requirements, guest count, or scope..." 
                        className="w-full outline-none bg-transparent text-slate-800 resize-none font-medium text-sm placeholder:text-slate-300" 
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      if (!selectedDate) { alert('Please select a date'); return; }
                      alert(`Meeting scheduled with ${service.seller} on ${selectedDate}`);
                    }}
                    className="w-full mt-6 py-4 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white rounded-2xl font-black text-base transition-all shadow-xl shadow-violet-200 flex items-center justify-center gap-2 relative z-10 group">
                    Request Meeting <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </button>
                </div>
              ) : service.category === 'Transport' ? (
                <>
                  <h3 className="font-black text-slate-900 mb-4 flex items-center gap-2">🚚 Plan Your Route</h3>
                  <div className="space-y-3 mb-5">
                    <select className="w-full p-4 border-2 border-slate-100 rounded-2xl outline-none focus:border-violet-400 bg-slate-50 text-slate-700 font-semibold transition-colors">
                      <option>-- Select Vehicle Type --</option>
                      <option>Mini Truck (1 Ton)</option>
                      <option>Medium Truck (3–5 Tons)</option>
                      <option>Heavy Freight (10+ Tons)</option>
                      <option>Trailer (20+ Tons)</option>
                    </select>
                    <div className="bg-slate-50 border-2 border-slate-100 focus-within:border-violet-400 rounded-2xl flex items-center px-4 transition-colors">
                      <span className="text-indigo-500">📍</span>
                      <input type="text" placeholder="Pickup Location" className="w-full p-3.5 outline-none bg-transparent text-slate-700 font-medium" />
                    </div>
                    <div className="bg-slate-50 border-2 border-slate-100 focus-within:border-violet-400 rounded-2xl flex items-center px-4 transition-colors">
                      <span className="text-rose-500">🚩</span>
                      <input type="text" placeholder="Drop Location" className="w-full p-3.5 outline-none bg-transparent text-slate-700 font-medium" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <input type="date" className="p-3.5 border-2 border-slate-100 focus:border-violet-400 rounded-2xl outline-none text-slate-700 font-medium bg-slate-50 transition-colors" />
                      <input type="time" className="p-3.5 border-2 border-slate-100 focus:border-violet-400 rounded-2xl outline-none text-slate-700 font-medium bg-slate-50 transition-colors" />
                    </div>
                  </div>
                  <button className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-black text-base transition-all shadow-xl shadow-slate-200">
                    Get Estimate &amp; Book
                  </button>
                </>
              ) : (
                <>
                  <h3 className="font-black text-slate-900 mb-4 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-violet-600" /> Book Appointment
                  </h3>
                  <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)}
                    className="w-full p-4 border-2 border-slate-100 focus:border-violet-400 rounded-2xl outline-none text-slate-700 font-semibold mb-4 bg-slate-50 transition-colors" />
                  <div className="mb-4">
                    <div className="flex items-center gap-2 text-slate-500 text-xs font-black uppercase tracking-widest mb-3">
                      <Clock className="w-3.5 h-3.5" /> Available Slots
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {timeSlots.map(t => (
                        <button key={t} onClick={() => setSelectedTime(t)}
                          className={`py-3 rounded-xl font-bold text-sm transition-all border-2 ${
                            selectedTime === t
                              ? 'bg-slate-900 text-white border-slate-900 shadow-lg'
                              : 'bg-slate-50 text-slate-700 border-slate-100 hover:border-violet-300 hover:bg-violet-50'
                          }`}>
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      if (!selectedDate || !selectedTime) { alert('Please select date & time'); return; }
                      alert(`Confirmed: ${service.name} on ${selectedDate} at ${selectedTime}`);
                    }}
                    className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-black text-base transition-all shadow-xl shadow-slate-200 mb-3">
                    Confirm Appointment
                  </button>
                </>
              )}
            </div>

            {/* Call CTA */}
            <button onClick={() => alert(`Calling ${service.seller}...`)}
              className="w-full py-4 bg-white hover:bg-slate-50 border-2 border-slate-200 text-slate-700 rounded-2xl font-black transition-all flex items-center justify-center gap-2 shadow-sm">
              <PhoneCall className="w-4 h-4 text-violet-600" /> Call Provider Directly
            </button>

            {/* Trust badges */}
            <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm">
              <div className="grid grid-cols-3 gap-3 text-center">
                {[
                  { icon: '🔒', label: 'Secure' },
                  { icon: '⚡', label: 'Instant' },
                  { icon: '💯', label: 'Verified' },
                ].map(b => (
                  <div key={b.label}>
                    <div className="text-xl mb-1">{b.icon}</div>
                    <div className="text-slate-500 text-[10px] font-black uppercase tracking-wider">{b.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
