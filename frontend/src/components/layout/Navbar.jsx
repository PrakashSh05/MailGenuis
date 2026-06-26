import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Sun, Moon, LogOut, Menu } from 'lucide-react';

export default function Navbar({ onToggleSidebar }) {
  const { theme, toggleTheme } = useTheme();
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
    <header className="h-16 border-b border-editorial-border dark:border-editorial-border bg-warm-primary dark:bg-warm-primary px-6 flex items-center justify-between fixed top-0 right-0 left-0 md:left-64 z-30 transition-colors">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="md:hidden text-editorial-secondary dark:text-editorial-secondary p-1.5 hover:bg-warm-secondary dark:hover:bg-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
          aria-label="Toggle Sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>
        <span className="text-sm font-bold text-brand-600 dark:text-brand-400 md:hidden">MailGenius AI</span>
      </div>

      <div className="flex items-center gap-4">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 text-editorial-secondary dark:text-editorial-secondary hover:bg-warm-secondary dark:hover:bg-slate-800 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500"
          title="Toggle Dark Mode"
          aria-label="Toggle Dark Mode"
        >
          {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>

        {/* User initials */}
        <div 
          className="h-8 w-8 rounded-full bg-brand-100 dark:bg-brand-950 flex items-center justify-center text-brand-700 dark:text-brand-300 font-semibold text-sm select-none"
          title={user?.fullName || 'User'}
        >
          {getInitials()}
        </div>

        {/* Logout */}
        <button
          onClick={logout}
          className="text-editorial-secondary hover:text-accent dark:text-editorial-secondary dark:hover:text-red-400 p-2 hover:bg-warm-secondary dark:hover:bg-slate-800 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500"
          title="Sign Out"
          aria-label="Sign Out"
        >
          <LogOut className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
}
