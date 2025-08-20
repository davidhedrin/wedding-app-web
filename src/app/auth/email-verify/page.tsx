"use client";

import { useLoading } from '@/components/loading/loading-context';
import { useSmartLink } from '@/lib/smart-link';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

export default function Page() {
  const smartLink = useSmartLink();
  const { setLoading } = useLoading();
  const { push } = useRouter();
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  useEffect(() => {
    setLoading(false);
  }, []);

  // if (!shouldRender) return (<LoadingUI />);
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-4 bg-muted px-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-4">
        <div className="flex items-center gap-2 self-center font-medium mb-1">
          <Link href="/" onClick={() => smartLink("/")}>
            <img src="/assets/img/logo/wedlyvite-basic.png" className="h-[70px] w-auto" />
          </Link>
        </div>

        <div className="grid gap-4 p-4 sm:p-6 bg-white border border-gray-200 rounded-xl shadow-2xs">
          <div className="text-center mb-2">
            <div className="block text-xl font-bold text-gray-800">Verified your Email</div>
            <p className="mt-1 text-sm text-gray-600">
              Verify your email with the 6 digit verification code OTP belows.
            </p>
          </div>

          <div className="flex justify-center gap-x-4" data-hs-pin-input="">
            <input type="text" className="block h-10 w-9 text-center border border-gray-300 rounded-md sm:text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none" placeholder="⚬" data-hs-pin-input-item="" />
            <input type="text" className="block h-10 w-9 text-center border border-gray-300 rounded-md sm:text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none" placeholder="⚬" data-hs-pin-input-item="" />
            <input type="text" className="block h-10 w-9 text-center border border-gray-300 rounded-md sm:text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none" placeholder="⚬" data-hs-pin-input-item="" />
            <input type="text" className="block h-10 w-9 text-center border border-gray-300 rounded-md sm:text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none" placeholder="⚬" data-hs-pin-input-item="" />
            <input type="text" className="block h-10 w-9 text-center border border-gray-300 rounded-md sm:text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none" placeholder="⚬" data-hs-pin-input-item="" />
            <input type="text" className="block h-10 w-9 text-center border border-gray-300 rounded-md sm:text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none" placeholder="⚬" data-hs-pin-input-item="" />
          </div>

          <button disabled={loadingSubmit} type="submit" className="w-full py-2 px-3 mt-2 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent btn-color-app">
            {loadingSubmit ? "Verifying..." : "Verified Now"}
          </button>

          <p className="text-center text-sm text-muted">
            Don't receive code. Click <span className="cursor-pointer text-blue-600 decoration-2 hover:underline focus:outline-hidden focus:underline font-medium">
              Resend OTP
            </span>
          </p>
        </div>

        <div className="text-balance text-center text-xs text-muted [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary  ">
          By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "} and <a href="#">Privacy Policy</a>.
        </div>
      </div>
    </div>
  )
}
