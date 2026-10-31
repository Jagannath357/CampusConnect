import { Request } from 'express';
import { AdminAuditLog } from '../models/AdminAuditLog.js';
import { Types } from 'mongoose';

export const recordAdminAudit = async (
  adminId: string,
  actionType: string,
  targetEntity: string,
  targetId?: string,
  actionDetails?: Record<string, any>,
  req?: Request
): Promise<void> => {
  try {
    const ipAddress =
      (req?.headers['x-forwarded-for'] as string) || req?.socket.remoteAddress || '127.0.0.1';

    await AdminAuditLog.create({
      adminId: new Types.ObjectId(adminId),
      actionType,
      targetEntity,
      targetId,
      actionDetails,
      ipAddress,
      timestamp: new Date(),
    });
  } catch (error) {
    console.error('[AuditLog] Failed to record admin audit entry:', error);
  }
};
