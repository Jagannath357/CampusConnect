import { Request, Response } from 'express';
import { User } from '../models/User.js';
import { StudentProfile } from '../models/StudentProfile.js';
import { UserSession } from '../models/UserSession.js';
import { hashPassword, comparePassword } from '../utils/password.js';
import { signToken } from '../utils/jwt.js';
import { isAllowedEmailDomain } from '../utils/systemConfig.js';
import { AuthenticatedRequest } from '../types/index.js';

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, department, batchYear, rollNumber } = req.body;

    // Decision Table 2 - Rule 2: Allowed university domain check
    const isDomainAllowed = await isAllowedEmailDomain(email);
    if (!isDomainAllowed) {
      res.status(400).json({
        success: false,
        message: 'Invalid university email domain. Only official Silicon University emails (@silicon.ac.in) are permitted.',
      });
      return;
    }

    // Decision Table 2 - Rule 5: Duplicate account detection
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(409).json({
        success: false,
        message: 'An account with this university email address already exists.',
      });
      return;
    }

    // Check duplicate roll number
    const existingRoll = await StudentProfile.findOne({ rollNumber: rollNumber.toUpperCase() });
    if (existingRoll) {
      res.status(409).json({
        success: false,
        message: 'A student profile with this roll number already exists.',
      });
      return;
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create user (Strictly STUDENT role for public registration)
    const user = await User.create({
      name,
      email,
      passwordHash,
      role: 'STUDENT',
      status: 'ACTIVE',
      tokenVersion: 0,
    });

    // Create associated student profile
    const profile = await StudentProfile.create({
      userId: user._id,
      rollNumber: rollNumber.toUpperCase(),
      department: department.toUpperCase(),
      batchYear,
      cgpa: 0.0,
      skills: [],
    });

    // Issue JWT token
    const token = signToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
      tokenVersion: user.tokenVersion,
    });

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: (process.env.NODE_ENV === 'production' ? 'none' : 'lax') as 'none' | 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    };
    res.cookie('token', token, cookieOptions);

    res.status(201).json({
      success: true,
      message: 'Student account registered successfully.',
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          status: user.status,
        },
        profile,
      },
    });
  } catch (error) {
    console.error('[Register Error]', error);
    res.status(500).json({
      success: false,
      message: 'Failed to complete registration. Please try again.',
    });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      // Decision Table 1 - Rule 3: Invalid credentials
      res.status(401).json({
        success: false,
        message: 'Invalid university email or password.',
      });
      return;
    }

    // Check password
    const isPasswordValid = await comparePassword(password, user.passwordHash);
    if (!isPasswordValid) {
      res.status(401).json({
        success: false,
        message: 'Invalid university email or password.',
      });
      return;
    }

    // Decision Table 1 - Rule 4 & 5: Check account status
    if (user.status === 'SUSPENDED') {
      res.status(403).json({
        success: false,
        message: 'Account Suspended: Your access has been revoked by administration.',
        accountStatus: 'SUSPENDED',
      });
      return;
    }

    user.lastLoginAt = new Date();
    await user.save();

    // Create session record
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);
    await UserSession.create({
      userId: user._id,
      tokenVersion: user.tokenVersion,
      deviceInfo: req.headers['user-agent'] || 'Unknown Device',
      ipAddress: (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '127.0.0.1',
      expiresAt,
    });

    // Issue JWT token
    const token = signToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
      tokenVersion: user.tokenVersion,
    });

    // Load student profile if student
    let profile = null;
    if (user.role === 'STUDENT') {
      profile = await StudentProfile.findOne({ userId: user._id });
    }

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: (process.env.NODE_ENV === 'production' ? 'none' : 'lax') as 'none' | 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    };
    res.cookie('token', token, cookieOptions);

    res.status(200).json({
      success: true,
      message: 'Login successful.',
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          status: user.status,
        },
        profile,
      },
    });
  } catch (error) {
    console.error('[Login Error]', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process login request.',
    });
  }
};

export const getMe = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user?.userId).select('-passwordHash');
    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User account not found.',
      });
      return;
    }

    let profile = null;
    if (user.role === 'STUDENT') {
      profile = await StudentProfile.findOne({ userId: user._id });
    }

    res.status(200).json({
      success: true,
      message: 'Profile retrieved successfully.',
      data: {
        user,
        profile,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve profile.',
    });
  }
};

export const logout = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (req.user?.userId) {
      await UserSession.deleteMany({ userId: req.user.userId });
    }
    res.clearCookie('token');

    res.status(200).json({
      success: true,
      message: 'Logged out successfully.',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to logout cleanly.',
    });
  }
};

