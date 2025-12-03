import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const prisma = new PrismaClient({
  adapter: new PrismaPg({
    connectionString: process.env.DATABASE_URL,
  }),
});

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