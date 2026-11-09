import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Dialog } from '../../components/ui/dialog';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
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
  Plus,
  Trash2,
  ExternalLink,
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
  const [activeTab, setActiveTab] = useState<'applications' | 'clubs'>('clubs');
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

  // Create Club Modal state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [clubToDelete, setClubToDelete] = useState<VerifiedClub | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [clubForm, setClubForm] = useState({
    name: '',
    code: '',
    category: 'TECHNICAL',
    description: '',
    contactEmail: '',
    leadStudentName: '',
    membershipInfo: '',
  });
  const [submittingClub, setSubmittingClub] = useState(false);

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

  const handleCreateClub = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clubForm.name.trim() || !clubForm.description.trim() || !clubForm.contactEmail.trim()) {
      setError('Please provide club name, description, and official contact email.');
      return;
    }

    try {
      setSubmittingClub(true);
      setError(null);
      setSuccess(null);

      const res = await api.post('/admin/clubs', {
        name: clubForm.name.trim(),
        code: clubForm.code.trim() || undefined,
        category: clubForm.category,
        description: clubForm.description.trim(),
        contactEmail: clubForm.contactEmail.trim(),
        leadStudentName: clubForm.leadStudentName.trim() || undefined,
        membershipInfo: clubForm.membershipInfo.trim() || undefined,
      });

      if (res.data.success) {
        setSuccess(`Club "${res.data.data.name}" chartered and verified successfully!`);
        setIsCreateModalOpen(false);
        setClubForm({
          name: '',
          code: '',
          category: 'TECHNICAL',
          description: '',
          contactEmail: '',
          leadStudentName: '',
          membershipInfo: '',
        });
        await fetchData();
        setActiveTab('clubs');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create new club.');
    } finally {
      setSubmittingClub(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!clubToDelete) return;

    try {
      setIsDeleting(true);
      setError(null);
      setSuccess(null);

      const res = await api.delete(`/admin/clubs/${clubToDelete._id}`);
      if (res.data.success) {
        setSuccess(`Club "${clubToDelete.name}" removed from registry.`);
        setClubToDelete(null);
        await fetchData();
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to remove club.');
    } finally {
      setIsDeleting(false);
    }
  };

  const pendingApps = applications.filter((a) => a.status === 'PENDING');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white rounded-2xl p-6 shadow-md border border-emerald-700/50">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-teal-200 shadow-xs">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <span>Student Organization & Club Governance</span>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-teal-500/30 text-teal-100 border border-teal-400/30">
                  Module 19
                </span>
              </h1>
              <p className="text-sm text-teal-100/80 mt-0.5">
                Charter new campus clubs, review applications, and manage verified student organizations.
              </p>
            </div>
          </div>

          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-xs shadow-md border border-emerald-400/60 flex items-center self-start md:self-center"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Create New Club
          </Button>
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <div className="p-4 bg-red-50 dark:bg-rose-950/70 border border-red-300 dark:border-rose-800 rounded-xl text-sm text-red-800 dark:text-rose-200 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-600 dark:text-rose-400" />
          <span>{error}</span>
        </div>
      )}
      {success && (
        <div className="p-4 bg-green-50 dark:bg-emerald-950/70 border border-green-300 dark:border-emerald-800 rounded-xl text-sm text-green-800 dark:text-emerald-200 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-green-600 dark:text-emerald-400" />
          <span>{success}</span>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200 dark:border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('clubs')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'clubs'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800'
          }`}
        >
          <Building className="w-4 h-4" />
          Verified Campus Clubs ({verifiedClubs.length})
        </button>

        <button
          onClick={() => setActiveTab('applications')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'applications'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800'
          }`}
        >
          <FileCheck2 className="w-4 h-4" />
          Charter Applications
          {pendingApps.length > 0 && (
            <span className="ml-1 text-[10px] bg-emerald-500 text-white px-2 py-0.2 rounded-full font-bold">
              {pendingApps.length} pending
            </span>
          )}
        </button>
      </div>

      {loading ? (
        <div className="py-16 text-center">
          <LoadingSpinner />
          <p className="text-sm text-gray-500 mt-2">Loading club data...</p>
        </div>
      ) : activeTab === 'clubs' ? (
        /* Verified Clubs List */
        verifiedClubs.length === 0 ? (
          <EmptyState
            title="No Verified Clubs"
            description="No student clubs have been officially chartered yet. Click 'Create New Club' to establish one."
            actionText="Create New Club"
            onAction={() => setIsCreateModalOpen(true)}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {verifiedClubs.map((club) => (
              <Card key={club._id} className="border-gray-200 dark:border-slate-800 shadow-xs hover:border-emerald-300 dark:hover:border-emerald-600 transition-all flex flex-col justify-between">
                <div>
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
                  <CardContent className="p-4 space-y-4">
                    <p className="text-xs text-gray-600 dark:text-slate-300 line-clamp-3 leading-relaxed">
                      {club.description}
                    </p>

                    <div className="pt-2 border-t border-gray-100 dark:border-slate-800 text-xs text-gray-500 dark:text-slate-400 space-y-1">
                      <p className="flex items-center gap-1.5">
                        <UserCheck className="w-3.5 h-3.5 text-gray-400" />
                        <span>Lead: <strong className="text-gray-700 dark:text-slate-200">{club.leadStudentName || 'Campus Administration'}</strong></span>
                      </p>
                      <p className="flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-gray-400" />
                        <span className="text-gray-600 dark:text-slate-300">{club.contactEmail}</span>
                      </p>
                    </div>
                  </CardContent>
                </div>

                <div className="p-4 pt-2 border-t border-gray-100 dark:border-slate-800 flex items-center justify-between gap-2">
                  <Link
                    to={`/clubs/${club._id}`}
                    target="_blank"
                    className="inline-flex items-center text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
                  >
                    View Page <ExternalLink className="w-3 h-3 ml-1" />
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setClubToDelete(club)}
                    className="text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-900/60 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs px-2.5 py-1 h-auto"
                  >
                    <Trash2 className="w-3.5 h-3.5 mr-1" />
                    Remove
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )
      ) : (
        /* Applications List */
        applications.length === 0 ? (
          <EmptyState
            title="No Charter Applications"
            description="There are currently no legacy student club charter applications awaiting administrative review."
          />
        ) : (
          <div className="space-y-4">
            {applications.map((app) => (
              <Card
                key={app._id}
                className={`border transition-all ${
                  app.status === 'PENDING' ? 'border-amber-300 bg-amber-50/20 shadow-xs' : 'border-gray-200 dark:border-slate-800'
                }`}
              >
                <CardHeader className="p-5 pb-3 border-b border-gray-100 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-base text-gray-900 dark:text-slate-100">{app.clubName}</h3>
                      <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300">
                        {app.category}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">
                      Submitted on {new Date(app.createdAt).toLocaleDateString()} by{' '}
                      <strong>{app.proposedLeadStudentName}</strong>
                    </p>
                  </div>
                  <StatusBadge status={app.status} />
                </CardHeader>
                <CardContent className="p-5 space-y-3">
                  <div>
                    <h4 className="text-xs font-semibold uppercase text-gray-500 dark:text-slate-400 mb-1">
                      Organization Description
                    </h4>
                    <p className="text-xs text-gray-700 dark:text-slate-300 leading-relaxed bg-gray-50 dark:bg-slate-800/80 p-3 rounded-lg border border-gray-100 dark:border-slate-700">
                      {app.description}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-xs font-semibold uppercase text-gray-500 dark:text-slate-400 mb-1">
                      Charter Objectives & Value Proposition
                    </h4>
                    <p className="text-xs text-gray-700 dark:text-slate-300 leading-relaxed bg-gray-50 dark:bg-slate-800/80 p-3 rounded-lg border border-gray-100 dark:border-slate-700">
                      {app.objectives}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-4 text-xs text-gray-600 dark:text-slate-300 pt-2 border-t border-gray-100 dark:border-slate-800">
                    <p>
                      <strong>Lead Coordinator:</strong> {app.proposedLeadStudentName} ({app.proposedLeadStudentId?.email})
                    </p>
                    <p>
                      <strong>Contact:</strong> {app.contactEmail}
                    </p>
                  </div>

                  {app.reviewNotes && (
                    <div className="p-3 bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 rounded-lg text-xs text-blue-800 dark:text-blue-200">
                      <strong>Admin Review Feedback:</strong> {app.reviewNotes}
                    </div>
                  )}

                  {app.status === 'PENDING' && (
                    <div className="flex justify-end gap-3 pt-3 border-t border-gray-100 dark:border-slate-800">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleOpenReview(app, 'REJECTED')}
                        className="text-red-600 dark:text-rose-400 border-red-200 dark:border-rose-800 hover:bg-red-50 dark:hover:bg-rose-950/50 text-xs"
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
      )}

      {/* Create New Club Dialog */}
      <Dialog
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create & Charter New Campus Club"
        description="Establish an official university student organization with verified charter status."
        maxWidth="2xl"
      >
        <form onSubmit={handleCreateClub} className="space-y-4 pt-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Official Club Name"
              value={clubForm.name}
              onChange={(e) => {
                const name = e.target.value;
                const autoCode = name.replace(/[^A-Za-z0-9]/g, '').substring(0, 8).toUpperCase();
                setClubForm({
                  ...clubForm,
                  name,
                  code: clubForm.code ? clubForm.code : autoCode,
                });
              }}
              placeholder="e.g. Google Developer Student Club"
              required
            />

            <Input
              label="Club Code (Short Acronym)"
              value={clubForm.code}
              onChange={(e) => setClubForm({ ...clubForm, code: e.target.value.toUpperCase() })}
              placeholder="e.g. GDSC"
              helperText="Auto-generated acronym or custom identifier."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Category
              </label>
              <select
                value={clubForm.category}
                onChange={(e) => setClubForm({ ...clubForm, category: e.target.value })}
                className="flex w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
              >
                <option value="TECHNICAL">Technical & Coding</option>
                <option value="CULTURAL">Cultural & Arts</option>
                <option value="SPORTS">Sports & Athletics</option>
                <option value="ACADEMIC">Academic & Research</option>
                <option value="SOCIAL">Social & Community Welfare</option>
              </select>
            </div>

            <Input
              label="Official Club Contact Email"
              type="email"
              value={clubForm.contactEmail}
              onChange={(e) => setClubForm({ ...clubForm, contactEmail: e.target.value })}
              placeholder="e.g. gdsc@silicon.ac.in"
              required
            />
          </div>

          <Textarea
            label="Club Mission & Description"
            rows={3}
            value={clubForm.description}
            onChange={(e) => setClubForm({ ...clubForm, description: e.target.value })}
            placeholder="Describe the club's purpose, core domains, planned workshops, and hackathons..."
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Student Lead / Coordinator Name (Optional)"
              value={clubForm.leadStudentName}
              onChange={(e) => setClubForm({ ...clubForm, leadStudentName: e.target.value })}
              placeholder="e.g. Rohit Sharma or Campus Administration"
            />

            <Input
              label="Membership Info / Eligibility (Optional)"
              value={clubForm.membershipInfo}
              onChange={(e) => setClubForm({ ...clubForm, membershipInfo: e.target.value })}
              placeholder="e.g. Open to all B.Tech CSE & ECE batches"
            />
          </div>

          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button type="button" variant="outline" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={submittingClub}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
            >
              <ShieldCheck className="w-4 h-4 mr-1.5" />
              Charter & Verify Club
            </Button>
          </div>
        </form>
      </Dialog>

      {/* Review Legacy Application Dialog */}
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

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={Boolean(clubToDelete)}
        onClose={() => setClubToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Remove Campus Club"
        message={`Are you sure you want to remove "${clubToDelete?.name}" (${clubToDelete?.code}) from the official university registry? This will revoke verified club status.`}
        confirmText="Remove Club"
        variant="danger"
        isLoading={isDeleting}
      />
    </div>
  );
};
export default ClubGovernancePage;
