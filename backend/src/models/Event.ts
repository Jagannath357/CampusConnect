import mongoose, { Document, Schema, Model, Types } from 'mongoose';

export type EventStatus = 'DRAFT' | 'PUBLISHED' | 'CANCELLED' | 'COMPLETED';

export interface IEvent extends Document {
  title: string;
  description: string;
  category: string;
  date: Date;
  startTime: string;
  endTime: string;
  venue: string;
  organizer: string;
  organizerClubId?: Types.ObjectId;
  createdBy: Types.ObjectId;
  maxCapacity: number;
  availableSeats: number;
  status: EventStatus;
  imageUrl?: string;
  imagePublicId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const EventSchema = new Schema<IEvent>(
  {
    title: {
      type: String,
      required: [true, 'Event title is required'],
      trim: true,
      maxlength: [150, 'Title cannot exceed 150 characters'],
    },
    description: {
      type: String,
      required: [true, 'Event description is required'],
    },
    category: {
      type: String,
      required: [true, 'Event category is required'],
      trim: true,
      index: true,
    },
    date: {
      type: Date,
      required: [true, 'Event date is required'],
      index: true,
    },
    startTime: {
      type: String,
      required: [true, 'Start time is required'],
      trim: true,
    },
    endTime: {
      type: String,
      required: [true, 'End time is required'],
      trim: true,
    },
    venue: {
      type: String,
      required: [true, 'Venue is required'],
      trim: true,
    },
    organizer: {
      type: String,
      required: [true, 'Organizer is required'],
      trim: true,
    },
    organizerClubId: {
      type: Schema.Types.ObjectId,
      ref: 'Club',
      index: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    maxCapacity: {
      type: Number,
      required: [true, 'Max capacity is required'],
      min: [1, 'Capacity must be at least 1'],
    },
    availableSeats: {
      type: Number,
      required: true,
      min: [0, 'Available seats cannot be negative'],
    },
    status: {
      type: String,
      enum: ['DRAFT', 'PUBLISHED', 'CANCELLED', 'COMPLETED'],
      default: 'PUBLISHED',
      index: true,
    },
    imageUrl: {
      type: String,
    },
    imagePublicId: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

EventSchema.index({ status: 1, date: 1 });
EventSchema.index({ title: 'text', description: 'text', venue: 'text' });

export const Event: Model<IEvent> = mongoose.model<IEvent>('Event', EventSchema);
export default Event;
