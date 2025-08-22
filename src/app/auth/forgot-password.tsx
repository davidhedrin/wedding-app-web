"use client";

import { useLoading } from "@/components/loading/loading-context";
import Input from "@/components/ui/input";
import { ZodErrors } from "@/components/zod-errors";
import { FormState } from "@/lib/model-types";
import { toast } from "@/lib/utils";
import { EmailForgotPassword } from "@/server/email";
import { useRouter } from "next/navigation";
import { useState } from "react";
import z from "zod";

export default function ForgotPassword({ setSigninSignup }: { setSigninSignup: React.Dispatch<React.SetStateAction<number>> }) {
  const { push } = useRouter();
  const { setLoading } = useLoading();
  const [email, setEmail] = useState('');
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  const [stateForm, setStateForm] = useState<FormState>({ success: false, errors: {} });
  const FormSchemaSignIn = z.object({
    email: z.string().email({ message: 'Please enter a valid email.' }).trim(),
  });
  const handleSubmit = async (formData: FormData) => {
    const data = Object.fromEntries(formData);
    const valResult = FormSchemaSignIn.safeParse(data);
    if (!valResult.success) {
      setStateForm({
        success: false,
        errors: valResult.error.flatten().fieldErrors,
      });
      return;
    };
    setStateForm({ success: true, errors: {} });

    setLoadingSubmit(true);
    setTimeout(async () => {
      try {
        await EmailForgotPassword(email.trim());

        setLoading(true);
        push("/");
        toast({
          type: "success",
          title: "Check your Email",
          message: "We've send link reset password to your email"
        });
      } catch (error: any) {
        toast({
          type: "warning",
          title: "Failed send Email!",
          message: error.message
        });
      }
      setLoadingSubmit(false);
    }, 100);
  };

  return (
    <div className="p-4 sm:p-6 bg-white border border-gray-200 rounded-xl shadow-2xs">
      <div className="text-center">
        <div className="block text-xl font-bold text-gray-800">Forgot your Password?</div>
        <p className="mt-1 text-sm text-gray-600">
          Enter your email so that we can send your password reset link!
        </p>
      </div>

      <form action={(formData) => handleSubmit(formData)} className="grid gap-y-3 my-3">
        <div>
          <Input type="text" label='Email' placeholder='email@example.com' id='email' value={email} onChange={(e) => setEmail(e.target.value)} />
          {stateForm.errors?.email && <ZodErrors err={stateForm.errors?.email} />}
        </div>

        <button disabled={loadingSubmit} type="submit" className="w-full py-2 px-3 mt-2 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent btn-color-app">
          {loadingSubmit ? "Sending..." : "Send Email"}
        </button>
      </form>

      <p className="flex gap-1 justify-center text-sm text-gray-600">
        <i className='bx bx-left-arrow-alt text-lg'></i> <span onClick={() => setSigninSignup(1)} className="underline underline-offset-4 cursor-pointer">
          Back to Login
        </span>
      </p>
    </div>
  )
}
