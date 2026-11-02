import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import {
  ShieldAlert,
  Search,
  Trash2,
  RotateCcw,
  AlertCircle,
  CheckCircle2,
  FileText,
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/ui/tabs';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';

export const ContentModerationPage: React.FC = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Moderation action
  const [selectedItem, setSelectedItem] = useState<{
    contentType: 'collaboration' | 'question';
    id: string;
    action: 'REMOVE' | 'RESTORE';
  } | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const fetchModerationData = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/moderation');
      if (res.data.success) {
        setPosts(res.data.data.posts);
        setQuestions(res.data.data.questions);
      }
    } catch (err) {
      console.error('Failed to load moderation content', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchModerationData();
  }, []);

  const handleModerate = async () => {
    if (!selectedItem) return;
    setActionLoading(true);
    setSuccessMessage('');
    try {
      const res = await api.post(
        `/admin/moderation/${selectedItem.contentType}/${selectedItem.id}`,
        {
          action: selectedItem.action,
          reason: 'Administrative guideline enforcement moderation.',
        }
      );
      if (res.data.success) {
        setSuccessMessage(`Content item successfully ${selectedItem.action === 'REMOVE' ? 'removed from student feed' : 'restored'}.`);
        setSelectedItem(null);
        await fetchModerationData();
      }
    } catch (err) {
      console.error('Failed to moderate content', err);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight flex items-center space-x-2.5">
          <ShieldAlert className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          <span>Content Moderation Engine</span>
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Review, flag, and remove inappropriate, abusive, or spam content from student collaboration and discussion feeds.
        </p>
      </div>

      {successMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      <Tabs defaultValue="collab">
        <TabsList>
          <TabsTrigger value="collab">
            Moderated Collaborations ({posts.length})
          </TabsTrigger>
          <TabsTrigger value="questions">
            Moderated Questions ({questions.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="collab">
          <Card>
            <CardContent className="p-6">
              {loading ? (
                <LoadingSpinner size="md" />
              ) : posts.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-8">
                  No moderated collaboration posts currently flagged or hidden.
                </p>
              ) : (
                <div className="space-y-4">
                  {posts.map((post) => (
                    <div
                      key={post._id}
                      className="p-4 rounded-xl border border-rose-200 bg-rose-50/30 flex items-start justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <span className="text-[10px] font-extrabold uppercase bg-rose-100 text-rose-700 px-2.5 py-0.5 rounded-full">
                          MODERATED • HIDDEN FROM PUBLIC FEED
                        </span>
                        <h4 className="text-sm font-bold text-slate-900 pt-1">{post.title}</h4>
                        <p className="text-xs text-slate-600 line-clamp-2">{post.description}</p>
                        <p className="text-[11px] text-slate-400">
                          Creator: {post.creatorId?.name} ({post.creatorId?.email})
                        </p>
                      </div>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          setSelectedItem({
                            contentType: 'collaboration',
                            id: post._id,
                            action: 'RESTORE',
                          })
                        }
                      >
                        <RotateCcw className="w-3.5 h-3.5 mr-1 text-emerald-600" /> Restore Post
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="questions">
          <Card>
            <CardContent className="p-6">
              {loading ? (
                <LoadingSpinner size="md" />
              ) : questions.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-8">
                  No moderated academic questions currently flagged.
                </p>
              ) : (
                <div className="space-y-4">
                  {questions.map((q) => (
                    <div
                      key={q._id}
                      className="p-4 rounded-xl border border-rose-200 bg-rose-50/30 flex items-start justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <span className="text-[10px] font-extrabold uppercase bg-rose-100 text-rose-700 px-2.5 py-0.5 rounded-full">
                          MODERATED • HIDDEN
                        </span>
                        <h4 className="text-sm font-bold text-slate-900 pt-1">{q.title}</h4>
                        <p className="text-xs text-slate-600 line-clamp-2">{q.description}</p>
                        <p className="text-[11px] text-slate-400">
                          Author: {q.authorId?.name} ({q.authorId?.email})
                        </p>
                      </div>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          setSelectedItem({
                            contentType: 'question',
                            id: q._id,
                            action: 'RESTORE',
                          })
                        }
                      >
                        <RotateCcw className="w-3.5 h-3.5 mr-1 text-emerald-600" /> Restore Question
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <ConfirmDialog
        isOpen={Boolean(selectedItem)}
        onClose={() => setSelectedItem(null)}
        onConfirm={handleModerate}
        title="Confirm Moderation Action"
        message={`Are you sure you want to ${selectedItem?.action.toLowerCase()} this content item? This action will be recorded in the audit log.`}
        variant={selectedItem?.action === 'REMOVE' ? 'danger' : 'primary'}
        confirmText="Confirm Action"
        isLoading={actionLoading}
      />
    </div>
  );
};

