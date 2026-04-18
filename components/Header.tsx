export default function Header() {
  return (
    <header className="bg-pakistan-green text-white shadow-lg relative overflow-hidden" role="banner">
      {/* Decorative geometric pattern */}
      <div className="absolute inset-0 opacity-10" aria-hidden="true">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="header-pattern" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
              <circle cx="30" cy="30" r="2" fill="white" />
              <circle cx="0" cy="0" r="2" fill="white" />
              <circle cx="60" cy="0" r="2" fill="white" />
              <circle cx="0" cy="60" r="2" fill="white" />
              <circle cx="60" cy="60" r="2" fill="white" />
              <path d="M30 15 L45 30 L30 45 L15 30 Z" fill="none" stroke="white" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#header-pattern)" />
        </svg>
      </div>

      <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6 relative z-10">
        <div className="flex items-center justify-center md:justify-start space-x-2 sm:space-x-3">
          {/* Logo/Icon */}
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-lg flex items-center justify-center shadow-md" aria-hidden="true">
            <svg
              className="w-5 h-5 sm:w-6 sm:h-6 text-pakistan-green"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
              />
            </svg>
          </div>

          {/* Branding */}
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight">
              Iqrah - Urdu TTS
            </h1>
            <p className="text-xs sm:text-sm text-green-100 hidden sm:block" lang="ur" dir="rtl">
              اردو ٹیکسٹ ٹو اسپیچ
            </p>
          </div>
        </div>
      </div>

      {/* Bottom decorative border */}
      <div className="h-1 bg-gradient-to-r from-transparent via-white to-transparent opacity-30" aria-hidden="true"></div>
    </header>
  );
}
