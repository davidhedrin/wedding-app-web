import DatePicker from "@/components/ui/date-picker";
import Input from "@/components/ui/input";
import Textarea from "@/components/ui/textarea";
import Configs, { MusicThemeKeys } from "@/lib/config";
import { playMusic, showConfirm, stopMusic, toast, toOrdinal } from "@/lib/utils";
import { useRef, useState } from "react";
import ContentComponent from "../comp-content";
import { useTabEventDetail } from "@/lib/zustand";
import dynamic from "next/dynamic";
import Image from "next/image";
import TableTopToolbar from "@/components/table-top-toolbar";
import { FormState, TableShortList, TableThModel } from "@/lib/model-types";
import TablePagination from "@/components/table-pagination";
import Select from "@/components/ui/select";
import { GroomBrideEnum, TradRecepType } from "@/generated/prisma";
import z from "zod";
import { useLoading } from "@/components/loading/loading-context";
import { DtoMainInfoWedding } from "@/lib/dto";

const MapPicker = dynamic(
  () => import("@/components/map-picker"),
  { ssr: false }
);

export default function TabContentWedding() {
  const tabContents = [
    { id: "main-info", content: MainTabContent() },
    { id: "scheduler", content: SchedulerTabContent() },
    { id: "gallery", content: GalleryTabContent() },
    { id: "history", content: HistoryTabContent() },
    { id: "gift", content: GiftTabContent() },
    { id: "rsvp", content: RSVPTabContent() },
    { id: "faq", content: FAQTabContent() },
  ];

  return <ContentComponent tabContents={tabContents} />;
}

