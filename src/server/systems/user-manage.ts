"use server";

import { CommonParams, PaginateResult } from "@/lib/model-types";
import { Prisma, User } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";
import { db } from "../../../prisma/db-init";
import { auth } from "@/app/api/auth/auth-setup";
import { DtoUser } from "@/lib/dto";

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

export async function StoreUpdateDataProductCategory(formData: DtoUser) {
  try {
    const session = await auth();
    if(!session) throw new Error("Authentication credential not Found!");
    const { user } = session;

    const data_id = formData.id ?? 0;
    await db.user.upsert({
      where: { id: data_id },
      update: {
        fullname: formData.fullname,
        is_active: formData.is_active,
        updatedBy: user?.email
      },
      create: {
        email: formData.email,
        password: "",
        role: formData.role,
        fullname: formData.fullname,
        provider: "CREDENTIAL",
        is_active: formData.is_active,
        createdBy: user?.email
      }
    });
  } catch (error: any) {
    throw new Error(error.message);
  }
};