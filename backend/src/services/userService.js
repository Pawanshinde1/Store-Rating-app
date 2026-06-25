import prisma from '../config/database.js';
import { AppError } from '../middleware/errorHandler.js';
import { hashPassword } from '../utils/password.js';
import { parsePagination, parseSort, buildPaginatedResponse } from '../utils/pagination.js';

const USER_SORT_FIELDS = ['name', 'email', 'role', 'createdAt'];

export const createUser = async ({ name, email, password, address, role }) => {
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new AppError('Email already registered', 409);
  }

  const hashedPassword = await hashPassword(password);

  return prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      address: address || null,
      role,
    },
    select: {
      id: true,
      name: true,
      email: true,
      address: true,
      role: true,
      createdAt: true,
    },
  });
};

export const getUsers = async (query) => {
  const { page, limit, skip } = parsePagination(query);
  const orderBy = parseSort(query, USER_SORT_FIELDS);

  const where = {};

  if (query.search) {
    where.OR = [
      { name: { contains: query.search, mode: 'insensitive' } },
      { email: { contains: query.search, mode: 'insensitive' } },
      { address: { contains: query.search, mode: 'insensitive' } },
    ];
  }

  if (query.role && ['ADMIN', 'USER', 'STORE_OWNER'].includes(query.role)) {
    where.role = query.role;
  }

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      skip,
      take: limit,
      orderBy,
      select: {
        id: true,
        name: true,
        email: true,
        address: true,
        role: true,
        createdAt: true,
        _count: { select: { ratings: true, ownedStores: true } },
      },
    }),
    prisma.user.count({ where }),
  ]);

  return buildPaginatedResponse(users, total, page, limit);
};

export const getUserById = async (id) => {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      address: true,
      role: true,
      createdAt: true,
      ownedStores: {
        select: { id: true, name: true, email: true, address: true },
      },
      _count: { select: { ratings: true } },
    },
  });

  if (!user) {
    throw new AppError('User not found', 404);
  }

  return user;
};