function MainTabContent() {
  const { setLoading } = useLoading();

  const musicThemeWedding = MusicThemeKeys.find(x => x.key === "wed");
  const [stateFormMainInfo, setStateFormMainInfo] = useState<FormState>({ success: false, errors: {} });

  const [greetingMessage, setGreetingMessage] = useState<string>("");
  const [contactEmail, setContactEmail] = useState<string>("");
  const [contactPhone, setContactPhone] = useState<string>("");
  const [musicTheme, setMusicTheme] = useState<string>("");
  const [imageFileCouple, setImageFileCouple] = useState<File | null>(null);
  const [previewUrlCouple, setPreviewUrlCouple] = useState<string | null>(null);

  // Groom Info
  const [groomId, setGroomId] = useState<number | null>(null);
  const [groomFullname, setGroomFullname] = useState<string>("");
  const [groomShortname, setGroomShortname] = useState<string>("");
  const [groomBirthDate, setGroomBirthDate] = useState<Date>(new Date());
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
  const [brideShortname, setBrideShortname] = useState<string>("");
  const [brideBirthDate, setBrideBirthDate] = useState<Date>(new Date());
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


  const createDtoData = (): DtoMainInfoWedding => {
    const newData: DtoMainInfoWedding = {
      greeting_msg: greetingMessage.trim() != "" ? greetingMessage : null,
      contact_email: contactEmail.trim() != "" ? contactEmail : null,
      contact_phone: contactPhone.trim() != "" ? contactPhone : null,
      music_url: musicTheme.trim() != "" ? musicTheme : null,
      groom_bride: [
        {
          id: groomId,
          type: GroomBrideEnum.Groom,
          fullname: groomFullname,
          shortname: groomShortname,
          birth_place: groomBirthPlace,
          birth_date: groomBirthDate,
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
          shortname: brideShortname,
          birth_place: brideBirthPlace,
          birth_date: brideBirthDate,
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
    is_active: z.string().min(1, { message: 'Status is required field.' }).trim(),
  });

  const handleSubmitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

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
      // await StoreUpdateDataVouchers(createDtoData());
      // await fatchDatas();
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
            <Textarea label="Greeting Message" id="greeting_message" placeholder="Enter greeting message" rows={3} />
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
                      type="file"
                      accept="image/jpeg,image/jpg,image/png"
                      className="hidden"
                    />
                  </label>

                  <div className="bg-black/60 text-white text-xs px-2 py-1 rounded-md">
                    <p>Allowed formats: JPG, JPEG, PNG up to 2MB</p>
                  </div>
                </div>
              </div>

              <div className="p-3">
                <div className="grid grid-cols-12 gap-2">
                  <div className="col-span-12 md:col-span-6">
                    <Input type='text' className='py-1.5' id='groom_birth_place' label='Birth Place' placeholder='Enter birth place' mandatory />
                  </div>
                  <div className="col-span-12 md:col-span-6">
                    <Input type='date' className='py-1.5' id='groom_birth_date' label='Birth Date' mandatory />
                  </div>
                  <div className="col-span-12 ">
                    <Input type='text' className='py-1.5' id='groom_full_name' label='Full Name' placeholder='Enter full name' mandatory />
                  </div>
                  <div className="col-span-12 md:col-span-6">
                    <Input type='text' className='py-1.5' id='groom_short_name' label='Short Name' placeholder='Enter short name' mandatory />
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
                      type='number' min={1} className='py-1.5' id='groom_birth_order' label='Birth Order' placeholder='Order' mandatory />
                  </div>
                  <div className="col-span-12 md:col-span-6">
                    <Input type='text' className='py-1.5' id='groom_father_name' label='Father Name' placeholder='Enter father name' />
                  </div>
                  <div className="col-span-12 md:col-span-6">
                    <Input type='text' className='py-1.5' id='groom_mother_name' label='Mother Name' placeholder='Enter mother name' />
                  </div>
                  <div className="col-span-12 md:col-span-6">
                    <Input type='text' className='py-1.5' id='groom_place_origin' label='Place of Origin' placeholder='Enter place of origin' />
                  </div>
                  <div className="col-span-12 md:col-span-6">
                    <Input type='text' className='py-1.5' id='groom_occupation' label='Occupation' placeholder='Enter occupation or Background' />
                  </div>
                  <div className="col-span-12">
                    <Textarea label="Personality Tagline" id="groom_tagline" placeholder="Enter personality tagline if any" rows={2} />
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
                      type="file"
                      accept="image/jpeg,image/jpg,image/png"
                      className="hidden"
                    />
                  </label>

                  <div className="bg-black/60 text-white text-xs px-2 py-1 rounded-md">
                    <p>Allowed formats: JPG, JPEG, PNG up to 2MB</p>
                  </div>
                </div>
              </div>

              <div className="p-3">
                <div className="grid grid-cols-12 gap-2">
                  <div className="col-span-12 md:col-span-6">
                    <Input type='text' className='py-1.5' id='bride_birth_place' label='Birth Place' placeholder='Enter birth place' mandatory />
                  </div>
                  <div className="col-span-12 md:col-span-6">
                    <Input type='date' className='py-1.5' id='bride_birth_date' label='Birth Date' mandatory />
                  </div>
                  <div className="col-span-12 ">
                    <Input type='text' className='py-1.5' id='bride_full_name' label='Full Name' placeholder='Enter full name' mandatory />
                  </div>
                  <div className="col-span-12 md:col-span-6">
                    <Input type='text' className='py-1.5' id='bride_short_name' label='Short Name' placeholder='Enter short name' mandatory />
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
                      type='number' min={1} className='py-1.5' id='bride_birth_order' label='Birth Order' placeholder='Order' mandatory />
                  </div>
                  <div className="col-span-12 md:col-span-6">
                    <Input type='text' className='py-1.5' id='bride_father_name' label='Father Name' placeholder='Enter father name' />
                  </div>
                  <div className="col-span-12 md:col-span-6">
                    <Input type='text' className='py-1.5' id='bride_mother_name' label='Mother Name' placeholder='Enter mother name' />
                  </div>
                  <div className="col-span-12 md:col-span-6">
                    <Input type='text' className='py-1.5' id='bride_place_origin' label='Place of Origin' placeholder='Enter place of origin' />
                  </div>
                  <div className="col-span-12 md:col-span-6">
                    <Input type='text' className='py-1.5' id='bride_occupation' label='Occupation' placeholder='Enter occupation or Background' />
                  </div>
                  <div className="col-span-12">
                    <Textarea label="Personality Tagline" id="bride_tagline" placeholder="Enter personality tagline if any" rows={2} />
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
          </div>
          <div className="col-span-12 md:col-span-4">
            <Input type='text' className='py-1.5' id='contact_email' label='Contact Email' placeholder="Enter contact email address" />
          </div>
          <div className="col-span-12 md:col-span-4">
            <Input type='text' className='py-1.5' id='contact_phone' label='Contact Phone/WhatsApp' placeholder="Enter contact phone/whatsapp number" />
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

type SchedulerDto = {
  name: string;
  date: Date | undefined;
  start_time: string;
  end_time: string;
  loc_name: string;
  loc_address: string;
  is_mb_loc: boolean;
  notes: string[];
  langLat: number[];
};
function SchedulerTabContent() {
  const { activeIdxTab } = useTabEventDetail();

  // Marriage Blessing Props
  const [eventDateMb, setDateRangeMb] = useState<Date | undefined>();
  const [noteListMb, setNoteListMb] = useState<string[]>([""]);

  // Traditional Reception Props
  const [eventDateTr, setDateRangeTr] = useState<Date | undefined>();
  const [noteListTr, setNoteListTr] = useState<string[]>([""]);
  const [radioSelectTypeTr, setRadioSelectTypeTr] = useState<TradRecepType>(TradRecepType.Traditional);

  const [latLangMb, setLatLangMb] = useState<number[]>([]);
  const [latLangTr, setLatLangTr] = useState<number[]>([]);

  const [schedulerDtoData, setSchedulerDtoData] = useState<SchedulerDto[]>([]);
  const addMoreCeremony = () => {
    setSchedulerDtoData(prev => [
      ...prev,
      {
        name: "",
        date: undefined,
        start_time: "",
        end_time: "",
        loc_name: "",
        loc_address: "",
        is_mb_loc: false,
        notes: [""],
        langLat: [],
      }
    ]);
  };

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

      <div className="flex flex-col bg-white border border-gray-200 shadow-2xs rounded-xl mb-5">
        <div className="bg-gray-100 border-b border-gray-200 rounded-t-xl py-3 px-4">
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
            </div>
            <div className="col-span-12 md:col-span-4">
              <Input type='time' className='py-1.5' id='mb_start_time' label='Start Time' mandatory />
            </div>
            <div className="col-span-12 md:col-span-4">
              <Input type='time' className='py-1.5' id='mb_end_time' label='End Time' />
            </div>
            <div className="col-span-12">
              <Input label="Location Name" className='py-1.5' id="mb_loc_name" placeholder="Enter Location Name" mandatory />
            </div>
            <div className="col-span-12">
              <Textarea label="Location Address" id="mb_loc_address" placeholder="Enter Location Address" rows={3} />
            </div>
            <div className="col-span-12">
              <label className="block text-sm font-medium mb-2 dark:text-white">
                Choose Location<span className="text-red-500">*</span>
                <p className="text-sm text-muted">
                  Click to choose your event location on maps to show direction in your invitaion.
                </p>
              </label>
              {activeIdxTab === 1 && <MapPicker onChange={(lat, lng) => setLatLangMb([lat, lng])} />}
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
        <div className="bg-gray-100 border-b border-gray-200 rounded-t-xl py-3 px-4">
          <div className="text-muted font-semibold">
            <i className='bx bx-party text-xl'></i> Traditional or Reception Ceremony
          </div>
        </div>
        <div className="p-3">
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
            </div>
            <div className="col-span-12 md:col-span-4">
              <Input type='time' className='py-1.5' id='tr_start_time' label='Start Time' mandatory />
            </div>
            <div className="col-span-12 md:col-span-4">
              <Input type='time' className='py-1.5' id='tr_end_time' label='End Time' />
            </div>
            <div className="col-span-12">
              <div className="flex items-center gap-x-3 mb-3 mt-2">
                <label htmlFor="hs-xs-switch-loc-tr" className="relative inline-block w-9 h-5 cursor-pointer">
                  <input type="checkbox" id="hs-xs-switch-loc-tr" className="peer sr-only" />
                  <span className="absolute inset-0 bg-gray-200 rounded-full transition-colors duration-200 ease-in-out peer-checked:bg-blue-600 peer-disabled:opacity-50 peer-disabled:pointer-events-none"></span>
                  <span className="absolute top-1/2 start-0.5 -translate-y-1/2 size-4 bg-white rounded-full shadow-xs transition-transform duration-200 ease-in-out peer-checked:translate-x-full"></span>
                </label>
                <label htmlFor="hs-xs-switch-loc-tr" className="text-sm text-gray-500">Use Marriage Blessing Location</label>
              </div>

              <Input label="Location Name" className='py-1.5' id="tr_loc_name" placeholder="Enter Location Name" mandatory />
            </div>
            <div className="col-span-12">
              <Textarea label="Location Address" id="tr_loc_address" placeholder="Enter Location Address" rows={3} />
            </div>
            <div className="col-span-12">
              <label className="block text-sm font-medium mb-2 dark:text-white">
                Choose Location<span className="text-red-500">*</span>
                <p className="text-sm text-muted">
                  Click to choose your event location on maps to show direction in your invitaion.
                </p>
              </label>
              {activeIdxTab === 1 && <MapPicker onChange={(lat, lng) => setLatLangTr([lat, lng])} />}
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
        </div>
      </div>

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
                  <Input label="Ceremony Name" className='py-1.5' id={`cst_event_name_${i}`} placeholder="Enter Ceremony Name" mandatory />
                </div>
                <div className="col-span-12 md:col-span-6">
                  <label className="block text-sm font-medium mb-1 dark:text-white">
                    Event Date<span className="text-red-500">*</span>
                  </label>
                  <DatePicker placeholder="Choose event date" mode='single' value={eventDateMb} onChange={(date) => setDateRangeMb(date as Date)} />
                </div>
                <div className="col-span-12 md:col-span-6">
                  <Input type='time' className='py-1.5' id={`cst_start_time_${i}`} label='Start Time' mandatory />
                </div>
                <div className="col-span-12 md:col-span-6">
                  <Input type='time' className='py-1.5' id={`cst_end_time_${i}`} label='End Time' />
                </div>

                <div className="col-span-12">
                  <div className="flex items-center gap-x-3 mb-3 mt-1">
                    <label htmlFor={`hs-xs-switch-loc-cst-${i}`} className="relative inline-block w-9 h-5 cursor-pointer">
                      <input type="checkbox" id={`hs-xs-switch-loc-cst-${i}`} className="peer sr-only" />
                      <span className="absolute inset-0 bg-gray-200 rounded-full transition-colors duration-200 ease-in-out peer-checked:bg-blue-600 peer-disabled:opacity-50 peer-disabled:pointer-events-none"></span>
                      <span className="absolute top-1/2 start-0.5 -translate-y-1/2 size-4 bg-white rounded-full shadow-xs transition-transform duration-200 ease-in-out peer-checked:translate-x-full"></span>
                    </label>
                    <label htmlFor={`hs-xs-switch-loc-cst-${i}`} className="text-sm text-gray-500">Use Marriage Blessing Location</label>
                  </div>

                  <Input label="Location Name" className='py-1.5' id={`cst_loc_name_${i}`} placeholder="Enter Location Name" mandatory />
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

      <Textarea label="Notes" id="shedule_notes" placeholder="Enter Event Schedule If Any" rows={3} />

      <div className="text-xs text-gray-500 sm:order-1 order-1 italic mt-3 mb-2">
        <p>Fields marked with <span className="text-red-500">*</span> are required.</p>
      </div>
      <button type="button" className="py-1.5 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-hidden focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none">
        Submit
      </button>
    </div>
  )
};

type UploadedImage = {
  id: string;
  url: string;
  file?: File;
};
function GalleryTabContent() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [images, setImages] = useState<UploadedImage[]>([]);

  const handleFileCaptureChange = (e: { target: { files: FileList | null } }) => {
    const allowedTypes = ["image/jpg", "image/jpeg", "image/png"];
    const maxSizeInMB = Configs.maxSizePictureInMB;
    const maxSizeInBytes = maxSizeInMB * 1024 * 1024;

    const files = e.target.files;
    if (!files) return;

    const newImages: UploadedImage[] = [];
    let invalidType = false;
    let invalidSize = false;

    Array.from(files).map((file) => {
      if (!allowedTypes.includes(file.type)) {
        invalidType = true;
        return;
      };

      if (file.size > maxSizeInBytes) {
        invalidSize = true;
        return;
      };

      newImages.push({
        id: crypto.randomUUID(),
        url: URL.createObjectURL(file),
        file,
      });
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

    setImages((prev) => [...prev, ...newImages]);
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

      <div className="flex flex-col bg-white border border-gray-200 shadow-2xs rounded-xl p-3 mt-4">
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
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {images.map((img) => (
              <div
                key={img.id}
                className="relative aspect-square overflow-hidden rounded-xl border border-gray-200"
              >
                <Image
                  src={img.url}
                  alt="Uploaded"
                  fill
                  className="object-cover"
                />

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setImages((prev) => prev.filter((i) => i.id !== img.id));
                  }}
                  className="leading-0 absolute top-2 right-2 z-10 rounded-full bg-white/90 backdrop-blur p-1 text-gray-700 shadow hover:bg-red-50 hover:text-red-500 transition"
                  aria-label="Hapus foto"
                >
                  <i className="bx bx-x text-xl"></i>
                </button>
              </div>
            ))}

          </div>
        )}
      </div>
    </div>
  )
};

