"use client";

import { useLoading } from "@/components/loading/loading-context";
import Input from "@/components/ui/input";
import { ZodErrors } from "@/components/zod-errors";
import { FormState } from "@/lib/model-types";
import { toast } from "@/lib/utils";
import { signInCredential } from "@/server/auth";
import { getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import z from "zod";

export default function SignIn({ setSigninSignup }: { setSigninSignup: React.Dispatch<React.SetStateAction<number>> }) {
  const { push } = useRouter();
  const { setLoading } = useLoading();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [toggle_pass, setTogglePass] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  const [stateForm, setStateForm] = useState<FormState>({ success: false, errors: {} });
  const FormSchemaSignIn = z.object({
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
        await signInCredential({ email, password });
        await getSession();

        setLoading(true);
        push("/client/dashboard");
        toast({
          type: "success",
          title: "Login successfully",
          message: `Welcome back ${email}`
        });
      } catch (error: any) {
        if (error?.name == "Email Not Verify") {
          push(`/auth/email-verify?token=${error?.message}`);
          toast({
            type: "info",
            title: error?.name,
            message: "Please confirm your email address verification OTP"
          });
        } else toast({
          type: "warning",
          title: "Login failed!",
          message: error?.message || "An unknown error occurred."
        });
      }
      setLoadingSubmit(false);
    }, 100)
  };

  return (
    <div className="p-4 sm:p-6 bg-white border border-gray-200 rounded-xl shadow-2xs">
      <div className="text-center">
        <div className="block text-xl font-bold text-gray-800">Sign-In</div>
        <p className="mt-1 text-sm text-gray-600">
          Don't have an account yet? <span onClick={() => setSigninSignup(2)} className="cursor-pointer text-blue-600 decoration-2 hover:underline focus:outline-hidden focus:underline font-medium">
            Sign up
          </span> now.
        </p>
      </div>

      <form action={(formData) => handleSubmit(formData)} className="grid gap-y-3 mt-4">
        <div>
          <Input value={email} onChange={(e) => setEmail(e.target.value)} type="text" label='Email' placeholder='Enter your email' id='email' />
          {stateForm.errors?.email && <ZodErrors err={stateForm.errors?.email} />}
        </div>
        <div className="relative w-full">
          <div>
            <Input value={password} onChange={(e) => setPassword(e.target.value)} type={toggle_pass ? "text" : "password"} label='Password' placeholder='Enter your password' id='password' />
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

        <div className="flex justify-between items-center py-0.5">
          <div className="flex">
            <input type="checkbox" className="shrink-0 border-gray-200 rounded-sm text-blue-600 focus:ring-blue-500 checked:border-blue-500 disabled:opacity-50 disabled:pointer-events-none" id="hs-default-checkbox" />
            <label htmlFor="hs-default-checkbox" className="text-sm text-gray-500 ms-2">Remember me</label>
          </div>
          <div onClick={() => setSigninSignup(3)} className="cursor-pointer text-sm text-gray-500 hover:underline hover:text-black">forgot passwor?</div>
        </div>

        <button disabled={loadingSubmit} type="submit" className="w-full py-2 px-3 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent btn-color-app">
          {loadingSubmit ? "Signing In..." : "Sign in"}
        </button>
      </form>

      <div className="py-3 flex items-center text-xs text-gray-400 uppercase before:flex-1 before:border-t before:border-gray-200 before:me-6 after:flex-1 after:border-t after:border-gray-200 after:ms-6">Or</div>
      <button type="button" className="w-full py-2 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-300 bg-white text-gray-800 shadow-2xs hover:bg-gray-50 focus:outline-hidden focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none">
        <svg className="w-4 h-auto" width="46" height="47" viewBox="0 0 46 47" fill="none">
          <path d="M46 24.0287C46 22.09 45.8533 20.68 45.5013 19.2112H23.4694V27.9356H36.4069C36.1429 30.1094 34.7347 33.37 31.5957 35.5731L31.5663 35.8669L38.5191 41.2719L38.9885 41.3306C43.4477 37.2181 46 31.1669 46 24.0287Z" fill="#4285F4" />
          <path d="M23.4694 47C29.8061 47 35.1161 44.9144 39.0179 41.3012L31.625 35.5437C29.6301 36.9244 26.9898 37.8937 23.4987 37.8937C17.2793 37.8937 12.0281 33.7812 10.1505 28.1412L9.88649 28.1706L2.61097 33.7812L2.52296 34.0456C6.36608 41.7125 14.287 47 23.4694 47Z" fill="#34A853" />
          <path d="M10.1212 28.1413C9.62245 26.6725 9.32908 25.1156 9.32908 23.5C9.32908 21.8844 9.62245 20.3275 10.0918 18.8588V18.5356L2.75765 12.8369L2.52296 12.9544C0.909439 16.1269 0 19.7106 0 23.5C0 27.2894 0.909439 30.8731 2.49362 34.0456L10.1212 28.1413Z" fill="#FBBC05" />
          <path d="M23.4694 9.07688C27.8699 9.07688 30.8622 10.9863 32.5344 12.5725L39.1645 6.11C35.0867 2.32063 29.8061 0 23.4694 0C14.287 0 6.36607 5.2875 2.49362 12.9544L10.0918 18.8588C11.9987 13.1894 17.25 9.07688 23.4694 9.07688Z" fill="#EB4335" />
        </svg>
        Sign in with Google
      </button>
    </div>
  )
}
