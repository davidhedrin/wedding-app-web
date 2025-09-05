import { PrismaClient } from "@prisma/client";

// Soft Delete
const softModels = ['User', 'Templates'];
const extendedPrisma = new PrismaClient().$extends({
  query: {
    $allModels: {
      async $allOperations({ model, operation, args, query }) {
        if (!model || !softModels.includes(model)) return query(args);
        const a = args as any;

        // --- Query filter default (hanya ambil deletedAt = null) ---
        const opsNeedingWhere = [
          "findMany",
          "findFirst",
          "count",
          "aggregate",
          "groupBy",
        ];

        if (opsNeedingWhere.includes(operation)) {
          const where = a.where ?? {};
          if (where.deletedAt === undefined) {
            a.where = { ...where, deletedAt: null };
          }
          return query(a);
        }

        if (operation === "findUnique") {
          const where = a.where ?? {};
          const hasField = Object.prototype.hasOwnProperty.call(where, "deletedAt");
          a.where = hasField ? where : { ...where, deletedAt: null };
          return query(a);
        }

        return query(args);
      },
    },
  },
});
// End Soft Delete

const globalForPrisma = global as unknown as { prisma: typeof extendedPrisma };
let prisma: typeof extendedPrisma;

if(!globalForPrisma.prisma) {
  prisma = extendedPrisma;
  globalForPrisma.prisma = prisma;
}else{
  prisma = globalForPrisma.prisma;
};

export const db = prisma;