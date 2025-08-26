"use server";

import { CommonParams, PaginateResult } from "@/lib/model-types";
import { Prisma, User } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";
import { db } from "../../../prisma/db-init";

type GetDataUserParams = {
  where?: Prisma.UserWhereInput;
  orderBy?: Prisma.UserOrderByWithRelationInput | Prisma.UserOrderByWithRelationInput[];
  select?: Prisma.UserSelect<DefaultArgs> | undefined;
} & CommonParams;
export async function GetDataUser(params: GetDataUserParams): Promise<PaginateResult<User>> {
  const { curPage = 1, perPage = 10, where = {}, orderBy = {}, select } = params;
  const skip = (curPage - 1) * perPage;
  const [data, total] = await Promise.all([
    db.user.findMany({
      skip,
      take: perPage,
      where,
      orderBy,
      select
    }),
    db.user.count({ where })
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