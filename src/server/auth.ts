"use server";

import { Prisma, User } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";
import { db } from "../../prisma/db-init";

type GetUserByIdParams = {
  id: number,
  select?: Prisma.UserSelect<DefaultArgs> | undefined;
}
export async function getUserById(params: GetUserByIdParams): Promise<User | null> {
  const { id, select } = params;
  const findData = await db.user.findUnique({ 
    where: { id },
    select: {
      ...select,
    }
  });
  return findData;
};