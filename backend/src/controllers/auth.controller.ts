import { PrismaClient } from '@prisma/client';
import { hashPassword, comparePassword, generateToken, validateEmail, validatePassword } from '../utils/auth';
import { AppError } from '../middleware/error.middleware';

const prisma = new PrismaClient();

export const authController = {
  register: async (email: string, password: string, firstName: string, lastName: string) => {
    // Validate input
    if (!validateEmail(email)) {
      throw new AppError('Invalid email format', 400);
    }

    if (!validatePassword(password)) {
      throw new AppError(
        'Password must be at least 8 characters with uppercase, lowercase, and number',
        400,
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new AppError('User already exists', 409);
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        role: 'BUYER',
      },
    });

    // Generate token
    const token = generateToken(user.id);

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    };
  },

  login: async (email: string, password: string) => {
    // Validate input
    if (!validateEmail(email)) {
      throw new AppError('Invalid email format', 400);
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new AppError('User not found', 401);
    }

    // Verify password
    const passwordMatch = await comparePassword(password, user.password);
    if (!passwordMatch) {
      throw new AppError('Invalid password', 401);
    }

    // Check if user is active
    if (!user.isActive) {
      throw new AppError('User account is inactive', 403);
    }

    // Generate token
    const token = generateToken(user.id);

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    };
  },

  getProfile: async (userId: string) => {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        avatar: true,
        role: true,
        isActive: true,
        emailVerified: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    return user;
  },

  updateProfile: async (userId: string, data: { firstName?: string; lastName?: string; phone?: string }) => {
    const user = await prisma.user.update({
      where: { id: userId },
      data,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        avatar: true,
        role: true,
      },
    });

    return user;
  },
};
