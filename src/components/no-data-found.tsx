

type NoDataFoundProps = {
  title?: string;
  description?: string;
};

export default function NoDataFound({
  title = "No data found!",
  description = "Try changing your search keywords, removing filters, or trying again later.",
}: NoDataFoundProps) {
  return (
    <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10">
      <div className="flex-shrink-0">
        <div className="w-40 h-4w-40 sm:w-44 sm:h-4w-44 rounded-xl bg-gradient-to-br from-indigo-50 to-pink-50 flex items-center justify-center">
          <svg
            width="160"
            height="160"
            viewBox="0 0 160 160"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="transform transition-transform duration-500 hover:scale-105"
            aria-hidden
          >
            <defs>
              <linearGradient id="g1" x1="0" x2="1" y1="0" y2="1">
                <stop offset="0" stopColor="#6366F1" stopOpacity="0.12" />
                <stop offset="1" stopColor="#EC4899" stopOpacity="0.08" />
              </linearGradient>
            </defs>

            <rect x="12" y="18" width="100" height="76" rx="10" fill="#fff" stroke="#E6E9F2" />
            <path d="M22 30 H102" stroke="#EEF2FF" strokeWidth="2" strokeLinecap="round" />
            <circle cx="84" cy="56" r="16" fill="url(#g1)" />
            <path d="M94 66 L116 88" stroke="#CBD5E1" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
            <g transform="translate(60,102)">
              <circle cx="0" cy="0" r="30" fill="#fff" stroke="#F3F4F6" />
              <path d="M-6 -2 L-1 4 L6 -6" stroke="#A78BFA" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            </g>
            <g transform="translate(140,18) rotate(30)">
              <rect x="-6" y="-6" width="12" height="12" rx="3" fill="#FFF1F2" stroke="#FBCFE8" />
            </g>
          </svg>
        </div>
      </div>

      <div className="flex-1 text-center md:text-left">
        <div className="text-lg font-semibold text-gray-800">
          {title}
        </div>
        <p className="text-sm text-gray-500 max-w-xl">
          {description}
        </p>

        <div className="mt-3 flex flex-col sm:flex-row sm:items-center sm:gap-3 gap-3 justify-center md:justify-start">
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="inline-flex items-center justify-center px-4 py-2 rounded-lg border border-gray-200 bg-white text-sm text-gray-700 hover:bg-gray-50 transition"
          >
            Reload Page
          </button>
        </div>

        <div className="mt-3 text-sm text-gray-400">
          Tip: Make sure the filters you select are appropriate. You can leave the categories blank or adjust the keywords.
        </div>
      </div>
    </div>
  )
}
