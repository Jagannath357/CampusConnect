import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';
import { Compass, ArrowLeft, Send, AlertCircle, Shield } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';

const CATEGORIES = ['TECHNICAL', 'CULTURAL', 'SPORTS', 'ACADEMIC', 'SOCIAL'];

export const ClubApplyPage: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    clubName: '',
    category: 'TECHNICAL',
    description: '',
    objectives: '',
    facultyAdvisorName: '',
    facultyAdvisorEmail: '',
    contactEmail: '',
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (formData.description.length < 20 || formData.objectives.length < 20) {
      setErrorMessage('Please provide comprehensive descriptions and objectives (min 20 characters each).');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/clubs/apply', formData);
      if (res.data.success) {
        setSuccess(true);
      }
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || 'Failed to submit club application.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Link
        to="/clubs"
        className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Clubs
      </Link>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-black text-slate-900 flex items-center space-x-2">
            <Compass className="w-6 h-6 text-indigo-600" />
            <span>Apply to Establish Student Club</span>
          </CardTitle>
          <p className="text-xs text-slate-500 mt-1">
            Applications are evaluated under university organization governance and verified by campus administration.
          </p>
        </CardHeader>

        <CardContent>
          {success ? (
            <div className="p-8 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Application Submitted!</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Your proposal for "{formData.clubName}" has been routed to university administration for governance review. You will receive an alert once approved.
              </p>
              <div className="pt-2">
                <Link to="/clubs">
                  <Button variant="primary" size="sm">
                    Return to Clubs Directory
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMessage && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <Input
                label="Proposed Club Name"
                value={formData.clubName}
                onChange={(e) => setFormData({ ...formData, clubName: e.target.value })}
                placeholder="e.g. Silicon Cloud Architecture Chapter"
                required
              />

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Club Classification
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="flex h-10 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <Textarea
                label="Club Mission & Charter"
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Explain the background, vision, and how this society benefits Silicon University students..."
                required
              />

              <Textarea
                label="Key Objectives & Planned Activities"
                rows={3}
                value={formData.objectives}
                onChange={(e) => setFormData({ ...formData, objectives: e.target.value })}
                placeholder="Workshops, guest talks, competitive participation, scheduled meetups..."
                required
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Faculty Advisor Full Name"
                  value={formData.facultyAdvisorName}
                  onChange={(e) => setFormData({ ...formData, facultyAdvisorName: e.target.value })}
                  placeholder="e.g. Dr. Soumya Sen"
                  required
                />

                <Input
                  label="Faculty Advisor Email"
                  type="email"
                  value={formData.facultyAdvisorEmail}
                  onChange={(e) => setFormData({ ...formData, facultyAdvisorEmail: e.target.value })}
                  placeholder="e.g. faculty@silicon.ac.in"
                  required
                />
              </div>

              <Input
                label="Official Club Contact Email"
                type="email"
                value={formData.contactEmail}
                onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                placeholder="e.g. cloudclub@silicon.ac.in"
                required
              />

              <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100">
                <Link to="/clubs">
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </Link>
                <Button type="submit" variant="primary" isLoading={loading}>
                  <Send className="w-4 h-4 mr-1.5" /> Submit Application
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

