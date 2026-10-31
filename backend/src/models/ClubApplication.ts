import mongoose, { Document, Schema, Model, Types } from 'mongoose';
import { ClubCategory } from './Club.js';

export interface IClubApplication extends Document {
  clubName: string;
  category: ClubCategory;
  description: string;
  proposedLeadStudentId: Types.ObjectId;
  proposedLeadStudentName: string;
  objectives: string;
  facultyAdvisorName: string;
  facultyAdvisorEmail: string;
  contactEmail: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  reviewedBy?: Types.ObjectId;
  reviewedAt?: Date;
  reviewNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ClubApplicationSchema = new Schema<IClubApplication>(
  {
    clubName: {
      type: String,
      required: [true, 'Club name is required'],
      trim: true,
    },
    category: {
      type: String,
      enum: ['TECHNICAL', 'CULTURAL', 'SPORTS', 'ACADEMIC', 'SOCIAL'],
      required: true,
      index: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    proposedLeadStudentId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    proposedLeadStudentName: {
      type: String,
      required: true,
    },
    objectives: {
      type: String,
      required: [true, 'Objectives are required'],
    },
    facultyAdvisorName: {
      type: String,
      required: [true, 'Faculty advisor name is required'],
      trim: true,
    },
    facultyAdvisorEmail: {
      type: String,
      required: [true, 'Faculty advisor email is required'],
      trim: true,
      lowercase: true,
    },
    contactEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    status: {
      type: String,
      enum: ['PENDING', 'APPROVED', 'REJECTED'],
      default: 'PENDING',
      index: true,
    },
    reviewedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    reviewedAt: {
      type: Date,
    },
    reviewNotes: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

ClubApplicationSchema.index({ status: 1, createdAt: -1 });

export const ClubApplication: Model<IClubApplication> = mongoose.model<IClubApplication>(
  'ClubApplication',
  ClubApplicationSchema
);
export default ClubApplication;
