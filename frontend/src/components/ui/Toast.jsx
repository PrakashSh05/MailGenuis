import React, { useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

export default function Toast({
  message,
  type = 'info', // success, error, warning, info
  onClose,
  duration = 4000,
  className = '',
}) {
  useEffect(() => {
    if (duration > 0 && onClose) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const icons = {
    success: <CheckCircle className="h-5 w-5 text-emerald-500" />,
    error: <AlertCircle className="h-5 w-5 text-accent" />,
    warning: <AlertTriangle className="h-5 w-5 text-amber-500" />,
    info: <Info className="h-5 w-5 text-blue-500" />,
  };

  const bgStyles = {
    success: 'bg-emerald-50 border-emerald-200 dark:bg-warm-primary dark:border-emerald-800 text-editorial-primary dark:text-slate-100',
    error: 'bg-red-50 border-red-200 dark:bg-warm-primary dark:border-red-800 text-editorial-primary dark:text-slate-100',
    warning: 'bg-amber-50 border-amber-200 dark:bg-warm-primary dark:border-amber-800 text-editorial-primary dark:text-slate-100',
    info: 'bg-blue-50 border-blue-200 dark:bg-warm-primary dark:border-blue-800 text-editorial-primary dark:text-slate-100',
  };

  return (
    <div
      role="alert"
      className={`flex items-center gap-3 p-4 border rounded-xl shadow-lg fixed bottom-6 right-6 z-50 max-w-sm animate-slide-in select-none ${bgStyles[type]} ${className}`}
    >
      <div className="flex-shrink-0">{icons[type]}</div>
      <div className="flex-1 text-sm font-medium leading-5">{message}</div>
      {onClose && (
        <button
          onClick={onClose}
          className="text-editorial-secondary hover:text-editorial-secondary dark:text-editorial-secondary dark:hover:text-editorial-secondary transition-colors p-0.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
          aria-label="Dismiss toast"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
