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

    // Also get active emergency alerts (for high-priority top banner)
    const activeEmergency = await EmergencyAlert.findOne({ active: true }).sort({
      broadcastAt: -1,
    });

    res.status(200).json({
      success: true,
      message: 'Notifications retrieved.',
      data: {
        notifications,
        unreadCount,
        activeEmergency,
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

