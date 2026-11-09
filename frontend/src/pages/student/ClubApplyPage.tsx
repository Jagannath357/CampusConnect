import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ArrowLeft, ShieldCheck, Lock } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';

export const ClubApplyPage: React.FC = () => {
  return (
    <div className="max-w-xl mx-auto space-y-6 pt-6">
      <Link
        to="/clubs"
        className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Clubs
      </Link>

      <Card>
        <CardHeader className="text-center pb-2">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center mx-auto mb-3 shadow-xs">
            <Lock className="w-7 h-7" />
          </div>
          <CardTitle className="text-xl font-black text-slate-900 dark:text-slate-100">
            Administrative Club Chartering Only
          </CardTitle>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto leading-relaxed">
            Under Silicon University governance guidelines, students cannot register clubs directly. Only university administrators are authorized to establish official student clubs.
          </p>
        </CardHeader>

        <CardContent className="p-6 text-center space-y-4">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 leading-relaxed text-left">
            <p className="font-bold text-slate-800 dark:text-slate-200 mb-1 flex items-center">
              <ShieldCheck className="w-4 h-4 text-emerald-600 mr-1.5" /> Official Charter Policy
            </p>
            To propose a new student society, contact the Dean of Student Affairs or Central Administration. Once chartered, the club will be verified and published to the Student Club Discovery hub.
          </div>

          <Link to="/clubs">
            <Button variant="primary" size="sm" className="font-bold">
              <Compass className="w-4 h-4 mr-1.5" /> Explore Active Clubs
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
};
export default ClubApplyPage;
