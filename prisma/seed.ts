import { PrismaClient } from '@/generated/prisma';
const prisma = new PrismaClient();

import usersSeeder from "./seeds/user-seeder";
import templateSeeder from "./seeds/template-seeder";

async function main(){
  await usersSeeder(prisma);
  await templateSeeder(prisma);

  console.log('Seeding finished.');
};

main().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
}).finally(async () => {
  await prisma.$disconnect();
});