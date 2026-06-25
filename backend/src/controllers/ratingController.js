import * as ratingService from '../services/ratingService.js';
import { asyncHandler } from '../middleware/errorHandler.js';

export const submitRating = asyncHandler(async (req, res) => {
  const rating = await ratingService.submitRating(req.user.id, req.body);
  res.status(201).json({ success: true, data: rating });
});

export const updateRating = asyncHandler(async (req, res) => {
  const rating = await ratingService.updateRating(
    req.user.id,
    req.params.storeId,
    req.body.rating
  );
  res.json({ success: true, data: rating });
});

export const getUserRating = asyncHandler(async (req, res) => {
  const rating = await ratingService.getUserRating(req.user.id, req.params.storeId);
  res.json({ success: true, data: rating });
});

export const getUserRatings = asyncHandler(async (req, res) => {
  const ratings = await ratingService.getUserRatings(req.user.id);
  res.json({ success: true, data: ratings });
});
