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
  AlertOctagon
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
      <div className="bg-red-50 border border-red-200 rounded-xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-red-600 text-white flex items-center justify-center shadow-lg shadow-red-200">
              <Radio className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                Emergency System Broadcast
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-red-100 text-red-800 border border-red-300">
                  Decision Table 6
                </span>
              </h1>
              <p className="text-sm text-gray-600">
                Instantly push high-priority critical banners to every logged-in student, faculty, and administrator across the campus network via WebSocket.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Status Messages */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-300 rounded-lg text-sm text-red-800 flex items-center gap-2">
          <AlertCircleIcon className="w-5 h-5 flex-shrink-0 text-red-600" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="p-4 bg-green-50 border border-green-300 rounded-lg text-sm text-green-800 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-green-600" />
          <span>{success}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Broadcast Form */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="border-red-200 shadow-sm">
            <CardHeader className="bg-gradient-to-r from-red-600 to-rose-700 text-white rounded-t-xl py-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <ShieldAlert className="w-5 h-5" />
                Dispatch Emergency Alert
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
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
                <label className="block text-sm font-semibold text-gray-700 mb-1">
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
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Auto-Expiry (Optional)
                  </label>
                  <Input
                    type="datetime-local"
                    value={expiresAt}
                    onChange={(e) => setExpiresAt(e.target.value)}
                  />
                  <p className="text-xs text-gray-500 mt-1">Leaves alert active indefinitely if empty.</p>
                </div>

                <div className="flex items-center space-x-3 pt-6">
                  <input
                    type="checkbox"
                    id="isCriticalCheckbox"
                    checked={isCritical}
                    onChange={(e) => setIsCritical(e.target.checked)}
                    className="h-5 w-5 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isCriticalCheckbox" className="text-sm font-medium text-gray-800 cursor-pointer">
                    High Priority Critical (Red Banner)
                  </label>
                </div>
              </div>

              <div className="pt-4 border-t flex justify-end">
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
          <Card className="border-gray-200 shadow-sm">
            <CardHeader className="py-3 bg-gray-50 rounded-t-xl border-b">
              <CardTitle className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Eye className="w-4 h-4 text-gray-500" />
                Live Student Portal Banner Preview
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              {title.trim() ? (
                <div
                  className={`p-4 rounded-xl border flex items-start gap-3 shadow-md ${
                    isCritical
                      ? 'bg-red-600 text-white border-red-700'
                      : 'bg-amber-500 text-white border-amber-600'
                  }`}
                >
                  <AlertOctagon className="w-6 h-6 flex-shrink-0 animate-bounce" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm tracking-wide uppercase">
                        {isCritical ? 'CRITICAL CAMPUS BROADCAST' : 'CAMPUS ADVISORY'}
                      </span>
                      <span className="text-xs bg-black/20 px-2 py-0.5 rounded font-mono">Just Now</span>
                    </div>
                    <h3 className="font-bold text-base mt-1">{title}</h3>
                    <p className="text-sm text-white/95 mt-0.5 leading-relaxed">{message}</p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 text-sm text-gray-500 italic bg-gray-50 rounded-lg border border-dashed">
                  Type an alert title above to preview how it will appear across all student screens.
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* History of Dispatched Alerts */}
        <div className="lg:col-span-5 space-y-4">
          <Card className="border-gray-200 shadow-sm">
            <CardHeader className="py-4 border-b flex flex-row items-center justify-between">
              <CardTitle className="text-base font-bold text-gray-900 flex items-center gap-2">
                <History className="w-5 h-5 text-gray-500" />
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
            <CardContent className="p-4 divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
              {loading && alerts.length === 0 ? (
                <div className="py-8 text-center">
                  <LoadingSpinner />
                  <p className="text-xs text-gray-500 mt-2">Loading broadcast logs...</p>
                </div>
              ) : alerts.length === 0 ? (
                <div className="text-center py-8 text-sm text-gray-500">
                  No emergency broadcasts have been logged yet.
                </div>
              ) : (
                alerts.map((alert) => (
                  <div key={alert._id} className="py-3.5 first:pt-0 last:pb-0 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            alert.active ? 'bg-red-500 animate-ping' : 'bg-gray-300'
                          }`}
                        />
                        <h4 className="font-semibold text-sm text-gray-900">{alert.title}</h4>
                      </div>
                      <StatusBadge status={alert.active ? 'ACTIVE' : 'EXPIRED'} />
                    </div>
                    <p className="text-xs text-gray-600 line-clamp-2">{alert.message}</p>
                    <div className="flex items-center justify-between text-[11px] text-gray-400 pt-1">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(alert.broadcastAt).toLocaleString()}
                      </span>
                      {alert.active && (
                        <button
                          onClick={() => handleDismiss(alert._id)}
                          disabled={dismissingId === alert._id}
                          className="text-red-600 hover:text-red-800 font-semibold hover:underline"
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

function AlertCircleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <circle cx="12" cy="12" r="10" strokeWidth="2" />
      <line x1="12" y1="8" x2="12" y2="12" strokeWidth="2" />
      <line x1="12" y1="16" x2="12.01" y2="16" strokeWidth="2" />
    </svg>
  );
}
