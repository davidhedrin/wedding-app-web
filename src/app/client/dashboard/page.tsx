"use client";

import BreadcrumbList from "@/components/breadcrumb-list";
import { useLoading } from "@/components/loading/loading-context";
import TableTopToolbar from "@/components/table-top-toolbar";
import DatePicker from "@/components/ui/date-picker";
import { BreadcrumbType } from "@/lib/model-types";
import { useEffect, useState } from "react";

export default function Page() {
  const listBr: BreadcrumbType[] = [
    { name: "Home", url: null },
    { name: "Dashboard", url: "/client/dashboard" },
  ];
  const { setLoading } = useLoading();

  useEffect(() => {
    setLoading(false);
  }, []);

  const [selected, setSelected] = useState<Date | undefined>(undefined);

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

            <TableTopToolbar
              tblName="Product Category"
              tblDesc="List product category to manage your data"
            // inputSearch={inputSearch}
            // tblSortList={tblSortList}
            // thColomn={tblThColomns}
            // setTblThColomns={setTblThColomns}
            // setTblSortList={setTblSortList}
            // setInputSearch={setInputSearch}
            // fatchData={() => fatchDatas(pageTable)}

            // openModal={() => openModalAddEdit()}
            />
          </div>
        </div>
      </div>
    </>
  );
}
