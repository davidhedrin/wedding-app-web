import DatePicker from "@/components/ui/date-picker";
import Input from "@/components/ui/input";
import Textarea from "@/components/ui/textarea";
import Configs, { MusicThemeKeys, PaymentMethodKeys } from "@/lib/config";
import { copyToClipboard, getMonthName, inputFormatPriceIdr, modalAction, normalizeSelectObj, parseFromIDR, playMusic, showConfirm, sortListToOrderBy, stopMusic, toast, toOrdinal } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import ContentComponent from "../comp-content";
import { useTabEventDetail } from "@/lib/zustand";
import dynamic from "next/dynamic";
import TableTopToolbar from "@/components/table-top-toolbar";
import { FormState, TableShortList, TableThModel } from "@/lib/model-types";
import TablePagination from "@/components/table-pagination";
import Select from "@/components/ui/select";
import { EventFAQ, EventGalleries, EventGifts, EventGiftTypeEnum, EventHistories, EventRsvp, Events, GroomBrideEnum, TradRecepType } from "@/generated/prisma";
import z from "zod";
import { useLoading } from "@/components/loading/loading-context";
import { DtoEventFAQ, DtoEventGallery, DtoEventGift, DtoEventHistory, DtoEventRsvp, DtoMainInfoWedding, DtoScheduler } from "@/lib/dto";
import { ZodErrors } from "@/components/zod-errors";
import { DeleteDataEventFAQ, DeleteDataEventGifts, DeleteDataEventHistories, DeleteDataEventRsvp, DeleteEventGalleryById, GetDataEventFAQ, GetDataEventFAQById, GetDataEventGifts, GetDataEventGiftsById, GetDataEventHistories, GetDataEventHistoriesById, GetDataEventRsvp, GetDataEventRsvpById, GetEventGalleryByEventId, GetGroomBrideDataByEventId, GetScheduleByEventId, StoreEventGalleries, StoreUpdateEventFAQ, StoreUpdateEventRSVP, StoreUpdateGift, StoreUpdateHistory, StoreUpdateMainInfoWedding, StoreUpdateSchedule, UpdateShippingAddress } from "@/server/event-detail";
import UiPortal from "@/components/ui-portal";
import { GetDataEventWithSelect } from "@/server/event";

const MapPicker = dynamic(
  () => import("@/components/map-picker"),
  { ssr: false }
);

export default function TabContentWedding({ dataEvent, url }: { dataEvent: Events, url: string }) {
  const tabContents = [
    { id: "main-info", content: MainTabContent({ dataEvent }) },
    { id: "scheduler", content: SchedulerTabContent({ dataEvent }) },
    { id: "gallery", content: GalleryTabContent(dataEvent.id) },
    { id: "history", content: HistoryTabContent(dataEvent.id) },
    { id: "gift", content: GiftTabContent({ dataEvent }) },
    { id: "rsvp", content: RSVPTabContent({ event_id: dataEvent.id, url }) },
    { id: "faq", content: FAQTabContent(dataEvent.id) },
  ];

  return <ContentComponent tabContents={tabContents} />;
}

