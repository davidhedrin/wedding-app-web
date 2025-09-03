"use client";

import BreadcrumbList from '@/components/breadcrumb-list';
import { useLoading } from '@/components/loading/loading-context';
import TablePagination from '@/components/table-pagination';
import TableTopToolbar from '@/components/table-top-toolbar';
import UiPortal from '@/components/ui-portal';
import DatePicker from '@/components/ui/date-picker';
import Input from '@/components/ui/input';
import Select from '@/components/ui/select';
import { ZodErrors } from '@/components/zod-errors';
import Configs from '@/lib/config';
import { DtoUser } from '@/lib/dto';
import { BreadcrumbType, FormState, TableShortList, TableThModel } from '@/lib/model-types';
import { formatDate, modalAction, normalizeSelectObj, roleLabels, showConfirm, sortListToOrderBy, toast } from '@/lib/utils';
import { DeleteDataUser, GetDataUser, GetDataUserById, UpdateDataUser } from '@/server/systems/user-manage';
import { RolesEnum, User } from '@prisma/client';
import React, { useEffect, useState } from 'react'
import z from 'zod';

export default function Page() {
  const listBr: BreadcrumbType[] = [
    { name: "Systems", url: null },
    { name: "Catalog", url: "/client/catalog" },
  ];
  const { setLoading } = useLoading();

  // Start Master
  const [inputPage, setInputPage] = useState("1");
  const [pageTable, setPageTable] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [totalPage, setTotalPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [datas, setDatas] = useState<User[]>([]);
  const [inputSearch, setInputSearch] = useState("");
  const [tblSortList, setTblSortList] = useState<TableShortList[]>([]);
  const [tblThColomns, setTblThColomns] = useState<TableThModel[]>([
    { name: "Name", key: "fullname", key_sort: "fullname", IsVisible: true },
    { name: "Email", key: "email", key_sort: "email", IsVisible: true },
    { name: "Role", key: "role", key_sort: "role", IsVisible: true },
    { name: "No Phone", key: "no_phone", key_sort: "no_phone", IsVisible: true },
    { name: "Status", key: "is_active", key_sort: "is_active", IsVisible: true },
    { name: "Created At", key: "createdAt", key_sort: "createdAt", IsVisible: true },
  ]);
  const fatchDatas = async (page: number = pageTable, countPage: number = perPage) => {
    const selectObj = normalizeSelectObj(tblThColomns);
    const orderObj = sortListToOrderBy(tblSortList);

    try {
      const result = await GetDataUser({
        curPage: page,
        perPage: countPage,
        where: {
          OR: [
            { fullname: { contains: inputSearch.trim(), mode: "insensitive" } },
            { email: { contains: inputSearch.trim(), mode: "insensitive" } },
          ]
        },
        select: {
          id: true,
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

  const [txtEmail, setTxtEmail] = useState("");
  const [txtName, setTxtName] = useState("");
  const [isActive, setIsActive] = useState("");
  const [txtRole, setTxtRole] = useState("");
  const [txtPhone, setTxtPhone] = useState("");
  const [txtGender, setTxtGender] = useState("");
  const [birthDate, setBirthDate] = useState<Date | null>(null);
  const [txtBirthPlace, setTxtBirthPlace] = useState("");
  const [filePP, setFilePP] = useState<File | null>(null);
  const [urlPrevPP, setUrlPrevPP] = useState<string>();

  const handleFileProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      if (!file) return;

      const allowedTypes = ["image/jpg", "image/jpeg", "image/png"];
      const maxSizeInMB = Configs.maxSizePictureInMB;
      const maxSizeInBytes = maxSizeInMB * 1024 * 1024;

      if (!allowedTypes.includes(file.type)) {
        toast({
          type: "warning",
          title: "Invalid File Type",
          message: "Only JPG, JPEG, or PNG files are allowed."
        });
        e.target.value = "";
        return;
      };
      if (file.size > maxSizeInBytes) {
        toast({
          type: "warning",
          title: "File Too Large",
          message: `The file size must be less than ${maxSizeInMB}MB.`
        });
        e.target.value = "";
        return;
      };

      const objectUrl = URL.createObjectURL(file);
      setUrlPrevPP(objectUrl);
      setFilePP(file);
    } else {
      setUrlPrevPP(undefined);
      setFilePP(null);
    }
  };
  const handleRemoveProfilePicture = () => {
    setUrlPrevPP(undefined);
    setFilePP(null);
  };

  const createDtoUser = (): DtoUser => {
    const newData: DtoUser = {
      id: addEditId,
      email: txtEmail,
      fullname: txtName,
      role: txtRole as RolesEnum,
      no_phone: txtPhone,
      gender: txtGender,
      birth_date: birthDate,
      birth_place: txtBirthPlace,
      img_url: urlPrevPP || null,
      file_img: filePP,

      img_name: null,
      is_active: isActive === "true" ? true : false,
    };
    return newData;
  };

  const openModalAddEdit = async (id?: number) => {
    if (id) {
      setLoading(true);
      const data = await GetDataUserById(id);
      if (data) {
        setAddEditId(data.id);
        setIsActive(data.is_active != null ? data.is_active.toString() : "");
        setTxtEmail(data.email || "");
        setTxtName(data.fullname || "");
        setTxtRole(data.role);
        setTxtPhone(data.no_phone || "");
        setTxtGender(data.gender || "");
        setBirthDate(data.birth_date);
        setTxtBirthPlace(data.birth_place || "");
        setUrlPrevPP(data.image_path || undefined);
        setFilePP(null);
      }
      setLoading(false);
    } else {
      setAddEditId(null);
      setIsActive("");
      setTxtEmail("");
      setTxtName("");
      setTxtRole("");
      setTxtPhone("");
      setTxtGender("");
      setBirthDate(null);
      setTxtBirthPlace("");
      setFilePP(null);
      setUrlPrevPP(undefined);
    }
    setStateFormAddEdit({ success: true, errors: {} });
    modalAction(`btn-${modalAddEdit}`);
  };
  const FormSchemaAddEdit = z.object({
    is_active: z.string().min(1, { message: 'Status is required field.' }).trim(),
    fullname: z.string().min(1, { message: 'Fullname required field.' }).trim(),
    role: z.string().min(1, { message: 'User role is required field.' }).trim(),
  });
  const handleSubmitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    let formSchame = FormSchemaAddEdit;
    if (addEditId === null) {
      const newFormSchame = FormSchemaAddEdit.extend({
        email: z.string().email({ message: 'Please enter a valid email.' }).trim()
      });
      formSchame = newFormSchame;
    }

    const data = Object.fromEntries(formData);
    const valResult = formSchame.safeParse(data);
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
      await UpdateDataUser(createDtoUser());
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
      await DeleteDataUser(id);
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
            User Management
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
              tblDesc="List user management to manage your data"
              inputSearch={inputSearch}
              tblSortList={tblSortList}
              thColomn={tblThColomns}
              setTblThColomns={setTblThColomns}
              setTblSortList={setTblSortList}
              setInputSearch={setInputSearch}
              fatchData={() => fatchDatas(pageTable)}

              // openModal={openModalAddEdit}
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

                              {'fullname' in data && <td className="px-3 py-2.5 whitespace-nowrap text-sm text-gray-800">{data.fullname}</td>}
                              {'email' in data && <td className="px-3 py-2.5 whitespace-nowrap text-sm text-gray-800">{data.email}</td>}
                              {'role' in data && <td className="px-3 py-2.5 whitespace-nowrap text-sm text-gray-800">{data.role}</td>}
                              {'no_phone' in data && <td className="px-3 py-2.5 whitespace-nowrap text-sm text-gray-800">{data.no_phone || "-"}</td>}
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
                <div className="flex items-center gap-1 text-sm">
                  <i className='bx bx-user-pin text-lg'></i> {addEditId ? "Edit" : "Add"} User
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
                <div className="flex items-center justify-between gap-4 py-2 px-3 border border-gray-200 rounded-xl bg-white shadow-sm mb-3">
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
