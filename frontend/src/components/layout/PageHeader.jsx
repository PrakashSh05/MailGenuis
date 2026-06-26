import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { LogOut } from 'lucide-react';

export default function PageHeader({ title, subtitle, children }) {
  const { user, logout } = useAuth();

  const getInitials = () => {
    if (!user || !user.fullName) return 'U';
    return user.fullName
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="mb-4 flex flex-col md:flex-row md:items-end md:justify-between gap-4 border-b border-black/10 dark:border-white/10 pb-4 relative z-20">
      <div className="absolute left-0 bottom-[-1px] w-24 h-px bg-brand shadow-glow-orange"></div>
      
      {/* Left side: Title */}
      <div>
        <h1 className="text-2xl md:text-4xl font-display font-bold text-gray-900 dark:text-white tracking-widest uppercase">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-2 text-sm font-mono text-text-secondary uppercase tracking-wider">
            {subtitle}
          </p>
        )}
      </div>

      {/* Right side: Actions & Profile */}
      <div className="flex items-center gap-4">
        {children && (
          <div className="flex items-center gap-3 mr-2">
            {children}
          </div>
        )}
        
        {/* Desktop User Profile / Logout */}
        <div className="hidden md:flex items-center gap-4 pl-4 border-l border-black/10 dark:border-white/10">
          <div className="flex items-center gap-3">
            <div className="flex flex-col items-end">
              <span className="text-xs font-semibold text-gray-900 dark:text-white tracking-wider">{user?.fullName || 'Operator'}</span>
            </div>
            <div 
              className="h-9 w-9 rounded-xl bg-brand/10 border border-brand/30 shadow-glow-orange flex items-center justify-center text-brand font-display font-bold tracking-wider select-none relative overflow-hidden"
              title={user?.fullName || 'User'}
            >
              <div className="absolute inset-0 bg-brand/5"></div>
              <span className="relative z-10 text-sm">{getInitials()}</span>
            </div>
          </div>
          
          <button
            onClick={logout}
            className="text-text-secondary hover:text-brand p-2 hover:bg-brand/10 rounded-xl transition-colors group flex items-center gap-2"
            title="Disconnect"
          >
            <span className="text-[10px] font-mono uppercase tracking-widest hidden lg:block group-hover:text-brand transition-colors">Disconnect</span>
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