function MainTabContent({ dataEvent }: { dataEvent: Events }) {
  const { setLoading } = useLoading();
  const { activeIdxTab } = useTabEventDetail();

  const musicThemeWedding = MusicThemeKeys.find(x => x.key === "wed");
  const [stateFormMainInfo, setStateFormMainInfo] = useState<FormState>({ success: false, errors: {} });

  const [greetingMessage, setGreetingMessage] = useState<string>(dataEvent.greeting_msg ?? "");
  const [contactEmail, setContactEmail] = useState<string>(dataEvent.contact_email ?? "");
  const [contactPhone, setContactPhone] = useState<string>(dataEvent.contact_phone ?? "");
  const [musicTheme, setMusicTheme] = useState<string>(dataEvent.music_url ?? "");
  const [imageFileCouple, setImageFileCouple] = useState<File | null>(null);
  const [previewUrlCouple, setPreviewUrlCouple] = useState<string | null>(dataEvent.couple_img_path);

  // Groom Info
  const [groomId, setGroomId] = useState<number | null>(null);
  const [groomFullname, setGroomFullname] = useState<string>("");
  const [groomBirthDate, setGroomBirthDate] = useState<Date | null>(null);
  const [groomBirthPlace, setGroomBirthPlace] = useState("");
  const [groomFathername, setGroomFathername] = useState<string>("");
  const [groomMothername, setGroomMothername] = useState<string>("");
  const [groomPlaceOrigin, setGroomPlaceOrigin] = useState<string>("");
  const [groomOccupation, setGroomOccupation] = useState<string>("");
  const [groomPersonalMsg, setGroomPersonalMsg] = useState<string>("");
  const [birthOrderGroom, setBirthOrderGroom] = useState<number | "">(1);
  const [imageFileGroom, setImageFileGroom] = useState<File | null>(null);
  const [previewUrlGroom, setPreviewUrlGroom] = useState<string | null>(null);

  // Bride Info
  const [brideId, setBrideId] = useState<number | null>(null);
  const [brideFullname, setBrideFullname] = useState<string>("");
  const [brideBirthDate, setBrideBirthDate] = useState<Date | null>(null);
  const [brideBirthPlace, setBrideBirthPlace] = useState("");
  const [brideFathername, setBrideFathername] = useState<string>("");
  const [brideMothername, setBrideMothername] = useState<string>("");
  const [bridePlaceOrigin, setBridePlaceOrigin] = useState<string>("");
  const [brideOccupation, setBrideOccupation] = useState<string>("");
  const [bridePersonalMsg, setBridePersonalMsg] = useState<string>("");
  const [birthOrderBride, setBirthOrderBride] = useState<number | "">(1);
  const [imageFileBride, setImageFileBride] = useState<File | null>(null);
  const [previewUrlBride, setPreviewUrlBride] = useState<string | null>(null);

  const handleFileCaptureChange = (e: { target: { files: FileList | null } }) => {
    const allowedTypes = ["image/jpg", "image/jpeg", "image/png"];
    const maxSizeInMB = Configs.maxSizePictureInMB;
    const maxSizeInBytes = maxSizeInMB * 1024 * 1024;

    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    if (!allowedTypes.includes(file.type)) {
      toast({
        type: "warning",
        title: "Invalid File",
        message: "Only JPG, JPEG, PNG files are allowed."
      });
      return;
    };

    // Validasi ukuran file
    if (file.size > maxSizeInBytes) {
      toast({
        type: "warning",
        title: "Invalid File",
        message: "File size exceeds the maximum limit of " + maxSizeInMB + "MB."
      });
      return;
    };

    setImageFileCouple(file);
    setPreviewUrlCouple(URL.createObjectURL(file));
  };

  const handleDragOverCapture = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.add('bg-gray-100', 'rounded-xl');
  };
  const handleDragLeaveCapture = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove('bg-gray-100', 'rounded-xl');
  };
  const handleDropCapture = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove('bg-gray-100', 'rounded-xl');

    const files = e.dataTransfer.files;
    handleFileCaptureChange({ target: { files } });
  };

  const handleFileGroomBride = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputId = e.currentTarget.id;
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
      if (inputId === "groom_file_input") {
        setPreviewUrlGroom(objectUrl);
        setImageFileGroom(file);
      } else if (inputId === "bride_file_input") {
        setPreviewUrlBride(objectUrl);
        setImageFileBride(file);
      }
    } else {
      if (inputId === "groom_file_input") {
        setPreviewUrlGroom(null);
        setImageFileGroom(null);
      } else if (inputId === "bride_file_input") {
        setPreviewUrlBride(null);
        setImageFileBride(null);
      }
    }
  };

  const createDtoData = (): DtoMainInfoWedding => {
    const shortNameGroom = groomFullname?.trim().match(/^\S+/)?.[0] ?? "";
    const shortNameBride = brideFullname?.trim().match(/^\S+/)?.[0] ?? "";

    const newData: DtoMainInfoWedding = {
      event_id: dataEvent.id,
      greeting_msg: greetingMessage.trim() != "" ? greetingMessage : null,
      contact_email: contactEmail.trim() != "" ? contactEmail : null,
      contact_phone: contactPhone.trim() != "" ? contactPhone : null,
      music_url: musicTheme.trim() != "" ? musicTheme : null,
      groom_bride: [
        {
          id: groomId,
          type: GroomBrideEnum.Groom,
          fullname: groomFullname,
          shortname: shortNameGroom,
          birth_place: groomBirthPlace,
          birth_date: groomBirthDate ?? new Date(),
          birth_order: birthOrderGroom === "" ? 1 : birthOrderGroom,
          father_name: groomFathername.trim() != "" ? groomFathername : null,
          mother_name: groomMothername.trim() != "" ? groomMothername : null,
          place_origin: groomPlaceOrigin.trim() != "" ? groomPlaceOrigin : null,
          occupation: groomOccupation.trim() != "" ? groomOccupation : null,
          personal_msg: groomPersonalMsg.trim() != "" ? groomPersonalMsg : null,
          img_name: null,
          img_url: previewUrlGroom ?? null,
          file_img: imageFileGroom,
        },
        {
          id: brideId,
          type: GroomBrideEnum.Bride,
          fullname: brideFullname,
          shortname: shortNameBride,
          birth_place: brideBirthPlace,
          birth_date: brideBirthDate ?? new Date(),
          birth_order: birthOrderBride === "" ? 1 : birthOrderBride,
          father_name: brideFathername.trim() != "" ? brideFathername : null,
          mother_name: brideMothername.trim() != "" ? brideMothername : null,
          place_origin: bridePlaceOrigin.trim() != "" ? bridePlaceOrigin : null,
          occupation: brideOccupation.trim() != "" ? brideOccupation : null,
          personal_msg: bridePersonalMsg.trim() != "" ? bridePersonalMsg : null,
          img_name: null,
          img_url: previewUrlBride ?? null,
          file_img: imageFileBride,
        }
      ],

      couple_img_name: null,
      couple_img_url: previewUrlCouple ?? null,
      couple_file_img: imageFileCouple,
    };

    return newData;
  };

  const FormSchemaMainInfo = z.object({
    greeting_message: z.string().min(1, { message: "Greeting message is required field." }).trim(),

    groom_img_prev: z.string().min(1, { message: "Groom's photo is required field." }).trim(),
    groom_birth_place: z.string().min(1, { message: 'Birth place is required field.' }).trim(),
    groom_birth_date: z.string().min(1, { message: 'Birth date is required field.' }).trim().refine(
      (date) => {
        if (!date) return true
        return new Date(date) <= new Date()
      },
      { message: 'Birth date cannot be in the future.' }
    ),
    groom_full_name: z.string().min(1, { message: 'Full name is required field.' }).trim(),
    // groom_birth_order: z.coerce.number().min(1, { message: 'Birth order must be at least 1.' }),

    bride_img_prev: z.string().min(1, { message: "Bride's photo is required field." }).trim(),
    bride_birth_place: z.string().min(1, { message: 'Birth place is required field.' }).trim(),
    bride_birth_date: z.string().min(1, { message: 'Birth date is required field.' }).trim().refine(
      (date) => {
        if (!date) return true
        return new Date(date) <= new Date()
      },
      { message: 'Birth date cannot be in the future.' }
    ),
    bride_full_name: z.string().min(1, { message: 'Full name is required field.' }).trim(),

    couple_img_prev: z.string().min(1, { message: "Couple's photo is required field." }).trim(),
  });

  const handleSubmitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    formData.append("groom_img_prev", "");
    formData.append("bride_img_prev", "");
    formData.append("couple_img_prev", "");
    if (previewUrlGroom) formData.append("groom_img_prev", previewUrlGroom.toString());
    if (previewUrlBride) formData.append("bride_img_prev", previewUrlBride.toString());
    if (previewUrlCouple) formData.append("couple_img_prev", previewUrlCouple.toString());

    formData.append("groom_birth_date", groomBirthDate ? groomBirthDate.toString() : "");
    formData.append("bride_birth_date", brideBirthDate ? brideBirthDate.toString() : "");

    const data = Object.fromEntries(formData);
    const valResult = FormSchemaMainInfo.safeParse(data);
    if (!valResult.success) {
      setStateFormMainInfo({
        success: false,
        errors: valResult.error.flatten().fieldErrors,
      });
      return;
    };
    setStateFormMainInfo({ success: true, errors: {} });

    const confirmed = await showConfirm({
      title: 'Submit Confirmation?',
      message: 'Are you sure you want to submit this form? Please double-check before proceeding!',
      confirmText: 'Yes, Submit',
      cancelText: 'No, Go Back',
      icon: 'bx bx-error bx-tada text-blue-500'
    });
    if (!confirmed) return;

    setLoading(true);
    try {
      await StoreUpdateMainInfoWedding(createDtoData());
      await fatchDatas(false);
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
    }
    setLoading(false);
  };

  const fatchDatas = async (isLoading: boolean = true) => {
    if (isLoading) setLoading(true);
    const getData = await GetGroomBrideDataByEventId(dataEvent.id);
    getData.forEach(x => {
      const setterType = x.type;

      if (setterType === "Groom") {
        setGroomId(x.id);
        setGroomFullname(x.fullname);
        setGroomBirthDate(x.birth_date);
        setGroomBirthPlace(x.birth_place);
        setGroomFathername(x.father_name ?? "");
        setGroomMothername(x.mother_name ?? "");
        setGroomPlaceOrigin(x.place_origin ?? "");
        setGroomOccupation(x.occupation ?? "");
        setGroomPersonalMsg(x.personal_msg ?? "");
        setBirthOrderGroom(x.birth_order);
        setPreviewUrlGroom(x.img_path);
        setImageFileGroom(null);
      } else if (setterType === "Bride") {
        setBrideId(x.id);
        setBrideFullname(x.fullname);
        setBrideBirthDate(x.birth_date);
        setBrideBirthPlace(x.birth_place);
        setBrideFathername(x.father_name ?? "");
        setBrideMothername(x.mother_name ?? "");
        setBridePlaceOrigin(x.place_origin ?? "");
        setBrideOccupation(x.occupation ?? "");
        setBridePersonalMsg(x.personal_msg ?? "");
        setBirthOrderBride(x.birth_order);
        setPreviewUrlBride(x.img_path);
        setImageFileBride(null);
      }
    });

    if (isLoading) setLoading(false);
  };

  useEffect(() => {
    if (activeIdxTab == 0) fatchDatas();
  }, [activeIdxTab]);

  return (
    <div>
      <div className="mb-7 mt-3 text-center">
        <div className="flex justify-center items-center gap-1 text-lg font-semibold text-gray-800">
          <i className="bx bx-info-circle text-xl"></i> Main Information
        </div>
        <p className="text-sm text-gray-500">
          Enter the main details of the wedding event below.
        </p>
      </div>

      <form onSubmit={handleSubmitForm}>
        <div className="grid grid-cols-12 gap-3">
          <div className="col-span-12">
            <Textarea value={greetingMessage} onChange={(e) => setGreetingMessage(e.target.value)} label="Greeting Message" id="greeting_message" placeholder="Enter greeting message" rows={3} mandatory />
            {stateFormMainInfo.errors?.greeting_message && <ZodErrors err={stateFormMainInfo.errors?.greeting_message} />}
          </div>
          <div className="col-span-12 md:col-span-6">
            <div className="font-semibold text-gray-800 mb-1.5">
              <i className='bx bx-male-sign text-xl'></i> Groom Information
              <p className="text-sm text-muted font-medium">Fill in the groom's information with an <span className="text-red-500">*</span> as a mandatory field.</p>
            </div>
            <div className="flex flex-col bg-white border border-gray-200 shadow-2xs rounded-xl overflow-hidden">
              <div className="relative w-full h-48 md:h-64">
                {
                  previewUrlGroom ? (
                    <img
                      className="w-full h-full object-cover"
                      src={previewUrlGroom}
                      alt="Card Image"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 text-gray-400 gap-1">
                      <i className="bx bx-image text-5xl"></i>
                      <div className="flex items-center gap-1 text-sm">
                        <i className="bx bx-upload text-lg"></i>
                        No image selected
                      </div>
                    </div>
                  )
                }

                <div className="absolute bottom-0 left-0 p-3 w-fit space-y-1">
                  <label className="bg-white bg-opacity-80 hover:bg-opacity-100 transition px-3 py-1 rounded-md text-sm cursor-pointer shadow-md flex items-center gap-1 w-fit">
                    <i className='bx bx-image-add text-lg'></i>
                    Upload
                    <input
                      onChange={handleFileGroomBride}
                      id="groom_file_input"
                      type="file"
                      accept="image/jpeg,image/jpg,image/png"
                      className="hidden"
                    />
                  </label>

                  <div className="bg-black/60 text-white text-xs px-2 py-1 rounded-md">
                    <p>Allowed formats: JPG, JPEG, PNG up to {Configs.maxSizePictureInMB}MB</p>
                    {stateFormMainInfo.errors?.groom_img_prev && <ZodErrors err={stateFormMainInfo.errors?.groom_img_prev} />}
                  </div>
                </div>
              </div>

              <div className="p-3">
                <div className="grid grid-cols-12 gap-2">
                  <div className="col-span-12 md:col-span-6">
                    <Input value={groomBirthPlace} onChange={(e) => setGroomBirthPlace(e.target.value)} type='text' id='groom_birth_place' label='Birth Place' placeholder='Enter birth place' mandatory />
                    {stateFormMainInfo.errors?.groom_birth_place && <ZodErrors err={stateFormMainInfo.errors?.groom_birth_place} />}
                  </div>
                  <div className="col-span-12 md:col-span-6">
                    <DatePicker mode='single' value={groomBirthDate || undefined} onChange={(date) => setGroomBirthDate(date as Date)} label='Birth Date' mandatory />
                    {stateFormMainInfo.errors?.groom_birth_date && <ZodErrors err={stateFormMainInfo.errors?.groom_birth_date} />}
                  </div>
                  <div className="col-span-12 md:col-span-6">
                    <Input value={groomFullname} onChange={(e) => setGroomFullname(e.target.value)} type='text' id='groom_full_name' label='Full Name' placeholder='Enter full name' mandatory />
                    {stateFormMainInfo.errors?.groom_full_name && <ZodErrors err={stateFormMainInfo.errors?.groom_full_name} />}
                  </div>
                  <div className="col-span-12 md:col-span-6">
                    <Input
                      value={birthOrderGroom}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === "") {
                          setBirthOrderGroom("");
                          return;
                        }

                        const num = Number(value);
                        if (num < 1) return;

                        setBirthOrderGroom(num);
                      }}
                      onBlur={() => {
                        if (birthOrderGroom === "") {
                          setBirthOrderGroom(1);
                        }
                      }}
                      sufixGroup={<span>{typeof birthOrderGroom === "number" ? `${toOrdinal(birthOrderGroom)} Child` : "- Child"}</span>}
                      type='number' min={1} id='groom_birth_order' label='Birth Order' placeholder='Order' mandatory />
                  </div>
                  <div className="col-span-12 md:col-span-6">
                    <Input value={groomFathername} onChange={(e) => setGroomFathername(e.target.value)} type='text' id='groom_father_name' label='Father Name' placeholder='Enter father name' />
                  </div>
                  <div className="col-span-12 md:col-span-6">
                    <Input value={groomMothername} onChange={(e) => setGroomMothername(e.target.value)} type='text' id='groom_mother_name' label='Mother Name' placeholder='Enter mother name' />
                  </div>
                  <div className="col-span-12 md:col-span-6">
                    <Input value={groomPlaceOrigin} onChange={(e) => setGroomPlaceOrigin(e.target.value)} type='text' id='groom_place_origin' label='Place of Origin' placeholder='Enter place of origin' />
                  </div>
                  <div className="col-span-12 md:col-span-6">
                    <Input value={groomOccupation} onChange={(e) => setGroomOccupation(e.target.value)} type='text' id='groom_occupation' label='Occupation' placeholder='Enter occupation or Background' />
                  </div>
                  <div className="col-span-12">
                    <Textarea value={groomPersonalMsg} onChange={(e) => setGroomPersonalMsg(e.target.value)} label="Personality Tagline" id="groom_tagline" placeholder="Enter personality tagline if any" rows={2} />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-span-12 md:col-span-6">
            <div className="font-semibold text-gray-800 mb-1.5">
              <i className='bx bx-female-sign text-xl'></i> Bride Information
              <p className="text-sm text-muted font-medium">Fill in the bride's information with an <span className="text-red-500">*</span> as a mandatory field.</p>
            </div>
            <div className="flex flex-col bg-white border border-gray-200 shadow-2xs rounded-xl overflow-hidden">
              <div className="relative w-full h-48 md:h-64">
                {
                  previewUrlBride ? (
                    <img
                      className="w-full h-full object-cover"
                      src={previewUrlBride}
                      alt="Card Image"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 text-gray-400 gap-1">
                      <i className="bx bx-image text-5xl"></i>
                      <div className="flex items-center gap-1 text-sm">
                        <i className="bx bx-upload text-lg"></i>
                        No image selected
                      </div>
                    </div>
                  )
                }

                <div className="absolute bottom-0 left-0 p-3 w-fit space-y-1">
                  <label className="bg-white bg-opacity-80 hover:bg-opacity-100 transition px-3 py-1 rounded-md text-sm cursor-pointer shadow-md flex items-center gap-1 w-fit">
                    <i className='bx bx-image-add text-lg'></i>
                    Upload
                    <input
                      onChange={handleFileGroomBride}
                      id="bride_file_input"
                      type="file"
                      accept="image/jpeg,image/jpg,image/png"
                      className="hidden"
                    />
                  </label>

                  <div className="bg-black/60 text-white text-xs px-2 py-1 rounded-md">
                    <p>Allowed formats: JPG, JPEG, PNG up to {Configs.maxSizePictureInMB}MB</p>
                    {stateFormMainInfo.errors?.bride_img_prev && <ZodErrors err={stateFormMainInfo.errors?.bride_img_prev} />}
                  </div>
                </div>
              </div>

              <div className="p-3">
                <div className="grid grid-cols-12 gap-2">
                  <div className="col-span-12 md:col-span-6">
                    <Input value={brideBirthPlace} onChange={(e) => setBrideBirthPlace(e.target.value)} type='text' id='bride_birth_place' label='Birth Place' placeholder='Enter birth place' mandatory />
                    {stateFormMainInfo.errors?.bride_birth_place && <ZodErrors err={stateFormMainInfo.errors?.bride_birth_place} />}
                  </div>
                  <div className="col-span-12 md:col-span-6">
                    <DatePicker mode='single' value={brideBirthDate || undefined} onChange={(date) => setBrideBirthDate(date as Date)} label='Birth Date' mandatory />
                    {stateFormMainInfo.errors?.bride_birth_date && <ZodErrors err={stateFormMainInfo.errors?.bride_birth_date} />}
                  </div>
                  <div className="col-span-12 md:col-span-6">
                    <Input value={brideFullname} onChange={(e) => setBrideFullname(e.target.value)} type='text' id='bride_full_name' label='Full Name' placeholder='Enter full name' mandatory />
                    {stateFormMainInfo.errors?.bride_full_name && <ZodErrors err={stateFormMainInfo.errors?.bride_full_name} />}
                  </div>
                  <div className="col-span-12 md:col-span-6">
                    <Input
                      value={birthOrderBride}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === "") {
                          setBirthOrderBride("");
                          return;
                        }

                        const num = Number(value);
                        if (num < 1) return;

                        setBirthOrderBride(num);
                      }}
                      onBlur={() => {
                        if (birthOrderBride === "") {
                          setBirthOrderBride(1);
                        }
                      }}
                      sufixGroup={<span>{typeof birthOrderBride === "number" ? `${toOrdinal(birthOrderBride)} Child` : "- Child"}</span>}
                      type='number' min={1} id='bride_birth_order' label='Birth Order' placeholder='Order' mandatory />
                  </div>
                  <div className="col-span-12 md:col-span-6">
                    <Input value={brideFathername} onChange={(e) => setBrideFathername(e.target.value)} type='text' id='bride_father_name' label='Father Name' placeholder='Enter father name' />
                  </div>
                  <div className="col-span-12 md:col-span-6">
                    <Input value={brideMothername} onChange={(e) => setBrideMothername(e.target.value)} type='text' id='bride_mother_name' label='Mother Name' placeholder='Enter mother name' />
                  </div>
                  <div className="col-span-12 md:col-span-6">
                    <Input value={bridePlaceOrigin} onChange={(e) => setBridePlaceOrigin(e.target.value)} type='text' id='bride_place_origin' label='Place of Origin' placeholder='Enter place of origin' />
                  </div>
                  <div className="col-span-12 md:col-span-6">
                    <Input value={brideOccupation} onChange={(e) => setBrideOccupation(e.target.value)} type='text' id='bride_occupation' label='Occupation' placeholder='Enter occupation or Background' />
                  </div>
                  <div className="col-span-12">
                    <Textarea value={bridePersonalMsg} onChange={(e) => setBridePersonalMsg(e.target.value)} label="Personality Tagline" id="bride_tagline" placeholder="Enter personality tagline if any" rows={2} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-span-12">
            <label className="block text-sm font-medium mb-1 dark:text-white">
              Couple Photo<span className="text-red-500">*</span>
              <p className='text-sm text-muted'>Choose your couple photo will be displayed as the main cover on the homepage.</p>
            </label>

            <div onDragOver={handleDragOverCapture} onDrop={handleDropCapture} onDragLeave={handleDragLeaveCapture} className="hover:bg-gray-100 rounded-xl">
              {!previewUrlCouple ? (
                // Drag & Drop UI
                <label htmlFor="file-upload" className="cursor-pointer px-6 h-64 md:h-72 flex justify-center items-center bg-transparent border-2 border-dashed border-gray-300 rounded-xl">
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

                    <div className="flex flex-wrap justify-center text-sm/6 text-gray-600 mt-2">
                      <span className="pe-1 font-medium text-gray-800">
                        Drop file here or click to
                      </span>
                      <span className="font-semibold text-blue-600 hover:underline">
                        browse
                      </span>
                    </div>

                    <p className="text-xs text-gray-400 mt-0">
                      Allowed formats JPG, JPEG, PNG up to {Configs.maxSizePictureInMB}MB
                    </p>

                    <input
                      type="file"
                      onChange={handleFileCaptureChange}
                      id="file-upload"
                      className="hidden"
                      accept="image/jpeg,image/png,image/jpg"
                    />
                  </div>
                </label>
              ) : (
                // Image UI
                <div className="relative w-full">
                  <img src={previewUrlCouple} alt="Preview" className="w-full h-64 md:h-72 object-cover rounded-xl" />

                  <div className="absolute bottom-0 right-0 p-3 flex flex-col items-end gap-1">
                    <label htmlFor="file-upload" className="bg-white/90 hover:bg-white px-3 py-1.5 rounded-md shadow text-sm cursor-pointer transition">
                      <i className='bx bx-upload text-lg'></i> Change Photo
                      <input
                        type="file"
                        onChange={handleFileCaptureChange}
                        id="file-upload"
                        className="hidden"
                        accept="image/jpeg,image/png,image/jpg"
                      />
                    </label>

                    <span className="text-xs text-white bg-black/60 px-2 py-1 rounded-md backdrop-blur-sm">
                      <p>Drop or click change button to browse.</p>
                      <p>Allowed formats JPG, JPEG, PNG up to {Configs.maxSizePictureInMB}MB</p>
                    </span>
                  </div>
                </div>
              )}
            </div>
            {stateFormMainInfo.errors?.couple_img_prev && <ZodErrors err={stateFormMainInfo.errors?.couple_img_prev} />}
          </div>
          <div className="col-span-12 md:col-span-4">
            <Input value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} type='text' id='contact_email' label='Contact Email' placeholder="Enter contact email address" />
          </div>
          <div className="col-span-12 md:col-span-4">
            <Input value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} type='text' id='contact_phone' label='Contact Phone/WhatsApp' placeholder="Enter contact phone/whatsapp number" />
          </div>
          <div className="col-span-12 md:col-span-4">
            <Select value={musicTheme}
              onChange={(e) => {
                const url = e.target.value;
                if (!url) {
                  setMusicTheme("");
                  return;
                }
                setMusicTheme(e.target.value);
                playMusic(url);
              }}
              onBlur={() => {
                stopMusic();
              }}
              id='music_theme' label='Music Theme' placeholder='Select music theme'
              options={musicThemeWedding?.items.map(x => ({ value: x.url, label: x.name })) || []}
            />
          </div>
        </div>

        <div className="text-xs text-gray-500 sm:order-1 order-1 italic mt-3 mb-2">
          <p>Fields marked with <span className="text-red-500">*</span> are required.</p>
        </div>
        <button type="submit" className="py-1.5 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-hidden focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none">
          Submit
        </button>
      </form>
    </div>
  )
};

