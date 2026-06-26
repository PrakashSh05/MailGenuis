import React from 'react';
import { Mail, Calendar, User } from 'lucide-react';
import { formatRelativeTime } from '../../../utils/date';

export default function ProfileCard({ profile }) {
  const getInitials = (name) => {
    if (!name) return '??';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  return (
    <div className="bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-md rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.05)] dark:shadow-glass border border-black/10 dark:border-white/10 p-8 hover:border-brand/30 transition-colors duration-500 relative group flex flex-col items-center text-center">
      <div className="absolute inset-0 bg-brand/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none rounded-2xl"></div>
      
      <div className="relative mb-6 z-10">
        <div className="h-32 w-32 rounded-full bg-brand/10 flex items-center justify-center overflow-hidden border border-brand/30 shadow-glow-orange">
          <span className="text-4xl font-display font-bold text-brand flex">
            {getInitials(profile?.fullName)}
          </span>
        </div>
      </div>
      
      <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-2 relative z-10 tracking-wider uppercase">
        {profile?.fullName || 'Operator'}
      </h2>
      
      <div className="space-y-3 mt-4 text-sm font-mono text-text-secondary uppercase tracking-widest flex flex-col items-center relative z-10">
        <div className="flex items-center gap-3 bg-black/5 dark:bg-white/5 px-4 py-2 rounded-lg border border-black/5 dark:border-white/5">
          <Mail className="h-4 w-4 text-brand" />
          <span>{profile?.email || 'SYSTEM.OFFLINE'}</span>
        </div>
        <div className="flex items-center gap-3 bg-black/5 dark:bg-white/5 px-4 py-2 rounded-lg border border-black/5 dark:border-white/5">
          <Calendar className="h-4 w-4 text-brand" />
          <span>JOINED: {profile?.createdAt ? formatRelativeTime(profile.createdAt) : 'RECENTLY'}</span>
        </div>
      </div>
    </div>
  );
}
