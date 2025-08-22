"use server";

import { Resend } from 'resend';
import Configs from "@/lib/config";
import { generateOtp } from '@/lib/utils';
import { db } from '../../prisma/db-init';
import { randomUUID } from 'crypto';
import EmailVerifyTemplate from '@/components/email/email-verify';

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
    throw new Error(error.message);
  }
}