import DatePicker from "@/components/ui/date-picker";
import Input from "@/components/ui/input";
import Textarea from "@/components/ui/textarea";
import { useState } from "react";

export default function TabContentWedding() {
  const [eventDate, setDateRange] = useState<Date | undefined>(undefined);

  return (
    <>
      {/* MAIN INFO */}
      <div id="main-info-tab" role="tabpanel" aria-labelledby="main-info-item">
        <div className="grid grid-cols-12 gap-2">
          <div className="col-span-12 md:col-span-6">
            <label className="block text-sm font-medium mb-1 dark:text-white">
              Event Date<span className="text-red-500">*</span>
            </label>
            <DatePicker placeholder="Choose event date" mode='range' onChange={(date) => setDateRange(date as Date)} />
            {/* {stateFormAddEdit.errors?.voucher_code && <ZodErrors err={stateFormAddEdit.errors?.voucher_code} />} */}
          </div>
          <div className="col-span-12 md:col-span-6">
            <Input type='time' className='py-1.5' id='event_time' label='Event Time' mandatory />
          </div>
          <div className="col-span-12">
            <Textarea label="Greeting Message" id="greeting_message" placeholder="Enter greeting message" rows={3} />
          </div>
          <div className="col-span-12 md:col-span-6">
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
