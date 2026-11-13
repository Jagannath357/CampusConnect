import React, { useEffect } from 'react';
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
  X,
  GraduationCap,
  Sparkles,
} from 'lucide-react';
import { cn } from '../../utils/cn';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  headerHeight?: number;
}

const navItems = [
  { label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard, color: 'text-indigo-600 dark:text-indigo-400' },
  { label: 'Teammate Finder', to: '/collaborations', icon: Users2, color: 'text-sky-600 dark:text-sky-400' },
  { label: 'Academic Q&A', to: '/questions', icon: HelpCircle, color: 'text-amber-600 dark:text-amber-400' },
  { label: 'Study Resources', to: '/resources', icon: BookOpen, color: 'text-emerald-600 dark:text-emerald-400' },
  { label: 'Lost and Found', to: '/lost-found', icon: Search, color: 'text-amber-600 dark:text-amber-400' },
  { label: 'Campus Events', to: '/events', icon: Calendar, color: 'text-purple-600 dark:text-purple-400' },
  { label: 'Club Discovery', to: '/clubs', icon: Compass, color: 'text-violet-600 dark:text-violet-400' },
  { label: 'Placements', to: '/placements', icon: Briefcase, color: 'text-teal-600 dark:text-teal-400' },
  { label: 'Submit Grievance', to: '/grievance/submit', icon: AlertOctagon, color: 'text-rose-600 dark:text-rose-400' },
  { label: 'Notifications', to: '/notifications', icon: Bell, color: 'text-blue-600 dark:text-blue-400' },
  { label: 'My Profile', to: '/profile', icon: User, color: 'text-indigo-600 dark:text-indigo-400' },
];

export const StudentSidebar: React.FC<SidebarProps> = ({ isOpen, onClose, headerHeight = 64 }) => {
  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const renderNavLinks = (onItemClick?: () => void) => (
    <div className="space-y-1">
      <div className="px-3 pb-1.5 flex items-center justify-between">
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 dark:text-slate-400">
          Student Portal
        </span>
        <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-800 flex items-center gap-1">
          <Sparkles className="w-2.5 h-2.5 text-indigo-600 dark:text-indigo-400" />
          Active
        </span>
      </div>
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onItemClick}
            className={({ isActive }) =>
              cn(
                'group flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150',
                isActive
                  ? 'bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 font-bold shadow-xs border border-indigo-200/60 dark:border-indigo-800/80'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-slate-800/70'
              )
            }
          >
            {({ isActive }) => (
              <>
                <Icon
                  className={cn(
                    'w-4 h-4 flex-shrink-0 transition-transform group-hover:scale-110',
                    isActive ? item.color : 'text-slate-400 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200'
                  )}
                />
                <span className="flex-1 truncate">{item.label}</span>
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400" />
                )}
              </>
            )}
          </NavLink>
        );
      })}
    </div>
  );

  return (
    <>
      {/* 1. Desktop Docked Sidebar (Hidden on mobile, flex item on lg) */}
      <aside className="hidden lg:flex flex-col justify-between w-64 flex-shrink-0 border-r border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 h-full min-h-0 z-20 transition-colors duration-150">
        <div className="flex-1 overflow-y-auto pr-1 space-y-1 min-h-0">
          {renderNavLinks()}
        </div>

        {/* Desktop Institutional Badge pinned at bottom */}
        <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex-shrink-0">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-center">
            <p className="text-[11px] font-extrabold text-slate-800 dark:text-slate-200">Silicon University</p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Bhubaneswar Campus Portal</p>
            <div className="mt-1.5 flex items-center justify-center space-x-1.5 text-[9px] font-semibold text-emerald-700 dark:text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Single-Campus Prototype</span>
            </div>
          </div>
        </div>
      </aside>

      {/* 2. Mobile Responsive Sidebar Drawer (lg:hidden) */}
      {/* Mobile Dark Backdrop Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs lg:hidden transition-opacity duration-300"
          onClick={onClose}
          aria-label="Close sidebar backdrop"
        />
      )}

      {/* Mobile Sliding Drawer Panel */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] h-full bg-white dark:bg-slate-900 shadow-2xl flex flex-col lg:hidden transition-transform duration-300 ease-in-out border-r border-slate-200 dark:border-slate-800 min-h-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Drawer Header with Title & Cross Button */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-slate-100 dark:border-slate-800 flex-shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-indigo-700 via-indigo-600 to-indigo-500 flex items-center justify-center text-white shadow-xs">
              <GraduationCap className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-extrabold text-sm tracking-tight text-slate-900 dark:text-slate-100">CampusConnect</span>
                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 uppercase">
                  Silicon
                </span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Bhubaneswar Campus</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body - Scrollable navigation list */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1 min-h-0">
          {renderNavLinks(onClose)}
        </div>

        {/* Drawer Footer */}
        <div className="p-3.5 m-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-center flex-shrink-0">
          <p className="text-[11px] font-extrabold text-slate-800 dark:text-slate-200">Silicon University</p>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Bhubaneswar Campus Portal</p>
          <div className="mt-1 flex items-center justify-center space-x-1.5 text-[9px] font-semibold text-emerald-700 dark:text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            <span>v1.0 Production Ready</span>
          </div>
        </div>
      </aside>
    </>
  );
};
