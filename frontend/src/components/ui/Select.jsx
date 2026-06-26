import React, { forwardRef } from 'react';

const Select = forwardRef(({
  label,
  id,
  options = [], // Array of { value, label } or simple strings
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
      <select
        ref={ref}
        id={id}
        required={required}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`w-full px-4 py-3 bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-md border border-black/10 dark:border-white/10 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-1 focus:ring-brand focus:border-brand transition-all duration-300 text-sm font-mono disabled:opacity-50 disabled:cursor-not-allowed appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22none%22%3E%3Cpath%20d%3D%22M7%209l3%203%203-3%22%20stroke%3D%22%236b7280%22%20stroke-width%3D%221.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E')] bg-[size:1.25rem_1.25rem] bg-[position:right_0.75rem_center] bg-no-repeat shadow-[inset_0_0_10px_rgba(0,0,0,0.05)] dark:shadow-[inset_0_0_10px_rgba(0,0,0,0.5)] hover:border-brand/50 hover:shadow-[0_0_15px_rgba(255,87,34,0.1)] ${
          error ? 'border-red-500 focus:ring-red-500 focus:border-red-500 hover:border-red-500 hover:shadow-[0_0_15px_rgba(239,68,68,0.2)]' : ''
        }`}
        {...props}
      >
        {options.map((opt) => {
          const val = typeof opt === 'object' ? opt.value : opt;
          const lbl = typeof opt === 'object' ? opt.label : opt;
          return (
            <option key={val} value={val}>
              {lbl}
            </option>
          );
        })}
      </select>
      {error && (
        <span id={`${id}-error`} className="text-xs text-accent font-medium">
          {error}
        </span>
      )}
    </div>
  );
});

Select.displayName = 'Select';
export default Select;
