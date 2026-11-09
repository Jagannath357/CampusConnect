import mongoose, { Document, Schema, Model, Types } from 'mongoose';

export type ClubCategory = 'TECHNICAL' | 'CULTURAL' | 'SPORTS' | 'ACADEMIC' | 'SOCIAL';

export interface IClub extends Document {
  name: string;
  code: string;
  category: ClubCategory;
  description: string;
  leadStudentId?: Types.ObjectId;
  leadStudentName?: string;
  logoUrl?: string;
  logoPublicId?: string;
  isVerified: boolean;
  verifiedBy?: Types.ObjectId;
  verifiedAt?: Date;
  membershipInfo?: string;
  contactEmail: string;
  createdAt: Date;
  updatedAt: Date;
}

const ClubSchema = new Schema<IClub>(
  {
    name: {
      type: String,
      required: [true, 'Club name is required'],
      unique: true,
      trim: true,
    },
    code: {
      type: String,
      required: [true, 'Club code is required'],
      unique: true,
      uppercase: true,
      trim: true,
      index: true,
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
    leadStudentId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: false,
      index: true,
    },
    leadStudentName: {
      type: String,
      required: false,
      default: 'Campus Administration',
    },
    logoUrl: {
      type: String,
    },
    logoPublicId: {
      type: String,
    },
    isVerified: {
      type: Boolean,
      default: false,
      index: true,
    },
    verifiedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    verifiedAt: {
      type: Date,
    },
    membershipInfo: {
      type: String,
    },
    contactEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
  },
  {
    timestamps: true,
  }
);

ClubSchema.index({ isVerified: 1, category: 1 });

export const Club: Model<IClub> = mongoose.model<IClub>('Club', ClubSchema);
export default Club;

