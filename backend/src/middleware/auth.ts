import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types/index.js';
import { verifyToken } from '../utils/jwt.js';
import { User } from '../models/User.js';

export const authenticate = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let token: string | undefined;

    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      res.status(401).json({
        success: false,
        message: 'Authentication required. No token provided.',
      });
      return;
    }

    let payload;
    try {
      payload = verifyToken(token);
    } catch (err) {
      res.status(401).json({
        success: false,
        message: 'Invalid or expired token. Please log in again.',
      });
      return;
    }

    // Check user in database for tokenVersion and account suspension status
    const user = await User.findById(payload.userId);
    if (!user) {
      res.status(401).json({
        success: false,
        message: 'User account not found.',
      });
      return;
    }

    // Check immediate session / token revocation via tokenVersion
    if (user.tokenVersion !== payload.tokenVersion) {
      res.status(401).json({
        success: false,
        message: 'Your session has been revoked. Please log in again.',
      });
      return;
    }

    // Check suspension status (Decision Table 1 & Decision Table 8)
    if (user.status === 'SUSPENDED') {
      res.status(403).json({
        success: false,
        message: 'Account Suspended: Your access has been revoked by administration.',
        accountStatus: 'SUSPENDED',
      });
      return;
    }

    req.user = {
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
      tokenVersion: user.tokenVersion,
    };

    next();
  } catch (error) {
    next(error);
  }
};
