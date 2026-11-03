import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import {
  Users,
  Search,
  Filter,
  UserX,
  CheckCircle2,
  AlertCircle,
  Eye,
  Shield,
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { StatusBadge } from '../../components/common/StatusBadge';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

const DEPARTMENTS = ['ALL', 'CSE', 'IT', 'ECE', 'EEE', 'ME', 'CE'];
const STATUSES = ['ALL', 'ACTIVE', 'SUSPENDED'];

export const StudentManagementPage: React.FC = () => {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('ALL');
  const [status, setStatus] = useState('ALL');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (department !== 'ALL') params.append('department', department);
      if (status !== 'ALL') params.append('status', status);
      params.append('page', page.toString());
      params.append('limit', '10');

      const res = await api.get(`/admin/students?${params.toString()}`);
      if (res.data.success) {
        setStudents(res.data.data);
        setTotalPages(res.data.pagination?.totalPages || 1);
      }
    } catch (err) {
      console.error('Failed to load students', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [search, department, status, page]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight flex items-center space-x-2.5">
            <Users className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            <span>Student Account Auditing</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Audit registered student accounts, inspect profiles, and enforce academic community guidelines.
          </p>
        </div>

        <Link to="/admin/suspensions">
          <Button variant="danger" size="sm">
            <UserX className="w-4 h-4 mr-1.5" /> Suspension Management
          </Button>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <Input
            placeholder="Search by student name or university email..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="pl-9"
          />
        </div>

        <div className="flex items-center space-x-2">
          <select
            value={department}
            onChange={(e) => {
              setDepartment(e.target.value);
              setPage(1);
            }}
            className="h-10 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-none"
          >
            {DEPARTMENTS.map((d) => (
              <option key={d} value={d} className="bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100">
                Dept: {d}
              </option>
            ))}
          </select>

          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
            className="h-10 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-none"
          >
            {STATUSES.map((s) => (
              <option key={s} value={s} className="bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100">
                Status: {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Student Table */}
      <Card>
        <CardContent className="p-0 overflow-x-auto">
          {loading ? (
            <LoadingSpinner size="lg" className="h-64" />
          ) : students.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500">
              No student records found matching the filter.
            </div>
          ) : (
            <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-900/90 border-b border-slate-200/80 dark:border-slate-800 text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider">
                <tr>
                  <th className="p-4">Student</th>
                  <th className="p-4">Roll Number</th>
                  <th className="p-4">Branch & Batch</th>
                  <th className="p-4">CGPA</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {students.map(({ user, profile }) => (
                  <tr key={user._id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/70 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 font-bold flex items-center justify-center text-xs">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 dark:text-slate-100">{user.name}</p>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 font-mono font-bold text-slate-800 dark:text-slate-200">
                      {profile?.rollNumber || 'N/A'}
                    </td>
                    <td className="p-4 font-medium text-slate-700 dark:text-slate-300">
                      {profile?.department || 'CSE'} • Batch {profile?.batchYear || '2026'}
                    </td>
                    <td className="p-4 font-bold text-indigo-700 dark:text-indigo-400">
                      {profile?.cgpa ? profile.cgpa.toFixed(2) : '0.00'}
                    </td>
                    <td className="p-4">
                      <StatusBadge status={user.status} />
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Link to={`/admin/students/${user._id}`}>
                          <Button size="sm" variant="outline">
                            <Eye className="w-3.5 h-3.5 mr-1" /> Audit
                          </Button>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center space-x-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Previous
          </Button>
          <span className="px-4 py-2 text-xs font-semibold text-slate-600">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

