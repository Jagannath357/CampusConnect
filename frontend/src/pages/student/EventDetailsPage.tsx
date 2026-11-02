import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { CampusEvent, EventRegistration } from '../../types';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  ArrowLeft,
  Ticket,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { getFileUrl } from '../../utils/url';

export const EventDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();

  const [event, setEvent] = useState<CampusEvent | null>(null);
  const [isUserRegistered, setIsUserRegistered] = useState(false);
  const [registration, setRegistration] = useState<EventRegistration | null>(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const fetchEventDetails = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/events/${id}`);
      if (res.data.success) {
        setEvent(res.data.data.event);
        setIsUserRegistered(res.data.data.isUserRegistered);
        setRegistration(res.data.data.registration);
      }
    } catch (err) {
      console.error('Failed to load event details', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEventDetails();
  }, [id]);

  const handleRegister = async () => {
    setRegistering(true);
    setSuccessMessage('');
    setErrorMessage('');
    try {
      const res = await api.post(`/events/${id}/register`);
      if (res.data.success) {
        setSuccessMessage('Seat reservation confirmed! Your ticket token has been generated.');
        await fetchEventDetails();
      }
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || 'Failed to complete event reservation.');
    } finally {
      setRegistering(false);
    }
  };

  if (loading) {
    return <LoadingSpinner size="lg" className="h-64" />;
  }

  if (!event) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-bold text-slate-800">Event not found</h2>
        <Link to="/events" className="text-xs text-indigo-600 mt-2 inline-block">
          Return to campus events
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link
        to="/events"
        className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Campus Events
      </Link>

      {successMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <Card>
        <CardContent className="p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div>
              <span className="font-extrabold uppercase tracking-wider text-xs text-indigo-700 bg-indigo-50 border border-indigo-200 px-3 py-1 rounded-full">
                {event.category}
              </span>
              <h1 className="text-2xl font-black text-slate-900 mt-2 leading-snug">{event.title}</h1>
            </div>

            {/* Registration action */}
            <div>
              {isUserRegistered ? (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-center">
                  <span className="flex items-center justify-center font-bold text-xs text-emerald-700">
                    <CheckCircle2 className="w-4 h-4 mr-1.5" /> Seat Confirmed
                  </span>
                  {registration && (
                    <span className="block text-[11px] font-mono text-emerald-800 font-bold mt-1">
                      {registration.registrationToken}
                    </span>
                  )}
                </div>
              ) : event.availableSeats === 0 ? (
                <Button disabled variant="outline">
                  Maximum Capacity Reached
                </Button>
              ) : (
                <Button variant="primary" onClick={handleRegister} isLoading={registering}>
                  <Ticket className="w-4 h-4 mr-1.5" /> Reserve Seat ({event.availableSeats} Left)
                </Button>
              )}
            </div>
          </div>

          {/* Event Image */}
          {event.imageUrl && (
            <div className="rounded-2xl overflow-hidden max-h-80 bg-slate-100 border border-slate-200">
              <img src={getFileUrl(event.imageUrl)} alt={event.title} className="w-full h-full object-cover max-h-80" />
            </div>
          )}

          {/* Key Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100 text-xs">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-xl bg-white shadow-xs text-indigo-600">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold uppercase tracking-wider text-slate-400 text-[10px]">Date & Time</span>
                <p className="text-sm font-bold text-slate-800">
                  {new Date(event.date).toLocaleDateString()}
                </p>
                <p className="text-slate-500 text-[11px]">{event.startTime} - {event.endTime}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-xl bg-white shadow-xs text-indigo-600">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold uppercase tracking-wider text-slate-400 text-[10px]">Campus Venue</span>
                <p className="text-sm font-bold text-slate-800">{event.venue}</p>
                <p className="text-slate-500 text-[11px]">Silicon University Campus</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-xl bg-white shadow-xs text-indigo-600">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold uppercase tracking-wider text-slate-400 text-[10px]">Seat Capacity</span>
                <p className="text-sm font-bold text-slate-800">
                  {event.availableSeats} Seats Available
                </p>
                <p className="text-slate-500 text-[11px]">Total Capacity: {event.maxCapacity}</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Event Description</h3>
            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{event.description}</p>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Organized by: <strong>{event.organizer}</strong></span>
            <span>Silicon University Official Event</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

