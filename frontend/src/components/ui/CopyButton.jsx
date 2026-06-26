import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { copyToClipboard } from '../../utils/clipboard';

export default function CopyButton({ text, className = '', title = 'Copy to clipboard' }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e) => {
    e.stopPropagation();
    if (copied) return;
    
    const success = await copyToClipboard(text);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={`p-1.5 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:opacity-50 ${
        copied 
          ? 'text-success bg-green-50 dark:text-green-400 dark:bg-green-900/20' 
          : 'text-editorial-secondary hover:text-editorial-primary hover:bg-warm-secondary dark:text-editorial-secondary dark:hover:text-slate-200 dark:hover:bg-slate-800'
      } ${className}`}
      title={copied ? 'Copied!' : title}
      aria-label={copied ? 'Copied!' : title}
    >
      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
    </button>
  );
}
