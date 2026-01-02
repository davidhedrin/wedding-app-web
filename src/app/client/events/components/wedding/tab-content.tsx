export default function TabContentWedding() {
  return (
    <>
      {/* MAIN INFO */}
      <div id="main-info-tab" role="tabpanel" aria-labelledby="main-info-item">
        
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
