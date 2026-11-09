import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import {
  FileCheck2,
  Search,
  CheckCircle2,
  XCircle,
  AlertCircle,
  MapPin,
  Calendar,
  ExternalLink,
  Package,
  Users,
  ShieldCheck,
  User,
  Clock,
  Phone,
  GraduationCap,
  Eye,
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { StatusBadge } from '../../components/common/StatusBadge';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Dialog } from '../../components/ui/dialog';
import { Textarea } from '../../components/ui/textarea';
import { getFileUrl } from '../../utils/url';

export const LostFoundVerificationPage: React.FC = () => {
  const [items, setItems] = useState<any[]>([]);
  const [claims, setClaims] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Verification dialog
  const [verifyingItem, setVerifyingItem] = useState<any | null>(null);
  const [selectedClaim, setSelectedClaim] = useState<any | null>(null);
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [evidenceMatches, setEvidenceMatches] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const fetchItems = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/lost-found');
      if (res.data.success) {
        setItems(res.data.data.items);
        setClaims(res.data.data.claims);
      }
    } catch (err) {
      console.error('Failed to load items', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const openVerificationModal = (item: any, claimToSelect?: any) => {
    setVerifyingItem(item);
    const itemClaims = claims.filter(
      (c) => c.itemId?._id === item._id || c.itemId === item._id
    );

    if (claimToSelect) {
      setSelectedClaim(claimToSelect);
    } else if (itemClaims.length > 0) {
      // Prefer the first pending claim, else the first claim
      const pendingClaim = itemClaims.find((c) => c.status === 'PENDING');
      setSelectedClaim(pendingClaim || itemClaims[0]);
    } else {
      setSelectedClaim(null);
    }

    setResolutionNotes('');
    setEvidenceMatches(true);
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!verifyingItem) return;

    setActionLoading(true);
    setSuccessMessage('');
    try {
      const res = await api.post(`/admin/lost-found/${verifyingItem._id}/verify`, {
        claimId: selectedClaim?._id || undefined,
        resolutionNotes,
        evidenceMatches,
      });

      if (res.data.success) {
        setSuccessMessage(
          evidenceMatches
            ? 'Item ownership verified, claimant notified, and marked as RESOLVED.'
            : 'Claim rejected. Item retained in active status for reviewing other student claims.'
        );
        setVerifyingItem(null);
        setSelectedClaim(null);
        setResolutionNotes('');
        await fetchItems();
      }
    } catch (err: any) {
      console.error('Failed to verify item', err);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight flex items-center space-x-2.5">
          <FileCheck2 className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          <span>Lost & Found Ownership Verification</span>
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Inspect multiple student claims, audit student records, compare serial/invoice proof, and authorize item release.
        </p>
      </div>

      {successMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-semibold flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Reported Items List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-bold text-slate-900 dark:text-slate-100">
            Pending & Reported Campus Belongings ({items.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          {loading ? (
            <LoadingSpinner size="md" />
          ) : items.length === 0 ? (
            <p className="text-xs text-slate-400 dark:text-slate-500 text-center py-8">No reported items.</p>
          ) : (
            <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-900/90 border-b border-slate-200/80 dark:border-slate-800 text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider">
                <tr>
                  <th className="p-4">Item Details</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">Location</th>
                  <th className="p-4">Reporter</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Student Claims</th>
                  <th className="p-4 text-right">Verification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {items.map((item) => {
                  const itemClaims = claims.filter(
                    (c) => c.itemId?._id === item._id || c.itemId === item._id
                  );
                  const pendingCount = itemClaims.filter((c) => c.status === 'PENDING').length;

                  return (
                    <tr key={item._id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/70 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center space-x-3">
                          {item.imageUrl ? (
                            <Link
                              to={`/admin/image-view?url=${encodeURIComponent(item.imageUrl)}&title=${encodeURIComponent(
                                item.itemName
                              )}&source=${encodeURIComponent('Reported Campus Belonging')}&backUrl=/admin/lost-found`}
                              className="hover:opacity-80 transition-opacity block flex-shrink-0"
                              title="Click to view image in full page"
                            >
                              <img
                                src={getFileUrl(item.imageUrl)}
                                alt={item.itemName}
                                className="w-10 h-10 rounded-lg object-cover border border-slate-200 dark:border-slate-700"
                              />
                            </Link>
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700 flex items-center justify-center flex-shrink-0" title="No photo uploaded">
                              <Package className="w-5 h-5 text-slate-400 dark:text-slate-400" />
                            </div>
                          )}
                          <div>
                            <p className="font-bold text-slate-900 dark:text-slate-100">{item.itemName}</p>
                            <p className="text-[11px] text-slate-500 dark:text-slate-300 line-clamp-1">{item.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 font-bold">
                        <StatusBadge status={item.type} />
                      </td>
                      <td className="p-4 text-slate-700 dark:text-slate-200 font-medium">
                        {item.locationCategory} {item.locationDetails ? `(${item.locationDetails})` : ''}
                      </td>
                      <td className="p-4 text-slate-700 dark:text-slate-200 font-medium">
                        {item.reporterId?.name || 'Student'}
                      </td>
                      <td className="p-4">
                        <StatusBadge status={item.status} />
                      </td>
                      <td className="p-4">
                        {itemClaims.length === 0 ? (
                          <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
                            0 claims
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => openVerificationModal(item)}
                            className={`px-2.5 py-1 rounded-full text-[11px] font-bold border transition-colors flex items-center space-x-1.5 ${
                              pendingCount > 0
                                ? 'bg-amber-50 dark:bg-amber-950/70 border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-200 hover:bg-amber-100'
                                : 'bg-indigo-50 dark:bg-indigo-950/70 border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100'
                            }`}
                            title="Click to inspect all student claims for this item"
                          >
                            <Users className="w-3.5 h-3.5" />
                            <span>
                              {itemClaims.length} {itemClaims.length === 1 ? 'Claim' : 'Claims'}
                              {pendingCount > 0 && ` (${pendingCount} Pending)`}
                            </span>
                          </button>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        {item.status !== 'RESOLVED' ? (
                          <Button
                            size="sm"
                            variant="primary"
                            onClick={() => openVerificationModal(item)}
                          >
                            Verify & Resolve
                          </Button>
                        ) : (
                          <div className="flex items-center justify-end space-x-2">
                            <span className="text-emerald-700 dark:text-emerald-400 font-bold text-xs flex items-center">
                              <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Resolved
                            </span>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => openVerificationModal(item)}
                              className="text-xs"
                            >
                              Inspect
                            </Button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>

      {/* Multi-Student Claim Verification Dialog */}
      <Dialog
        isOpen={Boolean(verifyingItem)}
        onClose={() => setVerifyingItem(null)}
        title="Verify Ownership Evidence & Resolve Item"
        maxWidth="xl"
      >
        {verifyingItem && (() => {
          const itemClaims = claims.filter(
            (c) => c.itemId?._id === verifyingItem._id || c.itemId === verifyingItem._id
          );

          return (
            <form onSubmit={handleVerify} className="space-y-4 pt-1">
              {/* Item Info Summary */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center space-x-3.5">
                {verifyingItem.imageUrl ? (
                  <img
                    src={getFileUrl(verifyingItem.imageUrl)}
                    alt={verifyingItem.itemName}
                    className="w-14 h-14 rounded-xl object-cover border border-slate-200 dark:border-slate-700 flex-shrink-0"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0 text-slate-400 border border-slate-200 dark:border-slate-700">
                    <Package className="w-7 h-7" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <span className="font-extrabold text-slate-900 dark:text-slate-100 text-sm truncate">
                      {verifyingItem.itemName}
                    </span>
                    <StatusBadge status={verifyingItem.type} />
                    <StatusBadge status={verifyingItem.status} />
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-1 mt-0.5">
                    {verifyingItem.description}
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Location: <strong>{verifyingItem.locationCategory}</strong> {verifyingItem.locationDetails ? `(${verifyingItem.locationDetails})` : ''} • Reported by: <strong>{verifyingItem.reporterId?.name}</strong> ({verifyingItem.reporterId?.email})
                  </p>
                </div>
              </div>

              {/* Student Claims Section */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200">
                      Student Ownership Claims ({itemClaims.length})
                    </span>
                  </div>
                  {itemClaims.length > 1 && (
                    <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-800">
                      Multiple Students Claimed
                    </span>
                  )}
                </div>

                {itemClaims.length === 0 ? (
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-center text-xs text-slate-500 dark:text-slate-400">
                    No student claims logged for this item yet. You may perform a direct in-person physical handover at campus security.
                  </div>
                ) : (
                  <>
                    {/* Claimant Selector Tabs if multiple claims */}
                    {itemClaims.length > 1 && (
                      <div className="flex flex-wrap gap-2 p-2 bg-slate-100 dark:bg-slate-800/90 rounded-xl border border-slate-200/80 dark:border-slate-700">
                        {itemClaims.map((claim, idx) => (
                          <button
                            key={claim._id}
                            type="button"
                            onClick={() => {
                              setSelectedClaim(claim);
                              setEvidenceMatches(claim.status !== 'REJECTED');
                              setResolutionNotes(claim.reviewNotes || '');
                            }}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border flex items-center space-x-2 ${
                              selectedClaim?._id === claim._id
                                ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-indigo-300'
                            }`}
                          >
                            <span className="w-4 h-4 rounded-full bg-black/20 flex items-center justify-center text-[10px]">
                              {idx + 1}
                            </span>
                            <span>{claim.claimantId?.name}</span>
                            <span className="text-[10px] opacity-80 font-mono">
                              ({claim.claimantProfile?.rollNumber || 'Student'})
                            </span>
                            <span
                              className={`text-[9px] px-1.5 py-0.2 rounded font-extrabold uppercase ${
                                claim.status === 'APPROVED'
                                  ? 'bg-emerald-500 text-white'
                                  : claim.status === 'REJECTED'
                                  ? 'bg-rose-500 text-white'
                                  : 'bg-amber-400 text-slate-900'
                              }`}
                            >
                              {claim.status}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Detailed Card for Selected Student Claimant */}
                    {selectedClaim && (
                      <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs space-y-3">
                        {/* Student Identity Header */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/80 dark:border-slate-700 pb-3">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 font-extrabold flex items-center justify-center text-sm shadow-xs flex-shrink-0">
                              {selectedClaim.claimantId?.name?.charAt(0) || 'S'}
                            </div>
                            <div>
                              <div className="flex flex-wrap items-center gap-2">
                                <h4 className="font-extrabold text-sm text-slate-900 dark:text-slate-100">
                                  {selectedClaim.claimantId?.name}
                                </h4>
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 font-mono">
                                  Roll: {selectedClaim.claimantProfile?.rollNumber || 'N/A'}
                                </span>
                                <StatusBadge status={selectedClaim.status} />
                              </div>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                {selectedClaim.claimantId?.email}
                              </p>
                            </div>
                          </div>

                          {selectedClaim.claimantId?._id && (
                            <Link
                              to={`/admin/students/${selectedClaim.claimantId._id}`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center self-start sm:self-auto"
                            >
                              View Academic Record <ExternalLink className="w-3 h-3 ml-1" />
                            </Link>
                          )}
                        </div>

                        {/* Student Academic & Contact Details Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                          <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
                            <span className="text-[10px] font-bold uppercase text-slate-400 flex items-center">
                              <GraduationCap className="w-3 h-3 mr-1" /> Department & Batch
                            </span>
                            <p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                              {selectedClaim.claimantProfile?.department || 'CSE'} • Batch {selectedClaim.claimantProfile?.batchYear || '2026'}
                            </p>
                          </div>

                          <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
                            <span className="text-[10px] font-bold uppercase text-slate-400 flex items-center">
                              <Phone className="w-3 h-3 mr-1" /> Contact Phone
                            </span>
                            <p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5 select-all">
                              {selectedClaim.claimantProfile?.contactNumber || 'Not provided'}
                            </p>
                          </div>

                          <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
                            <span className="text-[10px] font-bold uppercase text-slate-400 flex items-center">
                              <Clock className="w-3 h-3 mr-1" /> Claim Submitted At
                            </span>
                            <p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                              {new Date(selectedClaim.createdAt).toLocaleString()}
                            </p>
                          </div>
                        </div>

                        {/* Evidence Submitted by this Student */}
                        <div className="space-y-2 pt-2 border-t border-slate-200/80 dark:border-slate-700">
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                              Claimant's Ownership Explanation:
                            </span>
                            <p className="mt-1 p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-slate-800 dark:text-slate-200 leading-relaxed">
                              {selectedClaim.claimDescription}
                            </p>
                          </div>

                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                              Supporting Proof & Serial / Marking Details:
                            </span>
                            <p className="mt-1 p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-slate-800 dark:text-slate-200 leading-relaxed font-mono">
                              {selectedClaim.proofDetails}
                            </p>
                          </div>

                          {selectedClaim.proofFileUrl && (
                            <div className="pt-1">
                              <Link
                                to={`/admin/image-view?url=${encodeURIComponent(
                                  selectedClaim.proofFileUrl
                                )}&title=${encodeURIComponent(
                                  `Ownership Proof - ${selectedClaim.claimantId?.name || 'Claimant'}`
                                )}&source=${encodeURIComponent('Submitted Ownership Proof')}&backUrl=/admin/lost-found`}
                                className="inline-flex items-center px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 font-bold text-xs transition-colors"
                              >
                                Inspect Uploaded Proof Document in New Page <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
                              </Link>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Evidence Evaluation Choice */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Verification Decision (Decision Table 5)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setEvidenceMatches(true)}
                    className={`p-3 rounded-xl border text-xs font-bold transition-all text-left flex flex-col justify-between ${
                      evidenceMatches
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-400 dark:border-emerald-700 text-emerald-800 dark:text-emerald-300 shadow-xs ring-2 ring-emerald-500/20'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <span className="font-extrabold flex items-center">
                      <CheckCircle2 className="w-4 h-4 mr-1.5 text-emerald-600 dark:text-emerald-400" />
                      Approve Claim & Mark Item Resolved
                    </span>
                    <span className="text-[10px] font-normal opacity-80 mt-1">
                      {selectedClaim
                        ? `Resolves item to ${selectedClaim.claimantId?.name}. Rejects any other pending claims.`
                        : 'Resolves item and records administrative handover.'}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setEvidenceMatches(false)}
                    className={`p-3 rounded-xl border text-xs font-bold transition-all text-left flex flex-col justify-between ${
                      !evidenceMatches
                        ? 'bg-rose-50 dark:bg-rose-950/60 border-rose-400 dark:border-rose-700 text-rose-800 dark:text-rose-300 shadow-xs ring-2 ring-rose-500/20'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <span className="font-extrabold flex items-center">
                      <XCircle className="w-4 h-4 mr-1.5 text-rose-600 dark:text-rose-400" />
                      Reject this Student's Claim
                    </span>
                    <span className="text-[10px] font-normal opacity-80 mt-1">
                      Evidence does not match. Keeps item active so other claims can still be audited.
                    </span>
                  </button>
                </div>
              </div>

              <Textarea
                label="Administrative Resolution Notes"
                rows={3}
                value={resolutionNotes}
                onChange={(e) => setResolutionNotes(e.target.value)}
                placeholder={
                  evidenceMatches
                    ? 'Notes on serial verification, student ID check, and hand-over release details...'
                    : 'Reason for claim rejection (e.g. serial numbers do not match, invoice date differs)...'
                }
                required
              />

              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <Button type="button" variant="outline" onClick={() => setVerifyingItem(null)}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant={evidenceMatches ? 'primary' : 'danger'}
                  isLoading={actionLoading}
                  className="font-bold"
                >
                  {evidenceMatches
                    ? 'Confirm Verification & Release Item'
                    : 'Confirm Claim Rejection'}
                </Button>
              </div>
            </form>
          );
        })()}
      </Dialog>
    </div>
  );
};
export default LostFoundVerificationPage;

