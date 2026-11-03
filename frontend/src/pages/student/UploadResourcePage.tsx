import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';
import { BookOpen, ArrowLeft, Upload, FileText, AlertCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';

const CATEGORIES = ['Lecture Notes', 'PYQ', 'Lab Manual', 'Textbook', 'Reference Guide'];

export const UploadResourcePage: React.FC = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [courseCode, setCourseCode] = useState('');
  const [category, setCategory] = useState('Lecture Notes');
  const [description, setDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!selectedFile) {
      setErrorMessage('Please select a PDF or document file to upload');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('courseCode', courseCode.toUpperCase());
    formData.append('category', category);
    formData.append('description', description);
    formData.append('file', selectedFile);

    setLoading(true);
    try {
      const res = await api.post('/resources', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data.success) {
        navigate('/resources');
      }
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || 'Failed to upload study resource.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Link
        to="/resources"
        className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Resources
      </Link>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-black text-slate-900 dark:text-slate-100 flex items-center space-x-2">
            <BookOpen className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            <span>Upload Academic Resource</span>
          </CardTitle>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Share study notes, solved question sets, and laboratory documentation with fellow students.
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
              label="Resource Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Operating Systems Concurrency & Deadlocks Solved Question Bank"
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Course / Subject Code"
                value={courseCode}
                onChange={(e) => setCourseCode(e.target.value)}
                placeholder="e.g. CS302 or ME401"
                required
              />

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Resource Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="flex h-10 w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat} className="bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100">
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <Textarea
              label="Resource Description"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Summary of topics covered, syllabus unit, or faculty reference..."
            />

            {/* Document File Input */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Attach Document (PDF, DOCX, PPTX max 15MB)
              </label>
              <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-6 text-center hover:border-indigo-400 dark:hover:border-indigo-600 transition-colors bg-slate-50/50 dark:bg-slate-800/40">
                <input
                  id="resource-file-input"
                  type="file"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx,.ppt,.pptx,.txt"
                  className="hidden"
                />
                <label htmlFor="resource-file-input" className="cursor-pointer block">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto mb-2">
                    <Upload className="w-6 h-6" />
                  </div>
                  {selectedFile ? (
                    <div>
                      <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{selectedFile.name}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB • Ready to upload
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-sm font-bold text-slate-700 dark:text-slate-200">Click to browse file</p>
                      <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">PDF, DOCX, or PPTX up to 15MB</p>
                    </div>
                  )}
                </label>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <Link to="/resources">
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Link>
              <Button type="submit" variant="primary" isLoading={loading}>
                Upload Document
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

