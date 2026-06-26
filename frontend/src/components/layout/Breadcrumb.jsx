import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export default function Breadcrumb() {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  if (pathnames.length === 0) return null;

  return (
    <nav className="flex mb-4 text-editorial-secondary dark:text-editorial-secondary text-xs font-medium" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-2">
        <li className="inline-flex items-center">
          <Link
            to="/dashboard"
            className="inline-flex items-center hover:text-editorial-primary dark:hover:text-editorial-primary transition-colors focus:outline-none focus:ring-1 focus:ring-brand-500 rounded"
          >
            <Home className="mr-1.5 h-3.5 w-3.5" />
            Home
          </Link>
        </li>
        {pathnames.map((value, index) => {
          const to = `/${pathnames.slice(0, index + 1).join('/')}`;
          const isLast = index === pathnames.length - 1;
          const displayValue = value.charAt(0).toUpperCase() + value.slice(1);

          return (
            <li key={to} className="inline-flex items-center">
              <ChevronRight className="h-3.5 w-3.5 text-slate-350 dark:text-slate-650 mx-1" />
              {isLast ? (
                <span className="text-editorial-primary dark:text-slate-200 select-none" aria-current="page">
                  {displayValue}
                </span>
              ) : (
                <Link
                  to={to}
                  className="hover:text-editorial-primary dark:hover:text-editorial-primary transition-colors focus:outline-none focus:ring-1 focus:ring-brand-500 rounded"
                >
                  {displayValue}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
