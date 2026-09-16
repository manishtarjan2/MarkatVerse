"use client";
import { usePathname } from 'next/navigation';
import Footer from './Footer';

export default function ConditionalFooter() {
  const pathname = usePathname();
  
  // Hide footer on seller dashboard, admin portals, and all standalone salon pages
  if (
    pathname?.startsWith('/seller/dashboard') || 
    pathname?.startsWith('/admin') ||
    pathname?.startsWith('/salon/')
  ) {
    return null;
  }

  return <Footer />;
}
