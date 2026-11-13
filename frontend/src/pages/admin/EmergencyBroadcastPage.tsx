import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { StatusBadge } from '../../components/common/StatusBadge';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { 
  AlertTriangle, 
  Radio, 
  Send, 
  History, 
  ShieldAlert, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Eye, 
  AlertOctagon,
  AlertCircle
} from 'lucide-react';

interface EmergencyAlertItem {
  _id: string;
  title: string;
  message: string;
  isCritical: boolean;
  issuedBy?: {
    _id: string;
    name: string;
    email: string;
  };
  broadcastAt: string;
  active: boolean;
  expiresAt?: string;
}

export const EmergencyBroadcastPage: React.FC = () => {
  const [alerts, setAlerts] = useState<EmergencyAlertItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [isCritical, setIsCritical] = useState(true);
  const [expiresAt, setExpiresAt] = useState('');

  // Confirmation dialog
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [dismissingId, setDismissingId] = useState<string | null>(null);

  const fetchAlertHistory = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/emergency/history');
      if (res.data.success) {
        setAlerts(res.data.data);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load emergency broadcast history.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlertHistory();
  }, []);

  const handleBroadcastSubmit = async () => {
    if (!title.trim() || !message.trim()) {
      setError('Title and message are required.');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      setSuccess(null);

      const payload: any = {
        title: title.trim(),
        message: message.trim(),
        isCritical,
      };
      if (expiresAt) {
        payload.expiresAt = new Date(expiresAt).toISOString();
      }

      const res = await api.post('/admin/emergency/broadcast', payload);
      if (res.data.success) {
        setSuccess('Emergency broadcast dispatched immediately to all connected sessions.');
        setTitle('');
        setMessage('');
        setIsCritical(true);
        setExpiresAt('');
        setShowConfirmModal(false);
        fetchAlertHistory();
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to dispatch emergency broadcast.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDismiss = async (alertId: string) => {
    try {
      setDismissingId(alertId);
      const res = await api.patch(`/admin/emergency/${alertId}/dismiss`);
      if (res.data.success) {
        setSuccess('Alert deactivated.');
        fetchAlertHistory();
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to dismiss alert.');
    } finally {
      setDismissingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 rounded-xl p-6 transition-colors">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-red-600 text-white flex items-center justify-center shadow-lg shadow-red-200 dark:shadow-none">
              <Radio className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-red-100 flex items-center gap-2">
                Emergency System Broadcast
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-red-100 dark:bg-red-900/70 text-red-800 dark:text-red-200 border border-red-300 dark:border-red-700">
                  Decision Table 6
                </span>
              </h1>
              <p className="text-sm text-gray-600 dark:text-red-200/80">
                Instantly push high-priority critical banners to every logged-in student, faculty, and administrator across the campus network via WebSocket.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Status Messages */}
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-950/50 border border-red-300 dark:border-red-800 rounded-lg text-sm text-red-800 dark:text-red-200 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-600 dark:text-red-400" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="p-4 bg-green-50 dark:bg-emerald-950/50 border border-green-300 dark:border-emerald-800 rounded-lg text-sm text-green-800 dark:text-emerald-200 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-green-600 dark:text-emerald-400" />
          <span>{success}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Broadcast Form */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="border-red-200 dark:border-red-900/60 shadow-sm">
            <CardHeader className="bg-gradient-to-r from-red-600 to-rose-700 text-white rounded-t-xl py-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <ShieldAlert className="w-5 h-5" />
                Dispatch Emergency Alert
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">
                  Alert Title <span className="text-red-500">*</span>
                </label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Severe Weather Alert: Classes Suspended"
                  className="focus:ring-red-500 focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">
                  Alert Message / Instructions <span className="text-red-500">*</span>
                </label>
                <Textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Provide urgent instructions, safe meeting points, or contact helpline..."
                  rows={4}
                  className="focus:ring-red-500 focus:border-red-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">
                    Auto-Expiry (Optional)
                  </label>
                  <Input
                    type="datetime-local"
                    value={expiresAt}
                    onChange={(e) => setExpiresAt(e.target.value)}
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Leaves alert active indefinitely if empty.</p>
                </div>

                <div className="md:col-span-2 pt-1">
                  <div
                    onClick={() => setIsCritical(!isCritical)}
                    className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                      isCritical
                        ? 'bg-red-50 dark:bg-red-950/50 border-red-500 text-red-950 dark:text-red-100'
                        : 'bg-amber-50 dark:bg-amber-950/50 border-amber-500 text-amber-950 dark:text-amber-100'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id="isCriticalCheckbox"
                        checked={isCritical}
                        onChange={(e) => setIsCritical(e.target.checked)}
                        onClick={(e) => e.stopPropagation()}
                        className="h-5 w-5 text-red-600 focus:ring-red-500 border-gray-300 dark:border-slate-700 rounded cursor-pointer"
                      />
                      <div>
                        <label
                          htmlFor="isCriticalCheckbox"
                          className="text-sm font-black cursor-pointer block"
                        >
                          {isCritical
                            ? 'High Priority Critical Broadcast (Checked)'
                            : 'Standard Priority Advisory Broadcast (Unchecked)'}
                        </label>
                        <p className="text-xs opacity-90 font-medium">
                          {isCritical
                            ? 'Checked: Notification card will display with a bold RED background in student and admin notification centers.'
                            : 'Unchecked: Notification card will display with a bold YELLOW background in student and admin notification centers.'}
                        </p>
                      </div>
                    </div>

                    <div className="flex-shrink-0">
                      {isCritical ? (
                        <span className="text-xs font-black uppercase tracking-wider px-2.5 py-1 rounded-md bg-red-600 text-white shadow-xs inline-flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
                          Red Card Output
                        </span>
                      ) : (
                        <span className="text-xs font-black uppercase tracking-wider px-2.5 py-1 rounded-md bg-amber-400 text-slate-950 shadow-xs inline-flex items-center gap-1.5 border border-amber-500">
                          <span className="w-2 h-2 rounded-full bg-slate-950"></span>
                          Yellow Card Output
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                <Button
                  type="button"
                  onClick={() => setShowConfirmModal(true)}
                  disabled={!title.trim() || !message.trim() || submitting}
                  className="bg-red-600 hover:bg-red-700 text-white flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Review & Broadcast Alert
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Live Preview Card */}
          <Card className="border-gray-200 dark:border-slate-800 shadow-sm">
            <CardHeader className="py-3 bg-gray-50 dark:bg-slate-800/60 rounded-t-xl border-b border-slate-100 dark:border-slate-800">
              <CardTitle className="text-sm font-semibold text-gray-700 dark:text-gray-200 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  Live Portal Notification Card Preview
                </span>
                <span className="text-[11px] font-bold text-gray-500 dark:text-gray-400">
                  {isCritical ? 'Red Card Output' : 'Yellow Card Output'}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              {title.trim() ? (
                isCritical ? (
                  <div className="p-4 sm:p-5 rounded-2xl border-2 border-red-700 dark:border-red-500 bg-red-600 dark:bg-red-700 text-white shadow-md flex items-start gap-3.5">
                    <div className="p-2.5 rounded-xl bg-red-800 text-white border border-red-400/50 flex-shrink-0 mt-0.5">
                      <Radio className="w-5 h-5 text-white animate-pulse" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-black text-[10px] tracking-wider uppercase bg-red-950 text-red-100 px-2 py-0.5 rounded border border-red-400/60 shadow-xs">
                          CRITICAL BROADCAST (RED CARD)
                        </span>
                        <span className="text-xs bg-red-800 text-red-100 px-2 py-0.5 rounded font-mono font-semibold">Just Now</span>
                      </div>
                      <h3 className="font-black text-base mt-1 text-white leading-snug">{title}</h3>
                      <p className="text-xs sm:text-sm text-red-50 mt-1 leading-relaxed font-medium">{message || 'Alert message content will appear here...'}</p>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 sm:p-5 rounded-2xl border-2 border-amber-500 dark:border-amber-300 bg-amber-400 dark:bg-amber-400 text-slate-950 shadow-md flex items-start gap-3.5">
                    <div className="p-2.5 rounded-xl bg-amber-500 text-slate-950 border border-amber-600/50 flex-shrink-0 mt-0.5">
                      <Radio className="w-5 h-5 text-slate-950 animate-pulse" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-black text-[10px] tracking-wider uppercase bg-slate-950 text-amber-300 px-2 py-0.5 rounded border border-slate-900 shadow-xs">
                          CAMPUS ADVISORY (YELLOW CARD)
                        </span>
                        <span className="text-xs bg-slate-950 text-amber-300 px-2 py-0.5 rounded font-mono font-bold">Just Now</span>
                      </div>
                      <h3 className="font-black text-base mt-1 text-slate-950 leading-snug">{title}</h3>
                      <p className="text-xs sm:text-sm text-slate-900 mt-1 leading-relaxed font-semibold">{message || 'Alert message content will appear here...'}</p>
                    </div>
                  </div>
                )
              ) : (
                <div className="text-center py-6 text-sm text-gray-500 dark:text-slate-400 italic bg-gray-50 dark:bg-slate-800/40 rounded-lg border border-dashed border-slate-200 dark:border-slate-700">
                  Type an alert title above to preview whether it renders as a Red or Yellow notification card.
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* History of Dispatched Alerts */}
        <div className="lg:col-span-5 space-y-4">
          <Card className="border-gray-200 dark:border-slate-800 shadow-sm">
            <CardHeader className="py-4 border-b border-slate-100 dark:border-slate-800 flex flex-row items-center justify-between">
              <CardTitle className="text-base font-bold text-gray-900 dark:text-slate-100 flex items-center gap-2">
                <History className="w-5 h-5 text-gray-500 dark:text-slate-400" />
                Broadcast Log
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={fetchAlertHistory}
                disabled={loading}
                className="text-xs"
              >
                Refresh
              </Button>
            </CardHeader>
            <CardContent className="p-4 divide-y divide-gray-100 dark:divide-slate-800 max-h-[600px] overflow-y-auto">
              {loading && alerts.length === 0 ? (
                <div className="py-8 text-center">
                  <LoadingSpinner />
                  <p className="text-xs text-gray-500 dark:text-slate-400 mt-2">Loading broadcast logs...</p>
                </div>
              ) : alerts.length === 0 ? (
                <div className="text-center py-8 text-sm text-gray-500 dark:text-slate-400">
                  No emergency broadcasts have been logged yet.
                </div>
              ) : (
                alerts.map((alert) => (
                  <div key={alert._id} className="py-3.5 first:pt-0 last:pb-0 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            alert.active ? 'bg-red-500 animate-ping' : 'bg-gray-300 dark:bg-gray-600'
                          }`}
                        />
                        <h4 className="font-bold text-sm text-gray-900 dark:text-slate-100">{alert.title}</h4>
                        {alert.isCritical !== false ? (
                          <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-red-100 dark:bg-red-950/80 text-red-700 dark:text-red-300 border border-red-300 dark:border-red-800">
                            Critical (Red Card)
                          </span>
                        ) : (
                          <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-200 border border-amber-300 dark:border-amber-800">
                            Advisory (Yellow Card)
                          </span>
                        )}
                      </div>
                      <StatusBadge status={alert.active ? 'ACTIVE' : 'EXPIRED'} />
                    </div>
                    <p className="text-xs text-gray-600 dark:text-slate-300 line-clamp-2">{alert.message}</p>
                    <div className="flex items-center justify-between text-[11px] text-gray-400 dark:text-slate-500 pt-1">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(alert.broadcastAt).toLocaleString()}
                      </span>
                      {alert.active && (
                        <button
                          onClick={() => handleDismiss(alert._id)}
                          disabled={dismissingId === alert._id}
                          className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 font-semibold hover:underline"
                        >
                          {dismissingId === alert._id ? 'Deactivating...' : 'Dismiss Alert'}
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmDialog
        isOpen={showConfirmModal}
        title="Confirm Emergency Campus Broadcast"
        message="This alert will be immediately transmitted via WebSocket to all currently active user sessions and displayed on top of the university portal. Do you wish to proceed?"
        confirmText={submitting ? 'Broadcasting...' : 'Yes, Dispatch Broadcast'}
        cancelText="Cancel"
        variant="danger"
        isLoading={submitting}
        onConfirm={handleBroadcastSubmit}
        onClose={() => setShowConfirmModal(false)}
      />
    </div>
  );
};
