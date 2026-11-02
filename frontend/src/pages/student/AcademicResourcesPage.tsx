import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { AcademicResource } from '../../types';
import { getFileUrl } from '../../utils/url';
import {
  BookOpen,
  Upload,
  Search,
  Download,
  FileText,
  FileCode,
  Tag,
  ExternalLink,
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent } from '../../components/ui/card';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { EmptyState } from '../../components/common/EmptyState';

const CATEGORIES = ['ALL', 'Lecture Notes', 'PYQ', 'Lab Manual', 'Textbook', 'Reference Guide'];

export const AcademicResourcesPage: React.FC = () => {
  const [resources, setResources] = useState<AcademicResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  const fetchResources = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (selectedCategory !== 'ALL') params.append('category', selectedCategory);

      const res = await api.get(`/resources?${params.toString()}`);
      if (res.data.success) {
        setResources(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load resources', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, [search, selectedCategory]);

  const handleDownload = async (resource: AcademicResource) => {
    const targetUrl = getFileUrl(resource.fileUrl);
    try {
      await api.post(`/resources/${resource._id}/download`);
      window.open(targetUrl, '_blank');
      // Update local download counter
      setResources((prev) =>
        prev.map((r) =>
          r._id === resource._id ? { ...r, downloadCount: r.downloadCount + 1 } : r
        )
      );
    } catch (e) {
      window.open(targetUrl, '_blank');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight flex items-center space-x-2.5">
            <BookOpen className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            <span>Academic Resource Repository</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Verified study materials, lecture summaries, lab manuals, and previous year question papers.
          </p>
        </div>

        <Link to="/resources/upload">
          <Button variant="primary" size="sm">
            <Upload className="w-4 h-4 mr-1.5" /> Upload Study Material
          </Button>
        </Link>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col md:flex-row gap-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <Input
            placeholder="Search by course code, title, or topic..."
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

      {/* Resource Cards */}
      {loading ? (
        <LoadingSpinner size="lg" className="h-64" />
      ) : resources.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No Academic Resources Found"
          description="Upload your notes or question papers to help classmates excel in examinations."
          actionText="Upload Resource"
          onAction={() => (window.location.href = '/resources/upload')}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {resources.map((res) => (
            <Card
              key={res._id}
              className="flex flex-col justify-between hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-700 transition-all border-slate-200/80 dark:border-slate-800 dark:bg-slate-900"
            >
              <CardContent className="p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold uppercase bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 px-2.5 py-0.5 rounded-full">
                    {res.courseCode}
                  </span>
                  <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200/60 dark:border-slate-700">
                    {res.category}
                  </span>
                </div>

                <div className="flex items-start space-x-3 pt-1">
                  <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-indigo-400 flex-shrink-0 border border-slate-200/60 dark:border-slate-700">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-snug line-clamp-2">
                      {res.title}
                    </h3>
                    <p className="text-[11px] text-slate-400 dark:text-slate-400 mt-0.5">{res.fileName}</p>
                  </div>
                </div>

                {res.description && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {res.description}
                  </p>
                )}
              </CardContent>

              <div className="px-5 py-3 bg-slate-50 dark:bg-slate-900/90 border-t border-slate-100 dark:border-slate-800 rounded-b-xl flex items-center justify-between text-xs">
                <div className="text-slate-500 dark:text-slate-400 text-[11px]">
                  <span>{(res.fileSize / 1024 / 1024).toFixed(1)} MB</span>
                  <span className="mx-1.5">•</span>
                  <span>{res.downloadCount} downloads</span>
                </div>

                <Button size="sm" variant="outline" onClick={() => handleDownload(res)}>
                  <Download className="w-3.5 h-3.5 mr-1" /> Download
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

