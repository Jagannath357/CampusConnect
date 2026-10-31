import mongoose, { Document, Schema, Model, Types } from 'mongoose';

export interface IEventRegistration extends Document {
  eventId: Types.ObjectId;
  studentId: Types.ObjectId;
  registrationToken: string;
  status: 'CONFIRMED' | 'CANCELLED';
  registeredAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const EventRegistrationSchema = new Schema<IEventRegistration>(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
      index: true,
    },
    studentId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    registrationToken: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    status: {
      type: String,
      enum: ['CONFIRMED', 'CANCELLED'],
      default: 'CONFIRMED',
    },
    registeredAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Compound unique index to strictly guarantee no duplicate bookings at the database level!
EventRegistrationSchema.index({ eventId: 1, studentId: 1 }, { unique: true });

export const EventRegistration: Model<IEventRegistration> = mongoose.model<IEventRegistration>(
  'EventRegistration',
  EventRegistrationSchema
);
export default EventRegistration;
