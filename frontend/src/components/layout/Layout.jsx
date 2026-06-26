import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white dark:bg-[#050505] bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white dark:from-neutral-900 via-white dark:via-[#050505] to-white dark:to-[#050505] text-editorial-primary transition-colors duration-300 relative overflow-hidden">
      {/* Decorative ambient glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand/5 rounded-full blur-[100px] pointer-events-none"></div>
      
      {/* Sidebar Navigation */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content layer */}
      <div className="md:pl-[17rem] flex flex-col min-h-screen relative z-10">
        {/* Top Navbar */}
        <Navbar onToggleSidebar={() => setSidebarOpen(true)} />

        {/* Content Body Container */}
        <main className="flex-1 p-6 md:p-8 pt-24 md:pt-8 max-w-7xl w-full mx-auto flex flex-col relative">
          <Outlet />
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}
