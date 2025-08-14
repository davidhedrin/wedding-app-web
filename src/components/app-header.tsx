"use client";

import { useSmartLink } from "@/lib/smart-link";
import Link from "next/link";

export default function AppHeader() {
  const smartLink = useSmartLink();
  
  return (
    <header className="fixed top-4 inset-x-0 flex flex-wrap md:justify-start md:flex-nowrap z-50 w-full before:absolute before:inset-0 before:max-w-5xl before:mx-2 lg:before:mx-auto before:rounded-[26px] before:bg-neutral-300/45 before:backdrop-blur-md">
      <nav className="relative max-w-5xl w-full flex flex-wrap md:flex-nowrap basis-full items-center justify-between py-2 px-4 md:py-1 mx-2 lg:mx-auto">
        <div className="flex items-center">
          <a href="/">
            <img src="/assets/img/logo/wedlyvite-landscape.png" className="h-auto w-[144px]" />
          </a>
        </div>

        <div className="md:order-3 flex items-center gap-x-3">
          <div className="ps-3">
            <Link href="/auth" onClick={() => smartLink("/auth")} className="group inline-flex items-center gap-x-2 py-1 px-3 btn-color-app font-medium text-sm text-nowrap text-neutral-800 rounded-full focus:outline-hidden">
              Start Here!
            </Link>
          </div>

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
          <div className="flex flex-col md:flex-row md:items-center md:justify-end gap-y-3 py-2 md:py-0 md:ps-7">
            <a className="px-3 md:py-3 text-sm font-medium hover:text-neutral-600 focus:outline-hidden" href="/" aria-current="page">Home</a>
            <a className="px-3 md:py-3 text-sm font-medium hover:text-neutral-600 focus:outline-hidden" href="#">Catalog</a>
            <a className="px-3 md:py-3 text-sm font-medium hover:text-neutral-600 focus:outline-hidden" href="#">About Us</a>
            <a className="px-3 md:py-3 text-sm font-medium hover:text-neutral-600 focus:outline-hidden" href="#">Contact</a>
            <a className="px-3 md:py-3 text-sm font-medium hover:text-neutral-600 focus:outline-hidden" href="#">FAQ</a>
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
