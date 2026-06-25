import * as storeService from '../services/storeService.js';
import { asyncHandler } from '../middleware/errorHandler.js';

export const createStore = asyncHandler(async (req, res) => {
  const store = await storeService.createStore(req.body);
  res.status(201).json({ success: true, data: store });
});

export const getStores = asyncHandler(async (req, res) => {
  const result = await storeService.getStores(
    req.query,
    req.user?.id,
    req.user?.role
  );
  res.json({ success: true, ...result });
});

export const getStoreById = asyncHandler(async (req, res) => {
  const store = await storeService.getStoreById(
    req.params.id,
    req.user?.id,
    req.user?.role
  );
  res.json({ success: true, data: store });
});

export const getOwnedStore = asyncHandler(async (req, res) => {
  const store = await storeService.getOwnedStore(req.user.id);
  res.json({ success: true, data: store });
});

export const getStoreRatings = asyncHandler(async (req, res) => {
  const result = await storeService.getStoreRatings(req.params.id, req.user.id);
  res.json({ success: true, data: result });
});
