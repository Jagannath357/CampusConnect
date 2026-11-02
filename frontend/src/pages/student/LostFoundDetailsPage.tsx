import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { LostFoundItem, OwnershipClaim } from '../../types';
import {
  Search,
  ArrowLeft,
  MapPin,
  Calendar,
  ShieldCheck,
  CheckCircle,
  AlertCircle,
  FileCheck,
  Upload,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { StatusBadge } from '../../components/common/StatusBadge';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { getFileUrl } from '../../utils/url';

export const LostFoundDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();

  const [item, setItem] = useState<LostFoundItem | null>(null);
  const [claims, setClaims] = useState<OwnershipClaim[]>([]);
  const [loading, setLoading] = useState(true);

  // Claim form
  const [claimDescription, setClaimDescription] = useState('');
  const [proofDetails, setProofDetails] = useState('');
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [submittingClaim, setSubmittingClaim] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const fetchItemDetails = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/lost-found/${id}`);
      if (res.data.success) {
        setItem(res.data.data.item);
        setClaims(res.data.data.claims || []);
      }
    } catch (err) {
      console.error('Failed to load lost & found details', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItemDetails();
  }, [id]);

  const handleClaimSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');

    if (claimDescription.length < 10 || proofDetails.length < 10) {
      setErrorMessage('Please provide detailed description and verification proof (min 10 chars each).');
      return;
    }

    const formData = new FormData();
    formData.append('claimDescription', claimDescription);
    formData.append('proofDetails', proofDetails);
    if (proofFile) {
      formData.append('proofFile', proofFile);
    }

    setSubmittingClaim(true);
    try {
      const res = await api.post(`/lost-found/${id}/claim`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (res.data.success) {
        setSuccessMessage('Ownership claim submitted successfully. Campus administration will review your evidence.');
        setClaimDescription('');
        setProofDetails('');
        setProofFile(null);
        await fetchItemDetails();
      }
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || 'Failed to submit ownership claim.');
    } finally {
      setSubmittingClaim(false);
    }
  };

  if (loading) {
    return <LoadingSpinner size="lg" className="h-64" />;
  }

  if (!item) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-bold text-slate-800">Item not found</h2>
        <Link to="/lost-found" className="text-xs text-indigo-600 mt-2 inline-block">
          Return to Lost & Found
        </Link>
      </div>
    );
  }

  const isReporter = user?._id === item.reporterId?._id;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link
        to="/lost-found"
        className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Lost & Found
      </Link>

      {successMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center space-x-2">
          <CheckCircle className="w-4 h-4 flex-shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Item Details Card */}
      <Card>
        <CardContent className="p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-slate-100">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <StatusBadge status={item.type} />
                <StatusBadge status={item.status} />
              </div>
              <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100">{item.itemName}</h1>
            </div>

            <div className="text-left sm:text-right text-xs text-slate-500">
              <span className="block font-semibold">Reported on</span>
              <span>{new Date(item.dateOccurred).toLocaleDateString()}</span>
            </div>
          </div>

          {/* Photo if present */}
          {item.imageUrl && (
            <div className="rounded-2xl overflow-hidden max-h-80 bg-slate-100 border border-slate-200">
              <img
                src={getFileUrl(item.imageUrl)}
                alt={item.itemName}
                className="w-full h-full object-cover max-h-80"
              />
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700 text-xs">
            <div>
              <span className="font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400">Location Area</span>
              <p className="text-sm font-bold text-slate-800 dark:text-slate-100 mt-0.5">{item.locationCategory}</p>
              {item.locationDetails && (
                <p className="text-slate-500 dark:text-slate-400 mt-0.5">{item.locationDetails}</p>
              )}
            </div>

            <div>
              <span className="font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400">Reporter</span>
              <p className="text-sm font-bold text-slate-800 dark:text-slate-100 mt-0.5">{item.reporterId?.name}</p>
              <p className="text-slate-500 dark:text-slate-400 mt-0.5">{item.reporterId?.email}</p>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400 mb-2">Item Description</h3>
            <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed whitespace-pre-wrap">{item.description}</p>
          </div>

          {item.status === 'RESOLVED' && (
            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 text-xs space-y-1">
              <div className="flex items-center space-x-1.5 font-bold">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Verified & Resolved by Administration</span>
              </div>
              {item.resolutionNotes && <p className="text-emerald-800 dark:text-emerald-300">{item.resolutionNotes}</p>}
              {item.resolvedAt && (
                <p className="text-slate-500 text-[11px]">
                  Resolved at: {new Date(item.resolvedAt).toLocaleString()}
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Claim Form for other students if Found Item and not yet Resolved */}
      {!isReporter && item.status !== 'RESOLVED' && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-bold flex items-center space-x-2">
              <FileCheck className="w-5 h-5 text-indigo-600" />
              <span>Claim Ownership of this Item</span>
            </CardTitle>
            <p className="text-xs text-slate-500">
              Provide unique identifying details, marks, or purchase invoice proof. Admin will verify before release.
            </p>
          </CardHeader>
          <CardContent>
            {errorMessage && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleClaimSubmit} className="space-y-4">
              <Textarea
                label="Why is this your item?"
                rows={3}
                value={claimDescription}
                onChange={(e) => setClaimDescription(e.target.value)}
                placeholder="Explain when and where you lost it, along with identifiable marks..."
                required
              />

              <Textarea
                label="Supporting Proof Details"
                rows={3}
                value={proofDetails}
                onChange={(e) => setProofDetails(e.target.value)}
                placeholder="Provide serial numbers, passcode description, stickers, unique contents..."
                required
              />

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Supporting Document / Photo Proof (Optional)
                </label>
                <input
                  type="file"
                  onChange={(e) => setProofFile(e.target.files?.[0] || null)}
                  className="text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                />
              </div>

              <div className="flex justify-end pt-2">
                <Button type="submit" variant="primary" size="sm" isLoading={submittingClaim}>
                  Submit Ownership Claim
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* If reporter or admin: List claims submitted on this item */}
      {(isReporter || user?.role === 'ADMIN') && claims.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-bold">
              Submitted Claims on this Item ({claims.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {claims.map((claim) => (
              <div key={claim._id} className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 dark:text-slate-100">{claim.claimantId?.name} ({claim.claimantId?.email})</span>
                  <StatusBadge status={claim.status} />
                </div>
                <p className="text-slate-700 dark:text-slate-200 leading-relaxed"><strong>Claim:</strong> {claim.claimDescription}</p>
                <p className="text-slate-600 dark:text-slate-300"><strong>Proof:</strong> {claim.proofDetails}</p>
                {claim.proofFileUrl && (
                  <a href={getFileUrl(claim.proofFileUrl)} target="_blank" rel="noreferrer" className="text-indigo-600 dark:text-indigo-400 hover:underline font-semibold block">
                    View Attached Proof File
                  </a>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

