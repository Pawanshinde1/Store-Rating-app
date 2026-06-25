import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('Admin@123', 12);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@storerating.com' },
    update: {},
    create: {
      name: 'System Administrator Account',
      email: 'admin@storerating.com',
      password: hashedPassword,
      address: '123 Admin Headquarters Building, Central Business District',
      role: 'ADMIN',
    },
  });

  const storeOwnerPassword = await bcrypt.hash('Owner@123', 12);

  const storeOwner = await prisma.user.upsert({
    where: { email: 'owner@storerating.com' },
    update: {},
    create: {
      name: 'Premium Store Owner Manager',
      email: 'owner@storerating.com',
      password: storeOwnerPassword,
      address: '456 Commerce Street, Downtown Shopping District Area',
      role: 'STORE_OWNER',
    },
  });

  const userPassword = await bcrypt.hash('User@1234', 12);

  const normalUser = await prisma.user.upsert({
    where: { email: 'user@storerating.com' },
    update: {},
    create: {
      name: 'Regular Customer User Account',
      email: 'user@storerating.com',
      password: userPassword,
      address: '789 Residential Avenue, Suburban Neighborhood Block',
      role: 'USER',
    },
  });

  const store = await prisma.store.upsert({
    where: { email: 'store@storerating.com' },
    update: {},
    create: {
      name: 'Premium Electronics Super Store',
      email: 'store@storerating.com',
      address: '100 Technology Boulevard, Innovation Park Complex',
      ownerId: storeOwner.id,
    },
  });

  await prisma.rating.upsert({
    where: {
      userId_storeId: {
        userId: normalUser.id,
        storeId: store.id,
      },
    },
    update: { rating: 4 },
    create: {
      userId: normalUser.id,
      storeId: store.id,
      rating: 4,
    },
  });

  console.log('Seed data created successfully:');
  console.log({ admin: admin.email, storeOwner: storeOwner.email, user: normalUser.email, store: store.name });
  console.log('\nDefault credentials:');
  console.log('Admin:       admin@storerating.com / Admin@123');
  console.log('Store Owner: owner@storerating.com / Owner@123');
  console.log('User:        user@storerating.com / User@1234');
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
