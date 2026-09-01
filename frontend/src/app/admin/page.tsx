"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { Users, Store, TrendingUp, CheckCircle, XCircle, ArrowLeft, Activity, ShieldCheck, Box, ListTree, Plus, Trash2, Edit } from 'lucide-react';
import { useProducts, Category, Product } from '@/context/ProductContext';
import { useAuth } from '@/context/AuthContext';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [currentAdminRole, setCurrentAdminRole] = useState<'super_admin' | 'catalog_admin' | 'onboarding_admin' | 'support_admin'>('super_admin');
  
  // Contexts
  const { products, deleteProduct, addProduct, categories, addCategory, deleteCategory } = useProducts();
  const { allUsers, updateUserRole, deleteUser, addUser } = useAuth();
  
  // Mock data for sellers needing approval
  const [pendingSellers, setPendingSellers] = useState([
    { id: 'S-8872', name: 'Sagar Sports', type: 'Construction Raw Material', location: 'Bihar', phone: '0909090909', status: 'Pending', date: '2026-08-31' },
    { id: 'S-8798', name: 'ZoomDrive Rentals', type: 'Car Rentals', location: 'Mumbai', phone: '9876543210', status: 'Pending', date: '2026-09-01' }
  ]);

  const approveSeller = (id: string) => {
    setPendingSellers(pendingSellers.filter(s => s.id !== id));
    alert(`Seller ${id} approved successfully!`);
  };

  const rejectSeller = (id: string) => {
    setPendingSellers(pendingSellers.filter(s => s.id !== id));
    alert(`Seller ${id} rejected.`);
  };

  // Forms states
  const [newCategory, setNewCategory] = useState<Partial<Category>>({ id: '', name: '', theme: 'slate', icon: '' });
  const [isAddingCategory, setIsAddingCategory] = useState(false);

  const handleAddCategory = () => {
    if (newCategory.id && newCategory.name && newCategory.theme && newCategory.icon) {
      addCategory(newCategory as Category);
      setIsAddingCategory(false);
      setNewCategory({ id: '', name: '', theme: 'slate', icon: '' });
    } else {
      alert("Please fill all category fields");
    }
  };

  const [newUser, setNewUser] = useState({ name: '', email: '', phone: '', role: 'support_admin' });
  const [isAddingUser, setIsAddingUser] = useState(false);

  const handleAddUser = () => {
    if (newUser.name && (newUser.email || newUser.phone)) {
      addUser(newUser as any);
      setIsAddingUser(false);
      setNewUser({ name: '', email: '', phone: '', role: 'support_admin' });
    } else {
      alert("Please provide a name and contact info");
    }
  };

  const handleDeleteProduct = (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      deleteProduct(id);
    }
  };

  const handleDeleteUser = (id: string) => {
    if (confirm("Are you sure you want to delete this user?")) {
      deleteUser(id);
    }
  };

  const handleRoleChange = (id: string, role: string) => {
    updateUserRole(id, role as any);
  };

  // Role-based access control helpers
  const canSeeTab = (tab: string) => {
    if (currentAdminRole === 'super_admin') return true;
    if (currentAdminRole === 'catalog_admin' && (tab === 'products' || tab === 'categories')) return true;
    if (currentAdminRole === 'onboarding_admin' && tab === 'approvals') return true;
    if (currentAdminRole === 'support_admin' && (tab === 'users' || tab === 'overview')) return true;
    return false;
  };

  // Prevent accessing a tab directly if not allowed
  React.useEffect(() => {
    if (!canSeeTab(activeTab)) {
      if (canSeeTab('overview')) setActiveTab('overview');
      else if (canSeeTab('approvals')) setActiveTab('approvals');
      else if (canSeeTab('products')) setActiveTab('products');
    }
  }, [currentAdminRole]);

  return (
    <div className="min-h-screen w-full bg-slate-900 text-slate-100 flex font-sans relative">
      
      {/* Top right role simulator */}
      <div className="absolute top-4 right-10 z-50 flex items-center gap-3 bg-slate-800 p-2 rounded-xl border border-slate-700 shadow-lg">
        <span className="text-xs font-bold text-slate-400 uppercase">Simulate Login As:</span>
        <select 
          value={currentAdminRole} 
          onChange={(e) => setCurrentAdminRole(e.target.value as any)}
          className="bg-slate-900 text-emerald-400 text-sm font-bold rounded-lg px-3 py-1 border border-slate-700 focus:outline-none focus:border-emerald-500"
        >
          <option value="super_admin">Super Admin</option>
          <option value="catalog_admin">Catalog Admin (Products/Cats)</option>
          <option value="onboarding_admin">Onboarding Admin (Approvals)</option>
          <option value="support_admin">Support Admin (Users/Overview)</option>
        </select>
      </div>

      {/* Sidebar - Dark Admin Theme */}
      <aside className="w-[280px] bg-slate-950 border-r border-slate-800 flex flex-col shrink-0">
        <div className="p-6 border-b border-slate-800 flex flex-col gap-4">
          <Link href="/" className="flex items-center no-underline hover:opacity-90 transition-opacity">
            <img src="/logo.png" alt="MarkatVerse" className="h-10 object-contain scale-[2.5] origin-left brightness-0 invert" />
          </Link>
          <div className="text-amber-400 text-xs font-bold tracking-widest mt-1">ADMIN PORTAL</div>
          <Link href="/" className="text-emerald-500 flex items-center gap-2 hover:opacity-80 transition-opacity font-bold text-sm mt-2">
            <ArrowLeft className="w-4 h-4" /> Back to Main Site
          </Link>
        </div>
        
        <div className="p-6 text-center">
          <div className="w-20 h-20 rounded-full bg-emerald-900/50 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto mb-4">
            <ShieldCheck className="w-10 h-10" />
          </div>
          <h3 className="text-lg font-bold text-white capitalize">{currentAdminRole.replace('_', ' ')}</h3>
          <div className="flex items-center justify-center gap-1 text-emerald-500 text-sm font-medium mt-1">
            System Online
          </div>
        </div>
        
        <nav className="flex-1 px-4 py-2 space-y-1">
          {canSeeTab('overview') && (
            <button 
              onClick={() => setActiveTab('overview')} 
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'overview' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'}`}
            >
              <Activity className="w-5 h-5" /> Platform Health
            </button>
          )}
          
          {(canSeeTab('products') || canSeeTab('categories') || canSeeTab('users')) && (
            <div className="py-2 mt-2 border-t border-slate-800">
              <div className="px-4 text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Management</div>
              
              {canSeeTab('products') && (
                <button 
                  onClick={() => setActiveTab('products')} 
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'products' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'}`}
                >
                  <Box className="w-5 h-5" /> Products
                </button>
              )}
              
              {canSeeTab('categories') && (
                <button 
                  onClick={() => setActiveTab('categories')} 
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'categories' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'}`}
                >
                  <ListTree className="w-5 h-5" /> Categories
                </button>
              )}

              {canSeeTab('users') && (
                <button 
                  onClick={() => setActiveTab('users')} 
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'users' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'}`}
                >
                  <Users className="w-5 h-5" /> Users
                </button>
              )}
            </div>
          )}

          {canSeeTab('approvals') && (
            <div className="py-2 mt-2 border-t border-slate-800">
              <div className="px-4 text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Tasks</div>
              <button 
                onClick={() => setActiveTab('approvals')} 
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'approvals' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'}`}
              >
                <div className="flex items-center gap-3">
                  <Store className="w-5 h-5" /> Seller Approvals
                </div>
                {pendingSellers.length > 0 && (
                  <span className="bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {pendingSellers.length}
                  </span>
                )}
              </button>
            </div>
          )}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-10 bg-slate-900">
        
        {activeTab === 'overview' && (
          <div className="max-w-6xl mx-auto animate-in fade-in duration-300">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-white">Platform Health</h1>
              <p className="text-slate-400 mt-2">Real-time metrics for MarkatVerse ecosystem.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
              <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-sm">
                <div className="text-slate-400 text-sm font-medium mb-2">Total Gross Volume</div>
                <div className="text-3xl font-bold text-white">₹4.2 Cr</div>
                <div className="text-emerald-400 text-sm font-medium mt-2">↑ 8.4% this week</div>
              </div>
              <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-sm">
                <div className="text-slate-400 text-sm font-medium mb-2">Active Sellers</div>
                <div className="text-3xl font-bold text-white">1,204</div>
                <div className="text-emerald-400 text-sm font-medium mt-2">↑ 12 new today</div>
              </div>
              <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-sm">
                <div className="text-slate-400 text-sm font-medium mb-2">Total Buyers</div>
                <div className="text-3xl font-bold text-white">{allUsers.length}</div>
                <div className="text-emerald-400 text-sm font-medium mt-2">Live Data</div>
              </div>
              <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-sm">
                <div className="text-slate-400 text-sm font-medium mb-2">Total Products</div>
                <div className="text-3xl font-bold text-emerald-400">{products.length}</div>
                <div className="text-slate-500 text-sm font-medium mt-2">Live Data</div>
              </div>
            </div>

            <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700">
              <h3 className="text-xl font-bold text-white mb-6">Recent Transactions</h3>
              <div className="space-y-4">
                {[
                  { id: 'TXN-9982', type: 'Product Sale', amount: '₹1,34,900', status: 'Completed', time: '2 mins ago' },
                  { id: 'TXN-9981', type: 'Service Token', amount: '₹299', status: 'Completed', time: '15 mins ago' },
                  { id: 'TXN-9980', type: 'B2B Freight', amount: '₹4,500', status: 'Pending', time: '1 hour ago' },
                  { id: 'TXN-9979', type: 'Premium Subscription', amount: '₹15,000', status: 'Completed', time: '2 hours ago' },
                ].map((txn, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
                    <div>
                      <div className="font-bold text-white">{txn.id}</div>
                      <div className="text-sm text-slate-400">{txn.type}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-white">{txn.amount}</div>
                      <div className="text-sm text-slate-400 flex items-center gap-2 justify-end">
                        <span className={`w-2 h-2 rounded-full ${txn.status === 'Completed' ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                        {txn.time}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'approvals' && (
          <div className="max-w-6xl mx-auto animate-in fade-in duration-300">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-white">Seller Approvals</h1>
              <p className="text-slate-400 mt-2">Review and verify new business onboardings.</p>
            </div>
            
            <div className="bg-slate-800 rounded-2xl border border-slate-700 shadow-sm overflow-hidden">
              {pendingSellers.length === 0 ? (
                <div className="p-16 text-center">
                  <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">All caught up!</h3>
                  <p className="text-slate-400">There are no pending seller approvals right now.</p>
                </div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-900/50 border-b border-slate-700 text-slate-400 text-xs uppercase tracking-wider font-semibold">
                      <th className="p-4 pl-6">Business Name</th>
                      <th className="p-4">Type/Category</th>
                      <th className="p-4">Location</th>
                      <th className="p-4">Contact</th>
                      <th className="p-4">Date Applied</th>
                      <th className="p-4 pr-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/50">
                    {pendingSellers.map((seller) => (
                      <tr key={seller.id} className="hover:bg-slate-700/30 transition-colors">
                        <td className="p-4 pl-6 font-bold text-white">
                          <div>{seller.name}</div>
                          <div className="text-xs text-slate-500 font-normal">{seller.id}</div>
                        </td>
                        <td className="p-4 text-slate-300">
                          <span className="bg-slate-900 px-2 py-1 rounded text-xs">{seller.type}</span>
                        </td>
                        <td className="p-4 text-slate-300">{seller.location}</td>
                        <td className="p-4 text-slate-300 text-sm">{seller.phone}</td>
                        <td className="p-4 text-slate-400 text-sm">{seller.date}</td>
                        <td className="p-4 pr-6 text-right">
                          <div className="flex justify-end gap-2">
                            <button 
                              onClick={() => approveSeller(seller.id)}
                              className="bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors flex items-center gap-1"
                            >
                              <CheckCircle className="w-4 h-4" /> Approve
                            </button>
                            <button 
                              onClick={() => rejectSeller(seller.id)}
                              className="bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors flex items-center gap-1"
                            >
                              <XCircle className="w-4 h-4" /> Reject
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="max-w-6xl mx-auto animate-in fade-in duration-300">
            <div className="mb-8 flex justify-between items-end">
              <div>
                <h1 className="text-3xl font-bold text-white">User Management</h1>
                <p className="text-slate-400 mt-2">Manage roles and accounts for all platform users.</p>
              </div>
              {currentAdminRole === 'super_admin' && (
                <button 
                  onClick={() => setIsAddingUser(!isAddingUser)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                  {isAddingUser ? 'Cancel' : <><Plus className="w-5 h-5" /> Add User</>}
                </button>
              )}
            </div>

            {isAddingUser && currentAdminRole === 'super_admin' && (
              <div className="bg-slate-800 p-6 rounded-2xl border border-blue-500/30 shadow-sm mb-6 flex flex-wrap gap-4 items-end">
                <div className="flex-1 min-w-[200px]">
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Full Name</label>
                  <input 
                    value={newUser.name}
                    onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                    type="text" 
                    placeholder="e.g. Alice Smith" 
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500" 
                  />
                </div>
                <div className="flex-1 min-w-[200px]">
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Email</label>
                  <input 
                    value={newUser.email}
                    onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                    type="email" 
                    placeholder="e.g. alice@markatverse.com" 
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500" 
                  />
                </div>
                <div className="flex-1 min-w-[150px]">
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Phone</label>
                  <input 
                    value={newUser.phone}
                    onChange={(e) => setNewUser({...newUser, phone: e.target.value})}
                    type="tel" 
                    placeholder="e.g. 9876543210" 
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500" 
                  />
                </div>
                <div className="flex-1 min-w-[200px]">
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Role Assignment</label>
                  <select 
                    value={newUser.role}
                    onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="buyer">Buyer</option>
                    <option value="business">Business / Seller</option>
                    <option value="elite">Elite Buyer</option>
                    <option disabled>──────────</option>
                    <option value="support_admin">Support Admin</option>
                    <option value="onboarding_admin">Onboarding Admin</option>
                    <option value="catalog_admin">Catalog Admin</option>
                    <option value="super_admin">Super Admin</option>
                  </select>
                </div>
                <button 
                  onClick={handleAddUser}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg font-bold transition-colors h-[42px] mt-2 sm:mt-0"
                >
                  Create
                </button>
              </div>
            )}

            <div className="bg-slate-800 rounded-2xl border border-slate-700 shadow-sm overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-900/50 border-b border-slate-700 text-slate-400 text-xs uppercase tracking-wider font-semibold">
                    <th className="p-4 pl-6">Name</th>
                    <th className="p-4">Contact</th>
                    <th className="p-4">Role</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 pr-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50">
                  {allUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-700/30 transition-colors">
                      <td className="p-4 pl-6 font-bold text-white">
                        {u.name}
                      </td>
                      <td className="p-4 text-slate-300 text-sm">
                        <div>{u.email}</div>
                        <div className="text-slate-500 text-xs">{u.phone}</div>
                      </td>
                      <td className="p-4">
                        <select 
                          value={u.role}
                          onChange={(e) => handleRoleChange(u.id!, e.target.value)}
                          disabled={currentAdminRole !== 'super_admin'}
                          className={`bg-slate-900 border border-slate-700 text-slate-200 text-sm rounded-lg px-2 py-1 focus:outline-none ${currentAdminRole === 'super_admin' ? 'focus:border-blue-500 cursor-pointer' : 'opacity-70 cursor-not-allowed'}`}
                        >
                          <option value="buyer">Buyer</option>
                          <option value="business">Business / Seller</option>
                          <option value="elite">Elite Buyer</option>
                          <option disabled>──────────</option>
                          <option value="support_admin">Support Admin</option>
                          <option value="onboarding_admin">Onboarding Admin</option>
                          <option value="catalog_admin">Catalog Admin</option>
                          <option value="super_admin">Super Admin</option>
                        </select>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${u.status === 'active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                          {u.status || 'active'}
                        </span>
                      </td>
                      <td className="p-4 pr-6 text-right">
                        {currentAdminRole === 'super_admin' ? (
                          <button 
                            onClick={() => handleDeleteUser(u.id!)}
                            className="text-slate-400 hover:text-rose-400 p-2 transition-colors"
                            title="Delete User"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        ) : (
                          <span className="text-xs text-slate-500">Restricted</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="max-w-6xl mx-auto animate-in fade-in duration-300">
            <div className="mb-8 flex justify-between items-end">
              <div>
                <h1 className="text-3xl font-bold text-white">Product Management</h1>
                <p className="text-slate-400 mt-2">Manage the catalog of products and services across all categories.</p>
              </div>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2">
                <Plus className="w-5 h-5" /> Add Product
              </button>
            </div>

            <div className="bg-slate-800 rounded-2xl border border-slate-700 shadow-sm overflow-hidden">
              <div className="max-h-[600px] overflow-y-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="sticky top-0 bg-slate-900 z-10">
                    <tr className="border-b border-slate-700 text-slate-400 text-xs uppercase tracking-wider font-semibold">
                      <th className="p-4 pl-6">Product</th>
                      <th className="p-4">Price</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Seller</th>
                      <th className="p-4 pr-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/50">
                    {products.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-700/30 transition-colors">
                        <td className="p-4 pl-6">
                          <div className="font-bold text-white line-clamp-1">{p.name}</div>
                          <div className="text-xs text-slate-500 font-normal">{p.id}</div>
                        </td>
                        <td className="p-4 text-slate-300 font-medium">
                          ₹{p.price.toLocaleString()}
                        </td>
                        <td className="p-4 text-slate-300">
                          <span className="bg-slate-900 px-2 py-1 rounded text-xs">{p.category}</span>
                        </td>
                        <td className="p-4 text-slate-400 text-sm line-clamp-1">{p.seller}</td>
                        <td className="p-4 pr-6 text-right">
                          <div className="flex justify-end gap-2">
                            <button className="text-slate-400 hover:text-blue-400 p-2 transition-colors">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleDeleteProduct(p.id)}
                              className="text-slate-400 hover:text-rose-400 p-2 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'categories' && (
          <div className="max-w-6xl mx-auto animate-in fade-in duration-300">
            <div className="mb-8 flex justify-between items-end">
              <div>
                <h1 className="text-3xl font-bold text-white">Categories Management</h1>
                <p className="text-slate-400 mt-2">Manage top-level categories and themes.</p>
              </div>
              <button 
                onClick={() => setIsAddingCategory(!isAddingCategory)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                {isAddingCategory ? 'Cancel' : <><Plus className="w-5 h-5" /> Add Category</>}
              </button>
            </div>

            {isAddingCategory && (
              <div className="bg-slate-800 p-6 rounded-2xl border border-blue-500/30 shadow-sm mb-6 flex gap-4 items-end">
                <div className="flex-1">
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">ID (Slug)</label>
                  <input 
                    value={newCategory.id}
                    onChange={(e) => setNewCategory({...newCategory, id: e.target.value})}
                    type="text" 
                    placeholder="e.g. food-and-beverage" 
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500" 
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Name</label>
                  <input 
                    value={newCategory.name}
                    onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                    type="text" 
                    placeholder="e.g. Food & Beverage" 
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500" 
                  />
                </div>
                <div className="flex-[0.5]">
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Icon</label>
                  <input 
                    value={newCategory.icon}
                    onChange={(e) => setNewCategory({...newCategory, icon: e.target.value})}
                    type="text" 
                    placeholder="e.g. 🍔" 
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500" 
                  />
                </div>
                <div className="flex-[0.5]">
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Theme</label>
                  <select 
                    value={newCategory.theme}
                    onChange={(e) => setNewCategory({...newCategory, theme: e.target.value})}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="slate">Slate</option>
                    <option value="amber">Amber</option>
                    <option value="blue">Blue</option>
                    <option value="emerald">Emerald</option>
                    <option value="pink">Pink</option>
                    <option value="purple">Purple</option>
                    <option value="indigo">Indigo</option>
                  </select>
                </div>
                <button 
                  onClick={handleAddCategory}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg font-bold transition-colors h-[42px]"
                >
                  Save
                </button>
              </div>
            )}

            <div className="bg-slate-800 rounded-2xl border border-slate-700 shadow-sm overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-900/50 border-b border-slate-700 text-slate-400 text-xs uppercase tracking-wider font-semibold">
                    <th className="p-4 pl-6">Icon</th>
                    <th className="p-4">Name</th>
                    <th className="p-4">ID / Slug</th>
                    <th className="p-4">Theme</th>
                    <th className="p-4 pr-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50">
                  {categories.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-700/30 transition-colors">
                      <td className="p-4 pl-6 text-2xl">
                        {c.icon}
                      </td>
                      <td className="p-4 font-bold text-white">
                        {c.name}
                      </td>
                      <td className="p-4 text-slate-400 font-mono text-sm">
                        {c.id}
                      </td>
                      <td className="p-4 text-slate-300">
                        <span className={`px-2 py-1 rounded text-xs font-bold capitalize bg-${c.theme}-500/10 text-${c.theme}-400`}>
                          {c.theme}
                        </span>
                      </td>
                      <td className="p-4 pr-6 text-right">
                        <button 
                          onClick={() => deleteCategory(c.id)}
                          className="text-slate-400 hover:text-rose-400 p-2 transition-colors"
                          title="Delete Category"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
