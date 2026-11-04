import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  UserX,
  FileCheck2,
  CalendarCheck,
  Radio,
  Inbox,
  Award,
  Briefcase,
  BarChart3,
  Sliders,
  ShieldAlert,
  ClipboardList,
  X,
  ShieldCheck,
  Lock,
} from 'lucide-react';
import { cn } from '../../utils/cn';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const adminNavItems = [
  { label: 'Admin Dashboard', to: '/admin/dashboard', icon: LayoutDashboard, color: 'text-indigo-400' },
  { label: 'Student Auditing', to: '/admin/students', icon: Users, color: 'text-sky-400' },
  { label: 'Suspension & Safety', to: '/admin/suspensions', icon: UserX, color: 'text-rose-400' },
  { label: 'Content Moderation', to: '/admin/moderation', icon: ShieldAlert, color: 'text-amber-400' },
  { label: 'Lost & Found Claims', to: '/admin/lost-found', icon: FileCheck2, color: 'text-amber-400' },
  { label: 'Official Events', to: '/admin/events', icon: CalendarCheck, color: 'text-purple-400' },
  { label: 'Emergency Broadcast', to: '/admin/emergency', icon: Radio, color: 'text-rose-400' },
  { label: 'Grievance Routing', to: '/admin/grievances', icon: Inbox, color: 'text-cyan-400' },
  { label: 'Club Governance', to: '/admin/clubs', icon: Award, color: 'text-violet-400' },
  { label: 'Placement Drives', to: '/admin/placements', icon: Briefcase, color: 'text-teal-400' },
  { label: 'Live Analytics', to: '/admin/analytics', icon: BarChart3, color: 'text-emerald-400' },
  { label: 'System Configuration', to: '/admin/configuration', icon: Sliders, color: 'text-blue-400' },
  { label: 'Audit Logs', to: '/admin/audit-logs', icon: ClipboardList, color: 'text-slate-400' },
];

export const AdminSidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
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
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
          Administration Console
        </span>
        <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-rose-950/80 text-rose-300 border border-rose-800/80 flex items-center gap-1">
          <Lock className="w-2.5 h-2.5 text-rose-400" />
          Admin RBAC
        </span>
      </div>

      {adminNavItems.map((item) => {
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
                  ? 'bg-indigo-600/20 text-indigo-300 font-bold border border-indigo-500/30 shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
              )
            }
          >
            {({ isActive }) => (
              <>
                <Icon
                  className={cn(
                    'w-4 h-4 flex-shrink-0 transition-transform group-hover:scale-110',
                    isActive ? item.color : 'text-slate-400 group-hover:text-slate-200'
                  )}
                />
                <span className="flex-1 truncate">{item.label}</span>
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
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
      <aside className="hidden lg:flex flex-col w-64 flex-shrink-0 border-r border-slate-800 bg-slate-900 p-4 sticky top-16 self-start max-h-[calc(100vh-4rem)] overflow-y-auto text-slate-300 transition-colors">
        <div className="flex-1">
          {renderNavLinks()}
        </div>

        {/* Desktop Institutional Badge */}
        <div className="mt-6 p-3.5 rounded-xl bg-slate-800/70 border border-slate-700/60 text-center">
          <p className="text-[11px] font-extrabold text-slate-200">Silicon University</p>
          <p className="text-[10px] text-slate-400 mt-0.5">Central Admin Portal</p>
          <div className="mt-1.5 flex items-center justify-center space-x-1.5 text-[9px] font-semibold text-rose-400">
            <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse" />
            <span>Admin Level Access</span>
          </div>
        </div>
      </aside>

      {/* 2. Mobile Responsive Sidebar Drawer (lg:hidden) */}
      {/* Mobile Dark Backdrop Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs lg:hidden transition-opacity duration-300"
          onClick={onClose}
          aria-label="Close sidebar backdrop"
        />
      )}

      {/* Mobile Sliding Drawer Panel */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] bg-slate-900 shadow-2xl flex flex-col lg:hidden transition-transform duration-300 ease-in-out border-r border-slate-800 text-slate-300',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Drawer Header with Title & Cross Button */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-slate-800">
          <div className="flex items-center space-x-2.5">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-indigo-700 via-indigo-600 to-indigo-500 flex items-center justify-center text-white shadow-xs">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-extrabold text-sm tracking-tight text-white">CampusConnect</span>
                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-indigo-950/80 text-indigo-300 border border-indigo-800 uppercase">
                  Admin
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium">Silicon University Console</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body - Scrollable navigation list */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          {renderNavLinks(onClose)}
        </div>

        {/* Drawer Footer */}
        <div className="p-3.5 m-3 rounded-xl bg-slate-800/70 border border-slate-700/60 text-center">
          <p className="text-[11px] font-extrabold text-slate-200">Silicon University</p>
          <p className="text-[10px] text-slate-400 mt-0.5">Central Admin Portal</p>
          <div className="mt-1 flex items-center justify-center space-x-1.5 text-[9px] font-semibold text-rose-400">
            <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
            <span>Admin Level Access</span>
          </div>
        </div>
      </aside>
    </>
  );
};
