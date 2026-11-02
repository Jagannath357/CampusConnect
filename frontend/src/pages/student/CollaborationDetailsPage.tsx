import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { CollaborationPost, StudentProfile } from '../../types';
import {
  Users2,
  ArrowLeft,
  Calendar,
  Mail,
  User,
  Trash2,
  CheckCircle,
  AlertCircle,
  Tag,
  Briefcase,
} from 'lucide-react';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { StatusBadge } from '../../components/common/StatusBadge';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';

export const CollaborationDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [post, setPost] = useState<CollaborationPost | null>(null);
  const [creatorProfile, setCreatorProfile] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/collaborations/${id}`);
        if (res.data.success) {
          setPost(res.data.data.post);
          setCreatorProfile(res.data.data.creatorProfile);
        }
      } catch (err) {
        console.error('Failed to load post', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await api.delete(`/collaborations/${id}`);
      navigate('/collaborations');
    } catch (err) {
      console.error('Failed to delete post', err);
    } finally {
      setIsDeleting(false);
      setShowConfirmDelete(false);
    }
  };

  const isOwner = user?._id === post?.creatorId?._id || user?.role === 'ADMIN';

  if (loading) {
    return <LoadingSpinner size="lg" className="h-64" />;
  }

  if (!post) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-bold text-slate-800">Post not found</h2>
        <Link to="/collaborations" className="text-xs text-indigo-600 mt-2 inline-block">
          Return to teammate finder
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link
        to="/collaborations"
        className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Teammate Finder
      </Link>

      <Card>
        <CardContent className="p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-slate-100">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <span className="font-extrabold uppercase tracking-wider text-xs text-indigo-700 bg-indigo-50 border border-indigo-200 px-3 py-1 rounded-full">
                  {post.domain}
                </span>
                <StatusBadge status={post.status} />
              </div>
              <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100">{post.title}</h1>
            </div>

            {isOwner && (
              <Button
                variant="outline"
                size="sm"
                className="text-rose-600 border-rose-200 hover:bg-rose-50"
                onClick={() => setShowConfirmDelete(true)}
              >
                <Trash2 className="w-4 h-4 mr-1" /> Delete Post
              </Button>
            )}
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Project Description</h3>
            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{post.description}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Teammate Vacancies</span>
              <p className="text-sm font-bold text-slate-800 mt-0.5">
                {post.vacancyCount} {post.vacancyCount === 1 ? 'teammate' : 'teammates'} needed
              </p>
              {post.vacancyDescription && (
                <p className="text-xs text-slate-500 mt-1">{post.vacancyDescription}</p>
              )}
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Direct Contact Details</span>
              <p className="text-sm font-bold text-indigo-700 mt-0.5 select-all">{post.contactInfo}</p>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">Required Technical Skills</h3>
            <div className="flex flex-wrap gap-2">
              {post.requiredSkills.map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-semibold"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Project Creator Summary Card */}
          <div className="pt-6 border-t border-slate-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Posted By</h3>
            <div className="flex items-center space-x-3 p-4 rounded-xl bg-slate-50 border border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                {post.creatorId?.name?.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800">{post.creatorId?.name}</p>
                <p className="text-xs text-slate-500">
                  {creatorProfile?.department || 'Student'} • Batch {creatorProfile?.batchYear || ''} • {post.creatorId?.email}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <ConfirmDialog
        isOpen={showConfirmDelete}
        onClose={() => setShowConfirmDelete(false)}
        onConfirm={handleDelete}
        title="Delete Collaboration Post"
        message="Are you sure you want to permanently delete this project post? This action cannot be reversed."
        variant="danger"
        confirmText="Delete Post"
        isLoading={isDeleting}
      />
    </div>
  );
};

