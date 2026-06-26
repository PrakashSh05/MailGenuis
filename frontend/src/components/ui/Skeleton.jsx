import React from 'react';

export default function Skeleton({
  variant = 'text', // text, circular, rectangular
  width,
  height,
  className = '',
}) {
  const baseStyle = 'animate-pulse bg-slate-200 dark:bg-slate-800';

  const variants = {
    text: 'h-4 rounded-md w-full',
    circular: 'rounded-full',
    rectangular: 'rounded-xl',
  };

  const style = {
    width: width || undefined,
    height: height || undefined,
  };

  return (
    <div
      className={`${baseStyle} ${variants[variant]} ${className}`}
      style={style}
    />
  );
}
