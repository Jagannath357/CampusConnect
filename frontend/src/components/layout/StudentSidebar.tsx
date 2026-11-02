import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users2,
  HelpCircle,
  BookOpen,
  Search,
  Calendar,
  Compass,
  Briefcase,
  AlertOctagon,
  Bell,
  User,
} from 'lucide-react';
import { cn } from '../../utils/cn';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navItems = [
  { label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
  { label: 'Teammate Finder', to: '/collaborations', icon: Users2 },
  { label: 'Academic Q&A', to: '/questions', icon: HelpCircle },
  { label: 'Study Resources', to: '/resources', icon: BookOpen },
  { label: 'Lost and Found', to: '/lost-found', icon: Search },
  { label: 'Campus Events', to: '/events', icon: Calendar },
  { label: 'Club Discovery', to: '/clubs', icon: Compass },
  { label: 'Placements', to: '/placements', icon: Briefcase },
  { label: 'Submit Grievance', to: '/grievance/submit', icon: AlertOctagon },
  { label: 'Notifications', to: '/notifications', icon: Bell },
  { label: 'My Profile', to: '/profile', icon: User },
];

export const StudentSidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Panel */}
      <aside
        className={cn(
          'fixed top-16 left-0 bottom-0 z-40 w-64 bg-white dark:bg-slate-900 border-r border-slate-200/80 dark:border-slate-800 p-4 overflow-y-auto transition-all duration-200 ease-in-out lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="space-y-1">
          <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
            Student Portal
          </p>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={({ isActive }) =>
                  cn(
                    'flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all',
                    isActive
                      ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-slate-800/60'
                  )
                }
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </div>

        {/* Portal Information Card */}
        <div className="mt-8 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 text-center">
          <p className="text-[11px] font-extrabold text-slate-700 dark:text-slate-200">Silicon University</p>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Bhubaneswar Campus Portal</p>
          <p className="text-[9px] text-indigo-600 dark:text-indigo-400 font-semibold mt-1">v1.0 Production Ready</p>
        </div>
      </aside>
    </>
  );
};

