import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';
import { Users2, ArrowLeft, Plus, CheckCircle, AlertCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';

const DOMAINS = [
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

export const CreateCollaborationPage: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    domain: 'Web Development',
    requiredSkills: '',
    vacancyCount: 1,
    vacancyDescription: '',
    contactInfo: '',
    tags: '',
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (formData.title.length < 5) {
      setErrorMessage('Title must be at least 5 characters');
      return;
    }

    if (formData.description.length < 20) {
      setErrorMessage('Description must be at least 20 characters');
      return;
    }

    const skillsArray = formData.requiredSkills
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    if (skillsArray.length === 0) {
      setErrorMessage('Please provide at least one required skill');
      return;
    }

    const tagsArray = formData.tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    setLoading(true);
    try {
      const res = await api.post('/collaborations', {
        title: formData.title,
        description: formData.description,
        domain: formData.domain,
        requiredSkills: skillsArray,
        vacancyCount: Number(formData.vacancyCount),
        vacancyDescription: formData.vacancyDescription,
        contactInfo: formData.contactInfo,
        tags: tagsArray,
      });

      if (res.data.success) {
        navigate(`/collaborations/${res.data.data._id}`);
      }
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || 'Failed to publish collaboration post.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Link
        to="/collaborations"
        className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Teammate Finder
      </Link>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-black text-slate-900 flex items-center space-x-2">
            <Users2 className="w-6 h-6 text-indigo-600" />
            <span>Create Teammate Request Post</span>
          </CardTitle>
          <p className="text-xs text-slate-500 mt-1">
            Describe your project, team vacancies, and skill requirements for interested classmates.
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
              label="Project Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Autonomous Campus Delivery Rover"
              required
            />

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Technical Domain
              </label>
              <select
                value={formData.domain}
                onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                className="flex h-10 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500"
              >
                {DOMAINS.map((dom) => (
                  <option key={dom} value={dom}>
                    {dom}
                  </option>
                ))}
              </select>
            </div>

            <Textarea
              label="Project Overview & Goal"
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Explain the hackathon track, problem statement, technical stack, and milestone timeline..."
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Number of Vacancies"
                type="number"
                min="1"
                max="10"
                value={formData.vacancyCount}
                onChange={(e) => setFormData({ ...formData, vacancyCount: Number(e.target.value) })}
                required
              />

              <Input
                label="Vacancy Role Title"
                value={formData.vacancyDescription}
                onChange={(e) => setFormData({ ...formData, vacancyDescription: e.target.value })}
                placeholder="e.g. 1 Backend Developer + 1 Hardware Specialist"
              />
            </div>

            <Input
              label="Required Skills (Comma separated)"
              value={formData.requiredSkills}
              onChange={(e) => setFormData({ ...formData, requiredSkills: e.target.value })}
              placeholder="e.g. React, Python, OpenCV, Docker, ROS2"
              required
            />

            <Input
              label="Contact Info (Email, Phone or Discord)"
              value={formData.contactInfo}
              onChange={(e) => setFormData({ ...formData, contactInfo: e.target.value })}
              placeholder="e.g. rohit@silicon.ac.in | WhatsApp: +91 9876543210"
              required
            />

            <Input
              label="Project Tags (Comma separated)"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              placeholder="HackFest2026, AI, Robotics, Capstone"
            />

            <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100">
              <Link to="/collaborations">
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Link>
              <Button type="submit" variant="primary" isLoading={loading}>
                Publish Teammate Request
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
