import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { AcademicQuestion, AcademicAnswer } from '../../types';
import {
  HelpCircle,
  ArrowLeft,
  MessageSquare,
  Send,
  User,
  Clock,
  Trash2,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Textarea } from '../../components/ui/textarea';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

export const QuestionDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();

  const [question, setQuestion] = useState<AcademicQuestion | null>(null);
  const [answers, setAnswers] = useState<AcademicAnswer[]>([]);
  const [loading, setLoading] = useState(true);
  const [newAnswer, setNewAnswer] = useState('');
  const [submittingAnswer, setSubmittingAnswer] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const fetchQuestionDetails = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/questions/${id}`);
      if (res.data.success) {
        setQuestion(res.data.data.question);
        setAnswers(res.data.data.answers);
      }
    } catch (err) {
      console.error('Failed to load question details', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestionDetails();
  }, [id]);

  const handlePostAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newAnswer.trim().length < 5) {
      setErrorMessage('Answer must be at least 5 characters');
      return;
    }

    setSubmittingAnswer(true);
    setErrorMessage('');
    try {
      const res = await api.post(`/questions/${id}/answers`, {
        content: newAnswer,
      });
      if (res.data.success) {
        setNewAnswer('');
        await fetchQuestionDetails();
      }
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || 'Failed to post answer.');
    } finally {
      setSubmittingAnswer(false);
    }
  };

  if (loading) {
    return <LoadingSpinner size="lg" className="h-64" />;
  }

  if (!question) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-bold text-slate-800">Question not found</h2>
        <Link to="/questions" className="text-xs text-indigo-600 mt-2 inline-block">
          Return to Q&A List
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link
        to="/questions"
        className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Academic Q&A
      </Link>

      {/* Question Card */}
      <Card>
        <CardContent className="p-6 sm:p-8 space-y-4">
          <div className="flex items-center space-x-2 text-xs">
            <span className="font-extrabold uppercase tracking-wider text-[10px] text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 rounded-full">
              {question.subjectCode}
            </span>
            <span className="text-slate-400">•</span>
            <span className="text-slate-500 font-medium">{question.subjectCategory}</span>
          </div>

          <h1 className="text-2xl font-black text-slate-900 leading-snug">{question.title}</h1>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-sm text-slate-800 leading-relaxed whitespace-pre-wrap">
            {question.description}
          </div>

          <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-[10px]">
                {question.authorId?.name?.charAt(0)}
              </div>
              <span className="font-semibold text-slate-700">{question.authorId?.name}</span>
              <span>•</span>
              <span>{new Date(question.createdAt).toLocaleDateString()}</span>
            </div>

            <div className="flex gap-1.5 mt-2 sm:mt-0">
              {question.tags.map((tag) => (
                <span key={tag} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Answers Section */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
          <MessageSquare className="w-4 h-4 text-indigo-600" />
          <span>Peer Answers ({answers.length})</span>
        </h3>

        {answers.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-2xl border border-slate-200/80">
            <p className="text-xs text-slate-500">No peer answers posted yet. Help your classmate by answering below!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {answers.map((ans) => (
              <Card key={ans._id} className="border-slate-200/80">
                <CardContent className="p-5 space-y-3">
                  <div className="text-sm text-slate-800 leading-relaxed whitespace-pre-wrap">
                    {ans.content}
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-100">
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-slate-700">{ans.authorId?.name}</span>
                      <span>•</span>
                      <span>{new Date(ans.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Post Answer Form */}
        <Card>
          <CardContent className="p-6">
            <h4 className="text-sm font-bold text-slate-900 mb-3">Your Answer / Academic Solution</h4>
            {errorMessage && (
              <div className="mb-3 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}
            <form onSubmit={handlePostAnswer} className="space-y-3">
              <Textarea
                rows={4}
                value={newAnswer}
                onChange={(e) => setNewAnswer(e.target.value)}
                placeholder="Explain the concept clearly, provide derivations, code snippets, or reference textbook chapters..."
                required
              />
              <div className="flex justify-end">
                <Button type="submit" variant="primary" size="sm" isLoading={submittingAnswer}>
                  <Send className="w-3.5 h-3.5 mr-1.5" /> Post Peer Answer
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

