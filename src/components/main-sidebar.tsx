import { useSmartLink } from "@/lib/smart-link";
import { signOutAction, toast } from "@/lib/utils";
import { userLoginData } from "@/lib/zustand";
import { GetDataEvents } from "@/server/event";
import { Events, RolesEnum, Templates } from "@/generated/prisma";
import { useEffect, useState } from "react";

export default function MainSidebar() {
  const smartLink = useSmartLink();
  const { userData, statusLogin } = userLoginData();

  const [datas, setDatas] = useState<(Events & {
    template: Templates | null
  })[] | null>(null);
  const [totalPage, setTotalPage] = useState(0);

  const fatchDataEvent = async (userId: number) => {
    try {
      const result = await GetDataEvents({
        curPage: 1,
        perPage: 10,
        where: {
          user_id: userId,
        },
        select: {
          id: true,
          tmp_code: true,
          template: {
            select: {
              name: true,
              ctg_name: true
            }
          }
        },
        orderBy: {
          createdAt: "desc"
        }
      });
      setTotalPage(result.meta.totalPages);
      setDatas(result.data);
    } catch (error: any) {
      toast({
        type: "warning",
        title: "Something's gone wrong",
        message: "Failed to fatch sidebar event datas."
      });
    }
  };

  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  useEffect(() => {
    const firstInit = async () => {
      if (userData) {
        const setAdmin = statusLogin === "authenticated" && userData.user && userData.user.role && userData.user.role && userData.user.role === RolesEnum.Admin;
        if (setAdmin !== undefined && setAdmin !== null) setIsAdmin(setAdmin);

        fatchDataEvent(Number(userData.user?.id));
      }
    }

    firstInit();
  }, [userData]);

  // === LISTENER AUTO REFRESH ===
  useEffect(() => {
    const handler = (event: CustomEvent) => {
      fatchDataEvent(event.detail.user_id);
    };

    window.addEventListener("sidebar:refresh", handler as EventListener);
    return () =>
      window.removeEventListener("sidebar:refresh", handler as EventListener);
  }, []);

  return (
    <div id="hs-pro-sidebar" className="hs-overlay [--body-scroll:true] lg:[--overlay-backdrop:false] [--is-layout-affect:true] [--opened:lg] [--auto-close:lg] hs-overlay-open:translate-x-0 lg:hs-overlay-layout-open:translate-x-0 -translate-x-full transition-all duration-300 transform w-60 hidden fixed inset-y-0 z-60 inset-s-0 bg-gray-100 lg:block lg:-translate-x-full lg:end-auto lg:bottom-0" role="dialog" aria-label="Sidebar">
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
                  <a href="/client/dashboard" onClick={() => smartLink("/client/dashboard")} className="w-full flex items-center leading-none gap-x-2 py-2 px-0.5 lg:px-2.5 text-sm rounded-lg hover:bg-gray-200 focus:outline-hidden focus:bg-gray-200 focus:text-gray-800">
                    <i className='bx bx-tachometer text-lg'></i> Dashboard
                  </a>
                </li>
              </ul>
            </div>

            <div className="flex flex-col first:pt-0 first:mt-0">
              <span className="block px-0.5 lg:px-2.5 mb-1 font-medium text-xs text-gray-500 hover:text-gray-800">
                My Events
              </span>

              <ul className="flex flex-col">
                {
                  datas && datas.length > 0 ? datas.map((x, i) => (
                    <li key={i}>
                      <a
                        href={`/client/events/event-detail?code=${x.tmp_code}`}
                        onClick={() => smartLink("/client/events/event-detail")}
                        className="border border-gray-400 border-dashed w-full flex items-center leading-none gap-x-2 py-1.5 px-0.5 lg:px-2.5 mb-1 mt-1 text-sm hover:bg-gray-200 focus:outline-hidden focus:bg-gray-200 focus:text-gray-800"
                      >
                        <span className="truncate block max-w-45 leading-normal" title={`${x.template?.ctg_name} - ${x.template?.name}`}>
                          {x.template?.ctg_name} - {x.template?.name}
                        </span>
                      </a>
                    </li>
                  )) : <li className="py-2 px-1 lg:px-2">
                    <div className="border-2 border-dashed border-gray-400 rounded-lg bg-gray-50 text-center p-3">
                      <p className="text-sm font-semibold text-gray-800 mb-1">No Event Added!</p>
                      <p className="text-sm italic text-gray-600 mb-2">
                        Let's create your first online event invitation or <u className="font-semibold">try 3 days</u>!
                      </p>
                      <a href="/catalog" onClick={() => smartLink("/catalog")} type="button" className="w-full py-2 px-4 inline-flex justify-center gap-x-1 btn-color-app font-medium text-sm text-nowrap text-white rounded-lg focus:outline-hidden hover:scale-103 active:scale-100">
                        Find Template
                      </a>
                    </div>
                  </li>
                }

                <li>
                  <a href="/client/events" onClick={() => smartLink("/client/events")} className="w-full flex items-center leading-none gap-x-2 py-2 px-0.5 lg:px-2.5 text-sm rounded-lg hover:bg-gray-200 focus:outline-hidden focus:bg-gray-200 focus:text-gray-800">
                    <i className='bx bx-calendar-event text-lg'></i> See All Event...
                  </a>
                </li>
                {/* <li className="hs-accordion" id="account-accordion">
                <a className="hs-accordion-toggle w-full flex items-center leading-none gap-x-2 text-sm rounded-lg hover:bg-gray-200 focus:outline-hidden focus:bg-gray-200 focus:text-gray-800" aria-expanded="true" aria-controls="account-accordion-sub-1-collapse-1">
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
                    <a href="/client/systems/voucher" onClick={() => smartLink("/client/systems/voucher")} className="w-full flex items-center leading-none gap-x-2 py-2 px-0.5 lg:px-2.5 text-sm rounded-lg hover:bg-gray-200 focus:outline-hidden focus:bg-gray-200 focus:text-gray-800">
                      <i className='bx bxs-coupon text-lg'></i> Vouchers
                    </a>
                  </li>
                  <li>
                    <a href="/client/systems/catalog" onClick={() => smartLink("/client/systems/catalog")} className="w-full flex items-center leading-none gap-x-2 py-2 px-0.5 lg:px-2.5 text-sm rounded-lg hover:bg-gray-200 focus:outline-hidden focus:bg-gray-200 focus:text-gray-800">
                      <i className='bx bx-customize text-lg'></i> Catalog
                    </a>
                  </li>
                  <li>
                    <a href="/client/systems/users-manage" onClick={() => smartLink("/client/systems/users-manage")} className="w-full flex items-center leading-none gap-x-2 py-2 px-0.5 lg:px-2.5 text-sm rounded-lg hover:bg-gray-200 focus:outline-hidden focus:bg-gray-200 focus:text-gray-800">
                      <i className='bx bx-user-pin text-lg'></i> Users Mangement
                    </a>
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
