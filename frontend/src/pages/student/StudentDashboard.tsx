import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import {
  Users2,
  HelpCircle,
  BookOpen,
  Search,
  Calendar,
  Briefcase,
  ArrowRight,
  Sparkles,
  MapPin,
  Clock,
  Award,
} from 'lucide-react';
import { StatCard } from '../../components/common/StatCard';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { getFileUrl } from '../../utils/url';

export const StudentDashboard: React.FC = () => {
  const { user, profile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [upcomingEvents, setUpcomingEvents] = useState<any[]>([]);
  const [recentCollaborations, setRecentCollaborations] = useState<any[]>([]);
  const [recentQuestions, setRecentQuestions] = useState<any[]>([]);
  const [eligiblePlacements, setEligiblePlacements] = useState<any[]>([]);
  const [lostFoundItems, setLostFoundItems] = useState<any[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [eventsRes, collabRes, questionsRes, placementsRes, lostFoundRes] =
          await Promise.all([
            api.get('/events?limit=3&timeframe=upcoming'),
            api.get('/collaborations?limit=3&status=OPEN'),
            api.get('/questions?limit=3'),
            api.get('/placements?limit=3'),
            api.get('/lost-found?limit=3'),
          ]);

        if (eventsRes.data.success) setUpcomingEvents(eventsRes.data.data || []);
        if (collabRes.data.success) setRecentCollaborations(collabRes.data.data || []);
        if (questionsRes.data.success) setRecentQuestions(questionsRes.data.data || []);
        if (placementsRes.data.success) {
          const pData = placementsRes.data.data;
          setEligiblePlacements(pData?.placements || (Array.isArray(pData) ? pData : []));
        }
        if (lostFoundRes.data.success) setLostFoundItems(lostFoundRes.data.data || []);
      } catch (err) {
        console.error('Error fetching student dashboard data', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <LoadingSpinner size="lg" className="h-64" />;
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Student Welcome & Profile Summary Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white p-6 sm:p-8 shadow-lg">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            {profile?.avatarUrl ? (
              <img
                src={getFileUrl(profile.avatarUrl)}
                alt={user?.name}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-indigo-400/40 shadow-md"
              />
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-indigo-600/60 border-2 border-indigo-400/30 flex items-center justify-center text-xl font-black">
                {user?.name?.charAt(0)}
              </div>
            )}
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight">Welcome, {user?.name}!</h1>
                <span className="text-[10px] font-extrabold uppercase bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 px-2 py-0.5 rounded-full">
                  Student
                </span>
              </div>
              <p className="text-xs text-indigo-200 mt-1 flex items-center space-x-2 flex-wrap">
                <span>Roll: {profile?.rollNumber || 'N/A'}</span>
                <span>•</span>
                <span>Dept: {profile?.department || 'CSE'}</span>
                <span>•</span>
                <span>Graduation Batch: {profile?.batchYear || '2026'}</span>
                <span>•</span>
                <span className="font-bold text-amber-300">CGPA: {profile?.cgpa ? profile.cgpa.toFixed(2) : '0.00'}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2.5">
            <Link to="/profile">
              <Button variant="secondary" size="sm" className="bg-white/10 hover:bg-white/20 text-white border border-white/20">
                Edit Profile
              </Button>
            </Link>
            <Link to="/collaborations/create">
              <Button variant="primary" size="sm" className="bg-indigo-500 hover:bg-indigo-600 text-white">
                Post Collab Request
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Stat Quick Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        <StatCard
          title="Campus Events"
          value={upcomingEvents.length}
          subtitle="Upcoming this week"
          icon={Calendar}
          color="indigo"
        />
        <StatCard
          title="Collab Requests"
          value={recentCollaborations.length}
          subtitle="Open hackathon squads"
          icon={Users2}
          color="emerald"
        />
        <StatCard
          title="Academic Q&A"
          value={recentQuestions.length}
          subtitle="Recent discussions"
          icon={HelpCircle}
          color="sky"
        />
        <StatCard
          title="Eligible Jobs"
          value={eligiblePlacements.length}
          subtitle="Matched to your CGPA"
          icon={Briefcase}
          color="purple"
        />
      </div>

      {/* Two Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Campus Events */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-base font-bold flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-indigo-600" />
              <span>Upcoming Campus Events</span>
            </CardTitle>
            <Link to="/events" className="text-xs font-bold text-indigo-600 hover:underline flex items-center">
              View All <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcomingEvents.length === 0 ? (
              <p className="text-xs text-slate-500 dark:text-slate-400 text-center py-6">No upcoming events right now.</p>
            ) : (
              upcomingEvents.map((evt) => (
                <div
                  key={evt._id}
                  className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between transition-all"
                >
                  <div className="space-y-1 pr-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded">
                      {evt.category}
                    </span>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 leading-snug">{evt.title}</h4>
                    <div className="flex items-center space-x-3 text-[11px] text-slate-500 dark:text-slate-400">
                      <span className="flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {new Date(evt.date).toLocaleDateString()} • {evt.startTime}
                      </span>
                      <span className="flex items-center">
                        <MapPin className="w-3 h-3 mr-1" />
                        {evt.venue}
                      </span>
                    </div>
                  </div>
                  <Link to={`/events/${evt._id}`}>
                    <Button size="sm" variant={evt.isUserRegistered ? 'secondary' : 'primary'}>
                      {evt.isUserRegistered ? 'Registered' : 'View'}
                    </Button>
                  </Link>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Personalized Eligible Placements */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-base font-bold flex items-center space-x-2">
              <Briefcase className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <span>Eligible Placement Drives</span>
            </CardTitle>
            <Link to="/placements" className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center">
              View All <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {eligiblePlacements.length === 0 ? (
              <p className="text-xs text-slate-500 dark:text-slate-400 text-center py-6">
                No active placement drives currently match your branch ({profile?.department}) and CGPA ({profile?.cgpa}).
              </p>
            ) : (
              eligiblePlacements.map((plc) => (
                <div
                  key={plc._id}
                  className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between transition-all"
                >
                  <div className="space-y-1 pr-3">
                    <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                      Eligible: Min CGPA {plc.minimumCgpa}
                    </span>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 leading-snug">{plc.companyName}</h4>
                    <p className="text-xs text-slate-600 dark:text-slate-300">{plc.jobTitle} • {plc.packageDetails || 'Competitive Package'}</p>
                  </div>
                  <Link to={`/placements/${plc._id}`}>
                    <Button size="sm" variant="outline">
                      Details
                    </Button>
                  </Link>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Project Teammate Finder */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-base font-bold flex items-center space-x-2">
              <Users2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <span>Open Project Collaborations</span>
            </CardTitle>
            <Link to="/collaborations" className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center">
              Browse All <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentCollaborations.length === 0 ? (
              <p className="text-xs text-slate-500 dark:text-slate-400 text-center py-6">No open collaboration posts found.</p>
            ) : (
              recentCollaborations.map((collab) => (
                <Link
                  key={collab._id}
                  to={`/collaborations/${collab._id}`}
                  className="block p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-indigo-200 dark:hover:border-indigo-800 hover:bg-indigo-50/20 dark:hover:bg-indigo-950/30 bg-slate-50/50 dark:bg-slate-800/40 transition-all"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">{collab.domain}</span>
                    <span className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded">
                      {collab.vacancyCount} {collab.vacancyCount === 1 ? 'vacancy' : 'vacancies'}
                    </span>
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100">{collab.title}</h4>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {collab.requiredSkills?.slice(0, 3).map((skill: string) => (
                      <span key={skill} className="text-[10px] bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2 py-0.5 rounded text-slate-600 dark:text-slate-300">
                        {skill}
                      </span>
                    ))}
                  </div>
                </Link>
              ))
            )}
          </CardContent>
        </Card>

        {/* Recent Academic Q&A */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-base font-bold flex items-center space-x-2">
              <HelpCircle className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <span>Recent Academic Q&A</span>
            </CardTitle>
            <Link to="/questions" className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center">
              View All <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentQuestions.length === 0 ? (
              <p className="text-xs text-slate-500 dark:text-slate-400 text-center py-6">No questions posted yet.</p>
            ) : (
              recentQuestions.map((q) => (
                <Link
                  key={q._id}
                  to={`/questions/${q._id}`}
                  className="block p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-indigo-200 dark:hover:border-indigo-800 hover:bg-indigo-50/20 dark:hover:bg-indigo-950/30 bg-slate-50/50 dark:bg-slate-800/40 transition-all"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">{q.subjectCode} • {q.subjectCategory}</span>
                    <span className="text-[10px] font-semibold text-slate-600 dark:text-slate-300">{q.answerCount} answers</span>
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 line-clamp-1">{q.title}</h4>
                </Link>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

