"use server";

import { Resend } from 'resend';
import Configs from "@/lib/config";
import { db } from '../../prisma/db-init';
import { randomUUID } from 'crypto';
import EmailVerifyTemplate from '@/components/email/email-verify';
import ResetPasswordTemplate from '@/components/email/reset-password';

const resend = new Resend(process.env.RESEND_API_KEY);
const baseUrl = Configs.base_url;
const appName = Configs.app_name;

export async function EmailVerification(email: string, token: string, otpCode: string) {
  try{
    if(!resend) throw new Error("Resend api key not found!");
    
    const { data, error } = await resend.emails.send({
      from: `${appName} <${Configs.resend_from}>`,
      to: [email.toString()],
      subject: 'Email Verification',
      react: EmailVerifyTemplate({
        url: `${baseUrl}/auth/email-verify?token=${token}`,
        otp: otpCode,
      }),
    });

    if (error) {
      console.log("😡Email1:", error);
      throw new Error(error.message);
    }

    console.log("😁Email:", {
      message: "Email verification send successfuly.",
      ...data
    });
  } catch (error: any) {
    console.log("😡Email2:", error);
    throw error;
  }
};

export async function EmailForgotPassword(email: string) {
  try {
    if(!resend) throw new Error("Resend api key not found!");

    const findEmail = await db.user.findUnique({
      where: {
        email: email,
        is_active: true,
        email_verified: {
          not: null
        }
      }
    });
    if(!findEmail) throw new Error(`Sorry, but the email is not registration on ${appName}`);

    const findExistToken = await db.passwordResetToken.findFirst({
      where: { userId: findEmail.id, usingAt: null },
      orderBy: {
        createAt: 'desc'
      },
      select: {createAt: true }
    });
    if (findExistToken && findExistToken.createAt) {
      const timeDifference = new Date().getTime() - new Date(findExistToken.createAt).getTime();
      if (timeDifference < 1000 * 60 * Configs.valid_reset_pass) throw new Error("An email has already been sent. Please wait a minutes before requesting again.");
    };

    await db.$transaction(async (tx) => {
      await tx.passwordResetToken.updateMany({
        data: { usingAt: new Date() }
      });

      const token = findEmail.id + randomUUID().replace(/-/g, '');
      await tx.passwordResetToken.create({
        data: {
          userId: findEmail.id,
          token,
        }
      });
      
      const { data, error } = await resend.emails.send({
        from: `${appName} <${Configs.resend_from}>`,
        to: [email.toString()],
        subject: 'Password Reset',
        react: ResetPasswordTemplate({
          url: `${baseUrl}/auth/reset-password?token=${token}`
        }),
      });
  
      if (error) {
        console.log("😡Email1:", error);
        throw new Error(error.message);
      };

      console.log("😁Email:", {
        message: "Email password reset send successfuly.",
        ...data
      });
    });
  } catch (error: any) {
    console.log("😡Email2:", error);
    throw error;
  }
};