import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNotifications } from '../../contexts/NotificationContext';
import {
  Bell,
  CheckCheck,
  Calendar,
  Search,
  Briefcase,
  AlertTriangle,
  Info,
  Clock,
  ExternalLink,
  ShieldAlert,
  Sparkles,
  Inbox,
} from 'lucide-react';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { EmptyState } from '../../components/common/EmptyState';
import { cn } from '../../utils/cn';

type FilterTab = 'ALL' | 'UNREAD' | 'EMERGENCY' | 'ACADEMIC';

export const NotificationsPage: React.FC = () => {
  const {
    notifications,
    unreadCount,
    emergencyAlert,
    markAsRead,
    markAllAsRead,
  } = useNotifications();

  const [activeTab, setActiveTab] = useState<FilterTab>('ALL');

  const getIcon = (type: string) => {
    switch (type) {
      case 'EVENT':
        return <Calendar className="w-4 h-4 text-purple-600 dark:text-purple-400" />;
      case 'LOST_FOUND':
      case 'CLAIM':
        return <Search className="w-4 h-4 text-amber-600 dark:text-amber-400" />;
      case 'PLACEMENT':
        return <Briefcase className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />;
      case 'EMERGENCY':
        return <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400" />;
      default:
        return <Info className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />;
    }
  };

  const getIconStyle = (type: string) => {
    switch (type) {
      case 'EVENT':
        return 'bg-purple-100 dark:bg-purple-950/70 border border-purple-200 dark:border-purple-800/80';
      case 'LOST_FOUND':
      case 'CLAIM':
        return 'bg-amber-100 dark:bg-amber-950/70 border border-amber-200 dark:border-amber-800/80';
      case 'PLACEMENT':
        return 'bg-emerald-100 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800/80';
      case 'EMERGENCY':
        return 'bg-rose-100 dark:bg-rose-950/70 border border-rose-200 dark:border-rose-800/80';
      default:
        return 'bg-indigo-100 dark:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-800/80';
    }
  };

  const filteredNotifications = notifications.filter((n) => {
    if (activeTab === 'UNREAD') return !n.isRead;
    if (activeTab === 'EMERGENCY') return n.type === 'EMERGENCY';
    if (activeTab === 'ACADEMIC') return n.type === 'EVENT' || n.type === 'PLACEMENT' || n.type === 'INFO';
    return true;
  });

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight flex items-center space-x-2.5">
            <div className="p-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800">
              <Bell className="w-5 h-5" />
            </div>
            <span>Campus Notifications</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Stay informed with real-time updates on event registrations, claims, and university alerts.
          </p>
        </div>

        {unreadCount > 0 && (
          <Button variant="outline" size="sm" onClick={markAllAsRead} className="self-start sm:self-auto">
            <CheckCheck className="w-4 h-4 mr-1.5 text-indigo-600 dark:text-indigo-400" /> Mark All Read
          </Button>
        )}
      </div>

      {/* Active Campus Emergency Broadcast Banner Card */}
      {emergencyAlert && emergencyAlert.active && (
        <div className="p-5 rounded-2xl bg-rose-50 dark:bg-rose-950/80 border-2 border-rose-300 dark:border-rose-700/80 text-rose-950 dark:text-rose-100 space-y-2.5 shadow-sm transition-colors">
          <div className="flex items-center space-x-2 text-rose-700 dark:text-rose-300 font-bold text-xs uppercase tracking-wider">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-600 dark:bg-rose-400"></span>
            </span>
            <ShieldAlert className="w-4 h-4 text-rose-600 dark:text-rose-400" />
            <span>Active Campus Emergency Broadcast</span>
          </div>
          <h3 className="text-base font-black text-slate-900 dark:text-white tracking-tight">{emergencyAlert.title}</h3>
          <p className="text-xs text-slate-800 dark:text-rose-100 font-medium leading-relaxed">{emergencyAlert.message}</p>
          <div className="flex items-center justify-between pt-1 border-t border-rose-200/60 dark:border-rose-800/60 text-[10px] text-slate-600 dark:text-rose-300 font-semibold">
            <span>Silicon University Emergency Action</span>
            <span>Broadcast at {new Date(emergencyAlert.broadcastAt).toLocaleString()}</span>
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 sm:pb-0 border-b border-slate-200/80 dark:border-slate-800">
        <button
          onClick={() => setActiveTab('ALL')}
          className={cn(
            'px-3.5 py-2 text-xs font-bold rounded-t-lg transition-all border-b-2 flex items-center space-x-1.5',
            activeTab === 'ALL'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/40'
              : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          )}
        >
          <span>All</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold">
            {notifications.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('UNREAD')}
          className={cn(
            'px-3.5 py-2 text-xs font-bold rounded-t-lg transition-all border-b-2 flex items-center space-x-1.5',
            activeTab === 'UNREAD'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/40'
              : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          )}
        >
          <span>Unread</span>
          {unreadCount > 0 && (
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-indigo-600 text-white font-bold">
              {unreadCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('EMERGENCY')}
          className={cn(
            'px-3.5 py-2 text-xs font-bold rounded-t-lg transition-all border-b-2 flex items-center space-x-1.5',
            activeTab === 'EMERGENCY'
              ? 'border-rose-600 text-rose-600 dark:text-rose-400 bg-rose-50/50 dark:bg-rose-950/40'
              : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          )}
        >
          <span>Alerts</span>
        </button>

        <button
          onClick={() => setActiveTab('ACADEMIC')}
          className={cn(
            'px-3.5 py-2 text-xs font-bold rounded-t-lg transition-all border-b-2 flex items-center space-x-1.5',
            activeTab === 'ACADEMIC'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/40'
              : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          )}
        >
          <span>Academic & Events</span>
        </button>
      </div>

      {/* Notifications List */}
      {filteredNotifications.length === 0 ? (
        <EmptyState
          icon={Inbox}
          title={activeTab === 'UNREAD' ? 'No Unread Notifications' : 'No Notifications Found'}
          description={
            activeTab === 'UNREAD'
              ? 'You are all caught up! There are no unread announcements.'
              : 'New announcements, event reminders, and ownership claim notices will appear here.'
          }
        />
      ) : (
        <div className="space-y-3">
          {filteredNotifications.map((n) => (
            <Card
              key={n._id}
              onClick={() => !n.isRead && markAsRead(n._id)}
              className={cn(
                'transition-all cursor-pointer border hover:shadow-md',
                !n.isRead
                  ? 'bg-indigo-50/40 dark:bg-indigo-950/40 border-indigo-200/80 dark:border-indigo-800/80 shadow-xs'
                  : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700'
              )}
            >
              <CardContent className="p-4 sm:p-5 flex items-start space-x-3.5">
                <div className={cn('p-2.5 rounded-xl flex-shrink-0 mt-0.5', getIconStyle(n.type))}>
                  {getIcon(n.type)}
                </div>

                <div className="flex-1 space-y-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 truncate">
                      {n.title}
                    </h4>
                    {!n.isRead && (
                      <span className="h-2 w-2 rounded-full bg-indigo-600 dark:bg-indigo-400 flex-shrink-0" title="Unread" />
                    )}
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                    {n.message}
                  </p>

                  <div className="flex items-center justify-between pt-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3 h-3 text-slate-400 dark:text-slate-400" />
                      <span>
                        {new Date(n.createdAt).toLocaleDateString()} {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </span>

                    {n.link && (
                      <Link
                        to={n.link}
                        className="font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 hover:underline flex items-center text-xs ml-2"
                      >
                        View Details <ExternalLink className="w-3 h-3 ml-1" />
                      </Link>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
