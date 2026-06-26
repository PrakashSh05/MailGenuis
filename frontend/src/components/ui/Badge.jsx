import React from 'react';

export default function Badge({
  children,
  variant = 'brand', // brand, gray, success, danger, warning, info
  className = '',
}) {
  const baseStyle = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold select-none';

  const variants = {
    brand: 'bg-brand-50 text-brand-700 dark:bg-brand-950/40 dark:text-brand-400',
    gray: 'bg-warm-secondary text-editorial-primary dark:bg-slate-800 dark:text-editorial-secondary',
    success: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-success',
    danger: 'bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400',
    warning: 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400',
    info: 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400',
  };

  return (
    <span className={`${baseStyle} ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}
