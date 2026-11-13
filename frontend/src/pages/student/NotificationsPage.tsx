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
  Inbox,
  Radio,
  X,
  ChevronRight,
  UserCheck,
  Building2,
  CheckCircle2,
} from 'lucide-react';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { EmptyState } from '../../components/common/EmptyState';
import { Notification, EmergencyAlert } from '../../types';
import { cn } from '../../utils/cn';

type FilterTab = 'ALL' | 'BROADCASTS' | 'UNREAD' | 'ACADEMIC' | 'LOST_FOUND';

interface DetailedItem {
  id: string;
  title: string;
  message: string;
  category: string;
  timestamp: string;
  isEmergency?: boolean;
  isCritical?: boolean;
  active?: boolean;
  issuedBy?: string;
  isRead?: boolean;
  link?: string;
}

export const NotificationsPage: React.FC = () => {
  const {
    notifications,
    unreadCount,
    emergencyAlert,
    emergencyAlerts,
    markAsRead,
    markAllAsRead,
  } = useNotifications();

  const [activeTab, setActiveTab] = useState<FilterTab>('ALL');
  const [selectedDetail, setSelectedDetail] = useState<DetailedItem | null>(null);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'EMERGENCY':
        return <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400" />;
      case 'EVENT':
        return <Calendar className="w-4 h-4 text-purple-600 dark:text-purple-400" />;
      case 'LOST_FOUND':
      case 'CLAIM':
        return <Search className="w-4 h-4 text-amber-600 dark:text-amber-400" />;
      case 'PLACEMENT':
        return <Briefcase className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />;
      default:
        return <Info className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />;
    }
  };

  const getCategoryBadgeClass = (category: string) => {
    switch (category) {
      case 'EMERGENCY':
        return 'bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-200 border-rose-200 dark:border-rose-800';
      case 'EVENT':
        return 'bg-purple-100 dark:bg-purple-950/80 text-purple-800 dark:text-purple-200 border-purple-200 dark:border-purple-800';
      case 'LOST_FOUND':
      case 'CLAIM':
        return 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-200 border-amber-200 dark:border-amber-800';
      case 'PLACEMENT':
        return 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-200 border-emerald-200 dark:border-emerald-800';
      default:
        return 'bg-indigo-100 dark:bg-indigo-950/80 text-indigo-800 dark:text-indigo-200 border-indigo-200 dark:border-indigo-800';
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'EMERGENCY':
        return 'Campus Emergency Alert';
      case 'EVENT':
        return 'Official Campus Event';
      case 'LOST_FOUND':
      case 'CLAIM':
        return 'Lost & Found Claim';
      case 'PLACEMENT':
        return 'Career & Placement Drive';
      default:
        return 'Academic & Portal Notice';
    }
  };

  const formatTimestamp = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return {
        full: date.toLocaleString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        }),
        date: date.toLocaleDateString(),
        time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
    } catch {
      return { full: dateString, date: dateString, time: '' };
    }
  };

  const handleOpenAlertDetails = (alert: EmergencyAlert) => {
    setSelectedDetail({
      id: alert._id || alert.id || '',
      title: alert.title,
      message: alert.message,
      category: 'EMERGENCY',
      timestamp: alert.broadcastAt,
      isEmergency: true,
      isCritical: alert.isCritical,
      active: alert.active,
      issuedBy: alert.issuedBy?.name || 'Silicon University Administration',
    });
  };

  const handleOpenNotificationDetails = (n: Notification) => {
    if (!n.isRead) {
      markAsRead(n._id);
    }
    setSelectedDetail({
      id: n._id,
      title: n.title,
      message: n.message,
      category: n.type,
      timestamp: n.createdAt,
      isRead: true,
      link: n.link,
      issuedBy: 'Silicon University Portal Authority',
    });
  };

  // Prepare unified list items for the selected tab
  const getDisplayItems = () => {
    if (activeTab === 'BROADCASTS') {
      return emergencyAlerts.map((alert) => ({
        type: 'BROADCAST' as const,
        alert,
        date: new Date(alert.broadcastAt).getTime(),
      }));
    }

    if (activeTab === 'UNREAD') {
      return notifications
        .filter((n) => !n.isRead)
        .map((n) => ({
          type: 'NOTIFICATION' as const,
          notification: n,
          date: new Date(n.createdAt).getTime(),
        }));
    }

    if (activeTab === 'ACADEMIC') {
      return notifications
        .filter((n) => n.type === 'EVENT' || n.type === 'PLACEMENT' || n.type === 'INFO')
        .map((n) => ({
          type: 'NOTIFICATION' as const,
          notification: n,
          date: new Date(n.createdAt).getTime(),
        }));
    }

    if (activeTab === 'LOST_FOUND') {
      return notifications
        .filter((n) => n.type === 'LOST_FOUND' || n.type === 'CLAIM')
        .map((n) => ({
          type: 'NOTIFICATION' as const,
          notification: n,
          date: new Date(n.createdAt).getTime(),
        }));
    }

    // Tab 'ALL': Combine broadcasts and notifications chronologically
    const allBroadcasts = emergencyAlerts.map((alert) => ({
      type: 'BROADCAST' as const,
      alert,
      date: new Date(alert.broadcastAt).getTime(),
    }));

    const allNotifications = notifications.map((n) => ({
      type: 'NOTIFICATION' as const,
      notification: n,
      date: new Date(n.createdAt).getTime(),
    }));

    return [...allBroadcasts, ...allNotifications].sort((a, b) => b.date - a.date);
  };

  const displayItems = getDisplayItems();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs min-w-0">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight flex items-center space-x-2.5">
            <div className="p-1.5 sm:p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800 flex-shrink-0">
              <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <span className="truncate">Campus Notification Center</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
            Official emergency broadcasts, academic updates, event badges, and administrative notices.
          </p>
        </div>

        {unreadCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={markAllAsRead}
            className="self-start sm:self-auto font-bold border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/50"
          >
            <CheckCheck className="w-4 h-4 mr-1.5 text-indigo-600 dark:text-indigo-400" /> Mark All Read ({unreadCount})
          </Button>
        )}
      </div>

      {/* TOP BANNER: Last/Most Recent Active Campus Emergency Broadcast */}
      {emergencyAlert && emergencyAlert.active && (
        <div className="relative overflow-hidden p-4 sm:p-6 rounded-2xl bg-rose-50 dark:bg-rose-950/90 border-2 border-rose-400 dark:border-rose-600 text-rose-950 dark:text-rose-100 shadow-lg transition-all animate-in fade-in duration-200 min-w-0">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 min-w-0">
            <div className="space-y-2 flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
                <span className="flex h-3 w-3 relative flex-shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-600 dark:bg-rose-400"></span>
                </span>
                <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest bg-rose-700 text-amber-200 px-2.5 py-0.5 rounded-full shadow-xs">
                  ACTIVE CAMPUS BROADCAST (LATEST)
                </span>
                <span className="text-[11px] font-bold text-rose-800 dark:text-rose-300">
                  {formatTimestamp(emergencyAlert.broadcastAt).time}
                </span>
              </div>

              <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight leading-snug break-words">
                {emergencyAlert.title}
              </h2>

              <p className="text-xs sm:text-sm text-slate-800 dark:text-rose-100 font-medium leading-relaxed max-w-3xl break-words">
                {emergencyAlert.message}
              </p>

              <div className="flex flex-wrap items-center gap-2 sm:gap-3 pt-2 text-[11px] text-slate-700 dark:text-rose-200 font-semibold border-t border-rose-200/80 dark:border-rose-800/80">
                <span className="flex items-center space-x-1">
                  <Building2 className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400 flex-shrink-0" />
                  <span className="truncate">{emergencyAlert.issuedBy?.name || 'Silicon University Administration'}</span>
                </span>
                <span>•</span>
                <span className="flex items-center space-x-1">
                  <Clock className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400 flex-shrink-0" />
                  <span>Broadcasted on {formatTimestamp(emergencyAlert.broadcastAt).full}</span>
                </span>
              </div>
            </div>

            {/* Banner Details Button */}
            <div className="flex-shrink-0 self-start md:self-center">
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleOpenAlertDetails(emergencyAlert)}
                className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md border border-rose-500"
              >
                View Broadcast Details <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 sm:pb-0 border-b border-slate-200/80 dark:border-slate-800">
        <button
          onClick={() => setActiveTab('ALL')}
          className={cn(
            'px-3.5 py-2.5 text-xs font-bold rounded-t-xl transition-all border-b-2 flex items-center space-x-1.5 whitespace-nowrap',
            activeTab === 'ALL'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/40 shadow-xs'
              : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          )}
        >
          <span>All Messages</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold">
            {emergencyAlerts.length + notifications.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('BROADCASTS')}
          className={cn(
            'px-3.5 py-2.5 text-xs font-bold rounded-t-xl transition-all border-b-2 flex items-center space-x-1.5 whitespace-nowrap',
            activeTab === 'BROADCASTS'
              ? 'border-rose-600 text-rose-600 dark:text-rose-400 bg-rose-50/50 dark:bg-rose-950/40 shadow-xs'
              : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          )}
        >
          <Radio className="w-3.5 h-3.5 text-rose-500" />
          <span>Broadcast Alerts (History)</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-rose-100 dark:bg-rose-900 text-rose-800 dark:text-rose-200 font-bold">
            {emergencyAlerts.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('UNREAD')}
          className={cn(
            'px-3.5 py-2.5 text-xs font-bold rounded-t-xl transition-all border-b-2 flex items-center space-x-1.5 whitespace-nowrap',
            activeTab === 'UNREAD'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/40 shadow-xs'
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
          onClick={() => setActiveTab('ACADEMIC')}
          className={cn(
            'px-3.5 py-2.5 text-xs font-bold rounded-t-xl transition-all border-b-2 flex items-center space-x-1.5 whitespace-nowrap',
            activeTab === 'ACADEMIC'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/40 shadow-xs'
              : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          )}
        >
          <span>Academic & Events</span>
        </button>

        <button
          onClick={() => setActiveTab('LOST_FOUND')}
          className={cn(
            'px-3.5 py-2.5 text-xs font-bold rounded-t-xl transition-all border-b-2 flex items-center space-x-1.5 whitespace-nowrap',
            activeTab === 'LOST_FOUND'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/40 shadow-xs'
              : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          )}
        >
          <span>Lost & Found Claims</span>
        </button>
      </div>

      {/* Notifications and Previous Broadcasts Stream */}
      {displayItems.length === 0 ? (
        <EmptyState
          icon={Inbox}
          title={activeTab === 'UNREAD' ? 'No Unread Notifications' : 'No Notifications Found'}
          description={
            activeTab === 'UNREAD'
              ? 'You are all caught up! There are no unread announcements.'
              : 'Announcements, previous emergency broadcasts, and event reminders will appear here.'
          }
        />
      ) : (
        <div className="space-y-3">
          {displayItems.map((item, idx) => {
            if (item.type === 'BROADCAST') {
              const alert = item.alert;
              const isLatestActive = alert._id === emergencyAlert?._id && alert.active;

              return (
                <Card
                  key={`alert-${alert._id || idx}`}
                  className={cn(
                    'transition-all border hover:shadow-md dark:bg-slate-900',
                    alert.active
                      ? 'border-rose-300 dark:border-rose-800/80 bg-rose-50/30 dark:bg-rose-950/30'
                      : 'border-slate-200/90 dark:border-slate-800 bg-white'
                  )}
                >
                  <CardContent className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex items-start space-x-3.5 flex-1 min-w-0">
                      <div className="p-2.5 rounded-xl bg-rose-100 dark:bg-rose-950/80 text-rose-600 dark:text-rose-300 border border-rose-200 dark:border-rose-800 flex-shrink-0 mt-0.5">
                        <Radio className="w-4 h-4" />
                      </div>

                      <div className="flex-1 space-y-1.5 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-200 border border-rose-200 dark:border-rose-800">
                            {alert.active ? 'Active Broadcast' : 'Previous Broadcast'}
                          </span>
                          {isLatestActive && (
                            <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-200 border border-amber-300 dark:border-amber-800">
                              Latest
                            </span>
                          )}
                          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                            {formatTimestamp(alert.broadcastAt).full}
                          </span>
                        </div>

                        <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 leading-snug">
                          {alert.title}
                        </h3>

                        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-2">
                          {alert.message}
                        </p>

                        <div className="flex items-center space-x-2 text-[11px] text-slate-500 dark:text-slate-400 pt-1">
                          <Building2 className="w-3.5 h-3.5 text-slate-400 dark:text-slate-400" />
                          <span>Issued by: {alert.issuedBy?.name || 'Silicon University Administration'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Details Button */}
                    <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 flex-shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleOpenAlertDetails(alert)}
                        className="font-bold text-xs border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-950/50 w-full sm:w-auto"
                      >
                        Details <ChevronRight className="w-3.5 h-3.5 ml-1" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            }

            // Standard personal notification
            const n = item.notification;
            return (
              <Card
                key={`notif-${n._id || idx}`}
                className={cn(
                  'transition-all border hover:shadow-md dark:bg-slate-900',
                  !n.isRead
                    ? 'bg-indigo-50/40 dark:bg-indigo-950/30 border-indigo-200/90 dark:border-indigo-800/80 shadow-xs'
                    : 'bg-white border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                )}
              >
                <CardContent className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex items-start space-x-3.5 flex-1 min-w-0">
                    <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 flex-shrink-0 mt-0.5">
                      {getCategoryIcon(n.type)}
                    </div>

                    <div className="flex-1 space-y-1.5 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={cn('text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border', getCategoryBadgeClass(n.type))}>
                          {getCategoryLabel(n.type)}
                        </span>
                        {!n.isRead && (
                          <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-indigo-600 text-white shadow-xs">
                            New Unread
                          </span>
                        )}
                        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                          {formatTimestamp(n.createdAt).full}
                        </span>
                      </div>

                      <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 leading-snug">
                        {n.title}
                      </h3>

                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-2">
                        {n.message}
                      </p>
                    </div>
                  </div>

                  {/* Actions & Details Button */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 flex-shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleOpenNotificationDetails(n)}
                      className="font-bold text-xs border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 w-full sm:w-auto"
                    >
                      Details <ChevronRight className="w-3.5 h-3.5 ml-1" />
                    </Button>

                    {n.link && (
                      <Link
                        to={n.link}
                        onClick={() => !n.isRead && markAsRead(n._id)}
                        className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center whitespace-nowrap"
                      >
                        Open Page <ExternalLink className="w-3 h-3 ml-1" />
                      </Link>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* FULL NOTIFICATION DETAILS MODAL DIALOG */}
      {selectedDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
          <div
            className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden transform scale-100 animate-in zoom-in-95 max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              className={cn(
                'p-6 pb-4 border-b flex items-start justify-between gap-4',
                selectedDetail.isEmergency
                  ? 'bg-rose-50/80 dark:bg-rose-950/80 border-rose-200 dark:border-rose-800'
                  : 'bg-slate-50/80 dark:bg-slate-800/80 border-slate-200 dark:border-slate-800'
              )}
            >
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={cn(
                      'text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border',
                      getCategoryBadgeClass(selectedDetail.category)
                    )}
                  >
                    {selectedDetail.isEmergency ? 'Critical Emergency Broadcast' : getCategoryLabel(selectedDetail.category)}
                  </span>
                  {selectedDetail.isEmergency && selectedDetail.active && (
                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-rose-600 text-white animate-pulse">
                      Live Active
                    </span>
                  )}
                </div>
                <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight leading-snug">
                  {selectedDetail.title}
                </h2>
              </div>

              <button
                onClick={() => setSelectedDetail(null)}
                className="rounded-full p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Close Details Modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5 overflow-y-auto flex-1 text-slate-800 dark:text-slate-200">
              {/* Full Message Box */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                  Complete Message Content
                </h4>
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 text-sm font-medium leading-relaxed whitespace-pre-wrap">
                  {selectedDetail.message}
                </div>
              </div>

              {/* Metadata Breakdown Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Broadcasted / Dispatched At
                  </span>
                  <p className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center space-x-1.5">
                    <Clock className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
                    <span>{formatTimestamp(selectedDetail.timestamp).full}</span>
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Issuing Authority
                  </span>
                  <p className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center space-x-1.5">
                    <Building2 className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
                    <span>{selectedDetail.issuedBy || 'Silicon University Authority'}</span>
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Broadcast Priority Level
                  </span>
                  <p className="text-xs font-bold text-slate-900 dark:text-slate-100">
                    {selectedDetail.isEmergency ? (
                      <span className="text-rose-600 dark:text-rose-400 font-extrabold flex items-center">
                        <AlertTriangle className="w-3.5 h-3.5 mr-1" /> Critical Campus Priority
                      </span>
                    ) : (
                      <span className="text-indigo-600 dark:text-indigo-400 font-semibold">
                        Standard University Alert
                      </span>
                    )}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Portal Status
                  </span>
                  <p className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center space-x-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>
                      {selectedDetail.isEmergency
                        ? selectedDetail.active
                          ? 'Active Live Alert'
                          : 'Previous Archived Broadcast'
                        : 'Read & Logged'}
                    </span>
                  </p>
                </div>
              </div>

              {selectedDetail.isEmergency && (
                <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-xs text-rose-900 dark:text-rose-200 space-y-1">
                  <span className="font-extrabold uppercase text-[10px] text-rose-700 dark:text-rose-400 flex items-center">
                    <ShieldAlert className="w-3.5 h-3.5 mr-1" /> Student Action Directive
                  </span>
                  <p className="text-[11px] leading-relaxed">
                    Please follow all instructions provided in this official broadcast. In case of urgent assistance, contact the Campus Security Hotline or the Student Affairs Office immediately.
                  </p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:p-5 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
              <div>
                {selectedDetail.link && (
                  <Link
                    to={selectedDetail.link}
                    onClick={() => setSelectedDetail(null)}
                  >
                    <Button variant="primary" size="sm" className="font-bold">
                      Open Associated Page <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
                    </Button>
                  </Link>
                )}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedDetail(null)}
                className="font-bold ml-auto"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
