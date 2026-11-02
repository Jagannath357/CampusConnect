import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';
import { HelpCircle, ArrowLeft, Send, AlertCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';

const CATEGORIES = [
  'Computer Science',
  'Mathematics',
  'Physics',
  'Electronics',
  'Mechanical',
  'Civil',
  'Humanities',
];

export const AskQuestionPage: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subjectCode: '',
    subjectCategory: 'Computer Science',
    tags: '',
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (formData.title.length < 5) {
      setErrorMessage('Question title must be at least 5 characters');
      return;
    }

    if (formData.description.length < 15) {
      setErrorMessage('Description must be at least 15 characters to explain the query');
      return;
    }

    const tagsArray = formData.tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    setLoading(true);
    try {
      const res = await api.post('/questions', {
        title: formData.title,
        description: formData.description,
        subjectCode: formData.subjectCode.toUpperCase(),
        subjectCategory: formData.subjectCategory,
        tags: tagsArray,
      });

      if (res.data.success) {
        navigate(`/questions/${res.data.data._id}`);
      }
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || 'Failed to post academic question.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Link
        to="/questions"
        className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Q&A List
      </Link>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-black text-slate-900 flex items-center space-x-2">
            <HelpCircle className="w-6 h-6 text-indigo-600" />
            <span>Ask Academic Question</span>
          </CardTitle>
          <p className="text-xs text-slate-500 mt-1">
            Get help from course toppers, professors, and senior classmates on university coursework.
          </p>
        </CardHeader>

        <CardContent>
          {errorMessage && (
            <div className="mb-4 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Question Title / Summary"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. How to implement Topological Sort using Kahn's Algorithm?"
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Course / Subject Code"
                value={formData.subjectCode}
                onChange={(e) => setFormData({ ...formData, subjectCode: e.target.value })}
                placeholder="e.g. CS301 or EC202"
                required
              />

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Academic Category
                </label>
                <select
                  value={formData.subjectCategory}
                  onChange={(e) => setFormData({ ...formData, subjectCategory: e.target.value })}
                  className="flex h-10 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <Textarea
              label="Detailed Description & Context"
              rows={5}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe where you are stuck, expected behavior, textbook problem number, or error messages..."
              required
            />

            <Input
              label="Academic Tags (Comma separated)"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              placeholder="Algorithms, Graphs, BFS, Midterm"
            />

            <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100">
              <Link to="/questions">
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Link>
              <Button type="submit" variant="primary" isLoading={loading}>
                <Send className="w-4 h-4 mr-1.5" /> Post Question
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

