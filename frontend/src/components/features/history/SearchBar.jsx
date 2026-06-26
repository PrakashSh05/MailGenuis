import React, { useState, useEffect, useCallback } from 'react';
import { Search } from 'lucide-react';
import { debounce } from '../../../utils/debounce';

export default function SearchBar({ placeholder = 'Search emails...', onSearch, className = '' }) {
  const [searchTerm, setSearchTerm] = useState('');

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = useCallback(
    debounce((value) => {
      onSearch(value);
    }, 500),
    [onSearch]
  );

  const handleChange = (e) => {
    const val = e.target.value;
    setSearchTerm(val);
    debouncedSearch(val);
  };

  return (
    <div className={`relative ${className}`}>
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <Search className="h-4 w-4 text-editorial-secondary" aria-hidden="true" />
      </div>
      <input
        type="text"
        className="block w-full rounded-md border-0 py-2 pl-10 ring-1 ring-inset ring-slate-300 dark:ring-slate-700 bg-warm-primary dark:bg-warm-primary text-editorial-primary dark:text-editorial-primary focus:ring-2 focus:ring-inset focus:ring-brand-500 sm:text-sm sm:leading-6 placeholder:text-editorial-secondary"
        placeholder={placeholder}
        value={searchTerm}
        onChange={handleChange}
      />
    </div>
  );
}
