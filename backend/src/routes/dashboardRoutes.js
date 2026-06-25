import { Router } from 'express';
import * as dashboardController from '../controllers/dashboardController.js';
import { authenticate } from '../middleware/auth.js';
import { authorize } from '../middleware/authorize.js';

const router = Router();

router.use(authenticate);

router.get('/admin', authorize('ADMIN'), dashboardController.getAdminDashboard);
router.get(
  '/store-owner',
  authorize('STORE_OWNER'),
  dashboardController.getStoreOwnerDashboard
);

export default router;
