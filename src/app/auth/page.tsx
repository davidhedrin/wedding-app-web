"use client";

import SignIn from "./signin";

export default function AuthPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-4 bg-muted px-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-4">
        <div className="flex items-center gap-2 self-center font-medium cursor-pointer">
          <a href="/">
            <img src="/assets/img/logo/wedlyvite-basic.png" className="h-20 w-auto" />
          </a>
        </div>

        <SignIn />

        <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary  ">
          By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "} and <a href="#">Privacy Policy</a>.
        </div>
      </div>
    </div>
  )
}
