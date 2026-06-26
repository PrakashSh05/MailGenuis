import React from 'react';
import { formatRelativeTime } from '../../../utils/date';
import { Mail, Star, FileText, User } from 'lucide-react';

const getActivityIcon = (type) => {
  switch (type) {
    case 'EMAIL_GENERATED':
      return <Mail className="h-4 w-4 text-brand-600 dark:text-brand-400" />;
    case 'EMAIL_SAVED':
      return <Star className="h-4 w-4 text-accent dark:text-accent" />;
    case 'TEMPLATE_CREATED':
      return <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />;
    case 'PROFILE_UPDATED':
      return <User className="h-4 w-4 text-success dark:text-success" />;
    default:
      return <div className="h-2 w-2 rounded-full bg-slate-400" />;
  }
};

const getActivityBg = (type) => {
  switch (type) {
    case 'EMAIL_GENERATED': return 'bg-brand-50 dark:bg-brand-900/20 border-brand-200 dark:border-brand-800';
    case 'EMAIL_SAVED': return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800';
    case 'TEMPLATE_CREATED': return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800';
    case 'PROFILE_UPDATED': return 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800';
    default: return 'bg-warm-secondary dark:bg-slate-800 border-editorial-border dark:border-editorial-border';
  }
};

export default function ActivityTimeline({ activities = [] }) {
  if (!activities || activities.length === 0) {
    return (
      <div className="text-center py-8 text-sm text-editorial-secondary dark:text-editorial-secondary">
        No recent activity found.
      </div>
    );
  }

  return (
    <div className="relative border-l border-editorial-border dark:border-editorial-border ml-3">
      <ul className="space-y-6">
        {activities.map((activity, index) => (
          <li key={index} className="relative pl-6">
            <span 
              className={`absolute -left-[1.125rem] top-0.5 flex h-9 w-9 items-center justify-center rounded-full border-2 bg-warm-primary dark:bg-warm-secondary ${getActivityBg(activity.type)}`}
            >
              {getActivityIcon(activity.type)}
            </span>
            <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between pt-1.5">
              <p className="text-sm font-medium text-editorial-primary dark:text-editorial-primary">
                {activity.description}
              </p>
              <time className="text-xs text-editorial-secondary dark:text-editorial-secondary mt-1 sm:mt-0">
                {formatRelativeTime(activity.timestamp)}
              </time>
            </div>
            {activity.details && (
              <p className="text-sm text-editorial-secondary dark:text-editorial-secondary mt-1">
                {activity.details}
              </p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
