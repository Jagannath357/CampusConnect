import mongoose, { Document, Schema, Model, Types } from 'mongoose';

export interface ISystemConfiguration extends Document {
  key: string;
  value: any;
  description?: string;
  updatedBy?: Types.ObjectId;
  updatedAt: Date;
}

const SystemConfigurationSchema = new Schema<ISystemConfiguration>(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    value: {
      type: Schema.Types.Mixed,
      required: true,
    },
    description: {
      type: String,
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: false,
  }
);

export const SystemConfiguration: Model<ISystemConfiguration> = mongoose.model<ISystemConfiguration>(
  'SystemConfiguration',
  SystemConfigurationSchema
);
export default SystemConfiguration;
