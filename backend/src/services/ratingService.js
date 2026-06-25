import prisma from '../config/database.js';
import { AppError } from '../middleware/errorHandler.js';

export const submitRating = async (userId, { storeId, rating }) => {
  const store = await prisma.store.findUnique({ where: { id: storeId } });
  if (!store) {
    throw new AppError('Store not found', 404);
  }

  const existingRating = await prisma.rating.findUnique({
    where: { userId_storeId: { userId, storeId } },
  });

  if (existingRating) {
    throw new AppError('You have already rated this store. Use update instead.', 409);
  }

  return prisma.rating.create({
    data: { userId, storeId, rating },
    select: {
      id: true,
      rating: true,
      createdAt: true,
      store: { select: { id: true, name: true } },
    },
  });
};

export const updateRating = async (userId, storeId, rating) => {
  const existingRating = await prisma.rating.findUnique({
    where: { userId_storeId: { userId, storeId } },
  });

  if (!existingRating) {
    throw new AppError('Rating not found. Submit a rating first.', 404);
  }

  return prisma.rating.update({
    where: { userId_storeId: { userId, storeId } },
    data: { rating },
    select: {
      id: true,
      rating: true,
      createdAt: true,
      store: { select: { id: true, name: true } },
    },
  });
};

export const getUserRating = async (userId, storeId) => {
  const rating = await prisma.rating.findUnique({
    where: { userId_storeId: { userId, storeId } },
    select: {
      id: true,
      rating: true,
      createdAt: true,
      store: { select: { id: true, name: true, address: true } },
    },
  });

  if (!rating) {
    throw new AppError('Rating not found', 404);
  }

  return rating;
};

export const getUserRatings = async (userId) => {
  return prisma.rating.findMany({
    where: { userId },
    select: {
      id: true,
      rating: true,
      createdAt: true,
      store: { select: { id: true, name: true, address: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
};
