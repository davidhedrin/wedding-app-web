"use client";

import { useSmartLink } from "@/lib/smart-link";
import { signOutAction } from "@/lib/utils";
import { userLoginData } from "@/lib/zustand";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AppHeader() {
  const { push } = useRouter();
  const smartLink = useSmartLink();
  const { userData, statusLogin } = userLoginData();

  return (
    <header className="fixed top-4 inset-x-0 flex flex-wrap md:justify-start md:flex-nowrap z-50 w-full before:absolute before:inset-0 before:max-w-5xl before:mx-2 lg:before:mx-auto before:rounded-xl before:bg-neutral-300/45 before:backdrop-blur-md">
      <nav className="relative max-w-5xl w-full flex flex-wrap md:flex-nowrap basis-full items-center justify-between py-2 px-3 md:py-0.5 mx-2 lg:mx-auto">
        <div className="flex items-center">
          <Link href="/" onClick={() => smartLink("/")}>
            <img src="/assets/img/logo/wedlyvite-landscape.png" className="h-auto w-[144px]" />
          </Link>
        </div>

        <div className="md:order-3 flex items-center gap-x-3">
          {
            userData && statusLogin === "authenticated" ? <div className="hidden md:inline-flex hs-dropdown [--strategy:absolute] [--auto-close:inside] [--placement:bottom-right] relative text-start">
              <button id="hs-profile-app" type="button" className="cursor-pointer p-0.5 inline-flex shrink-0 items-center gap-x-3 text-start rounded-full hover:bg-gray-200 focus:outline-hidden focus:bg-gray-200" aria-haspopup="menu" aria-expanded="false" aria-label="Dropdown">
                <img className="shrink-0 size-8 rounded-full" src="https://images.unsplash.com/photo-1659482633369-9fe69af50bfb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=3&w=320&h=320&q=80" alt="Avatar" />
              </button>

              <div className="hs-dropdown-menu hs-dropdown-open:opacity-100 w-60 transition-[opacity,margin] duration opacity-0 hidden z-20 bg-white border border-gray-200 rounded-xl shadow-xl" role="menu" aria-orientation="vertical" aria-labelledby="hs-profile-app">
                <div className="py-2 px-3.5">
                  <span className="font-medium text-gray-800">
                    {userData.user?.name}
                  </span>
                  <p className="text-sm text-gray-500">
                    {userData.user?.email}
                  </p>
                </div>
                <div className="p-1 border-t border-gray-200 ">
                  <Link href="/client/dashboard" onClick={() => smartLink("/client/dashboard")} className="flex items-center gap-x-3 py-2 px-3 rounded-lg text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-gray-100">
                    <i className='bx bx-tachometer text-lg'></i>Dashboard
                  </Link>
                  <div onClick={() => signOutAction()} className="flex cursor-pointer items-center gap-x-3 py-2 px-3 rounded-lg text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-gray-100">
                    <svg className="shrink-0 mt-0.5 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m16 17 5-5-5-5" />
                      <path d="M21 12H9" />
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    </svg>Log out
                  </div>
                </div>
              </div>
            </div> : <Link href="/auth" onClick={() => smartLink("/auth")} className="ps-3 group inline-flex items-center gap-x-1 py-2 px-3 btn-color-app font-medium text-sm text-nowrap text-neutral-800 rounded-lg focus:outline-hidden">
              Start Here! <i className='bx bx-log-in text-lg'></i>
            </Link>
          }

          <div className="md:hidden">
            <button type="button" className="hs-collapse-toggle size-9 flex justify-center items-center text-sm font-semibold rounded-full bg-neutral-800 text-white disabled:opacity-50 disabled:pointer-events-none" id="hs-navbar-floating-dark-collapse" aria-expanded="false" aria-controls="hs-navbar-floating-dark" aria-label="Toggle navigation" data-hs-collapse="#hs-navbar-floating-dark">
              <svg className="hs-collapse-open:hidden shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" x2="21" y1="6" y2="6" />
                <line x1="3" x2="21" y1="12" y2="12" />
                <line x1="3" x2="21" y1="18" y2="18" />
              </svg>
              <svg className="hs-collapse-open:block hidden shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div id="hs-navbar-floating-dark" className="hs-collapse hidden overflow-hidden transition-all duration-300 basis-full grow md:block" aria-labelledby="hs-navbar-floating-dark-collapse">
          <div className="flex flex-col md:flex-row md:items-center md:justify-end gap-y-3 pb-2 pt-4 md:py-0 md:ps-7">
            {
              userData && statusLogin === "authenticated" && <>
                <hr className="text-muted" />
                <div className="md:hidden px-3 grid gap-2">
                  <div className="flex justify-between items-center gap-4">
                    <div>
                      <span className="font-medium text-gray-800">
                        {userData.user?.name}
                      </span>
                      <p className="text-sm text-muted">
                        {userData.user?.email}
                      </p>
                    </div>
                    <div>
                      <img className="shrink-0 size-11 rounded-full" src="https://images.unsplash.com/photo-1659482633369-9fe69af50bfb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=3&w=320&h=320&q=80" alt="Avatar" />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Link href="/client/dashboard" onClick={() => smartLink("/client/dashboard")} className="group inline-flex items-center gap-x-1 py-1.5 px-3 btn-color-app font-medium text-sm text-nowrap text-neutral-800 rounded-lg focus:outline-hidden">
                      Dashboard <i className='bx bx-tachometer text-lg'></i>
                    </Link>
                    <button onClick={() => signOutAction()} type="button" className="py-1.5 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-800 text-gray-800 hover:border-gray-500 hover:text-gray-500 focus:outline-hidden focus:border-gray-500 focus:text-gray-500 disabled:opacity-50 disabled:pointer-events-none">
                      Sign Out <i className='bx bx-log-out text-lg bx-rotate-180' ></i>
                    </button>
                  </div>
                </div>
              </>
            }
            <hr className="text-muted" />

            <Link className="px-3 md:py-3 text-sm font-medium hover:text-neutral-600 focus:outline-hidden" href="/" onClick={() => smartLink("/")} aria-current="page">Home</Link>
            <Link className="px-3 md:py-3 text-sm font-medium hover:text-neutral-600 focus:outline-hidden" href="#">Catalog</Link>
            <Link className="px-3 md:py-3 text-sm font-medium hover:text-neutral-600 focus:outline-hidden" href="#">About Us</Link>
            <Link className="px-3 md:py-3 text-sm font-medium hover:text-neutral-600 focus:outline-hidden" href="#">Contact</Link>
            <Link className="px-3 md:py-3 text-sm font-medium hover:text-neutral-600 focus:outline-hidden" href="#">FAQ</Link>
            {/* <div className="hs-dropdown [--strategy:static] md:[--strategy:absolute] [--adaptive:none] md:[--trigger:hover] [--auto-close:inside] md:inline-block">
              <button id="hs-pro-anpd" type="button" className="gap-0.5 hs-dropdown-toggle px-3 md:py-3 w-full md:w-auto flex items-center text-sm font-medium hover:text-neutral-600 focus:outline-hidden" aria-haspopup="menu" aria-expanded="false" aria-label="Dropdown">
                Product
                <svg className="hs-dropdown-open:-rotate-180 md:hs-dropdown-open:rotate-0 duration-300 ms-auto md:ms-1 shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>

              <div className="hs-dropdown-menu transition-[opacity,margin] duration-[0.1ms] lg:duration-[150ms] hs-dropdown-open:opacity-100 opacity-0 relative w-auto hidden z-10 top-[calc(100%+8px)] rounded-xl bg-neutral-300/30 p-1 before:absolute before:-top-4 before:start-3 before:w-full before:h-5 md:after:hidden mt-2 md:mt-0" role="menu" aria-orientation="vertical" aria-labelledby="hs-pro-anpd">
                <div className="p-3 flex flex-col justify-between">
                  <div className="mb-4">
                    <a className="group flex items-center gap-x-2 font-medium text-sm text-neutral-600 hover:text-[color:var(--color-primary)] focus:text-[color:var(--color-primary)] focus:outline-hidden" href="#">
                      Build
                      <span className="ms-auto size-6 flex shrink-0 justify-center items-center bg-color-app text-black rounded-sm">
                        <svg className="shrink-0 size-4 transition group-hover:translate-x-0.5 group-focus:translate-x-0.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M5 12h14"></path>
                          <path d="m12 5 7 7-7 7"></path>
                        </svg>
                      </span>
                    </a>
                  </div>

                  <ul className="flex flex-col">
                    <li className="py-2 first:pt-0 last:pb-0 first:border-t-0 border-t border-neutral-800">
                      <a className="group flex items-center gap-x-2 font-medium text-sm text-neutral-600 hover:text-[color:var(--color-primary)] focus:text-[color:var(--color-primary)] focus:outline-hidden" href="#">
                        <span className="size-1 bg-color-app rounded-full"></span>
                        Websites
                        <span className="ms-auto size-6 flex shrink-0 justify-center items-center">
                          <svg className="shrink-0 size-4 transition group-hover:translate-x-0.5 group-focus:translate-x-0.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M5 12h14"></path>
                            <path d="m12 5 7 7-7 7"></path>
                          </svg>
                        </span>
                      </a>
                    </li>

                    <li className="py-2 first:pt-0 last:pb-0 first:border-t-0 border-t border-neutral-800">
                      <a className="group flex items-center gap-x-2 font-medium text-sm text-neutral-600 hover:text-[color:var(--color-primary)] focus:text-[color:var(--color-primary)] focus:outline-hidden" href="#">
                        <span className="size-1 bg-color-app rounded-full"></span>
                        Mobile apps
                        <span className="ms-auto size-6 flex shrink-0 justify-center items-center">
                          <svg className="shrink-0 size-4 transition group-hover:translate-x-0.5 group-focus:translate-x-0.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M5 12h14"></path>
                            <path d="m12 5 7 7-7 7"></path>
                          </svg>
                        </span>
                      </a>
                    </li>

                    <li className="py-2 first:pt-0 last:pb-0 first:border-t-0 border-t border-neutral-800">
                      <a className="group flex items-center gap-x-2 font-medium text-sm text-neutral-600 hover:text-[color:var(--color-primary)] focus:text-[color:var(--color-primary)] focus:outline-hidden" href="#">
                        <span className="size-1 bg-color-app rounded-full"></span>
                        Pages
                        <span className="ms-auto size-6 flex shrink-0 justify-center items-center">
                          <svg className="shrink-0 size-4 transition group-hover:translate-x-0.5 group-focus:translate-x-0.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M5 12h14"></path>
                            <path d="m12 5 7 7-7 7"></path>
                          </svg>
                        </span>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div> */}
          </div>
        </div>
      </nav>
    </header>
  )
}
