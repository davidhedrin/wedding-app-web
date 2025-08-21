"use server";

import { AuthProviderEnum, Prisma, RolesEnum, User } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";
import { db } from "../../prisma/db-init";
import { auth, signIn, signOut } from "@/app/api/auth/auth-setup";
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
  await signOut({redirect: true, redirectTo: "/auth"});
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
      await tx.verificationToken.create({
        data: {
          userId: user.id,
          otp: otpCode
        }
      });
      await EmailVerification(email, otpCode);
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

export async function emailVerify(otp: string) {
  try {
    const session = await auth();
    if(!session) throw new Error("Authentication credential not Found!");
    const { user } = session;
    
    const findToken = await db.verificationToken.findUnique({
      where: {
        otp,
        userId: Number(user?.id),
        createAt: { gt: new Date(Date.now() - 1000 * 60 * Configs.valid_email_verify)},
        usingAt: null
      }
    });
    if(!findToken) throw new Error("The token or OTP may be incorrect or no longer valid.");

    await db.$transaction(async (tx) => {
      await tx.user.update({
        where: {
          id: findToken.userId
        },
        data: {
          email_verified: new Date()
        }
      });

      await tx.verificationToken.update({
        where: { userId: findToken.userId },
        data: { usingAt: new Date() }
      });
    });
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export async function resendEmailVerify() {
  try {
    const session = await auth();
    if(!session) throw new Error("Authentication credential not Found!");
    const { user } = session;

    const findUser = await db.user.findUnique({
      where: {
        id:  Number(user?.id)
      }
    });
    if(!findUser) throw new Error("We couldn't find an account data!");
    
    await EmailVerification(findUser.email);
  } catch (error: any) {
    throw new Error(error.message);
  }
}