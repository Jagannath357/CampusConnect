import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import {
  CalendarCheck,
  Plus,
  Users,
  Clock,
  MapPin,
  Eye,
  CheckCircle2,
  Calendar,
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { StatusBadge } from '../../components/common/StatusBadge';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Dialog } from '../../components/ui/dialog';
import { getFileUrl } from '../../utils/url';

export const AdminEventsPage: React.FC = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Attendees modal
  const [inspectingEvent, setInspectingEvent] = useState<any | null>(null);
  const [attendees, setAttendees] = useState<any[]>([]);
  const [loadingAttendees, setLoadingAttendees] = useState(false);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await api.get('/events?timeframe=all');
      if (res.data.success) {
        setEvents(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load events', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleInspectAttendees = async (event: any) => {
    setInspectingEvent(event);
    setLoadingAttendees(true);
    try {
      const res = await api.get(`/admin/events/${event._id}/registrations`);
      if (res.data.success) {
        setAttendees(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load registrations', err);
    } finally {
      setLoadingAttendees(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight flex items-center space-x-2.5">
            <CalendarCheck className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            <span>Official Event Management</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Publish official university seminars, workshops, and hackathons with real-time seat tracking.
          </p>
        </div>

        <Link to="/admin/events/create">
          <Button variant="primary" size="sm">
            <Plus className="w-4 h-4 mr-1.5" /> Publish New Event
          </Button>
        </Link>
      </div>

      <Card>
        <CardContent className="p-0 overflow-x-auto">
          {loading ? (
            <LoadingSpinner size="md" />
          ) : events.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-8">No campus events published yet.</p>
          ) : (
            <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-900/90 border-b border-slate-200/80 dark:border-slate-800 text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider">
                <tr>
                  <th className="p-4">Event Title</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Date & Time</th>
                  <th className="p-4">Venue</th>
                  <th className="p-4">Seat Capacity</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Attendees</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {events.map((evt) => (
                  <tr key={evt._id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/70 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        {evt.imageUrl && (
                          <Link
                            to={`/admin/image-view?url=${encodeURIComponent(evt.imageUrl)}&title=${encodeURIComponent(
                              evt.title
                            )}&source=${encodeURIComponent('Official Campus Event Poster')}&backUrl=/admin/events`}
                            className="block flex-shrink-0 hover:opacity-80 transition-opacity"
                            title="Click to view full event poster"
                          >
                            <img
                              src={getFileUrl(evt.imageUrl)}
                              alt={evt.title}
                              className="w-10 h-10 rounded-lg object-cover border border-slate-200 dark:border-slate-700"
                            />
                          </Link>
                        )}
                        <div>
                          <p className="font-bold text-slate-900 dark:text-slate-100">{evt.title}</p>
                          <p className="text-[11px] text-slate-400 dark:text-slate-400">{evt.organizer}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-[10px] font-extrabold uppercase bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 px-2.5 py-0.5 rounded-full border border-indigo-200 dark:border-indigo-800">
                        {evt.category}
                      </span>
                    </td>
                    <td className="p-4 text-slate-600 dark:text-slate-300">
                      {new Date(evt.date).toLocaleDateString()}
                      <span className="block text-[11px] text-slate-400 dark:text-slate-400">{evt.startTime} - {evt.endTime}</span>
                    </td>
                    <td className="p-4 text-slate-700 dark:text-slate-300 font-medium">{evt.venue}</td>
                    <td className="p-4">
                      <span className="font-bold text-indigo-700 dark:text-indigo-400">
                        {evt.availableSeats} / {evt.maxCapacity} available
                      </span>
                    </td>
                    <td className="p-4">
                      <StatusBadge status={evt.status} />
                    </td>
                    <td className="p-4 text-right">
                      <Button size="sm" variant="outline" onClick={() => handleInspectAttendees(evt)}>
                        <Users className="w-3.5 h-3.5 mr-1 text-indigo-600" />
                        View Attendees
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>

      {/* Attendees Inspection Dialog */}
      <Dialog
        isOpen={Boolean(inspectingEvent)}
        onClose={() => setInspectingEvent(null)}
        title={inspectingEvent?.title}
        description={`Registered attendees for this official campus event (${attendees.length} confirmed)`}
        maxWidth="lg"
      >
        <div className="space-y-4">
          {loadingAttendees ? (
            <LoadingSpinner size="md" />
          ) : attendees.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-8">
              No students have registered for this event yet.
            </p>
          ) : (
            <div className="max-h-96 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
              {attendees.map((att, idx) => (
                <div key={idx} className="py-3 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-bold text-slate-900 dark:text-slate-100">{att.student?.name}</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      {att.student?.email} • {att.profile?.department || 'Student'} • Roll: {att.profile?.rollNumber || 'N/A'}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-xs font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/70 px-2 py-0.5 rounded border border-indigo-200 dark:border-indigo-800">
                      {att.registrationToken}
                    </span>
                    <span className="block text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">
                      {new Date(att.registeredAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-end pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button variant="outline" size="sm" onClick={() => setInspectingEvent(null)}>
              Close
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

