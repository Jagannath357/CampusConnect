import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useNotifications } from '../../contexts/NotificationContext';
import { getFileUrl } from '../../utils/url';
import { ThemeToggle } from '../common/ThemeToggle';
import {
  Bell,
  LogOut,
  User as UserIcon,
  Menu,
  X,
  GraduationCap,
  Shield,
  ExternalLink,
} from 'lucide-react';

interface NavbarProps {
  onToggleSidebar?: () => void;
  isSidebarOpen?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar, isSidebarOpen }) => {
  const { user, profile, logout, isAuthenticated, isAdmin } = useAuth();
  const { unreadCount, emergencyAlert } = useNotifications();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 shadow-xs transition-colors">
      <div className="flex items-center justify-between px-4 sm:px-6 h-16 max-w-7xl mx-auto">
        {/* Left: Mobile Toggle & Brand Identity */}
        <div className="flex items-center space-x-3">
          {isAuthenticated && onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
              aria-label={isSidebarOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
            >
              {isSidebarOpen ? (
                <X className="w-6 h-6 text-indigo-600 dark:text-indigo-400 transition-transform duration-200" />
              ) : (
                <Menu className="w-6 h-6 transition-transform duration-200" />
              )}
            </button>
          )}

          <Link to="/" className="flex items-center space-x-2.5 group">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-700 via-indigo-600 to-indigo-500 flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-slate-100">CampusConnect</span>
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 uppercase">
                  Silicon
                </span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium hidden sm:block">Silicon University, Bhubaneswar</p>
            </div>
          </Link>
        </div>

        {/* Right: Actions, Notifications, Theme Toggle & User */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Theme Toggle Button */}
          <ThemeToggle />

          {isAuthenticated ? (
            <>
              {/* Emergency indicator if active */}
              {emergencyAlert?.active && (
                <div className="hidden md:flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900/80 text-rose-700 dark:text-rose-300 text-xs font-semibold animate-pulse">
                  <span className="h-2 w-2 rounded-full bg-rose-600 dark:bg-rose-500" />
                  <span>Emergency Active</span>
                </div>
              )}

              {/* Notification Bell */}
              <Link
                to={isAdmin ? '/admin/notifications' : '/notifications'}
                className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Notifications"
                aria-label="Campus Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 flex items-center justify-center min-w-4.5 h-4.5 px-1 rounded-full bg-indigo-600 text-[10px] font-bold text-white shadow-xs">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </Link>

              {/* Profile dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center space-x-2 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none"
                >
                  {profile?.avatarUrl ? (
                    <img
                      src={getFileUrl(profile.avatarUrl)}
                      alt={user?.name}
                      className="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold flex items-center justify-center text-xs">
                      {user?.name?.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="hidden md:block text-left pr-1">
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-none truncate max-w-28">{user?.name}</p>
                    <p className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-0.5">
                      {user?.role}
                    </p>
                  </div>
                </button>

                {isProfileMenuOpen && (
                  <div
                    className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-slate-900 shadow-xl border border-slate-100 dark:border-slate-800 py-1.5 z-50 animate-in fade-in zoom-in-95"
                    onClick={() => setIsProfileMenuOpen(false)}
                  >
                    <div className="px-4 py-2.5 border-b border-slate-100 dark:border-slate-800">
                      <p className="text-xs font-bold text-slate-900 dark:text-slate-100">{user?.name}</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{user?.email}</p>
                      <span className="inline-block mt-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {user?.role === 'ADMIN' ? 'University Administrator' : `${profile?.department || 'Student'} • Batch ${profile?.batchYear || ''}`}
                      </span>
                    </div>

                    {!isAdmin && (
                      <Link
                        to="/profile"
                        className="flex items-center space-x-2.5 px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                      >
                        <UserIcon className="w-4 h-4" />
                        <span>My Academic Profile</span>
                      </Link>
                    )}

                    {isAdmin && (
                      <Link
                        to="/admin/dashboard"
                        className="flex items-center space-x-2.5 px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                      >
                        <Shield className="w-4 h-4" />
                        <span>Admin Console</span>
                      </Link>
                    )}

                    <Link
                      to={isAdmin ? '/admin/notifications' : '/notifications'}
                      className="flex items-center space-x-2.5 px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                    >
                      <Bell className="w-4 h-4" />
                      <span>Notifications Center</span>
                      {unreadCount > 0 && (
                        <span className="ml-auto px-1.5 py-0.2 rounded-full bg-indigo-600 text-white text-[10px] font-bold">
                          {unreadCount}
                        </span>
                      )}
                    </Link>

                    <div className="border-t border-slate-100 dark:border-slate-800 my-1" />

                    <button
                      onClick={logout}
                      className="w-full flex items-center space-x-2.5 px-4 py-2 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Log Out</span>
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center space-x-2">
              <Link
                to="/grievance/submit"
                className="text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Anonymous Grievance
              </Link>
              <Link
                to="/login"
                className="text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors shadow-xs"
              >
                Sign In
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

