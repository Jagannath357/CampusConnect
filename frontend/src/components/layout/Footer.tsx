import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, ShieldCheck, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-slate-200/80 dark:border-slate-800 py-8 px-4 sm:px-6 transition-colors">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center space-x-2">
          <GraduationCap className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <span className="font-bold text-slate-800 dark:text-slate-200">CampusConnect Portal</span>
          <span>•</span>
          <span>Silicon University, Bhubaneswar</span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6">
          <Link to="/grievance/submit" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
            Anonymous Grievance
          </Link>
          <Link to="/grievance/track" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
            Ticket Tracking
          </Link>
          <span className="flex items-center space-x-1 text-slate-400 dark:text-slate-500">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Single-Campus Prototype</span>
          </span>
        </div>

        <p className="text-slate-400 dark:text-slate-500">
          © {new Date().getFullYear()} Silicon University. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

