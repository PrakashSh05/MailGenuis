import React from 'react';

export default function Button({
  children,
  type = 'button',
  variant = 'primary', // primary, secondary, outline, danger, text
  size = 'md', // sm, md, lg
  className = '',
  disabled = false,
  loading = false,
  onClick,
  ...props
}) {
  const baseStyle = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none';
  
  const variants = {
    primary: 'bg-brand-600 hover:bg-brand-700 text-editorial-primary focus:ring-brand-500 border border-transparent shadow-sm',
    secondary: 'bg-warm-secondary hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-editorial-primary dark:text-slate-200 focus:ring-slate-500 border border-transparent',
    outline: 'bg-transparent border border-editorial-border dark:border-editorial-border hover:bg-warm-secondary dark:hover:bg-slate-800 text-editorial-primary dark:text-slate-200 focus:ring-brand-500',
    danger: 'bg-red-600 hover:bg-red-700 text-editorial-primary focus:ring-red-500 border border-transparent shadow-sm',
    text: 'bg-transparent text-editorial-secondary dark:text-editorial-secondary hover:text-editorial-primary dark:hover:text-editorial-primary focus:ring-brand-500',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-5 py-2.5 text-base',
  };

  return (
    <button
      type={type}
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24" data-testid="loading-spinner">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      )}
      {children}
    </button>
  );
}
