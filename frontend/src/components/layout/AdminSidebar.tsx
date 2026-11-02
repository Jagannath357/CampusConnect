import React from 'react';
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
} from 'lucide-react';
import { cn } from '../../utils/cn';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const adminNavItems = [
  { label: 'Admin Dashboard', to: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Student Auditing', to: '/admin/students', icon: Users },
  { label: 'Suspension & Safety', to: '/admin/suspensions', icon: UserX },
  { label: 'Content Moderation', to: '/admin/moderation', icon: ShieldAlert },
  { label: 'Lost & Found Claims', to: '/admin/lost-found', icon: FileCheck2 },
  { label: 'Official Events', to: '/admin/events', icon: CalendarCheck },
  { label: 'Emergency Broadcast', to: '/admin/emergency', icon: Radio },
  { label: 'Grievance Routing', to: '/admin/grievances', icon: Inbox },
  { label: 'Club Governance', to: '/admin/clubs', icon: Award },
  { label: 'Placement Drives', to: '/admin/placements', icon: Briefcase },
  { label: 'Live Analytics', to: '/admin/analytics', icon: BarChart3 },
  { label: 'System Configuration', to: '/admin/configuration', icon: Sliders },
  { label: 'Audit Logs', to: '/admin/audit-logs', icon: ClipboardList },
];

export const AdminSidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          'fixed top-16 left-0 bottom-0 z-40 w-64 bg-slate-900 border-r border-slate-800 p-4 overflow-y-auto transition-transform duration-200 ease-in-out lg:translate-x-0 text-slate-300',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="space-y-1">
          <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
            Administration Console
          </p>
          {adminNavItems.map((item) => {
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
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  )
                }
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </div>

        <div className="mt-8 p-3 rounded-xl bg-slate-800/80 border border-slate-700/60 text-center">
          <span className="inline-block text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
            ADMIN LEVEL ACCESS
          </span>
          <p className="text-[10px] text-slate-400 mt-1">Actions are logged in the audit registry</p>
        </div>
      </aside>
    </>
  );
};

