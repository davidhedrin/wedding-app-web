"use client";

import { useLoading } from "@/components/loading/loading-context";
import LoadingUI from "@/components/loading/loading-ui";
import Input from "@/components/ui/input";
import { ZodErrors } from "@/components/zod-errors";
import { FormState } from "@/lib/model-types";
import { useSmartLink } from "@/lib/smart-link";
import { toast } from "@/lib/utils";
import { checkTokenResetPass, resetPassword } from "@/server/auth";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import z from "zod";

export default function Page() {
  const smartLink = useSmartLink();
  const { setLoading } = useLoading();
  const { push } = useRouter();

  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [shouldRender, setShouldRender] = useState(false);
  const checkingToken = async (token: string) => {
    try {
      await checkTokenResetPass(token);
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

  const [password, setPassword] = useState('');
  const [coPassword, setCoPassword] = useState('');
  const [toggle_pass, setTogglePass] = useState(false);
  const [toggle_copass, setToggleCoPass] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  const [stateForm, setStateForm] = useState<FormState>({ success: false, errors: {} });
  const FormSchemaChangePass = z.object({
    password: z
      .string()
      .min(8, { message: 'Be at least 8 characters long' })
      .regex(/[a-zA-Z]/, { message: 'Contain at least one letter.' })
      .regex(/[0-9]/, { message: 'Contain at least one number.' })
      .regex(/[^a-zA-Z0-9]/, {
        message: 'Contain at least one special character.',
      })
      .trim(),
    co_password: z
      .string()
      .min(8, { message: 'Be at least 8 characters long' })
      .regex(/[a-zA-Z]/, { message: 'Contain at least one letter.' })
      .regex(/[0-9]/, { message: 'Contain at least one number.' })
      .regex(/[^a-zA-Z0-9]/, {
        message: 'Contain at least one special character.',
      })
      .trim()
  }).refine((data) => data.password === data.co_password, {
    message: "Confirmation password don't match",
    path: ["co_password"]
  });

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
        await resetPassword({token,password});

        toast({
          type: "success",
          title: "Password Changed",
          message: "Your password has been change successfully. Thank's"
        });
        setLoading(true);
        push("/auth");
      } catch (error: any) {
        toast({
          type: "warning",
          title: "Resend Failed!",
          message: error.message
        });
      }
      setLoadingSubmit(false);
    }, 100);
  };

  if (!shouldRender) return (<LoadingUI />);
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-4 bg-muted px-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-4">
        <div className="flex items-center gap-2 self-center font-medium mb-1">
          <a href="/" onClick={() => smartLink("/")}>
            <img src="/assets/img/logo/wedlyvite-basic.png" className="h-17.5 w-auto" />
          </a>
        </div>

        <form action={(formData) => handleSubmitForm(formData)} className="grid gap-4 p-4 sm:p-6 bg-white border border-gray-200 rounded-xl shadow-2xs">
          <div className="text-center mb-2">
            <div className="block text-xl font-bold text-gray-800">Reset your Password</div>
            <p className="mt-1 text-sm text-gray-600">
              Please fill out the form below to change your new password!
            </p>
          </div>

          <div className="relative w-full">
            <div>
              <Input value={password} onChange={(e) => setPassword(e.target.value)} type={toggle_pass ? "text" : "password"} label='Password' placeholder='Enter new password' id='password' />
              {stateForm.errors?.password && <ZodErrors err={stateForm.errors?.password} />}
            </div>
            <div
              className="absolute right-2 top-8.5 text-muted-foreground hover:text-foreground cursor-pointer"
              onClick={() => setTogglePass((prev) => !prev)}
              tabIndex={-1}
            >
              {toggle_pass ? <i className='bx bx-show text-xl text-muted' ></i> : <i className='bx bx-hide text-xl text-muted'></i>}
            </div>
          </div>
          <div className="relative w-full">
            <div>
              <Input value={coPassword} onChange={(e) => setCoPassword(e.target.value)} type={toggle_copass ? "text" : "password"} label='Confirm Password' placeholder='Confirm new password' id='co_password' />
              {stateForm.errors?.co_password && <ZodErrors err={stateForm.errors?.co_password} />}
            </div>
            <div
              className="absolute right-2 top-8.5 text-muted-foreground hover:text-foreground cursor-pointer"
              onClick={() => setToggleCoPass((prev) => !prev)}
              tabIndex={-1}
            >
              {toggle_copass ? <i className='bx bx-show text-xl text-muted' ></i> : <i className='bx bx-hide text-xl text-muted'></i>}
            </div>
          </div>

          <button disabled={loadingSubmit} type="submit" className="w-full py-2 px-3 mt-2 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent btn-color-app">
            {loadingSubmit ? "Changing..." : "Reset Password"}
          </button>

          <p className="flex gap-1 justify-center text-sm text-gray-600">
            <i className='bx bx-left-arrow-alt text-lg'></i> <a href={"/auth"} onClick={() => smartLink("/auth")} className="underline underline-offset-4 cursor-pointer">
              Back to Login
            </a>
          </p>
        </form>

        <div className="text-balance text-center text-xs text-muted [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary  ">
          By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "} and <a href="#">Privacy Policy</a>.
        </div>
      </div>
    </div>
  )
}
