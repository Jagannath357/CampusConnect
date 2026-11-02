import React from 'react';
import { Link } from 'react-router-dom';
import { UserX, Mail, ArrowLeft, LogOut } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { useAuth } from '../../contexts/AuthContext';
import { ThemeToggle } from '../../components/common/ThemeToggle';

export const SuspendedPage: React.FC = () => {
  const { logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-center items-center px-4 text-center transition-colors relative">
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6">
        <ThemeToggle />
      </div>

      <div className="p-5 rounded-3xl bg-rose-100/70 dark:bg-rose-950/60 border-2 border-rose-300 dark:border-rose-900 text-rose-600 dark:text-rose-400 mb-6 shadow-sm">
        <UserX className="w-16 h-16 stroke-[1.5]" />
      </div>

      <span className="text-xs font-black px-3 py-1 rounded-full bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-800 uppercase tracking-wider mb-2">
        ACCOUNT SUSPENDED
      </span>

      <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Access Revoked by Administration</h1>

      <div className="mt-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm max-w-lg text-left text-xs sm:text-sm text-slate-600 dark:text-slate-300 space-y-3">
        <p className="font-semibold text-slate-800 dark:text-slate-100">
          Your Silicon University CampusConnect portal privileges have been temporarily suspended following an administrative governance review.
        </p>
        <p className="text-slate-500 dark:text-slate-400">
          • All active authenticated sessions, browser tokens, and WebSocket connections have been immediately invalidated in accordance with university guideline enforcement.
        </p>
        <p className="text-slate-500 dark:text-slate-400">
          • You will not be permitted to register for events, publish collaborations, submit resources, or interact with student forums during the suspension period.
        </p>
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center space-x-2 text-slate-700 dark:text-slate-300">
          <Mail className="w-4 h-4 text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
          <span>For appeals, contact: <strong>disciplinary@silicon.ac.in</strong></span>
        </div>
      </div>

      <div className="mt-6 flex items-center space-x-3">
        <Button variant="danger" onClick={logout}>
          <LogOut className="w-4 h-4 mr-1.5" /> Log Out
        </Button>
        <Link to="/">
          <Button variant="outline">
            <ArrowLeft className="w-4 h-4 mr-1.5" /> University Home
          </Button>
        </Link>
      </div>
    </div>
  );
};

