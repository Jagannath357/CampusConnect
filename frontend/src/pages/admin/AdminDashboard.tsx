import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import {
  Users,
  UserX,
  FileCheck2,
  CalendarCheck,
  Radio,
  Inbox,
  Award,
  Briefcase,
  ShieldCheck,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { StatCard } from '../../components/common/StatCard';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

const COLORS = ['#4f46e5', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export const AdminDashboard: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/dashboard');
      if (res.data.success) {
        setData(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load admin stats', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  if (loading) {
    return <LoadingSpinner size="lg" className="h-64" />;
  }

  const { summary, charts } = data || {};

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center space-x-2.5">
            <ShieldCheck className="w-7 h-7 text-indigo-600" />
            <span>Administrative Governance Overview</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time live campus metrics aggregated from Silicon University database collections.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Link to="/admin/emergency">
            <Button variant="danger" size="sm">
              <Radio className="w-4 h-4 mr-1.5 animate-pulse" /> Emergency Broadcast
            </Button>
          </Link>
          <Link to="/admin/events/create">
            <Button variant="primary" size="sm">
              Publish Official Event
            </Button>
          </Link>
        </div>
      </div>

      {/* Aggregate Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Students"
          value={summary?.totalStudents || 0}
          subtitle={`${summary?.activeStudents || 0} active • ${summary?.suspendedStudents || 0} suspended`}
          icon={Users}
          color="indigo"
        />
        <StatCard
          title="Pending Grievances"
          value={summary?.pendingGrievances || 0}
          subtitle="Anonymous tickets awaiting review"
          icon={Inbox}
          color="amber"
        />
        <StatCard
          title="Lost & Found"
          value={summary?.pendingVerificationItems || 0}
          subtitle={`${summary?.totalLostFound || 0} total reported items`}
          icon={FileCheck2}
          color="rose"
        />
        <StatCard
          title="Verified Clubs"
          value={summary?.totalVerifiedClubs || 0}
          subtitle="Official student societies"
          icon={Award}
          color="emerald"
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="Campus Events"
          value={summary?.totalEvents || 0}
          subtitle={`${summary?.totalRegistrations || 0} registered seats`}
          icon={CalendarCheck}
          color="sky"
        />
        <StatCard
          title="Active Placements"
          value={summary?.activePlacements || 0}
          subtitle="Branch & CGPA matched drives"
          icon={Briefcase}
          color="purple"
        />
        <StatCard
          title="Collab Requests"
          value={summary?.totalCollabPosts || 0}
          subtitle="Hackathon teammate posts"
          icon={TrendingUp}
          color="indigo"
        />
        <StatCard
          title="Academic Q&A"
          value={summary?.totalQuestions || 0}
          subtitle="Peer discussion threads"
          icon={ShieldCheck}
          color="emerald"
        />
      </div>

      {/* Recharts Data Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Event Registrations Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-bold text-slate-900">
              Top Event Registrations vs Capacity
            </CardTitle>
          </CardHeader>
          <CardContent>
            {charts?.eventStats && charts.eventStats.length > 0 ? (
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={charts.eventStats}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 10 }}
                      tickFormatter={(val) => (val.length > 15 ? `${val.substring(0, 15)}...` : val)}
                    />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Bar dataKey="registrations" fill="#4f46e5" radius={[4, 4, 0, 0]} name="Booked Seats" />
                    <Bar dataKey="capacity" fill="#cbd5e1" radius={[4, 4, 0, 0]} name="Max Capacity" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="text-xs text-slate-400 text-center py-16">No event booking data available.</p>
            )}
          </CardContent>
        </Card>

        {/* Grievances by Category Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-bold text-slate-900">
              Grievances by Category
            </CardTitle>
          </CardHeader>
          <CardContent>
            {charts?.grievancesByCategory && charts.grievancesByCategory.length > 0 ? (
              <div className="h-64 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={charts.grievancesByCategory}
                      dataKey="count"
                      nameKey="category"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label={({ category, percent }) => `${category} ${(percent * 100).toFixed(0)}%`}
                    >
                      {charts.grievancesByCategory.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="text-xs text-slate-400 text-center py-16">No grievance submissions recorded.</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Governance Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          to="/admin/students"
          className="p-5 rounded-2xl bg-white border border-slate-200/80 hover:border-indigo-400 hover:shadow-sm transition-all"
        >
          <Users className="w-6 h-6 text-indigo-600 mb-2" />
          <h4 className="text-sm font-bold text-slate-900">Student Account Auditing</h4>
          <p className="text-xs text-slate-500 mt-1">Review student profiles, graduation batches, and roll numbers.</p>
        </Link>

        <Link
          to="/admin/suspensions"
          className="p-5 rounded-2xl bg-white border border-slate-200/80 hover:border-rose-400 hover:shadow-sm transition-all"
        >
          <UserX className="w-6 h-6 text-rose-600 mb-2" />
          <h4 className="text-sm font-bold text-slate-900">Suspension & Safety Control</h4>
          <p className="text-xs text-slate-500 mt-1">Enforce guidelines with immediate session and token revocation.</p>
        </Link>

        <Link
          to="/admin/lost-found"
          className="p-5 rounded-2xl bg-white border border-slate-200/80 hover:border-amber-400 hover:shadow-sm transition-all"
        >
          <FileCheck2 className="w-6 h-6 text-amber-600 mb-2" />
          <h4 className="text-sm font-bold text-slate-900">Lost & Found Claim Verification</h4>
          <p className="text-xs text-slate-500 mt-1">Inspect evidence and resolve pending campus belongings.</p>
        </Link>
      </div>
    </div>
  );
};

