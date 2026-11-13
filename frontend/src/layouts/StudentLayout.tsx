import React, { useState, useRef, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { StudentSidebar } from '../components/layout/StudentSidebar';
import { EmergencyBanner } from '../components/common/EmergencyBanner';
import { Footer } from '../components/layout/Footer';

export const StudentLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);
  const [headerHeight, setHeaderHeight] = useState(64);

  useEffect(() => {
    const updateHeaderHeight = () => {
      if (headerRef.current) {
        setHeaderHeight(headerRef.current.offsetHeight);
      }
    };
    updateHeaderHeight();

    const observer = new ResizeObserver(updateHeaderHeight);
    if (headerRef.current) {
      observer.observe(headerRef.current);
    }
    window.addEventListener('resize', updateHeaderHeight);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateHeaderHeight);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors w-full max-w-full overflow-x-hidden">
      <div ref={headerRef} className="sticky top-0 z-30 flex flex-col w-full shadow-xs">
        <EmergencyBanner />
        <Navbar onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} isSidebarOpen={isSidebarOpen} />
      </div>

      <div className="flex-1 flex w-full max-w-full min-w-0 overflow-x-hidden">
        <StudentSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} headerHeight={headerHeight} />

        <main className="flex-1 flex flex-col min-w-0 w-full max-w-full overflow-x-hidden">
          <div className="flex-1 p-3 sm:p-5 lg:p-8 max-w-7xl w-full mx-auto min-w-0">
            <Outlet />
          </div>
          <Footer />
        </main>
      </div>
    </div>
  );
};

