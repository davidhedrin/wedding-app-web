"use server";

import { CommonParams, PaginateResult } from "@/lib/model-types";
import { Prisma, Templates } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";
import { db } from "../../../prisma/db-init";

type GetDataTemplatesParams = {
  where?: Prisma.TemplatesWhereInput;
  orderBy?: Prisma.TemplatesOrderByWithRelationInput | Prisma.TemplatesOrderByWithRelationInput[];
  select?: Prisma.TemplatesSelect<DefaultArgs> | undefined;
} & CommonParams;
export async function GetDataTemplates(params: GetDataTemplatesParams): Promise<PaginateResult<Templates>> {
  const { curPage = 1, perPage = 10, where = {}, orderBy = {}, select } = params;
  const skip = (curPage - 1) * perPage;
  const [data, total] = await Promise.all([
    db.templates.findMany({
      skip,
      take: perPage,
      where,
      orderBy,
      select
    }),
    db.templates.count({ where })
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