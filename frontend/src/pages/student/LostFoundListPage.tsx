import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { LostFoundItem } from '../../types';
import {
  Search,
  Plus,
  MapPin,
  Calendar,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  Filter,
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent } from '../../components/ui/card';
import { StatusBadge } from '../../components/common/StatusBadge';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { EmptyState } from '../../components/common/EmptyState';
import { getFileUrl } from '../../utils/url';

const LOCATION_CATEGORIES = [
  'ALL',
  'Library',
  'Hostel',
  'Academic Block',
  'Cafeteria',
  'Sports Complex',
  'Auditorium',
  'Campus Grounds',
];

export const LostFoundListPage: React.FC = () => {
  const [items, setItems] = useState<LostFoundItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState<'ALL' | 'LOST' | 'FOUND'>('ALL');
  const [selectedLocation, setSelectedLocation] = useState('ALL');

  const fetchItems = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (selectedType !== 'ALL') params.append('type', selectedType);
      if (selectedLocation !== 'ALL') params.append('locationCategory', selectedLocation);

      const res = await api.get(`/lost-found?${params.toString()}`);
      if (res.data.success) {
        setItems(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load lost and found items', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [search, selectedType, selectedLocation]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center space-x-2.5">
            <Search className="w-6 h-6 text-indigo-600" />
            <span>Lost & Found Hub</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Report misplaced campus belongings or recover verified lost items.
          </p>
        </div>

        <Link to="/lost-found/report">
          <Button variant="primary" size="sm">
            <Plus className="w-4 h-4 mr-1.5" /> Report Lost / Found Item
          </Button>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <Input
            placeholder="Search items by name, location, or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Type toggle */}
        <div className="flex items-center space-x-1.5 bg-slate-100 p-1 rounded-xl">
          {(['ALL', 'LOST', 'FOUND'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                selectedType === type
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {type === 'ALL' ? 'All Items' : type}
            </button>
          ))}
        </div>
      </div>

      {/* Items Grid */}
      {loading ? (
        <LoadingSpinner size="lg" className="h-64" />
      ) : items.length === 0 ? (
        <EmptyState
          icon={Search}
          title="No Lost or Found Items Found"
          description="Have you lost or found something around the campus? Submit a report now."
          actionText="Report Item"
          onAction={() => (window.location.href = '/lost-found/report')}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((item) => (
            <Card
              key={item._id}
              className="flex flex-col justify-between hover:shadow-md hover:border-indigo-300 transition-all border-slate-200/80 overflow-hidden"
            >
              <div>
                {/* Photo if present */}
                {item.imageUrl ? (
                  <div className="h-44 w-full overflow-hidden bg-slate-100 relative">
                    <img
                      src={getFileUrl(item.imageUrl)}
                      alt={item.itemName}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2.5 left-2.5">
                      <StatusBadge status={item.type} />
                    </div>
                    <div className="absolute top-2.5 right-2.5">
                      <StatusBadge status={item.status} />
                    </div>
                  </div>
                ) : (
                  <div className="p-4 pb-0 flex items-center justify-between">
                    <StatusBadge status={item.type} />
                    <StatusBadge status={item.status} />
                  </div>
                )}

                <CardContent className="p-5 space-y-2">
                  <h3 className="text-base font-bold text-slate-900 leading-snug line-clamp-1">
                    {item.itemName}
                  </h3>

                  <div className="flex items-center space-x-2 text-xs text-slate-500">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <span>
                      {item.locationCategory} {item.locationDetails ? `(${item.locationDetails})` : ''}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed pt-1">
                    {item.description}
                  </p>
                </CardContent>
              </div>

              <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-500">
                  {new Date(item.dateOccurred).toLocaleDateString()}
                </span>

                <Link
                  to={`/lost-found/${item._id}`}
                  className="font-bold text-indigo-600 hover:text-indigo-800 flex items-center"
                >
                  View & Claim <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

