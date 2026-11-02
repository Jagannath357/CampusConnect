import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import {
  AlertOctagon,
  Shield,
  CheckCircle,
  Copy,
  ArrowRight,
  ExternalLink,
  AlertCircle,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Textarea } from '../../components/ui/textarea';

const GRIEVANCE_CATEGORIES = [
  'Academic',
  'Hostel',
  'Mess/Canteen',
  'Infrastructure',
  'Harassment',
  'Transport',
  'Security',
  'Other',
];

export const GrievanceSubmitPage: React.FC = () => {
  const [category, setCategory] = useState('Academic');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [submittedTicket, setSubmittedTicket] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (description.trim().length < 20) {
      setErrorMessage('Please provide a detailed grievance description (min 20 characters).');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/grievances', {
        category,
        description,
      });

      if (res.data.success) {
        setSubmittedTicket(res.data.data.trackingTicket);
      }
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || 'Failed to submit grievance anonymously.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyTicket = () => {
    if (submittedTicket) {
      navigator.clipboard.writeText(submittedTicket);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight flex items-center space-x-2.5">
          <AlertOctagon className="w-6 h-6 text-rose-600 dark:text-rose-400" />
          <span>Anonymous Grievance Submission</span>
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Submit concerns or complaints to university administration with guaranteed, cryptographically enforced anonymity.
        </p>
      </div>

      {/* Anonymity Security Notice */}
      <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200/80 text-xs text-indigo-900 flex items-start space-x-3">
        <Shield className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold">Guaranteed Anonymity Protocol:</p>
          <p className="text-indigo-800 leading-relaxed">
            This module does <strong>NOT</strong> associate your user account, student ID, IP address, or session identifier with the grievance record. 
            Once submitted, your random tracking ticket is the <strong>only key</strong> to track resolution progress.
          </p>
        </div>
      </div>

      {submittedTicket ? (
        /* Success & Ticket Card */
        <Card className="border-emerald-300 bg-emerald-50/40">
          <CardContent className="p-8 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8" />
            </div>

            <div>
              <span className="text-xs font-black uppercase text-emerald-800 tracking-wider">
                Grievance Submitted Anonymously
              </span>
              <h2 className="text-xl font-black text-slate-900 mt-1">
                Save Your Tracking Ticket
              </h2>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                Please copy and store this random tracking ticket. University administrators will respond to this ticket without knowing your identity.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-emerald-200 shadow-sm inline-flex items-center space-x-3">
              <span className="font-mono text-lg font-black text-indigo-700 select-all tracking-wider">
                {submittedTicket}
              </span>
              <Button size="sm" variant="outline" onClick={handleCopyTicket}>
                <Copy className="w-3.5 h-3.5 mr-1" />
                {copied ? 'Copied!' : 'Copy'}
              </Button>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link to={`/grievance/track?ticket=${submittedTicket}`}>
                <Button variant="primary" size="sm">
                  Track Grievance Status <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSubmittedTicket(null);
                  setDescription('');
                }}
              >
                Submit Another Grievance
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        /* Submission Form */
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-bold text-slate-900">
              Submit Grievance Details
            </CardTitle>
          </CardHeader>

          <CardContent>
            {errorMessage && (
              <div className="mb-4 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Grievance Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="flex h-10 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500"
                >
                  {GRIEVANCE_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <Textarea
                label="Detailed Description"
                rows={6}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the issue, specific campus location, affected date or time, and any constructive suggestions for university administration..."
                required
              />

              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <Link to="/grievance/track" className="text-xs text-indigo-600 font-bold hover:underline">
                  Already have a ticket? Track status here
                </Link>

                <Button type="submit" variant="primary" isLoading={loading}>
                  Submit Anonymously
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

