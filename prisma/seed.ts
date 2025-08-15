import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

import usersSeeder from "./seeds/user-seeder";

async function main(){
  await usersSeeder(prisma);

  console.log('Seeding finished.');
};

main().then(async () => {
  await prisma.$disconnect();
}).catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});