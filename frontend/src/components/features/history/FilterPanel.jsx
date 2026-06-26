import React from 'react';

const TONES = ['PROFESSIONAL', 'CASUAL', 'FRIENDLY', 'PERSUASIVE', 'URGENT', 'EMPATHETIC'];

export default function FilterPanel({ activeFilter, onFilterChange, showFavorites = true }) {
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      <button
        onClick={() => onFilterChange('')}
        className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
          activeFilter === '' 
            ? 'bg-gray-900 text-white dark:bg-white dark:text-black' 
            : 'bg-black/5 text-gray-600 hover:bg-black/10 dark:bg-white/5 dark:text-gray-400 dark:hover:bg-white/10'
        }`}
      >
        All
      </button>
      {TONES.map(tone => (
        <button
          key={tone}
          onClick={() => onFilterChange(tone)}
          className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
            activeFilter === tone 
              ? 'bg-brand text-black dark:bg-brand dark:text-black' 
              : 'bg-black/5 text-gray-600 hover:bg-black/10 dark:bg-white/5 dark:text-gray-400 dark:hover:bg-white/10'
          }`}
        >
          {tone}
        </button>
      ))}
      {showFavorites && (
        <button
          onClick={() => onFilterChange('FAVORITES')}
          className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
            activeFilter === 'FAVORITES' 
              ? 'bg-yellow-500 text-black dark:bg-yellow-500 dark:text-black' 
              : 'bg-black/5 text-gray-600 hover:bg-black/10 dark:bg-white/5 dark:text-gray-400 dark:hover:bg-white/10'
          }`}
        >
          ★ Favorites
        </button>
      )}
    </div>
  );
}
