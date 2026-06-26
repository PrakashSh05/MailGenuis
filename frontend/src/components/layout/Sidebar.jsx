import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Sparkles, History, FileText, Settings, User, Mail, X, Zap } from 'lucide-react';

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
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm md:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside className={`fixed top-0 bottom-0 left-0 z-50 w-64 md:w-60 md:m-4 md:rounded-2xl border-r md:border border-border bg-white/90 dark:bg-[#0a0a0a]/90 backdrop-blur-xl shadow-glass transition-transform duration-300 md:translate-x-0 flex flex-col ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        
        {/* Title / Logo */}
        <div className="h-20 border-b border-border/50 px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-brand/10 border border-brand/20 shadow-glow-orange">
              <Zap className="h-5 w-5 text-brand" />
            </div>
            <span className="font-display font-bold text-xl text-gray-900 dark:text-white tracking-widest uppercase whitespace-nowrap">Mail-Genius</span>
          </div>
          <button onClick={onClose} className="md:hidden text-text-secondary p-1.5 hover:text-brand rounded-lg transition-colors" aria-label="Close Sidebar">
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Menu Navigation */}
        <nav className="p-4 space-y-2 overflow-y-auto flex-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 relative overflow-hidden group hover:scale-[1.02] hover:translate-x-1 ${
                  isActive 
                    ? 'text-brand bg-brand/10 border border-brand/30 shadow-[inset_0_0_20px_rgba(255,87,34,0.1)]' 
                    : 'text-text-secondary hover:text-gray-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 border border-transparent hover:border-black/10 dark:hover:border-white/10'
                }`}
              >
                {({ isActive }) => (
                  <>
                    <Icon className={`h-5 w-5 transition-colors duration-300 ${isActive ? 'text-brand' : 'group-hover:text-gray-900 dark:group-hover:text-white'}`} />
                    <span className="relative z-10">{item.name}</span>
                    {isActive && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand shadow-glow-orange"></div>
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>
        
        {/* Futuristic bottom accent */}
        <div className="p-4 border-t border-border/50">
          <div className="px-4 py-3 rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 flex items-center gap-3">
            <div className="h-2 w-2 rounded-full bg-success shadow-[0_0_10px_rgba(74,222,128,0.8)] animate-pulse"></div>
            <span className="text-xs font-mono text-text-secondary uppercase tracking-wider">System Online</span>
          </div>
        </div>
      </aside>
    </>
  );
}
