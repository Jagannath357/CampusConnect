import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { LostFoundItem } from '../../types';
import {
  Search,
  Plus,
  MapPin,
  Calendar,
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  ArrowRight,
  Filter,
  FileCheck,
  Package,
  Upload,
  User,
  ShieldAlert,
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Dialog } from '../../components/ui/dialog';
import { Card, CardContent } from '../../components/ui/card';
import { StatusBadge } from '../../components/common/StatusBadge';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { EmptyState } from '../../components/common/EmptyState';
import { getFileUrl } from '../../utils/url';

const LOCATION_CATEGORIES = [
  'ALL',
  'Library',
  'Hostel',
  'Academic Block',
  'Cafeteria',
  'Sports Complex',
  'Auditorium',
  'Campus Grounds',
];

export const LostFoundListPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [items, setItems] = useState<LostFoundItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState<'ALL' | 'LOST' | 'FOUND'>('ALL');
  const [selectedLocation, setSelectedLocation] = useState('ALL');

  // Claim Modal state
  const [claimModalItem, setClaimModalItem] = useState<LostFoundItem | null>(null);
  const [claimDescription, setClaimDescription] = useState('');
  const [proofDetails, setProofDetails] = useState('');
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [submittingClaim, setSubmittingClaim] = useState(false);
  const [claimSuccessMessage, setClaimSuccessMessage] = useState('');
  const [claimErrorMessage, setClaimErrorMessage] = useState('');

  const fetchItems = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (selectedType !== 'ALL') params.append('type', selectedType);
      if (selectedLocation !== 'ALL') params.append('locationCategory', selectedLocation);

      const res = await api.get(`/lost-found?${params.toString()}`);
      if (res.data.success) {
        setItems(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load lost and found items', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [search, selectedType, selectedLocation]);

  const handleOpenClaimModal = (item: LostFoundItem) => {
    setClaimModalItem(item);
    setClaimDescription('');
    setProofDetails('');
    setProofFile(null);
    setClaimErrorMessage('');
    setClaimSuccessMessage('');
  };

  const handleClaimSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!claimModalItem) return;

    setClaimErrorMessage('');
    setClaimSuccessMessage('');

    if (claimDescription.trim().length < 10) {
      setClaimErrorMessage('Please provide a descriptive explanation (min 10 characters).');
      return;
    }
    if (proofDetails.trim().length < 10) {
      setClaimErrorMessage('Please provide specific verification proof details (min 10 characters).');
      return;
    }

    const formData = new FormData();
    formData.append('claimDescription', claimDescription.trim());
    formData.append('proofDetails', proofDetails.trim());
    if (proofFile) {
      formData.append('proofFile', proofFile);
    }

    setSubmittingClaim(true);
    try {
      const res = await api.post(`/lost-found/${claimModalItem._id}/claim`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data.success) {
        setClaimSuccessMessage('Ownership claim submitted successfully! Campus administration will review your claim.');

        // Update local item list to reflect claim immediately
        setItems((prev) =>
          prev.map((i) =>
            i._id === claimModalItem._id
              ? {
                  ...i,
                  hasUserClaimed: true,
                  userClaimStatus: 'PENDING',
                  claimCount: (i.claimCount || 0) + 1,
                }
              : i
          )
        );

        if (res.data.data?.proofFileUrl) {
          setTimeout(() => {
            navigate(
              `/image-view?url=${encodeURIComponent(res.data.data.proofFileUrl)}&title=${encodeURIComponent(
                `Ownership Proof - ${claimModalItem.itemName}`
              )}&source=${encodeURIComponent('Submitted Ownership Proof')}&backUrl=/lost-found`
            );
          }, 1000);
        } else {
          setTimeout(() => {
            setClaimModalItem(null);
          }, 1500);
        }
      }
    } catch (err: any) {
      setClaimErrorMessage(
        err.response?.data?.message || 'Failed to submit ownership claim. Please try again.'
      );
    } finally {
      setSubmittingClaim(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight flex items-center space-x-2.5">
            <Search className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            <span>Lost & Found Hub</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Report misplaced campus belongings or claim ownership of recovered items.
          </p>
        </div>

        <Link to="/lost-found/report">
          <Button variant="primary" size="sm">
            <Plus className="w-4 h-4 mr-1.5" /> Report Lost / Found Item
          </Button>
        </Link>
      </div>

      {/* Global alert if claim was submitted */}
      {claimSuccessMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-semibold flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{claimSuccessMessage}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs transition-colors">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <Input
            placeholder="Search items by name, location, or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Type toggle */}
        <div className="flex items-center space-x-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200/60 dark:border-slate-700">
          {(['ALL', 'LOST', 'FOUND'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                selectedType === type
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {type === 'ALL' ? 'All Items' : type}
            </button>
          ))}
        </div>
      </div>

      {/* Items Grid */}
      {loading ? (
        <LoadingSpinner size="lg" className="h-64" />
      ) : items.length === 0 ? (
        <EmptyState
          icon={Search}
          title="No Lost or Found Items Found"
          description="Have you lost or found something around the campus? Submit a report now."
          actionText="Report Item"
          onAction={() => (window.location.href = '/lost-found/report')}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((item) => (
            <Card
              key={item._id}
              className="flex flex-col justify-between hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-700 transition-all border-slate-200/80 dark:border-slate-800 dark:bg-slate-900 overflow-hidden"
            >
              <div>
                {/* Photo if present */}
                {item.imageUrl ? (
                  <Link
                    to={`/image-view?url=${encodeURIComponent(item.imageUrl)}&title=${encodeURIComponent(
                      item.itemName
                    )}&source=${encodeURIComponent('Reported Campus Belonging')}&backUrl=/lost-found`}
                    className="block h-44 w-full overflow-hidden bg-slate-100 dark:bg-slate-800 relative group cursor-pointer"
                    title="Click to view photo in full page"
                  >
                    <img
                      src={getFileUrl(item.imageUrl)}
                      alt={item.itemName}
                      className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-200"
                    />
                    <div className="absolute top-2.5 left-2.5 flex items-center space-x-1.5">
                      <StatusBadge status={item.type} />
                      <StatusBadge status={item.status} />
                    </div>

                    <div className="absolute top-2.5 right-2.5 flex flex-col items-end gap-1">
                      {typeof item.claimCount === 'number' && item.claimCount > 0 && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-900/80 backdrop-blur-xs text-white border border-slate-700 shadow-xs flex items-center">
                          <FileCheck className="w-3 h-3 mr-1 text-indigo-400" />
                          {item.claimCount} {item.claimCount === 1 ? 'Claim' : 'Claims'}
                        </span>
                      )}
                      {item.hasUserClaimed && (
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-500 text-white shadow-xs">
                          {item.userClaimStatus === 'APPROVED'
                            ? 'Claim Approved'
                            : item.userClaimStatus === 'REJECTED'
                            ? 'Claim Rejected'
                            : 'Claim Submitted'}
                        </span>
                      )}
                    </div>

                    <div className="absolute bottom-2 right-2 bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                      View Image &rarr;
                    </div>
                  </Link>
                ) : (
                  <div className="p-4 pb-0 flex items-center justify-between">
                    <div className="flex items-center space-x-1.5">
                      <StatusBadge status={item.type} />
                      <StatusBadge status={item.status} />
                    </div>
                    <div className="flex items-center space-x-1.5">
                      {typeof item.claimCount === 'number' && item.claimCount > 0 && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 flex items-center">
                          <FileCheck className="w-3 h-3 mr-1 text-indigo-500" />
                          {item.claimCount} {item.claimCount === 1 ? 'Claim' : 'Claims'}
                        </span>
                      )}
                      {item.hasUserClaimed && (
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-500 text-white shadow-xs">
                          {item.userClaimStatus === 'APPROVED'
                            ? 'Approved'
                            : item.userClaimStatus === 'REJECTED'
                            ? 'Rejected'
                            : 'Claimed'}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                <CardContent className="p-5 space-y-2">
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 leading-snug line-clamp-1">
                    {item.itemName}
                  </h3>

                  <div className="flex items-center space-x-2 text-xs text-slate-500 dark:text-slate-400">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <span>
                      {item.locationCategory} {item.locationDetails ? `(${item.locationDetails})` : ''}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed pt-1">
                    {item.description}
                  </p>
                </CardContent>
              </div>

              {/* Card Footer with prominent Claim Button & Details Link */}
              <div className="px-5 py-3.5 bg-slate-50 dark:bg-slate-900/90 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 text-xs">
                <div className="flex items-center space-x-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                  <Calendar className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                  <span>{new Date(item.dateOccurred).toLocaleDateString()}</span>
                </div>

                <div className="flex items-center space-x-2 justify-end">
                  <Link
                    to={`/lost-found/${item._id}`}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold text-xs transition-colors flex items-center justify-center"
                  >
                    Details <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </Link>

                  {item.status === 'RESOLVED' ? (
                    <Button size="sm" variant="secondary" disabled className="text-xs font-bold opacity-60">
                      Resolved
                    </Button>
                  ) : item.reporterId?._id === user?._id ? (
                    <Button size="sm" variant="secondary" disabled className="text-xs font-semibold opacity-60">
                      Your Report
                    </Button>
                  ) : item.hasUserClaimed && item.userClaimStatus === 'PENDING' ? (
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/40 text-xs font-bold flex items-center"
                      onClick={() => handleOpenClaimModal(item)}
                    >
                      <FileCheck className="w-3.5 h-3.5 mr-1 text-amber-600 dark:text-amber-400" />
                      Claimed (Pending)
                    </Button>
                  ) : item.hasUserClaimed && item.userClaimStatus === 'APPROVED' ? (
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 text-xs font-bold flex items-center"
                      disabled
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                      Approved
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="primary"
                      className="text-xs font-bold shadow-xs flex items-center"
                      onClick={() => handleOpenClaimModal(item)}
                    >
                      <FileCheck className="w-3.5 h-3.5 mr-1" />
                      Claim Item
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Interactive Claim Item Modal */}
      <Dialog
        isOpen={Boolean(claimModalItem)}
        onClose={() => setClaimModalItem(null)}
        title="Claim Ownership of Reported Item"
        maxWidth="lg"
      >
        {claimModalItem && (
          <form onSubmit={handleClaimSubmit} className="space-y-4 pt-1">
            {/* Item summary banner */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center space-x-3.5">
              {claimModalItem.imageUrl ? (
                <img
                  src={getFileUrl(claimModalItem.imageUrl)}
                  alt={claimModalItem.itemName}
                  className="w-14 h-14 rounded-xl object-cover border border-slate-200 dark:border-slate-700 flex-shrink-0"
                />
              ) : (
                <div className="w-14 h-14 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0 text-slate-400 border border-slate-200 dark:border-slate-700">
                  <Package className="w-7 h-7" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <StatusBadge status={claimModalItem.type} />
                  <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                    Location: {claimModalItem.locationCategory}
                  </span>
                </div>
                <h4 className="font-extrabold text-sm text-slate-900 dark:text-slate-100 truncate mt-0.5">
                  {claimModalItem.itemName}
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                  {claimModalItem.description}
                </p>
              </div>
            </div>

            {/* Informational Advisory */}
            <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800 text-[11px] text-indigo-900 dark:text-indigo-200 flex items-start space-x-2">
              <ShieldAlert className="w-4 h-4 text-indigo-600 dark:text-indigo-400 flex-shrink-0 mt-0.5" />
              <p>
                Multiple students can claim the same item. Campus Administration inspects all claims and compares serial numbers, invoice records, or distinctive marks before releasing the item.
              </p>
            </div>

            {claimErrorMessage && (
              <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/70 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-xs font-semibold flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{claimErrorMessage}</span>
              </div>
            )}

            {claimSuccessMessage && (
              <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-semibold flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>{claimSuccessMessage}</span>
              </div>
            )}

            <div>
              <Textarea
                label="Why is this your item? (Explanation & Date/Time lost)"
                rows={3}
                value={claimDescription}
                onChange={(e) => setClaimDescription(e.target.value)}
                placeholder="Explain when and where you lost it, along with recognizable characteristics..."
                required
              />
            </div>

            <div>
              <Textarea
                label="Supporting Proof Details (Identifiers, Serial Numbers, Markings)"
                rows={3}
                value={proofDetails}
                onChange={(e) => setProofDetails(e.target.value)}
                placeholder="Provide serial numbers, passcodes, stickers, scratches, internal contents, brand model..."
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Upload Supporting Proof Document / Photo / Invoice (Optional)
              </label>
              <div className="flex items-center space-x-3">
                <input
                  type="file"
                  id="claim-proof-file"
                  accept="image/*,application/pdf"
                  onChange={(e) => setProofFile(e.target.files?.[0] || null)}
                  className="hidden"
                />
                <label
                  htmlFor="claim-proof-file"
                  className="cursor-pointer inline-flex items-center px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                >
                  <Upload className="w-3.5 h-3.5 mr-1.5" />
                  {proofFile ? 'Change File' : 'Choose Proof Photo or Invoice'}
                </label>
                {proofFile && (
                  <span className="text-xs text-indigo-600 dark:text-indigo-400 font-medium truncate max-w-xs">
                    {proofFile.name}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
                Accepted formats: JPG, PNG, WEBP, PDF (max 10MB).
              </p>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <Button
                type="button"
                variant="outline"
                onClick={() => setClaimModalItem(null)}
                disabled={submittingClaim}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                isLoading={submittingClaim}
                className="font-bold flex items-center"
              >
                <FileCheck className="w-4 h-4 mr-1.5" />
                Submit Ownership Claim
              </Button>
            </div>
          </form>
        )}
      </Dialog>
    </div>
  );
};

