import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
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
import {
  Activity,
  Users,
  Calendar,
  HelpCircle,
  FolderGit2,
  FileText,
  ShieldAlert,
  Briefcase,
  RefreshCw,
  TrendingUp,
  AlertTriangle,
  PieChart as PieIcon,
  BarChart3,
  Layers,
  Award,
} from 'lucide-react';

const PALETTE = ['#4f46e5', '#06b6d4', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#ef4444', '#14b8a6'];

interface DashboardData {
  summary: {
    totalStudents: number;
    activeStudents: number;
    suspendedStudents: number;
    totalCollabPosts: number;
    totalQuestions: number;
    totalResources: number;
    totalLostFound: number;
    pendingVerificationItems: number;
    totalEvents: number;
    totalRegistrations: number;
    pendingGrievances: number;
    totalVerifiedClubs: number;
    activePlacements: number;
  };
  charts: {
    eventStats: Array<{
      name: string;
      registrations: number;
      capacity: number;
      availableSeats: number;
      fillRate: number;
    }>;
    grievancesByCategory: Array<{ category: string; count: number }>;
    grievancesByStatus?: Array<{ status: string; count: number }>;
    studentsByBranch: Array<{ branch: string; count: number }>;
    clubsByCategory?: Array<{ category: string; count: number }>;
    accountStatusDistribution?: Array<{ name: string; count: number; color?: string }>;
    activityTrend?: Array<{
      month: string;
      registrations: number;
      questions: number;
      collaborations: number;
    }>;
  };
}

// Custom Tooltip component with high contrast in dark/light mode
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

export const LiveAnalyticsPage: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get('/admin/dashboard');
      if (res.data.success) {
        setData(res.data.data);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to aggregate dashboard analytics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="py-24 text-center">
        <LoadingSpinner />
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-3 font-medium">
          Aggregating live university telemetry and generating accurate visual distributions...
        </p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-8 text-center bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 rounded-2xl max-w-md mx-auto">
        <AlertTriangle className="w-10 h-10 text-rose-600 dark:text-rose-400 mx-auto mb-3" />
        <p className="text-rose-800 dark:text-rose-200 font-bold text-sm">{error || 'Unable to load analytics.'}</p>
        <Button onClick={fetchAnalytics} variant="outline" className="mt-4 font-bold text-xs">
          <RefreshCw className="w-3.5 h-3.5 mr-1.5" /> Retry Aggregation
        </Button>
      </div>
    );
  }

  const { summary, charts } = data;

  const totalGrievances = charts.grievancesByCategory.reduce((sum, item) => sum + item.count, 0);
  const totalBranchStudents = charts.studentsByBranch.reduce((sum, item) => sum + item.count, 0);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-4 sm:p-7 shadow-md border border-indigo-900/60 min-w-0">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 min-w-0">
          <div className="flex items-center gap-3 sm:gap-3.5 min-w-0">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300 shadow-inner flex-shrink-0">
              <Activity className="w-5 h-5 sm:w-6 sm:h-6 animate-pulse" />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-lg sm:text-2xl font-black flex items-center gap-2 flex-wrap">
                <span className="truncate">Live Telemetry & Visualizations</span>
                <span className="text-[9px] sm:text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 flex-shrink-0">
                  Real-Time
                </span>
              </h1>
              <p className="text-xs text-indigo-200/80 mt-1 leading-relaxed">
                Visual statistical models, department distribution histograms, circular grievance ratios, and platform growth curves.
              </p>
            </div>
          </div>
          <Button
            onClick={fetchAnalytics}
            variant="outline"
            className="text-white border-white/20 hover:bg-white/10 flex items-center gap-2 text-xs font-bold self-start md:self-auto flex-shrink-0"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh Telemetry
          </Button>
        </div>
      </div>

      {/* Top Stat Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <Card className="border-slate-200 dark:border-slate-800 shadow-xs">
          <CardContent className="p-4 sm:p-5 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Student Accounts
              </p>
              <h3 className="text-2xl font-black text-slate-900 dark:text-slate-100 mt-1">
                {summary.totalStudents}
              </h3>
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-0.5 font-bold">
                {summary.activeStudents} active • {summary.suspendedStudents} suspended
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 dark:border-slate-800 shadow-xs">
          <CardContent className="p-4 sm:p-5 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Event Registrations
              </p>
              <h3 className="text-2xl font-black text-slate-900 dark:text-slate-100 mt-1">
                {summary.totalRegistrations}
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                Across {summary.totalEvents} published events
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 dark:border-slate-800 shadow-xs">
          <CardContent className="p-4 sm:p-5 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Active Grievance Tickets
              </p>
              <h3 className="text-2xl font-black text-slate-900 dark:text-slate-100 mt-1">
                {summary.pendingGrievances}
              </h3>
              <p className="text-[11px] text-amber-600 dark:text-amber-400 mt-0.5 font-bold">
                Awaiting resolution
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/70 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 dark:border-slate-800 shadow-xs">
          <CardContent className="p-4 sm:p-5 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Verified Societies & Drives
              </p>
              <h3 className="text-2xl font-black text-slate-900 dark:text-slate-100 mt-1">
                {summary.totalVerifiedClubs}
              </h3>
              <p className="text-[11px] text-indigo-600 dark:text-indigo-400 mt-0.5 font-bold">
                {summary.activePlacements} active placement drives
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Row 1: Area Trend Curve (Proper Graph) */}
      <Card className="border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <CardHeader className="py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <CardTitle className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>Campus Engagement Trend Curve (6-Month Historical Graph)</span>
            </CardTitle>
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
              Registrations • Academic Inquiries • Teammate Posts
            </span>
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          {charts.activityTrend && charts.activityTrend.length > 0 ? (
            <div className="h-72 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={charts.activityTrend} margin={{ top: 10, right: 20, left: -20, bottom: 5 }}>
                  <defs>
                    <linearGradient id="colorReg" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorQuestions" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorCollabs" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#94a3b8" opacity={0.2} />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} stroke="#cbd5e1" />
                  <YAxis tick={{ fontSize: 11, fill: '#64748b' }} stroke="#cbd5e1" allowDecimals={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  <Area
                    type="monotone"
                    dataKey="registrations"
                    name="Event Registrations"
                    stroke="#4f46e5"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#colorReg)"
                  />
                  <Area
                    type="monotone"
                    dataKey="questions"
                    name="Academic Questions"
                    stroke="#06b6d4"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorQuestions)"
                  />
                  <Area
                    type="monotone"
                    dataKey="collaborations"
                    name="Teammate Posts"
                    stroke="#10b981"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorCollabs)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="py-12 text-center text-xs text-slate-400">No trend history logged yet.</div>
          )}
        </CardContent>
      </Card>

      {/* Row 2: Histograms & Bar Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. Academic Department Enrollment Distribution Histogram */}
        <Card className="border-slate-200 dark:border-slate-800 shadow-xs min-w-0 overflow-hidden">
          <CardHeader className="py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>Department Enrollment Histogram</span>
              </CardTitle>
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                Total: {totalBranchStudents} Students
              </span>
            </div>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            {charts.studentsByBranch.length === 0 ? (
              <div className="py-16 text-center text-xs text-slate-400">No department enrollment records found.</div>
            ) : (
              <div className="h-64 w-full min-w-0">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={charts.studentsByBranch} margin={{ top: 10, right: 10, left: -20, bottom: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#94a3b8" opacity={0.2} />
                    <XAxis dataKey="branch" tick={{ fontSize: 11, fill: '#64748b' }} stroke="#cbd5e1" />
                    <YAxis tick={{ fontSize: 11, fill: '#64748b' }} stroke="#cbd5e1" allowDecimals={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="count" name="Enrolled Students" radius={[6, 6, 0, 0]}>
                      {charts.studentsByBranch.map((_, idx) => (
                        <Cell key={`bar-branch-${idx}`} fill={PALETTE[idx % PALETTE.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 2. Event Capacity vs Registrations Histogram */}
        <Card className="border-slate-200 dark:border-slate-800 shadow-xs min-w-0 overflow-hidden">
          <CardHeader className="py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
            <CardTitle className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Event Turnout Histogram: Confirmed vs Capacity</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            {charts.eventStats.length === 0 ? (
              <div className="py-16 text-center text-xs text-slate-400">No event records available.</div>
            ) : (
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
                      tickFormatter={(val) => (val.length > 14 ? `${val.substring(0, 14)}...` : val)}
                    />
                    <YAxis tick={{ fontSize: 11, fill: '#64748b' }} stroke="#cbd5e1" allowDecimals={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '6px' }} />
                    <Bar dataKey="registrations" name="Confirmed Bookings" fill="#10b981" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="capacity" name="Max Capacity" fill="#cbd5e1" opacity={0.6} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Row 3: Circular Graph Diagrams (Donut & Pie Charts) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. Grievance Inflow by Category Circular Donut Diagram */}
        <Card className="border-slate-200 dark:border-slate-800 shadow-xs min-w-0 overflow-hidden">
          <CardHeader className="py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <PieIcon className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                <span>Grievance Distribution (Circular Diagram)</span>
              </CardTitle>
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                Total: {totalGrievances} Tickets
              </span>
            </div>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            {charts.grievancesByCategory.length === 0 ? (
              <div className="py-16 text-center text-xs text-slate-400">No grievances reported yet.</div>
            ) : (
              <div className="h-64 w-full min-w-0 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={charts.grievancesByCategory}
                      dataKey="count"
                      nameKey="category"
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={85}
                      paddingAngle={3}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {charts.grievancesByCategory.map((_, index) => (
                        <Cell key={`cell-g-${index}`} fill={PALETTE[index % PALETTE.length]} strokeWidth={2} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 2. Student Account Status Circular Diagram */}
        <Card className="border-slate-200 dark:border-slate-800 shadow-xs min-w-0 overflow-hidden">
          <CardHeader className="py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
            <CardTitle className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Users className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>Student Account Security Status (Circular Diagram)</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <div className="h-64 w-full min-w-0 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={
                      charts.accountStatusDistribution || [
                        { name: 'Active Students', count: summary.activeStudents, color: '#10b981' },
                        { name: 'Suspended', count: summary.suspendedStudents, color: '#ef4444' },
                      ]
                    }
                    dataKey="count"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={4}
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    <Cell fill="#10b981" />
                    <Cell fill="#ef4444" />
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Row 4: Community Engagement Indexes Breakdown */}
      <Card className="border-slate-200 dark:border-slate-800 shadow-xs">
        <CardHeader className="py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <CardTitle className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Layers className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <span>Community Collaboration & Academic Engagement Telemetry</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 flex items-center justify-center flex-shrink-0">
                  <FolderGit2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">Teammate Posts</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Hackathon squads</p>
                </div>
              </div>
              <span className="font-mono font-black text-xl text-purple-700 dark:text-purple-300">{summary.totalCollabPosts}</span>
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 flex items-center justify-center flex-shrink-0">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">Q&A Threads</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Peer discussions</p>
                </div>
              </div>
              <span className="font-mono font-black text-xl text-blue-700 dark:text-blue-300">{summary.totalQuestions}</span>
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-950/80 text-teal-700 dark:text-teal-300 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">Resources Shared</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">PYQs & notes</p>
                </div>
              </div>
              <span className="font-mono font-black text-xl text-teal-700 dark:text-teal-300">{summary.totalResources}</span>
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">Lost & Found</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">{summary.pendingVerificationItems} pending</p>
                </div>
              </div>
              <span className="font-mono font-black text-xl text-amber-700 dark:text-amber-300">{summary.totalLostFound}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
export default LiveAnalyticsPage;
