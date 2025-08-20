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

export async function EmailVerification(email: string, otpCode?: string) {
  try{
    if(!resend) throw new Error("Resend api key not found!");

    if(otpCode == undefined || otpCode == null){
      otpCode = generateOtp(6);
      const findEmail = await db.user.findUnique({
        where: {
          email: email,
          is_active: true
        }
      });
      if(!findEmail) throw new Error(`Sorry, but the email is not registration yet`);
  
      const findExistToken = await db.verificationToken.findUnique({
        where: { userId: findEmail.id }
      });
      
      if (findExistToken) {
        if (findExistToken.createAt) {
          const timeDifference = new Date().getTime() - new Date(findExistToken.createAt).getTime();
          if (timeDifference < 1000 * 60 * Configs.valid_email_verify) throw new Error("An email has already been sent. Please wait a minutes before requesting again.");
        };
        
        await db.verificationToken.update({
          where: { userId: findEmail.id },
          data: {
            createAt: new Date(),
            otp: otpCode
          }
        });
      } else await db.verificationToken.create({
        data: {
          userId: findEmail.id,
          otp: otpCode
        }
      });
    };
    
    const { data, error } = await resend.emails.send({
      from: `${appName} <${Configs.resend_from}>`,
      to: [email.toString()],
      subject: 'Email Verification',
      react: EmailVerifyTemplate({
        url: `${baseUrl}/auth/email-verify`,
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