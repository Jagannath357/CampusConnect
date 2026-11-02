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
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Legend 
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
  AlertTriangle
} from 'lucide-react';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4'];

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
    eventStats: Array<{ name: string; registrations: number; capacity: number }>;
    grievancesByCategory: Array<{ category: string; count: number }>;
    studentsByBranch: Array<{ branch: string; count: number }>;
  };
}

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
        <p className="text-sm text-gray-500 mt-3">Aggregating live university telemetry...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-8 text-center bg-red-50 border border-red-200 rounded-xl">
        <p className="text-red-700 font-semibold">{error || 'Unable to load analytics.'}</p>
        <Button onClick={fetchAnalytics} variant="outline" className="mt-4">
          Retry Aggregation
        </Button>
      </div>
    );
  }

  const { summary, charts } = data;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-xl p-6 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300">
              <Activity className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                Live University Telemetry & Analytics
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
                  Module 14
                </span>
              </h1>
              <p className="text-sm text-indigo-200/80">
                Real-time metrics, student enrollment ratios, event engagement, and grievance pipeline health.
              </p>
            </div>
          </div>
          <Button
            onClick={fetchAnalytics}
            variant="outline"
            className="text-white border-white/20 hover:bg-white/10 flex items-center gap-2 text-xs"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh Telemetry
          </Button>
        </div>
      </div>

      {/* Top Stat Counters */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-gray-200 shadow-sm">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase">Student Accounts</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{summary.totalStudents}</h3>
              <p className="text-[11px] text-green-600 mt-0.5 font-medium">
                {summary.activeStudents} active • {summary.suspendedStudents} suspended
              </p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-200 shadow-sm">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase">Event Bookings</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{summary.totalRegistrations}</h3>
              <p className="text-[11px] text-gray-500 mt-0.5 font-medium">
                Across {summary.totalEvents} published events
              </p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-200 shadow-sm">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase">Grievances Pipeline</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{summary.pendingGrievances}</h3>
              <p className="text-[11px] text-amber-600 mt-0.5 font-medium">
                Pending resolution action
              </p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-200 shadow-sm">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase">Active Placements</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{summary.activePlacements}</h3>
              <p className="text-[11px] text-indigo-600 mt-0.5 font-medium">
                {summary.totalVerifiedClubs} verified student clubs
              </p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Briefcase className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Visual Recharts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Event Capacity vs Registrations Chart */}
        <Card className="border-gray-200 shadow-sm">
          <CardHeader className="py-4 border-b">
            <CardTitle className="text-sm font-bold text-gray-800 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              Event Turnout: Confirmed Registrations vs Capacity
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            {charts.eventStats.length === 0 ? (
              <div className="py-12 text-center text-xs text-gray-400">
                No event bookings recorded yet.
              </div>
            ) : (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={charts.eventStats} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} interval={0} angle={-15} textAnchor="end" />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Bar dataKey="registrations" name="Registered" fill="#10b981" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="capacity" name="Max Capacity" fill="#e2e8f0" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Grievances by Category Pie Chart */}
        <Card className="border-gray-200 shadow-sm">
          <CardHeader className="py-4 border-b">
            <CardTitle className="text-sm font-bold text-gray-800 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-indigo-600" />
              Grievance Inflow by Category
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            {charts.grievancesByCategory.length === 0 ? (
              <div className="py-12 text-center text-xs text-gray-400">
                No grievance reports submitted yet.
              </div>
            ) : (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={charts.grievancesByCategory}
                      dataKey="count"
                      nameKey="category"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {charts.grievancesByCategory.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Second Row Charts & Engagement Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Branch Demographics */}
        <div className="lg:col-span-7">
          <Card className="border-gray-200 shadow-sm">
            <CardHeader className="py-4 border-b">
              <CardTitle className="text-sm font-bold text-gray-800 flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-600" />
                Student Enrollment Distribution by Academic Branch
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              {charts.studentsByBranch.length === 0 ? (
                <div className="py-12 text-center text-xs text-gray-400">
                  No branch profile data available.
                </div>
              ) : (
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={charts.studentsByBranch} margin={{ top: 10, right: 10, left: -20, bottom: 10 }}>
                      <XAxis dataKey="branch" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip />
                      <Bar dataKey="count" name="Enrolled Students" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Academic Engagement Metrics */}
        <div className="lg:col-span-5">
          <Card className="border-gray-200 shadow-sm">
            <CardHeader className="py-4 border-b">
              <CardTitle className="text-sm font-bold text-gray-800 flex items-center gap-2">
                <Activity className="w-4 h-4 text-purple-600" />
                Community Engagement Indexes
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center">
                    <FolderGit2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-900">Project Collaboration Posts</h4>
                    <p className="text-[11px] text-gray-500">Peer engineering teams & hackathons</p>
                  </div>
                </div>
                <span className="font-bold text-lg text-purple-700">{summary.totalCollabPosts}</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                    <HelpCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-900">Academic Q&A Threads</h4>
                    <p className="text-[11px] text-gray-500">Peer questions & verified answers</p>
                  </div>
                </div>
                <span className="font-bold text-lg text-blue-700">{summary.totalQuestions}</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-900">Study Resources Shared</h4>
                    <p className="text-[11px] text-gray-500">Lecture notes, syllabus, question banks</p>
                  </div>
                </div>
                <span className="font-bold text-lg text-teal-700">{summary.totalResources}</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-900">Lost & Found Logged</h4>
                    <p className="text-[11px] text-gray-500">{summary.pendingVerificationItems} awaiting verification</p>
                  </div>
                </div>
                <span className="font-bold text-lg text-amber-700">{summary.totalLostFound}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

