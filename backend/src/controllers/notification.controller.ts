import { Response } from 'express';
import { AuthenticatedRequest } from '../types/index.js';
import { Notification } from '../models/Notification.js';
import { EmergencyAlert } from '../models/EmergencyAlert.js';

export const getMyNotifications = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.userId;

    const notifications = await Notification.find({ recipientId: userId })
      .sort({ createdAt: -1 })
      .limit(50);

    const unreadCount = await Notification.countDocuments({
      recipientId: userId,
      isRead: false,
    });

    // Retrieve all campus emergency broadcast alerts history (both latest active and previous messages)
    const emergencyAlerts = await EmergencyAlert.find()
      .populate('issuedBy', 'name email')
      .sort({ broadcastAt: -1 })
      .limit(50);

    // Find latest active emergency alert for persistent top banner
    const activeEmergency = emergencyAlerts.find((a) => a.active) || null;

    res.status(200).json({
      success: true,
      message: 'Notifications retrieved.',
      data: {
        notifications,
        unreadCount,
        activeEmergency,
        emergencyAlerts,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve notifications.',
    });
  }
};

export const markAsRead = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await Notification.updateOne(
      { _id: id, recipientId: req.user?.userId },
      { $set: { isRead: true } }
    );

    res.status(200).json({
      success: true,
      message: 'Notification marked as read.',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update notification.',
    });
  }
};

export const markAllAsRead = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    await Notification.updateMany(
      { recipientId: req.user?.userId, isRead: false },
      { $set: { isRead: true } }
    );

    res.status(200).json({
      success: true,
      message: 'All notifications marked as read.',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to mark all as read.',
    });
  }
};

export const getBroadcastHistory = async (
  _req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const broadcasts = await EmergencyAlert.find()
      .populate('issuedBy', 'name email')
      .sort({ broadcastAt: -1 })
      .limit(50);

    res.status(200).json({
      success: true,
      message: 'Broadcast history retrieved.',
      data: broadcasts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve broadcast history.',
    });
  }
};

