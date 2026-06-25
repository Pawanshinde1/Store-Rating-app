import * as dashboardService from '../services/dashboardService.js';
import { asyncHandler } from '../middleware/errorHandler.js';

export const getAdminDashboard = asyncHandler(async (_req, res) => {
  const data = await dashboardService.getAdminDashboard();
  res.json({ success: true, data });
});

export const getStoreOwnerDashboard = asyncHandler(async (req, res) => {
  const data = await dashboardService.getStoreOwnerDashboard(req.user.id);
  res.json({ success: true, data });
});
