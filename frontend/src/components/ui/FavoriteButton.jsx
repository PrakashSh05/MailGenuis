import React from 'react';
import { Star } from 'lucide-react';

export default function FavoriteButton({ isFavorite, onClick, disabled = false, className = '' }) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onClick(e);
      }}
      disabled={disabled}
      className={`p-1.5 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-brand-500 disabled:opacity-50 ${
        isFavorite 
          ? 'text-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-900/20' 
          : 'text-editorial-secondary hover:text-editorial-secondary hover:bg-warm-secondary dark:text-editorial-secondary dark:hover:text-editorial-secondary dark:hover:bg-slate-800'
      } ${className}`}
      aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
      title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
    >
      <Star 
        className="h-5 w-5" 
        fill={isFavorite ? 'currentColor' : 'none'} 
      />
    </button>
  );
}
