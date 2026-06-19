import { Router } from 'express';
import { Request, Response } from 'express';
import { authController } from '../controllers/auth.controller';
import { authenticateToken, AuthRequest } from '../middleware/auth.middleware';
import 'express-async-errors';

const router = Router();

/**
 * @route POST /api/auth/register
 * @description Register a new user
 * @body { email, password, firstName, lastName }
 */
router.post('/register', async (req: Request, res: Response) => {
  const { email, password, firstName, lastName } = req.body;

  if (!email || !password || !firstName || !lastName) {
    return res.status(400).json({
      error: 'Missing required fields: email, password, firstName, lastName',
    });
  }

  const result = await authController.register(email, password, firstName, lastName);

  res.status(201).json({
    message: 'User registered successfully',
    ...result,
  });
});

/**
 * @route POST /api/auth/login
 * @description Login user
 * @body { email, password }
 */
router.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      error: 'Missing required fields: email, password',
    });
  }

  const result = await authController.login(email, password);

  res.json({
    message: 'Login successful',
    ...result,
  });
});

/**
 * @route GET /api/auth/profile
 * @description Get current user profile (protected)
 */
router.get('/profile', authenticateToken, async (req: AuthRequest, res: Response) => {
  const user = await authController.getProfile(req.userId!);

  res.json({
    user,
  });
});

/**
 * @route PUT /api/auth/profile
 * @description Update current user profile (protected)
 * @body { firstName, lastName, phone }
 */
router.put('/profile', authenticateToken, async (req: AuthRequest, res: Response) => {
  const { firstName, lastName, phone } = req.body;

  const user = await authController.updateProfile(req.userId!, {
    firstName,
    lastName,
    phone,
  });

  res.json({
    message: 'Profile updated successfully',
    user,
  });
});

/**
 * @route POST /api/auth/logout
 * @description Logout user (client-side token removal)
 */
router.post('/logout', (req: Request, res: Response) => {
  res.json({ message: 'Logout successful' });
});

export default router;
