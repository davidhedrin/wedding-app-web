import DatePicker from "@/components/ui/date-picker";
import Input from "@/components/ui/input";
import Textarea from "@/components/ui/textarea";
import Configs from "@/lib/config";
import { toast, toOrdinal } from "@/lib/utils";
import { useState } from "react";
import ContentComponent from "../comp-content";
import MapPicker from "@/components/map/MapPicker";

enum TradRecepType {
  Traditional,
  Reception
}

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
  const [birthOrderGroom, setBirthOrderGroom] = useState<number | "">(1);
  const [birthOrderBride, setBirthOrderBride] = useState<number | "">(1);
  const [eventDate, setDateRange] = useState<Date | undefined>(undefined);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
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

    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
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
    <div className="grid grid-cols-12 gap-3">
      {/* <div className="col-span-12 md:col-span-6">
        <label className="block text-sm font-medium mb-1 dark:text-white">
          Event Date<span className="text-red-500">*</span>
        </label>
        <DatePicker placeholder="Choose event date" mode='single' value={eventDate} onChange={(date) => setDateRange(date as Date)} />
        {stateFormAddEdit.errors?.voucher_code && <ZodErrors err={stateFormAddEdit.errors?.voucher_code} />}
      </div>
      <div className="col-span-12 md:col-span-6">
        <Input type='time' className='py-1.5' id='event_time' label='Event Time' mandatory />
      </div> */}
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
            <img
              className="w-full h-full object-cover"
              src="https://images.unsplash.com/photo-1680868543815-b8666dba60f7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=320&q=80"
              alt="Card Image"
            />

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
            <img
              className="w-full h-full object-cover"
              src="https://images.unsplash.com/photo-1680868543815-b8666dba60f7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=320&q=80"
              alt="Card Image"
            />

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

        <div onDragOver={handleDragOverCapture} onDrop={handleDropCapture} onDragLeave={handleDragLeaveCapture}>
          {!previewUrl ? (
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
              <img src={previewUrl} alt="Preview" className="w-full h-64 md:h-72 object-cover rounded-xl" />

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
      <div className="col-span-12 md:col-span-6">
        <Input type='text' className='py-1.5' id='contact_email' label='Contact Email' placeholder="Enter contact email address" />
      </div>
      <div className="col-span-12 md:col-span-6">
        <Input type='text' className='py-1.5' id='contact_phone' label='Contact Phone/WhatsApp' placeholder="Enter contact phone/whatsapp number" />
      </div>
    </div>
  )
};

function SchedulerTabContent() {
  // Marriage Blessing Props
  const [eventDateMb, setDateRangeMb] = useState<Date | undefined>();
  const [noteListMb, setNoteListMb] = useState<string[]>([""]);

  // Traditional Reception Props
  const [eventDateTr, setDateRangeTr] = useState<Date | undefined>();
  const [noteListTr, setNoteListTr] = useState<string[]>([""]);
  const [radioSelectTypeTr, setRadioSelectTypeTr] = useState<TradRecepType>(TradRecepType.Traditional);
  
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);

  return (
    <div>
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
              {/* {stateFormAddEdit.errors?.voucher_code && <ZodErrors err={stateFormAddEdit.errors?.voucher_code} />} */}
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
              <MapPicker />
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
                    <span className="text-sm text-gray-500">Traditional Ceremony</span>
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
                    <span className="text-sm text-gray-500">Reception Ceremony</span>
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
              {/* {stateFormAddEdit.errors?.voucher_code && <ZodErrors err={stateFormAddEdit.errors?.voucher_code} />} */}
            </div>
            <div className="col-span-12 md:col-span-4">
              <Input type='time' className='py-1.5' id='tr_start_time' label='Start Time' mandatory />
            </div>
            <div className="col-span-12 md:col-span-4">
              <Input type='time' className='py-1.5' id='tr_end_time' label='End Time' />
            </div>
            <div className="col-span-12">
              <Input label="Location Name" className='py-1.5' id="tr_loc_name" placeholder="Enter Location Name" mandatory />
            </div>
            <div className="col-span-12">
              <Textarea label="Location Address" id="tr_loc_address" placeholder="Enter Location Address" rows={3} />

              <div className="flex items-center gap-x-3 mt-2">
                <label htmlFor="hs-xs-switch-loc-tr" className="relative inline-block w-9 h-5 cursor-pointer">
                  <input type="checkbox" id="hs-xs-switch-loc-tr" className="peer sr-only" />
                  <span className="absolute inset-0 bg-gray-200 rounded-full transition-colors duration-200 ease-in-out peer-checked:bg-blue-600 peer-disabled:opacity-50 peer-disabled:pointer-events-none"></span>
                  <span className="absolute top-1/2 start-0.5 -translate-y-1/2 size-4 bg-white rounded-full shadow-xs transition-transform duration-200 ease-in-out peer-checked:translate-x-full"></span>
                </label>
                <label htmlFor="hs-xs-switch-loc-tr" className="text-sm text-gray-500">Use Marriage Blessing Location</label>
              </div>
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

      <Textarea label="Notes" id="shedule_notes" placeholder="Enter Event Schedule If Any" rows={3} />
    </div>
  )
};

function GalleryTabContent() {
  return (
    <p className="text-gray-500 text-sm">
      This is the <em className="font-semibold text-gray-800">Gallery</em> tab body.
    </p>
  )
};

function HistoryTabContent() {
  return (
    <p className="text-gray-500 text-sm">
      This is the <em className="font-semibold text-gray-800">History</em> tab body.
    </p>
  )
};

function GiftTabContent() {
  return (
    <p className="text-gray-500 text-sm">
      This is the <em className="font-semibold text-gray-800">Gift</em> tab body.
    </p>
  )
};

function RSVPTabContent() {
  return (
    <p className="text-gray-500 text-sm">
      This is the <em className="font-semibold text-gray-800">RSVP</em> tab body.
    </p>
  )
};

function FAQTabContent() {
  return (
    <p className="text-gray-500 text-sm">
      This is the <em className="font-semibold text-gray-800">FAQ</em> tab body.
    </p>
  )
};