import mongoose, { Document, Schema, Model, Types } from 'mongoose';

export type ClaimStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface IOwnershipClaim extends Document {
  itemId: Types.ObjectId;
  claimantId: Types.ObjectId;
  claimDescription: string;
  proofDetails: string;
  proofFileUrl?: string;
  status: ClaimStatus;
  reviewedBy?: Types.ObjectId;
  reviewedAt?: Date;
  reviewNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const OwnershipClaimSchema = new Schema<IOwnershipClaim>(
  {
    itemId: {
      type: Schema.Types.ObjectId,
      ref: 'LostFoundItem',
      required: true,
      index: true,
    },
    claimantId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    claimDescription: {
      type: String,
      required: [true, 'Claim description is required'],
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    proofDetails: {
      type: String,
      required: [true, 'Proof details are required'],
      maxlength: [1000, 'Proof details cannot exceed 1000 characters'],
    },
    proofFileUrl: {
      type: String,
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

OwnershipClaimSchema.index({ itemId: 1, claimantId: 1 });

export const OwnershipClaim: Model<IOwnershipClaim> = mongoose.model<IOwnershipClaim>(
  'OwnershipClaim',
  OwnershipClaimSchema
);
export default OwnershipClaim;

