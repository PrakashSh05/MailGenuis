import React from 'react';
import { HelpCircle } from 'lucide-react';
import Button from './Button';

export default function EmptyState({
  title,
  description,
  icon: Icon = HelpCircle,
  action,
  className = '',
}) {
  return (
    <div className={`flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-editorial-border dark:border-editorial-border rounded-2xl bg-warm-primary dark:bg-black/20 ${className}`}>
      <div className="p-4 bg-brand-50 dark:bg-brand-950/40 rounded-2xl text-brand-600 dark:text-brand-400 mb-4">
        <Icon className="h-8 w-8" />
      </div>
      <h3 className="text-lg font-bold text-editorial-primary dark:text-editorial-primary mb-1">
        {title}
      </h3>
      <p className="text-sm text-editorial-secondary dark:text-editorial-secondary max-w-sm mb-6">
        {description}
      </p>
      {action && (
        <div>
          <Button onClick={action.onClick}>{action.label}</Button>
        </div>
      )}
    </div>
  );
}
