import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { StudentSidebar } from '../components/layout/StudentSidebar';
import { EmergencyBanner } from '../components/common/EmergencyBanner';
import { Footer } from '../components/layout/Footer';

export const StudentLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      <div className="sticky top-0 z-30 flex flex-col w-full shadow-xs">
        <EmergencyBanner />
        <Navbar onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} isSidebarOpen={isSidebarOpen} />
      </div>

      <div className="flex-1 flex w-full">
        <StudentSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

        <main className="flex-1 flex flex-col min-w-0">
          <div className="flex-1 p-3.5 sm:p-5 lg:p-8 max-w-7xl w-full mx-auto">
            <Outlet />
          </div>
          <Footer />
        </main>
      </div>
    </div>
  );
};

