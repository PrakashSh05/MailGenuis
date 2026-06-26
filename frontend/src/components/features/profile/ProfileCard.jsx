import React from 'react';
import Card from '../../ui/Card';
import { Mail, Calendar } from 'lucide-react';
import { formatRelativeTime } from '../../../utils/date';

export default function ProfileCard({ profile }) {
  const getInitials = (name) => {
    if (!name) return '??';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  return (
    <Card className="flex flex-col items-center text-center p-8 bg-gradient-to-b from-brand-50 to-white dark:from-brand-900/20 dark:to-slate-900">
      <div className="relative mb-6">
        <div className="h-28 w-28 rounded-full bg-brand-100 dark:bg-brand-900 flex items-center justify-center overflow-hidden border-4 border-white dark:border-editorial-border shadow-lg">
          {profile?.profilePictureUrl ? (
            <img 
              src={profile.profilePictureUrl} 
              alt={profile?.fullName || 'Profile'} 
              className="h-full w-full object-cover"
              onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
            />
          ) : null}
          <span className={`text-3xl font-bold text-brand-600 dark:text-brand-400 ${profile?.profilePictureUrl ? 'hidden' : 'flex'}`}>
            {getInitials(profile?.fullName)}
          </span>
        </div>
      </div>
      
      <h2 className="text-2xl font-bold text-editorial-primary dark:text-editorial-primary mb-2">
        {profile?.fullName || 'User'}
      </h2>
      
      <div className="space-y-2 mt-4 text-sm text-editorial-secondary dark:text-editorial-secondary flex flex-col items-center">
        <div className="flex items-center gap-2">
          <Mail className="h-4 w-4" />
          <span>{profile?.email || 'N/A'}</span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          <span>Joined {profile?.createdAt ? formatRelativeTime(profile.createdAt) : 'recently'}</span>
        </div>
      </div>
    </Card>
  );
}
