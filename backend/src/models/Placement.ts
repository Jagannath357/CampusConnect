import mongoose, { Document, Schema, Model, Types } from 'mongoose';

export type PlacementStatus = 'ACTIVE' | 'EXPIRED' | 'ARCHIVED';

export interface IPlacement extends Document {
  companyName: string;
  jobTitle: string;
  jobDescription: string;
  minimumCgpa: number;
  eligibleBranches: string[];
  packageDetails?: string;
  location?: string;
  applicationDeadline: Date;
  applicationUrl?: string;
  contactEmail?: string;
  status: PlacementStatus;
  publishedBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const PlacementSchema = new Schema<IPlacement>(
  {
    companyName: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
      index: true,
    },
    jobTitle: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
    },
    jobDescription: {
      type: String,
      required: [true, 'Job description is required'],
    },
    minimumCgpa: {
      type: Number,
      required: true,
      default: 0.0,
      min: [0, 'CGPA cannot be negative'],
      max: [10, 'CGPA cannot exceed 10'],
      index: true,
    },
    eligibleBranches: {
      type: [String],
      required: [true, 'Eligible branches required'],
      index: true,
    },
    packageDetails: {
      type: String,
      trim: true,
    },
    location: {
      type: String,
      trim: true,
    },
    applicationDeadline: {
      type: Date,
      required: [true, 'Application deadline is required'],
      index: true,
    },
    applicationUrl: {
      type: String,
      trim: true,
    },
    contactEmail: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'EXPIRED', 'ARCHIVED'],
      default: 'ACTIVE',
      index: true,
    },
    publishedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

PlacementSchema.index({ status: 1, minimumCgpa: 1, applicationDeadline: 1 });
PlacementSchema.index({ companyName: 'text', jobTitle: 'text' });

export const Placement: Model<IPlacement> = mongoose.model<IPlacement>('Placement', PlacementSchema);
export default Placement;
