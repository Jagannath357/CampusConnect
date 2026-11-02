import mongoose, { Document, Schema, Model } from 'mongoose';

export type GrievanceStatus =
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'ASSIGNED'
  | 'IN_PROGRESS'
  | 'RESOLVED'
  | 'REJECTED';

export interface IGrievanceTimeline {
  status: GrievanceStatus;
  note: string;
  updatedAt: Date;
}

export interface IGrievance extends Document {
  trackingTicket: string;
  category: string;
  description: string;
  status: GrievanceStatus;
  assignedDepartment?: string;
  assignedAdminNotes?: string;
  statusTimeline: IGrievanceTimeline[];
  createdAt: Date;
  updatedAt: Date;
}

const GrievanceTimelineSchema = new Schema<IGrievanceTimeline>(
  {
    status: {
      type: String,
      required: true,
    },
    note: {
      type: String,
      required: true,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const GrievanceSchema = new Schema<IGrievance>(
  {
    trackingTicket: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      index: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
      index: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      maxlength: [4000, 'Description cannot exceed 4000 characters'],
    },
    status: {
      type: String,
      enum: ['SUBMITTED', 'UNDER_REVIEW', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED', 'REJECTED'],
      default: 'SUBMITTED',
      index: true,
    },
    assignedDepartment: {
      type: String,
      trim: true,
      index: true,
    },
    assignedAdminNotes: {
      type: String,
    },
    statusTimeline: {
      type: [GrievanceTimelineSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

GrievanceSchema.index({ status: 1, category: 1, createdAt: -1 });

export const Grievance: Model<IGrievance> = mongoose.model<IGrievance>('Grievance', GrievanceSchema);
export default Grievance;

