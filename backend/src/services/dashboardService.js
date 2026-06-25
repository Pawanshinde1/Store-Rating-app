import prisma from '../config/database.js';

export const getAdminDashboard = async () => {
  const [totalUsers, totalStores, totalRatings, usersByRole] = await Promise.all([
    prisma.user.count(),
    prisma.store.count(),
    prisma.rating.count(),
    prisma.user.groupBy({
      by: ['role'],
      _count: { role: true },
    }),
  ]);

  const roleBreakdown = usersByRole.reduce((acc, item) => {
    acc[item.role] = item._count.role;
    return acc;
  }, {});

  return {
    totalUsers,
    totalStores,
    totalRatings,
    roleBreakdown,
  };
};

export const getStoreOwnerDashboard = async (ownerId) => {
  const store = await prisma.store.findFirst({
    where: { ownerId },
    select: {
      id: true,
      name: true,
      email: true,
      address: true,
      ratings: {
        select: {
          rating: true,
          createdAt: true,
          user: { select: { id: true, name: true, email: true } },
        },
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  if (!store) {
    return {
      store: null,
      averageRating: 0,
      totalRatings: 0,
      recentRatings: [],
    };
  }

  const ratings = store.ratings;
  const averageRating =
    ratings.length > 0
      ? Math.round((ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length) * 10) / 10
      : 0;

  const ratingDistribution = [1, 2, 3, 4, 5].map((star) => ({
    star,
    count: ratings.filter((r) => r.rating === star).length,
  }));

  return {
    store: {
      id: store.id,
      name: store.name,
      email: store.email,
      address: store.address,
    },
    averageRating,
    totalRatings: ratings.length,
    ratingDistribution,
    recentRatings: ratings.slice(0, 5),
  };
};