function HistoryTabContent() {
  return (
    <div>
      <div className="mb-7 mt-3 text-center">
        <div className="flex justify-center items-center gap-1 text-lg font-semibold text-gray-800">
          <i className="bx bx-book-heart text-xl"></i> Journey of Love
        </div>
        <p className="text-sm text-gray-500">
          Share your love story and memorable moments leading up to your wedding day.
        </p>

        <button type="button" className="mt-2 py-1.5 px-3 inline-flex items-center text-sm font-medium rounded-lg border border-transparent bg-blue-100 text-blue-800 hover:bg-blue-200 focus:outline-hidden focus:bg-blue-200 disabled:opacity-50 disabled:pointer-events-none">
          <i className='bx bx-plus text-lg'></i> Add Story
        </button>
      </div>

      {/* History List */}
      {/* <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <div className="flex flex-col bg-white border border-gray-200 shadow-2xs rounded-xl">
          <div className="flex justify-between items-center bg-gray-100 border-b border-gray-200 rounded-t-xl py-2 px-3">
            <div className="text-sm text-gray-500">
              Feb ~ 2022
            </div>
            <div className="space-x-1">
              <button type="button" className="p-2 inline-flex items-center gap-x-2 text-sm font-medium rounded-full border border-gray-200 bg-white text-gray-800 shadow-2xs hover:bg-gray-50 focus:outline-hidden focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none">
                <i className='bx bxs-edit text-lg'></i>
              </button>
              <button type="button" className="p-2 inline-flex items-center gap-x-2 text-sm font-medium rounded-full border border-gray-200 bg-white text-gray-800 shadow-2xs hover:bg-gray-50 focus:outline-hidden focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none">
                <i className='bx bx-trash text-lg'></i>
              </button>
            </div>
          </div>

          <div className="relative w-full h-44 md:h-52">
            <img
              src="https://picsum.photos/500/600?random=1"
              alt="Card image"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="px-3 py-2">
            <div className="text-base font-bold text-gray-800">
              Card title
            </div>
            <p className="text-sm text-gray-500">
              With supporting text below as a natural lead-in to additional content.
            </p>
          </div>
        </div>
      </div> */}

      <div className="flex flex-col bg-white border border-gray-200 shadow-2xs rounded-xl p-3">
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
    </div>
  )
};

