import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { getSocket } from '../services/socket';
import api from '../services/api';
import { Notification, EmergencyAlert } from '../types';

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  emergencyAlert: EmergencyAlert | null;
  isEmergencyOverlayOpen: boolean;
  dismissEmergencyOverlay: () => void;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  refreshNotifications: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, token } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [emergencyAlert, setEmergencyAlert] = useState<EmergencyAlert | null>(null);
  const [isEmergencyOverlayOpen, setIsEmergencyOverlayOpen] = useState<boolean>(false);

  const refreshNotifications = async () => {
    if (!isAuthenticated) return;
    try {
      const res = await api.get('/notifications');
      if (res.data.success) {
        setNotifications(res.data.data.notifications);
        setUnreadCount(res.data.data.unreadCount);
        if (res.data.data.activeEmergency) {
          setEmergencyAlert(res.data.data.activeEmergency);
        }
      }
    } catch (err) {
      console.warn('Could not load notifications');
    }
  };

  useEffect(() => {
    if (!isAuthenticated) return;
    refreshNotifications();

    const socket = getSocket();
    if (!socket) return;

    // Listen for incoming personal notifications
    socket.on('notification', (newNotif: Notification) => {
      setNotifications((prev) => [newNotif, ...prev]);
      setUnreadCount((prev) => prev + 1);
    });

    // Listen for high-priority emergency broadcasts (SRS Module 8 / Module 17)
    socket.on('emergency_alert', (alert: EmergencyAlert) => {
      console.warn('🚨 HIGH PRIORITY EMERGENCY ALERT RECEIVED VIA WEBSOCKET:', alert);
      setEmergencyAlert(alert);
      setIsEmergencyOverlayOpen(true);

      // Play subtle warning sound if permitted
      try {
        const audio = new Audio('/emergency-chime.mp3');
        audio.play().catch(() => {});
      } catch (e) {}
    });

    return () => {
      socket.off('notification');
      socket.off('emergency_alert');
    };
  }, [isAuthenticated, token]);

  const markAsRead = async (id: string) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Failed to mark notification read', err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.patch('/notifications/read-all');
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error('Failed to mark all as read', err);
    }
  };

  const dismissEmergencyOverlay = () => {
    setIsEmergencyOverlayOpen(false);
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        emergencyAlert,
        isEmergencyOverlayOpen,
        dismissEmergencyOverlay,
        markAsRead,
        markAllAsRead,
        refreshNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotifications must be used within NotificationProvider');
  return context;
};
