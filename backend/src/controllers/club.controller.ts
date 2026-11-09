import { Response } from 'express';
import { AuthenticatedRequest } from '../types/index.js';
import { Club } from '../models/Club.js';
import { ClubApplication } from '../models/ClubApplication.js';
import { User } from '../models/User.js';

export const getClubs = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { category, search } = req.query;

    const query: any = { isVerified: true }; // SRS Module 9: Only verified clubs appear in public discovery

    if (category) {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { code: { $regex: search, $options: 'i' } },
      ];
    }

    const clubs = await Club.find(query).sort({ name: 1 });

    res.status(200).json({
      success: true,
      message: 'Verified student clubs retrieved.',
      data: clubs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve clubs.',
    });
  }
};

export const getClubById = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const club = await Club.findById(id).populate('leadStudentId', 'name email');

    if (!club) {
      res.status(404).json({
        success: false,
        message: 'Club not found.',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Club details retrieved.',
      data: club,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve club details.',
    });
  }
};

export const applyForClub = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  res.status(403).json({
    success: false,
    message: 'Access Denied: Students cannot create or register new clubs. Only campus administrators are authorized to establish official university clubs.',
  });
};

export const getMyClubApplications = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const applications = await ClubApplication.find({
      proposedLeadStudentId: req.user?.userId,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: 'Club applications retrieved.',
      data: applications,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve club applications.',
    });
  }
};

