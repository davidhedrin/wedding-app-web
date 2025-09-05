// lib/prisma/extensions/softDelete.ts
import { PrismaClient } from "@prisma/client";

type SoftDeleteOptions = {
  models: string[];
  field?: string;
  now?: () => Date;
};

export function softDeleteInit(opts: SoftDeleteOptions) {
  const field = opts.field ?? "deletedAt";
  const now = opts.now ?? (() => new Date());
  const softModels = new Set(opts.models);

  const extendedPrisma = new PrismaClient().$extends({
    query: {
      $allModels: {
        async $allOperations({ model, operation, args, query }) {
          if (!model || !softModels.has(model)) {
            return query(args);
          }

          const a = args as any;

          // --- Soft delete ---
          // if (operation === "delete") {
          //   return query({
          //     where: a.where,
          //     data: { [field]: now() },
          //   });
          // }

          // if (operation === "deleteMany") {
          //   return query({
          //     where: a.where,
          //     data: { [field]: now() },
          //   });
          // }

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
            if (where[field] === undefined) {
              a.where = { ...where, [field]: null };
            }
            return query(a);
          }

          if (operation === "findUnique") {
            const where = a.where ?? {};
            const hasField = Object.prototype.hasOwnProperty.call(where, field);
            a.where = hasField ? where : { ...where, [field]: null };
            return query(a);
          }

          return query(args);
        },
      },
    },
  });

  return extendedPrisma;
};