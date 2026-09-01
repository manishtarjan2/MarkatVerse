import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 py-12 md:py-16 border-t border-slate-800">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12 mb-12">
          
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block mb-4 hover:opacity-90 transition-opacity">
              <img src="/logo.png" alt="MarkatVerse" className="h-20 object-contain brightness-0 invert" />
            </Link>
            <p className="text-sm text-slate-400 mb-6 max-w-sm leading-relaxed">
              Your premium global marketplace connecting buyers, sellers, and services instantly and securely.
            </p>
            <div className="flex gap-4">
              {/* Social Placeholders */}
              {['Twitter', 'LinkedIn', 'Facebook', 'Instagram'].map(social => (
                <a key={social} href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white transition-colors cursor-pointer" aria-label={social}>
                  <span className="text-xs font-bold">{social[0]}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-white font-bold mb-4">Categories</h4>
            <ul className="flex flex-col gap-3 text-sm">
              <li><Link href="/category/electronics" className="hover:text-blue-400 transition-colors">Electronics</Link></li>
              <li><Link href="/category/fashion" className="hover:text-blue-400 transition-colors">Fashion</Link></li>
              <li><Link href="/category/home" className="hover:text-blue-400 transition-colors">Home & Living</Link></li>
              <li><Link href="/search?filter=b2b" className="hover:text-blue-400 transition-colors">B2B Wholesale</Link></li>
              <li><Link href="/categories" className="hover:text-blue-400 transition-colors">All Categories</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-bold mb-4">Services</h4>
            <ul className="flex flex-col gap-3 text-sm">
              <li><Link href="/search?cat=Home Services" className="hover:text-blue-400 transition-colors">Home Repairs</Link></li>
              <li><Link href="/search?cat=Services" className="hover:text-blue-400 transition-colors">Salon & Beauty</Link></li>
              <li><Link href="/search?cat=Organizers" className="hover:text-blue-400 transition-colors">Event Organizers</Link></li>
              <li><Link href="/search?cat=Transport" className="hover:text-blue-400 transition-colors">Transport & Rentals</Link></li>
            </ul>
          </div>

          {/* Support & Company */}
          <div>
            <h4 className="text-white font-bold mb-4">Company</h4>
            <ul className="flex flex-col gap-3 text-sm">
              <li><Link href="/about" className="hover:text-blue-400 transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-blue-400 transition-colors">Contact Support</Link></li>
              <li><Link href="/terms" className="hover:text-blue-400 transition-colors">Terms of Service</Link></li>
              <li><Link href="/privacy" className="hover:text-blue-400 transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500 font-medium">
          <p>© {new Date().getFullYear()} MarkatVerse. All rights reserved.</p>
          <div className="flex gap-4">
            <span>Secure Payments</span>
            <span>Verified Sellers</span>
            <span>Global Reach</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
