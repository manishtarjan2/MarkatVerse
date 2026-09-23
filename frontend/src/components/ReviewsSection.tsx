"use client";
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Star, Send } from 'lucide-react';
import StarRating from './StarRating';
import toast from 'react-hot-toast';

interface Review {
  id: string;
  rating: number;
  comment: string;
  userName: string;
  createdAt: string;
}

interface ReviewsSectionProps {
  entityId: string;
  entityType: 'PRODUCT' | 'SERVICE';
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export default function ReviewsSection({ entityId, entityType }: ReviewsSectionProps) {
  const { user, token } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Form State
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchReviews = async () => {
    try {
      const res = await fetch(`${API_URL}/reviews/${entityType}/${entityId}`);
      if (res.ok) {
        const data = await res.json();
        setReviews(data);
      }
    } catch (err) {
      console.error("Failed to fetch reviews", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [entityId, entityType]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !token) {
      toast.error('You must be logged in to leave a review.');
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          entityId,
          entityType,
          rating,
          comment
        })
      });
      
      if (!res.ok) throw new Error('Failed to submit review');
      
      toast.success('Review submitted successfully!');
      setComment('');
      setRating(5);
      fetchReviews(); // Refresh the list
    } catch (err: any) {
      toast.error(err.message || 'Error submitting review');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-12 bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100">
      <h3 className="text-2xl font-bold text-slate-900 mb-8">Customer Reviews</h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Leave a review form */}
        <div className="lg:col-span-1">
          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 sticky top-24">
            <h4 className="font-bold text-slate-900 mb-4">Write a Review</h4>
            {user ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Rating</label>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="focus:outline-none transition-transform hover:scale-110"
                      >
                        <Star
                          size={28}
                          className={`${star <= rating ? 'fill-amber-400 text-amber-400' : 'fill-slate-200 text-slate-200'}`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Review (Optional)</label>
                  <textarea
                    rows={4}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Share your experience..."
                    className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? 'Submitting...' : <><Send size={16} /> Submit Review</>}
                </button>
              </form>
            ) : (
              <div className="text-center py-6">
                <p className="text-slate-500 text-sm mb-4">Please log in to share your experience.</p>
                <a href="/login" className="inline-block bg-slate-900 text-white font-semibold py-2 px-6 rounded-lg text-sm hover:bg-slate-800 transition-colors">
                  Log In to Review
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Reviews List */}
        <div className="lg:col-span-2">
          {isLoading ? (
            <div className="animate-pulse space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 bg-slate-100 rounded-2xl w-full" />
              ))}
            </div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-100 border-dashed">
              <Star className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h4 className="text-slate-900 font-semibold mb-1">No reviews yet</h4>
              <p className="text-slate-500 text-sm">Be the first to review this {entityType.toLowerCase()}!</p>
            </div>
          ) : (
            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review.id} className="pb-6 border-b border-slate-100 last:border-0 last:pb-0">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-blue-700 font-bold uppercase">
                        {review.userName?.charAt(0) || 'U'}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900">{review.userName || 'Anonymous User'}</div>
                        <div className="text-xs text-slate-500">
                          {new Date(review.createdAt).toLocaleDateString('en-US', { 
                            year: 'numeric', month: 'long', day: 'numeric' 
                          })}
                        </div>
                      </div>
                    </div>
                    <StarRating rating={review.rating} showText={false} size={14} />
                  </div>
                  {review.comment && (
                    <p className="text-slate-700 text-sm leading-relaxed">{review.comment}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
