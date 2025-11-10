"use server";

import { CommonParams, PaginateResult } from "@/lib/model-types";
import { Prisma, Events, Templates, TemplateCaptures } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";
import { db } from "../../prisma/db-init";
import { DtoEvents } from "@/lib/dto";
import { auth } from "@/app/api/auth/auth-setup";
import { stringWithTimestamp } from "@/lib/utils";
import { number } from "zod";

type GetDataEventsParams = {
  where?: Prisma.EventsWhereInput;
  orderBy?: Prisma.EventsOrderByWithRelationInput | Prisma.EventsOrderByWithRelationInput[];
  select?: Prisma.EventsSelect<DefaultArgs> | undefined;
} & CommonParams;
export async function GetDataEvents(params: GetDataEventsParams): Promise<PaginateResult<Events & {
  template: (Templates & { captures?: TemplateCaptures[] | null }) | null
}>> {
  const { curPage = 1, perPage = 10, where = {}, orderBy = {}, select } = params;
  const skip = (curPage - 1) * perPage;
  const [data, total] = await Promise.all([
    db.events.findMany({
      skip,
      take: perPage,
      where,
      orderBy,
      select: {
        ...select,
        template: select?.template
      }
    }),
    db.events.count({ where })
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
  
  // const { curPage = 1, perPage = 10, where = {}, orderBy = {}, select } = params;
  // const skip = (curPage - 1) * perPage;

  // const finalSelect: Prisma.EventsSelect = {
  //   ...(select || {}),
  // };

  // if (select?.template) {
  //   const userTemplateSelect =
  //     typeof select.template === "object" && "select" in select.template ? select.template.select : {};

  //   finalSelect.template = {
  //     select: {
  //       ...userTemplateSelect,
  //       captures: {
  //         take: 1,
  //         orderBy: { index: "asc" },
  //         select: { file_path: true },
  //       },
  //     },
  //   };
  // }

  // const [data, total] = await Promise.all([
  //   db.events.findMany({
  //     skip,
  //     take: perPage,
  //     where,
  //     orderBy,
  //     select: finalSelect,
  //   }),
  //   db.events.count({ where }),
  // ]);

  // return {
  //   data,
  //   meta: {
  //     page: curPage,
  //     limit: perPage,
  //     total,
  //     totalPages: Math.ceil(total / perPage),
  //   },
  // };
};

export async function StoreUpdateDataEvents(formData: DtoEvents): Promise<string | null> {
  try {
    const session = await auth();
    if(!session) throw new Error("Authentication credential not Found!");
    const { user } = session;

    const data_id = formData.id ?? 0;
    
    const action = await db.events.upsert({
      where: { id: data_id },
      create: {
        user_id: Number(user?.id),
        tmp_status: formData.tmp_status,

        tmp_id: formData.tmp_id,
        tmp_code: stringWithTimestamp.v2(15, true, formData.tmp_ctg_key.toUpperCase()),
        tmp_ctg: formData.tmp_ctg,
        tmp_ctg_key: formData.tmp_ctg_key,
        createdBy: user?.email
      },
      update: {
        tmp_id: formData.tmp_id,
        tmp_status: formData.tmp_status,
        tmp_ctg: formData.tmp_ctg,
        tmp_ctg_key: formData.tmp_ctg_key,
        updatedBy: user?.email
      }
    });

    return action.tmp_code;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export async function GetDataEventByCode(code: string): Promise<Events & { template: Templates & { captures: { file_path: string }[] | null } | null } | null> {
  const getData = await db.events.findUnique({
    where: { tmp_code: code },
    include: {
      template: {
        include: {
          captures: {
            take: 1,
            orderBy: { index: "asc" },
            select: { file_path: true },
          }
        }
      }
    }
  });
  return getData;
};