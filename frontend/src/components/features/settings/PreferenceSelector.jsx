import React from 'react';

export default function PreferenceSelector({ label, description, options, value, onChange, disabled }) {
  return (
    <div className="space-y-3">
      <div>
        <label className="block text-sm font-medium text-editorial-primary dark:text-editorial-secondary">
          {label}
        </label>
        {description && (
          <p className="text-xs text-editorial-secondary dark:text-editorial-secondary mt-0.5">{description}</p>
        )}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {options.map((option) => {
          const isSelected = value === option.value;
          return (
            <label
              key={option.value}
              className={`relative flex cursor-pointer rounded-lg border p-4 shadow-sm focus:outline-none transition-all ${
                isSelected
                  ? 'border-brand-500 ring-1 ring-brand-500 bg-brand-50 dark:bg-brand-900/20'
                  : 'border-editorial-border dark:border-editorial-border hover:bg-warm-secondary dark:hover:bg-slate-800'
              } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <input
                type="radio"
                name={label}
                value={option.value}
                checked={isSelected}
                onChange={() => !disabled && onChange(option.value)}
                className="sr-only"
                disabled={disabled}
              />
              <span className="flex flex-col text-sm w-full text-center">
                <span className={`font-medium ${isSelected ? 'text-brand-900 dark:text-brand-300' : 'text-editorial-primary dark:text-editorial-primary'}`}>
                  {option.label}
                </span>
                {option.subtext && (
                  <span className={`mt-1 text-xs ${isSelected ? 'text-brand-700 dark:text-brand-400' : 'text-editorial-secondary dark:text-editorial-secondary'}`}>
                    {option.subtext}
                  </span>
                )}
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
}
