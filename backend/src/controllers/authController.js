import * as authService from '../services/authService.js';
import { asyncHandler } from '../middleware/errorHandler.js';

export const register = asyncHandler(async (req, res) => {
  const result = await authService.register(req.body);
  res.status(201).json({ success: true, data: result });
});

export const login = asyncHandler(async (req, res) => {
  const result = await authService.login(req.body);
  res.json({ success: true, data: result });
});

export const logout = asyncHandler(async (_req, res) => {
  res.json({ success: true, message: 'Logged out successfully' });
});

export const changePassword = asyncHandler(async (req, res) => {
  const result = await authService.changePassword(req.user.id, {
    currentPassword: req.body.currentPassword,
    newPassword: req.body.newPassword,
  });
  res.json({ success: true, data: result });
});

export const getProfile = asyncHandler(async (req, res) => {
  const user = await authService.getProfile(req.user.id);
  res.json({ success: true, data: user });
});
