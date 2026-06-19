import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/auth';
import { AppError } from './error.middleware';

export interface AuthRequest extends Request {
  userId?: string;
}

export const authenticateToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    throw new AppError('No token provided', 401);
  }

  const userId = verifyToken(token);
  if (!userId) {
    throw new AppError('Invalid or expired token', 401);
  }

  req.userId = userId;
  next();
};

export const optionalAuth = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token) {
    const userId = verifyToken(token);
    if (userId) {
      req.userId = userId;
    }
  }

  next();
};
