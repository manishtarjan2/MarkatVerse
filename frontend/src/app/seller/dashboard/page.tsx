"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useProducts } from '@/context/ProductContext';
import { Store, BarChart3, Package, PlusCircle, ArrowLeft, Trash2, Edit2, CheckCircle2, CalendarClock, Crown, Settings, Menu, X, Users, TrendingUp } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Suspense } from 'react';
import StaffResourceManagementModal from '@/components/StaffResourceManagementModal';
import DynamicFormEngine from '@/components/DynamicFormEngine';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

function DashboardContent() {
  const searchParams = useSearchParams();
  const isAdding = searchParams.get('action') === 'add';
  const [activeTab, setActiveTab] = useState(isAdding ? 'add' : 'overview');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const { addProduct, editProduct, deleteProduct, products, categories } = useProducts();
  const [isPremiumSeller, setIsPremiumSeller] = useState(true); // Mock state to demonstrate the paywall
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const { user } = useAuth();
  const [leads, setLeads] = useState<any[]>([]);

  const myListings = products.filter(p => {
    // Only match strictly by sellerId to prevent generic names from claiming dummy data
    if (!p.sellerId || !user?.id) return false;
    return String(p.sellerId) === String(user.id);
  });

  const activeSector = myListings.length > 0 ? myListings[0].category : (user?.business?.sector || 'Retail Product');
  
  const CART_ORDER_FLOW = ['Retail Product'];
  const RFQ_QUOTE_FLOW = ['B2B Product', 'Manufacturer', 'Transport'];
  const QUEUE_TOKEN_FLOW = ['Doctor', 'Salon', 'Spa', 'Beauty Parlour', 'Repair', 'Services', 'Beauty', 'Car Wash'];
  const PROJECT_MILESTONE_FLOW = ['Construction', 'Interior Designer'];
  const MEETING_PROPOSAL_FLOW = ['Wedding Planner', 'Consultant', 'Photography'];
  const ENQUIRY_ASSET_FLOW = ['Vehicle Sale', 'Vehicle Rental', 'Real Estate'];

  const capabilities = user?.business?.capabilities || [];
  const isB2B = capabilities.includes('B2B');
  const isB2C = capabilities.includes('B2C');
  const isService = capabilities.includes('SERVICE');

  const sellerSector = user?.business?.sector || '';

  const hasCartProducts = myListings.some(p => CART_ORDER_FLOW.includes(p.category));
  const hasRfqProducts = myListings.some(p => RFQ_QUOTE_FLOW.includes(p.category));
  const hasQueueServices = myListings.some(p => QUEUE_TOKEN_FLOW.includes(p.category));
  const hasProjectServices = myListings.some(p => PROJECT_MILESTONE_FLOW.includes(p.category));
  const hasMeetingServices = myListings.some(p => MEETING_PROPOSAL_FLOW.includes(p.category));
  const hasAssetListings = myListings.some(p => ENQUIRY_ASSET_FLOW.includes(p.category));

  const isCartFlow = hasCartProducts || CART_ORDER_FLOW.includes(sellerSector) || isB2C || sellerSector === 'Retail Product';
  const isRfqFlow = hasRfqProducts || RFQ_QUOTE_FLOW.includes(sellerSector) || isB2B;
  const isQueueFlow = hasQueueServices || QUEUE_TOKEN_FLOW.includes(sellerSector) || isService || QUEUE_TOKEN_FLOW.includes(sellerSector);
  const isProjectFlow = hasProjectServices || PROJECT_MILESTONE_FLOW.includes(sellerSector);
  const isMeetingFlow = hasMeetingServices || MEETING_PROPOSAL_FLOW.includes(sellerSector);
  const isAssetFlow = hasAssetListings || ENQUIRY_ASSET_FLOW.includes(sellerSector);

  // For backward compatibility in some places
  const isServiceProvider = isQueueFlow || isProjectFlow || isMeetingFlow || isService;
  const [queueData, setQueueData] = useState<any>(null);
  const [isQueueLoading, setIsQueueLoading] = useState(false);
  const [queueAnalytics, setQueueAnalytics] = useState<any>(null);
  const [availableQueues, setAvailableQueues] = useState<any[]>([]);
  const [selectedQueueId, setSelectedQueueId] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const handleQueueAction = async (actionId: string, endpoint: string, method: string = 'POST', body?: any) => {
    setActionLoading(actionId);
    try {
      const isJson = method === 'POST' || method === 'PATCH';
      await fetch(`${API_URL}${endpoint}`, {
        method,
        headers: isJson ? { 'Content-Type': 'application/json' } : undefined,
        body: isJson ? JSON.stringify(body || {}) : undefined
      });
      await fetchQueue();
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  };

  const fetchQueue = async (forceQueueId?: string) => {
    if (!user?.id || !isServiceProvider) return;
    setIsQueueLoading(true);
    try {
      const fallbackName = user.business?.name || user.name || '';

      // 1. Fetch all queues by sellerId
      let res = await fetch(`${API_URL}/service-queue/seller/${user.id}`);
      let text = await res.text();
      let data = text ? JSON.parse(text) : null;
      let queues = Array.isArray(data) ? data : (data ? [data] : []);

      let activeQueueId = forceQueueId || selectedQueueId;

      // 2. Fallback: Search all queues by shopName (in case queue was auto-created by a customer)
      if (queues.length === 0) {
        const allRes = await fetch(`${API_URL}/service-queue/queues`);
        const allText = await allRes.text();
        const allQueues = allText ? JSON.parse(allText) : [];
        const matched = Array.isArray(allQueues) ? allQueues.find((q: any) => q.shopName === fallbackName) : null;
        
        if (matched) {
          activeQueueId = matched.id;
          queues = [matched];
          // Link this queue permanently to the seller
          await fetch(`${API_URL}/service-queue/${activeQueueId}/settings`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sellerId: user.id })
          });
        } else {
          // Auto create
          const createRes = await fetch(`${API_URL}/service-queue/queue`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ shopName: fallbackName, sellerId: user.id })
          });
          const newData = await createRes.json();
          if (newData?.id) {
            queues = [newData];
            activeQueueId = newData.id;
          }
        }
      }

      setAvailableQueues(queues);

      if (!activeQueueId && queues.length > 0) {
        activeQueueId = queues[0].id;
      }
      setSelectedQueueId(activeQueueId);

      // 3. Fetch status and analytics for the active queue
      if (activeQueueId) {
        const [statusRes, analyticsRes] = await Promise.all([
          fetch(`${API_URL}/service-queue/${activeQueueId}/status`),
          fetch(`${API_URL}/service-queue/${activeQueueId}/analytics`)
        ]);
        setQueueData(await statusRes.json());
        if (analyticsRes.ok) {
          setQueueAnalytics(await analyticsRes.json());
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsQueueLoading(false);
    }
  };

  React.useEffect(() => {
    fetchQueue();
    // Auto-poll for new tokens every 3 seconds for near real-time updates
    const interval = setInterval(() => {
      if (user?.id && isServiceProvider) {
        fetchQueue();
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [user, isServiceProvider]);

  // Walk-in Customer Form State
  const [showWalkInForm, setShowWalkInForm] = useState(false);
  const [showStaffModal, setShowStaffModal] = useState(false);
  const [walkInName, setWalkInName] = useState('');
  const [walkInPhone, setWalkInPhone] = useState('');
  const [walkInService, setWalkInService] = useState('Haircut');
  const [walkInPrice, setWalkInPrice] = useState('');

  const handleAddWalkIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedQueueId) return;
    try {
      await fetch(`${API_URL}/service-queue/${selectedQueueId}/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: walkInName,
          phone: walkInPhone,
          service: walkInService,
          price: parseFloat(walkInPrice) || 0
        })
      });
      setShowWalkInForm(false);
      setWalkInName('');
      setWalkInPhone('');
      fetchQueue();
    } catch (err) {
      console.error(err);
      alert('Failed to add walk-in customer');
    }
  };

  React.useEffect(() => {
    if (user?.id) {
      fetch(`${API_URL}/leads/seller/${user.id}`)
        .then(res => res.json())
        .then(data => setLeads(data))
        .catch(err => console.error(err));
    }
  }, [user]);

  // Orders State (from real data)
  const [orders, setOrders] = useState<any[]>([]);

  // Live Bookings State synced with Queue Tokens
  const [bookings, setBookings] = useState<any[]>([]);

  React.useEffect(() => {
    if (queueData?.waiting || queueData?.serving) {
      const liveBookings: any[] = [];
      if (queueData.serving && Array.isArray(queueData.serving)) {
        queueData.serving.forEach((s: any) => {
          liveBookings.push({
            rawId: s.id,
            id: s.bookingMode === 'APPOINTMENT' ? `Apt #${s.id.slice(-4).toUpperCase()}` : `Token #${s.tokenNumber}`,
            customer: s.customerName,
            service: s.service,
            date: 'Live Now',
            status: 'In Progress',
            bookingMode: s.bookingMode,
            tokenNumber: s.tokenNumber,
            appointmentTime: s.appointmentTime,
            originalStatus: s.status,
            staffId: s.staffId,
            resourceId: s.resourceId,
          });
        });
      }
      if (queueData.waiting) {
        queueData.waiting.forEach((t: any) => {
          liveBookings.push({
            rawId: t.id,
            id: t.bookingMode === 'APPOINTMENT' ? `Apt #${t.id.slice(-4).toUpperCase()}` : `Token #${t.tokenNumber}`,
            customer: t.customerName,
            service: t.service,
            date: t.bookingMode === 'APPOINTMENT' ? 'Scheduled Appointment' : 'Waiting in Queue',
            status: t.status === 'PENDING' ? 'Pending' : t.status === 'CHECKED_IN' ? 'Checked In' : 'Upcoming',
            bookingMode: t.bookingMode,
            tokenNumber: t.tokenNumber,
            appointmentTime: t.appointmentTime,
            originalStatus: t.status,
          });
        });
      }
      setBookings(liveBookings);
    }
  }, [queueData]);

  // Form states
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Electronics');
  const [subcategory, setSubcategory] = useState('');
  const [location, setLocation] = useState('New Delhi, Delhi');
  const [imageUrl, setImageUrl] = useState('');

  React.useEffect(() => {
    if (user) {
      if (user.business?.address) {
        setLocation(user.business.address);
      }
    }
  }, [user]);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [isUploadingFiles, setIsUploadingFiles] = useState(false);
  const [parameters, setParameters] = useState<Record<string, string>>({});
  const [newParamName, setNewParamName] = useState('');
  const [enableWholesale, setEnableWholesale] = useState(false);
  const [wholesaleTiers, setWholesaleTiers] = useState([{ minQty: 12, margin: 20 }, { minQty: 100, margin: 30 }, { minQty: 150, margin: 50 }]);

  React.useEffect(() => {
    // Reset parameters when category or subcategory changes, pulling dynamic configurations
    const catData = categories.find(c => c.name === category);
    
    // Default to category parameters
    let targetParams = catData?.parameters || [];
    
    // If a subcategory is selected, use its specific parameters instead
    if (catData?.subcategories && subcategory) {
      const subCatData = catData.subcategories.find(s => s.name === subcategory);
      if (subCatData && subCatData.parameters) {
        targetParams = subCatData.parameters;
      }
    }

    if (targetParams.length > 0) {
      const newParams: Record<string, string> = {};
      targetParams.forEach(p => {
        newParams[p.name] = '';
      });
      setParameters(newParams);
    } else {
      setParameters({});
    }
  }, [category, subcategory, categories]);

  const getPlaceholderForParam = (key: string) => {
    const catData = categories.find(c => c.name === category);
    let targetParams = catData?.parameters || [];
    if (catData?.subcategories && subcategory) {
      const subCatData = catData.subcategories.find(s => s.name === subcategory);
      if (subCatData?.parameters) targetParams = subCatData.parameters;
    }
    
    const p = targetParams.find(p => p.name === key);
    if (p && p.placeholder) return p.placeholder;
    
    // Fallback smart placeholders for custom variants
    const k = key.toLowerCase();
    if (k.includes('color')) return 'Red, Blue, Green, Active Black';
    if (k.includes('shoe size')) return '6, 7, 8, 9, 10';
    if (k.includes('size')) return 'S, M, L, XL';
    if (k.includes('fabric')) return 'Cotton, Polyester, Wool, Silk';
    if (k.includes('material')) return 'Metal, PVC, Plastic, Aluminium, Iron';
    if (k.includes('dimension') || k.includes('measurement')) return 'Inches, cm, feet';
    return 'e.g. Option 1, Option 2';
  };

  const handleSaveListing = async (productData: any) => {
    setIsSubmitting(true);
    try {
      const payload = {
        ...productData,
        image: productData.image || "/hero-left-logo.png",
        discount: productData.originalPrice && productData.originalPrice > productData.price ? `${Math.round(((productData.originalPrice - productData.price) / productData.originalPrice) * 100)}% OFF` : '',
        rating: 'New',
        reviews: '0',
        seller: user?.name || user?.business?.name || 'Seller',
        sellerId: user?.id,
        location: location,
        badge: 'New Arrival',
        badgeColor: 'badge-gold',
        isPremium: isPremiumSeller,
      };

      if (editingProductId) {
        await editProduct(editingProductId, payload);
      } else {
        await addProduct(payload);
      }

      setShowSuccess(true);
      setEditingProductId(null);
      setTimeout(() => {
        setShowSuccess(false);
        setActiveTab('listings');
      }, 2500);
    } catch (err) {
      console.error(err);
      alert('Failed to save listing.');
    } finally {
      setIsSubmitting(false);
    }
  };





  return (
    <div className="min-h-screen w-full bg-slate-50 flex flex-col lg:flex-row font-sans overflow-x-hidden relative">
      
      {/* Mobile Header */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-white border-b border-slate-200 shrink-0 sticky top-0 z-40">
        <Link href="/" className="flex items-center no-underline">
          <img src="/logo.png" alt="MarkatVerse" className="h-8 object-contain scale-[2] origin-left" />
        </Link>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg">
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden" 
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-[280px] bg-white border-r border-slate-200 flex flex-col shrink-0
        transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-6 border-b border-slate-100 flex flex-col gap-4">
          <Link href="/" className="flex items-center no-underline hover:opacity-90 transition-opacity">
            <img src="/logo.png" alt="MarkatVerse" className="h-10 object-contain scale-[2.5] origin-left" />
          </Link>
          <div className="text-amber-500 text-xs font-bold tracking-widest mt-1">SELLER PORTAL</div>
          <Link href="/" className="text-blue-600 flex items-center gap-2 hover:opacity-80 transition-opacity font-bold text-sm mt-2">
            <ArrowLeft className="w-4 h-4" /> Back to Marketplace
          </Link>
        </div>
        
        <div className="p-6 text-center">
          <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-black text-xl shadow-md mx-auto mb-4">
            {(user?.name || user?.business?.name || 'S').charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">{user?.name || user?.business?.name || 'Seller'}</h3>
          </div>
          <div className="flex items-center justify-center gap-1 text-emerald-600 text-sm font-medium mt-1">
            <CheckCircle2 className="w-4 h-4" /> Verified Seller
          </div>
        </div>
        
        <nav className="flex-1 px-4 py-2 space-y-1">
          <button 
            onClick={() => setActiveTab('overview')} 
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'overview' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
          >
            <BarChart3 className="w-5 h-5" /> Overview
          </button>
          <button 
            onClick={() => setActiveTab('listings')} 
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'listings' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
          >
            <Store className="w-5 h-5" /> {isServiceProvider ? 'My Services' : 'My Listings'}
          </button>
          <button 
            onClick={() => {
              const maxAllowed = user?.business?.maxListings ?? 5;
              if (myListings.length >= maxAllowed) {
                alert(`You have reached the maximum allowed limit of ${maxAllowed} ${isServiceProvider ? 'services' : 'products'}. Please contact support to increase your limit.`);
                return;
              }
              setEditingProductId(null);
              setName('');
              setPrice('');
              setOriginalPrice('');
              setDescription('');
              setImageUrl('');
              setUploadedImages([]);
              setActiveTab('add');
            }} 
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'add' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
          >
            <PlusCircle className="w-5 h-5" /> {isServiceProvider ? 'Add Service' : 'Add Product'}
          </button>
          {/* Dynamic Workflow Tabs */}
          {(isCartFlow || isRfqFlow) && (
            <button 
              onClick={() => setActiveTab('orders')} 
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'orders' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
            >
              <Package className="w-5 h-5" /> Orders
            </button>
          )}

          {isQueueFlow && (
            <button 
              onClick={() => setActiveTab('queue')} 
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'queue' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
            >
              <span className="w-5 h-5 flex items-center justify-center text-lg">🎟️</span> Queue & Tokens
            </button>
          )}

          {isRfqFlow && (
            <button 
              onClick={() => setActiveTab('leads')} 
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'leads' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
            >
              <span className="w-5 h-5 flex items-center justify-center text-lg">💬</span> Leads / RFQ
            </button>
          )}

          {(isQueueFlow || isMeetingFlow) && (
            <button 
              onClick={() => setActiveTab('bookings')} 
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'bookings' ? 'bg-amber-50 text-amber-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
            >
              <div className="flex items-center gap-3">
                <CalendarClock className="w-5 h-5" /> Bookings
              </div>
              <Crown className="w-4 h-4 text-amber-500" />
            </button>
          )}

          {isProjectFlow && (
            <>
              <button 
                onClick={() => setActiveTab('projects')} 
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'projects' ? 'bg-emerald-50 text-emerald-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
              >
                <span className="w-5 h-5 flex items-center justify-center text-lg">🏗️</span> Projects
              </button>
            </>
          )}

          {isAssetFlow && (
            <>
              <button 
                onClick={() => setActiveTab('enquiries')} 
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'enquiries' ? 'bg-rose-50 text-rose-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
              >
                <span className="w-5 h-5 flex items-center justify-center text-lg">🔑</span> Enquiries
              </button>
            </>
          )}
          <button 
            onClick={() => setActiveTab('settings')} 
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'settings' ? 'bg-red-50 text-red-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
          >
            <Settings className="w-5 h-5" /> Settings
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 lg:p-10">
        
        {activeTab === 'overview' && (
          <div className="max-w-6xl mx-auto animate-in fade-in duration-300">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-slate-900">Dashboard Overview</h1>
              <p className="text-slate-500 mt-2">Welcome back, {user?.name || user?.business?.name || 'Seller'}. Here's what's happening today.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mb-8 lg:mb-10">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <div className="text-slate-500 text-sm font-medium mb-2">{isB2B ? 'B2B Trade Volume' : 'Total Sales'}</div>
                <div className="text-3xl font-bold text-slate-900">₹0</div>
                <div className="text-slate-400 text-sm font-medium mt-2 flex items-center gap-1">No sales yet</div>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <div className="text-slate-500 text-sm font-medium mb-2">{isServiceProvider ? 'Active Services' : (isB2B ? 'B2B Catalog' : 'Active Listings')}</div>
                <div className="text-3xl font-bold text-slate-900">{myListings.length}</div>
                <button onClick={() => setActiveTab('listings')} className="text-blue-600 text-sm font-medium mt-2 hover:underline">
                  {isServiceProvider ? 'View services →' : 'View catalog →'}
                </button>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <div className="text-slate-500 text-sm font-medium mb-2">
                  {isServiceProvider ? 'Queue / Tokens' : (isB2B ? 'Pending RFQs' : 'Pending Orders')}
                </div>
                <div className="text-3xl font-bold text-amber-500">
                  {isServiceProvider
                    ? (queueData ? `${queueData.waitingCount ?? 0} waiting` : 'No queue')
                    : (isB2B ? leads.length.toString() : orders.length.toString())}
                </div>
                <button onClick={() => setActiveTab(isServiceProvider ? 'queue' : (isB2B ? 'leads' : 'orders'))}
                  className="text-slate-400 text-sm font-medium mt-2 cursor-pointer hover:text-blue-600 transition-colors">
                  View details →
                </button>
              </div>
            </div>

            {/* Quick Links */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 lg:gap-4 mb-8 lg:mb-10">
              {(() => {
                const quickActions = [
                  { label: isServiceProvider ? 'My Services' : (isB2B ? 'B2B Catalog' : 'My Listings'), icon: '🛍️', tab: 'listings' },
                ];
                if (isQueueFlow) quickActions.push({ label: 'Queue & Tokens', icon: '🎟️', tab: 'queue' });
                if (isB2C || isCartFlow) quickActions.push({ label: 'Retail Orders', icon: '📦', tab: 'orders' });
                if (isB2B) quickActions.push({ label: 'Leads / RFQ', icon: '💬', tab: 'leads' });
                if (isProjectFlow || isMeetingFlow || isService) quickActions.push({ label: 'Bookings', icon: '📅', tab: 'bookings' });

                return quickActions.map(item => (
                  <button key={item.tab} onClick={() => setActiveTab(item.tab as any)}
                    className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col items-center gap-3 hover:border-blue-300 hover:shadow-md transition-all group">
                    <span className="text-3xl group-hover:scale-110 transition-transform">{item.icon}</span>
                    <span className="text-sm font-bold text-slate-700">{item.label}</span>
                  </button>
                ));
              })()}
            </div>
          </div>
        )}

        {activeTab === 'listings' && (
          <div className="max-w-6xl mx-auto animate-in fade-in duration-300">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-slate-900">{isServiceProvider ? 'My Services' : 'My Listings'}</h1>
                <p className="text-slate-500 mt-2">{isServiceProvider ? 'Manage your active services.' : 'Manage your active products and services.'}</p>
              </div>
              <button 
                onClick={() => setActiveTab('add')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold shadow-md shadow-blue-600/20 transition-colors flex items-center gap-2"
              >
                <PlusCircle className="w-5 h-5" /> Add New
              </button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {myListings.map(product => (
                <div key={product.id} className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm flex flex-col group">
                  <div className="h-48 bg-slate-100 flex items-center justify-center relative overflow-hidden">
                    {product.image ? (
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <img src="/hero-left-logo.png" alt={product.name} className="w-full h-full object-contain opacity-50 p-4 group-hover:scale-105 transition-transform duration-500" />
                    )}
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur text-blue-700 text-xs font-bold px-2.5 py-1 rounded-md shadow-sm">
                      {product.category || 'Uncategorized'}
                    </div>
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <div className="font-bold text-base text-slate-900 mb-2 line-clamp-2 leading-snug">{product.name}</div>
                    <div className="flex justify-between items-end mb-5 mt-auto">
                      <span className="text-xl font-bold text-slate-900">₹{(product.price ?? 0).toLocaleString('en-IN')}</span>
                      <span className="text-xs text-emerald-600 font-medium flex items-center gap-1.5 bg-emerald-50 px-2 py-1 rounded-md">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span> Active
                      </span>
                    </div>
                    <div className="flex gap-2 flex-col">
                      <div className="flex gap-3">
                        <button 
                          onClick={() => {
                            setEditingProductId(product.id);
                            setName(product.name);
                            setPrice(product.price.toString());
                            setOriginalPrice(product.originalPrice ? product.originalPrice.toString() : product.price.toString());
                            setDescription(product.description || '');
                            setCategory(product.category || 'Electronics');
                            setLocation(product.location || '');
                            setImageUrl(product.image || '');
                            setUploadedImages(product.images || []);
                            setEnableWholesale(product.isB2B || false);
                            if (product.wholesaleTiers) setWholesaleTiers(product.wholesaleTiers);
                            if (product.parameters) {
                              const newParams: Record<string, string> = {};
                              Object.keys(product.parameters).forEach(k => {
                                const pVal = product.parameters![k];
                                newParams[k] = Array.isArray(pVal) ? pVal.join(', ') : pVal;
                              });
                              setParameters(newParams);
                            }
                            setActiveTab('add');
                          }}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg font-medium text-sm transition-colors"
                        >
                          <Edit2 className="w-4 h-4" /> Edit
                        </button>
                        <button 
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 border border-red-100 rounded-lg font-medium text-sm transition-colors"
                          onClick={() => {
                            if (confirm('Are you sure you want to delete this listing?')) {
                              deleteProduct(product.id);
                            }
                          }}
                        >
                          <Trash2 className="w-4 h-4" /> Delete
                        </button>
                      </div>
                      {/* Link to live public page */}
                      <Link href={`/service/${product.id}`}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-100 rounded-lg font-medium text-sm transition-colors">
                        🌐 View Live Page
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
              {myListings.length === 0 && (
                <div className="col-span-full py-16 text-center bg-white rounded-2xl border border-slate-200 shadow-sm">
                  <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Package className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{isServiceProvider ? 'No services yet' : 'No listings yet'}</h3>
                  <p className="text-slate-500 mb-6">Start growing your business by adding your first {isServiceProvider ? 'service' : 'product'}.</p>
                  <button 
                    onClick={() => setActiveTab('add')}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-bold transition-colors"
                  >
                    {isServiceProvider ? 'Add Service' : 'Add Product'}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'add' && (() => {
          const isService = isServiceProvider || ['Services', 'Transport', 'Organizers'].includes(category);
          return (
          <div className="max-w-3xl mx-auto animate-in fade-in duration-300">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-slate-900">
                {editingProductId ? (isService ? 'Edit Service' : 'Edit Product') : (isService ? 'Add New Service' : 'Add New Product')}
              </h1>
              <p className="text-slate-500 mt-2">{editingProductId ? 'Update the details for your listing.' : 'Create a new listing to start selling.'}</p>
            </div>
            
            {showSuccess ? (
              <div className="bg-emerald-50 border border-emerald-200 p-6 lg:p-8 rounded-2xl text-center">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-emerald-800 mb-2">Listing Published Successfully!</h3>
                <p className="text-emerald-600">Your listing is now live. Redirecting to your dashboard...</p>
              </div>
            ) : (
              <DynamicFormEngine 
                isService={isService} 
                onSave={handleSaveListing} 
                onCancel={() => setActiveTab('listings')} 
                initialData={editingProductId ? products.find(p => p.id === editingProductId) : undefined}
              />
            )}
          </div>
          );
        })()}

        {activeTab === 'queue' && (
          <div className="max-w-6xl mx-auto animate-in fade-in duration-300">
            <div className="mb-8 flex justify-between items-end">
              <div>
                <h1 className="text-3xl font-bold text-slate-900">Queue & Token Management</h1>
                <p className="text-slate-500 mt-2">Manage your live walk-in customers and tokens.</p>
                {availableQueues.length > 1 && (
                  <div className="mt-4 flex items-center gap-3">
                    <span className="text-sm font-semibold text-slate-600">Select Shop/Branch:</span>
                    <select 
                      className="border border-slate-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-blue-500 text-sm font-medium"
                      value={selectedQueueId || ''} 
                      onChange={(e) => fetchQueue(e.target.value)}
                    >
                      {availableQueues.map(q => (
                        <option key={q.id} value={q.id}>{q.shopName}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={() => setShowStaffModal(true)} 
                  className="bg-indigo-50 border border-indigo-200 text-indigo-700 px-4 py-2 rounded-lg font-medium hover:bg-indigo-100 transition-colors shadow-sm flex items-center gap-2"
                >
                  <Users className="w-4 h-4" /> Manage Staff & Stations
                </button>
                <button 
                  onClick={() => setShowWalkInForm(true)} 
                  className="bg-blue-600 border border-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-2"
                >
                  <PlusCircle className="w-4 h-4" /> Add Walk-in
                </button>
                <button onClick={() => fetchQueue()} className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg font-medium hover:bg-slate-50 transition-colors shadow-sm">
                  Refresh Status
                </button>
              </div>
            </div>

            {showWalkInForm && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
                <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
                  <h3 className="text-xl font-bold text-slate-900 mb-4">Add Walk-in Customer</h3>
                  <form onSubmit={handleAddWalkIn} className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1">Customer Name</label>
                      <input type="text" required value={walkInName} onChange={e => setWalkInName(e.target.value)} className="w-full border border-slate-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="e.g. Rahul Sharma" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1">Phone Number (Optional)</label>
                      <input type="text" value={walkInPhone} onChange={e => setWalkInPhone(e.target.value)} className="w-full border border-slate-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="e.g. 9876543210" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1">Service Requested</label>
                      <input type="text" required value={walkInService} onChange={e => setWalkInService(e.target.value)} className="w-full border border-slate-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="e.g. Haircut, Spa" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1">Price (₹)</label>
                      <input type="number" required value={walkInPrice} onChange={e => setWalkInPrice(e.target.value)} className="w-full border border-slate-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="e.g. 150" />
                    </div>
                    <div className="flex justify-end gap-3 pt-4 mt-6 border-t border-slate-100">
                      <button type="button" onClick={() => setShowWalkInForm(false)} className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-50 rounded-lg transition-colors">Cancel</button>
                      <button type="submit" className="px-4 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors">Add to Queue</button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {showStaffModal && queueData && (
              <StaffResourceManagementModal 
                queueId={queueData.queue.id} 
                queueData={queueData} 
                onClose={() => setShowStaffModal(false)} 
                onUpdate={fetchQueue} 
              />
            )}
            
            {isQueueLoading && !queueData ? (
              <div className="text-center py-20 text-slate-500">Loading queue...</div>
            ) : !queueData ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 shadow-sm text-slate-500">No active queue found.</div>
            ) : (
              <div className="flex flex-col gap-6">
                
                {/* Live Status Cards */}
                {queueData.resources && queueData.resources.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {queueData.resources.map((resource: any) => {
                      const servingTokens = Array.isArray(queueData.serving) ? queueData.serving : [];
                      const servingToken = servingTokens.find((s: any) => s.resourceId === resource.id);
                      return (
                        <div key={resource.id} className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-2xl p-6 text-white shadow-lg flex flex-col items-center justify-center relative overflow-hidden">
                          <div className="absolute top-0 left-0 w-full h-full bg-[url('/noise.png')] opacity-10 mix-blend-overlay pointer-events-none"></div>
                          <div className="relative z-10 text-center w-full">
                            <div className="text-indigo-200 text-sm font-bold tracking-widest uppercase mb-2">{resource.name}</div>
                            {servingToken ? (
                              <>
                                <div className="text-6xl font-black mb-2 text-white drop-shadow-md">
                                  {servingToken.bookingMode === 'APPOINTMENT' ? 'Apt' : `#${servingToken.tokenNumber}`}
                                </div>
                                <div className="text-xl font-bold text-blue-100">{servingToken.customerName}</div>
                                <div className="text-indigo-200 text-sm mt-1 mb-4">{servingToken.service}</div>
                              </>
                            ) : (
                              <div className="py-6">
                                <div className="text-4xl font-black text-indigo-300/50 mb-4">—</div>
                                <div className="text-indigo-200 mb-4">No one currently serving</div>
                              </div>
                            )}
                            <button 
                              disabled={actionLoading === `next-${resource.id}`}
                              onClick={() => handleQueueAction(`next-${resource.id}`, `/service-queue/${queueData.queue.id}/next`, 'POST', { resourceId: resource.id })}
                              className="bg-white/20 hover:bg-white/30 text-white w-full py-2 rounded-lg font-bold text-sm shadow-sm transition-colors border border-white/20 disabled:opacity-50"
                            >
                              {actionLoading === `next-${resource.id}` ? 'Calling...' : 'Call Next'}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-2xl p-8 text-white shadow-lg flex flex-col items-center justify-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full bg-[url('/noise.png')] opacity-10 mix-blend-overlay pointer-events-none"></div>
                    <div className="relative z-10 text-center w-full">
                      <div className="text-indigo-200 text-sm font-bold tracking-widest uppercase mb-2">NOW SERVING</div>
                      {queueData.serving && queueData.serving.length > 0 ? (
                        <>
                          <div className="text-8xl font-black mb-2 text-white drop-shadow-md">
                            {queueData.serving[0].bookingMode === 'APPOINTMENT' ? 'Apt' : `#${queueData.serving[0].tokenNumber}`}
                          </div>
                          <div className="text-xl font-bold text-blue-100">{queueData.serving[0].customerName}</div>
                          <div className="text-indigo-200 text-sm mt-1">{queueData.serving[0].service}</div>
                        </>
                      ) : (
                        <div className="py-10">
                          <div className="text-6xl font-black text-indigo-300/50 mb-4">—</div>
                          <div className="text-indigo-200">No one currently serving</div>
                        </div>
                      )}
                      <div className="mt-8 pt-8 border-t border-indigo-500/30 w-full flex justify-between">
                        <div className="text-center">
                          <div className="text-3xl font-black">{queueData.waitingCount}</div>
                          <div className="text-[10px] uppercase font-bold text-indigo-200 tracking-wider">Waiting</div>
                        </div>
                        <div className="text-center">
                          <div className="text-3xl font-black">{queueData.doneToday}</div>
                          <div className="text-[10px] uppercase font-bold text-indigo-200 tracking-wider">Done Today</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Waiting List */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col">
                  <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                    <h2 className="text-lg font-bold text-slate-900">Up Next</h2>
                    {(!queueData.resources || queueData.resources.length === 0) && (
                      <button 
                        disabled={actionLoading === 'next-global'}
                        onClick={() => handleQueueAction('next-global', `/service-queue/${queueData.queue.id}/next`)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-lg font-bold text-sm shadow-sm transition-colors disabled:opacity-50"
                      >
                        {actionLoading === 'next-global' ? 'Calling...' : 'Call Next Customer'}
                      </button>
                    )}
                  </div>
                  
                  <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {queueData.waiting?.length === 0 ? (
                      <div className="text-center py-10 text-slate-500">
                        Queue is empty.
                      </div>
                    ) : (
                      queueData.waiting?.map((token: any, i: number) => (
                        <div key={token.id} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50 hover:bg-white hover:shadow-sm transition-all">
                          <div className="flex items-center gap-4">
                            <div className={`w-14 h-12 rounded-xl flex flex-col items-center justify-center font-black text-sm ${i === 0 ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-200 text-slate-600'}`}>
                              {token.bookingMode === 'APPOINTMENT' ? (
                                <><span>Apt</span><span className="text-[10px] font-bold">{new Date(token.appointmentTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span></>
                              ) : (
                                <span className="text-lg">#{token.tokenNumber}</span>
                              )}
                            </div>
                            <div>
                              <div className="font-bold text-slate-900 flex items-center gap-2">
                                {token.customerName}
                                {token.bookingMode === 'APPOINTMENT' && token.status === 'PENDING' && (
                                  <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full uppercase tracking-wider font-bold">Pending Arrival</span>
                                )}
                                {token.bookingMode === 'APPOINTMENT' && token.status === 'CHECKED_IN' && (
                                  <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full uppercase tracking-wider font-bold">Checked In</span>
                                )}
                                {token.status === 'ABSENT' && (
                                  <span className="text-[10px] bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full uppercase tracking-wider font-bold">Absent (Late)</span>
                                )}
                              </div>
                              <div className="text-xs text-slate-500 font-medium">{token.service}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-right">
                            <div className="text-sm font-medium text-slate-700 mr-2">
                              📞 {token.phone || 'No phone'}
                            </div>
                            
                            {token.status !== 'ABSENT' ? (
                              <button 
                                disabled={actionLoading === `absent-${token.id}`}
                                onClick={() => handleQueueAction(`absent-${token.id}`, `/service-queue/token/${token.id}/absent`, 'PATCH')}
                                className="text-orange-600 hover:text-orange-700 bg-orange-50 hover:bg-orange-100 px-3 py-1.5 rounded-md text-xs font-bold transition-colors disabled:opacity-50"
                              >
                                {actionLoading === `absent-${token.id}` ? '...' : 'Absent'}
                              </button>
                            ) : (
                              <button 
                                disabled={actionLoading === `waiting-${token.id}`}
                                onClick={() => handleQueueAction(`waiting-${token.id}`, `/service-queue/token/${token.id}/waiting`, 'PATCH')}
                                className="text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-md text-xs font-bold transition-colors disabled:opacity-50"
                              >
                                {actionLoading === `waiting-${token.id}` ? '...' : 'Return to Queue'}
                              </button>
                            )}
                            
                            <button 
                              disabled={actionLoading === `noshow-${token.id}`}
                              onClick={() => {
                                if(confirm('Mark this customer as No-Show? They will be removed from the list.')) {
                                  handleQueueAction(`noshow-${token.id}`, `/service-queue/token/${token.id}/no-show`, 'PATCH');
                                }
                              }}
                              className="text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-md text-xs font-bold transition-colors disabled:opacity-50"
                            >
                              {actionLoading === `noshow-${token.id}` ? '...' : 'No Show'}
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Performance Analytics Section */}
                {queueAnalytics && (
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mt-4">
                    <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
                      <div>
                        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                          <TrendingUp className="w-5 h-5 text-emerald-500" />
                          Shop Performance & Earnings
                        </h2>
                        <p className="text-sm text-slate-500 mt-1">Daily and monthly overview of staff collections.</p>
                      </div>
                      <div className="flex gap-4 text-right">
                        <div>
                          <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Today's Collection</div>
                          <div className="text-2xl font-black text-emerald-600">₹{queueAnalytics.totalTodayCollection.toLocaleString('en-IN')}</div>
                        </div>
                        <div className="w-px bg-slate-200 h-10 my-auto"></div>
                        <div>
                          <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Month's Collection</div>
                          <div className="text-2xl font-black text-blue-600">₹{queueAnalytics.totalMonthCollection.toLocaleString('en-IN')}</div>
                        </div>
                        {(user?.business?.wallet?.owedToPlatform ?? 0) > 0 && (
                          <>
                            <div className="w-px bg-slate-200 h-10 my-auto"></div>
                            <div>
                              <div className="text-xs font-bold text-orange-500 uppercase tracking-widest">Owed to Platform</div>
                              <div className="text-2xl font-black text-orange-600 flex items-center gap-3">
                                ₹{(user?.business?.wallet?.owedToPlatform || 0).toLocaleString('en-IN')}
                                <button 
                                  onClick={async () => {
                                    if(confirm('Proceed to pay platform fees?')) {
                                      try {
                                        await fetch(`${API_URL}/wallet/business/${user?.business?.id}/pay-platform`, { method: 'POST' });
                                        alert('Payment successful!');
                                        window.location.reload();
                                      } catch (e) {
                                        console.error(e);
                                      }
                                    }
                                  }}
                                  className="text-xs bg-orange-500 text-white px-3 py-1 rounded-full hover:bg-orange-600 transition-colors"
                                >
                                  Pay Now
                                </button>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="p-0 overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-slate-50/50 border-b border-slate-100 text-slate-500 text-xs font-bold uppercase tracking-wider">
                            <th className="p-4 pl-6">Staff Member</th>
                            <th className="p-4 text-center">Today's Customers</th>
                            <th className="p-4 text-right">Today's Earnings</th>
                            <th className="p-4 text-center">Month's Customers</th>
                            <th className="p-4 text-right pr-6">Month's Earnings</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {queueAnalytics.staffPerformance.map((staff: any) => (
                            <tr key={staff.id} className="hover:bg-slate-50/50 transition-colors">
                              <td className="p-4 pl-6 font-bold text-slate-900 flex items-center gap-3">
                                {staff.id === 'unassigned' ? (
                                  <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center border border-slate-200">
                                    <Store className="w-4 h-4" />
                                  </div>
                                ) : (
                                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-inner">
                                    {staff.name.charAt(0)}
                                  </div>
                                )}
                                {staff.name}
                              </td>
                              <td className="p-4 text-center font-bold text-slate-700">{staff.todayCustomers}</td>
                              <td className="p-4 text-right font-black text-emerald-600">₹{staff.todayEarnings.toLocaleString('en-IN')}</td>
                              <td className="p-4 text-center font-bold text-slate-700">{staff.monthCustomers}</td>
                              <td className="p-4 text-right pr-6 font-black text-blue-600">₹{staff.monthEarnings.toLocaleString('en-IN')}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'bookings' && (
          <div className="max-w-6xl mx-auto animate-in fade-in duration-300">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-slate-900">Bookings & Appointments</h1>
              <p className="text-slate-500 mt-2">Track and manage your live tokens and upcoming appointments.</p>
            </div>
            
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wider font-semibold">
                    <th className="p-4 pl-6">ID / Token</th>
                    <th className="p-4">Customer</th>
                    <th className="p-4">Service</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 pr-6 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {bookings.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-slate-500">
                        No active bookings or tokens in queue right now.
                      </td>
                    </tr>
                  ) : (
                    bookings.map((booking, index) => (
                      <tr key={index} className="hover:bg-slate-50 transition-colors">
                        <td className="p-4 pl-6 font-bold text-indigo-700">
                          {booking.id.startsWith('Token') ? booking.id : (booking.id.includes('Apt') ? booking.id : (booking.bookingMode === 'APPOINTMENT' ? 'Appointment' : `Token #${booking.tokenNumber || '?'}`))}
                        </td>
                        <td className="p-4 text-slate-900 font-medium">
                          {booking.customer}
                          {booking.appointmentTime && <div className="text-xs text-slate-500">{new Date(booking.appointmentTime).toLocaleString()}</div>}
                        </td>
                        <td className="p-4 text-slate-600">{booking.service}</td>
                        <td className="p-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            booking.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                            booking.status === 'Upcoming' ? 'bg-amber-100 text-amber-700' :
                            booking.status === 'Pending' ? 'bg-slate-100 text-slate-700' :
                            booking.status === 'Checked In' ? 'bg-emerald-100 text-emerald-700' :
                            'bg-emerald-100 text-emerald-700'
                          }`}>
                            {booking.status}
                          </span>
                        </td>
                        <td className="p-4 pr-6 text-right flex justify-end gap-2">
                          {booking.originalStatus === 'PENDING' && (
                            <button 
                              disabled={actionLoading === `checkin-${booking.rawId}`}
                              className="text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg font-medium text-sm transition-colors disabled:opacity-50"
                              onClick={() => handleQueueAction(`checkin-${booking.rawId}`, `/service-queue/token/${booking.rawId}/check-in`, 'POST')}
                            >
                              {actionLoading === `checkin-${booking.rawId}` ? '...' : 'Check-In Arrival'}
                            </button>
                          )}
                          <button 
                            className="text-slate-400 hover:text-blue-600 font-medium text-sm transition-colors px-3 py-1.5"
                            onClick={() => setActiveTab('queue')}
                          >
                            Manage in Queue
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="max-w-6xl mx-auto animate-in fade-in duration-300">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-slate-900">Recent Orders</h1>
              <p className="text-slate-500 mt-2">Track and manage your customer orders.</p>
            </div>
            
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wider font-semibold">
                    <th className="p-4 pl-6">Order ID</th>
                    <th className="p-4">Buyer</th>
                    <th className="p-4">Item</th>
                    <th className="p-4">Date</th>
                    <th className="p-4">Amount</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 pr-6 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4 pl-6 font-medium text-slate-900">{order.id}</td>
                      <td className="p-4 text-slate-700">{order.buyer}</td>
                      <td className="p-4 text-slate-600 truncate max-w-[200px]">{order.item}</td>
                      <td className="p-4 text-slate-500 text-sm">{order.date}</td>
                      <td className="p-4 font-bold text-slate-900">{order.amount}</td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          order.status === 'Pending' ? 'bg-amber-100 text-amber-700' :
                          order.status === 'Shipped' ? 'bg-blue-100 text-blue-700' :
                          'bg-emerald-100 text-emerald-700'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="p-4 pr-6 text-right">
                        {order.status === 'Pending' ? (
                          <button 
                            className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors"
                            onClick={() => setOrders(orders.map(o => o.id === order.id ? {...o, status: 'Shipped'} : o))}
                          >
                            Mark Shipped
                          </button>
                        ) : (
                          <button className="text-slate-400 hover:text-slate-600 font-medium text-sm">View</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'leads' && (
          <div className="max-w-6xl mx-auto animate-in fade-in duration-300">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-slate-900">B2B Leads & Inquiries</h1>
              <p className="text-slate-500 mt-2">Manage Requests for Quotation (RFQs) and business inquiries.</p>
            </div>
            
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wider font-semibold">
                    <th className="p-4 pl-6">Date</th>
                    <th className="p-4">Product</th>
                    <th className="p-4">Qty Req.</th>
                    <th className="p-4">Message</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 pr-6 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {leads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4 pl-6 text-sm text-slate-500">{new Date(lead.createdAt).toLocaleDateString()}</td>
                      <td className="p-4 text-slate-900 font-medium">{lead.product?.name || 'Unknown'}</td>
                      <td className="p-4 font-bold text-blue-600">{lead.quantityRequested} Units</td>
                      <td className="p-4 text-slate-600 text-sm truncate max-w-[200px]" title={lead.message}>{lead.message}</td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          lead.status === 'PENDING' ? 'bg-amber-100 text-amber-700' :
                          lead.status === 'REPLIED' ? 'bg-blue-100 text-blue-700' :
                          'bg-slate-100 text-slate-700'
                        }`}>
                          {lead.status}
                        </span>
                      </td>
                      <td className="p-4 pr-6 text-right">
                        {lead.status === 'PENDING' ? (
                          <button 
                            className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors"
                            onClick={() => {
                              fetch(`${API_URL}/leads/${lead.id}/status`, {
                                method: 'PATCH',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ status: 'REPLIED' })
                              }).then(() => {
                                setLeads(leads.map(l => l.id === lead.id ? {...l, status: 'REPLIED'} : l))
                              });
                            }}
                          >
                            Mark Replied
                          </button>
                        ) : (
                          <button className="text-slate-400 hover:text-slate-600 font-medium text-sm">View</button>
                        )}
                      </td>
                    </tr>
                  ))}
                  {leads.length === 0 && (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-slate-500">
                        No leads found. When a buyer requests a quote, it will appear here.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}



        {['projects', 'milestones', 'enquiries', 'inventory', 'proposals'].includes(activeTab) && (
          <div className="max-w-6xl mx-auto py-20 text-center animate-in fade-in duration-300">
            <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8" />
            </div>
            <h2 className="text-3xl font-bold text-slate-800 mb-4 capitalize">{activeTab} Management</h2>
            <p className="text-slate-500">This feature is part of your sector's advanced workflow and is currently being built.</p>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="max-w-6xl mx-auto animate-in fade-in duration-300">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-slate-900">Account Settings</h1>
              <p className="text-slate-500 mt-2">Manage your seller account, profile, and preferences.</p>
            </div>
            
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-8 max-w-2xl mb-8">
              <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Settings className="w-5 h-5 text-blue-600" /> Business Profile
              </h2>
              <form className="space-y-4" onSubmit={async (e) => { 
                e.preventDefault(); 
                const form = e.target as HTMLFormElement;
                const data = {
                  businessName: (form[0] as HTMLInputElement).value,
                  gstNumber: (form[1] as HTMLInputElement).value,
                  address: (form[2] as HTMLTextAreaElement).value,
                };
                try {
                  const res = await fetch(`${API_URL}/sellers/user/${user?.id}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                  });
                  if (res.ok) alert('Profile updated successfully!');
                  else alert('Failed to update profile.');
                } catch(err) {
                  alert('Error updating profile.');
                }
              }}>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Business Name</label>
                  <input type="text" required defaultValue={user?.business?.name} className="w-full border border-slate-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">GST Number</label>
                  <input type="text" defaultValue={user?.business?.gstNumber} className="w-full border border-slate-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Business Address</label>
                  <textarea defaultValue={user?.business?.address} className="w-full border border-slate-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none h-24" />
                </div>
                <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-bold transition-colors">
                  Save Changes
                </button>
              </form>
            </div>
            
            <div className="bg-white rounded-2xl border border-red-200 shadow-sm overflow-hidden p-8 max-w-2xl">
              <h2 className="text-xl font-bold text-red-600 mb-2 flex items-center gap-2">
                <Trash2 className="w-5 h-5" /> Danger Zone
              </h2>
              <p className="text-slate-600 mb-6 text-sm">
                Deleting your seller account will permanently remove your business profile, all your listings/services, and any associated queues or data. This action cannot be undone.
              </p>
              <button 
                onClick={async () => {
                  const confirmText = window.prompt('Are you absolutely sure you want to delete your seller account? All data will be lost forever.\n\nType "delete" below to confirm:');
                  if(confirmText === 'delete') {
                    try {
                      const res = await fetch(`${API_URL}/sellers/user/${user?.id}`, { method: 'DELETE' });
                      if(res.ok) {
                        alert('Account successfully deleted.');
                        window.location.href = '/seller/login';
                      } else {
                        alert('Failed to delete account.');
                      }
                    } catch(err) {
                      alert('Error deleting account.');
                    }
                  } else if (confirmText !== null) {
                    alert('Deletion cancelled. You did not type "delete".');
                  }
                }}
                className="bg-red-50 text-red-600 hover:bg-red-600 hover:text-white px-6 py-3 rounded-xl font-bold transition-colors flex items-center gap-2"
              >
                Delete My Account
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default function SellerDashboard() {
  return (
    <Suspense fallback={<div>Loading Dashboard...</div>}>
      <DashboardContent />
    </Suspense>
  );
}
