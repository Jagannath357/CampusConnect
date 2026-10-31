import { Response } from 'express';
import { AuthenticatedRequest } from '../types/index.js';
import { Event } from '../models/Event.js';
import { EventRegistration } from '../models/EventRegistration.js';
import { generateRegistrationToken } from '../utils/tokens.js';
import { emitEventUpdate } from '../sockets/socketManager.js';

export const getEvents = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { category, search, timeframe = 'upcoming', page = '1', limit = '10' } = req.query;

    const query: any = {};

    // For students, show published events
    if (req.user?.role !== 'ADMIN') {
      query.status = 'PUBLISHED';
    }

    if (category) {
      query.category = category;
    }

    const now = new Date();
    if (timeframe === 'upcoming') {
      query.date = { $gte: new Date(now.setHours(0, 0, 0, 0)) };
    } else if (timeframe === 'past') {
      query.date = { $lt: new Date(now.setHours(0, 0, 0, 0)) };
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { venue: { $regex: search, $options: 'i' } },
        { organizer: { $regex: search, $options: 'i' } },
      ];
    }

    const pageNum = parseInt(page as string, 10) || 1;
    const limitNum = parseInt(limit as string, 10) || 10;
    const skip = (pageNum - 1) * limitNum;

    const total = await Event.countDocuments(query);
    const events = await Event.find(query)
      .sort({ date: 1 })
      .skip(skip)
      .limit(limitNum);

    // If student is authenticated, check which events they are registered for
    let userRegisteredEventIds = new Set<string>();
    if (req.user?.userId) {
      const registrations = await EventRegistration.find({
        studentId: req.user.userId,
        status: 'CONFIRMED',
      }).select('eventId');
      userRegisteredEventIds = new Set(registrations.map((r) => r.eventId.toString()));
    }

    const enrichedEvents = events.map((event) => {
      const eventObj = event.toObject();
      return {
        ...eventObj,
        isUserRegistered: userRegisteredEventIds.has(event._id.toString()),
      };
    });

    res.status(200).json({
      success: true,
      message: 'Events retrieved.',
      data: enrichedEvents,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve events.',
    });
  }
};

export const getEventById = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const event = await Event.findById(id).populate('organizerClubId', 'name code category');

    if (!event) {
      res.status(404).json({
        success: false,
        message: 'Event not found.',
      });
      return;
    }

    let isUserRegistered = false;
    let userRegistration = null;

    if (req.user?.userId) {
      userRegistration = await EventRegistration.findOne({
        eventId: id,
        studentId: req.user.userId,
        status: 'CONFIRMED',
      });
      isUserRegistered = Boolean(userRegistration);
    }

    res.status(200).json({
      success: true,
      message: 'Event details retrieved.',
      data: {
        event,
        isUserRegistered,
        registration: userRegistration,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve event details.',
    });
  }
};

export const registerForEvent = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    // Decision Table 3 - Rule 3: Student is authenticated?
    if (!req.user || req.user.role !== 'STUDENT') {
      res.status(401).json({
        success: false,
        message: 'Student authentication is required to reserve event seats.',
      });
      return;
    }

    const eventId = String(req.params.id);
    const studentId = req.user.userId;

    // Decision Table 3 - Rule 4: Student already booked this event?
    const existingRegistration = await EventRegistration.findOne({
      eventId,
      studentId,
      status: 'CONFIRMED',
    });

    if (existingRegistration) {
      res.status(409).json({
        success: false,
        message: 'Duplicate booking: You are already registered for this campus event.',
        registrationToken: existingRegistration.registrationToken,
      });
      return;
    }

    // Decision Table 3 - Rule 2 & 1: Atomic conditional seat decrement
    // Only decrements if availableSeats > 0 and status is PUBLISHED!
    const updatedEvent = await Event.findOneAndUpdate(
      {
        _id: eventId,
        availableSeats: { $gt: 0 },
        status: 'PUBLISHED',
      },
      {
        $inc: { availableSeats: -1 },
      },
      { new: true }
    );

    if (!updatedEvent) {
      // Check whether event exists or is simply full
      const checkEvent = await Event.findById(eventId);
      if (!checkEvent) {
        res.status(404).json({
          success: false,
          message: 'Target event not found.',
        });
        return;
      }

      // Decision Table 3 - Rule 2: Show full-capacity message
      res.status(400).json({
        success: false,
        message: 'Registration closed: This event has reached maximum capacity.',
      });
      return;
    }

    // Decision Table 3 - Rule 1 Actions:
    // 1. Create enrollment record
    // 2. Generate reservation token
    const token = generateRegistrationToken(eventId, studentId);
    const registration = await EventRegistration.create({
      eventId,
      studentId,
      registrationToken: token,
      status: 'CONFIRMED',
      registeredAt: new Date(),
    });

    // Notify connected clients of seat change via WebSocket
    emitEventUpdate(eventId, { availableSeats: updatedEvent.availableSeats });

    res.status(201).json({
      success: true,
      message: 'Event seat reservation confirmed!',
      data: {
        registrationToken: token,
        registration,
        remainingSeats: updatedEvent.availableSeats,
      },
    });
  } catch (error: any) {
    // If unique constraint violated on duplicate registration
    if (error.code === 11000) {
      // Compensation: increment seat back
      await Event.updateOne({ _id: String(req.params.id) }, { $inc: { availableSeats: 1 } });
      res.status(409).json({
        success: false,
        message: 'Duplicate booking: You are already registered for this campus event.',
      });
      return;
    }

    console.error('[Event Registration Error]', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process event registration.',
    });
  }
};

export const getMyRegistrations = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const registrations = await EventRegistration.find({
      studentId: req.user?.userId,
      status: 'CONFIRMED',
    })
      .populate('eventId')
      .sort({ registeredAt: -1 });

    res.status(200).json({
      success: true,
      message: 'Event registrations retrieved.',
      data: registrations,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve registrations.',
    });
  }
};

export const cancelRegistration = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const eventId = String(req.params.id);
    const studentId = req.user?.userId;

    const registration = await EventRegistration.findOne({
      eventId,
      studentId,
      status: 'CONFIRMED',
    });

    if (!registration) {
      res.status(404).json({
        success: false,
        message: 'Active registration record not found for this event.',
      });
      return;
    }

    registration.status = 'CANCELLED';
    await registration.save();

    // Increment available seats
    const event = await Event.findByIdAndUpdate(
      eventId,
      { $inc: { availableSeats: 1 } },
      { new: true }
    );

    if (event) {
      emitEventUpdate(eventId, { availableSeats: event.availableSeats });
    }

    res.status(200).json({
      success: true,
      message: 'Event registration cancelled successfully.',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to cancel registration.',
    });
  }
};
