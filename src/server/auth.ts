"use server";

import { AuthProviderEnum, Prisma, RolesEnum, User } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";
import { db } from "../../prisma/db-init";
import { signIn, signOut } from "@/app/api/auth/auth-setup";
import { generateOtp, hashPassword } from "@/lib/utils";
import { randomUUID } from "crypto";
import { EmailVerification } from "./email";
import { handlePrismaUniqueError } from "@/lib/prisma-handle-error";
import Configs from "@/lib/config";
import { DtoSignIn, DtoSignUp } from "@/lib/dto";

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

export async function signInCredential(formData: DtoSignIn) {
  const dataSign = {
    redirect: false,
    email: formData.email,
    password: formData.password,
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

export async function signUpAction(formData: DtoSignUp) {
  try {
    const fullname = formData.fullname;
    const email = formData.email;
    const password = formData.password;
    const hashPass = await hashPassword(password, 15);
  
    await db.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          fullname,
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

      await EmailVerification(email, token, otpCode);
    });
    await signInCredential({email, password});
  } catch (error: any) {
    const uniqueErr = handlePrismaUniqueError(error, {
      email: 'This email is already registered.',
    });
    if (uniqueErr) throw new Error(uniqueErr);
    
    throw new Error(error.message);
  }
};

export async function checkTokenEmail(token: string) {
  try {
    const findData = await db.verificationToken.findUnique({
      where: { 
        token,
        createAt: { gt: new Date(Date.now() - 1000 * 60 * Configs.valid_email_verify)},
        usingAt: null
      }
    });

    if(!findData) throw new Error("Looks like something wrong with your url. The token may be incorrect or no longer valid.");
  } catch (error: any) {
    throw new Error(error.message);
  }
};