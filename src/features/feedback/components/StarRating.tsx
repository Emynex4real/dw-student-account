import React, { useState } from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number | null;
  onChange?: (rating: number) => void;
  size?: number;
}

const StarRating: React.FC<StarRatingProps> = ({ rating, onChange, size = 20 }) => {
  const [hovered, setHovered] = useState<number | null>(null);
  const shown = hovered ?? rating ?? 0;
  const isInteractive = Boolean(onChange);

  return (
    <div
      className="flex items-center gap-1"
      role={isInteractive ? 'radiogroup' : 'img'}
      aria-label={isInteractive ? 'Rating' : `${rating ?? 0} out of 5 stars`}
      onMouseLeave={() => setHovered(null)}
    >
      {[1, 2, 3, 4, 5].map((value) => {
        const star = (
          <Star
            size={size}
            className={value <= shown ? 'fill-[#f7941d] text-[#f7941d]' : 'text-gray-300'}
          />
        );
        if (!isInteractive) return <span key={value}>{star}</span>;
        return (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={rating === value}
            aria-label={`${value} star${value > 1 ? 's' : ''}`}
            onClick={() => onChange?.(value)}
            onMouseEnter={() => setHovered(value)}
            className="p-0.5 rounded-md transition-transform hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#f7941d]"
          >
            {star}
          </button>
        );
      })}
    </div>
  );
};

export default StarRating;
