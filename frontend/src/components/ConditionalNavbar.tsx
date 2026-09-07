"use client";
import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import BottomNav from './BottomNav';

export default function ConditionalNavbar() {
  const pathname = usePathname();
  
  // Hide navbar on seller dashboard and admin portals
  if (pathname?.startsWith('/seller/dashboard') || pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <>
      <Navbar />
      <BottomNav />
    </>
  );
}
