import { Prisma, PrismaClient } from "@prisma/client";

// SoftDelete
const extendedPrisma = new PrismaClient().$extends({
  query: {
    $allModels: {
      async findUnique({ model, args, query }: { model: Prisma.ModelName; args: Prisma.UserFindUniqueArgs; query: (args: any) => any }) {
        return query(softDeleteHandler(model, args));
      },
      async findFirst({ model, args, query }: { model: Prisma.ModelName; args: Prisma.UserFindFirstArgs; query: (args: any) => any }) {
        return query(softDeleteHandler(model, args));
      },
      async findMany({ model, args, query }: { model: Prisma.ModelName; args: Prisma.UserFindManyArgs; query: (args: any) => any }) {
        return query(softDeleteHandler(model, args));
      },
    },
  },
});
const softDeleteModels = ['User',];
function softDeleteHandler(model: string, args: any) {
  if (softDeleteModels.includes(model)) {
    if (!args.where) args.where = {};
    if (args.where.deletedAt === undefined) {
      args.where.deletedAt = null;
    }
  }
  return args;
};
// End SoftDelete

const globalForPrisma = global as unknown as {
  prisma: typeof extendedPrisma;
};
let prisma: typeof extendedPrisma;

if (!globalForPrisma.prisma) {
  prisma = extendedPrisma;
  globalForPrisma.prisma = prisma;
} else {
  prisma = globalForPrisma.prisma;
}

export const db = prisma;