import DatePicker from "@/components/ui/date-picker";
import Input from "@/components/ui/input";
import Textarea from "@/components/ui/textarea";
import { toOrdinal } from "@/lib/utils";
import { useState } from "react";

export default function TabContentWedding() {
  const [birthOrder, setBirthOrder] = useState<number | "">(1);
  const [eventDate, setDateRange] = useState<Date | undefined>(undefined);

  return (
    <>
      {/* MAIN INFO */}
      <div id="main-info-tab" role="tabpanel" aria-labelledby="main-info-item">
        <div className="grid grid-cols-12 gap-3">
          <div className="col-span-12 md:col-span-6">
            <label className="block text-sm font-medium mb-1 dark:text-white">
              Event Date<span className="text-red-500">*</span>
            </label>
            <DatePicker placeholder="Choose event date" mode='single' value={eventDate} onChange={(date) => setDateRange(date as Date)} />
            {/* {stateFormAddEdit.errors?.voucher_code && <ZodErrors err={stateFormAddEdit.errors?.voucher_code} />} */}
          </div>
          <div className="col-span-12 md:col-span-6">
            <Input type='time' className='py-1.5' id='event_time' label='Event Time' mandatory />
          </div>
          <div className="col-span-12">
            <Textarea label="Greeting Message" id="greeting_message" placeholder="Enter greeting message" rows={3} />
          </div>
          <div className="col-span-12 md:col-span-6">
            <div className="font-semibold text-gray-800 mb-1.5">
              <i className='bx bx-male-sign text-xl'></i> Groom Information
            </div>
            <div className="flex flex-col bg-white border border-gray-200 shadow-2xs rounded-xl overflow-hidden">
              <div className="relative w-full h-48 md:h-64">
                <img
                  className="w-full h-full object-cover"
                  src="https://images.unsplash.com/photo-1680868543815-b8666dba60f7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=320&q=80"
                  alt="Card Image"
                />

                {/* Upload Button */}
                <label className="absolute top-2 right-2 bg-white bg-opacity-80 hover:bg-opacity-100 transition px-3 py-1 rounded-md text-sm cursor-pointer shadow-md flex items-center gap-1">
                  <i className='bx bx-image-add text-lg'></i>
                  Upload
                  <input
                    type="file"
                    accept="image/jpeg,image/jpg,image/png"
                    className="hidden"
                  />
                </label>

                <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs md:text-sm px-2 py-1 rounded-md">
                  <p>Upload image for Groom/Bride profile</p>
                  <p>Allowed formats: JPG, JPEG, PNG up to 1MB</p>
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
                      value={birthOrder}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === "") {
                          setBirthOrder("");
                          return;
                        }

                        const num = Number(value);
                        if (num < 1) return;

                        setBirthOrder(num);
                      }}
                      onBlur={() => {
                        if (birthOrder === "") {
                          setBirthOrder(1);
                        }
                      }}
                      sufixGroup={<span>{typeof birthOrder === "number" ? `${toOrdinal(birthOrder)} Child` : "- Child"}</span>}
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
          </div>
        </div>
      </div>

      {/* SCHEDULE */}
      <div id="scheduler-tab" className="hidden" role="tabpanel" aria-labelledby="scheduler-tab-item">
        <p className="text-gray-500 text-sm">This is the <em className="font-semibold text-gray-800">Schedule</em> tab body.</p>
      </div>

      {/* GALLERY */}
      <div id="gallery-tab" className="hidden" role="tabpanel" aria-labelledby="gallery-tab-item">
        <p className="text-gray-500 text-sm">This is the <em className="font-semibold text-gray-800">Gallery</em> tab body.</p>
      </div>

      {/* HISTORY */}
      <div id="history-tab" className="hidden" role="tabpanel" aria-labelledby="history-tab-item">
        <p className="text-gray-500 text-sm">This is the <em className="font-semibold text-gray-800">History</em> tab body.</p>
      </div>

      {/* GIFT */}
      <div id="gift-tab" className="hidden" role="tabpanel" aria-labelledby="gift-tab-item">
        <p className="text-gray-500 text-sm">This is the <em className="font-semibold text-gray-800">Gift</em> tab body.</p>
      </div>

      {/* RSVP */}
      <div id="rsvp-tab" className="hidden" role="tabpanel" aria-labelledby="rsvp-tab-item">
        <p className="text-gray-500 text-sm">This is the <em className="font-semibold text-gray-800">RSVP</em> tab body.</p>
      </div>

      {/* FAQ */}
      <div id="faq-tab" className="hidden" role="tabpanel" aria-labelledby="faq-tab-item">
        <p className="text-gray-500 text-sm">This is the <em className="font-semibold text-gray-800">FAQ</em> tab body.</p>
      </div>
    </>
  )
}
