import mongoose, { Document, Schema, Model, Types } from 'mongoose';

export type NotificationType =
  | 'INFO'
  | 'EVENT'
  | 'LOST_FOUND'
  | 'CLAIM'
  | 'PLACEMENT'
  | 'SYSTEM'
  | 'EMERGENCY';

export interface INotification extends Document {
  recipientId: Types.ObjectId;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  link?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    recipientId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['INFO', 'EVENT', 'LOST_FOUND', 'CLAIM', 'PLACEMENT', 'SYSTEM', 'EMERGENCY'],
      default: 'INFO',
      index: true,
    },
    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },
    link: {
      type: String,
    },
    metadata: {
      type: Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
  }
);

NotificationSchema.index({ recipientId: 1, isRead: 1, createdAt: -1 });

export const Notification: Model<INotification> = mongoose.model<INotification>(
  'Notification',
  NotificationSchema
);
export default Notification;

