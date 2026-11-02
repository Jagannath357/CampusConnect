import mongoose, { Document, Schema, Model, Types } from 'mongoose';

export type LostFoundType = 'LOST' | 'FOUND';
export type LostFoundStatus = 'PENDING_VERIFICATION' | 'APPROVED' | 'CLAIMED' | 'RESOLVED';

export interface ILostFoundItem extends Document {
  reporterId: Types.ObjectId;
  type: LostFoundType;
  itemName: string;
  locationCategory: string;
  locationDetails?: string;
  description: string;
  imageUrl?: string;
  imagePublicId?: string;
  dateOccurred: Date;
  status: LostFoundStatus;
  resolvedBy?: Types.ObjectId;
  resolvedAt?: Date;
  resolutionNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const LostFoundItemSchema = new Schema<ILostFoundItem>(
  {
    reporterId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ['LOST', 'FOUND'],
      required: true,
      index: true,
    },
    itemName: {
      type: String,
      required: [true, 'Item name is required'],
      trim: true,
      maxlength: [120, 'Item name cannot exceed 120 characters'],
    },
    locationCategory: {
      type: String,
      required: [true, 'Location category is required'],
      trim: true,
      index: true,
    },
    locationDetails: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    imageUrl: {
      type: String,
    },
    imagePublicId: {
      type: String,
    },
    dateOccurred: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ['PENDING_VERIFICATION', 'APPROVED', 'CLAIMED', 'RESOLVED'],
      default: 'PENDING_VERIFICATION',
      index: true,
    },
    resolvedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    resolvedAt: {
      type: Date,
    },
    resolutionNotes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

LostFoundItemSchema.index({ type: 1, status: 1, createdAt: -1 });
LostFoundItemSchema.index({ itemName: 'text', description: 'text', locationCategory: 'text' });

export const LostFoundItem: Model<ILostFoundItem> = mongoose.model<ILostFoundItem>(
  'LostFoundItem',
  LostFoundItemSchema
);
export default LostFoundItem;

