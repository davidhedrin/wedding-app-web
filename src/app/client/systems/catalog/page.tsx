"use client";

import BreadcrumbList from '@/components/breadcrumb-list';
import { useLoading } from '@/components/loading/loading-context';
import Tiptap from '@/components/rich-text/tiptap';
import TablePagination from '@/components/table-pagination';
import TableTopToolbar from '@/components/table-top-toolbar';
import UiPortal from '@/components/ui-portal';
import Input from '@/components/ui/input';
import Select from '@/components/ui/select';
import { ZodErrors } from '@/components/zod-errors';
import Configs, { CategoryKeys } from '@/lib/config';
import { DtoCaptureTemplate, DtoTemplates } from '@/lib/dto';
import { BreadcrumbType, FormState, TableShortList, TableThModel } from '@/lib/model-types';
import { formatDate, inputFormatPriceIdr, modalAction, normalizeSelectObj, parseFromIDR, showConfirm, sortListToOrderBy, toast } from '@/lib/utils';
import { DeleteDataTemplates, GetDataTemplates, GetDataTemplatesById, StoreUpdateDataTemplates } from '@/server/systems/catalog';
import { Templates } from '@prisma/client';
import Link from 'next/link';
import { useEffect, useState } from 'react'
import z from 'zod';

export default function Page() {
  const listBr: BreadcrumbType[] = [
    { name: "Systems", url: null },
    { name: "Catalog", url: "/client/catalog" },
  ];
  const { setLoading } = useLoading();
  const categoryTemplate = CategoryKeys.filter((item) => item.status === true);

  // Start Master
  const [inputPage, setInputPage] = useState("1");
  const [pageTable, setPageTable] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [totalPage, setTotalPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [datas, setDatas] = useState<Templates[]>([]);
  const [inputSearch, setInputSearch] = useState("");
  const [tblSortList, setTblSortList] = useState<TableShortList[]>([]);
  const [tblThColomns, setTblThColomns] = useState<TableThModel[]>([
    { name: "Slug", key: "slug", key_sort: "fullname", IsVisible: true },
    { name: "Name", key: "name", key_sort: "email", IsVisible: true },
    { name: "Price", key: "price", key_sort: "role", IsVisible: true },
    { name: "Category", key: "ctg_name", key_sort: "no_phone", IsVisible: true },
    { name: "URL", key: "url", key_sort: "is_active", IsVisible: true },
    { name: "Status", key: "is_active", key_sort: "is_active", IsVisible: true },
    { name: "Created At", key: "createdAt", key_sort: "createdAt", IsVisible: true },
  ]);
  const fatchDatas = async (page: number = pageTable, countPage: number = perPage) => {
    const selectObj = normalizeSelectObj(tblThColomns);
    const orderObj = sortListToOrderBy(tblSortList);

    try {
      const result = await GetDataTemplates({
        curPage: page,
        perPage: countPage,
        where: {
          OR: [
            { slug: { contains: inputSearch.trim(), mode: "insensitive" } },
            { name: { contains: inputSearch.trim(), mode: "insensitive" } },
          ]
        },
        select: {
          id: true,
          disc_price: true,
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

  const [txtName, setTxtName] = useState("");
  const [txtCategory, setTxtCategory] = useState("");
  const [txtPrice, setTxtPrice] = useState("");
  const [txtDiscPrice, setTxtDiscPrice] = useState("");
  const [txtFlagName, setTxtFlagName] = useState("");
  const [txtFlagColor, setTxtFlagColor] = useState("");
  const [txtShortDesc, setTxtShortDesc] = useState("");
  const [txtDesc, setTxtDesc] = useState<string | undefined>();
  const [txtPrevUrl, setTxtPrevUrl] = useState("");
  const [isActive, setIsActive] = useState("");

  const [filesCapture, setFilesCapture] = useState<DtoCaptureTemplate[]>([]);
  const handleFileCaptureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);

      const allowedTypes = ["image/jpg", "image/jpeg", "image/png"];
      const maxSizeInMB = Configs.maxSizePictureInMB;
      const maxSizeInBytes = maxSizeInMB * 1024 * 1024;

      const validFiles: File[] = [];
      let invalidType = false;
      let invalidSize = false;

      newFiles.forEach((file) => {
        // Validasi tipe file
        if (!allowedTypes.includes(file.type)) {
          invalidType = true;
          return;
        };

        // Validasi ukuran file
        if (file.size > maxSizeInBytes) {
          invalidSize = true;
          return;
        };

        // Jika file valid, masukkan ke array
        validFiles.push(file);
      });

      let message = '';
      if (invalidType) {
        message += 'Some files an invalid file type are allowed';
      }
      if (invalidSize) {
        if (message) message += ' and, ';
        message += `Some files too large, They must be less than ${maxSizeInMB}MB.`;
      }
      if (invalidType || invalidSize) toast({
        type: "warning",
        title: "Invalid File",
        message: message
      });

      const setFiles = validFiles.map((x, i) => ({ id: null, file: x, file_name: null, file_path: null, idx: i }));
      setFilesCapture((prevFiles) => [...prevFiles, ...setFiles]);
    }
  };
  const handleRemoveImageCapture = (index: number) => {
    setFilesCapture((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };
  const handleDragOverCapture = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.add('bg-gray-100', 'rounded-xl');
  };
  const handleDropCapture = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove('bg-gray-100', 'rounded-xl');

    const droppedFiles = e.dataTransfer.files;
    handleFileCaptureChange({ target: { files: droppedFiles } } as any);
  };
  const handleDragLeaveCapture = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove('bg-gray-100', 'rounded-xl');
  };

  const createDtoData = (): DtoTemplates => {
    const newData: DtoTemplates = {
      id: addEditId,
      name: txtName,
      price: parseFromIDR(txtPrice),
      disc_price: parseFromIDR(txtDiscPrice),
      short_desc: txtShortDesc.trim() != "" ? txtShortDesc : null,
      desc: txtDesc ?? null,
      ctg_key: txtCategory.trim() != "" ? txtCategory : null,
      url: txtPrevUrl,
      flag_name: txtFlagName.trim() != "" ? txtFlagName : null,
      flag_color: txtFlagColor.trim() != "" ? txtFlagColor : null,

      is_active: isActive === "true" ? true : false,
      captures: filesCapture,
    };
    return newData;
  };

  const openModalAddEdit = async (id?: number) => {
    if (id) {
      setLoading(true);
      const data = await GetDataTemplatesById(id);
      if (data) {
        setAddEditId(data.id);
        setIsActive(data.is_active != null ? data.is_active.toString() : "");
        setTxtName(data.name);
        setTxtCategory(data.ctg_key || "");
        setTxtPrice(data.price ? data.price.toLocaleString('id-ID') : "");
        setTxtDiscPrice(data.disc_price ? data.disc_price.toLocaleString('id-ID') : "");
        setTxtFlagName(data.flag_name || "");
        setTxtFlagColor(data.flag_color || "");
        setTxtShortDesc(data.short_desc || "");
        setTxtPrevUrl(data.url);
        setTxtDesc(data.desc || undefined);

        const setCaptures: DtoCaptureTemplate[] = data.captures.map((x, i) => ({
          id: x.id, file: null, file_name: x.file_name, file_path: x.file_path, idx: i
        }));
        setFilesCapture(setCaptures);
      }
      setLoading(false);
    } else {
      setAddEditId(null);
      setIsActive("");
      setTxtName("");
      setTxtCategory("");
      setTxtPrice("");
      setTxtDiscPrice("");
      setTxtFlagName("");
      setTxtFlagColor("");
      setTxtShortDesc("");
      setTxtPrevUrl("");
      setTxtDesc(undefined);
      setFilesCapture([]);
    }
    setStateFormAddEdit({ success: true, errors: {} });
    modalAction(`btn-${modalAddEdit}`);
  };

  const FormSchemaAddEdit = z.object({
    is_active: z.string().min(1, { message: 'Status is required field.' }).trim(),
    name: z.string().min(1, { message: 'Template name required field.' }).trim(),
    category: z.string().min(1, { message: 'Category required field.' }).trim(),
    price: z.string().min(1, { message: 'Price required field.' }).trim(),
    url_preview: z.string().min(1, { message: 'URL preview required field.' }).trim(),
    preview_capture: z.string().min(1, { message: 'At least one preview capture is required.' }).trim(),
  });
  const handleSubmitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    formData.append("preview_capture", "");
    if (filesCapture.length > 0) formData.append("preview_capture", filesCapture.length.toString());

    const data = Object.fromEntries(formData);
    const valResult = FormSchemaAddEdit.safeParse(data);
    if (!valResult.success) {
      setStateFormAddEdit({
        success: false,
        errors: valResult.error.flatten().fieldErrors,
      });
      return;
    };
    setStateFormAddEdit({ success: true, errors: {} });

    modalAction(btnCloseModal);
    const confirmed = await showConfirm({
      title: 'Submit Confirmation?',
      message: 'Are you sure you want to submit this form? Please double-check before proceeding!',
      confirmText: 'Yes, Submit',
      cancelText: 'No, Go Back',
      icon: 'bx bx-error bx-tada text-blue-500'
    });
    if (!confirmed) {
      modalAction(`btn-${modalAddEdit}`);
      return;
    }

    setLoading(true);
    try {
      await StoreUpdateDataTemplates(createDtoData());
      await fatchDatas();
      toast({
        type: "success",
        title: "Submit successfully",
        message: "Your submission has been successfully completed"
      });
    } catch (error: any) {
      toast({
        type: "warning",
        title: "Request Failed",
        message: error.message
      });
      modalAction(`btn-${modalAddEdit}`);
    }
    setLoading(false);
  };

  const deleteRow = async (id: number) => {
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
      await DeleteDataTemplates(id);
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
          <h1 className="text-sm font-medium text-gray-800">
            Catalog
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
              tblDesc="List catalog template to manage your data"
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

                              {'slug' in data && <td className="px-3 py-2.5 whitespace-nowrap text-sm text-gray-800">
                                <span className="inline-flex items-center gap-x-1.5 py-1.5 px-3 rounded-md text-xs font-medium bg-gray-100 text-gray-800">{data.slug}</span>
                              </td>}
                              {'name' in data && <td className="px-3 py-2.5 whitespace-nowrap text-sm text-gray-800">{data.name}</td>}
                              {'price' in data && <td className="px-3 py-2.5 whitespace-nowrap text-sm text-gray-800">Rp {(data.price - (data.disc_price ?? 0)).toLocaleString('id-ID')}</td>}
                              {'ctg_name' in data && <td className="px-3 py-2.5 whitespace-nowrap text-sm text-gray-800">{data.ctg_name || "-"}</td>}
                              {'url' in data && <td className="px-3 py-2.5 whitespace-nowrap text-sm text-gray-800">
                                <Link href={`${Configs.base_url}/${data.url}`} target='_blank'>{data.url}</Link>
                              </td>}
                              {
                                'is_active' in data && <td className={`px-3 py-2.5 whitespace-nowrap text-sm ${data.is_active === true ? "text-green-600" : "text-red-600"}`}>
                                  {data.is_active === true ? "Active" : "Inactive"}
                                </td>
                              }
                              {'createdAt' in data && <td className="px-3 py-2.5 whitespace-nowrap text-sm text-gray-800">{data.createdAt ? formatDate(data.createdAt, "medium") : "-"}</td>}

                              <td className="px-3 py-2.5 whitespace-nowrap text-end text-sm font-medium space-x-1">
                                <i onClick={() => openModalAddEdit(data.id)} className='bx bx-edit text-lg text-amber-500 cursor-pointer'></i>
                                <i onClick={() => deleteRow(data.id)} className='bx bx-trash text-lg text-red-600 cursor-pointer'></i>
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
            <form onSubmit={handleSubmitForm} className="max-h-full overflow-hidden w-full flex flex-col bg-white border border-gray-200 shadow-2xs rounded-xl pointer-events-auto">
              <div className="flex justify-between items-center py-2 px-4 border-b border-gray-200">
                <div>
                  <div className="flex items-center gap-1 text-sm mb-0.5">
                    <i className='bx bx-customize text-lg'></i> {addEditId ? "Edit" : "Add"} Catalog Template
                  </div>
                  <p className='text-xs text-muted'>Here form to register or edit cataglog template</p>
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
                  <div className='col-span-12'>
                    <Input value={txtName} onChange={(e) => setTxtName(e.target.value)} type='text' className='py-1.5' id='name' label='Name' placeholder='Enter template name' mandatory />
                    {stateFormAddEdit.errors?.name && <ZodErrors err={stateFormAddEdit.errors?.name} />}
                  </div>
                  <div className='col-span-12 md:col-span-6'>
                    <Select value={isActive} onChange={(e) => setIsActive(e.target.value)} className='py-1.5' id='is_active' label='Status' placeholder='Select template status' mandatory
                      options={[
                        { label: "Active", value: "true" },
                        { label: "Inactive", value: "false" },
                      ]}
                    />
                    {stateFormAddEdit.errors?.is_active && <ZodErrors err={stateFormAddEdit.errors?.is_active} />}
                  </div>
                  <div className='col-span-12 md:col-span-6'>
                    <Select value={txtCategory} onChange={(e) => setTxtCategory(e.target.value)} className='py-1.5' id='category' label='Category' placeholder='Select template category' mandatory
                      options={categoryTemplate.map(x => ({ label: x.name, value: x.key }))}
                    />
                    {stateFormAddEdit.errors?.category && <ZodErrors err={stateFormAddEdit.errors?.category} />}
                  </div>
                  <div className='col-span-12 md:col-span-6'>
                    <Input value={txtPrice} onChange={(e) => setTxtPrice(inputFormatPriceIdr(e.target.value) || "")} type='text' className='py-1.5 input-no-spinner' id='price' label='Price' placeholder='Enter template price' mandatory />
                    {stateFormAddEdit.errors?.price && <ZodErrors err={stateFormAddEdit.errors?.price} />}
                  </div>
                  <div className='col-span-12 md:col-span-6'>
                    <Input value={txtDiscPrice} onChange={(e) => setTxtDiscPrice(inputFormatPriceIdr(e.target.value) || "")} type='text' className='py-1.5 input-no-spinner' id='disc_price' label='Discount' placeholder='Enter discount price' />
                  </div>
                  <div className='col-span-12 md:col-span-6'>
                    <Input value={txtFlagName} onChange={(e) => setTxtFlagName(e.target.value)} type='text' className='py-1.5' id='flag_name' label='Flag Name' placeholder='Enter flag information' />
                  </div>
                  <div className='col-span-12 md:col-span-6'>
                    <Select value={txtFlagColor} onChange={(e) => setTxtFlagColor(e.target.value)} className='py-1.5' id='flag_color' label='Flag Color' placeholder='Select flag color'
                      options={[
                        { label: "Success", value: "success" },
                        { label: "Warning", value: "warning" },
                        { label: "Secondary", value: "secondary" },
                        { label: "Primary", value: "primary" },
                        { label: "Danger", value: "danger" },
                      ]}
                    />
                  </div>
                  <div className='col-span-12'>
                    <Input value={txtPrevUrl} onChange={(e) => setTxtPrevUrl(e.target.value)} prefixGroup={<span>{Configs.base_url + "/"}</span>} type='text' className='py-1.5' id='url_preview' label='Preview URL' placeholder='Enter preview url template' mandatory />
                    {stateFormAddEdit.errors?.url_preview && <ZodErrors err={stateFormAddEdit.errors?.url_preview} />}
                  </div>
                  <div className='col-span-12'>
                    <Input value={txtShortDesc} onChange={(e) => setTxtShortDesc(e.target.value)} type='text' className='py-1.5' id='short_desc' label='Short Desc' placeholder='Enter short descripion if any' />
                  </div>
                  <div className='col-span-12'>
                    <Tiptap content={txtDesc || ""} setContent={setTxtDesc} label='Description' placeholder="Enter template description if any" className="min-h-24" />
                  </div>
                  <div className='col-span-12'>
                    <label className="block text-sm font-medium mb-1 dark:text-white">
                      Preview Captures<span className="text-red-500">*</span>
                      <p className='text-xs text-muted'>Select preview picture to showing in catalog template detail</p>
                    </label>

                    <div onDragOver={handleDragOverCapture} onDrop={handleDropCapture} onDragLeave={handleDragLeaveCapture}>
                      <label htmlFor="file-upload" className="cursor-pointer px-6 py-3 flex justify-center bg-transparent border-2 border-dashed border-gray-300 rounded-xl" data-hs-file-upload-trigger="">
                        <div className="text-center">
                          <span className="inline-flex justify-center items-center">
                            <svg className="shrink-0 w-11 h-auto" width="71" height="51" viewBox="0 0 71 38" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M6.55172 8.74547L17.7131 6.88524V40.7377L12.8018 41.7717C9.51306 42.464 6.29705 40.3203 5.67081 37.0184L1.64319 15.7818C1.01599 12.4748 3.23148 9.29884 6.55172 8.74547Z" stroke="currentColor" strokeWidth="2" className="stroke-blue-600"></path>
                              <path d="M64.4483 8.74547L53.2869 6.88524V40.7377L58.1982 41.7717C61.4869 42.464 64.703 40.3203 65.3292 37.0184L69.3568 15.7818C69.984 12.4748 67.7685 9.29884 64.4483 8.74547Z" stroke="currentColor" strokeWidth="2" className="stroke-blue-600"></path>
                              <g filter="url(#filter4)">
                                <rect x="17.5656" y="1" width="35.8689" height="42.7541" rx="5" stroke="currentColor" strokeWidth="2" className="stroke-blue-600" shapeRendering="crispEdges"></rect>
                              </g>
                              <path d="M39.4826 33.0893C40.2331 33.9529 41.5385 34.0028 42.3537 33.2426L42.5099 33.0796L47.7453 26.976L53.4347 33.0981V38.7544C53.4346 41.5156 51.1959 43.7542 48.4347 43.7544H22.5656C19.8043 43.7544 17.5657 41.5157 17.5656 38.7544V35.2934L29.9728 22.145L39.4826 33.0893Z" className="fill-blue-50 stroke-blue-600" fill="currentColor" stroke="currentColor" strokeWidth="2"></path>
                              <circle cx="40.0902" cy="14.3443" r="4.16393" className="fill-blue-50 stroke-blue-600" fill="currentColor" stroke="currentColor" strokeWidth="2"></circle>
                            </svg>
                          </span>

                          <div className="flex flex-wrap justify-center text-sm/6 text-gray-600">
                            <span className="pe-1 font-medium text-gray-800">
                              Drop file here or click to
                            </span>
                            <span className="font-semibold text-blue-600 hover:text-blue-700 rounded-lg decoration-2 hover:underline focus-within:outline-hidden focus-within:ring-2 focus-within:ring-blue-600 focus-within:ring-offset-2">
                              browse
                            </span>
                          </div>

                          <p className="text-xs text-gray-400">Allowed formats JPG, JPEG, PNG up to 1MB</p>
                        </div>
                        <input
                          type="file"
                          multiple
                          onChange={handleFileCaptureChange}
                          id="file-upload"
                          className="hidden"
                          accept="image/jpeg, image/png, image/jpg"
                        />
                      </label>
                    </div>

                    {/* Showing all file selected */}
                    {
                      filesCapture.length > 0 && <div className="image-preview-grid grid grid-cols-2 gap-4 mt-2 md:grid-cols-4">
                        {filesCapture.map((x, index) => (
                          (x.file || x.file_path) && <div key={index} className="relative border border-gray-300 rounded-lg">
                            {
                              x.file && <img
                                src={URL.createObjectURL(x.file)}
                                alt={`Preview ${index}`}
                                className="w-full h-24 object-cover rounded-lg"
                              />
                            }
                            {
                              x.file_path && <img
                                src={x.file_path}
                                alt={`Preview ${index}`}
                                className="w-full h-24 object-cover rounded-lg"
                              />
                            }

                            <button
                              type="button"
                              onClick={() => handleRemoveImageCapture(index)}
                              className="leading-none absolute top-1 right-1 text-white bg-red-500 hover:bg-red-600 rounded-full px-1 h-6"
                            >
                              <i className="bx bx-x"></i>
                            </button>
                          </div>
                        ))}
                      </div>
                    }
                    {stateFormAddEdit.errors?.preview_capture && <ZodErrors err={stateFormAddEdit.errors?.preview_capture} />}
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