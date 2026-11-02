import mongoose, { Document, Schema, Model, Types } from 'mongoose';

export interface IAcademicAnswer extends Document {
  questionId: Types.ObjectId;
  authorId: Types.ObjectId;
  content: string;
  isModerated: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const AcademicAnswerSchema = new Schema<IAcademicAnswer>(
  {
    questionId: {
      type: Schema.Types.ObjectId,
      ref: 'AcademicQuestion',
      required: true,
      index: true,
    },
    authorId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    content: {
      type: String,
      required: [true, 'Answer content is required'],
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

AcademicAnswerSchema.index({ questionId: 1, isModerated: 1, createdAt: 1 });

export const AcademicAnswer: Model<IAcademicAnswer> = mongoose.model<IAcademicAnswer>(
  'AcademicAnswer',
  AcademicAnswerSchema
);
export default AcademicAnswer;

