import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import api from '../../services/api';
import { Grievance } from '../../types';
import {
  Search,
  AlertOctagon,
  Clock,
  Building,
  CheckCircle2,
  ArrowLeft,
  AlertCircle,
  Shield,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { StatusBadge } from '../../components/common/StatusBadge';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

export const GrievanceTrackPage: React.FC = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const initialTicket = searchParams.get('ticket') || '';

  const [ticketInput, setTicketInput] = useState(initialTicket);
  const [grievance, setGrievance] = useState<Grievance | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleTrack = async (ticket: string) => {
    if (!ticket.trim()) return;
    setLoading(true);
    setErrorMessage('');
    setGrievance(null);

    try {
      const res = await api.get(`/grievances/track/${ticket.trim().toUpperCase()}`);
      if (res.data.success) {
        setGrievance(res.data.data);
      }
    } catch (err: any) {
      setErrorMessage(
        err.response?.data?.message || 'No grievance record found with this tracking ticket.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialTicket) {
      handleTrack(initialTicket);
    }
  }, [initialTicket]);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight flex items-center space-x-2.5">
            <Search className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            <span>Track Grievance Status</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Check live administrative resolution progress using your anonymous tracking ticket.
          </p>
        </div>

        <Link to="/grievance/submit">
          <Button variant="outline" size="sm">
            Submit New Grievance
          </Button>
        </Link>
      </div>

      {/* Ticket Lookup Input */}
      <Card>
        <CardContent className="p-6">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleTrack(ticketInput);
            }}
            className="flex flex-col sm:flex-row gap-3"
          >
            <div className="relative flex-1">
              <Input
                placeholder="Enter tracking ticket (e.g. GRV-2026-X8B9K2)"
                value={ticketInput}
                onChange={(e) => setTicketInput(e.target.value)}
                className="font-mono uppercase font-bold"
                required
              />
            </div>
            <Button type="submit" variant="primary" isLoading={loading}>
              <Search className="w-4 h-4 mr-1.5" /> Check Status
            </Button>
          </form>

          {errorMessage && (
            <div className="mt-4 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Grievance Result Card */}
      {grievance && (
        <Card className="animate-in fade-in duration-200">
          <CardHeader className="border-b border-slate-100 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  TRACKING TICKET
                </span>
                <span className="font-mono text-lg font-black text-indigo-700">
                  {grievance.trackingTicket}
                </span>
              </div>
              <StatusBadge status={grievance.status} />
            </div>
          </CardHeader>

          <CardContent className="p-6 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Category</span>
                <p className="text-sm font-bold text-slate-800 mt-0.5">{grievance.category}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Assigned Department</span>
                <p className="text-sm font-bold text-indigo-600 mt-0.5">
                  {grievance.assignedDepartment || 'Pending Administrative Routing'}
                </p>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Submitted Description</h4>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
                {grievance.description}
              </p>
            </div>

            {/* Status Timeline */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Resolution Progress Timeline</h4>
              <div className="space-y-3 relative pl-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                {grievance.statusTimeline?.map((item, idx) => (
                  <div key={idx} className="relative">
                    <div className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-indigo-600 ring-4 ring-white" />
                    <div className="text-xs">
                      <span className="font-bold text-slate-800">{item.status}</span>
                      <p className="text-slate-600 mt-0.5">{item.note}</p>
                      <span className="text-[10px] text-slate-400 block mt-0.5">
                        {new Date(item.updatedAt).toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

