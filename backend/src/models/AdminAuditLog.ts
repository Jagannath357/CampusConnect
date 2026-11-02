import mongoose, { Document, Schema, Model, Types } from 'mongoose';

export interface IAdminAuditLog extends Document {
  adminId: Types.ObjectId;
  actionType: string;
  targetEntity: string;
  targetId?: string;
  actionDetails?: Record<string, any>;
  ipAddress?: string;
  timestamp: Date;
}

const AdminAuditLogSchema = new Schema<IAdminAuditLog>(
  {
    adminId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    actionType: {
      type: String,
      required: true,
      index: true,
    },
    targetEntity: {
      type: String,
      required: true,
      index: true,
    },
    targetId: {
      type: String,
      index: true,
    },
    actionDetails: {
      type: Schema.Types.Mixed,
    },
    ipAddress: {
      type: String,
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: false,
  }
);

AdminAuditLogSchema.index({ timestamp: -1 });

export const AdminAuditLog: Model<IAdminAuditLog> = mongoose.model<IAdminAuditLog>(
  'AdminAuditLog',
  AdminAuditLogSchema
);
export default AdminAuditLog;

