import React from 'react';
import Spinner from './Spinner';

export default function LoadingOverlay({
  active,
  message = 'Loading...',
}) {
  if (!active) return null;

  return (
    <div className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-warm-primary/70 dark:bg-warm-secondary/70 backdrop-blur-[1px] transition-opacity duration-200">
      <Spinner size="lg" className="mb-2" />
      <span className="text-sm font-semibold text-editorial-primary dark:text-slate-200 select-none animate-pulse">
        {message}
      </span>
    </div>
  );
}
