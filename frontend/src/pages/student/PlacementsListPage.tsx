import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { Placement } from '../../types';
import {
  Briefcase,
  Search,
  ExternalLink,
  MapPin,
  Calendar,
  Award,
  CheckCircle2,
  Building,
  Info,
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { EmptyState } from '../../components/common/EmptyState';

export const PlacementsListPage: React.FC = () => {
  const { profile } = useAuth();
  const [placements, setPlacements] = useState<Placement[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedPlacement, setSelectedPlacement] = useState<Placement | null>(null);

  const fetchPlacements = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.append('search', search);

      const res = await api.get(`/placements?${params.toString()}`);
      if (res.data.success) {
        setPlacements(res.data.data.placements);
      }
    } catch (err) {
      console.error('Failed to load eligible placements', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlacements();
  }, [search]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center space-x-2.5">
            <Briefcase className="w-6 h-6 text-indigo-600" />
            <span>Eligible Placement Drives</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Personalized recruitment listings strictly matched to your academic branch ({profile?.department || 'N/A'}) and CGPA ({profile?.cgpa ? profile.cgpa.toFixed(2) : '0.00'}).
          </p>
        </div>
      </div>

      {/* Academic Eligibility Banner */}
      <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200/80 flex items-center justify-between text-xs text-indigo-900">
        <div className="flex items-center space-x-2.5">
          <Award className="w-5 h-5 text-indigo-600 flex-shrink-0" />
          <span>
            Showing verified placement opportunities where <strong>{profile?.department}</strong> is permitted and minimum CGPA criteria (≤ <strong>{profile?.cgpa ? profile.cgpa.toFixed(2) : '0.00'}</strong>) is satisfied.
          </span>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
        <Input
          placeholder="Search by company name, role, or location..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 bg-white"
        />
      </div>

      {/* Placement Drives Grid */}
      {loading ? (
        <LoadingSpinner size="lg" className="h-64" />
      ) : placements.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="No Matching Placement Drives"
          description="There are currently no active placement drives matching your branch and CGPA requirements. Check back as new campus drives are published."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {placements.map((plc) => (
            <Card
              key={plc._id}
              className="flex flex-col justify-between hover:shadow-md hover:border-indigo-300 transition-all border-slate-200/80"
            >
              <CardContent className="p-6 space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 uppercase">
                      Eligible • Min CGPA {plc.minimumCgpa}
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 mt-1">{plc.companyName}</h3>
                    <p className="text-sm font-semibold text-indigo-600">{plc.jobTitle}</p>
                  </div>

                  <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg">
                    {plc.packageDetails || 'Competitive Package'}
                  </span>
                </div>

                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                  {plc.jobDescription}
                </p>

                <div className="space-y-1.5 text-xs text-slate-500 pt-2 border-t border-slate-100">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>
                      Deadline: <strong>{new Date(plc.applicationDeadline).toLocaleDateString()}</strong>
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>Location: {plc.location || 'Multiple Locations'}</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Building className="w-3.5 h-3.5 text-slate-400" />
                    <span>Eligible Branches: {plc.eligibleBranches.join(', ')}</span>
                  </div>
                </div>
              </CardContent>

              <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 rounded-b-xl flex items-center justify-between text-xs">
                <span className="text-emerald-700 font-semibold flex items-center">
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Profile Verified
                </span>

                {plc.applicationUrl ? (
                  <a
                    href={plc.applicationUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center font-bold text-indigo-600 hover:text-indigo-800"
                  >
                    Apply Now <ExternalLink className="w-3.5 h-3.5 ml-1" />
                  </a>
                ) : (
                  <span className="text-slate-400">Apply via Training & Placement Cell</span>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
