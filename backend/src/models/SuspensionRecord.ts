import mongoose, { Document, Schema, Model, Types } from 'mongoose';

export interface ISuspensionRecord extends Document {
  studentId: Types.ObjectId;
  suspendedBy: Types.ObjectId;
  reason: string;
  startDate: Date;
  endDate?: Date;
  isActive: boolean;
  reactivatedBy?: Types.ObjectId;
  reactivatedAt?: Date;
  reactivationNotes?: string;
  createdAt: Date;
}

const SuspensionRecordSchema = new Schema<ISuspensionRecord>(
  {
    studentId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    suspendedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    reason: {
      type: String,
      required: [true, 'Suspension reason is required'],
    },
    startDate: {
      type: Date,
      default: Date.now,
      required: true,
    },
    endDate: {
      type: Date,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    reactivatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    reactivatedAt: {
      type: Date,
    },
    reactivationNotes: {
      type: String,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: false,
  }
);

SuspensionRecordSchema.index({ studentId: 1, isActive: 1 });

export const SuspensionRecord: Model<ISuspensionRecord> = mongoose.model<ISuspensionRecord>(
  'SuspensionRecord',
  SuspensionRecordSchema
);
export default SuspensionRecord;

