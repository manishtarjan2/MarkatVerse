"use client";
import { usePathname } from 'next/navigation';
import Footer from './Footer';

export default function ConditionalFooter() {
  const pathname = usePathname();
  
  // Hide footer on seller dashboard, admin portals, and standalone kiosk pages
  if (
    pathname?.startsWith('/seller/dashboard') || 
    pathname?.startsWith('/admin') ||
    pathname === '/salon/join' ||
    pathname === '/salon/queue' ||
    (pathname?.startsWith('/salon/token/') && pathname !== '/salon/token/active')
  ) {
    return null;
  }

  return <Footer />;
}
