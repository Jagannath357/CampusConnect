import { Response } from 'express';
import { AuthenticatedRequest } from '../types/index.js';
import { Placement } from '../models/Placement.js';
import { StudentProfile } from '../models/StudentProfile.js';

export const getEligiblePlacements = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    // Decision Table 4 - Rule 4: Student authenticated?
    if (!req.user || req.user.role !== 'STUDENT') {
      res.status(401).json({
        success: false,
        message: 'Authentication required: Please log in as a student to view personalized placement opportunities.',
      });
      return;
    }

    const { search, page = '1', limit = '10' } = req.query;

    // Fetch student's profile to obtain actual branch and CGPA
    const profile = await StudentProfile.findOne({ userId: req.user.userId });
    if (!profile) {
      res.status(404).json({
        success: false,
        message: 'Student profile not found. Please complete your academic profile.',
      });
      return;
    }

    const studentBranch = profile.department.toUpperCase();
    const studentCgpa = profile.cgpa || 0.0;

    // Decision Table 4 - Rules 1, 2, 3: Strict backend filtering
    // Only includes active listings where studentBranch is in eligibleBranches AND studentCgpa >= minimumCgpa
    const query: any = {
      status: 'ACTIVE',
      eligibleBranches: { $in: [studentBranch, 'ALL'] },
      minimumCgpa: { $lte: studentCgpa },
    };

    if (search) {
      query.$or = [
        { companyName: { $regex: search, $options: 'i' } },
        { jobTitle: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
      ];
    }

    const pageNum = parseInt(page as string, 10) || 1;
    const limitNum = parseInt(limit as string, 10) || 10;
    const skip = (pageNum - 1) * limitNum;

    const total = await Placement.countDocuments(query);
    const placements = await Placement.find(query)
      .sort({ applicationDeadline: 1 })
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      message: 'Personalized eligible placement opportunities retrieved.',
      data: {
        studentProfileSummary: {
          department: studentBranch,
          cgpa: studentCgpa,
        },
        placements,
      },
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
      message: 'Failed to retrieve placement opportunities.',
    });
  }
};

export const getPlacementById = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const placement = await Placement.findById(id);

    if (!placement) {
      res.status(404).json({
        success: false,
        message: 'Placement drive listing not found.',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Placement drive details retrieved.',
      data: placement,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve placement details.',
    });
  }
};

