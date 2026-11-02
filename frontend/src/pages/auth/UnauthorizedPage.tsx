import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldX, ArrowLeft } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { ThemeToggle } from '../../components/common/ThemeToggle';

export const UnauthorizedPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-center items-center px-4 text-center transition-colors relative">
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6">
        <ThemeToggle />
      </div>

      <div className="p-4 rounded-3xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 mb-6">
        <ShieldX className="w-16 h-16 stroke-[1.5]" />
      </div>
      <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">403 - Access Denied</h1>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 max-w-md">
        You do not have the administrative authorization required to view or execute actions on this resource.
        This access attempt has been noted.
      </p>
      <div className="mt-6 flex items-center space-x-3">
        <Link to="/dashboard">
          <Button variant="primary">
            <ArrowLeft className="w-4 h-4 mr-1.5" /> Return to Student Portal
          </Button>
        </Link>
        <Link to="/">
          <Button variant="outline">Portal Home</Button>
        </Link>
      </div>
    </div>
  );
};

