import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { CampusEvent } from '../../types';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Search,
  Filter,
  CheckCircle2,
  Ticket,
  ArrowRight,
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent } from '../../components/ui/card';
import { StatusBadge } from '../../components/common/StatusBadge';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { EmptyState } from '../../components/common/EmptyState';
import { getFileUrl } from '../../utils/url';

const CATEGORIES = ['ALL', 'Technical', 'Workshop', 'Cultural', 'Sports', 'Seminar', 'Hackathon'];

export const EventsListPage: React.FC = () => {
  const [events, setEvents] = useState<CampusEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [timeframe, setTimeframe] = useState<'upcoming' | 'past'>('upcoming');

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (selectedCategory !== 'ALL') params.append('category', selectedCategory);
      params.append('timeframe', timeframe);

      const res = await api.get(`/events?${params.toString()}`);
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
  }, [search, selectedCategory, timeframe]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight flex items-center space-x-2.5">
            <Calendar className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            <span>Campus Events & Workshops</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Discover official university events, hackathons, and technical workshops with instant seat reservations.
          </p>
        </div>

        <Link to="/events/my-registrations">
          <Button variant="outline" size="sm">
            <Ticket className="w-4 h-4 mr-1.5" /> My Event Registrations
          </Button>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <Input
            placeholder="Search events by title, organizer, or venue..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Timeframe toggle */}
        <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setTimeframe('upcoming')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              timeframe === 'upcoming'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Upcoming
          </button>
          <button
            onClick={() => setTimeframe('past')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              timeframe === 'past'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Past Events
          </button>
        </div>

        {/* Category Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 sm:pb-0">
          {CATEGORIES.slice(0, 5).map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Events Grid */}
      {loading ? (
        <LoadingSpinner size="lg" className="h-64" />
      ) : events.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title="No Campus Events Found"
          description={`There are currently no ${timeframe} events matching your filter.`}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {events.map((evt) => (
            <Card
              key={evt._id}
              className="flex flex-col justify-between hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-700 transition-all border-slate-200/80 dark:border-slate-800 dark:bg-slate-900 overflow-hidden"
            >
              <div>
                {/* Event Photo if present */}
                {evt.imageUrl ? (
                  <div className="h-44 w-full overflow-hidden bg-slate-100 dark:bg-slate-800 relative">
                    <img src={getFileUrl(evt.imageUrl)} alt={evt.title} className="w-full h-full object-cover" />
                    <div className="absolute top-2.5 left-2.5">
                      <span className="text-[10px] font-extrabold uppercase bg-white/95 dark:bg-slate-900/90 text-indigo-700 dark:text-indigo-300 px-2.5 py-1 rounded-full shadow-xs border border-slate-200/60 dark:border-slate-700">
                        {evt.category}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 pb-0">
                    <span className="text-[10px] font-extrabold uppercase bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 px-2.5 py-0.5 rounded-full">
                      {evt.category}
                    </span>
                  </div>
                )}

                <CardContent className="p-5 space-y-3">
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 leading-snug line-clamp-1">
                    {evt.title}
                  </h3>

                  <div className="space-y-1.5 text-xs text-slate-500 dark:text-slate-400">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                      <span>{new Date(evt.date).toLocaleDateString()} • {evt.startTime} - {evt.endTime}</span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                      <span>{evt.venue}</span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Users className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                      <span>Organizer: <strong className="text-slate-700 dark:text-slate-200">{evt.organizer}</strong></span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed pt-1">
                    {evt.description}
                  </p>

                  {/* Seat availability bar */}
                  <div className="pt-2">
                    <div className="flex justify-between text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
                      <span>Available Seats</span>
                      <span className={evt.availableSeats === 0 ? 'text-rose-600 dark:text-rose-400 font-bold' : 'text-indigo-600 dark:text-indigo-400'}>
                        {evt.availableSeats} / {evt.maxCapacity}
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${evt.availableSeats === 0 ? 'bg-rose-500' : 'bg-indigo-600'}`}
                        style={{
                          width: `${Math.min(100, ((evt.maxCapacity - evt.availableSeats) / evt.maxCapacity) * 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                </CardContent>
              </div>

              <div className="px-5 py-3 bg-slate-50 dark:bg-slate-900/90 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                {evt.isUserRegistered ? (
                  <span className="flex items-center text-emerald-700 dark:text-emerald-300 font-bold text-xs">
                    <CheckCircle2 className="w-4 h-4 mr-1 text-emerald-600 dark:text-emerald-400" />
                    Booked
                  </span>
                ) : evt.availableSeats === 0 ? (
                  <span className="text-rose-600 dark:text-rose-400 font-bold text-xs">Event Full</span>
                ) : (
                  <span className="text-slate-500 dark:text-slate-400 text-xs">Open for Booking</span>
                )}

                <Link
                  to={`/events/${evt._id}`}
                  className="font-bold text-indigo-600 hover:text-indigo-800 flex items-center"
                >
                  {evt.isUserRegistered ? 'View Ticket' : 'Reserve Seat'} <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

