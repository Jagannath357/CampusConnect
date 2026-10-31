import { Request, Response } from 'express';
import { Grievance } from '../models/Grievance.js';
import { generateTrackingTicket } from '../utils/tokens.js';

export const submitGrievance = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category, description } = req.body;

    const trackingTicket = generateTrackingTicket();

    // SRS Module 7: Pure Anonymous Grievance - NO student IDs, NO session markers, NO IP stored
    const grievance = await Grievance.create({
      trackingTicket,
      category,
      description,
      status: 'SUBMITTED',
      statusTimeline: [
        {
          status: 'SUBMITTED',
          note: 'Grievance submitted anonymously to university portal administration.',
          updatedAt: new Date(),
        },
      ],
    });

    res.status(201).json({
      success: true,
      message:
        'Your grievance has been submitted anonymously. Please save your tracking ticket safely to check resolution progress.',
      data: {
        trackingTicket: grievance.trackingTicket,
        category: grievance.category,
        status: grievance.status,
        submittedAt: grievance.createdAt,
      },
    });
  } catch (error) {
    console.error('[Submit Grievance Error]', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit grievance anonymously.',
    });
  }
};

export const trackGrievance = async (req: Request, res: Response): Promise<void> => {
  try {
    const ticket = String(req.params.ticket || '');

    if (!ticket) {
      res.status(400).json({
        success: false,
        message: 'Grievance tracking ticket is required.',
      });
      return;
    }

    const grievance = await Grievance.findOne({
      trackingTicket: ticket.trim().toUpperCase(),
    }).select('-__v');

    if (!grievance) {
      res.status(404).json({
        success: false,
        message: 'No grievance record found matching tracking ticket ' + ticket.toUpperCase(),
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Grievance status retrieved.',
      data: grievance,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to track grievance status.',
    });
  }
};
