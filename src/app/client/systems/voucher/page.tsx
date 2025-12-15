"use client";

import BreadcrumbList from "@/components/breadcrumb-list";
import { useLoading } from "@/components/loading/loading-context";
import TablePagination from "@/components/table-pagination";
import TableTopToolbar from "@/components/table-top-toolbar";
import UiPortal from "@/components/ui-portal";
import Input from "@/components/ui/input";
import Select from "@/components/ui/select";
import { DiscTypeEnum, Vouchers } from "@/generated/prisma";
import { BreadcrumbType, FormState, TableShortList, TableThModel } from "@/lib/model-types";
import { discTypeLabels, formatDate, modalAction, normalizeSelectObj, sortListToOrderBy, toast } from "@/lib/utils";
import { GetDataVouchers } from "@/server/systems/voucher";
import { useEffect, useState } from "react";

export default function Page() {
  const listBr: BreadcrumbType[] = [
    { name: "Systems", url: null },
    { name: "Vouchers", url: "/client/voucher" },
  ];
  const { setLoading } = useLoading();


  // Start Master
  const [inputPage, setInputPage] = useState("1");
  const [pageTable, setPageTable] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [totalPage, setTotalPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [datas, setDatas] = useState<Vouchers[]>([]);
  const [inputSearch, setInputSearch] = useState("");
  const [tblSortList, setTblSortList] = useState<TableShortList[]>([]);
  const [tblThColomns, setTblThColomns] = useState<TableThModel[]>([
    { name: "Code", key: "code", key_sort: "code", IsVisible: true },
    { name: "Discount", key: "disc_amount", key_sort: "disc_amount", IsVisible: true },
    { name: "Availabel", key: "total_qty", key_sort: "total_qty", IsVisible: true },
    { name: "Date From", key: "valid_from", key_sort: "valid_from", IsVisible: true },
    { name: "Date Until", key: "valid_to", key_sort: "valid_to", IsVisible: true },
    { name: "Created At", key: "createdAt", key_sort: "createdAt", IsVisible: true },
  ]);
  const fatchDatas = async (page: number = pageTable, countPage: number = perPage) => {
    const selectObj = normalizeSelectObj(tblThColomns);
    const orderObj = sortListToOrderBy(tblSortList);

    try {
      const result = await GetDataVouchers({
        curPage: page,
        perPage: countPage,
        where: {
          OR: [
            { slug: { contains: inputSearch.trim(), mode: "insensitive" } },
            { code: { contains: inputSearch.trim(), mode: "insensitive" } },
          ]
        },
        select: {
          id: true,
          disc_type: true,
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
    firstInit();
  }, []);
  // End Master

  // Modal Add & Edit
  const modalAddEdit = "modal-add-edit";
  const btnCloseModal = "btn-close-modal";
  const [stateFormAddEdit, setStateFormAddEdit] = useState<FormState>({ success: false, errors: {} });
  const [addEditId, setAddEditId] = useState<number | null>(null);

  const openModalAddEdit = async (id?: number) => {
    if (id) {
      setLoading(true);
      // const data = await GetDataTemplatesById(id);
      // if (data) {
      //   setAddEditId(data.id);
      //   setIsActive(data.is_active != null ? data.is_active.toString() : "");
      //   setTxtName(data.name);
      //   setTxtCategory(data.ctg_key ?? "");
      //   setTxtPrice(data.price ? data.price.toLocaleString('id-ID') : "");
      //   setTxtDiscPrice(data.disc_price ? data.disc_price.toLocaleString('id-ID') : "");
      //   setTxtFlagName(data.flag_name ?? "");
      //   setTxtFlagColor(data.flag_color ?? "");
      //   setTxtShortDesc(data.short_desc ?? "");
      //   setTxtPrevUrl(data.url);
      //   setTxtDesc(data.desc ?? undefined);

      //   setTxtLanguage(data.language ?? "");
      //   setTxtLayouts(data.layouts ?? "");

      //   const colorsParse: Color[] = data.colors !== null ? JSON.parse(data.colors) : [];
      //   setTemplateColors(colorsParse);
      // }
      setLoading(false);
    } else {
      setAddEditId(null);
      // setIsActive("");
      // setTxtName("");
      // setTxtCategory("");
      // setTxtPrice("");
      // setTxtDiscPrice("");
      // setTxtFlagName("");
      // setTxtFlagColor("");
      // setTxtShortDesc("");
      // setTxtPrevUrl("");
      // setTxtDesc(undefined);
      // setFilesCapture([]);
      // setTxtLanguage("");
      // setTxtLayouts("");
      // setTemplateColors([]);
    }
    setStateFormAddEdit({ success: true, errors: {} });
    modalAction(`btn-${modalAddEdit}`);
  };

  return (
    <>
      <div className="py-2 px-4 flex flex-wrap justify-between items-center gap-2 bg-white border-b border-gray-200">
        <div>
          <h1 className="text-sm font-medium text-gray-800">
            Vouchers Management
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
              tblDesc="List discount voucher to manage your data"
              inputSearch={inputSearch}
              tblSortList={tblSortList}
              thColomn={tblThColomns}
              setTblThColomns={setTblThColomns}
              setTblSortList={setTblSortList}
              setInputSearch={setInputSearch}
              fatchData={() => fatchDatas(pageTable)}

              openModal={openModalAddEdit}
            />

            <div className="flex flex-col pt-5 pb-4 px-1.5">
              <div className="-m-1.5 overflow-x-auto">
                <div className="min-w-full inline-block align-middle">
                  <div className="border border-gray-200 rounded-lg shadow-xs overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-3 py-2.5 text-start text-xs font-medium text-gray-500 uppercase">#</th>
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

                              {'code' in data && <td className="px-3 py-2.5 whitespace-nowrap text-sm text-gray-800">{data.code}</td>}
                              {'disc_amount' in data && <td className="px-3 py-2.5 whitespace-nowrap text-sm text-gray-800">
                                {
                                  data.disc_type === DiscTypeEnum.AMOUNT ? `Rp ${data.disc_amount.toLocaleString('id-ID')}` : data.disc_type === DiscTypeEnum.PERCENT ? `${data.disc_amount}%` : "-"
                                }
                              </td>}
                              {'total_qty' in data && <td className="px-3 py-2.5 whitespace-nowrap text-sm text-gray-800">{data.total_qty} Voucher</td>}
                              {'valid_from' in data && <td className="px-3 py-2.5 whitespace-nowrap text-sm text-gray-800">{formatDate(data.valid_from, "medium", "short")}</td>}
                              {'valid_to' in data && <td className="px-3 py-2.5 whitespace-nowrap text-sm text-gray-800">{formatDate(data.valid_to, "medium", "short")}</td>}
                              {'createdAt' in data && <td className="px-3 py-2.5 whitespace-nowrap text-sm text-gray-800">{data.createdAt ? formatDate(data.createdAt, "medium") : "-"}</td>}

                              <td className="px-3 py-2.5 whitespace-nowrap text-end text-sm font-medium space-x-1">
                                <i className='bx bx-edit text-lg text-amber-500 cursor-pointer'></i>
                                <i className='bx bx-trash text-lg text-red-600 cursor-pointer'></i>
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
                              <div className="animate-pulse h-[250px] w-full bg-gray-200 rounded-none dark:bg-neutral-700"></div>
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
          </div>
        </div>
      </div>

      <button id={`btn-${modalAddEdit}`} type="button" className="hidden" aria-haspopup="dialog" aria-expanded="false" aria-controls={modalAddEdit} data-hs-overlay={`#${modalAddEdit}`}>
        <i className='bx bx-plus-circle text-lg'></i> New
      </button>
      <UiPortal>
        <div id={modalAddEdit} className="hs-overlay hidden size-full fixed bg-black/30 top-0 start-0 z-80 overflow-x-hidden overflow-y-auto pointer-events-none" role="dialog">
          <div className="sm:max-w-lg hs-overlay-open:mt-7 hs-overlay-open:opacity-100 hs-overlay-open:duration-500 mt-0 opacity-0 ease-out transition-all sm:w-full m-3 h-[calc(100%-56px)] sm:mx-auto flex items-center">
            <form className="max-h-full overflow-hidden w-full flex flex-col bg-white border border-gray-200 shadow-2xs rounded-xl pointer-events-auto">
              <div className="flex justify-between items-center py-2 px-4 border-b border-gray-200">
                <div>
                  <div className="flex items-center gap-1 text-sm mb-0.5">
                    <i className='bx bxs-coupon text-lg'></i> {addEditId ? "Edit" : "Add"} Vouchers
                  </div>
                  <p className='text-xs text-muted'>Here form to register or edit Voucher data</p>
                </div>
                <button type="button" className="size-8 inline-flex justify-center items-center gap-x-2 rounded-full border border-transparent bg-gray-100 text-gray-800 hover:bg-gray-200 focus:outline-hidden focus:bg-gray-200 disabled:opacity-50 disabled:pointer-events-none" aria-label="Close" data-hs-overlay={`#${modalAddEdit}`}>
                  <span className="sr-only">Close</span>
                  <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 6 6 18"></path>
                    <path d="m6 6 12 12"></path>
                  </svg>
                </button>
              </div>
              <div className="py-3 px-4 overflow-y-auto">
                <div className="grid grid-cols-12 gap-3">
                  <div className="col-span-12 md:col-span-6">
                    <Input type='text' className='py-1.5' id='code' label='Code' placeholder='Enter voucher code' mandatory />
                    {/* {stateFormAddEdit.errors?.name && <ZodErrors err={stateFormAddEdit.errors?.name} />} */}
                  </div>
                  <div className="col-span-12 md:col-span-6">
                    <Select className='py-1.5' id='is_active' label='Status' placeholder='Select voucher status' mandatory
                      options={[
                        { label: "Active", value: "true" },
                        { label: "Inactive", value: "false" },
                      ]}
                    />
                    {/* {stateFormAddEdit.errors?.is_active && <ZodErrors err={stateFormAddEdit.errors?.is_active} />} */}
                  </div>
                  <div className="col-span-12 md:col-span-6">
                    <div>
                      <Input
                        // value={voucherQty || ""}
                        // onChange={(e) => {
                        //   const val = e.target.value;

                        //   if (val === '') {
                        //     setVoucherQty(null);
                        //     return;
                        //   }

                        //   if (/^\d+$/.test(val)) {
                        //     var numVal = parseInt(val);
                        //     if (numVal > 0) setVoucherQty(numVal);
                        //   };
                        // }}
                        label="Voucher QTY"
                        type="number" id="voucher_qty" placeholder="Enter voucher quantity" className="input-no-spinner" mandatory
                      />
                      {/* {stateFormAddEdit.errors?.voucher_qty && <ZodErrors err={stateFormAddEdit.errors?.voucher_qty} />} */}
                    </div>
                  </div>
                  <div className="col-span-12 md:col-span-6">
                    <Select className='py-1.5' id='disc_type' label='Discount Type' placeholder='Select discount type' mandatory
                      options={
                        Object.values(DiscTypeEnum).map(x => ({ label: discTypeLabels[x], value: x }))
                      }
                    />
                    {/* {stateFormAddEdit.errors?.is_active && <ZodErrors err={stateFormAddEdit.errors?.is_active} />} */}
                  </div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 py-2.5 px-4 border-t border-gray-200">
                <div className="text-xs text-gray-500 sm:order-1 order-1 italic">
                  <p>Fields marked with <span className="text-red-500">*</span> are required.</p>
                </div>
                <div className="flex justify-start sm:justify-end gap-x-2 sm:order-2 order-2">
                  <button id={btnCloseModal} type="button" className="py-1.5 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-2xs hover:bg-gray-50 focus:outline-hidden focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none" data-hs-overlay={`#${modalAddEdit}`}>
                    Close
                  </button>
                  <button type="submit" className="py-1.5 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-hidden focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none">
                    Submit
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </UiPortal>
    </>
  )
}
