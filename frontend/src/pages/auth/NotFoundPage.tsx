import React from 'react';
import { Link } from 'react-router-dom';
import { FileQuestion, ArrowLeft } from 'lucide-react';
import { Button } from '../../components/ui/button';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center px-4 text-center">
      <div className="p-4 rounded-3xl bg-slate-100 border border-slate-200 text-slate-400 mb-6">
        <FileQuestion className="w-16 h-16 stroke-[1.5]" />
      </div>
      <h1 className="text-4xl font-black text-slate-900 tracking-tight">404 - Page Not Found</h1>
      <p className="mt-2 text-sm text-slate-500 max-w-sm">
        The requested university portal destination does not exist or may have been relocated.
      </p>
      <div className="mt-6">
        <Link to="/">
          <Button variant="primary">
            <ArrowLeft className="w-4 h-4 mr-1.5" /> Return to CampusConnect
          </Button>
        </Link>
      </div>
    </div>
  );
};

