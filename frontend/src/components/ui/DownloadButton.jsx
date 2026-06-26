import React from 'react';
import { Download } from 'lucide-react';

export default function DownloadButton({ text, subject = 'Generated Email', className = '' }) {
  const handleDownload = (e) => {
    e.stopPropagation();
    const element = document.createElement('a');
    const file = new Blob([text], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${subject.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.txt`;
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
    document.body.removeChild(element);
  };

  return (
    <button
      type="button"
      onClick={handleDownload}
      className={`p-1.5 rounded-md transition-colors text-editorial-secondary hover:text-editorial-primary hover:bg-warm-secondary dark:text-editorial-secondary dark:hover:text-slate-200 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 ${className}`}
      title="Download as Text"
      aria-label="Download as Text"
    >
      <Download className="h-4 w-4" />
    </button>
  );
}
