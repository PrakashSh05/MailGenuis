import React from 'react';
import { formatRelativeTime } from '../../../utils/date';
import { Mail, Star, FileText, User } from 'lucide-react';

const getActivityIcon = (type) => {
  switch (type) {
    case 'EMAIL_GENERATED':
      return <Mail className="h-4 w-4 text-brand" />;
    case 'EMAIL_SAVED':
      return <Star className="h-4 w-4 text-accent" />;
    case 'TEMPLATE_CREATED':
      return <FileText className="h-4 w-4 text-gray-900 dark:text-white" />;
    case 'PROFILE_UPDATED':
      return <User className="h-4 w-4 text-success" />;
    default:
      return <div className="h-2 w-2 rounded-full bg-black/50 dark:bg-white/50" />;
  }
};

const getActivityBg = (type) => {
  switch (type) {
    case 'EMAIL_GENERATED': return 'bg-brand/10 border-brand/30 shadow-[inset_0_0_10px_rgba(255,87,34,0.1)]';
    case 'EMAIL_SAVED': return 'bg-accent/10 border-accent/30 shadow-[inset_0_0_10px_rgba(230,81,0,0.1)]';
    case 'TEMPLATE_CREATED': return 'bg-black/5 dark:bg-white/5 border-black/20 dark:border-white/20 shadow-[inset_0_0_10px_rgba(0,0,0,0.05)] dark:shadow-[inset_0_0_10px_rgba(255,255,255,0.05)]';
    case 'PROFILE_UPDATED': return 'bg-success/10 border-success/30 shadow-[inset_0_0_10px_rgba(74,222,128,0.1)]';
    default: return 'bg-black/5 dark:bg-white/5 border-black/10 dark:border-white/10';
  }
};

export default function ActivityTimeline({ activities = [] }) {
  if (!activities || activities.length === 0) {
    return (
      <div className="text-center py-8 text-sm text-text-secondary font-mono uppercase tracking-wider">
        No recent activity found.
      </div>
    );
  }

  return (
    <div className="relative border-l border-black/10 dark:border-white/10 ml-6">
      <ul className="space-y-6 py-4">
        {activities.map((activity, index) => (
          <li key={index} className="relative pl-6">
            <span 
              className={`absolute -left-[1.125rem] top-0.5 flex h-9 w-9 items-center justify-center rounded-full border ${getActivityBg(activity.type)} bg-white dark:bg-[#0a0a0a]`}
            >
              {getActivityIcon(activity.type)}
            </span>
            <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between pt-1.5">
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                {activity.description}
              </p>
              <time className="text-xs font-mono text-text-secondary mt-1 sm:mt-0 uppercase tracking-widest">
                {formatRelativeTime(activity.timestamp)}
              </time>
            </div>
            {activity.details && (
              <p className="text-sm font-mono text-text-secondary mt-2 border-l-2 border-black/10 dark:border-white/10 pl-3 py-1">
                {activity.details}
              </p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
