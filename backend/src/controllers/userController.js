import * as userService from '../services/userService.js';
import { asyncHandler } from '../middleware/errorHandler.js';

export const createUser = asyncHandler(async (req, res) => {
  const user = await userService.createUser(req.body);
  res.status(201).json({ success: true, data: user });
});

export const getUsers = asyncHandler(async (req, res) => {
  const result = await userService.getUsers(req.query);
  res.json({ success: true, ...result });
});

export const getUserById = asyncHandler(async (req, res) => {
  const user = await userService.getUserById(req.params.id);
  res.json({ success: true, data: user });
});
