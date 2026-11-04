import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import {
  User as UserIcon,
  Mail,
  Phone,
  BookOpen,
  Calendar,
  Award,
  Github,
  Linkedin,
  Upload,
  CheckCircle,
  AlertCircle,
  Edit3,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { getFileUrl } from '../../utils/url';

export const MyProfilePage: React.FC = () => {
  const { user, profile, refreshUser } = useAuth();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    contactNumber: profile?.contactNumber || '',
    bio: profile?.bio || '',
    skills: profile?.skills?.join(', ') || '',
    githubUrl: profile?.githubUrl || '',
    linkedinUrl: profile?.linkedinUrl || '',
    cgpa: profile?.cgpa || 0,
  });

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');
    setSavingProfile(true);

    try {
      const skillsArray = formData.skills
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      const res = await api.put('/profiles/me', {
        contactNumber: formData.contactNumber,
        bio: formData.bio,
        skills: skillsArray,
        githubUrl: formData.githubUrl,
        linkedinUrl: formData.linkedinUrl,
        cgpa: Number(formData.cgpa),
      });

      if (res.data.success) {
        await refreshUser();
        setSuccessMessage('Profile updated successfully!');
        setIsEditing(false);
      }
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const data = new FormData();
    data.append('avatar', file);

    setUploadingAvatar(true);
    setErrorMessage('');
    try {
      const res = await api.post('/profiles/avatar', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (res.data.success) {
        await refreshUser();
        setSuccessMessage('Avatar uploaded successfully!');
        if (res.data.data?.avatarUrl) {
          navigate(
            `/image-view?url=${encodeURIComponent(res.data.data.avatarUrl)}&title=${encodeURIComponent(
              `${user?.name || 'Student'} Profile Photo`
            )}&source=${encodeURIComponent('Academic Profile Photo')}&backUrl=/profile`
          );
        }
      }
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || 'Failed to upload avatar.');
    } finally {
      setUploadingAvatar(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">Academic Profile</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Silicon University student record and collaboration profile.</p>
        </div>
        <Button
          variant={isEditing ? 'outline' : 'primary'}
          size="sm"
          onClick={() => setIsEditing(!isEditing)}
        >
          <Edit3 className="w-4 h-4 mr-1.5" />
          {isEditing ? 'Cancel Edit' : 'Edit Profile'}
        </Button>
      </div>

      {successMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center space-x-2">
          <CheckCircle className="w-4 h-4 flex-shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Main Profile Card */}
      <Card>
        <CardContent className="p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 pb-6 border-b border-slate-100">
            {/* Avatar & Upload button */}
            <div className="flex flex-col items-center space-y-2">
              <div className="relative group">
                {profile?.avatarUrl ? (
                  <img
                    src={getFileUrl(profile.avatarUrl)}
                    alt={user?.name}
                    className="w-24 h-24 rounded-3xl object-cover border-4 border-indigo-100 dark:border-indigo-900 shadow-md"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-3xl bg-indigo-100 text-indigo-700 flex items-center justify-center text-3xl font-black shadow-inner">
                    {user?.name?.charAt(0)}
                  </div>
                )}
                <label
                  htmlFor="avatar-upload"
                  className="absolute inset-0 bg-slate-900/60 rounded-3xl flex flex-col items-center justify-center text-white text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                >
                  <Upload className="w-5 h-5 mb-1" />
                  <span>Change</span>
                </label>
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  disabled={uploadingAvatar}
                  className="hidden"
                />
              </div>

              {profile?.avatarUrl && (
                <Link
                  to={`/image-view?url=${encodeURIComponent(profile.avatarUrl)}&title=${encodeURIComponent(
                    `${user?.name || 'Student'} Profile Photo`
                  )}&source=${encodeURIComponent('Academic Profile Photo')}&backUrl=/profile`}
                  className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  View Full Photo &rarr;
                </Link>
              )}
            </div>

            {/* Basic Info */}
            <div className="flex-1 text-center sm:text-left space-y-1">
              <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-3">
                <h2 className="text-2xl font-black text-slate-900">{user?.name}</h2>
                <span className="inline-block text-xs font-extrabold uppercase bg-indigo-50 text-indigo-700 border border-indigo-200 px-2.5 py-0.5 rounded-full">
                  Roll: {profile?.rollNumber}
                </span>
              </div>
              <p className="text-xs text-slate-500">{user?.email}</p>
              <p className="text-xs font-medium text-slate-600 pt-1">
                {profile?.department} • Batch of {profile?.batchYear} • Silicon University, Bhubaneswar
              </p>
            </div>
          </div>

          {!isEditing ? (
            /* View Mode */
            <div className="pt-6 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400">Department</span>
                  <p className="text-base font-bold text-slate-800 dark:text-slate-100 mt-1">{profile?.department}</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400">Cumulative CGPA</span>
                  <p className="text-base font-bold text-indigo-600 dark:text-indigo-400 mt-1">{profile?.cgpa ? profile.cgpa.toFixed(2) : '0.00'} / 10.0</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400">Contact Number</span>
                  <p className="text-base font-bold text-slate-800 dark:text-slate-100 mt-1">{profile?.contactNumber || 'Not configured'}</p>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400 mb-2">Student Bio</h4>
                <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed bg-slate-50/70 dark:bg-slate-800/80 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
                  {profile?.bio || 'No bio added yet. Click "Edit Profile" to summarize your academic interests and projects.'}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400 mb-2">Technical Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {profile?.skills && profile.skills.length > 0 ? (
                    profile.skills.map((skill) => (
                      <span key={skill} className="px-3 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-semibold">
                        {skill}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-slate-400 dark:text-slate-500">No skills added yet.</span>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
                {profile?.githubUrl && (
                  <a
                    href={profile.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center space-x-1.5 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-semibold"
                  >
                    <Github className="w-4 h-4" />
                    <span>GitHub Profile</span>
                  </a>
                )}
                {profile?.linkedinUrl && (
                  <a
                    href={profile.linkedinUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center space-x-1.5 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-semibold"
                  >
                    <Linkedin className="w-4 h-4" />
                    <span>LinkedIn Profile</span>
                  </a>
                )}
              </div>
            </div>
          ) : (
            /* Edit Mode */
            <form onSubmit={handleSaveProfile} className="pt-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Contact Number"
                  value={formData.contactNumber}
                  onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                  placeholder="+91 98765 43210"
                />

                <Input
                  label="Current CGPA (0.00 - 10.00)"
                  type="number"
                  step="0.01"
                  min="0"
                  max="10"
                  value={formData.cgpa}
                  onChange={(e) => setFormData({ ...formData, cgpa: Number(e.target.value) })}
                  helperText="Used for placement drive eligibility verification."
                />
              </div>

              <Textarea
                label="Student Bio"
                rows={4}
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                placeholder="Share your academic interests, project experiences, and domains of interest..."
              />

              <Input
                label="Technical Skills (Comma separated)"
                value={formData.skills}
                onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                placeholder="React, TypeScript, Python, Node.js, ROS2, Docker"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="GitHub Profile URL"
                  value={formData.githubUrl}
                  onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                  placeholder="https://github.com/username"
                />

                <Input
                  label="LinkedIn Profile URL"
                  value={formData.linkedinUrl}
                  onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                  placeholder="https://linkedin.com/in/username"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" isLoading={savingProfile}>
                  Save Changes
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

