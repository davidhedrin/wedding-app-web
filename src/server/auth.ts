"use server";

import { AuthProviderEnum, Prisma, RolesEnum, User } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";
import { db } from "../../prisma/db-init";
import { signIn, signOut } from "@/app/api/auth/auth-setup";
import { generateOtp, hashPassword } from "@/lib/utils";
import { randomUUID } from "crypto";
import { EmailVerification } from "./email";
import { handlePrismaUniqueError } from "@/lib/prisma-handle-error";

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

export async function signUpAction(formData: FormData) {
  try {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const hashPass = await hashPassword(password, 15);
  
    await db.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email,
          password: hashPass,
          is_active: true,
          createdBy: email,
          provider: AuthProviderEnum.CREDENTIAL,
          role: RolesEnum.CLIENT
        }
      });
      
      const otpCode = generateOtp(6);
      const token = user.id + `${randomUUID()}${randomUUID()}`.replace(/-/g, '');
      await tx.verificationToken.create({
        data: {
          userId: user.id,
          token,
          otp: otpCode
        }
      });

      await EmailVerification(user.email, token, otpCode);
    });
  } catch (error: any) {
    const uniqueErr = handlePrismaUniqueError(error, {
      email: 'This email is already registered.',
    });
    if (uniqueErr) throw new Error(uniqueErr);
    
    throw new Error(error.message);
  }
};