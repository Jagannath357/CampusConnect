import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { EventRegistration } from '../../types';
import { Ticket, Calendar, Clock, MapPin, ArrowLeft, XCircle, CheckCircle2 } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { EmptyState } from '../../components/common/EmptyState';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';

export const MyRegistrationsPage: React.FC = () => {
  const [registrations, setRegistrations] = useState<EventRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedToCancel, setSelectedToCancel] = useState<EventRegistration | null>(null);
  const [cancelling, setCancelling] = useState(false);

  const fetchRegistrations = async () => {
    try {
      setLoading(true);
      const res = await api.get('/events/my-registrations');
      if (res.data.success) {
        setRegistrations(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load registrations', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const handleCancelRegistration = async () => {
    if (!selectedToCancel) return;
    setCancelling(true);
    try {
      await api.post(`/events/${selectedToCancel.eventId._id}/cancel`);
      setSelectedToCancel(null);
      await fetchRegistrations();
    } catch (err) {
      console.error('Failed to cancel registration', err);
    } finally {
      setCancelling(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight flex items-center space-x-2.5">
            <Ticket className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            <span>My Event Registrations</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Your reserved event passes and unique admission tokens for Silicon University events.
          </p>
        </div>

        <Link to="/events">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-1.5" /> Browse Events
          </Button>
        </Link>
      </div>

      {loading ? (
        <LoadingSpinner size="lg" className="h-64" />
      ) : registrations.length === 0 ? (
        <EmptyState
          icon={Ticket}
          title="No Event Bookings Found"
          description="You have not registered for any campus events yet. Explore upcoming hackathons and workshops."
          actionText="Browse Events"
          onAction={() => (window.location.href = '/events')}
        />
      ) : (
        <div className="space-y-4">
          {registrations.map((reg) => (
            <Card key={reg._id} className="overflow-hidden border-slate-200/80">
              <div className="flex flex-col md:flex-row">
                {/* Left Ticket Stub */}
                <div className="p-6 flex-1 space-y-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-extrabold uppercase bg-indigo-50 text-indigo-700 border border-indigo-200 px-2.5 py-0.5 rounded-full">
                      {reg.eventId?.category || 'Event'}
                    </span>
                    <span className="text-xs text-slate-400">•</span>
                    <span className="text-xs text-emerald-700 font-bold flex items-center">
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Confirmed Reservation
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 leading-snug">
                    {reg.eventId?.title}
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-500 pt-1">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      <span>{new Date(reg.eventId?.date).toLocaleDateString()}</span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-slate-400" />
                      <span>{reg.eventId?.startTime} - {reg.eventId?.endTime}</span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-slate-400" />
                      <span>{reg.eventId?.venue}</span>
                    </div>
                  </div>
                </div>

                {/* Right Ticket Barcode / Token Stub */}
                <div className="bg-slate-50 p-6 md:w-64 border-t md:border-t-0 md:border-l border-dashed border-slate-200 flex flex-col justify-between items-center text-center">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                      ADMISSION PASS TOKEN
                    </span>
                    <div className="mt-1 font-mono text-sm font-black text-indigo-700 bg-white px-3 py-1.5 rounded-lg border border-indigo-200 shadow-xs select-all">
                      {reg.registrationToken}
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1">Show this token at campus entry</p>
                  </div>

                  <div className="mt-4 pt-3 w-full border-t border-slate-200/60 flex items-center justify-between">
                    <Link to={`/events/${reg.eventId?._id}`} className="text-xs text-indigo-600 font-bold hover:underline">
                      View Event
                    </Link>
                    <button
                      onClick={() => setSelectedToCancel(reg)}
                      className="text-xs text-rose-600 hover:text-rose-800 font-medium"
                    >
                      Cancel Pass
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <ConfirmDialog
        isOpen={Boolean(selectedToCancel)}
        onClose={() => setSelectedToCancel(null)}
        onConfirm={handleCancelRegistration}
        title="Cancel Event Reservation"
        message="Are you sure you want to cancel your seat reservation? Your ticket token will be invalidated and released for other students."
        variant="danger"
        confirmText="Cancel Reservation"
        isLoading={cancelling}
      />
    </div>
  );
};

