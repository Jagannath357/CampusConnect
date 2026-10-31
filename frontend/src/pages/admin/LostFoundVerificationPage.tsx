import React, { useEffect, useState } from 'react';
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
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { StatusBadge } from '../../components/common/StatusBadge';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Dialog } from '../../components/ui/dialog';
import { Textarea } from '../../components/ui/textarea';

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
        setSuccessMessage('Item status verified and resolution logged successfully.');
        setVerifyingItem(null);
        setSelectedClaim(null);
        setResolutionNotes('');
        await fetchItems();
      }
    } catch (err) {
      console.error('Failed to verify item', err);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center space-x-2.5">
          <FileCheck2 className="w-6 h-6 text-indigo-600" />
          <span>Lost & Found Ownership Verification</span>
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Inspect photographic claims, compare ownership proof, and authorize final item release.
        </p>
      </div>

      {successMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Reported Items List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-bold text-slate-900">
            Pending & Reported Campus Belongings ({items.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          {loading ? (
            <LoadingSpinner size="md" />
          ) : items.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-8">No reported items.</p>
          ) : (
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 border-b border-slate-200/80 text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                <tr>
                  <th className="p-4">Item Details</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">Location</th>
                  <th className="p-4">Reporter</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Verification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {items.map((item) => (
                  <tr key={item._id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        {item.imageUrl ? (
                          <img
                            src={item.imageUrl}
                            alt={item.itemName}
                            className="w-10 h-10 rounded-lg object-cover border border-slate-200"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-400 flex items-center justify-center font-bold">
                            N/A
                          </div>
                        )}
                        <div>
                          <p className="font-bold text-slate-900">{item.itemName}</p>
                          <p className="text-[11px] text-slate-500 line-clamp-1">{item.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 font-bold">
                      <StatusBadge status={item.type} />
                    </td>
                    <td className="p-4 text-slate-600">
                      {item.locationCategory} {item.locationDetails ? `(${item.locationDetails})` : ''}
                    </td>
                    <td className="p-4 text-slate-600">
                      {item.reporterId?.name || 'Student'}
                    </td>
                    <td className="p-4">
                      <StatusBadge status={item.status} />
                    </td>
                    <td className="p-4 text-right">
                      {item.status !== 'RESOLVED' ? (
                        <Button
                          size="sm"
                          variant="primary"
                          onClick={() => {
                            setVerifyingItem(item);
                            // find claims for this item
                            const matchingClaim = claims.find(
                              (c) => c.itemId?._id === item._id || c.itemId === item._id
                            );
                            setSelectedClaim(matchingClaim || null);
                            setResolutionNotes('');
                            setEvidenceMatches(true);
                          }}
                        >
                          Verify & Resolve
                        </Button>
                      ) : (
                        <span className="text-emerald-700 font-bold text-xs">Resolved</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>

      {/* Verification Dialog */}
      <Dialog
        isOpen={Boolean(verifyingItem)}
        onClose={() => setVerifyingItem(null)}
        title="Verify Ownership Evidence & Resolve Item"
        maxWidth="lg"
      >
        {verifyingItem && (
          <form onSubmit={handleVerify} className="space-y-4 pt-2">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 text-sm">{verifyingItem.itemName}</span>
                <StatusBadge status={verifyingItem.type} />
              </div>
              <p className="text-slate-600">{verifyingItem.description}</p>
              <p className="text-slate-500 text-[11px]">
                Location: {verifyingItem.locationCategory} • Reported by: {verifyingItem.reporterId?.name}
              </p>
            </div>

            {selectedClaim ? (
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs space-y-2">
                <span className="font-bold uppercase text-amber-900 text-[10px]">
                  Submitted Ownership Claim Evidence
                </span>
                <p className="text-slate-800">
                  <strong>Claimant:</strong> {selectedClaim.claimantId?.name} ({selectedClaim.claimantId?.email})
                </p>
                <p className="text-slate-700">
                  <strong>Claim Explanation:</strong> {selectedClaim.claimDescription}
                </p>
                <p className="text-slate-700">
                  <strong>Proof Details:</strong> {selectedClaim.proofDetails}
                </p>
                {selectedClaim.proofFileUrl && (
                  <a
                    href={selectedClaim.proofFileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center text-indigo-600 hover:underline font-bold"
                  >
                    Inspect Uploaded Proof Document <ExternalLink className="w-3.5 h-3.5 ml-1" />
                  </a>
                )}
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic p-2 bg-slate-50 rounded-lg">
                No claim record on file. Direct in-person administrative verification.
              </p>
            )}

            {/* Evidence Evaluation Choice */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Ownership Verification Result (Decision Table 5)
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setEvidenceMatches(true)}
                  className={`p-3 rounded-xl border text-xs font-bold transition-all ${
                    evidenceMatches
                      ? 'bg-emerald-50 border-emerald-400 text-emerald-800 shadow-xs'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  ✓ Evidence Matches: Approve & Mark Resolved
                </button>
                <button
                  type="button"
                  onClick={() => setEvidenceMatches(false)}
                  className={`p-3 rounded-xl border text-xs font-bold transition-all ${
                    !evidenceMatches
                      ? 'bg-rose-50 border-rose-400 text-rose-800 shadow-xs'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  ✕ Evidence Mismatch: Retain Pending Verification
                </button>
              </div>
            </div>

            <Textarea
              label="Administrative Resolution Notes"
              rows={3}
              value={resolutionNotes}
              onChange={(e) => setResolutionNotes(e.target.value)}
              placeholder="Notes on serial check, student identity card verification, or reason for claim rejection..."
              required
            />

            <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100">
              <Button type="button" variant="outline" onClick={() => setVerifyingItem(null)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" isLoading={actionLoading}>
                Confirm Verification
              </Button>
            </div>
          </form>
        )}
      </Dialog>
    </div>
  );
};
