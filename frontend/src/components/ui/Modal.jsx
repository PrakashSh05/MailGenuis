import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  className = '',
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay background */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-warm-primary/60 backdrop-blur-sm transition-opacity"
      />

      {/* Modal Dialog Window */}
      <div 
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className={`relative bg-warm-primary dark:bg-warm-primary border border-editorial-border dark:border-editorial-border rounded-2xl w-full max-w-lg shadow-2xl p-6 transition-all transform scale-100 flex flex-col max-h-[90vh] ${className}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4 border-b border-slate-100 dark:border-editorial-border pb-3">
          <h2 id="modal-title" className="text-lg font-bold text-editorial-primary dark:text-editorial-primary select-none">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="text-editorial-secondary hover:text-editorial-primary dark:text-editorial-secondary dark:hover:text-editorial-primary p-1 hover:bg-warm-secondary dark:hover:bg-slate-800 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content body */}
        <div className="flex-1 overflow-y-auto pr-1">
          {children}
        </div>
      </div>
    </div>
  );
}
