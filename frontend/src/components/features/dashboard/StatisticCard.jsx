import React from 'react';
import Card from '../../ui/Card';

export default function StatisticCard({ title, value, icon: Icon, trend, trendLabel, colorClass = 'text-brand-600 dark:text-brand-400', bgClass = 'bg-brand-50 dark:bg-brand-900/20' }) {
  return (
    <Card className="flex flex-col p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-editorial-secondary dark:text-editorial-secondary truncate pr-4">
          {title}
        </h3>
        {Icon && (
          <div className={`p-2 rounded-lg ${bgClass}`}>
            <Icon className={`h-5 w-5 ${colorClass}`} />
          </div>
        )}
      </div>
      <div className="flex items-baseline pb-1">
        <span className="text-3xl font-bold text-editorial-primary dark:text-editorial-primary">
          {value !== undefined && value !== null ? value : '-'}
        </span>
      </div>
      {trend && (
        <p className="text-xs text-editorial-secondary dark:text-editorial-secondary mt-2">
          <span className={`font-medium ${trend.startsWith('+') ? 'text-success dark:text-green-400' : 'text-editorial-secondary dark:text-editorial-secondary'}`}>
            {trend}
          </span>
          {' '}{trendLabel}
        </p>
      )}
    </Card>
  );
}
