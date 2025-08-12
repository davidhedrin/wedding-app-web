"use client";

import React from 'react'
import { usePathname } from 'next/navigation';
import MainSidebar from "@/components/main-sidebar";
import MainHeader from "@/components/main-header";

export default function LayoutWraper({ children }: Readonly<{ children: React.ReactNode; }>) {
  const pathname = usePathname();
  const isAdminLayout = pathname.startsWith('/admin');
  const isAuthPage = pathname.startsWith('/auth') || pathname === '/not-found';

  return (
    <>
      {
        isAdminLayout ? <>
          <MainHeader />
          <main className="lg:hs-overlay-layout-open:ps-60 transition-all duration-300 lg:fixed lg:inset-0 pt-13 px-3 pb-3">
            <MainSidebar />
            <div className="h-[calc(100dvh-62px)] lg:h-full overflow-hidden flex flex-col bg-white border border-gray-200 shadow-xs rounded-lg">
              {children}
            </div>
          </main>
        </> : <div className="bg-gray-100 flex h-full items-center py-16 dark:bg-neutral-800">
          <div className='w-full max-w-md mx-auto p-6'>
            {children}
          </div>
        </div>
      }
    </>
  )
}
