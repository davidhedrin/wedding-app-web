import { useSmartLink } from "@/lib/smart-link";
import { signOutAction } from "@/lib/utils";
import { userLoginData } from "@/lib/zustand";
import { RolesEnum } from "@prisma/client";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function MainSidebar() {
  const smartLink = useSmartLink();
  const { userData, statusLogin } = userLoginData();

  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  useEffect(() => {
    const setAdmin = userData && statusLogin === "authenticated" && userData.user && userData.user.role && userData.user.role && userData.user.role === RolesEnum.ADMIN;
    if (setAdmin !== undefined && setAdmin !== null) setIsAdmin(setAdmin);
  }, [userData]);

  return (
    <div id="hs-pro-sidebar" className="hs-overlay [--body-scroll:true] lg:[--overlay-backdrop:false] [--is-layout-affect:true] [--opened:lg] [--auto-close:lg] hs-overlay-open:translate-x-0 lg:hs-overlay-layout-open:translate-x-0 -translate-x-full transition-all duration-300 transform w-60 hidden fixed inset-y-0 z-60 start-0 bg-gray-100 lg:block lg:-translate-x-full lg:end-auto lg:bottom-0" role="dialog" aria-label="Sidebar">
      <div className="lg:pt-13 relative flex flex-col h-full max-h-full">
        <nav className="p-3 size-full flex flex-col overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-200 [&::-webkit-scrollbar-thumb]:bg-gray-300">
          <div className="lg:hidden mb-6 flex items-center justify-between">
            <img src="/assets/img/logo/wedlyvite-landscape.png" className="h-auto w-28" />

            <button type="button" className="ps-1.5 pt-0.5 inline-flex items-center rounded-md text-gray-500 disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden" aria-haspopup="dialog" aria-expanded="false" aria-controls="hs-pro-sidebar" data-hs-overlay="#hs-pro-sidebar">
              <i className='bx bx-x text-2xl'></i>
              <span className="sr-only">Sidebar Toggle</span>
            </button>
          </div>

          <div className="grid gap-3">
            <div className="flex flex-col first:pt-0 first:mt-0">
              <span className="block px-0.5 lg:px-2.5 mb-1 font-medium text-xs text-gray-500 hover:text-gray-800">
                Home
              </span>

              <ul className="flex flex-col">
                <li>
                  <Link href="/client/dashboard" onClick={() => smartLink("/client/dashboard")} className="w-full flex items-center leading-none gap-x-2 py-2 px-0.5 lg:px-2.5 text-sm rounded-lg hover:bg-gray-200 focus:outline-hidden focus:bg-gray-200 focus:text-gray-800">
                    <i className='bx bx-tachometer text-lg'></i> Dashboard
                  </Link>
                </li>
              </ul>
            </div>

            <div className="flex flex-col first:pt-0 first:mt-0">
              <span className="block px-0.5 lg:px-2.5 mb-1 font-medium text-xs text-gray-500 hover:text-gray-800">
                Pages
              </span>

              <ul className="flex flex-col">
                <li>
                  <a className="w-full flex items-center leading-none gap-x-2 py-2 px-0.5 lg:px-2.5 text-sm rounded-lg hover:bg-gray-200 focus:outline-hidden focus:bg-gray-200 focus:text-gray-800" href="#">
                    <i className='bx bx-customize text-lg'></i> Posts
                  </a>
                </li>
                {/* <li className="hs-accordion" id="account-accordion">
                <a className="hs-accordion-toggle w-full flex items-center leading-none gap-x-2 py-2 px-0.5 lg:px-2.5 text-sm rounded-lg hover:bg-gray-200 focus:outline-hidden focus:bg-gray-200 focus:text-gray-800" aria-expanded="true" aria-controls="account-accordion-sub-1-collapse-1">
                  <i className='bx bx-user-pin text-lg'></i> Account
                  <svg className="hs-accordion-active:block ms-auto hidden size-4 text-gray-600 group-hover:text-gray-500 dark:text-neutral-400 " xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m18 15-6-6-6 6" /></svg>
                  <svg className="hs-accordion-active:hidden ms-auto block size-4 text-gray-600 group-hover:text-gray-500 dark:text-neutral-400 " xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                </a>

                <div id="account-accordion-sub-1-collapse-1" className="hs-accordion-content w-full overflow-hidden transition-[height] duration-300 hidden" role="region" aria-labelledby="account-accordion">
                  <ul className="pt-1 ps-4 space-y-1">
                    <li>
                      <a className="w-full flex items-center gap-x-2 py-2 px-2.5 text-sm text-gray-500 rounded-lg hover:bg-gray-200 hover:text-gray-800 focus:outline-hidden focus:bg-gray-200 focus:text-gray-800" href="#">
                        Link 1
                      </a>
                    </li>
                    <li>
                      <a className="w-full flex items-center gap-x-2 py-2 px-2.5 text-sm text-gray-500 rounded-lg hover:bg-gray-200 hover:text-gray-800 focus:outline-hidden focus:bg-gray-200 focus:text-gray-800" href="#">
                        Link 2
                      </a>
                    </li>
                    <li>
                      <a className="w-full flex items-center gap-x-2 py-2 px-2.5 text-sm text-gray-500 rounded-lg hover:bg-gray-200 hover:text-gray-800 focus:outline-hidden focus:bg-gray-200 focus:text-gray-800" href="#">
                        Link 3
                      </a>
                    </li>
                  </ul>
                </div>
              </li> */}
              </ul>
            </div>

            {
              isAdmin && <div className="flex flex-col first:pt-0 first:mt-0">
                <span className="block px-0.5 lg:px-2.5 mb-1 font-medium text-xs text-gray-500 hover:text-gray-800">
                  Systems
                </span>

                <ul className="flex flex-col">
                  <li>
                    <Link href="/client/systems/catalog" onClick={() => smartLink("/client/systems/catalog")} className="w-full flex items-center leading-none gap-x-2 py-2 px-0.5 lg:px-2.5 text-sm rounded-lg hover:bg-gray-200 focus:outline-hidden focus:bg-gray-200 focus:text-gray-800">
                      <i className='bx bx-customize text-lg'></i> Catalog
                    </Link>
                  </li>
                  <li>
                    <Link href="/client/systems/users-manage" onClick={() => smartLink("/client/systems/users-manage")} className="w-full flex items-center leading-none gap-x-2 py-2 px-0.5 lg:px-2.5 text-sm rounded-lg hover:bg-gray-200 focus:outline-hidden focus:bg-gray-200 focus:text-gray-800">
                      <i className='bx bx-user-pin text-lg'></i> Users Mangement
                    </Link>
                  </li>
                </ul>
              </div>
            }
          </div>
        </nav>

        <footer className="mt-auto p-3 flex flex-col">
          <ul className="flex flex-col">
            <li>
              <div className="w-full cursor-pointer flex items-center leading-none gap-x-2 py-2 px-2.5 text-sm text-gray-500 rounded-lg hover:bg-gray-200 hover:text-gray-800 focus:outline-hidden focus:bg-gray-200 focus:text-gray-800">
                <i className='bx bx-cog text-lg'></i>
                Setting
              </div>
            </li>
            <li>
              <div onClick={() => signOutAction()} className="w-full cursor-pointer flex items-center leading-none gap-x-2 py-2 px-2.5 text-sm text-gray-500 rounded-lg hover:bg-gray-200 hover:text-gray-800 focus:outline-hidden focus:bg-gray-200 focus:text-gray-800">
                <i className='bx bx-log-out text-lg'></i>
                Logout
              </div>
            </li>
          </ul>
        </footer>
      </div>
    </div>
  )
}
