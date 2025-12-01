"use server";

import { AuthProviderEnum, Prisma, RolesEnum, User } from "@/generated/prisma";
import db from "../../prisma/db-init";
import { auth, signIn, signOut } from "@/app/api/auth/auth-setup";
import { generateOtp, hashPassword } from "@/lib/utils";
import { randomUUID } from "crypto";
import { EmailVerification } from "./email";
import { handlePrismaUniqueError } from "@/lib/prisma-handle-error";
import Configs from "@/lib/config";
import { DtoOtpVerify, DtoResetPassword, DtoSignIn, DtoSignUp } from "@/lib/dto";
import { DefaultArgs } from "@prisma/client/runtime/client";

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
  
    await db.$transaction(async (tx: Prisma.TransactionClient) => {
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
      const token = user.id + randomUUID().replace(/-/g, '');
      await tx.verificationToken.create({
        data: {
          userId: user.id,
          token,
          otp: otpCode
        }
      });
      await EmailVerification(email, token, otpCode);
    });
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
        usingAt: null
      }
    });

    if(!findData) throw new Error("Looks like something wrong with your url. The token may be incorrect or no longer valid.");
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export async function emailVerify(formData: DtoOtpVerify) {
  try {
    if(formData.token.toString().trim() === "") throw new Error("Looks like something wrong with your url. Click the link and try again!");
    if(formData.otp.toString().trim() === "" || formData.otp.toString().trim().length != 6) throw new Error("Invalid one-time-password (OTP). Try again or generate new OTP!");
    
    const findToken = await db.verificationToken.findUnique({
      where: {
        token: formData.token,
        otp: formData.otp,
        createAt: { gt: new Date(Date.now() - 1000 * 60 * Configs.valid_email_verify)},
        usingAt: null
      }
    });
    if(!findToken) throw new Error("The token or OTP may be incorrect or no longer valid.");

    await db.$transaction(async (tx: Prisma.TransactionClient) => {
      await tx.user.update({
        where: {
          id: findToken.userId
        },
        data: {
          email_verified: new Date()
        }
      });

      await tx.verificationToken.update({
        where: { token: formData.token, userId: findToken.userId },
        data: { usingAt: new Date() }
      });
    });
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export async function resendEmailVerify(token: string) {
  try {
    if(token.toString().trim() === "") throw new Error("Looks like something wrong with your url. Click the link and try again!");
    
    const findToken = await db.verificationToken.findUnique({
      where: { token },
      select: { userId: true, createAt: true }
    });
    if(!findToken) throw new Error("The token or OTP may be incorrect or no longer valid.");
    if (findToken.createAt) {
      const timeDifference = new Date().getTime() - new Date(findToken.createAt).getTime();
      if (timeDifference < 1000 * 60 * Configs.valid_email_verify) throw new Error("An email has already been sent. Please wait a minutes before requesting again.");
    };

    const findUser = await db.user.findUnique({
      where: {
        id: findToken.userId
      }
    });
    if(!findUser) throw new Error("We couldn't find an account data!");
    
    const otpCode = generateOtp(6);
    await db.verificationToken.update({
      where: { userId: findToken.userId },
      data: {
        token,
        createAt: new Date(),
        otp: otpCode
      }
    });

    await EmailVerification(findUser.email, token, otpCode);
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export async function checkTokenResetPass(token: string) {
  try {
    const findData = await db.passwordResetToken.findUnique({
      where: { 
        token,
        createAt: { gt: new Date(Date.now() - 1000 * 60 * Configs.valid_reset_pass)},
        usingAt: null
      }
    });

    if(!findData) throw new Error("Looks like something wrong with your url. The token may be incorrect or no longer valid.");
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export async function resetPassword(formData: DtoResetPassword) {
  try {
    if(formData.token === undefined || formData.token.toString().trim() === "") throw new Error("Looks like something wrong with your url. Click the link and try again!");

    const findToken = await db.passwordResetToken.findUnique({
      where: {
        token: formData.token,
        createAt: { gt: new Date(Date.now() - 1000 * 60 * Configs.valid_reset_pass)},
        usingAt: null
      }
    });
    if(!findToken) throw new Error("We couldn't verify. The token may be incorrect or no longer valid.");

    const hashPass = await hashPassword(formData.password, 15);
    await db.$transaction(async (tx: Prisma.TransactionClient) => {
      await tx.user.update({
        where: {
          id: findToken.userId
        },
        data: {
          password: hashPass
        }
      });
  
      await tx.passwordResetToken.update({
        where: {
          id: findToken.id,
          token: formData.token
        },
        data: {
          usingAt: new Date()
        }
      });
    });
  } catch (error: any) {
    throw new Error(error.message);
  }
};