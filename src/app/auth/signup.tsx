"use client";

import { useLoading } from "@/components/loading/loading-context";
import Input from "@/components/ui/input";
import { ZodErrors } from "@/components/zod-errors";
import { FormState } from "@/lib/model-types";
import { toast } from "@/lib/utils";
import { signUpAction } from "@/server/auth";
import { getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import z from "zod";

export default function SignUp({ setSigninSignup }: { setSigninSignup: React.Dispatch<React.SetStateAction<number>> }) {
  const { push } = useRouter();
  const { setLoading } = useLoading();

  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [coPassword, setCoPassword] = useState('');
  const [toggle_pass, setTogglePass] = useState(false);
  const [toggle_copass, setToggleCoPass] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  const [stateForm, setStateForm] = useState<FormState>({ success: false, errors: {} });
  const FormSchemaSignUp = z.object({
    fullname: z
      .string()
      .min(2, { message: 'Name must be at least 2 characters long.' })
      .trim(),
    email: z.string().email({ message: 'Please enter a valid email.' }).trim(),
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

  const handleSubmit = async (formData: FormData) => {
    const data = Object.fromEntries(formData);
    const valResult = FormSchemaSignUp.safeParse(data);
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
        await signUpAction({ email, fullname, password });
        await getSession();

        setLoading(true);
        push("/auth/email-verify");
        toast({
          type: "success",
          title: "Register successfully",
          message: "A OTP code verification email has been sent to your inbox!"
        });
        setSigninSignup(1);
      } catch (error: any) {
        toast({
          type: "warning",
          title: "Registration Failed!",
          message: error.message || "An unknown error occurred."
        });
      }
      setLoadingSubmit(false);
    }, 100)
  };

  return (
    <div className="p-4 sm:p-6 bg-white border border-gray-200 rounded-xl shadow-2xs">
      <div className="text-center">
        <div className="block text-xl font-bold text-gray-800">Sign-Up</div>
        <p className="mt-1 text-sm text-gray-600">
          Let's get started with create an new account!
        </p>
      </div>

      <form action={(formData) => handleSubmit(formData)} className="grid gap-y-3 my-3">
        <div>
          <Input type="text" label='Fullname' placeholder='Ex. John Thor Doe' id='fullname' value={fullname} onChange={(e) => setFullname(e.target.value)} />
          {stateForm.errors?.fullname && <ZodErrors err={stateForm.errors?.fullname} />}
        </div>
        <div>
          <Input type="text" label='Email' placeholder='Enter your email' id='email' value={email} onChange={(e) => setEmail(e.target.value)} />
          {stateForm.errors?.email && <ZodErrors err={stateForm.errors?.email} />}
        </div>
        <div className="relative w-full">
          <div>
            <Input type={toggle_pass ? "text" : "password"} label='Password' placeholder='Enter your password' id='password' value={password} onChange={(e) => setPassword(e.target.value)} />
            {stateForm.errors?.password && <ZodErrors err={stateForm.errors?.password} />}
          </div>
          <div
            className="absolute right-2 top-[34px] text-muted-foreground hover:text-foreground cursor-pointer"
            onClick={() => setTogglePass((prev) => !prev)}
            tabIndex={-1}
          >
            {toggle_pass ? <i className='bx bx-show text-xl text-muted' ></i> : <i className='bx bx-hide text-xl text-muted'></i>}
          </div>
        </div>
        <div className="relative w-full">
          <div>
            <Input type={toggle_copass ? "text" : "password"} label='Confirm Password' placeholder='Enter confirm password' id='co_password' value={coPassword} onChange={(e) => setCoPassword(e.target.value)} />
            {stateForm.errors?.co_password && <ZodErrors err={stateForm.errors?.co_password} />}
          </div>
          <div
            className="absolute right-2 top-[34px] text-muted-foreground hover:text-foreground cursor-pointer"
            onClick={() => setToggleCoPass((prev) => !prev)}
            tabIndex={-1}
          >
            {toggle_copass ? <i className='bx bx-show text-xl text-muted' ></i> : <i className='bx bx-hide text-xl text-muted'></i>}
          </div>
        </div>

        <button disabled={loadingSubmit} type="submit" className="w-full py-2 px-3 mt-2 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent btn-color-app">
          {loadingSubmit ? "Submitting..." : "Register"}
        </button>
      </form>

      <p className="text-center text-sm text-gray-600">
        Already have an account? <span onClick={() => setSigninSignup(1)} className="cursor-pointer text-blue-600 decoration-2 hover:underline focus:outline-hidden focus:underline font-medium">
          Sign In
        </span> here.
      </p>
    </div>
  )
}
