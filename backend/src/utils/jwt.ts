import jwt from 'jsonwebtoken';
import { AuthUserPayload } from '../types/index.js';

const JWT_SECRET = process.env.JWT_ACCESS_SECRET || 'campusconnect_fallback_jwt_secret_2026';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

export const signToken = (payload: AuthUserPayload): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN } as jwt.SignOptions);
};

export const verifyToken = (token: string): AuthUserPayload => {
  return jwt.verify(token, JWT_SECRET) as AuthUserPayload;
};
