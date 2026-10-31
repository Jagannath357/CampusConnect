import mongoose, { Document, Schema, Model, Types } from 'mongoose';

export interface IAcademicResource extends Document {
  uploaderId: Types.ObjectId;
  title: string;
  courseCode: string;
  category: string;
  description?: string;
  fileUrl: string;
  filePublicId?: string;
  fileName: string;
  fileMimeType: string;
  fileSize: number;
  downloadCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const AcademicResourceSchema = new Schema<IAcademicResource>(
  {
    uploaderId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Resource title is required'],
      trim: true,
      maxlength: [150, 'Title cannot exceed 150 characters'],
    },
    courseCode: {
      type: String,
      required: [true, 'Course code is required'],
      trim: true,
      uppercase: true,
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
      trim: true,
    },
    fileUrl: {
      type: String,
      required: [true, 'File URL is required'],
    },
    filePublicId: {
      type: String,
    },
    fileName: {
      type: String,
      required: true,
    },
    fileMimeType: {
      type: String,
      required: true,
    },
    fileSize: {
      type: Number,
      required: true,
    },
    downloadCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

AcademicResourceSchema.index({ courseCode: 1, category: 1, createdAt: -1 });
AcademicResourceSchema.index({ title: 'text', description: 'text', courseCode: 'text' });

export const AcademicResource: Model<IAcademicResource> = mongoose.model<IAcademicResource>(
  'AcademicResource',
  AcademicResourceSchema
);
export default AcademicResource;
