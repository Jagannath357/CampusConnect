import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, ShieldCheck, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-slate-200/80 py-8 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <div className="flex items-center space-x-2">
          <GraduationCap className="w-4 h-4 text-indigo-600" />
          <span className="font-bold text-slate-800">CampusConnect Portal</span>
          <span>•</span>
          <span>Silicon University, Bhubaneswar</span>
        </div>

        <div className="flex items-center space-x-6">
          <Link to="/grievance/submit" className="hover:text-indigo-600 transition-colors">
            Anonymous Grievance
          </Link>
          <Link to="/grievance/track" className="hover:text-indigo-600 transition-colors">
            Ticket Tracking
          </Link>
          <span className="flex items-center space-x-1 text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Single-Campus Prototype</span>
          </span>
        </div>

        <p className="text-slate-400">
          © {new Date().getFullYear()} Silicon University. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

