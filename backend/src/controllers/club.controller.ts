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
  try {
    const {
      clubName,
      category,
      description,
      objectives,
      facultyAdvisorName,
      facultyAdvisorEmail,
      contactEmail,
    } = req.body;

    const user = await User.findById(req.user?.userId);
    if (!user) {
      res.status(404).json({
        success: false,
        message: 'Student account not found.',
      });
      return;
    }

    // Check duplicate club name
    const existingClub = await Club.findOne({ name: { $regex: `^${clubName}$`, $options: 'i' } });
    if (existingClub) {
      res.status(409).json({
        success: false,
        message: 'A club with this name already exists in Silicon University.',
      });
      return;
    }

    const application = await ClubApplication.create({
      clubName,
      category,
      description,
      proposedLeadStudentId: user._id,
      proposedLeadStudentName: user.name,
      objectives,
      facultyAdvisorName,
      facultyAdvisorEmail,
      contactEmail,
      status: 'PENDING',
    });

    res.status(201).json({
      success: true,
      message: 'Club registration application submitted for administrative governance review.',
      data: application,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to submit club application.',
    });
  }
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
