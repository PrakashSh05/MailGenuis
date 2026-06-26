import React from 'react';
import { Menu } from 'lucide-react';

export default function Navbar({ onToggleSidebar }) {
  return (
    <header className="md:hidden h-20 border-b border-white/10 bg-[#050505]/95 backdrop-blur-xl px-6 flex items-center justify-between fixed top-0 right-0 left-0 z-30 transition-all duration-300">
      <div className="flex items-center gap-3 w-full">
        <button
          onClick={onToggleSidebar}
          className="text-text-secondary p-2 hover:text-brand hover:bg-white/5 rounded-xl transition-all"
          aria-label="Toggle Sidebar"
        >
          <Menu className="h-6 w-6" />
        </button>
        <span className="text-lg font-display font-bold text-white tracking-widest uppercase">Mail-Genius</span>
      </div>
    </header>
  );
}
