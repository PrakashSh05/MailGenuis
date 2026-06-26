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
  return (
    <div className={`flex flex-col gap-1.5 w-full ${className}`}>
      {label && (
        <label htmlFor={id} className="text-xs font-bold text-editorial-secondary dark:text-editorial-secondary select-none">
          {label}
          {required && <span className="text-accent ml-0.5">*</span>}
        </label>
      )}
      <input
        ref={ref}
        type={type}
        id={id}
        required={required}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`w-full px-4 py-2.5 bg-warm-primary dark:bg-warm-primary border text-editorial-primary dark:text-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all duration-200 text-sm disabled:opacity-50 disabled:cursor-not-allowed ${
          error ? 'border-red-500 focus:ring-red-500' : 'border-editorial-border dark:border-editorial-border'
        }`}
        {...props}
      />
      {error && (
        <span id={`${id}-error`} className="text-xs text-accent font-medium">
          {error}
        </span>
      )}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
