import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { Club } from '../../types';
import { Compass, Plus, Search, ShieldCheck, Mail, ArrowRight, User } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent } from '../../components/ui/card';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { EmptyState } from '../../components/common/EmptyState';

const CATEGORIES = ['ALL', 'TECHNICAL', 'CULTURAL', 'SPORTS', 'ACADEMIC', 'SOCIAL'];

export const ClubsListPage: React.FC = () => {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  const fetchClubs = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (selectedCategory !== 'ALL') params.append('category', selectedCategory);

      const res = await api.get(`/clubs?${params.toString()}`);
      if (res.data.success) {
        setClubs(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load clubs', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClubs();
  }, [search, selectedCategory]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center space-x-2.5">
            <Compass className="w-6 h-6 text-indigo-600" />
            <span>Student Club Discovery</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Explore officially approved student societies, technical chapters, and cultural organizations at Silicon University.
          </p>
        </div>

        <Link to="/clubs/apply">
          <Button variant="primary" size="sm">
            <Plus className="w-4 h-4 mr-1.5" /> Register New Club
          </Button>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <Input
            placeholder="Search clubs by name, code, or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 sm:pb-0">
          {CATEGORIES.map((cat) => (
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

      {/* Clubs Grid */}
      {loading ? (
        <LoadingSpinner size="lg" className="h-64" />
      ) : clubs.length === 0 ? (
        <EmptyState
          icon={Compass}
          title="No Student Clubs Found"
          description="Submit an application to start an official student organization on campus."
          actionText="Apply to Register Club"
          onAction={() => (window.location.href = '/clubs/apply')}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {clubs.map((club) => (
            <Card
              key={club._id}
              className="flex flex-col justify-between hover:shadow-md hover:border-indigo-300 transition-all border-slate-200/80"
            >
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold uppercase bg-indigo-50 text-indigo-700 border border-indigo-200 px-2.5 py-0.5 rounded-full">
                    {club.category}
                  </span>
                  <span className="flex items-center text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    <ShieldCheck className="w-3.5 h-3.5 mr-1 text-emerald-600" /> Verified Club
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-900 leading-snug">{club.name}</h3>
                  <span className="text-xs font-mono font-bold text-slate-400">Code: {club.code}</span>
                  <p className="text-xs text-slate-600 mt-2 line-clamp-3 leading-relaxed">
                    {club.description}
                  </p>
                </div>

                <div className="space-y-1 text-xs text-slate-500 pt-2 border-t border-slate-100">
                  <div className="flex items-center space-x-2">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>Lead: <strong>{club.leadStudentName}</strong></span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span>{club.contactEmail}</span>
                  </div>
                </div>
              </CardContent>

              <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 rounded-b-xl flex items-center justify-end text-xs">
                <Link
                  to={`/clubs/${club._id}`}
                  className="font-bold text-indigo-600 hover:text-indigo-800 flex items-center"
                >
                  View Details & Membership <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

