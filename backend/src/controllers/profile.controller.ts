import { Response } from 'express';
import { AuthenticatedRequest } from '../types/index.js';
import { StudentProfile } from '../models/StudentProfile.js';
import { User } from '../models/User.js';
import { uploadToStorage, deleteFromStorage } from '../config/cloudinary.js';

export const getMyProfile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user?.userId).select('-passwordHash');
    const profile = await StudentProfile.findOne({ userId: req.user?.userId });

    if (!user || !profile) {
      res.status(404).json({
        success: false,
        message: 'Student profile not found.',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Profile retrieved successfully.',
      data: { user, profile },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve profile.',
    });
  }
};

export const updateMyProfile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { contactNumber, bio, skills, githubUrl, linkedinUrl, cgpa } = req.body;

    const profile = await StudentProfile.findOne({ userId: req.user?.userId });
    if (!profile) {
      res.status(404).json({
        success: false,
        message: 'Student profile not found.',
      });
      return;
    }

    if (contactNumber !== undefined) profile.contactNumber = contactNumber;
    if (bio !== undefined) profile.bio = bio;
    if (skills !== undefined) profile.skills = skills;
    if (githubUrl !== undefined) profile.githubUrl = githubUrl;
    if (linkedinUrl !== undefined) profile.linkedinUrl = linkedinUrl;
    if (cgpa !== undefined) profile.cgpa = cgpa;

    await profile.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully.',
      data: profile,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update profile.',
    });
  }
};

export const uploadAvatar = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({
        success: false,
        message: 'No image file provided.',
      });
      return;
    }

    const profile = await StudentProfile.findOne({ userId: req.user?.userId });
    if (!profile) {
      res.status(404).json({
        success: false,
        message: 'Student profile not found.',
      });
      return;
    }

    // Delete old avatar if present
    if (profile.avatarPublicId) {
      await deleteFromStorage(profile.avatarPublicId);
    }

    const result = await uploadToStorage(req.file, 'avatars');
    profile.avatarUrl = result.url;
    profile.avatarPublicId = result.publicId;
    await profile.save();

    res.status(200).json({
      success: true,
      message: 'Profile image updated successfully.',
      data: {
        avatarUrl: profile.avatarUrl,
      },
    });
  } catch (error) {
    console.error('[Upload Avatar Error]', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload profile image.',
    });
  }
};

export const getProfileByUserId = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).select('name email role');
    const profile = await StudentProfile.findOne({ userId });

    if (!user || !profile) {
      res.status(404).json({
        success: false,
        message: 'Profile not found.',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Profile details retrieved.',
      data: { user, profile },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve profile details.',
    });
  }
};

