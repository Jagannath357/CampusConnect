import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { EmptyState } from '../../components/common/EmptyState';
import { 
  FileText, 
  ShieldAlert, 
  User, 
  Clock, 
  Filter, 
  Eye, 
  Search,
  Code2,
  Terminal,
  Server
} from 'lucide-react';

interface AuditLogItem {
  _id: string;
  adminId: {
    _id: string;
    name: string;
    email: string;
  };
  actionType: string;
  targetEntity: string;
  targetId?: string;
  details?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  timestamp: string;
}

const ACTION_TYPES = [
  'USER_SUSPEND',
  'USER_REACTIVATE',
  'CONTENT_MODERATE',
  'LOST_FOUND_RESOLVE',
  'EVENT_PUBLISH',
  'EVENT_UPDATE',
  'EMERGENCY_BROADCAST',
  'EMERGENCY_DISMISS',
  'GRIEVANCE_UPDATE',
  'CLUB_REVIEW',
  'PLACEMENT_CREATE',
  'PLACEMENT_UPDATE',
  'CONFIG_UPDATE',
];

export const AdminAuditLogsPage: React.FC = () => {
  const [logs, setLogs] = useState<AuditLogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter & Pagination
  const [selectedAction, setSelectedAction] = useState<string>('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Inspection modal
  const [inspectedLog, setInspectedLog] = useState<AuditLogItem | null>(null);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      setError(null);

      const params: any = { page, limit: 15 };
      if (selectedAction) params.actionType = selectedAction;

      const res = await api.get('/admin/audit-logs', { params });
      if (res.data.success) {
        setLogs(res.data.data);
        if (res.data.pagination) {
          setTotalPages(res.data.pagination.totalPages || 1);
          setTotalCount(res.data.pagination.total || 0);
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch audit records.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [page, selectedAction]);

  const getActionBadgeColor = (action: string) => {
    if (action.includes('SUSPEND') || action.includes('DISMISS')) {
      return 'bg-red-100 text-red-800 border-red-200';
    }
    if (action.includes('EMERGENCY')) {
      return 'bg-rose-100 text-rose-800 border-rose-200';
    }
    if (action.includes('PUBLISH') || action.includes('CREATE') || action.includes('REACTIVATE')) {
      return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    }
    if (action.includes('UPDATE') || action.includes('CONFIG') || action.includes('REVIEW')) {
      return 'bg-blue-100 text-blue-800 border-blue-200';
    }
    return 'bg-gray-100 text-gray-800 border-gray-200';
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-slate-900 to-zinc-900 text-white rounded-xl p-6 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-300">
              <Terminal className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                Append-Only Administrative Audit Trails
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700">
                  Security & Compliance
                </span>
              </h1>
              <p className="text-sm text-zinc-400">
                Tamper-resistant historical ledger logging every privileged administrative action, parameter update, and suspension.
              </p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs font-mono text-zinc-400 block">Total Audited Events</span>
            <span className="text-2xl font-bold font-mono text-white">{totalCount}</span>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <Card className="border-gray-200 shadow-sm">
        <CardContent className="p-4 flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 w-full md:w-auto">
            <Filter className="w-4 h-4 text-gray-500 dark:text-slate-400" />
            <span className="text-xs font-bold text-gray-700 dark:text-slate-300 uppercase">Action Filter:</span>
            <select
              value={selectedAction}
              onChange={(e) => {
                setSelectedAction(e.target.value);
                setPage(1);
              }}
              className="text-sm border border-gray-300 dark:border-slate-700 rounded-md py-1.5 px-3 focus:outline-none focus:ring-2 focus:ring-zinc-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
            >
              <option value="" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100">All Action Types</option>
              {ACTION_TYPES.map((action) => (
                <option key={action} value={action} className="bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100">
                  {action}
                </option>
              ))}
            </select>
          </div>

          <div className="text-xs text-gray-500 dark:text-slate-400 font-mono">
            Immutable Collection: <code className="bg-gray-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 px-1.5 py-0.5 rounded">AdminAuditLog</code>
          </div>
        </CardContent>
      </Card>

      {/* Logs Table */}
      {loading ? (
        <div className="py-16 text-center">
          <LoadingSpinner />
          <p className="text-sm text-gray-500 mt-2">Loading administrative audit records...</p>
        </div>
      ) : logs.length === 0 ? (
        <EmptyState
          title="No Audit Logs Found"
          description="No administrative actions match your current filter criteria."
        />
      ) : (
        <Card className="border-gray-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-slate-900/90 border-b border-gray-200 dark:border-slate-800 text-[11px] font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Action Type</th>
                  <th className="py-3 px-4">Administrator</th>
                  <th className="py-3 px-4">Target Entity</th>
                  <th className="py-3 px-4">Origin IP</th>
                  <th className="py-3 px-4 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-slate-800 text-sm">
                {logs.map((log) => (
                  <tr key={log._id} className="hover:bg-gray-50/60 dark:hover:bg-slate-800/70 transition-colors">
                    <td className="py-3 px-4 font-mono text-xs text-gray-500 dark:text-slate-400 whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded border ${getActionBadgeColor(log.actionType)}`}>
                        {log.actionType}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-xs font-semibold text-gray-900 dark:text-slate-100">
                        {log.adminId?.name || 'Administrator'}
                      </div>
                      <div className="text-[11px] text-gray-400 dark:text-slate-500 font-mono">
                        {log.adminId?.email || 'System'}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-xs font-semibold text-gray-700 dark:text-slate-200 bg-gray-100 dark:bg-slate-800 border dark:border-slate-700 px-2 py-0.5 rounded">
                        {log.targetEntity}
                      </span>
                      {log.targetId && (
                        <span className="text-[11px] font-mono text-gray-500 dark:text-slate-400 block truncate max-w-[120px]">
                          {log.targetId}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-mono text-xs text-gray-500 dark:text-slate-400">
                      {log.ipAddress || '127.0.0.1'}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setInspectedLog(log)}
                        className="text-xs flex items-center gap-1 ml-auto"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Inspect
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Previous
          </Button>
          <span className="text-xs text-gray-600 px-2">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      )}

      {/* Inspection Modal */}
      {inspectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-xl w-full border border-gray-200 dark:border-slate-800 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-slate-800 pb-3">
              <div>
                <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded border ${getActionBadgeColor(inspectedLog.actionType)}`}>
                  {inspectedLog.actionType}
                </span>
                <h3 className="text-base font-bold text-gray-900 dark:text-slate-100 mt-1">Audit Record Inspector</h3>
              </div>
              <button
                onClick={() => setInspectedLog(null)}
                className="text-gray-400 hover:text-gray-600 dark:text-slate-400 dark:hover:text-slate-200 font-bold text-xl px-2"
              >
                &times;
              </button>
            </div>

            <div className="space-y-2 text-xs text-gray-700 dark:text-slate-200 bg-gray-50 dark:bg-slate-900/90 p-3 rounded-lg border border-gray-200 dark:border-slate-800 font-mono">
              <div><strong>Admin:</strong> {inspectedLog.adminId?.name} ({inspectedLog.adminId?.email})</div>
              <div><strong>Timestamp:</strong> {new Date(inspectedLog.timestamp).toISOString()}</div>
              <div><strong>Target:</strong> {inspectedLog.targetEntity} / ID: {inspectedLog.targetId || 'N/A'}</div>
              <div><strong>Client IP:</strong> {inspectedLog.ipAddress || '127.0.0.1'}</div>
              {inspectedLog.userAgent && (
                <div className="truncate"><strong>User-Agent:</strong> {inspectedLog.userAgent}</div>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 uppercase mb-1 flex items-center gap-1.5">
                <Code2 className="w-3.5 h-3.5" />
                Raw Audit Payload (JSON)
              </label>
              <pre className="p-3 bg-slate-900 text-slate-100 rounded-lg text-xs font-mono overflow-x-auto max-h-60">
                {JSON.stringify(inspectedLog.details || {}, null, 2)}
              </pre>
            </div>

            <div className="flex justify-end pt-2">
              <Button onClick={() => setInspectedLog(null)} variant="outline" size="sm">
                Close Inspector
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

