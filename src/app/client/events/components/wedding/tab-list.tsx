export default function TabListWedding() {
  return (
    <nav className="flex flex-wrap justify-center sm:flex-col gap-2" aria-label="Tabs" role="tablist" aria-orientation="vertical">
      <button type="button" id="main-info-item" aria-selected="true" data-hs-tab="#main-info-tab" aria-controls="main-info-tab" className="hs-tab-active:border-blue-500 hs-tab-active:text-blue-600 py-2 pe-3 inline-flex items-center gap-x-2 border-b-2 sm:border-b-0 sm:border-e-2 border-transparent text-sm text-gray-500 hover:text-blue-600 focus:outline-hidden active" role="tab">
        <i className="bx bx-info-circle text-lg"></i>
        Main Info
      </button>

      <button type="button" id="scheduler-tab-item" aria-selected="false" data-hs-tab="#scheduler-tab" aria-controls="scheduler-tab" className="hs-tab-active:border-blue-500 hs-tab-active:text-blue-600 py-2 pe-3 inline-flex items-center gap-x-2 border-b-2 sm:border-b-0 sm:border-e-2 border-transparent text-sm text-gray-500 hover:text-blue-600 focus:outline-hidden" role="tab">
        <i className="bx bx-calendar-star text-lg"></i>
        Schedule
      </button>

      <button type="button" id="gallery-tab-item" aria-selected="false" data-hs-tab="#gallery-tab" aria-controls="gallery-tab" className="hs-tab-active:border-blue-500 hs-tab-active:text-blue-600 py-2 pe-3 inline-flex items-center gap-x-2 border-b-2 sm:border-b-0 sm:border-e-2 border-transparent text-sm text-gray-500 hover:text-blue-600 focus:outline-hidden" role="tab">
        <i className="bx bx-photo-album text-lg"></i>
        Gallery
      </button>

      <button type="button" id="history-tab-item" aria-selected="false" data-hs-tab="#history-tab" aria-controls="history-tab" className="hs-tab-active:border-blue-500 hs-tab-active:text-blue-600 py-2 pe-3 inline-flex items-center gap-x-2 border-b-2 sm:border-b-0 sm:border-e-2 border-transparent text-sm text-gray-500 hover:text-blue-600 focus:outline-hidden" role="tab">
        <i className="bx bx-book-heart text-lg"></i>
        History
      </button>

      <button type="button" id="gift-tab-item" aria-selected="false" data-hs-tab="#gift-tab" aria-controls="gift-tab" className="hs-tab-active:border-blue-500 hs-tab-active:text-blue-600 py-2 pe-3 inline-flex items-center gap-x-2 border-b-2 sm:border-b-0 sm:border-e-2 border-transparent text-sm text-gray-500 hover:text-blue-600 focus:outline-hidden" role="tab">
        <i className="bx bx-gift text-lg"></i>
        Gift
      </button>

      <button type="button" id="rsvp-tab-item" aria-selected="false" data-hs-tab="#rsvp-tab" aria-controls="rsvp-tab" className="hs-tab-active:border-blue-500 hs-tab-active:text-blue-600 py-2 pe-3 inline-flex items-center gap-x-2 border-b-2 sm:border-b-0 sm:border-e-2 border-transparent text-sm text-gray-500 hover:text-blue-600 focus:outline-hidden" role="tab">
        <i className="bx bx-envelope text-lg"></i>
        RSVP
      </button>

      <button type="button" id="faq-tab-item" aria-selected="false" data-hs-tab="#faq-tab" aria-controls="faq-tab" className="hs-tab-active:border-blue-500 hs-tab-active:text-blue-600 py-2 pe-3 inline-flex items-center gap-x-2 border-b-2 sm:border-b-0 sm:border-e-2 border-transparent text-sm text-gray-500 hover:text-blue-600 focus:outline-hidden" role="tab">
        <i className="bx bx-help-circle text-lg"></i>
        FAQ
      </button>
    </nav>
  )
}
