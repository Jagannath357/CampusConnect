import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { Club, CampusEvent } from '../../types';
import {
  Compass,
  ArrowLeft,
  ShieldCheck,
  Mail,
  UserCheck,
  Calendar,
  Building,
  Edit,
  Trash2,
  CalendarPlus,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Users,
  MapPin,
  Clock,
  Sparkles,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Dialog } from '../../components/ui/dialog';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { StatusBadge } from '../../components/common/StatusBadge';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

export const AdminClubDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [club, setClub] = useState<Club | null>(null);
  const [events, setEvents] = useState<CampusEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [savingEdit, setSavingEdit] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    code: '',
    category: 'TECHNICAL',
    description: '',
    contactEmail: '',
    leadStudentName: '',
    membershipInfo: '',
  });

  // Delete Dialog State
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchClubDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get(`/admin/clubs/${id}`);
      if (res.data.success) {
        const clubData: Club = res.data.data.club;
        setClub(clubData);
        setEvents(res.data.data.events || []);

        setEditForm({
          name: clubData.name,
          code: clubData.code,
          category: clubData.category,
          description: clubData.description,
          contactEmail: clubData.contactEmail,
          leadStudentName: clubData.leadStudentName || '',
          membershipInfo: clubData.membershipInfo || '',
        });
      }
    } catch (err: any) {
      console.error('Failed to load club details', err);
      setError(err.response?.data?.message || 'Failed to retrieve club details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClubDetails();
  }, [id]);

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editForm.name.trim() || !editForm.description.trim() || !editForm.contactEmail.trim()) {
      setError('Please provide club name, description, and contact email.');
      return;
    }

    try {
      setSavingEdit(true);
      setError(null);
      setSuccess(null);

      const res = await api.put(`/admin/clubs/${id}`, {
        name: editForm.name.trim(),
        code: editForm.code.trim() || undefined,
        category: editForm.category,
        description: editForm.description.trim(),
        contactEmail: editForm.contactEmail.trim(),
        leadStudentName: editForm.leadStudentName.trim() || undefined,
        membershipInfo: editForm.membershipInfo.trim() || undefined,
      });

      if (res.data.success) {
        setSuccess('Club details updated successfully.');
        setIsEditModalOpen(false);
        await fetchClubDetails();
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update club.');
    } finally {
      setSavingEdit(false);
    }
  };

  const handleDeleteClub = async () => {
    try {
      setDeleting(true);
      setError(null);

      const res = await api.delete(`/admin/clubs/${id}`);
      if (res.data.success) {
        navigate('/admin/clubs');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to remove club.');
      setIsDeleteDialogOpen(false);
    } finally {
      setDeleting(false);
    }
  };

  const handleToggleVerification = async () => {
    if (!club) return;
    try {
      const nextStatus = !club.isVerified;
      const res = await api.put(`/admin/clubs/${id}`, { isVerified: nextStatus });
      if (res.data.success) {
        setSuccess(`Club status changed to ${nextStatus ? 'Verified' : 'Unverified'}.`);
        await fetchClubDetails();
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to toggle verification status.');
    }
  };

  if (loading) {
    return <LoadingSpinner size="lg" className="h-64" />;
  }

  if (!club) {
    return (
      <div className="text-center py-16 space-y-4 max-w-md mx-auto">
        <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
          <Building className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Club Record Not Found</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          The requested club does not exist or may have been deleted from the registry.
        </p>
        <Link to="/admin/clubs">
          <Button variant="primary" size="sm" className="font-bold">
            <ArrowLeft className="w-4 h-4 mr-1.5" /> Return to Club Governance
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Breadcrumb Navigation */}
      <div className="flex items-center justify-between">
        <Link
          to="/admin/clubs"
          className="inline-flex items-center text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Club Governance
        </Link>

        <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
          System ID: {club._id}
        </span>
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

      {/* Club Hero Banner Card */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-md border border-emerald-700/50">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-mono font-bold bg-white/20 text-teal-100 px-2.5 py-0.5 rounded-lg border border-white/20 uppercase tracking-wider">
                {club.code}
              </span>
              <span className="text-xs font-bold bg-teal-500/30 text-teal-100 px-2.5 py-0.5 rounded-lg border border-teal-400/30">
                {club.category}
              </span>
              {club.isVerified ? (
                <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-200 bg-emerald-900/60 px-2.5 py-0.5 rounded-lg border border-emerald-500/50">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
                  Officially Verified
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-200 bg-amber-900/60 px-2.5 py-0.5 rounded-lg border border-amber-500/50">
                  Pending Verification
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">{club.name}</h1>
            <p className="text-xs sm:text-sm text-teal-100/90 max-w-2xl leading-relaxed">
              Official Silicon University registered student organization under Central Administration Governance.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-teal-200/90 font-medium">
              <a
                href={`mailto:${club.contactEmail}`}
                className="flex items-center gap-1.5 hover:text-white transition-colors underline"
              >
                <Mail className="w-3.5 h-3.5 text-teal-300" />
                <span>{club.contactEmail}</span>
              </a>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5 text-teal-300" />
                <span>Lead: {club.leadStudentName || 'Campus Administration'}</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-teal-300" />
                <span>Chartered: {new Date(club.createdAt).toLocaleDateString()}</span>
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex sm:flex-col items-stretch sm:items-end gap-2.5 flex-shrink-0">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsEditModalOpen(true)}
              className="bg-white/10 hover:bg-white/20 text-white border-white/30 text-xs font-bold shadow-xs"
            >
              <Edit className="w-3.5 h-3.5 mr-1.5" /> Edit Club Details
            </Button>

            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(true)}
              className="bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 border-rose-400/40 text-xs font-bold"
            >
              <Trash2 className="w-3.5 h-3.5 mr-1.5" /> Remove Club
            </Button>
          </div>
        </div>
      </div>

      {/* Main Grid: Details & Governance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols on lg): Descriptions, Events & Membership */}
        <div className="lg:col-span-2 space-y-6">
          {/* About Card */}
          <Card>
            <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
              <CardTitle className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Compass className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>About the Organization & Mission</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed whitespace-pre-wrap">
                {club.description}
              </p>

              {club.membershipInfo && (
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 space-y-1">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                    Membership Pathways & Eligibility Schedule
                  </span>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                    {club.membershipInfo}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Official Events Organized by Club */}
          <Card>
            <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <span>Official Campus Events Published ({events.length})</span>
                </CardTitle>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Workshops, hackathons, and cultural fests hosted by {club.name}.
                </p>
              </div>

              <Link to="/admin/events/new">
                <Button size="sm" variant="outline" className="text-xs font-bold">
                  <CalendarPlus className="w-3.5 h-3.5 mr-1.5" /> Schedule Event
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="p-6">
              {events.length === 0 ? (
                <div className="text-center py-8 space-y-2">
                  <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                    No official campus events have been published under this club yet.
                  </p>
                  <Link to="/admin/events/new">
                    <Button size="sm" variant="primary" className="text-xs font-bold mt-2">
                      <CalendarPlus className="w-3.5 h-3.5 mr-1.5" /> Publish First Event
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {events.map((evt) => (
                    <div
                      key={evt._id}
                      className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-emerald-300 dark:hover:border-emerald-700 transition-colors"
                    >
                      <div className="space-y-1 min-w-0 flex-1">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 truncate">
                            {evt.title}
                          </h4>
                          <StatusBadge status={evt.status} />
                        </div>

                        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400 pt-0.5">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            {new Date(evt.date).toLocaleDateString()} • {evt.startTime} - {evt.endTime}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-slate-400" />
                            {evt.venue}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Users className="w-3.5 h-3.5 text-slate-400" />
                            {evt.availableSeats} seats available
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 flex-shrink-0">
                        <Link to={`/admin/events`}>
                          <Button size="sm" variant="outline" className="text-xs font-bold">
                            Inspect Registrations
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column (1 Col on lg): Governance & Meta Info */}
        <div className="space-y-6">
          {/* Institutional Compliance Card */}
          <Card>
            <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
              <CardTitle className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                <span>Governance & Verification</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4 text-xs">
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">Charter Status</span>
                  {club.isVerified ? (
                    <span className="font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" /> Verified Active
                    </span>
                  ) : (
                    <span className="font-bold text-amber-600 dark:text-amber-400">
                      Unverified
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">Category Chapter</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{club.category}</span>
                </div>

                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">Institutional Acronym</span>
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{club.code}</span>
                </div>

                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">Student Coordinator</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{club.leadStudentName || 'Campus Administration'}</span>
                </div>

                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">Official Contact Email</span>
                  <a href={`mailto:${club.contactEmail}`} className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
                    {club.contactEmail}
                  </a>
                </div>

                {club.verifiedBy && (
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-500 dark:text-slate-400 font-medium">Verified By</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {typeof club.verifiedBy === 'object' ? club.verifiedBy.name : 'University Admin'}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">Registration Date</span>
                  <span className="text-slate-700 dark:text-slate-300">
                    {new Date(club.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Status Toggle Action */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleToggleVerification}
                  className="w-full text-xs font-bold"
                >
                  {club.isVerified ? 'Mark as Unverified' : 'Authorize Official Verification'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Institutional Compliance Notice */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-center text-xs text-slate-500 dark:text-slate-400 space-y-1">
            <p className="font-extrabold text-slate-800 dark:text-slate-200">Silicon University Bhubaneswar</p>
            <p className="text-[11px]">Central Student Organization Charter</p>
            <div className="mt-1 flex items-center justify-center space-x-1.5 text-[10px] font-semibold text-emerald-700 dark:text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              <span>RBAC Admin Monitored</span>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Club Modal Dialog */}
      <Dialog
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title={`Edit Club: ${club.name}`}
        description="Update official club information, contact points, and membership pathways."
        maxWidth="2xl"
      >
        <form onSubmit={handleSaveEdit} className="space-y-4 pt-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Official Club Name"
              value={editForm.name}
              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              required
            />

            <Input
              label="Club Code (Short Acronym)"
              value={editForm.code}
              onChange={(e) => setEditForm({ ...editForm, code: e.target.value.toUpperCase() })}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Category
              </label>
              <select
                value={editForm.category}
                onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
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
              value={editForm.contactEmail}
              onChange={(e) => setEditForm({ ...editForm, contactEmail: e.target.value })}
              required
            />
          </div>

          <Textarea
            label="Club Mission & Description"
            rows={4}
            value={editForm.description}
            onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Student Lead / Coordinator Name"
              value={editForm.leadStudentName}
              onChange={(e) => setEditForm({ ...editForm, leadStudentName: e.target.value })}
              placeholder="e.g. Rohit Sharma or Campus Administration"
            />

            <Input
              label="Membership Info / Eligibility"
              value={editForm.membershipInfo}
              onChange={(e) => setEditForm({ ...editForm, membershipInfo: e.target.value })}
              placeholder="e.g. Open to all students"
            />
          </div>

          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={savingEdit}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
            >
              Save Club Changes
            </Button>
          </div>
        </form>
      </Dialog>

      {/* Confirm Deletion Dialog */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteClub}
        title="Remove Campus Club"
        message={`Are you sure you want to permanently remove "${club.name}" (${club.code}) from the university registry? This will revoke verified club status and remove it from student discovery.`}
        confirmText="Remove Club"
        variant="danger"
        isLoading={deleting}
      />
    </div>
  );
};
export default AdminClubDetailsPage;
