import { AuthProviderEnum, Prisma, PrismaClient, RolesEnum } from '@/generated/prisma';
import { DefaultArgs } from '@prisma/client/runtime/client';

export default async (prisma: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>) => {
  await prisma.$transaction(async (tx) => {
    await tx.$executeRawUnsafe(`TRUNCATE TABLE "User" RESTART IDENTITY CASCADE;`);
  
    await tx.user.createMany({
      data: [
        { 
          email: "portpolio.david99@gmail.com",
          password: "$2a$15$ygGbPlcO3BQsl1M29T5RUuTUKDrvY7zp4ny9X0Hc9js3qVZfMjF7K",
          email_verified: new Date(),
          role: RolesEnum.ADMIN,
          fullname: "David Simbolon",
          no_phone: "082110863133",
          gender: "Male",
          birth_date: new Date('1999-12-11'),
          birth_place: "Medan, Ranto Parapat",
          provider: AuthProviderEnum.CREDENTIAL,
          createdBy: "SEEDER"
        },
        { 
          email: "davidhedrin123@gmail.com",
          password: "$2a$15$ygGbPlcO3BQsl1M29T5RUuTUKDrvY7zp4ny9X0Hc9js3qVZfMjF7K",
          email_verified: new Date(),
          role: RolesEnum.CLIENT,
          fullname: "Jesika Marbun",
          no_phone: "082110863133",
          gender: "Female",
          birth_date: new Date('2000-04-03'),
          birth_place: "Tigaraksa, Tangerang Banten, Kab Tangerang.",
          provider: AuthProviderEnum.CREDENTIAL,
          createdBy: "SEEDER"
        },
      ]
    });
  });
  console.log('Multiple Users Created!');
};