import React from 'react';
import Breadcrumb from './Breadcrumb';

export default function PageHeader({ title, subtitle, children }) {
  return (
    <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <Breadcrumb />
        <h1 className="text-2xl md:text-3xl font-extrabold text-editorial-primary dark:text-editorial-primary tracking-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-1 text-sm text-editorial-secondary dark:text-editorial-secondary">
            {subtitle}
          </p>
        )}
      </div>
      {children && (
        <div className="flex items-center gap-3">
          {children}
        </div>
      )}
    </div>
  );
}
