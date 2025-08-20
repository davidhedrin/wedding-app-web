"use client";

import Link from 'next/link'
import Image from 'next/image';
import { useLoading } from '@/components/loading/loading-context';
import { useSmartLink } from '@/lib/smart-link';
import { useEffect } from 'react';

export default function Page() {
  const { setLoading } = useLoading();
  const smartLink = useSmartLink();

  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-4 bg-muted px-6 md:p-5">
      <div className="flex w-full items-center max-w-sm flex-col gap-11">
        <div className="flex items-center gap-2 self-center font-medium mb-1">
          <Link href="/" onClick={() => smartLink("/")}>
            <img src="/assets/img/logo/wedlyvite-basic.png" className="h-[70px] w-auto" />
          </Link>
        </div>

        <Image
          src="/assets/img/page-not-found.png"
          alt="Page Not Found"
          width={300}
          height={300}
        />

        <div className='text-center text-balance'>
          <div>
            Sorry! Page not found.
          </div>
          <p className='text-sm text-muted'>
            The link you clicked may be broken or the page may have been remove. Back to home by click the button bellow.
          </p>
        </div>

        <div>
          <Link href={"/"} onClick={() => smartLink("/")}>
            <button type="button" className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-500 text-gray-500 hover:border-gray-800 hover:text-gray-800 focus:outline-hidden focus:border-gray-800 focus:text-gray-800 disabled:opacity-50 disabled:pointer-events-none">
              Back To Home
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}