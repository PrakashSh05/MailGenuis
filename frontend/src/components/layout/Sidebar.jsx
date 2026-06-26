import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Sparkles, History, FileText, Settings, User, Mail, X } from 'lucide-react';

export default function Sidebar({ isOpen, onClose }) {
  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Generate Email', path: '/generate', icon: Sparkles },
    { name: 'Email History', path: '/history', icon: History },
    { name: 'Templates', path: '/templates', icon: FileText },
    { name: 'Profile', path: '/profile', icon: User },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 z-40 bg-warm-primary/60 backdrop-blur-sm md:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside className={`fixed top-0 bottom-0 left-0 z-50 w-64 border-r border-editorial-border dark:border-editorial-border bg-warm-primary dark:bg-warm-primary transition-transform duration-300 md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {/* Title / Logo */}
        <div className="h-16 border-b border-editorial-border dark:border-editorial-border px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Mail className="h-6 w-6 text-brand-500" />
            <span className="font-bold text-editorial-primary dark:text-editorial-primary tracking-tight">MailGenius AI</span>
          </div>
          <button onClick={onClose} className="md:hidden text-editorial-secondary dark:text-editorial-secondary p-1.5 hover:bg-warm-secondary dark:hover:bg-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500" aria-label="Close Sidebar">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Menu Navigation */}
        <nav className="p-4 space-y-1.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-brand-500 ${
                  isActive 
                    ? 'bg-brand-50 dark:bg-brand-950/40 text-brand-600 dark:text-brand-400' 
                    : 'text-editorial-secondary dark:text-editorial-secondary hover:bg-warm-secondary dark:hover:bg-slate-850 hover:text-slate-950 dark:hover:text-editorial-primary'
                }`}
              >
                <Icon className="h-5 w-5" />
                {item.name}
              </NavLink>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
