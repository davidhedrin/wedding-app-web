"use server";

import { Prisma, Vouchers } from "@/generated/prisma";
import { CommonParams, PaginateResult } from "@/lib/model-types";
import { DefaultArgs } from "@prisma/client/runtime/client";
import { db } from "../../../prisma/db-init";
import { auth } from "@/app/api/auth/auth-setup";
import { DtoVouchers } from "@/lib/dto";
import { stringWithTimestamp } from "@/lib/utils";

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

export async function StoreUpdateDataVouchers(formData: DtoVouchers) {
  try {
    const session = await auth();
    if(!session) throw new Error("Authentication credential not Found!");
    const { user } = session;

    const data_id = formData.id ?? 0;
    await db.vouchers.upsert({
      where: { id: data_id },
      update: {
        disc_type: formData.disc_type,
        disc_amount: formData.disc_amount,
        valid_from: new Date(formData.valid_from),
        valid_to: new Date(formData.valid_to),
        total_qty: formData.total_qty,
        is_one_use: formData.is_one_use,
        desc: formData.desc,
        is_active: formData.is_active,
        updatedBy: user?.email
      },
      create: {
        slug: stringWithTimestamp(5),
        code: formData.code,
        disc_type: formData.disc_type,
        disc_amount: formData.disc_amount,
        valid_from: new Date(formData.valid_from),
        valid_to: new Date(formData.valid_to),
        total_qty: formData.total_qty,
        is_one_use: formData.is_one_use,
        desc: formData.desc,
        is_active: formData.is_active,
        createdBy: user?.email
      }
    });
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export async function GetDataVouchersById(id: number): Promise<Vouchers | null> {
  const getData = await db.vouchers.findUnique({
    where: { id }
  });
  return getData;
};

export async function DeleteDataVouchers(id: number) {
  try {
    const session = await auth();
    if(!session) throw new Error("Authentication credential not Found!");
    const { user } = session;
    
    await db.vouchers.delete({
      where: { id }
    });
  } catch (error: any) {
    throw new Error(error.message);
  }
};