import React, { forwardRef } from 'react';

const Input = forwardRef(({
  label,
  id,
  type = 'text',
  error,
  className = '',
  required = false,
  ...props
}, ref) => {
  const inputId = id || props.name;
  return (
    <div className={`flex flex-col gap-1.5 w-full ${className} group`}>
      {label && (
        <label htmlFor={inputId} className="text-xs font-mono uppercase tracking-widest text-text-secondary group-focus-within:text-brand transition-colors select-none">
          {label}
          {required && <span className="text-accent ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        <input
          ref={ref}
          type={type}
          id={inputId}
          required={required}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : undefined}
          className={`w-full px-4 py-3 bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-md border border-black/10 dark:border-white/10 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-1 focus:ring-brand focus:border-brand transition-all duration-300 text-sm font-mono disabled:opacity-50 disabled:cursor-not-allowed shadow-[inset_0_0_10px_rgba(0,0,0,0.05)] dark:shadow-[inset_0_0_10px_rgba(0,0,0,0.5)] hover:border-brand/50 hover:shadow-[0_0_15px_rgba(255,87,34,0.1)] ${
            error ? 'border-red-500 focus:ring-red-500 focus:border-red-500 hover:border-red-500 hover:shadow-[0_0_15px_rgba(239,68,68,0.2)]' : ''
          }`}
          {...props}
        />
        {/* Glow corner accents */}
        <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-brand opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none rounded-tl-xl"></div>
        <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-brand opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none rounded-br-xl"></div>
      </div>
      {error && (
        <span id={`${inputId}-error`} className="text-xs text-red-500 font-mono mt-1 flex items-center gap-1">
          <span className="w-1 h-1 rounded-full bg-red-500"></span> {error}
        </span>
      )}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
