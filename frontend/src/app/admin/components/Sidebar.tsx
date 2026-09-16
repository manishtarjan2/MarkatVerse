"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { ChevronRight, ArrowLeft, ShieldCheck, Activity, Users, Store, Box, Network, Settings, CheckCircle, ListTree, LogOut } from 'lucide-react';

type NavItem = {
  name: string;
  href?: string;
  icon?: React.ReactNode;
  subItems?: { name: string; href: string }[];
};

export default function Sidebar({ currentAdminRole, isMobileMenuOpen, setIsMobileMenuOpen }: any) {
  const pathname = usePathname();
  const { logout } = useAuth();
  const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({
    'Dashboard': true,
  });

  const toggleMenu = (name: string) => {
    setOpenMenus((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const navItems: NavItem[] = [
    { name: 'Dashboard Overview', href: '/admin', icon: <Activity className="w-5 h-5" /> },
    {
      name: 'Users',
      icon: <Users className="w-5 h-5" />,
      subItems: [
        { name: 'Customers', href: '/admin/users/customers' },
        { name: 'Sellers', href: '/admin/users/sellers' },
        { name: 'Staff', href: '/admin/users/staff' },
        { name: 'Delivery Partners', href: '/admin/users/delivery-partners' },
      ],
    },
    {
      name: 'Businesses',
      icon: <Store className="w-5 h-5" />,
      subItems: [
        { name: 'Sellers', href: '/admin/businesses/sellers' },
        { name: 'Stores', href: '/admin/businesses/stores' },
        { name: 'Branches', href: '/admin/businesses/branches' },
        { name: 'Staff', href: '/admin/businesses/staff' },
        { name: 'Resources', href: '/admin/businesses/resources' },
      ],
    },
    {
      name: 'Marketplace',
      icon: <Box className="w-5 h-5" />,
      subItems: [
        { name: 'Products', href: '/admin/marketplace/products' },
        { name: 'Services', href: '/admin/marketplace/services' },
        { name: 'Categories', href: '/admin/marketplace/categories' },
        { name: 'Category Relations', href: '/admin/marketplace/relations' },
        { name: 'Industries', href: '/admin/marketplace/industries' },
        { name: 'Brands', href: '/admin/marketplace/brands' },
      ],
    },
    {
      name: 'Transactions',
      icon: <Activity className="w-5 h-5" />,
      subItems: [
        { name: 'Orders', href: '/admin/transactions/orders' },
        { name: 'Bookings', href: '/admin/transactions/bookings' },
        { name: 'Payments', href: '/admin/transactions/payments' },
        { name: 'Refunds', href: '/admin/transactions/refunds' },
        { name: 'Wallets', href: '/admin/transactions/wallets' },
        { name: 'Payouts', href: '/admin/transactions/payouts' },
      ],
    },
    {
      name: 'Commercial',
      icon: <Activity className="w-5 h-5" />,
      subItems: [
        { name: 'Commission', href: '/admin/commercial/commission' },
        { name: 'Subscriptions', href: '/admin/commercial/subscriptions' },
        { name: 'Coupons', href: '/admin/commercial/coupons' },
        { name: 'Advertisements', href: '/admin/commercial/advertisements' },
      ],
    },
    {
      name: 'Operations',
      icon: <Network className="w-5 h-5" />,
      subItems: [
        { name: 'Tokens', href: '/admin/operations/tokens' },
        { name: 'Delivery', href: '/admin/operations/delivery' },
        { name: 'Workflows', href: '/admin/operations/workflows' },
        { name: 'Locations', href: '/admin/operations/locations' },
      ],
    },
    {
      name: 'Customer Support',
      icon: <Users className="w-5 h-5" />,
      subItems: [
        { name: 'Tickets', href: '/admin/support/tickets' },
        { name: 'Complaints', href: '/admin/support/complaints' },
        { name: 'Disputes', href: '/admin/support/disputes' },
      ],
    },
    {
      name: 'Content',
      icon: <ListTree className="w-5 h-5" />,
      subItems: [
        { name: 'CMS', href: '/admin/content/cms' },
        { name: 'Banners', href: '/admin/content/banners' },
        { name: 'Blog', href: '/admin/content/blog' },
        { name: 'SEO', href: '/admin/content/seo' },
      ],
    },
    {
      name: 'Analytics',
      icon: <Activity className="w-5 h-5" />,
      subItems: [
        { name: 'Marketplace', href: '/admin/analytics/marketplace' },
        { name: 'Sales', href: '/admin/analytics/sales' },
        { name: 'Services', href: '/admin/analytics/services' },
        { name: 'Customers', href: '/admin/analytics/customers' },
        { name: 'Finance', href: '/admin/analytics/finance' },
      ],
    },
    {
      name: 'Security',
      icon: <ShieldCheck className="w-5 h-5" />,
      subItems: [
        { name: 'Admin Roles', href: '/admin/security/roles' },
        { name: 'Permissions', href: '/admin/security/permissions' },
        { name: 'Audit Logs', href: '/admin/security/audit' },
        { name: 'Login Activity', href: '/admin/security/logins' },
        { name: 'Security Alerts', href: '/admin/security/alerts' },
      ],
    },
    {
      name: 'Notifications',
      icon: <Activity className="w-5 h-5" />,
      subItems: [
        { name: 'Email', href: '/admin/notifications/email' },
        { name: 'SMS', href: '/admin/notifications/sms' },
        { name: 'Push', href: '/admin/notifications/push' },
        { name: 'Templates', href: '/admin/notifications/templates' },
      ],
    },
    {
      name: 'Settings',
      icon: <Settings className="w-5 h-5" />,
      subItems: [
        { name: 'Platform', href: '/admin/settings/platform' },
        { name: 'Payment', href: '/admin/settings/payment' },
        { name: 'Authentication', href: '/admin/settings/authentication' },
        { name: 'Commission', href: '/admin/settings/commission' },
        { name: 'Tax', href: '/admin/settings/tax' },
        { name: 'Booking', href: '/admin/settings/booking' },
        { name: 'SEO', href: '/admin/settings/seo' },
        { name: 'Integrations', href: '/admin/settings/integrations' },
      ],
    },
  ];

  // RBAC Boundary Logic for Sidebar
  const filteredNavItems = navItems.filter(item => {
    if (currentAdminRole === 'super_admin') return true;
    
    if (currentAdminRole === 'catalog_admin') {
      return ['Dashboard Overview', 'Marketplace', 'Content'].includes(item.name);
    }
    
    if (currentAdminRole === 'onboarding_admin') {
      return ['Dashboard Overview', 'Businesses', 'Commercial'].includes(item.name);
    }
    
    if (currentAdminRole === 'support_admin') {
      return ['Dashboard Overview', 'Users', 'Customer Support', 'Transactions', 'Operations'].includes(item.name);
    }
    
    return false;
  });

  return (
    <>
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-[280px] bg-slate-950 border-r border-slate-800 flex flex-col shrink-0
        transform transition-transform duration-300 ease-in-out overflow-y-auto
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-6 border-b border-slate-800 flex flex-col gap-4 sticky top-0 bg-slate-950 z-10">
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

        <nav className="flex-1 px-4 py-2 space-y-1.5 pb-20">
          {filteredNavItems.map((item) => (
            <div key={item.name} className="mb-2">
              {item.href ? (
                <Link href={item.href} onClick={() => setIsMobileMenuOpen(false)}>
                  <div className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${pathname === item.href ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.15)]' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 border border-transparent'}`}>
                    {item.icon}
                    <span>{item.name}</span>
                  </div>
                </Link>
              ) : (
                <div>
                  <div 
                    onClick={() => toggleMenu(item.name)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-medium transition-all duration-300 cursor-pointer ${openMenus[item.name] ? 'bg-slate-800/50 text-white' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'}`}
                  >
                    <div className="flex items-center gap-3">
                      {item.icon}
                      <span>{item.name}</span>
                    </div>
                    <ChevronRight className={`w-4 h-4 transition-transform ${openMenus[item.name] ? 'rotate-90' : ''}`} />
                  </div>
                  {openMenus[item.name] && item.subItems && (
                    <ul className="list-none pl-11 pr-2 mt-2 space-y-1">
                      {item.subItems.map((sub) => (
                        <li key={sub.name}>
                          <Link href={sub.href} onClick={() => setIsMobileMenuOpen(false)}>
                            <div className={`w-full px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${pathname === sub.href ? 'bg-slate-700/50 text-emerald-400 shadow-sm' : 'text-slate-400 hover:bg-slate-700/30 hover:text-slate-200'}`}>
                              {sub.name}
                            </div>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
          ))}
          
          <div className="mt-8 pt-4 border-t border-slate-800">
            <button 
              onClick={() => {
                logout();
                window.location.href = '/admin/login';
              }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-all duration-300 cursor-pointer"
            >
              <LogOut className="w-5 h-5" />
              <span>Secure Log Out</span>
            </button>
          </div>
        </nav>
      </aside>
    </>
  );
}
