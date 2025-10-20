"use client";

import BreadcrumbList from "@/components/breadcrumb-list";
import { useLoading } from "@/components/loading/loading-context";
import { BreadcrumbType } from "@/lib/model-types";
import { useSmartLink } from "@/lib/smart-link";
import { GetDataEventByCode } from "@/server/event";
import { Events, Templates } from "@prisma/client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {
  const smartLink = useSmartLink();
  const listBr: BreadcrumbType[] = [
    { name: "Modules", url: null },
    { name: "My Events", url: "/client/events" },
    { name: "Event Detail", url: null },
  ];
  const { setLoading } = useLoading();
  const searchParams = useSearchParams();
  const tmpCode = searchParams.get('code');

  const [dataEvent, setDataEvent] = useState<Events & {
    template: Templates | null
  } | null>(null);

  useEffect(() => {
    const firstInit = async () => {
      setLoading(false);
      if (tmpCode && tmpCode.trim() !== '') {
        const data = await GetDataEventByCode(tmpCode);
        if (data) {
          setDataEvent(data);
        }
      }
    };

    firstInit();
  }, [tmpCode]);

  return (
    <>
      <div className="py-2 px-4 flex flex-wrap justify-between items-center gap-2 bg-white border-b border-gray-200">
        <div>
          <h1 className="text-sm font-medium text-muted">
            Event Detail
          </h1>
        </div>

        <div className="flex items-center gap-x-5">
          <BreadcrumbList listBr={listBr} />
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300">
        <div className="flex-1 flex flex-col lg:flex-row">
          <div className="flex-1 min-w-0 flex flex-col border-e border-gray-200 p-4">
            {
              dataEvent ? <div>
              </div> : <div className="animate-pulse h-full w-full bg-gray-200 rounded-xl dark:bg-neutral-700"></div>
            }
          </div>
        </div>
      </div>
    </>
  )
}