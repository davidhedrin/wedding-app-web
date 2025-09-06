"use client";

import { useLoading } from '@/components/loading/loading-context';
import LoadingUI from '@/components/loading/loading-ui';
import InputOtp from '@/components/ui/input-otp';
import { ZodErrors } from '@/components/zod-errors';
import { FormState } from '@/lib/model-types';
import { useSmartLink } from '@/lib/smart-link';
import { toast } from '@/lib/utils';
import { checkTokenEmail, emailVerify, resendEmailVerify } from '@/server/auth';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import z from 'zod';

export default function Page() {
  const smartLink = useSmartLink();
  const { setLoading } = useLoading();
  const { push } = useRouter();
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [shouldRender, setShouldRender] = useState(false);
  const checkingToken = async (token: string) => {
    try {
      await checkTokenEmail(token);
      setShouldRender(true);
    } catch (error: any) {
      toast({
        type: "warning",
        title: "Request Failed",
        message: error.message
      });
      push("/auth");
    }
  };
  useEffect(() => {
    if (!token || token.trim() === '') {
      toast({
        type: "warning",
        title: "Invalid Token",
        message: "Looks like something wrong with your url. Click the link and try again!"
      });
      push("/auth");
    } else {
      checkingToken(token);
    }
  }, [token]);

  const [txtOtpCode, setTxtOtpCode] = useState("");
  const [stateForm, setStateForm] = useState<FormState>({ success: false, errors: {} });
  const FormSchemaChangePass = z.object({
    otp_code: z
      .string()
      .min(6, { message: 'OTP must consist of 6 digits.' })
      .trim(),
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    formData.append("otp_code", txtOtpCode);
    handleSubmitForm(formData);
  };

  const handleSubmitForm = async (formData: FormData) => {
    const data = Object.fromEntries(formData);
    const valResult = FormSchemaChangePass.safeParse(data);
    if (!valResult.success) {
      setStateForm({
        success: false,
        errors: valResult.error.flatten().fieldErrors,
      });
      return;
    };
    setStateForm({ success: true, errors: {} });

    if (!token || token.trim() === '') {
      toast({
        type: "warning",
        title: "Invalid Token",
        message: "Looks like something wrong with your url. Click the link and try again!"
      });
      return;
    }

    setLoadingSubmit(true);
    setTimeout(async () => {
      try {
        await emailVerify({
          token,
          otp: txtOtpCode
        });

        setLoading(true);
        push("/auth");
        toast({
          type: "success",
          title: "Verified success",
          message: "Your account has been verified successfully."
        });
      } catch (error: any) {
        toast({
          type: "warning",
          title: "Verify Failed!",
          message: error.message
        });
      }
      setLoadingSubmit(false);
    }, 100);
  };

  const [loadingResend, setLoadingResend] = useState(false);
  const handleResendEmail = async () => {
    if (!token || token.trim() === '') {
      toast({
        type: "warning",
        title: "Invalid Token",
        message: "Looks like something wrong with your url. Click the link and try again!"
      });
      return;
    };

    setLoadingResend(true);
    try {
      await resendEmailVerify(token);
      toast({
        type: "success",
        title: "Email sent successfully",
        message: "A new verification email has been sent to your inbox for verify"
      });
    } catch (error: any) {
      toast({
        type: "warning",
        title: "Resend Failed!",
        message: error.message
      });
    }
    setLoadingResend(false);
  };

  if (!shouldRender) return (<LoadingUI />);
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-4 bg-muted px-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-4">
        <div className="flex items-center gap-2 self-center font-medium mb-1">
          <Link href="/" onClick={() => smartLink("/")}>
            <img src="/assets/img/logo/wedlyvite-basic.png" className="h-[70px] w-auto" />
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-4 p-4 sm:p-6 bg-white border border-gray-200 rounded-xl shadow-2xs">
          <div className="text-center mb-2">
            <div className="block text-xl font-bold text-gray-800">Verified your Email</div>
            <p className="mt-1 text-sm text-gray-600">
              Verify your email with the 6 digit verification code OTP belows.
            </p>
          </div>

          <div className="flex flex-col justify-center items-center gap-2">
            <InputOtp length={6} onChangeOtp={setTxtOtpCode} />
            {stateForm.errors?.otp_code && <ZodErrors err={stateForm.errors?.otp_code} />}
          </div>

          <button disabled={loadingSubmit} type="submit" className="w-full py-2 px-3 mt-2 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent btn-color-app">
            {loadingSubmit ? "Verifying..." : "Verified Now"}
          </button>

          <p className="text-center text-sm text-muted">
            Don't receive code. Click <button disabled={loadingResend} onClick={() => handleResendEmail()} type="button" className="inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg text-blue-600 hover:text-blue-800 focus:outline-hidden focus:text-blue-800 disabled:opacity-50 disabled:pointer-events-none">
              {loadingResend ? "Resending…" : "Resend OTP"}
            </button>
          </p>
        </form>

        <div className="text-balance text-center text-xs text-muted [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary  ">
          By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "} and <a href="#">Privacy Policy</a>.
        </div>
      </div>
    </div>
  )
}
