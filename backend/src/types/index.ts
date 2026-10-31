import { Request } from 'express';

export type UserRole = 'STUDENT' | 'ADMIN';
export type AccountStatus = 'ACTIVE' | 'SUSPENDED' | 'PENDING';

export interface AuthUserPayload {
  userId: string;
  email: string;
  role: UserRole;
  tokenVersion: number;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthUserPayload;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  errors?: any;
}
