import React from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number; // e.g., 4.5
  totalReviews?: number;
  size?: number;
  showText?: boolean;
  compact?: boolean;
}

export default function StarRating({ rating, totalReviews, size = 16, showText = true, compact = false }: StarRatingProps) {
  // Convert rating to a number between 0 and 5
  const safeRating = Math.max(0, Math.min(5, Number(rating) || 0));
  
  if (compact) {
    return (
      <div className="flex items-center gap-1">
        <Star size={size} className="fill-amber-400 text-amber-400" />
        <span className="font-semibold text-slate-800 ml-0.5" style={{ fontSize: size }}>{safeRating.toFixed(1)}</span>
        {totalReviews !== undefined && (
          <span className="text-slate-500" style={{ fontSize: size - 1 }}>({totalReviews})</span>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={size}
            className={`${
              star <= Math.round(safeRating)
                ? 'fill-amber-400 text-amber-400'
                : 'fill-slate-200 text-slate-200'
            }`}
          />
        ))}
      </div>
      {showText && (
        <div className="flex items-center gap-1.5 text-sm">
          <span className="font-semibold text-slate-800">{safeRating.toFixed(1)}</span>
          {totalReviews !== undefined && (
            <span className="text-slate-500">({totalReviews} reviews)</span>
          )}
        </div>
      )}
    </div>
  );
}
