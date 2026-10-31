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
  Briefcase, 
  Plus, 
  Calendar, 
  MapPin, 
  GraduationCap, 
  DollarSign, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle,
  Clock,
  Building,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';

interface PlacementItem {
  _id: string;
  companyName: string;
  jobTitle: string;
  jobDescription: string;
  minimumCgpa: number;
  eligibleBranches: string[];
  packageDetails?: string;
  location?: string;
  applicationDeadline: string;
  applicationUrl?: string;
  contactEmail?: string;
  status: 'ACTIVE' | 'CLOSED';
  createdAt: string;
}

const AVAILABLE_BRANCHES = ['CSE', 'CST', 'ECE', 'EEE', 'IT', 'MECH', 'CIVIL'];

export const AdminPlacementPage: React.FC = () => {
  const [placements, setPlacements] = useState<PlacementItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form State
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [companyName, setCompanyName] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [minimumCgpa, setMinimumCgpa] = useState<number | string>(7.0);
  const [eligibleBranches, setEligibleBranches] = useState<string[]>(['CSE', 'ECE', 'IT']);
  const [packageDetails, setPackageDetails] = useState('');
  const [location, setLocation] = useState('Bhubaneswar / Hybrid');
  const [applicationDeadline, setApplicationDeadline] = useState('');
  const [applicationUrl, setApplicationUrl] = useState('');
  const [contactEmail, setContactEmail] = useState('');

  const fetchPlacements = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get('/admin/placements');
      if (res.data.success) {
        setPlacements(res.data.data);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch placements.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlacements();
  }, []);

  const handleOpenCreate = () => {
    setEditingId(null);
    setCompanyName('');
    setJobTitle('');
    setJobDescription('');
    setMinimumCgpa(7.0);
    setEligibleBranches(['CSE', 'ECE', 'IT']);
    setPackageDetails('');
    setLocation('Bhubaneswar / Hybrid');
    setApplicationDeadline('');
    setApplicationUrl('');
    setContactEmail('');
    setShowModal(true);
  };

  const handleBranchToggle = (branch: string) => {
    if (eligibleBranches.includes(branch)) {
      setEligibleBranches(eligibleBranches.filter((b) => b !== branch));
    } else {
      setEligibleBranches([...eligibleBranches, branch]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (eligibleBranches.length === 0) {
      setError('Please select at least one eligible academic branch.');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      setSuccess(null);

      const payload = {
        companyName,
        jobTitle,
        jobDescription,
        minimumCgpa: Number(minimumCgpa),
        eligibleBranches,
        packageDetails: packageDetails || undefined,
        location: location || undefined,
        applicationDeadline: new Date(applicationDeadline).toISOString(),
        applicationUrl: applicationUrl || undefined,
        contactEmail: contactEmail || undefined,
      };

      if (editingId) {
        await api.put(`/admin/placements/${editingId}`, payload);
        setSuccess('Placement opportunity updated successfully.');
      } else {
        await api.post('/admin/placements', payload);
        setSuccess('New placement drive announced and published successfully.');
      }

      setShowModal(false);
      fetchPlacements();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save placement drive.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (item: PlacementItem) => {
    const nextStatus = item.status === 'ACTIVE' ? 'CLOSED' : 'ACTIVE';
    try {
      const res = await api.put(`/admin/placements/${item._id}`, { status: nextStatus });
      if (res.data.success) {
        setSuccess(`Placement drive "${item.companyName}" marked as ${nextStatus}.`);
        fetchPlacements();
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update status.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-xl p-6 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-200">
              <Briefcase className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                Campus Placement Management
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-500/30 text-blue-200 border border-blue-400/30">
                  Module 20
                </span>
              </h1>
              <p className="text-sm text-blue-200/80">
                Publish recruitment drives, specify branch/CGPA eligibility requirements, and track deadlines.
              </p>
            </div>
          </div>
          <Button
            onClick={handleOpenCreate}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold flex items-center gap-2 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Post Placement Drive
          </Button>
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

      {/* Placements Cards */}
      {loading ? (
        <div className="py-16 text-center">
          <LoadingSpinner />
          <p className="text-sm text-gray-500 mt-2">Loading placement records...</p>
        </div>
      ) : placements.length === 0 ? (
        <EmptyState
          title="No Placement Drives Published"
          description="Click 'Post Placement Drive' above to publish campus recruitment drives for eligible students."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {placements.map((item) => (
            <Card key={item._id} className="border-gray-200 hover:border-blue-300 transition-all flex flex-col justify-between shadow-sm">
              <CardHeader className="p-4 pb-2 border-b bg-gray-50/50">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-base text-gray-900">{item.companyName}</span>
                  <StatusBadge status={item.status} />
                </div>
                <h4 className="text-sm font-semibold text-blue-700 mt-1">{item.jobTitle}</h4>
              </CardHeader>

              <CardContent className="p-4 flex-1 flex flex-col justify-between space-y-4">
                <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">
                  {item.jobDescription}
                </p>

                <div className="space-y-1.5 text-xs text-gray-600 bg-slate-50 p-3 rounded-lg border">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 font-medium">
                      <GraduationCap className="w-3.5 h-3.5 text-blue-600" />
                      Min CGPA:
                    </span>
                    <span className="font-bold text-gray-800">{item.minimumCgpa.toFixed(1)}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 font-medium">
                      <DollarSign className="w-3.5 h-3.5 text-blue-600" />
                      Package:
                    </span>
                    <span className="font-bold text-gray-800">{item.packageDetails || 'As per norms'}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 font-medium">
                      <Clock className="w-3.5 h-3.5 text-blue-600" />
                      Deadline:
                    </span>
                    <span className="font-semibold text-red-600">
                      {new Date(item.applicationDeadline).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="pt-2 border-t mt-1">
                    <span className="text-[11px] text-gray-500 font-semibold uppercase">Branches:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {item.eligibleBranches.map((b) => (
                        <span key={b} className="bg-blue-100 text-blue-800 text-[10px] font-bold px-1.5 py-0.5 rounded">
                          {b}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t flex items-center justify-between">
                  <button
                    onClick={() => handleToggleStatus(item)}
                    className="text-xs font-semibold text-gray-600 hover:text-gray-900 flex items-center gap-1"
                  >
                    {item.status === 'ACTIVE' ? (
                      <>
                        <ToggleRight className="w-4 h-4 text-green-600" /> Mark Closed
                      </>
                    ) : (
                      <>
                        <ToggleLeft className="w-4 h-4 text-gray-400" /> Mark Active
                      </>
                    )}
                  </button>

                  {item.applicationUrl && (
                    <a
                      href={item.applicationUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-blue-600 hover:underline flex items-center gap-1 font-semibold"
                    >
                      Application Link <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Creation / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-200">
            <div className="p-6 border-b bg-gray-50 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">
                {editingId ? 'Edit Placement Opportunity' : 'Publish New Campus Placement Drive'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 font-bold text-xl px-2"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Company Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g., Tata Consultancy Services"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Job Title / Role <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    placeholder="e.g., Associate Software Engineer"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Job Description & Roles <span className="text-red-500">*</span>
                </label>
                <Textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Outline responsibilities, required skillsets, interview rounds..."
                  rows={3}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Minimum CGPA <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="number"
                    step="0.1"
                    min="0"
                    max="10"
                    value={minimumCgpa}
                    onChange={(e) => setMinimumCgpa(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Package / CTC
                  </label>
                  <Input
                    value={packageDetails}
                    onChange={(e) => setPackageDetails(e.target.value)}
                    placeholder="e.g., 7.5 LPA"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Work Location
                  </label>
                  <Input
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g., Bhubaneswar / Bangalore"
                  />
                </div>
              </div>

              {/* Eligible Branches */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">
                  Eligible Academic Branches <span className="text-red-500">*</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {AVAILABLE_BRANCHES.map((b) => {
                    const isSelected = eligibleBranches.includes(b);
                    return (
                      <button
                        type="button"
                        key={b}
                        onClick={() => handleBranchToggle(b)}
                        className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all ${
                          isSelected
                            ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {b}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Application Deadline <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="datetime-local"
                    value={applicationDeadline}
                    onChange={(e) => setApplicationDeadline(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Application URL / Registration Portal
                  </label>
                  <Input
                    type="url"
                    value={applicationUrl}
                    onChange={(e) => setApplicationUrl(e.target.value)}
                    placeholder="https://careers.company.com/apply"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={submitting}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {submitting ? 'Publishing...' : 'Publish Placement Drive'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
