"use client";

import BreadcrumbList from '@/components/breadcrumb-list';
import { useLoading } from '@/components/loading/loading-context';
import Tiptap from '@/components/rich-text/tiptap';
import TablePagination from '@/components/table-pagination';
import TableTopToolbar from '@/components/table-top-toolbar';
import UiPortal from '@/components/ui-portal';
import Input from '@/components/ui/input';
import Select from '@/components/ui/select';
import Configs, { CategoryKeys } from '@/lib/config';
import { BreadcrumbType, FormState, TableShortList, TableThModel } from '@/lib/model-types';
import { formatDate, modalAction, normalizeSelectObj, sortListToOrderBy, toast } from '@/lib/utils';
import { GetDataTemplates } from '@/server/systems/catalog';
import { Templates } from '@prisma/client';
import Link from 'next/link';
import { useEffect, useState } from 'react'

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

  const [filesCapture, setFilesCapture] = useState<File[]>([]);
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

      setFilesCapture((prevFiles) => [...prevFiles, ...validFiles]);
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

  const openModalAddEdit = async (id?: number) => {
    if (id) {
      // setLoading(true);
      // const data = await GetDataUserById(id);
      // if (data) {
      //   setAddEditId(data.id);
      //   setIsActive(data.is_active != null ? data.is_active.toString() : "");
      //   setTxtEmail(data.email || "");
      //   setTxtName(data.fullname || "");
      //   setTxtRole(data.role);
      //   setTxtPhone(data.no_phone || "");
      //   setTxtGender(data.gender || "");
      //   setBirthDate(data.birth_date);
      //   setTxtBirthPlace(data.birth_place || "");
      //   setUrlPrevPP(data.image_path || undefined);
      //   setFilePP(null);
      // }
      // setLoading(false);
    } else {
      // setAddEditId(null);
      // setIsActive("");
      // setTxtEmail("");
      // setTxtName("");
      // setTxtRole("");
      // setTxtPhone("");
      // setTxtGender("");
      // setBirthDate(null);
      // setTxtBirthPlace("");
      // setFilePP(null);
      // setUrlPrevPP(undefined);
    }
    setStateFormAddEdit({ success: true, errors: {} });
    modalAction(`btn-${modalAddEdit}`);
  };

  const handleSubmitForm = async (e: React.FormEvent<HTMLFormElement>) => {
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
                                <Link href={data.url} target='_blank'>{data.url}</Link>
                              </td>}
                              {
                                'is_active' in data && <td className={`px-3 py-2.5 whitespace-nowrap text-sm ${data.is_active === true ? "text-green-600" : "text-red-600"}`}>
                                  {data.is_active === true ? "Active" : "Inactive"}
                                </td>
                              }
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
                {/* <div className="flex items-center justify-between gap-4 py-2 px-3 border border-gray-200 rounded-xl bg-white shadow-sm mb-3">
                  <div className="flex flex-col gap-1.5 text-sm w-full sm:w-auto">
                    <div>
                      <h3 className="font-medium text-gray-900 text-sm">Upload profile picture</h3>
                      <p className="text-gray-500 text-xs">
                        Allow file type JPG, JPEG or PNG. Max file size {Configs.maxSizePictureInMB}MB
                      </p>
                    </div>
                    <div className='flex gap-2 items-center'>
                      <label className="inline-block">
                        <Input onChange={handleFileProfilePictureChange} type="file" accept=".jpg,.jpeg,.png" className="sr-only" />
                        <span className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 cursor-pointer">
                          {(filePP !== null || urlPrevPP) ? "Change" : "Choose"} File
                        </span>
                      </label>
                      {
                        (filePP !== null || urlPrevPP) && <button onClick={() => handleRemoveProfilePicture()} type="button" className="py-1.5 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-red-100 text-red-800 hover:bg-red-200 focus:outline-hidden focus:bg-red-200 disabled:opacity-50 disabled:pointer-events-none">
                          <i className='bx bx-trash text-lg'></i>
                        </button>
                      }
                    </div>
                  </div>

                  <div className="flex-shrink-0">
                    <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                      {
                        urlPrevPP !== undefined && urlPrevPP !== null ? <img src={urlPrevPP} alt="profile" /> : <i className="bx bx-user text-2xl text-gray-500" />
                      }
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 grid-cols-1 gap-3">
                  <div>
                    <Select value={isActive} onChange={(e) => setIsActive(e.target.value)} className='py-1.5' id='is_active' label='Status' placeholder='Select user status' mandatory
                      options={[
                        { label: "Active", value: "true" },
                        { label: "Inactive", value: "false" },
                      ]}
                    />
                    {stateFormAddEdit.errors?.is_active && <ZodErrors err={stateFormAddEdit.errors?.is_active} />}
                  </div>
                  <div>
                    <Input disabled={addEditId !== null} value={txtEmail} onChange={(e) => setTxtEmail(e.target.value)} type='text' className='py-1.5' id='email' label='Email' placeholder='example@mail.com' mandatory />
                    {stateFormAddEdit.errors?.email && <ZodErrors err={stateFormAddEdit.errors?.email} />}
                  </div>
                  <div>
                    <Input value={txtName} onChange={(e) => setTxtName(e.target.value)} type='text' className='py-1.5' id='fullname' label='Fullname' placeholder='Ex. John Thor Doe' mandatory />
                    {stateFormAddEdit.errors?.fullname && <ZodErrors err={stateFormAddEdit.errors?.fullname} />}
                  </div>
                  <div>
                    <Select value={txtRole} onChange={(e) => setTxtRole(e.target.value)} className='py-1.5' id='role' label='Role' placeholder='Select user role' mandatory
                      options={Object.values(RolesEnum).map(x => ({ label: roleLabels[x], value: x }))}
                    />
                    {stateFormAddEdit.errors?.role && <ZodErrors err={stateFormAddEdit.errors?.role} />}
                  </div>
                  <Input value={txtPhone} onChange={(e) => setTxtPhone(e.target.value)} type='text' className='py-1.5' id='no_phone' label='No Phone' placeholder='Enter phone number' />
                  <Select value={txtGender} onChange={(e) => setTxtGender(e.target.value)} className='py-1.5' id='gender' label='Gender' placeholder='Select user gender'
                    options={[
                      { label: "Male", value: "Male" },
                      { label: "Female", value: "Female" },
                      { label: "Other", value: "Other" },
                    ]}
                  />
                  <DatePicker mode='single' value={birthDate || undefined} onChange={(date) => setBirthDate(date as Date)} label='Birth Date' />
                  <Input value={txtBirthPlace} onChange={(e) => setTxtBirthPlace(e.target.value)} type='text' className='py-1.5' id='birth_place' label='Birth Place' placeholder='Enter birth place' />
                </div> */}
                <div className="grid grid-cols-12 gap-3">
                  <div className='col-span-12'>
                    <Input type='text' className='py-1.5' id='name' label='Name' placeholder='Enter template name' mandatory />
                  </div>
                  <div className='col-span-12 md:col-span-6'>
                    <Select className='py-1.5' id='is_active' label='Status' placeholder='Select template status' mandatory
                      options={[
                        { label: "Active", value: "true" },
                        { label: "Inactive", value: "false" },
                      ]}
                    />
                    {/* {stateFormAddEdit.errors?.is_active && <ZodErrors err={stateFormAddEdit.errors?.is_active} />} */}
                  </div>
                  <div className='col-span-12 md:col-span-6'>
                    <Select className='py-1.5' id='category' label='Category' placeholder='Select template category' mandatory
                      options={categoryTemplate.map(x => ({ label: x.name, value: x.key }))}
                    />
                  </div>
                  <div className='col-span-12 md:col-span-6'>
                    <Input type='text' className='py-1.5' id='price' label='Price' placeholder='Enter template price' mandatory />
                  </div>
                  <div className='col-span-12 md:col-span-6'>
                    <Input type='text' className='py-1.5' id='disc_price' label='Discount' placeholder='Enter discount price' />
                  </div>
                  <div className='col-span-12 md:col-span-6'>
                    <Input type='text' className='py-1.5' id='flag_name' label='Flag Name' placeholder='Enter flag information' />
                  </div>
                  <div className='col-span-12 md:col-span-6'>
                    <Select className='py-1.5' id='flag_color' label='Flag Color' placeholder='Select flag color'
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
                    <Input type='text' className='py-1.5' id='short_desc' label='Short Desc' placeholder='Enter short descripion if any' />
                  </div>
                  <div className='col-span-12'>
                    <Tiptap label='Description' placeholder="Enter template description if any" className="min-h-24" />
                  </div>
                  <div className='col-span-12'>
                    <label className="block text-sm font-medium mb-1 dark:text-white">
                      Preview Captures<span className="text-red-500">*</span>
                      <p className='text-xs text-muted'>Select preview picture to showing in catalog template detail</p>
                    </label>

                    <div onDragOver={handleDragOverCapture} onDrop={handleDropCapture} onDragLeave={handleDragLeaveCapture}>
                      <label htmlFor="file-upload" className="cursor-pointer px-6 py-4 flex justify-center bg-transparent border-2 border-dashed border-gray-300 rounded-xl" data-hs-file-upload-trigger="">
                        <div className="text-center">
                          <span className="inline-flex justify-center items-center">
                            <svg className="shrink-0 w-12 h-auto" width="71" height="51" viewBox="0 0 71 51" fill="none" xmlns="http://www.w3.org/2000/svg">
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
                    <div className="image-preview-grid grid grid-cols-2 gap-4 mt-3 md:grid-cols-4">
                      {filesCapture.map((file, index) => (
                        <div key={index} className="relative">
                          <img
                            src={URL.createObjectURL(file)}
                            alt={`Preview ${index}`}
                            className="w-full h-24 object-cover rounded-lg"
                          />
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