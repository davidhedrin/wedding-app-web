export default function MainSidebar() {
  return (
    <div id="hs-pro-sidebar" className="hs-overlay [--body-scroll:true] lg:[--overlay-backdrop:false] [--is-layout-affect:true] [--opened:lg] [--auto-close:lg] hs-overlay-open:translate-x-0 lg:hs-overlay-layout-open:translate-x-0 -translate-x-full transition-all duration-300 transform w-60 hidden fixed inset-y-0 z-60 start-0 bg-gray-100 lg:block lg:-translate-x-full lg:end-auto lg:bottom-0" role="dialog" aria-label="Sidebar">
      <div className="lg:pt-13 relative flex flex-col h-full max-h-full">
        <nav className="p-3 size-full flex flex-col overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-200 [&::-webkit-scrollbar-thumb]:bg-gray-300">
          <div className="lg:hidden mb-6 flex items-center justify-between">
            <a className="shrink-0 inline-flex justify-center items-center bg-indigo-700 size-8 rounded-md text-xl font-semibold focus:outline-hidden focus:opacity-80" href="index.html" aria-label="Preline">
              <svg className="shrink-0 size-5" width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M18.0835 3.23358C9.88316 3.23358 3.23548 9.8771 3.23548 18.0723V35.5832H0.583496V18.0723C0.583496 8.41337 8.41851 0.583252 18.0835 0.583252C27.7485 0.583252 35.5835 8.41337 35.5835 18.0723C35.5835 27.7312 27.7485 35.5614 18.0835 35.5614H16.7357V32.911H18.0835C26.2838 32.911 32.9315 26.2675 32.9315 18.0723C32.9315 9.8771 26.2838 3.23358 18.0835 3.23358Z" className="fill-white" fill="currentColor" />
                <path fillRule="evenodd" clipRule="evenodd" d="M18.0833 8.62162C12.8852 8.62162 8.62666 12.9245 8.62666 18.2879V35.5833H5.97468V18.2879C5.97468 11.5105 11.3713 5.97129 18.0833 5.97129C24.7954 5.97129 30.192 11.5105 30.192 18.2879C30.192 25.0653 24.7954 30.6045 18.0833 30.6045H16.7355V27.9542H18.0833C23.2815 27.9542 27.54 23.6513 27.54 18.2879C27.54 12.9245 23.2815 8.62162 18.0833 8.62162Z" className="fill-white" fill="currentColor" />
                <path d="M24.8225 18.1012C24.8225 21.8208 21.8053 24.8361 18.0833 24.8361C14.3614 24.8361 11.3442 21.8208 11.3442 18.1012C11.3442 14.3815 14.3614 11.3662 18.0833 11.3662C21.8053 11.3662 24.8225 14.3815 24.8225 18.1012Z" className="fill-white" fill="currentColor" />
              </svg>
            </a>

            <div className="font-semibold">
              W-App
            </div>

            <button type="button" className="ps-1.5 inline-flex items-center gap-x-1 rounded-md text-gray-500 disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden" aria-haspopup="dialog" aria-expanded="false" aria-controls="hs-pro-sidebar" data-hs-overlay="#hs-pro-sidebar">
              <i className='bx bx-x text-xl'></i>
              <span className="sr-only">Sidebar Toggle</span>
            </button>
          </div>

          <div className="flex flex-col first:pt-0 first:mt-0">
            <span className="block px-0.5 lg:px-2.5 mb-1 font-medium text-xs text-gray-500 hover:text-gray-800">
              Home
            </span>

            <ul className="flex flex-col">
              <li>
                <a className="w-full flex items-center leading-none gap-x-2 py-2 px-0.5 lg:px-2.5 text-sm rounded-lg hover:bg-gray-200 focus:outline-hidden focus:bg-gray-200 focus:text-gray-800" href="#">
                  <i className='bx bx-tachometer text-lg'></i> Dashboard
                </a>
              </li>
            </ul>
          </div>

          <div className="pt-3 mt-3 flex flex-col border-t border-gray-200 first:border-t-0 first:pt-0 first:mt-0">
            <span className="block px-0.5 lg:px-2.5 mb-1 font-medium text-xs text-gray-500 hover:text-gray-800">
              Pages
            </span>

            <ul className="flex flex-col">
              <li>
                <a className="w-full flex items-center leading-none gap-x-2 py-2 px-0.5 lg:px-2.5 text-sm rounded-lg hover:bg-gray-200 focus:outline-hidden focus:bg-gray-200 focus:text-gray-800" href="#">
                  <i className='bx bx-customize text-lg'></i> Posts
                </a>
              </li>
              <li className="hs-accordion" id="account-accordion">
                <a className="hs-accordion-toggle w-full flex items-center leading-none gap-x-2 py-2 px-0.5 lg:px-2.5 text-sm rounded-lg hover:bg-gray-200 focus:outline-hidden focus:bg-gray-200 focus:text-gray-800" aria-expanded="true" aria-controls="account-accordion-sub-1-collapse-1">
                  <i className='bx bx-user-pin text-lg'></i> Account
                  <svg className="hs-accordion-active:block ms-auto hidden size-4 text-gray-600 group-hover:text-gray-500 dark:text-neutral-400 " xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m18 15-6-6-6 6" /></svg>
                  <svg className="hs-accordion-active:hidden ms-auto block size-4 text-gray-600 group-hover:text-gray-500 dark:text-neutral-400 " xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                </a>

                <div id="account-accordion-sub-1-collapse-1" className="hs-accordion-content w-full overflow-hidden transition-[height] duration-300 hidden" role="region" aria-labelledby="account-accordion">
                  <ul className="pt-1 ps-4 space-y-1">
                    <li>
                      <a className="w-full flex items-center gap-x-2 py-2 px-2.5 text-sm text-gray-500 rounded-lg hover:bg-gray-200 hover:text-gray-800 focus:outline-hidden focus:bg-gray-200 focus:text-gray-800" href="#">
                        Link 1
                      </a>
                    </li>
                    <li>
                      <a className="w-full flex items-center gap-x-2 py-2 px-2.5 text-sm text-gray-500 rounded-lg hover:bg-gray-200 hover:text-gray-800 focus:outline-hidden focus:bg-gray-200 focus:text-gray-800" href="#">
                        Link 2
                      </a>
                    </li>
                    <li>
                      <a className="w-full flex items-center gap-x-2 py-2 px-2.5 text-sm text-gray-500 rounded-lg hover:bg-gray-200 hover:text-gray-800 focus:outline-hidden focus:bg-gray-200 focus:text-gray-800" href="#">
                        Link 3
                      </a>
                    </li>
                  </ul>
                </div>
              </li>
            </ul>
          </div>
        </nav>

        <footer className="mt-auto p-3 flex flex-col">
          <ul className="flex flex-col">
            <li>
              <a className="w-full flex items-center leading-none gap-x-2 py-2 px-2.5 text-sm text-gray-500 rounded-lg hover:bg-gray-200 hover:text-gray-800 focus:outline-hidden focus:bg-gray-200 focus:text-gray-800" href="#">
                <i className='bx bx-cog text-lg'></i>
                Setting
              </a>
            </li>
            <li>
              <a className="w-full flex items-center leading-none gap-x-2 py-2 px-2.5 text-sm text-gray-500 rounded-lg hover:bg-gray-200 hover:text-gray-800 focus:outline-hidden focus:bg-gray-200 focus:text-gray-800" href="#">
                <i className='bx bx-log-out text-lg'></i>
                Logout
              </a>
            </li>
          </ul>
        </footer>
      </div>
    </div>
  )
}