function GiftTabContent() {
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
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
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
            type="button"
            className="w-full sm:w-auto py-1.5 px-3 inline-flex items-center justify-center gap-1 text-sm font-medium rounded-lg bg-blue-100 text-blue-800 hover:bg-blue-200 focus:outline-none focus:bg-blue-200 disabled:opacity-50 disabled:pointer-events-none"
          >
            <i className="bx bx-plus text-lg"></i>
            Add Account
          </button>
        </div>

        <div className="mt-6 rounded-lg border border-dashed border-gray-200 p-6 text-center">
          <i className="bx bx-folder-open text-3xl text-gray-300 mb-2"></i>
          <p className="text-sm text-gray-500">
            No bank accounts added yet.
          </p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-3 mt-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex items-center gap-2 text-base font-semibold text-gray-800">
              <i className="bx bx-gift text-xl text-pink-600"></i>
              Wishlist Gift
            </div>
            <p className="text-sm text-gray-500 max-w-md">
              Create a wishlist of gifts that guests can choose from.
            </p>
          </div>

          <button
            type="button"
            className="w-full sm:w-auto py-1.5 px-3 inline-flex items-center justify-center gap-1 text-sm font-medium rounded-lg bg-pink-100 text-pink-800 hover:bg-pink-200 focus:outline-none focus:bg-pink-200 disabled:opacity-50 disabled:pointer-events-none"
          >
            <i className="bx bx-plus text-lg"></i>
            Add Wishlist
          </button>
        </div>

        <div className="mt-6 rounded-lg border border-dashed border-gray-200 p-6 text-center">
          <i className="bx bx-folder-open text-3xl text-gray-300 mb-2"></i>
          <p className="text-sm text-gray-500">
            Your wishlist is still empty.
          </p>
        </div>
      </div>
    </div>
  )
};

