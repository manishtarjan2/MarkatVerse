"use client";
import { usePathname } from 'next/navigation';
import Footer from './Footer';

export default function ConditionalFooter() {
  const pathname = usePathname();
  
  // Hide footer on seller dashboard and admin portals
  if (pathname?.startsWith('/seller/dashboard') || pathname?.startsWith('/admin')) {
    return null;
  }

  return <Footer />;
}
