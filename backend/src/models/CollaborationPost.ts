import mongoose, { Document, Schema, Model, Types } from 'mongoose';

export interface ICollaborationPost extends Document {
  creatorId: Types.ObjectId;
  title: string;
  description: string;
  domain: string;
  requiredSkills: string[];
  vacancyCount: number;
  vacancyDescription?: string;
  contactInfo: string;
  tags: string[];
  status: 'OPEN' | 'CLOSED';
  isModerated: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CollaborationPostSchema = new Schema<ICollaborationPost>(
  {
    creatorId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Project title is required'],
      trim: true,
      maxlength: [120, 'Title cannot exceed 120 characters'],
    },
    description: {
      type: String,
      required: [true, 'Project description is required'],
      maxlength: [3000, 'Description cannot exceed 3000 characters'],
    },
    domain: {
      type: String,
      required: [true, 'Technical domain is required'],
      trim: true,
      index: true,
    },
    requiredSkills: {
      type: [String],
      default: [],
      index: true,
    },
    vacancyCount: {
      type: Number,
      default: 1,
      min: [1, 'Vacancy must be at least 1'],
    },
    vacancyDescription: {
      type: String,
      trim: true,
    },
    contactInfo: {
      type: String,
      required: [true, 'Contact info is required'],
      trim: true,
    },
    tags: {
      type: [String],
      default: [],
      index: true,
    },
    status: {
      type: String,
      enum: ['OPEN', 'CLOSED'],
      default: 'OPEN',
      index: true,
    },
    isModerated: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

CollaborationPostSchema.index({ status: 1, isModerated: 1, createdAt: -1 });
CollaborationPostSchema.index({ title: 'text', description: 'text', tags: 'text' });

export const CollaborationPost: Model<ICollaborationPost> = mongoose.model<ICollaborationPost>(
  'CollaborationPost',
  CollaborationPostSchema
);
export default CollaborationPost;