function SchedulerTabContent({ dataEvent }: { dataEvent: Events }) {
  const { setLoading } = useLoading();
  const { activeIdxTab } = useTabEventDetail();
  const [stateFormShcedule, setStateFormShcedule] = useState<FormState>({ success: false, errors: {} });

  // Marriage Blessing Props
  const [eventMbId, setEventMbId] = useState<number | null>(null);
  const [eventDateMb, setDateRangeMb] = useState<Date | undefined>();
  const [startTimeMb, setStartTimeMb] = useState<string>("");
  const [endTimeMb, setEndTimeMb] = useState<string>("");
  const [locNameMb, setLocNameMb] = useState<string>("");
  const [locAddressMb, setLocAddressMb] = useState<string>("");
  const [latLangMb, setLatLangMb] = useState<[number, number] | null>(null);
  const [noteListMb, setNoteListMb] = useState<string[]>([""]);

  // Traditional Reception Props
  const [eventTrId, setEventTrId] = useState<number | null>(null);
  const [isCheckedTr, setIsCheckedTr] = useState(false);
  const [isTrUsingLocMb, setTrUsingLocMb] = useState(false);
  const [eventDateTr, setDateRangeTr] = useState<Date | undefined>();
  const [startTimeTr, setStartTimeTr] = useState<string>("");
  const [endTimeTr, setEndTimeTr] = useState<string>("");
  const [locNameTr, setLocNameTr] = useState<string>("");
  const [locAddressTr, setLocAddressTr] = useState<string>("");
  const [latLangTr, setLatLangTr] = useState<[number, number] | null>(null);
  const [noteListTr, setNoteListTr] = useState<string[]>([""]);
  const [radioSelectTypeTr, setRadioSelectTypeTr] = useState<TradRecepType>(TradRecepType.Traditional);

  const [scheduleNote, setScheduleNote] = useState<string>(dataEvent.schedule_note ?? "");

  const switchMbLoc = (changeVal: boolean) => {
    setTrUsingLocMb(changeVal);
    if (changeVal) {
      setLocNameTr(locNameMb);
      setLocAddressTr(locAddressMb);
      setLatLangTr(latLangMb);
    } else {
      setLocNameTr("");
      setLocAddressTr("");
      setLatLangTr(null);
    }
  };

  const [schedulerDtoData, setSchedulerDtoData] = useState<DtoScheduler[]>([]);
  const addMoreCeremony = () => {
    setSchedulerDtoData(prev => [
      ...prev,
      {
        id: null,
        type: "WED_CST",
        date: undefined,
        start_time: "",
        end_time: "",
        loc_name: "",
        loc_address: "",
        langLat: null,
        use_main_loc: false,
        notes: [""],
      }
    ]);
  };

  const createDtoData = (): DtoScheduler[] => {
    const data: DtoScheduler[] = [
      {
        id: eventMbId,
        type: "WED_MB",
        date: eventDateMb,
        start_time: startTimeMb,
        end_time: endTimeMb,
        loc_name: locNameMb,
        loc_address: locAddressMb,
        langLat: latLangMb,
        notes: noteListMb.filter(x => x.trim() !== ""),

        use_main_loc: false,
      },
    ];

    if (isCheckedTr) data.push({
      id: eventTrId,
      type: "WED_TOR",
      date: eventDateTr,
      start_time: startTimeTr,
      end_time: endTimeTr,
      loc_name: locNameTr,
      loc_address: locAddressTr,
      langLat: latLangTr,
      notes: noteListTr.filter(x => x.trim() !== ""),

      use_main_loc: isTrUsingLocMb,
      ceremon_type: radioSelectTypeTr,
    });

    return data;
  };

  const FormSchemaSchedule = z.object({
    mb_event_date: z.string().min(1, { message: 'Event date is required field.' }).trim().refine(
      (date) => {
        if (!date) return true
        return new Date(date) > new Date()
      },
      { message: 'Event date cannot be in the past.' }
    ),
    mb_start_time: z.string().min(1, { message: 'Event start time is required field.' }).trim(),
    mb_loc_name: z.string().min(1, { message: 'Event location is required field.' }).trim(),
    mb_loc_langlat: z.string().min(1, { message: 'Choose location is required field.' }).trim(),
  });

  const handleSubmitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    formData.append("mb_loc_langlat", "");
    if (latLangMb) formData.append("mb_loc_langlat", latLangMb.length.toString());

    formData.append("mb_event_date", eventDateMb ? eventDateMb.toString() : "");

    let formSchame = FormSchemaSchedule;
    if (isCheckedTr) {
      formData.append("tr_loc_langlat", "");
      if (latLangTr) formData.append("tr_loc_langlat", latLangTr.length.toString());
      formData.append("tr_event_date", eventDateTr ? eventDateTr.toString() : "");

      const newFormSchame = FormSchemaSchedule.extend({
        tr_event_date: z.string().min(1, { message: 'Event date is required field.' }).trim().refine(
          (date) => {
            if (!date) return true
            return new Date(date) > new Date()
          },
          { message: 'Event date cannot be in the past.' }
        ),
        tr_start_time: z.string().min(1, { message: 'Event start time is required field.' }).trim(),
        tr_loc_name: z.string().min(1, { message: 'Event location is required field.' }).trim(),
        tr_loc_langlat: z.string().min(1, { message: 'Choose location is required field.' }).trim(),
      });
      formSchame = newFormSchame;
    };

    const data = Object.fromEntries(formData);
    const valResult = formSchame.safeParse(data);
    if (!valResult.success) {
      setStateFormShcedule({
        success: false,
        errors: valResult.error.flatten().fieldErrors,
      });
      return;
    };
    setStateFormShcedule({ success: true, errors: {} });

    const confirmed = await showConfirm({
      title: 'Submit Confirmation?',
      message: 'Are you sure you want to submit this form? Please double-check before proceeding!',
      confirmText: 'Yes, Submit',
      cancelText: 'No, Go Back',
      icon: 'bx bx-error bx-tada text-blue-500'
    });
    if (!confirmed) return;

    setLoading(true);
    try {
      await StoreUpdateSchedule(dataEvent.id, createDtoData(), scheduleNote.trim() !== "" ? scheduleNote : null);
      await fatchDatas(false);
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
    }
    setLoading(false);
  };

  const fatchDatas = async (isLoading: boolean = true) => {
    if (isLoading) setLoading(true);

    const getData = await GetScheduleByEventId(dataEvent.id);
    getData.forEach((x) => {
      const schType = x.type;
      let longLat: [number, number] | null = null;
      if (x.latitude != null && x.longitude != null) longLat = [parseFloat(x.latitude), parseFloat(x.longitude)];

      if (schType === "WED_MB") {
        setEventMbId(x.id);
        setDateRangeMb(x.date);
        setStartTimeMb(x.start_time);
        setEndTimeMb(x.end_time ?? "");
        setLocNameMb(x.location ?? "");
        setLocAddressMb(x.address ?? "");
        setLatLangMb(longLat);
        setNoteListMb(x.notes.length > 0 ? x.notes : [""]);
      };

      if (schType === "WED_TOR") {
        setEventTrId(x.id);
        setIsCheckedTr(true);
        setTrUsingLocMb(x.use_main_loc);
        setDateRangeTr(x.date);
        setStartTimeTr(x.start_time);
        setEndTimeTr(x.end_time ?? "");
        setLocNameTr(x.location ?? "");
        setLocAddressTr(x.address ?? "");
        setLatLangTr(longLat);
        setNoteListTr(x.notes.length > 0 ? x.notes : [""]);
        setRadioSelectTypeTr(x.ceremony_type ?? "Traditional");
      };
    });

    const getSchadule = await GetDataEventWithSelect({
      event_id: dataEvent.id, select: {
        schedule_note: true
      }
    });
    setScheduleNote(getSchadule ? getSchadule.schedule_note ?? "" : "");

    if (isLoading) setLoading(false);
  };

  useEffect(() => {
    if (activeIdxTab == 1) fatchDatas();
  }, [activeIdxTab]);

  return (
    <div>
      <div className="mb-7 mt-3 text-center">
        <div className="flex justify-center items-center gap-1 text-lg font-semibold text-gray-800">
          <i className="bx bx-calendar-star text-xl"></i> Event Scheduler
        </div>
        <p className="text-sm text-gray-500">
          Manage the schedule of wedding events such as marriage blessing and traditional/reception ceremonies.
        </p>
      </div>

      <form onSubmit={handleSubmitForm}>
        <div className="flex flex-col bg-white border border-gray-200 shadow-2xs rounded-xl mb-5">
          <div className="bg-gray-50 border-b border-gray-200 rounded-t-xl py-3 px-4">
            <div className="text-muted font-semibold">
              <i className='bx bx-donate-heart text-xl'></i> Marriage Blessing Ceremony
            </div>
          </div>
          <div className="p-3">
            <div className="grid grid-cols-12 gap-3">
              <div className="col-span-12 md:col-span-4">
                <label className="block text-sm font-medium mb-1 dark:text-white">
                  Event Date<span className="text-red-500">*</span>
                </label>
                <DatePicker placeholder="Choose event date" mode='single' value={eventDateMb} onChange={(date) => setDateRangeMb(date as Date)} />
                {stateFormShcedule.errors?.mb_event_date && <ZodErrors err={stateFormShcedule.errors?.mb_event_date} />}
              </div>
              <div className="col-span-12 md:col-span-4">
                <Input value={startTimeMb} onChange={(e) => setStartTimeMb(e.target.value)} type='time' id='mb_start_time' label='Start Time' mandatory />
                {stateFormShcedule.errors?.mb_start_time && <ZodErrors err={stateFormShcedule.errors?.mb_start_time} />}
              </div>
              <div className="col-span-12 md:col-span-4">
                <Input value={endTimeMb} onChange={(e) => setEndTimeMb(e.target.value)} type='time' id='mb_end_time' label='End Time' />
              </div>
              <div className="col-span-12">
                <Input value={locNameMb} onChange={(e) => {
                  const val = e.target.value;
                  if (val !== locNameTr) switchMbLoc(false);
                  setLocNameMb(val);
                }} label="Location Name" id="mb_loc_name" placeholder="Enter Location Name" mandatory />
                {stateFormShcedule.errors?.mb_loc_name && <ZodErrors err={stateFormShcedule.errors?.mb_loc_name} />}
              </div>
              <div className="col-span-12">
                <Textarea value={locAddressMb} onChange={(e) => {
                  const val = e.target.value;
                  if (val !== locAddressTr) switchMbLoc(false);
                  setLocAddressMb(val);
                }} label="Location Address" id="mb_loc_address" placeholder="Enter Location Address" rows={3} />
              </div>
              <div className="col-span-12">
                <label className="block text-sm font-medium mb-2 dark:text-white">
                  Choose Location<span className="text-red-500">*</span>
                  <p className="text-sm text-muted">
                    Click to choose your event location on maps to show direction in your invitaion.
                  </p>
                  {stateFormShcedule.errors?.mb_loc_langlat && <ZodErrors err={stateFormShcedule.errors?.mb_loc_langlat} />}
                </label>
                {activeIdxTab === 1 && <MapPicker value={latLangMb} onChange={(lat, lng) => {
                  const val = [lat, lng];
                  if (val !== latLangTr) switchMbLoc(false);
                  setLatLangMb([lat, lng]);
                }} zoom={17} />}
              </div>
              <div className="col-span-12">
                <label className="block text-sm font-medium mb-2 dark:text-white">
                  Notes
                  <p className="text-sm text-muted">
                    Add important short notes regarding the marriage event if any.
                  </p>
                </label>

                <div className="grid grid-cols-12 gap-2">
                  {noteListMb.map((note, i) => (
                    <div key={i} className="col-span-12 md:col-span-3">
                      <Input
                        value={note}
                        onChange={(e) => {
                          const newNotes = [...noteListMb];
                          newNotes[i] = e.target.value;
                          setNoteListMb(newNotes);
                        }}
                        id={`mb_label_${i}`}
                        placeholder="Additional note"
                        className="py-1.5 w-full"
                        sufixGroup={
                          <i
                            onClick={() => {
                              const newNotes = [...noteListMb];
                              newNotes.splice(i, 1);
                              setNoteListMb(newNotes);
                            }}
                            className="bx bx-trash text-lg text-muted-foreground hover:text-red-500 cursor-pointer transition"
                          />
                        }
                      />
                    </div>
                  ))}

                  <div className=" col-span-12 md:col-span-3">
                    <button
                      onClick={() => {
                        setNoteListMb([...noteListMb, ""]);
                      }}
                      type="button"
                      className="py-1 px-2 text-sm flex items-center justify-center gap-1 rounded-md border-2 border-dashed border-gray-400 text-muted-foreground hover:text-primary hover:border-primary transition">
                      <i className="bx bx-plus text-lg"></i>
                      {noteListMb.length === 0 ? "Add Note" : "More"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col bg-white border border-gray-200 shadow-2xs rounded-xl mb-3">
          <div className="flex items-center justify-between bg-gray-50 border-b border-gray-200 rounded-t-xl py-3 px-4">
            <div className="text-muted font-semibold">
              <i className='bx bx-party text-xl'></i> Traditional or Reception Ceremony
            </div>

            <div className="flex items-center gap-x-3">
              <label htmlFor="hs-xs-switch-tr-ceremony" className="relative inline-block w-9 h-5 cursor-pointer">
                <input
                  checked={isCheckedTr}
                  onChange={(e) => {
                    const val = e.target.checked;
                    setIsCheckedTr(val);
                    if (val === false) switchMbLoc(false);
                  }}
                  type="checkbox" id="hs-xs-switch-tr-ceremony" className="peer sr-only"
                />
                <span className="absolute inset-0 bg-gray-200 rounded-full transition-colors duration-200 ease-in-out peer-checked:bg-blue-600 peer-disabled:opacity-50 peer-disabled:pointer-events-none"></span>
                <span className="absolute top-1/2 inset-s-0.5 -translate-y-1/2 size-4 bg-white rounded-full shadow-xs transition-transform duration-200 ease-in-out peer-checked:translate-x-full"></span>
              </label>
            </div>
          </div>
          <div className="p-3">
            {
              isCheckedTr ? (
                <div className="grid grid-cols-12 gap-3">
                  <div className="col-span-12">
                    <label className="block text-sm font-medium dark:text-white mb-1">
                      Ceremony Type
                    </label>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label htmlFor="hs-radio-traditional" className="flex p-3 w-full bg-white border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500">
                          <span className="text-sm text-black">Traditional Ceremony</span>
                          <input
                            checked={radioSelectTypeTr === TradRecepType.Traditional}
                            onChange={() => setRadioSelectTypeTr(TradRecepType.Traditional)}
                            type="radio" name="hs-radio-tr-type"
                            className="scale-150 shrink-0 ms-auto mt-0.5 border-gray-200 rounded-full text-blue-600 focus:ring-blue-500 checked:border-blue-500 disabled:opacity-50 disabled:pointer-events-none" id="hs-radio-traditional"
                          />
                        </label>
                      </div>
                      <div>
                        <label htmlFor="hs-radio-reception" className="flex p-3 w-full bg-white border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500">
                          <span className="text-sm text-black">Reception Ceremony</span>
                          <input
                            checked={radioSelectTypeTr === TradRecepType.Reception}
                            onChange={() => setRadioSelectTypeTr(TradRecepType.Reception)}
                            type="radio"
                            name="hs-radio-tr-type"
                            className="scale-150 shrink-0 ms-auto mt-0.5 border-gray-200 rounded-full text-blue-600 focus:ring-blue-500 checked:border-blue-500 disabled:opacity-50 disabled:pointer-events-none" id="hs-radio-reception"
                          />
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="col-span-12 md:col-span-4">
                    <label className="block text-sm font-medium mb-1 dark:text-white">
                      Event Date<span className="text-red-500">*</span>
                    </label>
                    <DatePicker placeholder="Choose event date" mode='single' value={eventDateTr} onChange={(date) => setDateRangeTr(date as Date)} />
                    {stateFormShcedule.errors?.tr_event_date && <ZodErrors err={stateFormShcedule.errors?.tr_event_date} />}
                  </div>
                  <div className="col-span-12 md:col-span-4">
                    <Input value={startTimeTr} onChange={(e) => setStartTimeTr(e.target.value)} type='time' id='tr_start_time' label='Start Time' mandatory />
                    {stateFormShcedule.errors?.tr_start_time && <ZodErrors err={stateFormShcedule.errors?.tr_start_time} />}
                  </div>
                  <div className="col-span-12 md:col-span-4">
                    <Input value={endTimeTr} onChange={(e) => setEndTimeTr(e.target.value)} type='time' id='tr_end_time' label='End Time' />
                  </div>
                  <div className="col-span-12">
                    <div className="flex items-center gap-x-3 mb-3 mt-2">
                      <label htmlFor="hs-xs-switch-loc-tr" className="relative inline-block w-9 h-5 cursor-pointer">
                        <input
                          checked={isTrUsingLocMb}
                          onChange={(e) => {
                            const val = e.target.checked;
                            switchMbLoc(val);
                          }}
                          type="checkbox" id="hs-xs-switch-loc-tr" className="peer sr-only" />
                        <span className="absolute inset-0 bg-gray-200 rounded-full transition-colors duration-200 ease-in-out peer-checked:bg-blue-600 peer-disabled:opacity-50 peer-disabled:pointer-events-none"></span>
                        <span className="absolute top-1/2 inset-s-0.5 -translate-y-1/2 size-4 bg-white rounded-full shadow-xs transition-transform duration-200 ease-in-out peer-checked:translate-x-full"></span>
                      </label>
                      <label htmlFor="hs-xs-switch-loc-tr" className="text-sm text-gray-500">Use Marriage Blessing Location</label>
                    </div>

                    <Input value={locNameTr} onChange={(e) => {
                      const val = e.target.value;
                      if (val !== locNameMb) switchMbLoc(false);
                      setLocNameTr(val);
                    }} label="Location Name" id="tr_loc_name" placeholder="Enter Location Name" mandatory />
                    {stateFormShcedule.errors?.tr_loc_name && <ZodErrors err={stateFormShcedule.errors?.tr_loc_name} />}
                  </div>
                  <div className="col-span-12">
                    <Textarea value={locAddressTr} onChange={(e) => {
                      const val = e.target.value;
                      if (val !== locAddressMb) switchMbLoc(false);
                      setLocAddressTr(val);
                    }} label="Location Address" id="tr_loc_address" placeholder="Enter Location Address" rows={3} />
                  </div>
                  <div className="col-span-12">
                    <label className="block text-sm font-medium mb-2 dark:text-white">
                      Choose Location<span className="text-red-500">*</span>
                      <p className="text-sm text-muted">
                        Click to choose your event location on maps to show direction in your invitaion.
                      </p>
                    </label>
                    {stateFormShcedule.errors?.tr_loc_langlat && <ZodErrors err={stateFormShcedule.errors?.tr_loc_langlat} />}
                    {activeIdxTab === 1 && <MapPicker value={latLangTr} onChange={(lat, lng) => {
                      const val = [lat, lng];
                      if (val !== latLangMb) switchMbLoc(false);
                      setLatLangTr([lat, lng]);
                    }} zoom={17} />}
                  </div>
                  <div className="col-span-12">
                    <label className="block text-sm font-medium mb-2 dark:text-white">
                      Notes
                      <p className="text-sm text-muted">
                        Add important short notes regarding the marriage event if any.
                      </p>
                    </label>

                    <div className="grid grid-cols-12 gap-2">
                      {noteListTr.map((note, i) => (
                        <div key={i} className="col-span-12 md:col-span-3">
                          <Input
                            value={note}
                            onChange={(e) => {
                              const newNotes = [...noteListTr];
                              newNotes[i] = e.target.value;
                              setNoteListTr(newNotes);
                            }}
                            id={`tr_label_${i}`}
                            placeholder="Additional note"
                            className="py-1.5 w-full"
                            sufixGroup={
                              <i
                                onClick={() => {
                                  const newNotes = [...noteListTr];
                                  newNotes.splice(i, 1);
                                  setNoteListTr(newNotes);
                                }}
                                className="bx bx-trash text-lg text-muted-foreground hover:text-red-500 cursor-pointer transition"
                              />
                            }
                          />
                        </div>
                      ))}

                      <div className=" col-span-12 md:col-span-3">
                        <button
                          onClick={() => {
                            setNoteListTr([...noteListTr, ""]);
                          }}
                          type="button"
                          className="py-1 px-2 text-sm flex items-center justify-center gap-1 rounded-md border-2 border-dashed border-gray-400 text-muted-foreground hover:text-primary hover:border-primary transition">
                          <i className="bx bx-plus text-lg"></i>
                          {noteListTr.length === 0 ? "Add Note" : "More"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="min-h-52 flex items-center justify-center px-4">
                  <div className="max-w-md w-full text-center">
                    <div className="mx-auto mb-4 flex items-center justify-center h-14 w-14 rounded-full bg-gray-100">
                      <i className="bx bx-toggle-left text-4xl text-gray-400"></i>
                    </div>
                    <div className="text-sm font-medium text-gray-700">
                      This feature is not active!
                    </div>
                    <p className="text-sm/6 text-gray-500">
                      Turn on the switch above to add details for your Traditional / Reception Ceremony.
                    </p>
                  </div>
                </div>
              )
            }
          </div>
        </div>

        <>
          {/* {
          schedulerDtoData.map((sced, i) => (
            <div key={i} className="flex flex-col bg-white border border-gray-200 shadow-2xs rounded-xl mt-5 mb-3">
              <div className="flex justify-between items-center bg-gray-100 border-b border-gray-200 rounded-t-xl py-2 px-4">
                <div className="text-muted font-semibold">
                  <i className='bx bx-party text-xl'></i> Additionals Event - {i + 1}
                </div>
                <div>
                  <button type="button" className=" text-muted-foreground hover:text-red-500 cursor-pointer transition p-2 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-2xs hover:bg-gray-50 focus:outline-hidden focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none">
                    <i className="bx bx-trash text-lg" />
                  </button>
                </div>
              </div>
              <div className="p-3">
                <div className="grid grid-cols-12 gap-3">
                  <div className="col-span-12 md:col-span-6">
                    <Input label="Ceremony Name" id={`cst_event_name_${i}`} placeholder="Enter Ceremony Name" mandatory />
                  </div>
                  <div className="col-span-12 md:col-span-6">
                    <label className="block text-sm font-medium mb-1 dark:text-white">
                      Event Date<span className="text-red-500">*</span>
                    </label>
                    <DatePicker placeholder="Choose event date" mode='single' value={eventDateMb} onChange={(date) => setDateRangeMb(date as Date)} />
                  </div>
                  <div className="col-span-12 md:col-span-6">
                    <Input type='time' id={`cst_start_time_${i}`} label='Start Time' mandatory />
                  </div>
                  <div className="col-span-12 md:col-span-6">
                    <Input type='time' id={`cst_end_time_${i}`} label='End Time' />
                  </div>

                  <div className="col-span-12">
                    <div className="flex items-center gap-x-3 mb-3 mt-1">
                      <label htmlFor={`hs-xs-switch-loc-cst-${i}`} className="relative inline-block w-9 h-5 cursor-pointer">
                        <input type="checkbox" id={`hs-xs-switch-loc-cst-${i}`} className="peer sr-only" />
                        <span className="absolute inset-0 bg-gray-200 rounded-full transition-colors duration-200 ease-in-out peer-checked:bg-blue-600 peer-disabled:opacity-50 peer-disabled:pointer-events-none"></span>
                        <span className="absolute top-1/2 inset-s-0.5 -translate-y-1/2 size-4 bg-white rounded-full shadow-xs transition-transform duration-200 ease-in-out peer-checked:translate-x-full"></span>
                      </label>
                      <label htmlFor={`hs-xs-switch-loc-cst-${i}`} className="text-sm text-gray-500">Use Marriage Blessing Location</label>
                    </div>

                    <Input label="Location Name" id={`cst_loc_name_${i}`} placeholder="Enter Location Name" mandatory />
                  </div>
                  <div className="col-span-12">
                    <Textarea label="Location Address" id={`cst_loc_address_${i}`} placeholder="Enter Location Address" rows={3} />
                  </div>
                  <div className="col-span-12">
                    <label className="block text-sm font-medium mb-2 dark:text-white">
                      Choose Location<span className="text-red-500">*</span>
                      <p className="text-sm text-muted">
                        Click to choose your event location on maps to show direction in your invitaion.
                      </p>
                    </label>
                    {activeIdxTab === 1 && <MapPicker />}
                  </div>
                  <div className="col-span-12">
                    <label className="block text-sm font-medium mb-2 dark:text-white">
                      Notes
                      <p className="text-sm text-muted">
                        Add important short notes regarding the marriage event if any.
                      </p>
                    </label>

                    <div className="grid grid-cols-12 gap-2">
                      {
                        sced.notes.map((note, j) => (
                          <div key={j} className="col-span-12 md:col-span-3">
                            <Input
                              id={`cst_label_${i}_${j}`}
                              placeholder="Additional note"
                              className="py-1.5 w-full"
                              sufixGroup={
                                <i
                                  className="bx bx-trash text-lg text-muted-foreground hover:text-red-500 cursor-pointer transition"
                                />
                              }
                            />
                          </div>
                        ))
                      }

                      <div className=" col-span-12 md:col-span-3">
                        <button
                          type="button"
                          className="py-1 px-2 text-sm flex items-center justify-center gap-1 rounded-md border-2 border-dashed border-gray-400 text-muted-foreground hover:text-primary hover:border-primary transition">
                          <i className="bx bx-plus text-lg"></i>
                          {sced.notes.length === 0 ? "Add Note" : "More"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        } */}

          {/* <button onClick={() => addMoreCeremony()} type="button" className="w-full mb-3 mt-1 py-2 px-3 inline-flex justify-center items-center text-sm font-medium rounded-lg border border-transparent bg-blue-100 text-blue-800 hover:bg-blue-200 focus:outline-hidden focus:bg-blue-200 disabled:opacity-50 disabled:pointer-events-none">
          <i className='bx bx-plus text-lg'></i> More Ceremony
        </button> */}
        </>

        <Textarea value={scheduleNote} onChange={(e) => setScheduleNote(e.target.value)} label="Notes" id="shedule_notes" placeholder="Enter Event Schedule If Any" rows={3} />

        <div className="text-xs text-gray-500 sm:order-1 order-1 italic mt-3 mb-2">
          <p>Fields marked with <span className="text-red-500">*</span> are required.</p>
        </div>
        <button type="submit" className="py-1.5 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-hidden focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none">
          Submit
        </button>
      </form>
    </div>
  )
};

function GalleryTabContent(event_id: number) {
  const { setLoading } = useLoading();
  const { activeIdxTab } = useTabEventDetail();
  const inputRef = useRef<HTMLInputElement>(null);
  const [images, setImages] = useState<DtoEventGallery[]>([]);

  const [inputPage, setInputPage] = useState("1");
  const [pageTable, setPageTable] = useState(1);
  const [perPage, setPerPage] = useState(8);
  const [totalPage, setTotalPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [tblThColomns, setTblThColomns] = useState<TableThModel[]>([
    { name: "Image Name", key: "img_name", key_sort: "img_name", IsVisible: true },
    { name: "Image URL", key: "img_path", key_sort: "img_path", IsVisible: true },
  ]);

  const handleFileCaptureChange = async (e: { target: { files: FileList | null } }) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if ((files.length + images.length) > Configs.p_limit) {
      toast({
        type: "warning",
        title: "Limit Exceeded",
        message: `You can only upload up to ${Configs.p_limit} files.`,
      });
      if (inputRef.current) {
        if (e.target && 'value' in e.target) (e.target as HTMLInputElement).value = "";
        inputRef.current.value = "";
      }
      return;
    }

    const allowedTypes = ["image/jpg", "image/jpeg", "image/png"];
    const maxSizeInMB = Configs.maxSizePictureInMB;
    const maxSizeInBytes = maxSizeInMB * 1024 * 1024;

    const newImages: DtoEventGallery[] = [];
    let invalidTypeCount = 0;
    let invalidSizeCount = 0;

    for (const file of Array.from(files)) {
      if (!allowedTypes.includes(file.type)) {
        invalidTypeCount++;
        continue;
      }

      if (file.size > maxSizeInBytes) {
        invalidSizeCount++;
        continue;
      }

      newImages.push({
        id: null,
        img_name: `${file.name}.${file.type}`,
        img_url: URL.createObjectURL(file),
        file,
      });
    };

    const totalFiles = files.length;
    const validCount = newImages.length;
    const totalInvalid = invalidTypeCount + invalidSizeCount;

    if (validCount === 0) {
      toast({
        type: "warning",
        title: "Invalid Files",
        message: "All selected files are invalid.",
      });
      return;
    }

    let message = `${totalFiles} file${totalFiles === 1 ? '' : 's'} selected.\n`;
    message += `${validCount} file${validCount === 1 ? '' : 's'} ready to upload.`;

    if (totalInvalid > 0) {
      if (invalidTypeCount > 0) {
        message += `\n ${invalidTypeCount} invalid file type.`;
      }

      if (invalidSizeCount > 0) {
        message += `\n ${invalidSizeCount} file${invalidSizeCount === 1 ? '' : 's'} exceed ${maxSizeInMB}MB.`;
      }
    }
    message += `\nDo you want to continue?`;

    const confirmed = await showConfirm({
      title: 'Upload Confirmation?',
      message: message,
      confirmText: 'Yes, Upload',
      cancelText: 'No, Go Back',
      icon: 'bx bx-error bx-tada text-blue-500'
    });
    if (!confirmed) return;

    setLoading(true);
    await StoreEventGalleries(event_id, newImages);
    toast({
      type: "success",
      title: "Upload successfully",
      message: "Your upload has been successfully completed"
    });
    await fatchDatas();
    setLoading(false);
  };

  const handleDragOverCapture = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.add('bg-gray-100', 'rounded-xl');
  };
  const handleDragLeaveCapture = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove('bg-gray-100', 'rounded-xl');
  };
  const handleDropCapture = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove('bg-gray-100', 'rounded-xl');

    const files = e.dataTransfer.files;
    handleFileCaptureChange({ target: { files } });
  };

  const fatchDatas = async (page: number = pageTable, countPage: number = perPage) => {
    const selectObj = normalizeSelectObj(tblThColomns);

    const result = await GetEventGalleryByEventId(event_id, {
      curPage: page,
      perPage: countPage,
      select: {
        id: true,
        ...selectObj
      }
    });

    setTotalPage(result.meta.totalPages);
    setTotalCount(result.meta.total);
    setPageTable(result.meta.page);
    setInputPage(result.meta.page.toString());

    if (result.data.length > 0) {
      const createDatas: DtoEventGallery[] = result.data.map((x) => ({
        id: x.id,
        img_name: x.img_name ?? "",
        img_url: x.img_path ?? "",
      }));
      setImages(createDatas);
    }
  };

  useEffect(() => {
    const setDatas = async () => {
      setLoading(true);
      await fatchDatas();
      setLoading(false);
    };
    if (activeIdxTab == 2) setDatas();
  }, [activeIdxTab]);

  const deleteImage = async (idx: number, gallery_id: number | null) => {
    if (!gallery_id) return;
    const confirmed = await showConfirm({
      title: 'Delete Confirmation?',
      message: 'Are your sure want to delete this record? You will not abel to undo this action!',
      confirmText: 'Yes, Delete',
      cancelText: 'No, Keep It',
      icon: 'bx bx-trash bx-tada text-red-500'
    });
    if (!confirmed) return;

    setLoading(true);

    await DeleteEventGalleryById(event_id, gallery_id);

    setImages((prev) => prev.filter((_, i) => i !== idx));
    setLoading(false);
  };

  return (
    <div>
      <div className="mb-7 mt-3 text-center">
        <div className="flex justify-center items-center gap-1 text-lg font-semibold text-gray-800">
          <i className="bx bx-photo-album text-xl"></i> Memories Gallery
        </div>
        <p className="text-sm text-gray-500">
          Upload and manage your wedding gallery photos to share memorable moments with your guests.
        </p>
      </div>

      <div onDragOver={handleDragOverCapture} onDrop={handleDropCapture} onDragLeave={handleDragLeaveCapture} className="hover:bg-gray-100 rounded-xl">
        <label htmlFor="file-upload-gallery" className="cursor-pointer px-6 h-64 flex justify-center items-center bg-transparent border-2 border-dashed border-gray-300 rounded-xl">
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

            <div className="flex flex-wrap justify-center text-sm/6 text-gray-600 mt-2">
              <span className="pe-1 font-medium text-gray-800">
                Drop file here or click to
              </span>
              <span className="font-semibold text-blue-600 hover:underline">
                browse
              </span>
            </div>

            <p className="text-xs text-gray-400 mt-0">
              Allowed formats JPG, JPEG, PNG up to {Configs.maxSizePictureInMB}MB
            </p>

            <input
              ref={inputRef}
              type="file"
              onChange={handleFileCaptureChange}
              multiple
              id="file-upload-gallery"
              className="hidden"
              accept="image/*"
            />
          </div>
        </label>
      </div>

      <div className="bg-white border border-gray-200 shadow-2xs rounded-xl p-3 mt-4">
        <div>
          <div className="flex items-center gap-2 text-base font-semibold text-gray-800">
            <i className="bx bx-photo-album text-xl"></i>
            Gallery Photos
          </div>
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">
              A maximum of 25 files can be uploaded.
              {/* Here your photo gallery list for guests to view and enjoy. */}
            </p>
            <p className="text-sm text-gray-500">
              Files: {images.length}/25
            </p>
          </div>
          <hr className="my-2 text-gray-300" />
        </div>

        <div className="flex flex-col">
          {images.length === 0 ? (
            <div className="text-center py-16">
              <div className="mx-auto mb-4 h-14 w-14 rounded-full bg-rose-100 flex items-center justify-center">
                <svg
                  className="h-7 w-7 text-rose-400"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path d="M4 16l4-4a3 3 0 014 0l4 4M2 20h20M6 4h12v6H6z" />
                </svg>
              </div>

              <div className="text-sm font-medium text-gray-700">
                Your gallery moment is empty!
              </div>
              <p className="text-sm/6 text-gray-500">
                Add your beautiful moments to be displayed on the invitation
              </p>
            </div>
          ) : (
            <div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-2">
                {images.map((img, idx) => (
                  <div
                    key={idx}
                    className="relative aspect-square overflow-hidden rounded-xl border border-gray-200"
                  >
                    <img
                      src={img.img_url}
                      alt="Uploaded"
                      className="object-cover w-full h-full"
                    />

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteImage(idx, img.id);
                      }}
                      className="leading-0 absolute top-2 right-2 z-10 rounded-full bg-white/90 backdrop-blur p-1 text-gray-700 shadow hover:bg-red-50 hover:text-red-500 transition"
                      aria-label="Hapus foto"
                    >
                      <i className="bx bx-x text-xl"></i>
                    </button>
                  </div>
                ))}
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
          )}
        </div>
      </div>

    </div>
  )
};

