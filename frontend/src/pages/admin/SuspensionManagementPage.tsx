import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { UserX, Shield, CheckCircle2, Search, ArrowLeft, Clock } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { StatusBadge } from '../../components/common/StatusBadge';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

export const SuspensionManagementPage: React.FC = () => {
  const [suspensionHistory, setSuspensionHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSuspensionHistory = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/suspensions');
      if (res.data.success) {
        setSuspensionHistory(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load suspensions', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuspensionHistory();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center space-x-2.5">
            <UserX className="w-6 h-6 text-rose-600" />
            <span>Guideline Enforcement & Suspension Records</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Audit history of disciplinary suspensions, revocation reasons, and account reactivations.
          </p>
        </div>

        <Link to="/admin/students">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-1.5" /> Student Directory
          </Button>
        </Link>
      </div>

      <Card>
        <CardContent className="p-0 overflow-x-auto">
          {loading ? (
            <LoadingSpinner size="lg" className="h-64" />
          ) : suspensionHistory.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500">
              No disciplinary suspensions recorded. All student accounts in good standing.
            </div>
          ) : (
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 border-b border-slate-200/80 text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                <tr>
                  <th className="p-4">Target Student</th>
                  <th className="p-4">Reason</th>
                  <th className="p-4">Issued By</th>
                  <th className="p-4">Period</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {suspensionHistory.map((s) => (
                  <tr key={s._id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-4">
                      <p className="font-bold text-slate-900">{s.studentId?.name || 'Student'}</p>
                      <p className="text-[11px] text-slate-500">{s.studentId?.email}</p>
                    </td>
                    <td className="p-4 max-w-xs text-slate-800 font-medium">{s.reason}</td>
                    <td className="p-4 text-slate-600 font-medium">{s.suspendedBy?.name || 'Administrator'}</td>
                    <td className="p-4 text-slate-500 text-[11px]">
                      {new Date(s.startDate).toLocaleDateString()}
                      {s.endDate && ` - ${new Date(s.endDate).toLocaleDateString()}`}
                    </td>
                    <td className="p-4">
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                          s.isActive
                            ? 'bg-rose-50 border-rose-200 text-rose-700'
                            : 'bg-emerald-50 border-emerald-200 text-emerald-700'
                        }`}
                      >
                        {s.isActive ? 'ACTIVE SUSPENSION' : 'REACTIVATED'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      {s.studentId && (
                        <Link to={`/admin/students/${s.studentId._id}`}>
                          <Button size="sm" variant="outline">
                            Inspect
                          </Button>
                        </Link>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

