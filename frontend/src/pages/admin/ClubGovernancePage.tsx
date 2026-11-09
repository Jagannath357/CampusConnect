import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { StatusBadge } from '../../components/common/StatusBadge';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { EmptyState } from '../../components/common/EmptyState';
import { 
  Users, 
  CheckCircle2, 
  XCircle, 
  ShieldCheck, 
  FileCheck2, 
  AlertCircle, 
  Mail, 
  UserCheck, 
  Building,
  Sparkles
} from 'lucide-react';

interface ClubApp {
  _id: string;
  clubName: string;
  category: string;
  description: string;
  objectives: string;
  proposedLeadStudentId: {
    _id: string;
    name: string;
    email: string;
  };
  proposedLeadStudentName: string;
  contactEmail: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  reviewNotes?: string;
  createdAt: string;
}

interface VerifiedClub {
  _id: string;
  name: string;
  code: string;
  category: string;
  description: string;
  leadStudentId?: {
    _id: string;
    name: string;
    email: string;
  };
  leadStudentName: string;
  contactEmail: string;
  isVerified: boolean;
  membershipInfo?: string;
  createdAt: string;
}

export const ClubGovernancePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'applications' | 'clubs'>('applications');
  const [applications, setApplications] = useState<ClubApp[]>([]);
  const [verifiedClubs, setVerifiedClubs] = useState<VerifiedClub[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Review Modal state
  const [selectedApp, setSelectedApp] = useState<ClubApp | null>(null);
  const [reviewAction, setReviewAction] = useState<'APPROVED' | 'REJECTED'>('APPROVED');
  const [reviewNotes, setReviewNotes] = useState('');
  const [processing, setProcessing] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get('/admin/clubs/applications?status=ALL');
      if (res.data.success) {
        setApplications(res.data.data.applications || []);
        setVerifiedClubs(res.data.data.verifiedClubs || []);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load club governance data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenReview = (app: ClubApp, action: 'APPROVED' | 'REJECTED') => {
    setSelectedApp(app);
    setReviewAction(action);
    setReviewNotes('');
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedApp) return;

    try {
      setProcessing(true);
      setError(null);
      setSuccess(null);

      const res = await api.post(`/admin/clubs/applications/${selectedApp._id}/review`, {
        status: reviewAction,
        reviewNotes: reviewNotes.trim() || undefined,
      });

      if (res.data.success) {
        setSuccess(
          `Application for "${selectedApp.clubName}" marked as ${reviewAction}.`
        );
        setSelectedApp(null);
        fetchData();
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit review.');
    } finally {
      setProcessing(false);
    }
  };

  const pendingApps = applications.filter((a) => a.status === 'PENDING');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white rounded-xl p-6 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-teal-200">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                Student Organization & Club Governance
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-teal-500/30 text-teal-100 border border-teal-400/30">
                  Module 19
                </span>
              </h1>
              <p className="text-sm text-teal-100/80">
                Review charter applications, authorize student leadership, and verify active campus organizations.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-300 rounded-lg text-sm text-red-800 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-600" />
          <span>{error}</span>
        </div>
      )}
      {success && (
        <div className="p-4 bg-green-50 border border-green-300 rounded-lg text-sm text-green-800 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-green-600" />
          <span>{success}</span>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200 pb-3">
        <button
          onClick={() => setActiveTab('applications')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
            activeTab === 'applications'
              ? 'bg-emerald-700 text-white shadow-sm'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <FileCheck2 className="w-4 h-4" />
          Charter Applications
          {pendingApps.length > 0 && (
            <span className="ml-1 text-xs bg-emerald-500 text-white px-2 py-0.5 rounded-full font-bold">
              {pendingApps.length} pending
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('clubs')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
            activeTab === 'clubs'
              ? 'bg-emerald-700 text-white shadow-sm'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Building className="w-4 h-4" />
          Verified Campus Clubs ({verifiedClubs.length})
        </button>
      </div>

      {loading ? (
        <div className="py-16 text-center">
          <LoadingSpinner />
          <p className="text-sm text-gray-500 mt-2">Loading club data...</p>
        </div>
      ) : activeTab === 'applications' ? (
        /* Applications List */
        applications.length === 0 ? (
          <EmptyState
            title="No Charter Applications"
            description="There are currently no student club charter applications awaiting administrative review."
          />
        ) : (
          <div className="space-y-4">
            {applications.map((app) => (
              <Card
                key={app._id}
                className={`border transition-all ${
                  app.status === 'PENDING' ? 'border-amber-300 bg-amber-50/20 shadow-sm' : 'border-gray-200'
                }`}
              >
                <CardHeader className="p-5 pb-3 border-b flex flex-col md:flex-row md:items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-bold text-gray-900">{app.clubName}</h3>
                      <span className="text-xs bg-gray-100 text-gray-700 font-semibold px-2.5 py-0.5 rounded-full border">
                        {app.category}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Submitted on {new Date(app.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <StatusBadge status={app.status} />
                </CardHeader>

                <CardContent className="p-5 space-y-4">
                  <div>
                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                      Description & Scope
                    </h4>
                    <p className="text-sm text-gray-700 dark:text-slate-200">{app.description}</p>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                      Charter Objectives & Mission
                    </h4>
                    <p className="text-sm text-gray-700 dark:text-slate-200 bg-gray-50 dark:bg-slate-900/80 p-3 rounded-lg border border-gray-200 dark:border-slate-800">
                      {app.objectives}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs bg-slate-50 dark:bg-slate-900/80 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-2 text-gray-700 dark:text-slate-300">
                      <UserCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      <span>
                        <strong>Proposed Lead:</strong> {app.proposedLeadStudentName} ({app.proposedLeadStudentId?.email})
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700 dark:text-slate-300">
                      <Mail className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      <span>
                        <strong>Contact Email:</strong> {app.contactEmail}
                      </span>
                    </div>
                  </div>

                  {app.reviewNotes && (
                    <div className="text-xs p-3 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 rounded text-blue-900 dark:text-blue-200">
                      <strong>Admin Review Notes:</strong> {app.reviewNotes}
                    </div>
                  )}

                  {app.status === 'PENDING' && (
                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenReview(app, 'REJECTED')}
                        className="text-red-600 border-red-200 hover:bg-red-50 text-xs"
                      >
                        <XCircle className="w-3.5 h-3.5 mr-1" />
                        Reject Charter
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleOpenReview(app, 'APPROVED')}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                        Approve & Grant Charter
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )
      ) : (
        /* Verified Clubs List */
        verifiedClubs.length === 0 ? (
          <EmptyState
            title="No Verified Clubs"
            description="No student clubs have been officially verified yet."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {verifiedClubs.map((club) => (
              <Card key={club._id} className="border-gray-200 dark:border-slate-800 shadow-sm hover:border-emerald-300 dark:hover:border-emerald-600 transition-all flex flex-col justify-between">
                <CardHeader className="p-4 pb-2 border-b border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-900/70">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-900 dark:text-emerald-300 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                      {club.code}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                      <ShieldCheck className="w-3 h-3" />
                      Verified
                    </span>
                  </div>
                  <h3 className="font-bold text-base text-gray-900 dark:text-slate-100 mt-2">{club.name}</h3>
                  <span className="text-xs text-gray-500 dark:text-slate-400 font-medium">{club.category}</span>
                </CardHeader>
                <CardContent className="p-4 flex-1 flex flex-col justify-between space-y-4">
                  <p className="text-sm text-gray-600 dark:text-slate-300 line-clamp-3 leading-relaxed">
                    {club.description}
                  </p>

                  <div className="pt-2 border-t border-gray-100 dark:border-slate-800 text-xs text-gray-500 dark:text-slate-400 space-y-1">
                    <p className="flex items-center gap-1.5">
                      <UserCheck className="w-3.5 h-3.5 text-gray-400" />
                      <span>Lead: <strong className="text-gray-700 dark:text-slate-200">{club.leadStudentName}</strong></span>
                    </p>
                    <p className="flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-gray-400" />
                      <span className="text-gray-600 dark:text-slate-300">{club.contactEmail}</span>
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )
      )}

      {/* Review Dialog */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-slate-800 p-6 space-y-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-slate-100">
              {reviewAction === 'APPROVED' ? 'Approve & Verify Organization' : 'Reject Charter Application'}
            </h3>
            <p className="text-sm text-gray-600 dark:text-slate-300">
              {reviewAction === 'APPROVED'
                ? `You are granting official university recognition to "${selectedApp.clubName}". An official club profile and verified status will be generated automatically.`
                : `Specify why the application for "${selectedApp.clubName}" does not meet university charter criteria.`}
            </p>

            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 uppercase mb-1">
                  Administrative Notes / Feedback
                </label>
                <Textarea
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  placeholder={
                    reviewAction === 'APPROVED'
                      ? 'e.g., Charter approved under Silicon University Student Activity Centre.'
                      : 'e.g., Objectives overlap with existing Coding Club; provide revised charter.'
                  }
                  rows={3}
                  required={reviewAction === 'REJECTED'}
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setSelectedApp(null)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={processing}
                  className={
                    reviewAction === 'APPROVED'
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      : 'bg-red-600 hover:bg-red-700 text-white'
                  }
                >
                  {processing ? 'Processing...' : `Confirm ${reviewAction}`}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

