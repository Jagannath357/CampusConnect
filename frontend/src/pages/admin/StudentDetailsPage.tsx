import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../services/api';
import {
  Users,
  ArrowLeft,
  UserX,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Clock,
  Shield,
  Phone,
  Mail,
  Award,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { StatusBadge } from '../../components/common/StatusBadge';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Dialog } from '../../components/ui/dialog';

export const StudentDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const [studentData, setStudentData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showSuspendModal, setShowSuspendModal] = useState(false);
  const [suspendReason, setSuspendReason] = useState('');
  const [suspendEndDate, setSuspendEndDate] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const fetchStudent = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/admin/students/${id}`);
      if (res.data.success) {
        setStudentData(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load student', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudent();
  }, [id]);

  const handleSuspend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!suspendReason.trim()) return;

    setActionLoading(true);
    setSuccessMessage('');
    setErrorMessage('');
    try {
      const res = await api.post(`/admin/students/${id}/suspend`, {
        reason: suspendReason,
        endDate: suspendEndDate || undefined,
      });

      if (res.data.success) {
        setSuccessMessage('Student account has been suspended and all active JWT sessions were revoked.');
        setShowSuspendModal(false);
        setSuspendReason('');
        await fetchStudent();
      }
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || 'Failed to suspend student.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReactivate = async () => {
    setActionLoading(true);
    setSuccessMessage('');
    setErrorMessage('');
    try {
      const res = await api.post(`/admin/students/${id}/reactivate`, {
        reactivationNotes: 'Reactivated after administrative review.',
      });

      if (res.data.success) {
        setSuccessMessage('Student account has been restored to ACTIVE status.');
        await fetchStudent();
      }
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || 'Failed to reactivate account.');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner size="lg" className="h-64" />;
  }

  if (!studentData) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-bold text-slate-800">Student record not found</h2>
        <Link to="/admin/students" className="text-xs text-indigo-600 mt-2 inline-block">
          Return to Student Directory
        </Link>
      </div>
    );
  }

  const { user, profile, suspensions } = studentData;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link
        to="/admin/students"
        className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Student Accounts
      </Link>

      {successMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Main Student Audit Card */}
      <Card>
        <CardContent className="p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center text-2xl font-black">
                {user.name.charAt(0)}
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h1 className="text-2xl font-black text-slate-900">{user.name}</h1>
                  <StatusBadge status={user.status} />
                </div>
                <p className="text-xs text-slate-500">{user.email}</p>
                <p className="text-xs font-bold text-slate-600 mt-0.5">
                  Roll: {profile?.rollNumber} • {profile?.department} • Batch {profile?.batchYear}
                </p>
              </div>
            </div>

            {/* Action buttons */}
            <div>
              {user.status === 'ACTIVE' ? (
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => setShowSuspendModal(true)}
                  disabled={actionLoading}
                >
                  <UserX className="w-4 h-4 mr-1.5" /> Suspend Account
                </Button>
              ) : (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleReactivate}
                  isLoading={actionLoading}
                >
                  <CheckCircle2 className="w-4 h-4 mr-1.5" /> Reactivate Account
                </Button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100 text-xs">
            <div>
              <span className="font-bold uppercase tracking-wider text-slate-400 text-[10px]">Current CGPA</span>
              <p className="text-base font-bold text-indigo-600 mt-0.5">
                {profile?.cgpa ? profile.cgpa.toFixed(2) : '0.00'} / 10.0
              </p>
            </div>

            <div>
              <span className="font-bold uppercase tracking-wider text-slate-400 text-[10px]">Contact Phone</span>
              <p className="text-base font-bold text-slate-800 mt-0.5">
                {profile?.contactNumber || 'Not provided'}
              </p>
            </div>

            <div>
              <span className="font-bold uppercase tracking-wider text-slate-400 text-[10px]">Token Version</span>
              <p className="text-base font-bold text-slate-800 mt-0.5">
                v{user.tokenVersion} (Revocation key)
              </p>
            </div>
          </div>

          {profile?.bio && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Student Bio</h3>
              <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-100">{profile.bio}</p>
            </div>
          )}

          {/* Past Suspension History */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Suspension History</h3>
            {suspensions.length === 0 ? (
              <p className="text-xs text-slate-500 bg-slate-50 p-4 rounded-xl border border-slate-100">
                No disciplinary suspensions on record for this student account.
              </p>
            ) : (
              <div className="space-y-3">
                {suspensions.map((s: any) => (
                  <div key={s._id} className="p-4 rounded-xl border border-rose-200 bg-rose-50/40 text-xs space-y-1.5">
                    <div className="flex items-center justify-between font-bold text-rose-900">
                      <span>Reason: {s.reason}</span>
                      <span className={s.isActive ? 'text-rose-600 uppercase font-black' : 'text-slate-500 uppercase'}>
                        {s.isActive ? 'Currently Active' : 'Reactivated'}
                      </span>
                    </div>
                    <p className="text-slate-600">
                      Issued on: {new Date(s.startDate).toLocaleDateString()}
                      {s.endDate && ` • Valid until: ${new Date(s.endDate).toLocaleDateString()}`}
                    </p>
                    {s.reactivationNotes && (
                      <p className="text-emerald-700 pt-1 border-t border-rose-100">
                        <strong>Reactivation:</strong> {s.reactivationNotes}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Suspend Confirmation Dialog */}
      <Dialog
        isOpen={showSuspendModal}
        onClose={() => setShowSuspendModal(false)}
        title="Suspend Student Account"
        description="Enforce university community guidelines with immediate session revocation."
      >
        <form onSubmit={handleSuspend} className="space-y-4 pt-2">
          <Textarea
            label="Suspension Reason (Recorded in audit log)"
            rows={3}
            value={suspendReason}
            onChange={(e) => setSuspendReason(e.target.value)}
            placeholder="Specify reason for suspension (e.g. repeated spam posting, exam misconduct)..."
            required
          />

          <Input
            label="Suspension End Date (Optional)"
            type="date"
            value={suspendEndDate}
            onChange={(e) => setSuspendEndDate(e.target.value)}
          />

          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-[11px] text-rose-800 space-y-1">
            <p className="font-bold">Immediate Revocation Enforcement:</p>
            <p>• Student's active JWT tokens will be immediately invalidated.</p>
            <p>• Subsequent API requests and portal logins will be blocked with HTTP 403.</p>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100">
            <Button type="button" variant="outline" onClick={() => setShowSuspendModal(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="danger" isLoading={actionLoading}>
              Confirm Suspension
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
};

