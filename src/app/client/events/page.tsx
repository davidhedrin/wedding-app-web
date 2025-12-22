"use client";

import BreadcrumbList from "@/components/breadcrumb-list";
import { useLoading } from "@/components/loading/loading-context";
import TablePagination from "@/components/table-pagination";
import TableTopToolbar from "@/components/table-top-toolbar";
import { BreadcrumbType, TableShortList, TableThModel } from "@/lib/model-types";
import { useSmartLink } from "@/lib/smart-link";
import { copyToClipboard, eventStatusLabels, formatDate, normalizeSelectObj, showConfirm, sortListToOrderBy, toast } from "@/lib/utils";
import { CancelOrderEvent, GetDataEvents } from "@/server/event";
import { Events, TemplateCaptures, Templates } from "@/generated/prisma";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import clsx from "clsx";
import Badge from "@/components/ui/badge";

export default function Page() {
  const smartLink = useSmartLink();
  const listBr: BreadcrumbType[] = [
    { name: "My Events", url: null },
    { name: "All Events", url: "/client/events" },
  ];
  const { setLoading } = useLoading();
  const { data, status } = useSession();

  // Start Master
  const [inputPage, setInputPage] = useState("1");
  const [pageTable, setPageTable] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [totalPage, setTotalPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [datas, setDatas] = useState<(Events & {
    template: (Templates & { captures?: TemplateCaptures[] | null }) | null
  })[]>([]);
  const [inputSearch, setInputSearch] = useState("");
  const [tblSortList, setTblSortList] = useState<TableShortList[]>([]);
  const [tblThColomns, setTblThColomns] = useState<TableThModel[]>([
    { name: "Slug", key: "tmp_code", key_sort: "tmp_code", IsVisible: true },
    { name: "Template", key: "template[name]", key_sort: "template.name", IsVisible: true },
    { name: "Category", key: "tmp_ctg", key_sort: "tmp_ctg", IsVisible: true },
    { name: "Price", key: "template[price]", key_sort: "template.price", IsVisible: true },
    { name: "Status", key: "tmp_status", key_sort: "tmp_status", IsVisible: true },
    { name: "Added At", key: "createdAt", key_sort: "createdAt", IsVisible: true },
  ]);
  const fatchDatas = async (page: number = pageTable, countPage: number = perPage) => {
    const selectObj = normalizeSelectObj(tblThColomns);
    const orderObj = sortListToOrderBy(tblSortList);

    selectObj.template = {
      select: {
        ...(selectObj.template?.select || {}),
        captures: {
          take: 1,
          orderBy: { index: "asc" },
          select: { file_path: true },
        },
      }
    };

    try {
      const result = await GetDataEvents({
        curPage: page,
        perPage: countPage,
        where: {
          user_id: Number(data?.user?.id),
          OR: [
            { tmp_code: { contains: inputSearch.trim(), mode: "insensitive" } },
          ]
        },
        select: {
          id: true,
          user_id: true,
          ...selectObj
        },
        orderBy: orderObj
      });
      setTotalPage(result.meta.totalPages);
      setTotalCount(result.meta.total);
      setPageTable(result.meta.page);
      setInputPage(result.meta.page.toString());

      setDatas(result.data);
    } catch (error: any) {
      toast({
        type: "warning",
        title: "Something's gone wrong",
        message: "We can't proccess your request, Please try again."
      });
    }
  };

  useEffect(() => {
    if (isFirstRender) return;
    if (tblSortList.length === 0) fatchDatas();
  }, [tblSortList]);
  useEffect(() => {
    if (isFirstRender) return;
    fatchDatas(1);
  }, [tblThColomns]);
  useEffect(() => {
    if (isFirstRender) return;
    const timer = setTimeout(() => {
      fatchDatas(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [inputSearch]);

  const [isFirstRender, setIsFirstRender] = useState(true);
  useEffect(() => {
    const firstInit = async () => {
      setLoading(false);
      await fatchDatas();
      setIsFirstRender(false);
    };
    if (data) firstInit();
  }, [data]);
  // End Master

  const deleteRow = async (id: number, userId: number) => {
    const confirmed = await showConfirm({
      title: 'Delete Confirmation?',
      message: 'Are your sure want to delete this record? You will not abel to undo this action!',
      confirmText: 'Yes, Delete',
      cancelText: 'No, Keep It',
      icon: 'bx bx-trash bx-tada text-red-500'
    });
    if (!confirmed) return;

    setLoading(true);
    try {
      await CancelOrderEvent(id);
      window.dispatchEvent(new CustomEvent("sidebar:refresh", {
        detail: {
          user_id: userId
        }
      }));
      await fatchDatas();

      toast({
        type: "success",
        title: "Deletion Complete",
        message: "The selected data has been removed successfully"
      });
    } catch (error: any) {
      toast({
        type: "warning",
        title: "Something's gone wrong",
        message: "We can't proccess your request, Please try again"
      });
    }
    setLoading(false);
  };

  return (
    <>
      <div className="py-2 px-4 flex flex-wrap justify-between items-center gap-2 bg-white border-b border-gray-200">
        <div>
          <h1 className="text-sm font-medium text-muted">
            My Events
          </h1>
        </div>

        <div className="flex items-center gap-x-5">
          <BreadcrumbList listBr={listBr} />
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300">
        <div className="flex-1 flex flex-col lg:flex-row">
          <div className="flex-1 min-w-0 flex flex-col border-e border-gray-200 p-4">
            <TableTopToolbar
              tblDesc="List template to manage your event invitation data"
              inputSearch={inputSearch}
              tblSortList={tblSortList}
              thColomn={tblThColomns}
              setTblThColomns={setTblThColomns}
              setTblSortList={setTblSortList}
              setInputSearch={setInputSearch}
              fatchData={() => fatchDatas(pageTable)}
            />

            <div className="flex flex-col pt-5 pb-4 px-1.5">
              <div className="-m-1.5 overflow-x-auto">
                <div className="min-w-full inline-block align-middle">
                  <div className="border border-gray-200 rounded-lg shadow-xs overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-3 py-2.5 text-start text-xs font-medium text-gray-500 uppercase">#</th>
                          <th scope="col" className="px-3 py-2.5 text-start text-xs font-medium text-gray-500 uppercase">Picture</th>
                          {
                            tblThColomns.map((x, i) => {
                              if (x.IsVisible) return <th key={x.key} scope="col" className="px-3 py-2.5 text-start text-xs font-medium text-gray-500 uppercase">{x.name}</th>
                            })
                          }
                          <th scope="col" className="px-3 py-2.5 text-end text-xs font-medium text-gray-500 uppercase">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {
                          datas.map((data, i) => (
                            <tr key={data.id} className="hover:bg-gray-50 dark:hover:bg-neutral-700">
                              <td className="px-3 py-2.5 whitespace-nowrap text-sm font-medium text-gray-800">{(pageTable - 1) * perPage + i + 1}</td>
                              <td className="px-3 py-2.5 whitespace-nowrap text-sm font-medium text-gray-800">
                                <img src={data.template?.captures ? data.template?.captures[0].file_path : ""} alt="Capture" className="w-48" />
                              </td>

                              {'tmp_code' in data && <td className="px-3 py-2.5 whitespace-nowrap text-sm text-gray-800">
                                <span className="inline-flex items-center gap-x-1.5 py-1.5 px-3 rounded-md text-xs font-medium bg-gray-100 text-gray-800">
                                  {data.tmp_code}
                                  <i onClick={async () => {
                                    await copyToClipboard(data.tmp_code);
                                    toast({
                                      type: "success",
                                      title: "Copy to Clipboard",
                                      message: "Well done, Text copied to clipboard.",
                                      duration: 3000
                                    });
                                  }} className='bx bx-copy-alt text-base text-blue-600 cursor-pointer'></i>
                                </span>
                              </td>}
                              {'template' in data && data.template?.name && <td className="px-3 py-2.5 whitespace-nowrap text-sm text-gray-800"><div className="truncate max-w-45">{data.template.name}</div></td>}
                              {'tmp_ctg' in data && <td className="px-3 py-2.5 whitespace-nowrap text-sm text-gray-800">{data.tmp_ctg}</td>}
                              {'template' in data && data.template?.price && <td className="px-3 py-2.5 whitespace-nowrap text-sm text-gray-800">Rp {data.template.price.toLocaleString("id-ID")}</td>}
                              {'tmp_status' in data && <td className="px-3 py-2.5 whitespace-nowrap text-sm text-gray-800">
                                {data.tmp_status ? <Badge label={eventStatusLabels[data.tmp_status].name} status={eventStatusLabels[data.tmp_status].color} /> : "-"}
                              </td>}
                              {'createdAt' in data && <td className="px-3 py-2.5 whitespace-nowrap text-sm text-gray-800">{data.createdAt ? formatDate(data.createdAt, "medium") : "-"}</td>}

                              <td className="px-3 py-2.5 whitespace-nowrap text-end text-sm font-medium space-x-1">
                                <Link href={`/client/events/event-detail?code=${data.tmp_code}`} onClick={() => smartLink("/client/events/event-detail")}>
                                  <i className='bx bx-edit text-lg text-amber-500 cursor-pointer'></i>
                                </Link>
                                {
                                  (data.tmp_status && (data.tmp_status === "NOT_PAID" || data.tmp_status === "PENDING")) && <i onClick={() => deleteRow(data.id, data.user_id)} className='bx bx-trash text-lg text-red-600 cursor-pointer'></i>
                                }
                              </td>
                            </tr>
                          ))
                        }
                        {
                          isFirstRender === false && datas.length === 0 && <tr>
                            <td className="px-3 py-2.5 text-center text-muted text-sm" colSpan={tblThColomns.length + 3}><i>No data found!</i></td>
                          </tr>
                        }
                        {
                          isFirstRender === true && <tr>
                            <td className="text-center p-0" colSpan={tblThColomns.length + 3}>
                              <div className="animate-pulse h-62.5 w-full bg-gray-200 rounded-none dark:bg-neutral-700"></div>
                            </td>
                          </tr>
                        }
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            <TablePagination
              perPage={perPage}
              pageTable={pageTable}
              totalPage={totalPage}
              totalCount={totalCount}
              setPerPage={setPerPage}
              setPageTable={setPageTable}
              fatchData={fatchDatas}

              inputPage={inputPage}
              setInputPage={setInputPage}
            />

            {/* <div className='w-full h-[50vh] flex items-end justify-center text-center'>
              <div className='max-w-3xl px-4 xl:px-0 mx-auto'>
                <h1 className="text-xl md:text-3xl font-bold mb-3 drop-shadow-lg">
                  You haven't created any invitation yet!
                </h1>
                <p className="mb-8 text-muted">
                  Here's you can manage and create your own online invitations. Choose from any collection of wedding, birthday, party and other template for your special moment.
                </p>

                <Link href="/catalog" onClick={() => smartLink("/catalog")} type="button" className="py-2 px-4 inline-flex items-center gap-x-1 btn-color-app font-medium text-sm text-nowrap text-white rounded-lg focus:outline-hidden hover:scale-103 active:scale-100">
                  Create One
                </Link>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </>
  )
}