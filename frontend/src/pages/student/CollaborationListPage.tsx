import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { CollaborationPost } from '../../types';
import {
  Users2,
  Plus,
  Search,
  Filter,
  Clock,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent } from '../../components/ui/card';
import { StatusBadge } from '../../components/common/StatusBadge';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { EmptyState } from '../../components/common/EmptyState';

const DOMAINS = [
  'ALL',
  'Web Development',
  'AI/ML',
  'Robotics',
  'Mobile App',
  'Cybersecurity',
  'Cloud/DevOps',
  'IoT & Embedded',
  'Blockchain',
  'Other',
];

export const CollaborationListPage: React.FC = () => {
  const [posts, setPosts] = useState<CollaborationPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('ALL');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (selectedDomain !== 'ALL') params.append('domain', selectedDomain);
      params.append('status', 'OPEN');
      params.append('page', page.toString());
      params.append('limit', '9');

      const res = await api.get(`/collaborations?${params.toString()}`);
      if (res.data.success) {
        setPosts(res.data.data);
        setTotalPages(res.data.pagination?.totalPages || 1);
      }
    } catch (err) {
      console.error('Failed to load collaborations', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [search, selectedDomain, page]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight flex items-center space-x-2.5">
            <Users2 className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            <span>Project Teammate Finder</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Discover technical teammates and join hackathon squads across Silicon University.
          </p>
        </div>

        <Link to="/collaborations/create">
          <Button variant="primary" size="sm">
            <Plus className="w-4 h-4 mr-1.5" /> Post Squad Request
          </Button>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs transition-colors">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <Input
            placeholder="Search by project title, keyword, or skill tag..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="pl-9"
          />
        </div>

        {/* Domain Filter Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 sm:pb-0">
          <Filter className="w-4 h-4 text-slate-400 ml-1 mr-1 flex-shrink-0" />
          {DOMAINS.slice(0, 6).map((dom) => (
            <button
              key={dom}
              onClick={() => {
                setSelectedDomain(dom);
                setPage(1);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all border ${
                selectedDomain === dom
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border-slate-200/80 dark:border-slate-700'
              }`}
            >
              {dom}
            </button>
          ))}
        </div>
      </div>

      {/* Post Grid */}
      {loading ? (
        <LoadingSpinner size="lg" className="h-64" />
      ) : posts.length === 0 ? (
        <EmptyState
          icon={Users2}
          title="No Collaboration Posts Found"
          description="There are currently no open project requests matching your search filter."
          actionText="Create Squad Post"
          onAction={() => (window.location.href = '/collaborations/create')}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {posts.map((post) => (
            <Card
              key={post._id}
              className="flex flex-col justify-between hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-700 transition-all border-slate-200/80 dark:border-slate-800 dark:bg-slate-900"
            >
              <CardContent className="p-5 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-extrabold uppercase tracking-wider text-[10px] text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200/60 dark:border-indigo-800 px-2.5 py-0.5 rounded-full">
                    {post.domain}
                  </span>
                  <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/70 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                    {post.vacancyCount} {post.vacancyCount === 1 ? 'spot open' : 'spots open'}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 leading-snug hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
                    {post.description}
                  </p>
                </div>

                {/* Skill tags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {post.requiredSkills.map((skill) => (
                    <span
                      key={skill}
                      className="text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 px-2.5 py-1 rounded-md border border-slate-200/60 dark:border-slate-700"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </CardContent>

              <div className="px-5 py-3 bg-slate-50 dark:bg-slate-900/90 border-t border-slate-100 dark:border-slate-800 rounded-b-xl flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2 text-slate-500 dark:text-slate-400">
                  <span className="font-semibold text-slate-700 dark:text-slate-200">{post.creatorId?.name}</span>
                  <span>•</span>
                  <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                </div>

                <Link
                  to={`/collaborations/${post._id}`}
                  className="font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 flex items-center text-xs"
                >
                  Details <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center space-x-2 pt-4">
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

