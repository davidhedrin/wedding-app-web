import { Prisma, PrismaClient, RolesEnum } from '@/generated/prisma';
import { DefaultArgs } from '@prisma/client/runtime/client';

export default async (prisma: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>) => {
  await prisma.$transaction(async (tx) => {
    await tx.$executeRawUnsafe(`TRUNCATE TABLE "User" RESTART IDENTITY CASCADE;`);
  
    await tx.user.createMany({
      data: [
        {
          email: "jakartatrading.my@gmail.com",
          password: "$2a$15$ygGbPlcO3BQsl1M29T5RUuTUKDrvY7zp4ny9X0Hc9js3qVZfMjF7K",
          emailVerified: new Date(),
          role: RolesEnum.Admin,
          name: "David Simbolon",
          no_phone: "082110863133",
          gender: "Male",
          birth_date: new Date('1999-12-11'),
          birth_place: "Medan, Ranto Parapat",
          createdBy: "SEEDER"
        },
        {
          email: "portpolio.david99@gmail.com",
          password: "$2a$15$ygGbPlcO3BQsl1M29T5RUuTUKDrvY7zp4ny9X0Hc9js3qVZfMjF7K",
          emailVerified: new Date(),
          role: RolesEnum.Client,
          name: "Jesika Marbun",
          no_phone: "082110863133",
          gender: "Female",
          birth_date: new Date('1999-12-11'),
          birth_place: "Tigaraksa, Tangerang Banten, Kab Tangerang.",
          createdBy: "SEEDER"
        },
      ]
    });
  });
  console.log('Multiple Users Created!');
};