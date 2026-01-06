"use client";

import { useLoading } from "@/components/loading/loading-context";
import SignIn from "./signin";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useSmartLink } from "@/lib/smart-link";
import SignUp from "./signup";
import ForgotPassword from "./forgot-password";

export default function AuthPage() {
  const { setLoading } = useLoading();
  const smartLink = useSmartLink();

  const [signinSignup, setSigninSignup] = useState(1);

  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-4 bg-muted px-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-4">
        <div className="flex items-center gap-2 self-center font-medium mb-1">
          <Link href="/" onClick={() => smartLink("/")}>
            <img src="/assets/img/logo/wedlyvite-basic.png" className="h-17.5 w-auto" />
          </Link>
        </div>

        {signinSignup == 1 && <SignIn setSigninSignup={setSigninSignup} />}
        {signinSignup == 2 && <SignUp setSigninSignup={setSigninSignup} />}
        {signinSignup == 3 && <ForgotPassword setSigninSignup={setSigninSignup} />}

        <div className="text-balance text-center text-xs text-muted [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary  ">
          By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "} and <a href="#">Privacy Policy</a>.
        </div>
      </div>
    </div>
  )
}