function RSVPTabContent() {
  const [inputPage, setInputPage] = useState("1");
  const [pageTable, setPageTable] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [totalPage, setTotalPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [inputSearch, setInputSearch] = useState("");
  const [tblSortList, setTblSortList] = useState<TableShortList[]>([]);
  const [tblThColomns, setTblThColomns] = useState<TableThModel[]>([
    { name: "Slug", key: "code", key_sort: "code", IsVisible: true },
    { name: "Name", key: "disc_amount", key_sort: "disc_amount", IsVisible: true },
    { name: "No Phone", key: "total_qty", key_sort: "total_qty", IsVisible: true },
    { name: "Attandance", key: "valid_from", key_sort: "valid_from", IsVisible: true },
    { name: "URI", key: "valid_to", key_sort: "valid_to", IsVisible: true },
  ]);

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
          // fatchData={() => fatchDatas(pageTable)}

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
                      <tr>
                        <td className="px-3 py-2.5 text-center text-muted text-sm" colSpan={tblThColomns.length + 3}><i>No data found!</i></td>
                      </tr>

                      {/* {
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
                              {
                                'is_active' in data && <td className={`px-3 py-2.5 whitespace-nowrap text-sm ${data.is_active === true ? "text-green-600" : "text-red-600"}`}>
                                  {data.is_active === true ? "Active" : "Inactive"}
                                </td>
                              }

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
                        } */}
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
            // fatchData={fatchDatas}

            inputPage={inputPage}
            setInputPage={setInputPage}
          />
        </div>
      </div>
    </div>
  )
};

