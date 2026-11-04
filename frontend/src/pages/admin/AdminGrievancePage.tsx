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
  ShieldCheck, 
  Search, 
  Filter, 
  Clock, 
  Building2, 
  CheckCircle2, 
  AlertCircle, 
  FileText,
  Send,
  Eye,
  History,
  Tag
} from 'lucide-react';

interface GrievanceItem {
  _id: string;
  trackingTicket: string;
  category: string;
  description: string;
  status: 'SUBMITTED' | 'UNDER_REVIEW' | 'ASSIGNED' | 'IN_PROGRESS' | 'RESOLVED' | 'DISMISSED';
  assignedDepartment?: string;
  assignedAdminNotes?: string;
  createdAt: string;
  statusTimeline: Array<{
    status: string;
    note: string;
    updatedAt: string;
  }>;
}

const DEPARTMENTS = [
  'Dean of Student Affairs',
  'Examination Cell',
  'Hostel & Mess Committee',
  'Campus Security & Safety',
  'IT & Infrastructure Support',
  'Academic Council',
  'Anti-Ragging & Harassment Committee',
  'Library & Learning Resource Centre',
  'Transport Division'
];

export const AdminGrievancePage: React.FC = () => {
  const [grievances, setGrievances] = useState<GrievanceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Filters & Search
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Management Modal
  const [selectedGrievance, setSelectedGrievance] = useState<GrievanceItem | null>(null);
  const [newStatus, setNewStatus] = useState<string>('');
  const [newDepartment, setNewDepartment] = useState<string>('');
  const [adminNote, setAdminNote] = useState<string>('');
  const [updating, setUpdating] = useState(false);

  const fetchGrievances = async () => {
    try {
      setLoading(true);
      setError(null);
      const params: any = { page, limit: 12 };
      if (statusFilter) params.status = statusFilter;
      if (categoryFilter) params.category = categoryFilter;
      if (search.trim()) params.search = search.trim();

      const res = await api.get('/admin/grievances', { params });
      if (res.data.success) {
        setGrievances(res.data.data);
        if (res.data.pagination) {
          setTotalPages(res.data.pagination.totalPages || 1);
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch grievances.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGrievances();
  }, [page, statusFilter, categoryFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchGrievances();
  };

  const handleOpenAction = (item: GrievanceItem) => {
    setSelectedGrievance(item);
    setNewStatus(item.status);
    setNewDepartment(item.assignedDepartment || '');
    setAdminNote('');
    setError(null);
    setSuccess(null);
  };

  const handleUpdateGrievance = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGrievance) return;

    try {
      setUpdating(true);
      setError(null);

      const payload = {
        status: newStatus,
        assignedDepartment: newDepartment || undefined,
        assignedAdminNotes: adminNote || undefined,
        note: adminNote || `Status updated to ${newStatus} by administration.`,
      };

      const res = await api.patch(`/admin/grievances/${selectedGrievance._id}/status`, payload);
      if (res.data.success) {
        setSuccess(`Grievance ${selectedGrievance.trackingTicket} updated successfully.`);
        setSelectedGrievance(null);
        fetchGrievances();
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update grievance.');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-xl p-6 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                Anonymous Grievance Routing & Resolution
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
                  Module 18
                </span>
              </h1>
              <p className="text-sm text-indigo-200/80">
                Manage, departmentalize, and resolve student complaints while upholding complete zero-knowledge anonymity.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Notifications */}
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

      {/* Filters & Search */}
      <Card className="border-gray-200 shadow-sm">
        <CardContent className="p-4">
          <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
            <div className="md:col-span-5 relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search ticket code (e.g., GRV-2026) or keywords..."
                className="pl-9"
              />
            </div>

            <div className="md:col-span-3">
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPage(1);
                }}
                className="w-full text-sm border-gray-300 dark:border-slate-700 rounded-md py-2 px-3 border focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
              >
                <option value="" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100">All Statuses</option>
                <option value="SUBMITTED" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100">Submitted</option>
                <option value="UNDER_REVIEW" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100">Under Review</option>
                <option value="ASSIGNED" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100">Assigned</option>
                <option value="IN_PROGRESS" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100">In Progress</option>
                <option value="RESOLVED" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100">Resolved</option>
                <option value="DISMISSED" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100">Dismissed</option>
              </select>
            </div>

            <div className="md:col-span-3">
              <select
                value={categoryFilter}
                onChange={(e) => {
                  setCategoryFilter(e.target.value);
                  setPage(1);
                }}
                className="w-full text-sm border-gray-300 dark:border-slate-700 rounded-md py-2 px-3 border focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
              >
                <option value="" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100">All Categories</option>
                <option value="ACADEMIC" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100">Academic</option>
                <option value="HOSTEL" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100">Hostel & Mess</option>
                <option value="INFRASTRUCTURE" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100">Campus Infrastructure</option>
                <option value="ADMINISTRATIVE" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100">Administrative</option>
                <option value="HARASSMENT" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100">Anti-Ragging / Harassment</option>
                <option value="OTHER" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100">Other</option>
              </select>
            </div>

            <div className="md:col-span-1">
              <Button type="submit" variant="outline" className="w-full">
                Filter
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Grievance Table / Cards */}
      {loading ? (
        <div className="py-16 text-center">
          <LoadingSpinner />
          <p className="text-sm text-gray-500 mt-2">Loading submitted grievances...</p>
        </div>
      ) : grievances.length === 0 ? (
        <EmptyState
          title="No Grievances Found"
          description="There are currently no complaints matching your selected criteria or search term."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {grievances.map((item) => (
            <Card key={item._id} className="border-gray-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-600 transition-all flex flex-col justify-between shadow-sm">
              <CardHeader className="p-4 pb-2 border-b border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-900/70">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold bg-indigo-100 dark:bg-indigo-950/80 text-indigo-900 dark:text-indigo-300 px-2 py-0.5 rounded border border-indigo-200 dark:border-indigo-800">
                    {item.trackingTicket}
                  </span>
                  <StatusBadge status={item.status} />
                </div>
                <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-slate-400 mt-2">
                  <Tag className="w-3.5 h-3.5 text-gray-400 dark:text-slate-500" />
                  <span className="font-medium text-gray-700 dark:text-slate-300">{item.category}</span>
                  <span>•</span>
                  <Clock className="w-3.5 h-3.5 text-gray-400 dark:text-slate-500" />
                  <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                </div>
              </CardHeader>

              <CardContent className="p-4 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <p className="text-sm text-gray-700 dark:text-slate-200 line-clamp-3 leading-relaxed">
                    {item.description}
                  </p>

                  {item.assignedDepartment && (
                    <div className="mt-3 p-2 bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded text-xs flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-medium">
                      <Building2 className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                      <span>Assigned: {item.assignedDepartment}</span>
                    </div>
                  )}
                </div>

                <div className="pt-2 border-t border-gray-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] text-gray-400 dark:text-slate-500">
                    {item.statusTimeline.length} updates logged
                  </span>
                  <Button
                    size="sm"
                    onClick={() => handleOpenAction(item)}
                    className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-1.5"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    Review & Route
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
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

      {/* Modal / Dialog for Reviewing and Routing */}
      {selectedGrievance && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-slate-800">
            <div className="p-6 border-b border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-900/90 flex items-center justify-between">
              <div>
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950/80 text-indigo-900 dark:text-indigo-200 border border-indigo-200 dark:border-indigo-800">
                  {selectedGrievance.trackingTicket}
                </span>
                <h3 className="text-lg font-bold text-gray-900 dark:text-slate-100 mt-1">
                  Grievance Action & Departmental Routing
                </h3>
              </div>
              <button
                onClick={() => setSelectedGrievance(null)}
                className="text-gray-400 hover:text-gray-600 dark:text-slate-400 dark:hover:text-slate-200 font-bold text-xl px-2"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleUpdateGrievance} className="p-6 space-y-5">
              {/* Grievance Details */}
              <div className="bg-slate-50 dark:bg-slate-800/80 p-4 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-slate-400">
                  <span className="font-semibold text-gray-700 dark:text-slate-200">Category: {selectedGrievance.category}</span>
                  <span>Submitted: {new Date(selectedGrievance.createdAt).toLocaleString()}</span>
                </div>
                <p className="text-sm text-gray-800 dark:text-slate-100 whitespace-pre-wrap leading-relaxed">
                  {selectedGrievance.description}
                </p>
              </div>

              {/* Status & Department Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 uppercase mb-1">
                    Grievance Status
                  </label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full text-sm border-gray-300 dark:border-slate-700 rounded-md py-2 px-3 border focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  >
                    <option value="SUBMITTED" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100">SUBMITTED</option>
                    <option value="UNDER_REVIEW" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100">UNDER_REVIEW</option>
                    <option value="ASSIGNED" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100">ASSIGNED</option>
                    <option value="IN_PROGRESS" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100">IN_PROGRESS</option>
                    <option value="RESOLVED" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100">RESOLVED</option>
                    <option value="DISMISSED" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100">DISMISSED</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 uppercase mb-1">
                    Assign Committee / Dept
                  </label>
                  <select
                    value={newDepartment}
                    onChange={(e) => setNewDepartment(e.target.value)}
                    className="w-full text-sm border-gray-300 dark:border-slate-700 rounded-md py-2 px-3 border focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  >
                    <option value="" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100">-- No Department Assigned --</option>
                    {DEPARTMENTS.map((dept) => (
                      <option key={dept} value={dept} className="bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100">
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Progress Note / Resolution Message */}
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 uppercase mb-1">
                  Timeline Action Note / Resolution Statement
                </label>
                <Textarea
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                  placeholder="Enter feedback for student tracking status or internal action taken..."
                  rows={3}
                />
              </div>

              {/* Timeline History */}
              <div className="border-t border-slate-100 dark:border-slate-800 pt-4">
                <h4 className="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <History className="w-3.5 h-3.5" />
                  Status Update History
                </h4>
                <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                  {selectedGrievance.statusTimeline.map((tl, idx) => (
                    <div key={idx} className="text-xs p-2.5 rounded bg-gray-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 flex items-start justify-between">
                      <div>
                        <span className="font-semibold text-indigo-700 dark:text-indigo-400">{tl.status}</span>: {tl.note}
                      </div>
                      <span className="text-[10px] text-gray-400 dark:text-slate-400 whitespace-nowrap ml-2">
                        {new Date(tl.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setSelectedGrievance(null)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={updating}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  {updating ? 'Saving Changes...' : 'Save & Route Grievance'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

