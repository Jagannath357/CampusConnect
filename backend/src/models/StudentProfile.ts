import mongoose, { Document, Schema, Model, Types } from 'mongoose';

export interface IStudentProfile extends Document {
  userId: Types.ObjectId;
  rollNumber: string;
  department: string;
  batchYear: number;
  cgpa: number;
  contactNumber?: string;
  bio?: string;
  avatarUrl?: string;
  avatarPublicId?: string;
  skills: string[];
  githubUrl?: string;
  linkedinUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const StudentProfileSchema = new Schema<IStudentProfile>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    rollNumber: {
      type: String,
      required: [true, 'Roll number is required'],
      trim: true,
      uppercase: true,
      index: true,
    },
    department: {
      type: String,
      required: [true, 'Department is required'],
      trim: true,
      uppercase: true,
      index: true,
    },
    batchYear: {
      type: Number,
      required: [true, 'Batch year is required'],
      index: true,
    },
    cgpa: {
      type: Number,
      default: 0.0,
      min: [0, 'CGPA cannot be negative'],
      max: [10, 'CGPA cannot exceed 10.0'],
    },
    contactNumber: {
      type: String,
      trim: true,
    },
    bio: {
      type: String,
      trim: true,
      maxlength: [500, 'Bio cannot exceed 500 characters'],
    },
    avatarUrl: {
      type: String,
    },
    avatarPublicId: {
      type: String,
    },
    skills: {
      type: [String],
      default: [],
    },
    githubUrl: {
      type: String,
      trim: true,
    },
    linkedinUrl: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

StudentProfileSchema.index({ department: 1, batchYear: 1 });
StudentProfileSchema.index({ cgpa: 1 });

export const StudentProfile: Model<IStudentProfile> = mongoose.model<IStudentProfile>(
  'StudentProfile',
  StudentProfileSchema
);
export default StudentProfile;

