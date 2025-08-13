// "use client";

import BreadcrumbList from "@/components/breadcrumb-list";
import { BreadcrumbType } from "@/lib/model-types";

export default async function Page() {
  const listBr: BreadcrumbType[] = [
    {name: "Home", url: "/"},
    {name: "Dashboard", url: null},
  ];
  // await new Promise((resolve) => setTimeout(resolve, 553000));

  return (
    <>
      <div className="py-2 px-4 flex flex-wrap justify-between items-center gap-2 bg-white border-b border-gray-200">
        <div>
          <h1 className="font-medium text-gray-800">
            Dashboard
          </h1>
        </div>

        <div className="flex items-center gap-x-5">
          <BreadcrumbList listBr={listBr} />
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300">
        <div className="flex-1 flex flex-col lg:flex-row">
          <div className="flex-1 min-w-0 flex flex-col border-e border-gray-200 p-4">
            {/* Conten Here */}
          </div>
        </div>
      </div>
    </>
  );
}
