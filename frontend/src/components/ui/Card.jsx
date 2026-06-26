import React from 'react';

export default function Card({
  children,
  className = '',
  onClick,
}) {
  return (
    <div
      onClick={onClick}
      className={`bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-md border border-black/10 dark:border-white/10 rounded-2xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.05)] dark:shadow-glass transition-all duration-500 relative group overflow-hidden ${
        onClick ? 'cursor-pointer hover:border-brand/40 hover:shadow-[0_0_30px_rgba(255,87,34,0.15)]' : ''
      } ${className}`}
    >
      {/* Ambient background glow on hover for interactive cards */}
      {onClick && (
        <div className="absolute inset-0 bg-brand/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-0"></div>
      )}
      
      {/* Content wrapper */}
      <div className="relative z-10 h-full">
        {children}
      </div>
    </div>
  );
}
