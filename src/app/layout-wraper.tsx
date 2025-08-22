"use client";

import React, { useEffect } from 'react'
import { usePathname } from 'next/navigation';
import MainSidebar from "@/components/main-sidebar";
import MainHeader from "@/components/main-header";
import AppHeader from '@/components/app-header';
import AppFooter from '@/components/app-footer';
import { useSession } from 'next-auth/react';
import { userLoginData } from '@/lib/zustand';

export default function LayoutWraper({ children }: Readonly<{ children: React.ReactNode; }>) {
  const pathname = usePathname();
  const isAdminLayout = pathname.startsWith('/client');
  const isAuthPage = pathname.startsWith('/auth') || pathname === '/not-found';

  const { fetchuserData } = userLoginData();
  const { data, status } = useSession();

  useEffect(() => {
    fetchuserData(data, status);
    if (status === "authenticated") {
      setTimeout(() => {
        if (typeof window !== 'undefined' && window.HSStaticMethods) {
          window.HSStaticMethods.autoInit();
        }
      }, 0);
    }
  }, [data, status]);

  return (
    <>
      {
        isAdminLayout ? <div className="overflow-hidden">
          <MainHeader />
          <main className="lg:hs-overlay-layout-open:ps-60 transition-all duration-300 lg:fixed lg:inset-0 pt-13 px-3 pb-3">
            <MainSidebar />
            <div className="h-[calc(100dvh-62px)] lg:h-full overflow-hidden flex flex-col bg-white border border-gray-200 shadow-xs rounded-lg">
              {children}
            </div>
          </main>
        </div> : <>
          {
            !isAuthPage && <>
              <AppHeader />
            </>
          }

          {children}

          {
            !isAuthPage && <>
              <AppFooter />
            </>
          }
        </>
      }
    </>
  )
}
