import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { AcademicQuestion } from '../../types';
import { HelpCircle, Plus, Search, MessageSquare, Tag, ArrowRight } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent } from '../../components/ui/card';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { EmptyState } from '../../components/common/EmptyState';

const CATEGORIES = [
  'ALL',
  'Computer Science',
  'Mathematics',
  'Physics',
  'Electronics',
  'Mechanical',
  'Civil',
  'Humanities',
];

export const AcademicQnAListPage: React.FC = () => {
  const [questions, setQuestions] = useState<AcademicQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (selectedCategory !== 'ALL') params.append('category', selectedCategory);
      params.append('page', page.toString());
      params.append('limit', '10');

      const res = await api.get(`/questions?${params.toString()}`);
      if (res.data.success) {
        setQuestions(res.data.data);
        setTotalPages(res.data.pagination?.totalPages || 1);
      }
    } catch (err) {
      console.error('Failed to load questions', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [search, selectedCategory, page]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center space-x-2.5">
            <HelpCircle className="w-6 h-6 text-indigo-600" />
            <span>Academic Peer Q&A</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Subject-wise discussion platform to resolve academic queries with classmates and seniors.
          </p>
        </div>

        <Link to="/questions/ask">
          <Button variant="primary" size="sm">
            <Plus className="w-4 h-4 mr-1.5" /> Ask Academic Question
          </Button>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <Input
            placeholder="Search by question title, concept, or subject code..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="pl-9"
          />
        </div>

        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 sm:pb-0">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setPage(1);
              }}
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

      {/* Questions List */}
      {loading ? (
        <LoadingSpinner size="lg" className="h-64" />
      ) : questions.length === 0 ? (
        <EmptyState
          icon={HelpCircle}
          title="No Academic Questions Found"
          description="Be the first to post a question in this subject category!"
          actionText="Ask a Question"
          onAction={() => (window.location.href = '/questions/ask')}
        />
      ) : (
        <div className="space-y-3">
          {questions.map((q) => (
            <Card
              key={q._id}
              className="hover:shadow-sm hover:border-indigo-300 transition-all border-slate-200/80"
            >
              <CardContent className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1.5 flex-1 pr-4">
                  <div className="flex items-center space-x-2 text-xs">
                    <span className="font-extrabold uppercase tracking-wider text-[10px] text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 rounded-full">
                      {q.subjectCode}
                    </span>
                    <span className="text-slate-400">•</span>
                    <span className="text-slate-500 font-medium">{q.subjectCategory}</span>
                  </div>

                  <Link
                    to={`/questions/${q._id}`}
                    className="text-base font-bold text-slate-900 hover:text-indigo-600 transition-colors line-clamp-2"
                  >
                    {q.title}
                  </Link>

                  <p className="text-xs text-slate-500 line-clamp-2">{q.description}</p>

                  <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-slate-400">
                    <span>Asked by <strong>{q.authorId?.name}</strong></span>
                    <span>•</span>
                    <span>{new Date(q.createdAt).toLocaleDateString()}</span>
                    {q.tags.map((t) => (
                      <span key={t} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center space-x-4 flex-shrink-0 sm:border-l sm:border-slate-100 sm:pl-6">
                  <div className="text-center">
                    <span className="text-lg font-black text-indigo-600 block leading-tight">
                      {q.answerCount}
                    </span>
                    <span className="text-[10px] uppercase font-bold text-slate-400">Answers</span>
                  </div>

                  <Link to={`/questions/${q._id}`}>
                    <Button size="sm" variant="outline">
                      View <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

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
