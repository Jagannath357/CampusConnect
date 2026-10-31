import React from 'react';
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
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { EmptyState } from '../../components/common/EmptyState';

export const NotificationsPage: React.FC = () => {
  const {
    notifications,
    unreadCount,
    emergencyAlert,
    markAsRead,
    markAllAsRead,
  } = useNotifications();

  const getIcon = (type: string) => {
    switch (type) {
      case 'EVENT':
        return <Calendar className="w-4 h-4 text-purple-600" />;
      case 'LOST_FOUND':
      case 'CLAIM':
        return <Search className="w-4 h-4 text-amber-600" />;
      case 'PLACEMENT':
        return <Briefcase className="w-4 h-4 text-emerald-600" />;
      case 'EMERGENCY':
        return <AlertTriangle className="w-4 h-4 text-rose-600" />;
      default:
        return <Info className="w-4 h-4 text-indigo-600" />;
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center space-x-2.5">
            <Bell className="w-6 h-6 text-indigo-600" />
            <span>Campus Notifications</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Stay informed with real-time updates on event registrations, claims, and announcements.
          </p>
        </div>

        {unreadCount > 0 && (
          <Button variant="outline" size="sm" onClick={markAllAsRead}>
            <CheckCheck className="w-4 h-4 mr-1.5" /> Mark All Read
          </Button>
        )}
      </div>

      {/* Active Emergency Alert if present */}
      {emergencyAlert && emergencyAlert.active && (
        <div className="p-5 rounded-2xl bg-rose-50 border-2 border-rose-300 text-rose-900 space-y-2">
          <div className="flex items-center space-x-2 text-rose-700 font-bold text-xs uppercase tracking-wider">
            <AlertTriangle className="w-4 h-4" />
            <span>Active Campus Emergency Broadcast</span>
          </div>
          <h3 className="text-base font-black text-rose-950">{emergencyAlert.title}</h3>
          <p className="text-xs text-rose-800 leading-relaxed">{emergencyAlert.message}</p>
          <span className="text-[10px] text-rose-500 block">
            Broadcast at {new Date(emergencyAlert.broadcastAt).toLocaleString()}
          </span>
        </div>
      )}

      {/* Notifications List */}
      {notifications.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="No Notifications Yet"
          description="You are all caught up! New alerts and registration confirmations will appear here."
        />
      ) : (
        <div className="space-y-3">
          {notifications.map((n) => (
            <Card
              key={n._id}
              onClick={() => !n.isRead && markAsRead(n._id)}
              className={`transition-all border-slate-200/80 cursor-pointer ${
                !n.isRead ? 'bg-indigo-50/30 border-indigo-200' : 'bg-white'
              }`}
            >
              <CardContent className="p-4 sm:p-5 flex items-start space-x-3.5">
                <div className="p-2.5 rounded-xl bg-slate-100 flex-shrink-0 mt-0.5">
                  {getIcon(n.type)}
                </div>

                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900">{n.title}</h4>
                    {!n.isRead && (
                      <span className="h-2 w-2 rounded-full bg-indigo-600 flex-shrink-0" />
                    )}
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">{n.message}</p>

                  <div className="flex items-center justify-between pt-1 text-[11px] text-slate-400">
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{new Date(n.createdAt).toLocaleDateString()} {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </span>

                    {n.link && (
                      <Link
                        to={n.link}
                        className="font-bold text-indigo-600 hover:underline flex items-center text-xs"
                      >
                        View Link <ExternalLink className="w-3 h-3 ml-1" />
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
