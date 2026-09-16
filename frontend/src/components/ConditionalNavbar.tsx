"use client";
import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import BottomNav from './BottomNav';

export default function ConditionalNavbar() {
  const pathname = usePathname();
  
  // Hide navbar on seller dashboard, admin portals, and all standalone salon pages
  if (
    pathname?.startsWith('/seller/dashboard') || 
    pathname?.startsWith('/admin') ||
    pathname?.startsWith('/salon/')
  ) {
    return null;
  }

  return (
    <>
      <Navbar />
      <BottomNav />
    </>
  );
}
