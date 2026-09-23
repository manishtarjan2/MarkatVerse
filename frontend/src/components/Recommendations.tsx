"use client";
import React, { useEffect, useState } from 'react';
import { Star, Eye, MousePointerClick } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function Recommendations() {
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth(); // If they are logged in, we use their ID

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        // Assuming API runs on 3001 and we pass userId if available
        const url = user?.id 
          ? `http://localhost:3001/recommendations?userId=${user.id}`
          : 'http://localhost:3001/recommendations';
          
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          setRecommendations(data);
        }
      } catch (e) {
        console.error('Failed to fetch recommendations:', e);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [user?.id]);

  const logInteraction = async (item: any, type: string) => {
    try {
      await fetch('http://localhost:3001/recommendations/interactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id || null, // Can be anonymous
          productId: item.itemType === 'product' ? item.id : undefined,
          serviceId: item.itemType === 'service' ? item.id : undefined,
          type
        })
      });
    } catch (e) {
      console.error('Failed to log interaction', e);
    }
  };

  if (loading) {
    return (
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-8 bg-slate-800 rounded w-1/4 mb-8 animate-pulse"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1,2,3,4].map(i => (
              <div key={i} className="bg-slate-800 rounded-2xl h-64 animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (recommendations.length === 0) return null;

  return (
    <section className="py-16 bg-slate-900/50 border-y border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-indigo-500/20 p-2 rounded-lg">
            <Star className="text-indigo-400 w-6 h-6" />
          </div>
          <h2 className="text-3xl font-bold text-white">Recommended For You</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {recommendations.map((item) => (
            <div 
              key={item.id} 
              className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden hover:border-indigo-500/50 transition-all group cursor-pointer"
              onMouseEnter={() => logInteraction(item, 'VIEW')}
              onClick={() => logInteraction(item, 'CLICK')}
            >
              <div className="aspect-[4/3] bg-slate-700 relative overflow-hidden">
                <img 
                  src={item.images?.[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=1000'} 
                  alt={item.title}
                  className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-indigo-600 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded">
                  {item.itemType}
                </div>
              </div>
              
              <div className="p-5">
                <h3 className="text-lg font-bold text-white mb-2 line-clamp-1 group-hover:text-indigo-400 transition-colors">
                  {item.title || item.name}
                </h3>
                <p className="text-slate-400 text-sm line-clamp-2 mb-4">
                  {item.description}
                </p>
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-xl font-black text-white">${item.price}</span>
                  <button className="text-slate-400 hover:text-white transition-colors">
                    <MousePointerClick className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
