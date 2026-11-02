import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';
import { Search, ArrowLeft, Upload, AlertCircle, Camera } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';

const LOCATION_CATEGORIES = [
  'Library',
  'Hostel',
  'Academic Block',
  'Cafeteria',
  'Sports Complex',
  'Auditorium',
  'Campus Grounds',
  'Other',
];

export const ReportLostFoundPage: React.FC = () => {
  const navigate = useNavigate();

  const [type, setType] = useState<'LOST' | 'FOUND'>('LOST');
  const [itemName, setItemName] = useState('');
  const [locationCategory, setLocationCategory] = useState('Academic Block');
  const [locationDetails, setLocationDetails] = useState('');
  const [description, setDescription] = useState('');
  const [dateOccurred, setDateOccurred] = useState(new Date().toISOString().split('T')[0]);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const formData = new FormData();
    formData.append('type', type);
    formData.append('itemName', itemName);
    formData.append('locationCategory', locationCategory);
    formData.append('locationDetails', locationDetails);
    formData.append('description', description);
    formData.append('dateOccurred', dateOccurred);
    if (imageFile) {
      formData.append('image', imageFile);
    }

    setLoading(true);
    try {
      const res = await api.post('/lost-found', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data.success) {
        navigate(`/lost-found/${res.data.data._id}`);
      }
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || 'Failed to submit item report.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Link
        to="/lost-found"
        className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Lost & Found
      </Link>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-black text-slate-900 flex items-center space-x-2">
            <Search className="w-6 h-6 text-indigo-600" />
            <span>Report Lost or Found Belonging</span>
          </CardTitle>
          <p className="text-xs text-slate-500 mt-1">
            All submitted items default to Pending Verification and are inspected by campus administration.
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
            {/* Report Type Toggle */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Report Type
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setType('LOST')}
                  className={`p-3 rounded-xl border text-xs font-bold transition-all ${
                    type === 'LOST'
                      ? 'bg-rose-50 border-rose-400 text-rose-700 shadow-xs'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  I Lost An Item
                </button>
                <button
                  type="button"
                  onClick={() => setType('FOUND')}
                  className={`p-3 rounded-xl border text-xs font-bold transition-all ${
                    type === 'FOUND'
                      ? 'bg-sky-50 border-sky-400 text-sky-700 shadow-xs'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  I Found An Item
                </button>
              </div>
            </div>

            <Input
              label="Item Name / Model"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              placeholder="e.g. Blue Dell Inspiron Laptop Backpack"
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Campus Location Area
                </label>
                <select
                  value={locationCategory}
                  onChange={(e) => setLocationCategory(e.target.value)}
                  className="flex h-10 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500"
                >
                  {LOCATION_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <Input
                label="Date Occurred"
                type="date"
                value={dateOccurred}
                onChange={(e) => setDateOccurred(e.target.value)}
                required
              />
            </div>

            <Input
              label="Exact Location Specifics"
              value={locationDetails}
              onChange={(e) => setLocationDetails(e.target.value)}
              placeholder="e.g. Near CSE Lab 3, 2nd row bench"
            />

            <Textarea
              label="Detailed Item Description"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe color, brand, stickers, scratches, contents, or serial numbers..."
              required
            />

            {/* Optional Photo Upload */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Supporting Photograph (Optional)
              </label>
              <div className="border-2 border-dashed border-slate-300 rounded-xl p-4 text-center hover:border-indigo-400 transition-colors bg-slate-50/50">
                <input
                  id="lost-found-file-input"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                  className="hidden"
                />
                <label htmlFor="lost-found-file-input" className="cursor-pointer block">
                  <Camera className="w-8 h-8 text-slate-400 mx-auto mb-1" />
                  {imageFile ? (
                    <p className="text-xs font-bold text-slate-800">{imageFile.name}</p>
                  ) : (
                    <p className="text-xs text-slate-500 font-medium">Click to attach photo</p>
                  )}
                </label>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100">
              <Link to="/lost-found">
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Link>
              <Button type="submit" variant="primary" isLoading={loading}>
                Submit Report
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

