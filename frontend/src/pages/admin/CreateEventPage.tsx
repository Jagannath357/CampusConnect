import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';
import { CalendarCheck, ArrowLeft, Upload, AlertCircle, Camera } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';

const CATEGORIES = ['Technical', 'Workshop', 'Cultural', 'Sports', 'Seminar', 'Hackathon'];

export const CreateEventPage: React.FC = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Technical');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('10:00 AM');
  const [endTime, setEndTime] = useState('04:00 PM');
  const [venue, setVenue] = useState('');
  const [organizer, setOrganizer] = useState('Silicon University');
  const [organizerClubId, setOrganizerClubId] = useState('');
  const [maxCapacity, setMaxCapacity] = useState(100);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [verifiedClubs, setVerifiedClubs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    // Load verified clubs for organizer dropdown
    const loadClubs = async () => {
      try {
        const res = await api.get('/clubs');
        if (res.data.success) {
          setVerifiedClubs(res.data.data);
        }
      } catch (e) {}
    };
    loadClubs();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (new Date(date) < new Date(new Date().setHours(0, 0, 0, 0))) {
      setErrorMessage('Invalid event date: Cannot schedule an official event in the past (Decision Table 7).');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('category', category);
    formData.append('date', date);
    formData.append('startTime', startTime);
    formData.append('endTime', endTime);
    formData.append('venue', venue);
    formData.append('organizer', organizer);
    if (organizerClubId) formData.append('organizerClubId', organizerClubId);
    formData.append('maxCapacity', maxCapacity.toString());
    formData.append('status', 'PUBLISHED');
    if (imageFile) formData.append('image', imageFile);

    setLoading(true);
    try {
      const res = await api.post('/admin/events', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data.success) {
        navigate('/admin/events');
      }
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || 'Failed to publish official event.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Link
        to="/admin/events"
        className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Official Events
      </Link>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-black text-slate-900 flex items-center space-x-2">
            <CalendarCheck className="w-6 h-6 text-indigo-600" />
            <span>Publish Official Campus Event</span>
          </CardTitle>
          <p className="text-xs text-slate-500 mt-1">
            Official events automatically appear on the student portal event feed and open real-time seat reservation.
          </p>
        </CardHeader>

        <CardContent>
          {errorMessage && (
            <div className="mb-4 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Event Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Silicon HackFest 2026: 36-Hour Hackathon"
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="flex h-10 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <Input
                label="Event Date (Future date required)"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Start Time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                placeholder="10:00 AM"
                required
              />

              <Input
                label="End Time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                placeholder="04:00 PM"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Campus Venue"
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
                placeholder="e.g. Auditorium Complex / CSE Lab 1-4"
                required
              />

              <Input
                label="Seat Capacity"
                type="number"
                min="1"
                max="5000"
                value={maxCapacity}
                onChange={(e) => setMaxCapacity(Number(e.target.value))}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Organizer Display Name"
                value={organizer}
                onChange={(e) => setOrganizer(e.target.value)}
                placeholder="e.g. Silicon Coding Community / Dept of CSE"
                required
              />

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Associated Verified Club (Optional)
                </label>
                <select
                  value={organizerClubId}
                  onChange={(e) => setOrganizerClubId(e.target.value)}
                  className="flex h-10 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500"
                >
                  <option value="">None (Direct University Event)</option>
                  {verifiedClubs.map((club) => (
                    <option key={club._id} value={club._id}>
                      {club.name} ({club.code})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <Textarea
              label="Event Description & Agenda"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Outline event agenda, eligibility, guest speakers, awards, and instructions..."
              required
            />

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Event Banner Image (Optional)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                className="text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100">
              <Link to="/admin/events">
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Link>
              <Button type="submit" variant="primary" isLoading={loading}>
                Publish Official Event
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

