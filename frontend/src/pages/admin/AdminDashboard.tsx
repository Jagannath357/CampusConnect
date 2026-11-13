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
  BarChart3,
  PieChart as PieIcon,
  Activity,
  Calendar,
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
  Legend,
  AreaChart,
  Area,
} from 'recharts';
import { StatCard } from '../../components/common/StatCard';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

const PALETTE = ['#4f46e5', '#06b6d4', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#ef4444', '#14b8a6'];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900/95 text-white p-3 rounded-xl shadow-xl border border-slate-700/80 text-xs backdrop-blur-md z-50">
        <p className="font-bold text-slate-200 border-b border-slate-800 pb-1.5 mb-1.5">{label}</p>
        <div className="space-y-1">
          {payload.map((entry: any, index: number) => (
            <p key={`item-${index}`} className="flex items-center justify-between gap-4 font-medium" style={{ color: entry.color || '#fff' }}>
              <span>{entry.name}:</span>
              <span className="font-mono font-bold text-white">{entry.value}</span>
            </p>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

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
          <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight flex items-center space-x-2.5">
            <ShieldCheck className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
            <span>Administrative Governance Overview</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time live campus metrics aggregated from Silicon University database collections.
          </p>
        </div>

        <div className="flex items-center space-x-2 self-start sm:self-auto">
          <Link to="/admin/emergency">
            <Button variant="danger" size="sm" className="font-bold">
              <Radio className="w-4 h-4 mr-1.5 animate-pulse" /> Emergency Broadcast
            </Button>
          </Link>
          <Link to="/admin/events/new">
            <Button variant="primary" size="sm" className="font-bold">
              Publish Official Event
            </Button>
          </Link>
        </div>
      </div>

      {/* Aggregate Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
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
        {/* 1. Event Registrations vs Capacity Histogram */}
        <Card className="min-w-0 overflow-hidden shadow-xs border-slate-200 dark:border-slate-800">
          <CardHeader className="py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
            <CardTitle className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>Event Registrations vs Capacity Histogram</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-5">
            {charts?.eventStats && charts.eventStats.length > 0 ? (
              <div className="h-64 w-full min-w-0">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={charts.eventStats} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#94a3b8" opacity={0.2} />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 10, fill: '#64748b' }}
                      stroke="#cbd5e1"
                      interval={0}
                      angle={-15}
                      textAnchor="end"
                      tickFormatter={(val) => (val.length > 15 ? `${val.substring(0, 15)}...` : val)}
                    />
                    <YAxis tick={{ fontSize: 11, fill: '#64748b' }} stroke="#cbd5e1" allowDecimals={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '6px' }} />
                    <Bar dataKey="registrations" fill="#4f46e5" radius={[4, 4, 0, 0]} name="Booked Seats" />
                    <Bar dataKey="capacity" fill="#cbd5e1" opacity={0.6} radius={[4, 4, 0, 0]} name="Max Capacity" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="text-xs text-slate-400 text-center py-16">No event booking data available.</p>
            )}
          </CardContent>
        </Card>

        {/* 2. Grievances by Category Circular Donut Diagram */}
        <Card className="min-w-0 overflow-hidden shadow-xs border-slate-200 dark:border-slate-800">
          <CardHeader className="py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
            <CardTitle className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-rose-600 dark:text-rose-400" />
              <span>Grievances by Category (Circular Diagram)</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-5">
            {charts?.grievancesByCategory && charts.grievancesByCategory.length > 0 ? (
              <div className="h-64 w-full min-w-0 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={charts.grievancesByCategory}
                      dataKey="count"
                      nameKey="category"
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={3}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {charts.grievancesByCategory.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={PALETTE[index % PALETTE.length]} strokeWidth={2} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '6px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="text-xs text-slate-400 text-center py-16">No grievance submissions recorded.</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Row 2: Department Enrollment Histogram & Engagement Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Enrollment Histogram */}
        <Card className="min-w-0 overflow-hidden shadow-xs border-slate-200 dark:border-slate-800">
          <CardHeader className="py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
            <CardTitle className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>Department Student Enrollment Histogram</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-5">
            {charts?.studentsByBranch && charts.studentsByBranch.length > 0 ? (
              <div className="h-64 w-full min-w-0">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={charts.studentsByBranch} margin={{ top: 10, right: 10, left: -20, bottom: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#94a3b8" opacity={0.2} />
                    <XAxis dataKey="branch" tick={{ fontSize: 11, fill: '#64748b' }} stroke="#cbd5e1" />
                    <YAxis tick={{ fontSize: 11, fill: '#64748b' }} stroke="#cbd5e1" allowDecimals={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="count" name="Enrolled Students" radius={[6, 6, 0, 0]}>
                      {charts.studentsByBranch.map((_: any, idx: number) => (
                        <Cell key={`bar-dept-${idx}`} fill={PALETTE[idx % PALETTE.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="text-xs text-slate-400 text-center py-16">No student department data available.</p>
            )}
          </CardContent>
        </Card>

        {/* 6-Month Platform Engagement Area Graph */}
        <Card className="min-w-0 overflow-hidden shadow-xs border-slate-200 dark:border-slate-800">
          <CardHeader className="py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
            <CardTitle className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Platform Activity Trend Graph (Historical)</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-5">
            {charts?.activityTrend && charts.activityTrend.length > 0 ? (
              <div className="h-64 w-full min-w-0">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={charts.activityTrend} margin={{ top: 10, right: 15, left: -20, bottom: 5 }}>
                    <defs>
                      <linearGradient id="dashboardArea" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#94a3b8" opacity={0.2} />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} stroke="#cbd5e1" />
                    <YAxis tick={{ fontSize: 11, fill: '#64748b' }} stroke="#cbd5e1" allowDecimals={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="registrations"
                      name="Event Bookings"
                      stroke="#4f46e5"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#dashboardArea)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="text-xs text-slate-400 text-center py-16">No activity trend available.</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Governance Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          to="/admin/students"
          className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-600 hover:shadow-sm transition-all"
        >
          <Users className="w-6 h-6 text-indigo-600 dark:text-indigo-400 mb-2" />
          <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">Student Account Auditing</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Review student profiles, graduation batches, and roll numbers.</p>
        </Link>

        <Link
          to="/admin/suspensions"
          className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-rose-400 dark:hover:border-rose-600 hover:shadow-sm transition-all"
        >
          <UserX className="w-6 h-6 text-rose-600 dark:text-rose-400 mb-2" />
          <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">Suspension & Safety Control</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Enforce guidelines with immediate session and token revocation.</p>
        </Link>

        <Link
          to="/admin/lost-found"
          className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-amber-400 dark:hover:border-amber-600 hover:shadow-sm transition-all"
        >
          <FileCheck2 className="w-6 h-6 text-amber-600 dark:text-amber-400 mb-2" />
          <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">Lost & Found Claim Verification</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Inspect evidence and resolve pending campus belongings.</p>
        </Link>
      </div>
    </div>
  );
};
export default AdminDashboard;
