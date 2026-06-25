import { Router } from 'express';
import authRoutes from './authRoutes.js';
import userRoutes from './userRoutes.js';
import storeRoutes from './storeRoutes.js';
import ratingRoutes from './ratingRoutes.js';
import dashboardRoutes from './dashboardRoutes.js';

const router = Router();

router.get('/health', (_req, res) => {
  res.json({ success: true, message: 'Store Rating API is running' });
});

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/stores', storeRoutes);
router.use('/ratings', ratingRoutes);
router.use('/dashboard', dashboardRoutes);

export default router;