function HistoryTabContent(event_id: number) {
  const { setLoading } = useLoading();
  const { activeIdxTab } = useTabEventDetail();
  const modalAddEdit = "modal-add-edit-history-wedding";
  const btnCloseModal = "btn-close-modal-history-wedding";

  // For Gallery List in Form History
  const [galleryList, setGalleryList] = useState<EventGalleries[]>([]);
  const [inputPageGallery, setInputPageGallery] = useState("1");
  const [pageTableGallery, setPageTableGallery] = useState(1);
  const [perPageGallery, setPerPageGallery] = useState(6);
  const [totalPageGallery, setTotalPageGallery] = useState(0);
  const [totalCountGallery, setTotalCountGallery] = useState(0);
  const [tblThColomnsGallery, setTblThColomnsGallery] = useState<TableThModel[]>([
    { name: "Image Name", key: "img_name", key_sort: "img_name", IsVisible: true },
    { name: "Image URL", key: "img_path", key_sort: "img_path", IsVisible: true },
  ]);
  // End For Gallery List in Form History

  const [inputPage, setInputPage] = useState("1");
  const [pageTable, setPageTable] = useState(1);
  const [perPage, setPerPage] = useState(9);
  const [totalPage, setTotalPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [datas, setDatas] = useState<(EventHistories & { gallery?: EventGalleries | null })[]>([]);
  const [inputSearch, setInputSearch] = useState("");
  const [tblSortList, setTblSortList] = useState<TableShortList[]>([]);
  const [tblThColomns, setTblThColomns] = useState<TableThModel[]>([
    { name: "Title", key: "name", key_sort: "name", IsVisible: true },
    { name: "Month", key: "month", key_sort: "month", IsVisible: true },
    { name: "Year", key: "year", key_sort: "year", IsVisible: true },
    { name: "Description", key: "desc", key_sort: "desc", IsVisible: true },
    { name: "Gallery", key: "gallery_id", key_sort: "gallery_id", IsVisible: true },
  ]);

  const [stateFormHistory, setStateFormHistory] = useState<FormState>({ success: false, errors: {} });
  const [addEditId, setAddEditId] = useState<number | null>(null);
  const [historyTitle, setHistoryTitle] = useState("");
  const [historyTime, setHistoryTime] = useState("");
  const [historyDesc, setHistoryDesc] = useState("");
  const [selectedImgHistory, setSelectedImgHistory] = useState<number | null>(null);

  const openModalAddEdit = async (id?: number) => {
    if (id) {
      setLoading(true);
      const data = await GetDataEventHistoriesById(id);
      if (data) {
        setAddEditId(data.id);
        setHistoryTitle(data.name ?? "");
        setHistoryTime(`${data.year}-${data.month}`);
        setHistoryDesc(data.desc ?? "");
        setSelectedImgHistory(data.gallery_id);
      }
      setLoading(false);
    } else {
      setAddEditId(null);
      setHistoryTitle("");
      setHistoryTime("");
      setHistoryDesc("");
      setSelectedImgHistory(null);
    }

    setStateFormHistory({ success: true, errors: {} });
    modalAction(`btn-${modalAddEdit}`);
  };

  const createDtoData = (): DtoEventHistory => {
    const data = {
      id: addEditId,
      name: historyTitle,
      month_year: historyTime,
      desc: historyDesc,
      gallery_id: selectedImgHistory,
    };

    return data;
  };

  const FormSchemaHistory = z.object({
    history_title: z.string().min(1, { message: 'Title is required field.' }).trim(),
    history_month: z.string().min(1, { message: 'Month is required field.' }).trim(),
    history_desc: z.string().min(1, { message: 'History description is required field.' }).trim(),
  });

  const handleSubmitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const data = Object.fromEntries(formData);
    const valResult = FormSchemaHistory.safeParse(data);
    if (!valResult.success) {
      setStateFormHistory({
        success: false,
        errors: valResult.error.flatten().fieldErrors,
      });
      return;
    };
    setStateFormHistory({ success: true, errors: {} });

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
      await StoreUpdateHistory(event_id, createDtoData());
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
      await DeleteDataEventHistories(id);
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

  const fetchDatasGallery = async (page: number = pageTableGallery, countPage: number = perPageGallery) => {
    const selectObj = normalizeSelectObj(tblThColomnsGallery);
    const result = await GetEventGalleryByEventId(event_id, {
      curPage: page,
      perPage: countPage,
      select: {
        id: true,
        ...selectObj
      }
    });

    setTotalPageGallery(result.meta.totalPages);
    setTotalCountGallery(result.meta.total);
    setPageTableGallery(result.meta.page);
    setInputPageGallery(result.meta.page.toString());
    setGalleryList(result.data);
  };

  const fatchDatas = async (page: number = pageTable, countPage: number = perPage) => {
    const selectObj = normalizeSelectObj(tblThColomns);
    const orderObj = sortListToOrderBy(tblSortList);

    try {
      const result = await GetDataEventHistories({
        curPage: page,
        perPage: countPage,
        where: {
          OR: [
            { name: { contains: inputSearch.trim(), mode: "insensitive" } },
          ]
        },
        select: {
          id: true,
          event_id: true,
          gallery: true,
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
    const timer = setTimeout(() => {
      fatchDatas(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [inputSearch]);

  const [isFirstRender, setIsFirstRender] = useState(true);
  useEffect(() => {
    const fatchNeedData = async () => {
      setLoading(true);
      await fetchDatasGallery();

      await fatchDatas();
      setIsFirstRender(false);
      setLoading(false);
    };

    if (activeIdxTab == 3) fatchNeedData();
  }, [activeIdxTab]);

  return (
    <div>
      <div className="mb-7 mt-3 text-center">
        <div className="flex justify-center items-center gap-1 text-lg font-semibold text-gray-800">
          <i className="bx bx-book-heart text-xl"></i> Journey of Love
        </div>
        <p className="text-sm text-gray-500">
          Share your love story and memorable moments leading up to your wedding day.
        </p>

        <button onClick={() => openModalAddEdit()} type="button"
          className="mt-2 py-1.5 px-3 inline-flex items-center text-sm font-medium rounded-lg border border-transparent bg-blue-100 text-blue-800 hover:bg-blue-200 focus:outline-hidden focus:bg-blue-200 disabled:opacity-50 disabled:pointer-events-none">
          <i className='bx bx-plus text-lg'></i> Add Story
        </button>
        <button id={`btn-${modalAddEdit}`} type="button" aria-haspopup="dialog" aria-expanded="false" aria-controls={modalAddEdit} data-hs-overlay={`#${modalAddEdit}`} className="hidden">-</button>
      </div>

      <TableTopToolbar
        inputSearch={inputSearch}
        tblSortList={tblSortList}
        thColomn={tblThColomns}
        setTblSortList={setTblSortList}
        setInputSearch={setInputSearch}
        fatchData={() => fatchDatas(pageTable)}
      />

      <div className="my-3">
        {
          datas.length > 0 ? <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {
              datas.map((x, i) => (
                <div key={x.id} className="flex flex-col bg-white border border-gray-200 shadow-2xs rounded-xl">
                  <div className="flex justify-between items-center bg-gray-100 border-b border-gray-200 rounded-t-xl py-2 px-3">
                    <div className="text-sm text-gray-500">
                      {getMonthName(x.month)} ~ {x.year}
                    </div>
                    <div className="space-x-1">
                      <button onClick={() => openModalAddEdit(x.id)} type="button" className="p-2 inline-flex items-center gap-x-2 text-sm font-medium rounded-full border border-gray-200 bg-white text-gray-800 shadow-2xs hover:bg-gray-50 focus:outline-hidden focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none">
                        <i className='bx bxs-edit text-lg text-amber-500'></i>
                      </button>
                      <button onClick={() => deleteRow(x.id)} type="button" className="p-2 inline-flex items-center gap-x-2 text-sm font-medium rounded-full border border-gray-200 bg-white text-gray-800 shadow-2xs hover:bg-gray-50 focus:outline-hidden focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none">
                        <i className='bx bx-trash text-lg text-red-600'></i>
                      </button>
                    </div>
                  </div>

                  <div className="relative w-full h-44 md:h-52">
                    {
                      x.gallery ? <img
                        // src="https://picsum.photos/500/600?random=1"
                        src={x.gallery.img_path ?? ""}
                        alt="Card image"
                        className="w-full h-full object-cover"
                      /> : <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 text-gray-400">
                        <i className="bx bx-image-alt text-5xl mb-1"></i>
                        <p className="text-sm font-medium">No image set</p>
                      </div>
                    }
                  </div>

                  <div className="px-3 py-2">
                    <div className="text-base font-bold text-gray-800">
                      {x.name}
                    </div>
                    <p className="text-sm text-gray-500">
                      {x.desc}
                    </p>
                  </div>
                </div>
              ))
            }
          </div> : <div className="flex flex-col bg-white border border-gray-200 shadow-2xs rounded-xl p-3">
            <div className="min-h-52 flex items-center justify-center px-4">
              <div className="max-w-md w-full text-center">
                <div className="mx-auto mb-4 flex items-center justify-center h-14 w-14 rounded-full bg-gray-100">
                  <i className="bx bx-folder-open text-2xl text-gray-400"></i>
                </div>
                <div className="text-sm font-medium text-gray-700">
                  Your journey moment is empty!
                </div>
                <p className="text-sm/6 text-gray-500">
                  Add your beautiful moments to be displayed on the invitation
                </p>
              </div>
            </div>
          </div>
        }
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

      <UiPortal>
        <div id={modalAddEdit} className="hs-overlay hidden size-full fixed bg-black/30 top-0 inset-s-0 z-80 overflow-x-hidden overflow-y-auto pointer-events-none" role="dialog">
          <div className="sm:max-w-md hs-overlay-open:mt-7 hs-overlay-open:opacity-100 hs-overlay-open:duration-500 mt-0 opacity-0 ease-out transition-all sm:w-full m-3 h-[calc(100%-56px)] sm:mx-auto flex items-center">
            <form onSubmit={handleSubmitForm} className="max-h-full overflow-hidden w-full flex flex-col bg-white border border-gray-200 shadow-2xs rounded-xl pointer-events-auto">
              <div className="flex justify-between items-center py-2 px-4 border-b border-gray-200">
                <div>
                  <div className="flex items-center gap-1 text-sm mb-0.5">
                    <i className='bx bx-book-heart text-lg'></i> {addEditId ? "Edit" : "Add"} History
                  </div>
                  <p className='text-xs text-muted'>Here form to register or edit History data</p>
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
                <div className="grid grid-cols-12 gap-2">
                  <div className="col-span-12 md:col-span-6">
                    <Input value={historyTitle} onChange={(e) => setHistoryTitle(e.target.value)} type='text' id='history_title' label='Title' placeholder='Enter history title' mandatory />
                    {stateFormHistory.errors?.history_title && <ZodErrors err={stateFormHistory.errors?.history_title} />}
                  </div>
                  <div className="col-span-12 md:col-span-6">
                    <Input value={historyTime} onChange={(e) => setHistoryTime(e.target.value)} type='month' id='history_month' label='Month' mandatory />
                    {stateFormHistory.errors?.history_month && <ZodErrors err={stateFormHistory.errors?.history_month} />}
                  </div>
                  <div className="col-span-12">
                    <Textarea value={historyDesc} onChange={(e) => setHistoryDesc(e.target.value)} label="Description" id="history_desc" placeholder="Enter history description" rows={3} mandatory />
                    {stateFormHistory.errors?.history_desc && <ZodErrors err={stateFormHistory.errors?.history_desc} />}
                  </div>
                  <div className="col-span-12">
                    <label className="block text-sm font-medium dark:text-white mb-1">
                      Image
                      <p className="text-sm text-muted">
                        The available Images are taken from the gallery tab.
                      </p>
                    </label>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-2">
                      {galleryList.map((x, i) => (
                        // <img key={i} src={x.img_path ?? ""} alt={`image-${i}`} className="w-full h-24 object-cover rounded-md border border-gray-200" />
                        <div key={i} className="relative rounded-md overflow-hidden border border-gray-200">
                          <img
                            src={x.img_path ?? ""}
                            alt={`image-${i}`}
                            className="w-full h-24 object-cover cursor-pointer"
                            onClick={() => setSelectedImgHistory(prev => prev === x.id ? null : x.id)}
                          />
                          <div className="absolute top-2 right-2">
                            <Input
                              checked={selectedImgHistory === x.id}
                              onChange={() => setSelectedImgHistory(prev => prev === x.id ? null : x.id)}
                              type="checkbox"
                              className="scale-150 cursor-pointer"
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    <TablePagination
                      pageTable={pageTableGallery}
                      totalPage={totalPageGallery}
                      totalCount={totalCountGallery}
                      setPerPage={setPerPageGallery}
                      setPageTable={setPageTableGallery}
                      fatchData={fetchDatasGallery}

                      inputPage={inputPageGallery}
                      setInputPage={setInputPageGallery}
                    />
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
    </div>
  )
};

function GiftTabContent({ dataEvent }: { dataEvent: Events }) {
  const { setLoading } = useLoading();
  const { activeIdxTab } = useTabEventDetail();
  const modalAddEdit = "modal-add-edit-gift-wedding";
  const btnCloseModal = "btn-close-modal-gift-wedding";

  const modalWishlistAddress = "modal-add-edit-wishlist-address";
  const btnCloseModalWishlistAddress = "btn-close-modal-wishlist-address";

  const allPaymentMethod = PaymentMethodKeys.filter(x => x.status === true);

  const [stateFormGift, setStateFormGift] = useState<FormState>({ success: false, errors: {} });
  const [addEditId, setAddEditId] = useState<number | null>(null);
  const [giftType, setGiftType] = useState<EventGiftTypeEnum>(EventGiftTypeEnum.Transfer);

  // For Transfer Gift
  const [tfMethood, setTfMethod] = useState<string>("");
  const [tfAccountName, setTfAccountName] = useState("");
  const [tfAccountNumber, setTfAccountNumber] = useState("");
  // End For Transfer Gift

  // For Wishlist Gift
  const [productName, setProductName] = useState("");
  const [reservationQty, setReservationQty] = useState<number | "">(1);
  const [reservationUrl, setReservationUrl] = useState("");
  const [productPrice, setProductPrice] = useState("");
  // End For Wishlist Gift

  const [stateFormShippingAddress, setStateFormShippingAddress] = useState<FormState>({ success: false, errors: {} });
  const [shippingAddress, setShippingAddress] = useState<string>(dataEvent.wishlist_address ?? "");
  const [isHaveShippingAdd, setIsHaveShippingAdd] = useState<boolean>(dataEvent.wishlist_address != null ? true : false);

  const createDtoData = (): DtoEventGift => {
    const data = {
      id: addEditId,
      type: giftType,
      name: giftType === EventGiftTypeEnum.Transfer ? tfMethood : giftType === EventGiftTypeEnum.Wishlist ? productName : "",

      account: giftType === EventGiftTypeEnum.Transfer ? tfAccountName : null,
      no_rek: giftType === EventGiftTypeEnum.Transfer ? tfAccountNumber : null,

      qty: giftType === EventGiftTypeEnum.Wishlist ? (reservationQty === "" ? 1 : reservationQty) : null,
      product_url: giftType === EventGiftTypeEnum.Wishlist ? reservationUrl : null,
      product_price: giftType === EventGiftTypeEnum.Wishlist ? parseFromIDR(productPrice) : null,
    };

    return data;
  };

  const openModalAddEdit = async (type: EventGiftTypeEnum, id?: number) => {
    if (type === "Wishlist") {
      if (isHaveShippingAdd === false) {
        toast({
          type: "warning",
          title: "Shipping Address Needed!",
          message: "Please enter the shipping address before adding wishlist."
        });
        return;
      }
    }

    setGiftType(type);

    setTfMethod("");
    setTfAccountName("");
    setTfAccountNumber("");

    setProductName("");
    setReservationQty(1);
    setReservationUrl("");
    setProductPrice("");

    if (id) {
      setLoading(true);
      const data = await GetDataEventGiftsById(id);
      if (data) {
        setAddEditId(data.id);
        setGiftType(data.type);

        if (data.type === EventGiftTypeEnum.Transfer) {
          setTfMethod(data.name);
          setTfAccountName(data.account ?? "");
          setTfAccountNumber(data.no_rek ?? "");
        } else if (data.type === EventGiftTypeEnum.Wishlist) {
          setProductName(data.name);
          setReservationQty(data.qty ?? 1);
          setReservationUrl(data.product_url ?? "");
          setProductPrice(data.product_price ? data.product_price.toLocaleString('id-ID') : "");
        }
      }
      setLoading(false);
    }

    setStateFormGift({ success: true, errors: {} });
    modalAction(`btn-${modalAddEdit}`);
  };

  const openModalWishlistAddress = async () => {
    setStateFormShippingAddress({ success: true, errors: {} });
    setShippingAddress("");
    setLoading(true);
    const getSchadule = await GetDataEventWithSelect({
      event_id: dataEvent.id, select: {
        wishlist_address: true
      }
    });
    setShippingAddress(getSchadule ? getSchadule.wishlist_address ?? "" : "");
    setIsHaveShippingAdd(getSchadule ? getSchadule.wishlist_address != null ? true : false : false);
    setLoading(false);

    modalAction(`btn-${modalWishlistAddress}`);
  };

  const FormSchemaWishlistAddress = z.object({
    shipping_address: z.string().min(1, { message: 'Address is required field.' }).trim(),
  });
  const handleSubmitFormWishlistAddress = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const data = Object.fromEntries(formData);
    const valResult = FormSchemaWishlistAddress.safeParse(data);
    if (!valResult.success) {
      setStateFormShippingAddress({
        success: false,
        errors: valResult.error.flatten().fieldErrors,
      });
      return;
    };
    setStateFormShippingAddress({ success: true, errors: {} });

    modalAction(btnCloseModalWishlistAddress);
    const confirmed = await showConfirm({
      title: 'Submit Confirmation?',
      message: 'Are you sure you want to submit this form? Please double-check before proceeding!',
      confirmText: 'Yes, Submit',
      cancelText: 'No, Go Back',
      icon: 'bx bx-error bx-tada text-blue-500'
    });
    if (!confirmed) {
      modalAction(`btn-${modalWishlistAddress}`);
      return;
    }

    setLoading(true);
    try {
      await UpdateShippingAddress(dataEvent.id, shippingAddress.trim());
      setIsHaveShippingAdd(true);
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
      modalAction(`btn-${modalWishlistAddress}`);
    }
    setLoading(false);
  };

  const handleSubmitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const FormSchemaTfGift = z.object({
      receipt_method: z.string().min(1, { message: 'Method is required field.' }).trim(),
      account_name: z.string().min(1, { message: 'A/N is required field.' }).trim(),
      account_number: z.string().min(1, { message: 'Account number is required field.' }).trim(),
    });

    const FormSchemaWhGift = z.object({
      product_name: z.string().min(1, { message: 'Name is required field.' }).trim(),
      reservation_qty: z.string().min(1, { message: 'QTY is required field.' }).trim(),
      product_price: z.string().min(1, { message: 'Price required field.' }).trim(),
    });

    const FormSchemaGift = giftType === EventGiftTypeEnum.Transfer ? FormSchemaTfGift : giftType === EventGiftTypeEnum.Wishlist ? FormSchemaWhGift : z.object({});

    const data = Object.fromEntries(formData);
    const valResult = FormSchemaGift.safeParse(data);
    if (!valResult.success) {
      setStateFormGift({
        success: false,
        errors: valResult.error.flatten().fieldErrors,
      });
      return;
    };
    setStateFormGift({ success: true, errors: {} });

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
      const createDto = createDtoData();
      await StoreUpdateGift(dataEvent.id, createDto);

      if (createDto.type === EventGiftTypeEnum.Transfer) await fatchDatasTf();
      else if (createDto.type === EventGiftTypeEnum.Wishlist) await fatchDatasWs();
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

  const [isFirstRender, setIsFirstRender] = useState(true);

  // For Transfer Gift
  const [inputPageTf, setInputPageTf] = useState("1");
  const [pageTableTf, setPageTableTf] = useState(1);
  const [perPageTf, setPerPageTf] = useState(8);
  const [totalPageTf, setTotalPageTf] = useState(0);
  const [totalCountTf, setTotalCountTf] = useState(0);
  const [datasTf, setDatasTf] = useState<EventGifts[]>([]);
  const [inputSearchTf, setInputSearchTf] = useState("");
  const [tblSortListTf, setTblSortListTf] = useState<TableShortList[]>([]);
  const [tblThColomnsTf, setTblThColomnsTf] = useState<TableThModel[]>([
    { name: "Name", key: "name", key_sort: "name", IsVisible: true },
    { name: "Account", key: "account", key_sort: "account", IsVisible: true },
    { name: "No Rek", key: "no_rek", key_sort: "no_rek", IsVisible: true },
  ]);

  const fatchDatasTf = async (page: number = pageTableTf, countPage: number = perPageTf) => {
    const selectObj = normalizeSelectObj(tblThColomnsTf);
    const orderObj = sortListToOrderBy(tblSortListTf);

    try {
      const result = await GetDataEventGifts(dataEvent.id, {
        curPage: page,
        perPage: countPage,
        where: {
          type: EventGiftTypeEnum.Transfer,
          OR: [
            { name: { contains: inputSearchTf.trim(), mode: "insensitive" } },
            { account: { contains: inputSearchTf.trim(), mode: "insensitive" } },
            { no_rek: { contains: inputSearchTf.trim(), mode: "insensitive" } },
          ]
        },
        select: {
          id: true,
          type: true,
          ...selectObj
        },
        orderBy: orderObj
      });
      setTotalPageTf(result.meta.totalPages);
      setTotalCountTf(result.meta.total);
      setPageTableTf(result.meta.page);
      setInputPageTf(result.meta.page.toString());

      setDatasTf(result.data);
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
    if (tblSortListTf.length === 0) fatchDatasTf();
  }, [tblSortListTf]);
  useEffect(() => {
    if (isFirstRender) return;
    const timer = setTimeout(() => {
      fatchDatasTf(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [inputSearchTf]);
  // End For Transfer Gift

  // For Wishlist Gift
  const [inputPageWs, setInputPageWs] = useState("1");
  const [pageTableWs, setPageTableWs] = useState(1);
  const [perPageWs, setPerPageWs] = useState(8);
  const [totalPageWs, setTotalPageWs] = useState(0);
  const [totalCountWs, setTotalCountWs] = useState(0);
  const [datasWs, setDatasWs] = useState<EventGifts[]>([]);
  const [inputSearchWs, setInputSearchWs] = useState("");
  const [tblSortListWs, setTblSortListWs] = useState<TableShortList[]>([]);
  const [tblThColomnsWs, setTblThColomnsWs] = useState<TableThModel[]>([
    { name: "Name", key: "name", key_sort: "name", IsVisible: true },
    { name: "QTY", key: "qty", key_sort: "qty", IsVisible: true },
    { name: "URL", key: "product_url", key_sort: "product_url", IsVisible: true },
    { name: "Price", key: "product_price", key_sort: "product_price", IsVisible: true },
  ]);

  const fatchDatasWs = async (page: number = pageTableWs, countPage: number = perPageWs) => {
    const selectObj = normalizeSelectObj(tblThColomnsWs);
    const orderObj = sortListToOrderBy(tblSortListWs);

    try {
      const result = await GetDataEventGifts(dataEvent.id, {
        curPage: page,
        perPage: countPage,
        where: {
          type: EventGiftTypeEnum.Wishlist,
          OR: [
            { name: { contains: inputSearchWs.trim(), mode: "insensitive" } },
            { product_url: { contains: inputSearchWs.trim(), mode: "insensitive" } },
          ]
        },
        select: {
          id: true,
          type: true,
          reserve_qty: true,
          ...selectObj
        },
        orderBy: orderObj
      });
      setTotalPageWs(result.meta.totalPages);
      setTotalCountWs(result.meta.total);
      setPageTableWs(result.meta.page);
      setInputPageWs(result.meta.page.toString());

      setDatasWs(result.data);

      const getSchadule = await GetDataEventWithSelect({
        event_id: dataEvent.id, select: {
          wishlist_address: true
        }
      });
      setShippingAddress(getSchadule ? getSchadule.wishlist_address ?? "" : "");
      setIsHaveShippingAdd(getSchadule ? getSchadule.wishlist_address != null ? true : false : false);
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
    if (tblSortListWs.length === 0) fatchDatasWs();
  }, [tblSortListWs]);
  useEffect(() => {
    if (isFirstRender) return;
    const timer = setTimeout(() => {
      fatchDatasWs(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [inputSearchWs]);
  // End For Transfer Gift

  useEffect(() => {
    const fatchNeedData = async () => {
      setLoading(true);
      await fatchDatasTf();
      await fatchDatasWs();
      setIsFirstRender(false);
      setLoading(false);
    };

    if (activeIdxTab == 4) fatchNeedData();
  }, [activeIdxTab]);

  const deleteRowGift = async (type: EventGiftTypeEnum, id: number) => {
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
      await DeleteDataEventGifts(id);

      if (type === EventGiftTypeEnum.Transfer) await fatchDatasTf();
      else if (type === EventGiftTypeEnum.Wishlist) await fatchDatasWs();
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
    <div>
      <div className="mb-7 mt-3 text-center">
        <div className="flex justify-center items-center gap-1 text-lg font-semibold text-gray-800">
          <i className="bx bx-gift text-xl"></i> Gift Registry
        </div>
        <p className="text-sm text-gray-500">
          Add and manage gift options or bank account details that will be displayed on your wedding invitation.
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-3">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between mb-3">
          <div>
            <div className="flex items-center gap-2 text-base font-semibold text-gray-800">
              <i className="bx bx-credit-card text-xl text-blue-600"></i>
              Transfer Gift
            </div>
            <p className="text-sm text-gray-500 max-w-md">
              Add bank accounts or e-wallets for guests to send their gifts.
            </p>
          </div>

          <button
            onClick={() => openModalAddEdit(EventGiftTypeEnum.Transfer)}
            type="button"
            className="w-full sm:w-auto py-1.5 px-3 inline-flex items-center justify-center gap-1 text-sm font-medium rounded-lg bg-blue-100 text-blue-800 hover:bg-blue-200 focus:outline-none focus:bg-blue-200 disabled:opacity-50 disabled:pointer-events-none"
          >
            <i className="bx bx-plus text-lg"></i>
            Add Account
          </button>
        </div>

        <TableTopToolbar
          inputSearch={inputSearchTf}
          tblSortList={tblSortListTf}
          thColomn={tblThColomnsTf}
          setTblSortList={setTblSortListTf}
          setInputSearch={setInputSearchTf}
          fatchData={() => fatchDatasTf(pageTableTf)}
        />

        <div className="my-3">
          {
            datasTf.length > 0 ? <div className="grid grid-cols-1 gap-5 md:grid-cols-3 lg:grid-cols-4">
              {
                datasTf.map((x, i) => (
                  <div key={x.id} className="flex flex-col bg-white border border-gray-200 shadow-2xs rounded-xl">
                    <div className="flex justify-between items-center bg-gray-100 border-b border-gray-200 rounded-t-xl py-2 px-3">
                      <div className="text-sm text-gray-500">
                        <img className="h-5" src={PaymentMethodKeys.find(m => m.key === x.name)?.icon} />
                      </div>
                      <div className="space-x-1">
                        <button onClick={() => openModalAddEdit(x.type, x.id)} type="button" className="p-2 inline-flex items-center gap-x-2 text-sm font-medium rounded-full border border-gray-200 bg-white text-gray-800 shadow-2xs hover:bg-gray-50 focus:outline-hidden focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none">
                          <i className='bx bxs-edit text-lg text-amber-500'></i>
                        </button>
                        <button onClick={() => deleteRowGift(x.type, x.id)} type="button" className="p-2 inline-flex items-center gap-x-2 text-sm font-medium rounded-full border border-gray-200 bg-white text-gray-800 shadow-2xs hover:bg-gray-50 focus:outline-hidden focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none">
                          <i className='bx bx-trash text-lg text-red-600'></i>
                        </button>
                      </div>
                    </div>

                    <div className="px-3 py-2">
                      <div className="text-sm font-bold text-gray-800">
                        {x.no_rek}
                      </div>
                      <p className="text-sm text-gray-500">
                        {x.account}
                      </p>
                    </div>
                  </div>
                ))
              }
            </div> : <div className="rounded-lg border-2 border-dashed border-gray-200 p-6 text-center">
              <i className="bx bx-folder-open text-3xl text-gray-300 mb-2"></i>
              <p className="text-sm text-gray-500">
                No bank accounts added yet.
              </p>
            </div>
          }
        </div>

        <TablePagination
          perPage={perPageTf}
          pageTable={pageTableTf}
          totalPage={totalPageTf}
          totalCount={totalCountTf}
          setPerPage={setPerPageTf}
          setPageTable={setPageTableTf}
          fatchData={fatchDatasTf}

          inputPage={inputPageTf}
          setInputPage={setInputPageTf}
        />
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-3 mt-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between mb-3">
          <div>
            <div className="flex items-center gap-2 text-base font-semibold text-gray-800">
              <i className="bx bx-gift text-xl text-pink-600"></i>
              Wishlist Gift
            </div>
            <p className="text-sm text-gray-500 max-w-lg">
              Create a wishlist of gifts that guests can choose from. And don't forgot to enter your shipping address
            </p>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-start gap-2">
            <button
              onClick={() => openModalWishlistAddress()}
              type="button"
              className={`w-full sm:w-auto py-1.5 px-3 inline-flex items-center justify-center gap-1 text-sm font-medium rounded-lg ${isHaveShippingAdd ? "bg-green-100 text-green-800 hover:bg-green-200 focus:bg-green-200" : "bg-gray-100 text-gray-800 hover:bg-gray-200 focus:bg-gray-200"} focus:outline-none disabled:opacity-50 disabled:pointer-events-none`}
            >
              Shipping Address
            </button>
            <button
              onClick={() => openModalAddEdit(EventGiftTypeEnum.Wishlist)}
              type="button"
              className="w-full sm:w-auto py-1.5 px-3 inline-flex items-center justify-center gap-1 text-sm font-medium rounded-lg bg-pink-100 text-pink-800 hover:bg-pink-200 focus:outline-none focus:bg-pink-200 disabled:opacity-50 disabled:pointer-events-none"
            >
              <i className="bx bx-plus text-lg"></i>
              Add Wishlist
            </button>
          </div>
        </div>

        <TableTopToolbar
          inputSearch={inputSearchWs}
          tblSortList={tblSortListWs}
          thColomn={tblThColomnsWs}
          setTblSortList={setTblSortListWs}
          setInputSearch={setInputSearchWs}
          fatchData={() => fatchDatasWs(pageTableWs)}
        />

        <div className="my-3">
          {
            datasWs.length > 0 ? <div className="grid grid-cols-1 gap-5 md:grid-cols-3 lg:grid-cols-4">
              {
                datasWs.map((x, i) => (
                  <div key={x.id} className="flex flex-col bg-white border border-gray-200 shadow-2xs rounded-xl">
                    <div className="flex justify-between items-center bg-gray-100 border-b border-gray-200 rounded-t-xl py-2 px-3">
                      <div className="text-sm text-gray-500">
                        {x.qty} Unit{x.qty && x.qty > 1 ? "s" : ""}
                      </div>
                      <div className="space-x-1">
                        <button onClick={() => openModalAddEdit(x.type, x.id)} type="button" className="p-2 inline-flex items-center gap-x-2 text-sm font-medium rounded-full border border-gray-200 bg-white text-gray-800 shadow-2xs hover:bg-gray-50 focus:outline-hidden focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none">
                          <i className='bx bxs-edit text-lg text-amber-500'></i>
                        </button>
                        <button onClick={() => deleteRowGift(x.type, x.id)} type="button" className="p-2 inline-flex items-center gap-x-2 text-sm font-medium rounded-full border border-gray-200 bg-white text-gray-800 shadow-2xs hover:bg-gray-50 focus:outline-hidden focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none">
                          <i className='bx bx-trash text-lg text-red-600'></i>
                        </button>
                      </div>
                    </div>

                    <div className="px-3 py-2">
                      <div className="text-sm font-bold text-gray-800">
                        {x.name}
                      </div>
                      <p className="text-sm text-gray-500 font-semibold">
                        Rp {(x.product_price ?? 0).toLocaleString('id-ID')}
                      </p>
                      <p className="text-sm text-gray-500">
                        Reservation URL: {
                          x.product_url ? <a href={x.product_url} target="_blank" className="underline text-blue-800">View Here</a> : "-"
                        }
                      </p>
                    </div>
                  </div>
                ))
              }
            </div> : <div className="rounded-lg border-2 border-dashed border-gray-200 p-6 text-center">
              <i className="bx bx-folder-open text-3xl text-gray-300 mb-2"></i>
              <p className="text-sm text-gray-500">
                Your wishlist is still empty.
              </p>
            </div>
          }
        </div>

        <TablePagination
          perPage={perPageWs}
          pageTable={pageTableWs}
          totalPage={totalPageWs}
          totalCount={totalCountWs}
          setPerPage={setPerPageWs}
          setPageTable={setPageTableWs}
          fatchData={fatchDatasWs}

          inputPage={inputPageWs}
          setInputPage={setInputPageWs}
        />
      </div>

      <button id={`btn-${modalAddEdit}`} type="button" aria-haspopup="dialog" aria-expanded="false" aria-controls={modalAddEdit} data-hs-overlay={`#${modalAddEdit}`} className="hidden">-</button>
      <UiPortal>
        <div id={modalAddEdit} className="hs-overlay hidden size-full fixed bg-black/30 top-0 inset-s-0 z-80 overflow-x-hidden overflow-y-auto pointer-events-none" role="dialog">
          <div className="sm:max-w-md hs-overlay-open:mt-7 hs-overlay-open:opacity-100 hs-overlay-open:duration-500 mt-0 opacity-0 ease-out transition-all sm:w-full m-3 h-[calc(100%-56px)] sm:mx-auto flex items-center">
            <form onSubmit={handleSubmitForm} className="max-h-full overflow-hidden w-full flex flex-col bg-white border border-gray-200 shadow-2xs rounded-xl pointer-events-auto">
              <div className="flex justify-between items-center py-2 px-4 border-b border-gray-200">
                <div>
                  <div className="flex items-center gap-1 text-sm mb-0.5">
                    <i className='bx bx-gift text-lg'></i> {addEditId ? "Edit" : "Add"} {giftType === EventGiftTypeEnum.Transfer ? "Transfer" : giftType === EventGiftTypeEnum.Wishlist ? "Wishlist" : ""} Gift
                  </div>
                  <p className='text-xs text-muted'>Here form to register or edit Gift data</p>
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
                {
                  giftType === EventGiftTypeEnum.Transfer && <div className="grid grid-cols-12 gap-2">
                    <div className="col-span-12 md:col-span-6">
                      <Select
                        value={tfMethood}
                        onChange={(e) => setTfMethod(e.target.value)}
                        id='receipt_method' label='Method' placeholder='Select gift method' mandatory
                        options={
                          allPaymentMethod.map(x => ({ value: x.key, label: x.name }))
                        }
                      />
                      {stateFormGift.errors?.receipt_method && <ZodErrors err={stateFormGift.errors?.receipt_method} />}
                    </div>
                    <div className="col-span-12 md:col-span-6">
                      <Input value={tfAccountName} onChange={(e) => setTfAccountName(e.target.value)} type='text' id='account_name' label='Account Name' placeholder='Enter account name' mandatory />
                      {stateFormGift.errors?.account_name && <ZodErrors err={stateFormGift.errors?.account_name} />}
                    </div>
                    <div className="col-span-12">
                      <Input value={tfAccountNumber} onChange={(e) => setTfAccountNumber(e.target.value)} type='text' id='account_number' label='Account / Wallet Number' placeholder='Enter account number' mandatory />
                      {stateFormGift.errors?.account_number && <ZodErrors err={stateFormGift.errors?.account_number} />}
                    </div>
                  </div>
                }
                {
                  giftType === EventGiftTypeEnum.Wishlist && <div className="grid grid-cols-12 gap-2">
                    <div className="col-span-12">
                      <Input value={productName} onChange={(e) => setProductName(e.target.value)} type='text' id='product_name' label='Product Name' placeholder='Enter product name' mandatory />
                      {stateFormGift.errors?.product_name && <ZodErrors err={stateFormGift.errors?.product_name} />}
                    </div>
                    <div className="col-span-12 md:col-span-6">
                      <Input value={productPrice} onChange={(e) => setProductPrice(inputFormatPriceIdr(e.target.value) || "")} type='text' className='input-no-spinner' id='product_price' label='Price' placeholder='Enter product price' mandatory />
                      {stateFormGift.errors?.product_price && <ZodErrors err={stateFormGift.errors?.product_price} />}
                    </div>
                    <div className="col-span-12 md:col-span-6">
                      <Input
                        value={reservationQty}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value === "") {
                            setReservationQty("");
                            return;
                          }

                          const num = Number(value);
                          if (num < 1) return;

                          setReservationQty(num);
                        }}
                        onBlur={() => {
                          if (reservationQty === "") {
                            setReservationQty(1);
                          }
                        }}
                        sufixGroup={<span>{typeof reservationQty === "number" ? `Unit${reservationQty > 1 ? "s" : ""}` : "Unit"}</span>}
                        type='number' min={1} id='reservation_qty' label='Reservation QTY' mandatory />
                      {stateFormGift.errors?.reservation_qty && <ZodErrors err={stateFormGift.errors?.reservation_qty} />}
                    </div>
                    <div className="col-span-12">
                      <Input value={reservationUrl} onChange={(e) => setReservationUrl(e.target.value)} type='text' id='reservation_url' label='Reservation URL' placeholder='Enter reservation reference URL' mandatory />
                    </div>
                  </div>
                }
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

      <button id={`btn-${modalWishlistAddress}`} type="button" aria-haspopup="dialog" aria-expanded="false" aria-controls={modalWishlistAddress} data-hs-overlay={`#${modalWishlistAddress}`} className="hidden">-</button>
      <UiPortal>
        <div id={modalWishlistAddress} className="hs-overlay hidden size-full fixed bg-black/30 top-0 inset-s-0 z-80 overflow-x-hidden overflow-y-auto pointer-events-none" role="dialog">
          <div className="sm:max-w-sm hs-overlay-open:mt-7 hs-overlay-open:opacity-100 hs-overlay-open:duration-500 mt-0 opacity-0 ease-out transition-all sm:w-full m-3 h-[calc(100%-56px)] sm:mx-auto flex items-center">
            <form onSubmit={handleSubmitFormWishlistAddress} className="max-h-full overflow-hidden w-full flex flex-col bg-white border border-gray-200 shadow-2xs rounded-xl pointer-events-auto">
              <div className="flex justify-between items-center py-2 px-4 border-b border-gray-200">
                <div>
                  <div className="flex items-center gap-1 text-sm mb-0.5">
                    Shipping Address Form
                  </div>
                  <p className='text-xs text-muted'>Form entry shipping address for wishlist gift</p>
                </div>
                <button type="button" className="size-8 inline-flex justify-center items-center gap-x-2 rounded-full border border-transparent bg-gray-100 text-gray-800 hover:bg-gray-200 focus:outline-hidden focus:bg-gray-200 disabled:opacity-50 disabled:pointer-events-none" aria-label="Close" data-hs-overlay={`#${modalWishlistAddress}`}>
                  <span className="sr-only">Close</span>
                  <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 6 6 18"></path>
                    <path d="m6 6 12 12"></path>
                  </svg>
                </button>
              </div>
              <div className="py-3 px-4 overflow-y-auto">
                <Textarea value={shippingAddress} onChange={(e) => setShippingAddress(e.target.value)} id="shipping_address" placeholder="Enter the shipping address" rows={3} />
                {stateFormShippingAddress.errors?.shipping_address && <ZodErrors err={stateFormShippingAddress.errors?.shipping_address} />}
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 py-2.5 px-4 border-t border-gray-200">
                <div className="flex justify-start sm:justify-end gap-x-2 sm:order-2 order-2">
                  <button id={btnCloseModalWishlistAddress} type="button" className="py-1.5 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-2xs hover:bg-gray-50 focus:outline-hidden focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none" data-hs-overlay={`#${modalWishlistAddress}`}>
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
    </div>
  )
};

function RSVPTabContent({ event_id, url }: { event_id: number, url: string }) {
  const { setLoading } = useLoading();
  const { activeIdxTab } = useTabEventDetail();
  const modalAddEdit = "modal-add-edit-rsvp-wedding";
  const btnCloseModal = "btn-close-modal-rsvp-wedding";

  const [inputPage, setInputPage] = useState("1");
  const [pageTable, setPageTable] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [totalPage, setTotalPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [inputSearch, setInputSearch] = useState("");
  const [datas, setDatas] = useState<EventRsvp[]>([]);
  const [tblSortList, setTblSortList] = useState<TableShortList[]>([]);
  const [tblThColomns, setTblThColomns] = useState<TableThModel[]>([
    { name: "Barcode", key: "barcode", key_sort: "barcode", IsVisible: true },
    { name: "Name", key: "name", key_sort: "name", IsVisible: true },
    { name: "No Phone", key: "phone", key_sort: "phone", IsVisible: true },
    { name: "Attandance", key: "rsvp", key_sort: "rsvp", IsVisible: true },
  ]);

  const [stateFormRsvp, setStateFormRsvp] = useState<FormState>({ success: false, errors: {} });
  const [addEditId, setAddEditId] = useState<number | null>(null);
  const [rsvpName, setRsvpName] = useState("");
  const [rsvpPhone, setRsvpPhone] = useState("");

  const openModalAddEdit = async (id?: number) => {
    if (id) {
      setLoading(true);
      const data = await GetDataEventRsvpById(id);
      if (data) {
        setAddEditId(data.id);
        setRsvpName(data.name);
        setRsvpPhone(data.phone ?? "");
      }
      setLoading(false);
    } else {
      setAddEditId(null);
      setRsvpName("");
      setRsvpPhone("");
    }

    setStateFormRsvp({ success: true, errors: {} });
    modalAction(`btn-${modalAddEdit}`);
  };

  const createDtoData = (): DtoEventRsvp => {
    const data = {
      id: addEditId,
      name: rsvpName,
      phone: rsvpPhone,
    };

    return data;
  };

  const FormSchemaRsvp = z.object({
    rsvp_name: z.string().min(1, { message: 'Name is required field.' }).trim(),
  });

  const handleSubmitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const data = Object.fromEntries(formData);
    const valResult = FormSchemaRsvp.safeParse(data);
    if (!valResult.success) {
      setStateFormRsvp({
        success: false,
        errors: valResult.error.flatten().fieldErrors,
      });
      return;
    };
    setStateFormRsvp({ success: true, errors: {} });

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
      await StoreUpdateEventRSVP(event_id, createDtoData());
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

  const fatchDatas = async (page: number = pageTable, countPage: number = perPage) => {
    const selectObj = normalizeSelectObj(tblThColomns);
    const orderObj = sortListToOrderBy(tblSortList);

    try {
      const result = await GetDataEventRsvp(event_id, {
        curPage: page,
        perPage: countPage,
        where: {
          OR: [
            { name: { contains: inputSearch.trim(), mode: "insensitive" } },
          ]
        },
        select: {
          id: true,
          event_id: true,
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
      await DeleteDataEventRsvp(id);
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

  useEffect(() => {
    if (isFirstRender) return;
    if (tblSortList.length === 0) fatchDatas();
  }, [tblSortList]);
  useEffect(() => {
    if (isFirstRender) return;
    const timer = setTimeout(() => {
      fatchDatas(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [inputSearch]);

  const [isFirstRender, setIsFirstRender] = useState(true);
  useEffect(() => {
    const fatchNeedData = async () => {
      setLoading(true);
      await fatchDatas();
      setIsFirstRender(false);
      setLoading(false);
    };

    if (activeIdxTab == 5) fatchNeedData();
  }, [activeIdxTab]);

  return (
    <div>
      <div className="mb-6 mt-3 text-center">
        <div className="flex justify-center items-center gap-1 text-lg font-semibold text-gray-800">
          <i className="bx bx-envelope text-xl"></i> RSVP Management
        </div>
        <p className="text-sm text-gray-500">
          Create invitations and manage guest attendance confirmation for your wedding invitations.
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-3">
        <div className="flex-1 min-w-0 flex flex-col">
          <TableTopToolbar
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
                        <th scope="col" className="px-3 py-2.5 text-start text-xs font-medium text-gray-500 uppercase">URL</th>
                        <th scope="col" className="px-3 py-2.5 text-end text-xs font-medium text-gray-500 uppercase">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {
                        datas.map((data, i) => (
                          <tr key={data.id} className="hover:bg-gray-50 dark:hover:bg-neutral-700">
                            <td className="px-3 py-2.5 whitespace-nowrap text-sm font-medium text-gray-800">{(pageTable - 1) * perPage + i + 1}</td>

                            {'barcode' in data && <td className="px-3 py-2.5 whitespace-nowrap text-sm text-gray-800">{data.barcode}</td>}
                            {'name' in data && <td className="px-3 py-2.5 whitespace-nowrap text-sm text-gray-800">{data.name}</td>}
                            {'phone' in data && <td className="px-3 py-2.5 whitespace-nowrap text-sm text-gray-800">{data.phone || "-"}</td>}
                            {
                              'rsvp' in data && <td className={`px-3 py-2.5 whitespace-nowrap text-sm ${data.rsvp != null && (data.rsvp === true ? "text-green-600" : "text-red-600")} ${data.rsvp == null && "italic text-gray-800"}`}>
                                {data.rsvp != null ? data.rsvp === true ? "Present" : "Absent" : "Not Respon"}
                              </td>
                            }
                            <td className="px-3 py-2.5 whitespace-nowrap text-sm text-gray-800">
                              <span onClick={() => {
                                const craateUrl = `${Configs.base_url}/${url}?name=${data.name}&code=${data.barcode}`;
                                copyToClipboard(craateUrl);
                                toast({
                                  type: "success",
                                  title: "Copy to Clipboard",
                                  message: "Well done, Text copied to clipboard.",
                                });
                              }} className="underline text-blue-600 cursor-pointer">Copy URL <i className='bx bx-copy-alt text-base'></i></span>
                            </td>

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
        </div>
      </div>

      <button id={`btn-${modalAddEdit}`} type="button" className="hidden" aria-haspopup="dialog" aria-expanded="false" aria-controls={modalAddEdit} data-hs-overlay={`#${modalAddEdit}`}>
        -
      </button>
      <UiPortal>
        <div id={modalAddEdit} className="hs-overlay hidden size-full fixed bg-black/30 top-0 inset-s-0 z-80 overflow-x-hidden overflow-y-auto pointer-events-none" role="dialog">
          <div className="sm:max-w-sm hs-overlay-open:mt-7 hs-overlay-open:opacity-100 hs-overlay-open:duration-500 mt-0 opacity-0 ease-out transition-all sm:w-full m-3 h-[calc(100%-56px)] sm:mx-auto flex items-center">
            <form onSubmit={handleSubmitForm} className="max-h-full overflow-hidden w-full flex flex-col bg-white border border-gray-200 shadow-2xs rounded-xl pointer-events-auto">
              <div className="flex justify-between items-center py-2 px-4 border-b border-gray-200">
                <div>
                  <div className="flex items-center gap-1 text-sm mb-0.5">
                    <i className='bx bx-envelope text-lg'></i> {addEditId ? "Edit" : "Add"} RSVP
                  </div>
                  <p className='text-xs text-muted'>Here form to register or edit RSVP data</p>
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
                <div className="grid grid-cols-12 gap-2">
                  <div className="col-span-12">
                    <Input value={rsvpName} onChange={(e) => setRsvpName(e.target.value)} type='text' id='rsvp_name' label='Name' placeholder='Enter rsvp name' mandatory />
                    {stateFormRsvp.errors?.rsvp_name && <ZodErrors err={stateFormRsvp.errors?.rsvp_name} />}
                  </div>
                  <div className="col-span-12">
                    <Input value={rsvpPhone} onChange={(e) => setRsvpPhone(e.target.value)} type='text' id='rsvp_phone' label='No Phone' placeholder='Enter rsvp phone number' />
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
    </div>
  )
};

function FAQTabContent(event_id: number) {
  const { setLoading } = useLoading();
  const { activeIdxTab } = useTabEventDetail();
  const modalAddEdit = "modal-add-edit-faq-wedding";
  const btnCloseModal = "btn-close-modal-faq-wedding";

  const [stateFormFaq, setStateFormFaq] = useState<FormState>({ success: false, errors: {} });
  const [addEditId, setAddEditId] = useState<number | null>(null);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const [faqActiveIdx, setFaqActiveIdx] = useState<number | null>(null);

  const [inputPage, setInputPage] = useState("1");
  const [pageTable, setPageTable] = useState(1);
  const [perPage, setPerPage] = useState(9);
  const [totalPage, setTotalPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [datas, setDatas] = useState<EventFAQ[]>([]);
  const [inputSearch, setInputSearch] = useState("");
  const [tblSortList, setTblSortList] = useState<TableShortList[]>([]);
  const [tblThColomns, setTblThColomns] = useState<TableThModel[]>([
    { name: "Question", key: "question", key_sort: "question", IsVisible: true },
    { name: "Answer", key: "answer", key_sort: "answer", IsVisible: true },
  ]);

  const openModalAddEdit = async (id?: number) => {
    if (id) {
      setLoading(true);
      const data = await GetDataEventFAQById(id);
      if (data) {
        setAddEditId(data.id);
        setQuestion(data.question);
        setAnswer(data.answer);
      }
      setLoading(false);
    } else {
      setAddEditId(null);
      setQuestion("");
      setAnswer("");
    }

    setStateFormFaq({ success: true, errors: {} });
    modalAction(`btn-${modalAddEdit}`);
  };

  const createDtoData = (): DtoEventFAQ => {
    const data = {
      id: addEditId,
      question: question,
      answer: answer,
    };

    return data;
  };

  const FormSchemaFaq = z.object({
    faq_question: z.string().min(1, { message: 'Question is required field.' }).trim(),
    faq_answer: z.string().min(1, { message: 'Answer is required field.' }).trim(),
  });

  const handleSubmitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const data = Object.fromEntries(formData);
    const valResult = FormSchemaFaq.safeParse(data);
    if (!valResult.success) {
      setStateFormFaq({
        success: false,
        errors: valResult.error.flatten().fieldErrors,
      });
      return;
    };
    setStateFormFaq({ success: true, errors: {} });

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
      await StoreUpdateEventFAQ(event_id, createDtoData());
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

  const fatchDatas = async (page: number = pageTable, countPage: number = perPage) => {
    const selectObj = normalizeSelectObj(tblThColomns);
    const orderObj = sortListToOrderBy(tblSortList);

    try {
      const result = await GetDataEventFAQ(event_id, {
        curPage: page,
        perPage: countPage,
        where: {
          OR: [
            { question: { contains: inputSearch.trim(), mode: "insensitive" } },
            { answer: { contains: inputSearch.trim(), mode: "insensitive" } },
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
      await DeleteDataEventFAQ(id);
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

  useEffect(() => {
    if (isFirstRender) return;
    if (tblSortList.length === 0) fatchDatas();
  }, [tblSortList]);
  useEffect(() => {
    if (isFirstRender) return;
    const timer = setTimeout(() => {
      setFaqActiveIdx(null);
      fatchDatas(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [inputSearch]);

  const [isFirstRender, setIsFirstRender] = useState(true);
  useEffect(() => {
    const fatchNeedData = async () => {
      setLoading(true);
      await fatchDatas();
      setIsFirstRender(false);
      setLoading(false);
    };

    if (activeIdxTab == 6) fatchNeedData();
  }, [activeIdxTab]);

  return (
    <div>
      <div className="mb-6 mt-3 text-center">
        <div className="flex justify-center items-center gap-1 text-lg font-semibold text-gray-800">
          <i className="bx bx-help-circle text-xl"></i> Frequently Asked Questions
        </div>
        <p className="text-sm text-gray-500">
          Create and manage FAQ for your wedding, so your guests can find important information easily.
        </p>

        <button onClick={() => openModalAddEdit()} type="button" className="mt-2 py-1.5 px-3 inline-flex items-center text-sm font-medium rounded-lg border border-transparent bg-blue-100 text-blue-800 hover:bg-blue-200 focus:outline-hidden focus:bg-blue-200 disabled:opacity-50 disabled:pointer-events-none">
          <i className='bx bx-plus text-lg'></i> Add FAQ
        </button>
        <button id={`btn-${modalAddEdit}`} type="button" aria-haspopup="dialog" aria-expanded="false" aria-controls={modalAddEdit} data-hs-overlay={`#${modalAddEdit}`} className="hidden">-</button>
      </div>

      <TableTopToolbar
        inputSearch={inputSearch}
        tblSortList={tblSortList}
        thColomn={tblThColomns}
        setTblSortList={setTblSortList}
        setInputSearch={setInputSearch}
        fatchData={() => fatchDatas(pageTable)}
      />

      <div className="my-3">
        {
          datas.length > 0 ? datas.map((x, i) => (
            <div key={x.id} className="bg-white border border-gray-200 -mt-px first:rounded-t-lg last:rounded-b-lg">
              <div className="flex items-center justify-between w-full py-4 px-5">
                <button onClick={() => setFaqActiveIdx((prev) => (prev === i ? null : i))}
                  className="flex items-center justify-between w-full text-left font-semibold text-gray-800 hover:text-gray-500"
                >
                  <div className="text-sm">Question: {x.question}?</div>
                  <div className="ml-3">
                    <svg className={`size-5 ${faqActiveIdx === i ? "hidden" : "block"}`}
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="m6 9 6 6 6-6"></path>
                    </svg>
                    <svg className={`size-5 ${faqActiveIdx === i ? "block" : "hidden"}`}
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="m18 15-6-6-6 6"></path>
                    </svg>
                  </div>
                </button>
                <div className="flex gap-2 ml-4">
                  <i onClick={() => openModalAddEdit(x.id)} className='bx bxs-edit text-lg text-amber-500 cursor-pointer'></i>
                  <i onClick={() => deleteRow(x.id)} className='bx bx-trash text-lg text-red-600 cursor-pointer'></i>
                </div>
              </div>

              <div className={`w-full overflow-hidden transition-[height] duration-300 ${faqActiveIdx === i ? "block" : "hidden"}`}>
                <div className="pb-4 px-5">
                  <p className="text-gray-800 text-sm">
                    Answer: {x.answer}
                  </p>
                </div>
              </div>
            </div>
          )) : <div className="flex flex-col bg-white border border-gray-200 shadow-2xs rounded-xl p-3">
            <div className="min-h-52 flex items-center justify-center px-4">
              <div className="max-w-md w-full text-center">
                <div className="mx-auto mb-4 flex items-center justify-center h-14 w-14 rounded-full bg-gray-100">
                  <i className="bx bx-folder-open text-2xl text-gray-400"></i>
                </div>
                <div className="text-sm font-medium text-gray-700">
                  Your FAQ list is empty!
                </div>
                <p className="text-sm/6 text-gray-500">
                  Add questions and answers here so your guests can easily find important information.
                </p>
              </div>
            </div>
          </div>
        }
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

      <UiPortal>
        <div id={modalAddEdit} className="hs-overlay hidden size-full fixed bg-black/30 top-0 inset-s-0 z-80 overflow-x-hidden overflow-y-auto pointer-events-none" role="dialog">
          <div className="sm:max-w-md hs-overlay-open:mt-7 hs-overlay-open:opacity-100 hs-overlay-open:duration-500 mt-0 opacity-0 ease-out transition-all sm:w-full m-3 h-[calc(100%-56px)] sm:mx-auto flex items-center">
            <form onSubmit={handleSubmitForm} className="max-h-full overflow-hidden w-full flex flex-col bg-white border border-gray-200 shadow-2xs rounded-xl pointer-events-auto">
              <div className="flex justify-between items-center py-2 px-4 border-b border-gray-200">
                <div>
                  <div className="flex items-center gap-1 text-sm mb-0.5">
                    <i className='bx bx-help-circle text-lg'></i> {addEditId ? "Edit" : "Add"} FAQ
                  </div>
                  <p className='text-xs text-muted'>Here form to register or edit FAQ data</p>
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
                <div className="grid grid-cols-12 gap-2">
                  <div className="col-span-12">
                    <Input value={question} onChange={(e) => setQuestion(e.target.value)} type='text' id='faq_question' label='Question' placeholder='Enter question of FQA' mandatory />
                    {stateFormFaq.errors?.faq_question && <ZodErrors err={stateFormFaq.errors?.faq_question} />}
                  </div>
                  <div className="col-span-12">
                    <Textarea value={answer} onChange={(e) => setAnswer(e.target.value)} label="Answer" id="faq_answer" placeholder="Enter answer of FQA" rows={3} mandatory />
                    {stateFormFaq.errors?.faq_answer && <ZodErrors err={stateFormFaq.errors?.faq_answer} />}
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
    </div>
  )
};