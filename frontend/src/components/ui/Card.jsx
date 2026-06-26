import React from 'react';

export default function Card({
  children,
  className = '',
  onClick,
}) {
  return (
    <div
      onClick={onClick}
      className={`bg-warm-primary dark:bg-warm-primary border border-editorial-border dark:border-editorial-border rounded-2xl p-6 shadow-sm transition-all duration-200 ${
        onClick ? 'cursor-pointer hover:shadow-md hover:border-editorial-border dark:hover:border-editorial-border' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
}
