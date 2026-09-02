"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Search, 
  Package, 
  CreditCard, 
  User, 
  ShieldCheck, 
  Store, 
  MessageCircle, 
  PhoneCall, 
  Mail, 
  ChevronRight,
  ChevronDown,
  HelpCircle
} from 'lucide-react';

const faqs = [
  {
    question: "How do I track my order?",
    answer: "You can track your order by going to 'My Account' > 'Orders' and clicking on the 'Track Order' button next to your recent purchase. You will also receive email and SMS updates with tracking links."
  },
  {
    question: "What is your return and refund policy?",
    answer: "We offer a 7-day hassle-free return policy for most items. If you are not satisfied, you can initiate a return from your Orders page. Refunds are processed within 3-5 business days after the returned item passes quality checks."
  },
  {
    question: "How can I cancel an order?",
    answer: "Orders can only be cancelled before they are shipped. Go to your Orders page, select the item, and click 'Cancel Order'. If the item is already shipped, you can refuse the delivery or initiate a return."
  },
  {
    question: "What is MarkatVerse Prime?",
    answer: "MarkatVerse Prime is our premium membership that offers free expedited delivery, exclusive early access to sales, and special discounts. You can subscribe from your account settings."
  },
  {
    question: "How do I become a seller?",
    answer: "Click on 'Become a Seller' in the footer or navigate to the Seller Dashboard. You'll need to provide your business details, GST/Tax information, and bank account details to get started."
  }
];

const categories = [
  { icon: Package, title: "Orders & Shipping", desc: "Track, return, or cancel orders" },
  { icon: CreditCard, title: "Payment & Refunds", desc: "Manage payment methods" },
  { icon: User, title: "Account & Settings", desc: "Update profile and preferences" },
  { icon: ShieldCheck, title: "MarkatVerse Prime", desc: "Manage your subscription" },
  { icon: Store, title: "Seller Support", desc: "Help for registered sellers" },
];

export default function HelpCenterPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-16">
      {/* Hero Section */}
      <div className="bg-blue-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 relative z-10 text-center">
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-6">
            Hi, how can we help?
          </h1>
          
          <div className="max-w-2xl mx-auto relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-6 w-6 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
            </div>
            <input
              type="text"
              placeholder="Search for articles, orders, or topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-12 pr-4 py-4 md:py-5 border-none rounded-2xl text-lg text-slate-800 placeholder-slate-400 bg-white shadow-xl focus:ring-4 focus:ring-blue-500/30 outline-none transition-all"
            />
          </div>
          <p className="mt-4 text-blue-100 text-sm font-medium">
            Popular: <span className="underline cursor-pointer hover:text-white transition-colors">Track Order</span>, <span className="underline cursor-pointer hover:text-white transition-colors">Returns</span>, <span className="underline cursor-pointer hover:text-white transition-colors">Refund Status</span>
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        
        {/* Category Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-16">
          {categories.map((cat, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md hover:border-blue-200 cursor-pointer transition-all flex flex-col items-center text-center group hover:-translate-y-1">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <cat.icon className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-800 mb-1">{cat.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{cat.desc}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* FAQ Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8">
              <div className="flex items-center gap-3 mb-8 pb-4 border-b border-slate-100">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800">Frequently Asked Questions</h2>
              </div>
              
              <div className="space-y-4">
                {faqs.map((faq, idx) => (
                  <div 
                    key={idx} 
                    className={`border rounded-2xl transition-all duration-300 overflow-hidden ${openFaqIndex === idx ? 'border-blue-200 bg-blue-50/30' : 'border-slate-200 bg-white hover:border-slate-300'}`}
                  >
                    <button 
                      onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                      className="w-full px-6 py-4 flex items-center justify-between text-left focus:outline-none"
                    >
                      <span className={`font-bold ${openFaqIndex === idx ? 'text-blue-700' : 'text-slate-800'}`}>
                        {faq.question}
                      </span>
                      <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${openFaqIndex === idx ? 'text-blue-600 rotate-180' : 'text-slate-400'}`} />
                    </button>
                    
                    <div className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${openFaqIndex === idx ? 'max-h-40 pb-4 opacity-100' : 'max-h-0 opacity-0'}`}>
                      <p className="text-slate-600 text-sm leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 pt-6 border-t border-slate-100 text-center">
                <button className="text-blue-600 font-bold text-sm hover:text-blue-800 transition-colors flex items-center justify-center gap-1 mx-auto">
                  View All FAQs <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Contact Support Sidebar */}
          <div className="space-y-6">
            <div className="bg-slate-800 rounded-3xl p-8 text-white shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 rounded-full blur-3xl opacity-20 -mr-10 -mt-10"></div>
              
              <h3 className="text-xl font-bold mb-2 relative z-10">Still need help?</h3>
              <p className="text-slate-300 text-sm mb-8 relative z-10">
                Our customer support team is available 24/7 to assist you with any issues.
              </p>
              
              <div className="space-y-4 relative z-10">
                <button className="w-full bg-white hover:bg-slate-100 text-slate-800 font-bold py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2">
                  <MessageCircle className="w-5 h-5 text-blue-600" /> Start Live Chat
                </button>
                <button className="w-full bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2 border border-slate-600">
                  <PhoneCall className="w-5 h-5 text-slate-300" /> Request a Call
                </button>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
              <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Mail className="w-4 h-4 text-slate-400" /> Email Support
              </h4>
              <p className="text-sm text-slate-500 mb-4">
                Send us an email and we'll get back to you within 24 hours.
              </p>
              <a href="mailto:support@markatverse.com" className="text-blue-600 font-bold hover:underline">
                support@markatverse.com
              </a>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
