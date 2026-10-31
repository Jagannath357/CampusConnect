import mongoose, { Document, Schema, Model, Types } from 'mongoose';

export interface IUserSession extends Document {
  userId: Types.ObjectId;
  tokenVersion: number;
  deviceInfo?: string;
  ipAddress?: string;
  expiresAt: Date;
  createdAt: Date;
}

const UserSessionSchema = new Schema<IUserSession>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    tokenVersion: {
      type: Number,
      required: true,
    },
    deviceInfo: {
      type: String,
    },
    ipAddress: {
      type: String,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 }, // TTL index
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: false,
  }
);

export const UserSession: Model<IUserSession> = mongoose.model<IUserSession>(
  'UserSession',
  UserSessionSchema
);
export default UserSession;
