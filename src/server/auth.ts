"use server";

import { Prisma, User } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";
import { db } from "../../prisma/db-init";
import { signIn, signOut } from "@/app/api/auth/auth-setup";

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

export async function signInCredential(formData: FormData) {
  const data = Object.fromEntries(formData);
  const email = data.email as string;
  const password = data.password as string;
  const dataSign = {
    redirect: false,
    email,
    password,
  };
  
  try {
    await signIn('credentials', dataSign);
  } catch (err: any) {
    if (err.type === "AuthError") throw err;
    throw new Error("Unexpected error during sign-in.");
  }
};

export async function signOutAuth() {
  await signOut({redirectTo: "/auth"});
};