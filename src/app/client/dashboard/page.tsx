"use client";

import BreadcrumbList from "@/components/breadcrumb-list";
import { useLoading } from "@/components/loading/loading-context";
import TablePagination from "@/components/table-pagination";
import TableTopToolbar from "@/components/table-top-toolbar";
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

  // Start Master
  const [inputPage, setInputPage] = useState("1");
  const [pageTable, setPageTable] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [totalPage, setTotalPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  return (
    <>
      <div className="py-2 px-4 flex flex-wrap justify-between items-center gap-2 bg-white border-b border-gray-200">
        <div>
          <h1 className="text-sm font-medium text-muted">
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
              // tblName="Product Category"
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

            <div className="flex flex-col pt-5 pb-4 px-1.5">
              <div className="-m-1.5 overflow-x-auto">
                <div className="min-w-full inline-block align-middle">
                  <div className="border border-gray-200 rounded-lg shadow-xs overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-3 py-2.5 text-start text-xs font-medium text-gray-500 uppercase">Name</th>
                          <th scope="col" className="px-3 py-2.5 text-start text-xs font-medium text-gray-500 uppercase">Age</th>
                          <th scope="col" className="px-3 py-2.5 text-start text-xs font-medium text-gray-500 uppercase">Address</th>
                          <th scope="col" className="px-3 py-2.5 text-end text-xs font-medium text-gray-500 uppercase">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        <tr className="hover:bg-gray-100 dark:hover:bg-neutral-700">
                          <td className="px-3 py-2.5 whitespace-nowrap text-sm font-medium text-gray-800">John Brown</td>
                          <td className="px-3 py-2.5 whitespace-nowrap text-sm text-gray-800">45</td>
                          <td className="px-3 py-2.5 whitespace-nowrap text-sm text-gray-800">New York No. 1 Lake Park</td>
                          <td className="px-3 py-2.5 whitespace-nowrap text-end text-sm font-medium">
                            <button type="button" className="inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent text-blue-600 hover:text-blue-800 focus:outline-hidden focus:text-blue-800 disabled:opacity-50 disabled:pointer-events-none">Delete</button>
                          </td>
                        </tr>

                        <tr className="hover:bg-gray-100 dark:hover:bg-neutral-700">
                          <td className="px-3 py-2.5 whitespace-nowrap text-sm font-medium text-gray-800">Jim Green</td>
                          <td className="px-3 py-2.5 whitespace-nowrap text-sm text-gray-800">27</td>
                          <td className="px-3 py-2.5 whitespace-nowrap text-sm text-gray-800">London No. 1 Lake Park</td>
                          <td className="px-3 py-2.5 whitespace-nowrap text-end text-sm font-medium">
                            <button type="button" className="inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent text-blue-600 hover:text-blue-800 focus:outline-hidden focus:text-blue-800 disabled:opacity-50 disabled:pointer-events-none">Delete</button>
                          </td>
                        </tr>

                        <tr className="hover:bg-gray-100 dark:hover:bg-neutral-700">
                          <td className="px-3 py-2.5 whitespace-nowrap text-sm font-medium text-gray-800">Joe Black</td>
                          <td className="px-3 py-2.5 whitespace-nowrap text-sm text-gray-800">31</td>
                          <td className="px-3 py-2.5 whitespace-nowrap text-sm text-gray-800">Sidney No. 1 Lake Park</td>
                          <td className="px-3 py-2.5 whitespace-nowrap text-end text-sm font-medium">
                            <button type="button" className="inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent text-blue-600 hover:text-blue-800 focus:outline-hidden focus:text-blue-800 disabled:opacity-50 disabled:pointer-events-none">Delete</button>
                          </td>
                        </tr>
                        <tr className="hover:bg-gray-100 dark:hover:bg-neutral-700">
                          <td className="px-3 py-2.5 whitespace-nowrap text-sm font-medium text-gray-800">Joe Black</td>
                          <td className="px-3 py-2.5 whitespace-nowrap text-sm text-gray-800">31</td>
                          <td className="px-3 py-2.5 whitespace-nowrap text-sm text-gray-800">Sidney No. 1 Lake Park</td>
                          <td className="px-3 py-2.5 whitespace-nowrap text-end text-sm font-medium">
                            <button type="button" className="inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent text-blue-600 hover:text-blue-800 focus:outline-hidden focus:text-blue-800 disabled:opacity-50 disabled:pointer-events-none">Delete</button>
                          </td>
                        </tr>
                        <tr className="hover:bg-gray-100 dark:hover:bg-neutral-700">
                          <td className="px-3 py-2.5 whitespace-nowrap text-sm font-medium text-gray-800">Joe Black</td>
                          <td className="px-3 py-2.5 whitespace-nowrap text-sm text-gray-800">31</td>
                          <td className="px-3 py-2.5 whitespace-nowrap text-sm text-gray-800">Sidney No. 1 Lake Park</td>
                          <td className="px-3 py-2.5 whitespace-nowrap text-end text-sm font-medium">
                            <button type="button" className="inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent text-blue-600 hover:text-blue-800 focus:outline-hidden focus:text-blue-800 disabled:opacity-50 disabled:pointer-events-none">Delete</button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            <TablePagination
              perPage={10}
              pageTable={1}
              totalPage={2}
              totalCount={5}
              setPerPage={setPerPage}
              setPageTable={setPageTable}
              // fatchData={fatchDatas}

              inputPage={inputPage}
              setInputPage={setInputPage}
            />
          </div>
        </div>
      </div>
    </>
  );
}
