import React from 'react';

export default function Button({
  children,
  icon: Icon,
  type = 'button',
  variant = 'primary', // primary, secondary, outline, danger, text
  size = 'md', // sm, md, lg
  className = '',
  disabled = false,
  loading = false,
  onClick,
  ...props
}) {
  const baseStyle = 'inline-flex items-center justify-center font-display font-bold uppercase tracking-widest rounded-xl transition-all duration-300 active:duration-75 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#050505] disabled:opacity-50 disabled:cursor-not-allowed select-none relative group overflow-hidden active:scale-95';
  
  const variants = {
    primary: 'bg-brand hover:bg-brand/90 text-black focus:ring-brand border border-transparent shadow-[0_0_20px_rgba(255,87,34,0.3)] hover:shadow-[0_0_40px_rgba(255,87,34,0.6)] hover:-translate-y-1 hover:scale-[1.02]',
    secondary: 'bg-white/10 hover:bg-white/15 text-white focus:ring-white/30 border border-transparent hover:-translate-y-1 hover:scale-[1.02]',
    outline: 'bg-[#0a0a0a]/50 backdrop-blur-md border border-brand/50 hover:border-brand hover:bg-brand/10 text-brand focus:ring-brand shadow-[inset_0_0_10px_rgba(255,87,34,0.1)] hover:-translate-y-1 hover:scale-[1.02]',
    danger: 'bg-red-600 hover:bg-red-500 text-white focus:ring-red-500 border border-transparent shadow-[0_0_20px_rgba(220,38,38,0.3)] hover:shadow-[0_0_40px_rgba(220,38,38,0.6)] hover:-translate-y-1 hover:scale-[1.02]',
    text: 'bg-transparent text-text-secondary hover:text-white focus:ring-white/30 hover:scale-105',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-[10px]',
    md: 'px-5 py-2.5 text-xs',
    lg: 'px-8 py-3.5 text-sm',
  };

  return (
    <button
      type={type}
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {/* Glitch overlay on hover for primary/outline variants */}
      {(variant === 'primary' || variant === 'outline') && (
        <span className="absolute inset-0 bg-white/20 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300 ease-out z-0 mix-blend-overlay"></span>
      )}

      <span className="relative z-10 flex items-center justify-center gap-2 w-full">
        {loading ? (
          <svg className="animate-spin h-4 w-4 text-current" fill="none" viewBox="0 0 24 24" data-testid="loading-spinner">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        ) : Icon ? (
          <Icon className={`${size === 'sm' ? 'h-3 w-3' : size === 'lg' ? 'h-5 w-5' : 'h-4 w-4'}`} />
        ) : null}
        
        {children && <span>{children}</span>}
      </span>
    </button>
  );
}
