import React from 'react';

const TONES = ['PROFESSIONAL', 'CASUAL', 'FRIENDLY', 'PERSUASIVE', 'URGENT', 'EMPATHETIC'];

export default function FilterPanel({ activeFilter, onFilterChange }) {
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      <button
        onClick={() => onFilterChange('')}
        className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
          activeFilter === '' 
            ? 'bg-slate-800 text-editorial-primary dark:bg-slate-200 dark:text-editorial-primary' 
            : 'bg-warm-secondary text-editorial-secondary hover:bg-slate-200 dark:bg-slate-800 dark:text-editorial-secondary dark:hover:bg-slate-700'
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
              ? 'bg-brand-600 text-editorial-primary dark:bg-brand-500 dark:text-editorial-primary' 
              : 'bg-warm-secondary text-editorial-secondary hover:bg-slate-200 dark:bg-slate-800 dark:text-editorial-secondary dark:hover:bg-slate-700'
          }`}
        >
          {tone}
        </button>
      ))}
      <button
        onClick={() => onFilterChange('FAVORITES')}
        className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
          activeFilter === 'FAVORITES' 
            ? 'bg-yellow-500 text-editorial-primary' 
            : 'bg-warm-secondary text-editorial-secondary hover:bg-slate-200 dark:bg-slate-800 dark:text-editorial-secondary dark:hover:bg-slate-700'
        }`}
      >
        ★ Favorites
      </button>
    </div>
  );
}
