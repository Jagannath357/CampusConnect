import mongoose, { Document, Schema, Model, Types } from 'mongoose';

export interface IEmergencyAlert extends Document {
  title: string;
  message: string;
  issuedBy: Types.ObjectId;
  isCritical: boolean;
  broadcastAt: Date;
  active: boolean;
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const EmergencyAlertSchema = new Schema<IEmergencyAlert>(
  {
    title: {
      type: String,
      required: [true, 'Alert title is required'],
      trim: true,
      maxlength: [150, 'Title cannot exceed 150 characters'],
    },
    message: {
      type: String,
      required: [true, 'Alert message is required'],
      maxlength: [1000, 'Message cannot exceed 1000 characters'],
    },
    issuedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    isCritical: {
      type: Boolean,
      default: true,
    },
    broadcastAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
    active: {
      type: Boolean,
      default: true,
      index: true,
    },
    expiresAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

EmergencyAlertSchema.index({ active: 1, broadcastAt: -1 });

export const EmergencyAlert: Model<IEmergencyAlert> = mongoose.model<IEmergencyAlert>(
  'EmergencyAlert',
  EmergencyAlertSchema
);
export default EmergencyAlert;
