import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../services/api';
import { Club } from '../../types';
import { Compass, ArrowLeft, ShieldCheck, Mail, User, BookOpen } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

export const ClubDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [club, setClub] = useState<Club | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClub = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/clubs/${id}`);
        if (res.data.success) {
          setClub(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load club', err);
      } finally {
        setLoading(false);
      }
    };

    fetchClub();
  }, [id]);

  if (loading) {
    return <LoadingSpinner size="lg" className="h-64" />;
  }

  if (!club) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-bold text-slate-800">Club not found</h2>
        <Link to="/clubs" className="text-xs text-indigo-600 mt-2 inline-block">
          Return to club directory
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link
        to="/clubs"
        className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Clubs
      </Link>

      <Card>
        <CardContent className="p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-xs font-extrabold uppercase bg-indigo-50 text-indigo-700 border border-indigo-200 px-3 py-1 rounded-full">
                  {club.category}
                </span>
                <span className="flex items-center text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  <ShieldCheck className="w-3.5 h-3.5 mr-1 text-emerald-600" /> Officially Verified
                </span>
              </div>
              <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100">{club.name}</h1>
              <p className="text-xs font-mono font-bold text-slate-400 mt-0.5">Code: {club.code}</p>
            </div>

            <a href={`mailto:${club.contactEmail}`}>
              <Button variant="primary" size="sm">
                <Mail className="w-4 h-4 mr-1.5" /> Contact Club Leadership
              </Button>
            </a>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400 mb-2">About the Organization</h3>
            <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed whitespace-pre-wrap">{club.description}</p>
          </div>

          {club.membershipInfo && (
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400 block">
                Official Membership Pathways & Schedule
              </span>
              <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed">{club.membershipInfo}</p>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700 text-xs">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400">Student Coordinator</span>
              <p className="text-sm font-bold text-slate-800 dark:text-slate-100 mt-0.5">{club.leadStudentName}</p>
              <p className="text-slate-500 dark:text-slate-400 mt-0.5">{club.leadStudentId?.email}</p>
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400">Official Club Inquiries</span>
              <p className="text-sm font-bold text-indigo-700 dark:text-indigo-400 mt-0.5">{club.contactEmail}</p>
              <p className="text-slate-500 dark:text-slate-400 mt-0.5">Silicon University Campus</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