function FAQTabContent() {
  return (
    <div>
      <div className="mb-6 mt-3 text-center">
        <div className="flex justify-center items-center gap-1 text-lg font-semibold text-gray-800">
          <i className="bx bx-help-circle text-xl"></i> Frequently Asked Questions
        </div>
        <p className="text-sm text-gray-500">
          Create and manage FAQ for your wedding, so your guests can find important information easily.
        </p>

        <button type="button" className="mt-2 py-1.5 px-3 inline-flex items-center text-sm font-medium rounded-lg border border-transparent bg-blue-100 text-blue-800 hover:bg-blue-200 focus:outline-hidden focus:bg-blue-200 disabled:opacity-50 disabled:pointer-events-none">
          <i className='bx bx-plus text-lg'></i> Add FAQ
        </button>
      </div>


      <div className="flex flex-col bg-white border border-gray-200 shadow-2xs rounded-xl p-3">
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

      {/* <div className="hs-accordion-group">
        <div className="hs-accordion active bg-white border border-gray-200 -mt-px first:rounded-t-lg last:rounded-b-lg" id="accordion-hs-one">
          <button className="hs-accordion-toggle hs-accordion-active:text-blue-600 inline-flex items-center justify-between gap-x-3 w-full font-semibold text-start text-gray-800 py-4 px-5 hover:text-gray-500 disabled:opacity-50 disabled:pointer-events-none" aria-expanded="true" aria-controls="accordion-collapse-one">
            <div className="text-sm">Accordion #1</div>
            <svg className="hs-accordion-active:hidden block size-5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m6 9 6 6 6-6"></path>
            </svg>
            <svg className="hs-accordion-active:block hidden size-5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m18 15-6-6-6 6"></path>
            </svg>
          </button>
          <div id="accordion-collapse-one" className="hs-accordion-content w-full overflow-hidden transition-[height] duration-300" role="region" aria-labelledby="accordion-hs-one">
            <div className="pb-4 px-5">
              <p className="text-gray-800">
                <em>This is the first item's accordion body.</em> It is hidden by default, until the collapse plugin adds the appropriate classes that we use to style each element. These classes control the overall appearance, as well as the showing and hiding via CSS transitions.
              </p>
            </div>
          </div>
        </div>

        <div className="hs-accordion bg-white border border-gray-200 -mt-px first:rounded-t-lg last:rounded-b-lg" id="accordion-hs-two">
          <button className="hs-accordion-toggle hs-accordion-active:text-blue-600 inline-flex items-center justify-between gap-x-3 w-full font-semibold text-start text-gray-800 py-4 px-5 hover:text-gray-500 disabled:opacity-50 disabled:pointer-events-none" aria-expanded="false" aria-controls="accordion-hs-two">
            <div className="text-sm">Accordion #2</div>
            <svg className="hs-accordion-active:hidden block size-5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m6 9 6 6 6-6"></path>
            </svg>
            <svg className="hs-accordion-active:block hidden size-5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m18 15-6-6-6 6"></path>
            </svg>
          </button>
          <div id="accordion-hs-two" className="hs-accordion-content hidden w-full overflow-hidden transition-[height] duration-300" role="region" aria-labelledby="accordion-hs-two">
            <div className="pb-4 px-5">
              <p className="text-gray-800">
                <em>This is the second item's accordion body.</em> It is hidden by default, until the collapse plugin adds the appropriate classes that we use to style each element. These classes control the overall appearance, as well as the showing and hiding via CSS transitions.
              </p>
            </div>
          </div>
        </div>

        <div className="hs-accordion bg-white border border-gray-200 -mt-px first:rounded-t-lg last:rounded-b-lg" id="accordion-hs-three">
          <button className="hs-accordion-toggle hs-accordion-active:text-blue-600 inline-flex items-center justify-between gap-x-3 w-full font-semibold text-start text-gray-800 py-4 px-5 hover:text-gray-500 disabled:opacity-50 disabled:pointer-events-none" aria-expanded="false" aria-controls="accordion-hs-three">
            <div className="text-sm">Accordion #3</div>
            <svg className="hs-accordion-active:hidden block size-5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m6 9 6 6 6-6"></path>
            </svg>
            <svg className="hs-accordion-active:block hidden size-5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m18 15-6-6-6 6"></path>
            </svg>
          </button>
          <div id="accordion-hs-three" className="hs-accordion-content hidden w-full overflow-hidden transition-[height] duration-300" role="region" aria-labelledby="accordion-hs-three">
            <div className="pb-4 px-5">
              <p className="text-gray-800">
                <em>This is the third item's accordion body.</em> It is hidden by default, until the collapse plugin adds the appropriate classes that we use to style each element. These classes control the overall appearance, as well as the showing and hiding via CSS transitions.
              </p>
            </div>
          </div>
        </div>
      </div> */}
    </div>
  )
};