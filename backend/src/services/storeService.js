import prisma from '../config/database.js';
import { AppError } from '../middleware/errorHandler.js';
import { parsePagination, parseSort, buildPaginatedResponse } from '../utils/pagination.js';

const STORE_SORT_FIELDS = ['name', 'email', 'address', 'createdAt'];

const storeSelectWithRating = {
  id: true,
  name: true,
  email: true,
  address: true,
  ownerId: true,
  createdAt: true,
  owner: {
    select: { id: true, name: true, email: true },
  },
  ratings: {
    select: { rating: true },
  },
};

const enrichStoreWithAverage = (store) => {
  const ratings = store.ratings || [];
  const averageRating =
    ratings.length > 0
      ? Math.round((ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length) * 10) / 10
      : 0;

  const { ratings: _, ...storeData } = store;
  return {
    ...storeData,
    averageRating,
    totalRatings: ratings.length,
  };
};

export const createStore = async ({ name, email, address, ownerId }) => {
  const owner = await prisma.user.findUnique({ where: { id: ownerId } });
  if (!owner) {
    throw new AppError('Store owner not found', 404);
  }
  if (owner.role !== 'STORE_OWNER') {
    throw new AppError('Specified user must have STORE_OWNER role', 400);
  }

  const existingStore = await prisma.store.findUnique({ where: { email } });
  if (existingStore) {
    throw new AppError('Store email already exists', 409);
  }

  const store = await prisma.store.create({
    data: { name, email, address, ownerId },
    select: storeSelectWithRating,
  });

  return enrichStoreWithAverage(store);
};

export const getStores = async (query, userId = null, userRole = null) => {
  const { page, limit, skip } = parsePagination(query);
  const orderBy = parseSort(query, STORE_SORT_FIELDS);

  const where = {};

  if (query.search) {
    where.OR = [
      { name: { contains: query.search, mode: 'insensitive' } },
      { address: { contains: query.search, mode: 'insensitive' } },
    ];
  }

  if (userRole === 'STORE_OWNER' && userId) {
    where.ownerId = userId;
  }

  const [stores, total] = await Promise.all([
    prisma.store.findMany({
      where,
      skip,
      take: limit,
      orderBy,
      select: storeSelectWithRating,
    }),
    prisma.store.count({ where }),
  ]);

  const enrichedStores = stores.map(enrichStoreWithAverage);

  if (userRole === 'USER' && userId) {
    const userRatings = await prisma.rating.findMany({
      where: {
        userId,
        storeId: { in: enrichedStores.map((s) => s.id) },
      },
      select: { storeId: true, rating: true, id: true },
    });

    const ratingMap = Object.fromEntries(userRatings.map((r) => [r.storeId, r]));

    enrichedStores.forEach((store) => {
      store.userRating = ratingMap[store.id] || null;
    });
  }

  return buildPaginatedResponse(enrichedStores, total, page, limit);
};

export const getStoreById = async (id, userId = null, userRole = null) => {
  const store = await prisma.store.findUnique({
    where: { id },
    select: storeSelectWithRating,
  });

  if (!store) {
    throw new AppError('Store not found', 404);
  }

  if (userRole === 'STORE_OWNER' && store.ownerId !== userId) {
    throw new AppError('Access denied', 403);
  }

  const enriched = enrichStoreWithAverage(store);

  if (userRole === 'USER' && userId) {
    const userRating = await prisma.rating.findUnique({
      where: { userId_storeId: { userId, storeId: id } },
      select: { id: true, rating: true, createdAt: true },
    });
    enriched.userRating = userRating;
  }

  return enriched;
};

export const getOwnedStore = async (ownerId) => {
  const store = await prisma.store.findFirst({
    where: { ownerId },
    select: storeSelectWithRating,
  });

  if (!store) {
    throw new AppError('No store found for this owner', 404);
  }

  return enrichStoreWithAverage(store);
};

export const getStoreRatings = async (storeId, ownerId) => {
  const store = await prisma.store.findUnique({
    where: { id: storeId },
    select: { id: true, ownerId: true, name: true },
  });

  if (!store) {
    throw new AppError('Store not found', 404);
  }

  if (store.ownerId !== ownerId) {
    throw new AppError('Access denied', 403);
  }

  const ratings = await prisma.rating.findMany({
    where: { storeId },
    select: {
      id: true,
      rating: true,
      createdAt: true,
      user: {
        select: { id: true, name: true, email: true, address: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  const averageRating =
    ratings.length > 0
      ? Math.round((ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length) * 10) / 10
      : 0;

  return {
    store: { id: store.id, name: store.name },
    averageRating,
    totalRatings: ratings.length,
    ratings,
  };
};
