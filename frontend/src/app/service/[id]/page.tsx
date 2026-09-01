"use client";
import React, { useState } from 'react';
import { useProducts } from '@/context/ProductContext';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { MapPin, Star, ShieldCheck, Clock, Calendar, CheckCircle2, PhoneCall, Info, Camera } from 'lucide-react';

export default function ServiceDetails() {
  const params = useParams();
  const id = params?.id as string;
  const { products } = useProducts();
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  
  const service = products.find(p => p.id === id);

  if (!service) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] p-10 bg-slate-50">
        <h1 className="text-2xl font-bold text-slate-800 mb-6">Service Not Found</h1>
        <Link href="/">
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
            Go Back
          </button>
        </Link>
      </div>
    );
  }

  const timeSlots = ["09:00 AM", "10:30 AM", "12:00 PM", "02:30 PM", "04:00 PM", "06:00 PM"];

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20">
      
      {/* Service Header */}
      <div className="bg-white border-b border-slate-200 py-10">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row gap-8 items-start">
          
          {/* Main Service Image/Icon */}
          <div className="w-full md:w-1/3 aspect-[4/3] bg-indigo-50 rounded-2xl overflow-hidden shadow-sm border border-indigo-100 flex items-center justify-center relative shrink-0">
            {service.image ? (
              <img src={service.image} alt={service.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-6xl">✂️</span>
            )}
            <div className="absolute top-4 left-4 bg-indigo-600 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm">
              {service.category}
            </div>
          </div>

          {/* Service Title & Provider Info */}
          <div className="flex-1">
            <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4 leading-tight">{service.name}</h1>
            
            <div className="flex flex-wrap items-center gap-6 mb-6">
              <div className="flex items-center gap-1.5 text-amber-500 font-bold bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-100">
                <Star className="w-4 h-4 fill-amber-500" /> {service.rating} <span className="text-slate-500 font-normal ml-1">({service.reviews} reviews)</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-600 font-medium">
                <MapPin className="w-4 h-4 text-slate-400" /> {service.location}
              </div>
            </div>

            <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 inline-block w-full md:w-auto">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Service Provider</div>
              <div className="flex items-center gap-3">
                <Link href={`/shop/${encodeURIComponent(service.seller.toLowerCase().replace(/ /g, '-'))}`} className="font-bold text-lg text-slate-900 hover:text-indigo-600 transition-colors flex items-center gap-2">
                  {service.seller}
                </Link>
                <span className="bg-emerald-100 text-emerald-700 border border-emerald-200 text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1 font-bold tracking-tight">
                  <ShieldCheck className="w-3 h-3" /> Verified Pro
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Main Content Split Layout */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 mt-10 flex flex-col lg:flex-row gap-10">
        
        {/* Left Column: Details */}
        <div className="flex-1">
          <section className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Info className="w-6 h-6 text-indigo-600" /> About This Service
            </h2>
            <div className="text-slate-600 leading-relaxed text-lg">
              {service.description || "Experience top-tier service tailored to your needs. Our professionals use the best practices and tools to ensure your complete satisfaction."}
            </div>
          </section>

          <section className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">What's Included</h2>
            <ul className="space-y-4">
              {['Comprehensive consultation before service', 'Professional-grade equipment and materials', 'Post-service cleanup and inspection', 'Satisfaction guarantee'].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />
                  <span className="text-slate-700 font-medium text-lg">{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Gallery / Past Work</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="aspect-square bg-slate-100 rounded-xl overflow-hidden border border-slate-200 hover:opacity-80 transition-opacity cursor-pointer">
                   <div className="w-full h-full flex items-center justify-center text-slate-300">
                     <Camera className="w-8 h-8" />
                   </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column: Booking Widget */}
        <div className="w-full lg:w-[400px] shrink-0">
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl shadow-slate-200/50 sticky top-6">
            
            <div className="mb-6 pb-6 border-b border-slate-100">
              <div className="text-sm font-semibold text-slate-500 mb-1 uppercase tracking-wider">
                {service.category === 'Transport' ? 'Estimated Base Fare' : 'Starting at'}
              </div>
              <div className="text-4xl font-bold text-slate-900 flex items-baseline gap-1">
                ₹{service.price.toLocaleString('en-IN')}
                <span className="text-lg font-medium text-slate-500">
                  {service.category === 'Transport' ? '/ km' : '/ session'}
                </span>
              </div>
            </div>

            {service.category === 'Transport' ? (
              <>
                <h3 className="font-bold text-slate-900 text-lg mb-4 flex items-center gap-2">
                  🚚 Plan Your Trip / Route
                </h3>
                <div className="flex flex-col gap-4 mb-6">
                  <select className="w-full p-4 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 bg-slate-50 text-slate-700 font-medium">
                    <option value="">-- Select Preferred Vehicle --</option>
                    <option value="minitruck">Mini Truck (1 Ton)</option>
                    <option value="mediumtruck">Medium Truck (3-5 Tons)</option>
                    <option value="heavytruck">Heavy Freight Truck (10+ Tons)</option>
                    <option value="trailer">Trailer (20+ Tons)</option>
                  </select>
                  <div className="flex flex-col gap-3">
                    <div className="bg-slate-50 border border-slate-200 rounded-xl flex items-center px-4 focus-within:border-indigo-500 transition-colors">
                      <span className="text-indigo-500">📍</span>
                      <input type="text" placeholder="Pickup Location (e.g. Warehouse A)" className="w-full p-4 outline-none text-slate-700 bg-transparent font-medium" />
                    </div>
                    <div className="bg-slate-50 border border-slate-200 rounded-xl flex items-center px-4 focus-within:border-indigo-500 transition-colors">
                      <span className="text-rose-500">🚩</span>
                      <input type="text" placeholder="Drop Location (e.g. Factory B)" className="w-full p-4 outline-none text-slate-700 bg-transparent font-medium" />
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <input type="date" className="flex-1 p-4 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 text-slate-700 font-medium bg-slate-50" />
                    <input type="time" className="flex-1 p-4 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 text-slate-700 font-medium bg-slate-50" />
                  </div>
                </div>
                <button 
                  className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-lg transition-all shadow-lg shadow-indigo-600/30 mb-4"
                  onClick={() => alert(`Route calculated. Booking transport service with ${service.seller}...`)}
                >
                  Get Estimate & Book
                </button>
              </>
            ) : (
              <>
                <h3 className="font-bold text-slate-900 text-lg mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-indigo-600" /> Select Date
                </h3>
                <input 
                  type="date" 
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full p-4 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 text-slate-700 font-medium mb-6 bg-slate-50" 
                />

                <h3 className="font-bold text-slate-900 text-lg mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-indigo-600" /> Available Time Slots
                </h3>
                <div className="grid grid-cols-2 gap-3 mb-8">
                  {timeSlots.map(time => (
                    <button 
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={`p-3 rounded-xl font-semibold text-sm transition-all border ${
                        selectedTime === time 
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/20' 
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-indigo-300 hover:bg-indigo-50'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>

                <button 
                  className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-lg transition-all shadow-lg shadow-indigo-600/30 mb-4"
                  onClick={() => {
                    if (!selectedDate || !selectedTime) {
                      alert('Please select a date and time slot.');
                      return;
                    }
                    alert(`Booking confirmed for ${service.name} on ${selectedDate} at ${selectedTime}!`);
                  }}
                >
                  Book Appointment
                </button>
              </>
            )}

            <button 
              className="w-full py-3 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
              onClick={() => alert(`Calling ${service.seller} at +91-9876543210`)}
            >
              <PhoneCall className="w-4 h-4" /> Call Provider Directly
            </button>
            
          </div>
        </div>

      </div>
    </div>
  );
}
