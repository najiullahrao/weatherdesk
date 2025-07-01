import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.create({
    data: {
      email: 'test@example.com',
      name: 'Test User',
      subscriptionStatus: 'free',
      locations: {
        create: {
          city: 'New York',
          country: 'USA',
          isPrimary: true,
        },
      },
    },
    include: {
      locations: true,
    },
  });

  await prisma.weatherAlert.create({
    data: {
      userId: user.id,
      locationId: user.locations[0].id,
      condition: 'temperature',
      threshold: 30,
    },
  });

  console.log('Seed data created!');
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
