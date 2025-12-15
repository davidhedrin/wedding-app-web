"use server";

import { Prisma, Vouchers } from "@/generated/prisma";
import { CommonParams, PaginateResult } from "@/lib/model-types";
import { DefaultArgs } from "@prisma/client/runtime/client";
import { db } from "../../../prisma/db-init";

type GetDataVouchersParams = {
  where?: Prisma.VouchersWhereInput;
  orderBy?: Prisma.VouchersOrderByWithRelationInput | Prisma.VouchersOrderByWithRelationInput[];
  select?: Prisma.VouchersSelect<DefaultArgs> | undefined;
} & CommonParams;
export async function GetDataVouchers(params: GetDataVouchersParams): Promise<PaginateResult<Vouchers>> {
  const { curPage = 1, perPage = 10, where = {}, orderBy = {}, select } = params;
  const skip = (curPage - 1) * perPage;
  const [data, total] = await Promise.all([
    db.vouchers.findMany({
      skip,
      take: perPage,
      where,
      orderBy,
      select
    }),
    db.vouchers.count({ where })
  ]);

  return {
    data,
    meta: {
      page: curPage,
      limit: perPage,
      total,
      totalPages: Math.ceil(total/perPage)
    }
  };
};