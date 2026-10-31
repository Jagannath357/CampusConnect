import mongoose, { Document, Schema, Model, Types } from 'mongoose';

export interface IAcademicQuestion extends Document {
  authorId: Types.ObjectId;
  title: string;
  description: string;
  subjectCode: string;
  subjectCategory: string;
  tags: string[];
  answerCount: number;
  isModerated: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const AcademicQuestionSchema = new Schema<IAcademicQuestion>(
  {
    authorId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Question title is required'],
      trim: true,
      maxlength: [150, 'Title cannot exceed 150 characters'],
    },
    description: {
      type: String,
      required: [true, 'Question description is required'],
    },
    subjectCode: {
      type: String,
      required: [true, 'Subject code is required'],
      trim: true,
      uppercase: true,
      index: true,
    },
    subjectCategory: {
      type: String,
      required: [true, 'Subject category is required'],
      trim: true,
      index: true,
    },
    tags: {
      type: [String],
      default: [],
      index: true,
    },
    answerCount: {
      type: Number,
      default: 0,
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

AcademicQuestionSchema.index({ subjectCategory: 1, isModerated: 1, createdAt: -1 });
AcademicQuestionSchema.index({ title: 'text', description: 'text', tags: 'text' });

export const AcademicQuestion: Model<IAcademicQuestion> = mongoose.model<IAcademicQuestion>(
  'AcademicQuestion',
  AcademicQuestionSchema
);
export default AcademicQuestion;
