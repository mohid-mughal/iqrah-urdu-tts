export default function Footer() {
  return (
    <footer className="bg-pakistan-green text-white mt-auto relative overflow-hidden" role="contentinfo">
      {/* Top decorative border */}
      <div className="h-1 bg-gradient-to-r from-transparent via-white to-transparent opacity-30" aria-hidden="true"></div>

      {/* Decorative geometric pattern */}
      <div className="absolute inset-0 opacity-5" aria-hidden="true">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="footer-pattern" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
              <path
                d="M40 0 L50 20 L70 20 L55 32 L60 52 L40 40 L20 52 L25 32 L10 20 L30 20 Z"
                fill="white"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#footer-pattern)" />
        </svg>
      </div>

      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between space-y-4 sm:space-y-6 md:space-y-0">
          {/* Credits Section */}
          <div className="text-center md:text-left">
            <h2 className="text-base sm:text-lg font-semibold mb-2">Created by</h2>
            <div className="flex flex-col space-y-2 text-xs sm:text-sm text-green-100">
              <div className="flex items-center space-x-1 sm:space-x-2 justify-center md:justify-start flex-wrap">
                <span>Mohid Mughal</span>
                <span className="text-green-300" aria-hidden="true">•</span>
                <a
                  href="https://linkedin.com/in/mohidmughal"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors underline focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-pakistan-green rounded"
                  aria-label="Mohid Mughal's LinkedIn profile"
                >
                  LinkedIn
                </a>
                <span className="text-green-300" aria-hidden="true">•</span>
                <a
                  href="https://github.com/mohid-mughal"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors underline focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-pakistan-green rounded"
                  aria-label="Mohid Mughal's GitHub profile"
                >
                  GitHub
                </a>
              </div>
              <div className="flex items-center space-x-1 sm:space-x-2 justify-center md:justify-start flex-wrap">
                <span>Ahmed Javed</span>
                <span className="text-green-300" aria-hidden="true">•</span>
                <a
                  href="https://www.linkedin.com/in/ahmed-javed"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors underline focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-pakistan-green rounded"
                  aria-label="Ahmed Javed's LinkedIn profile"
                >
                  LinkedIn
                </a>
                <span className="text-green-300" aria-hidden="true">•</span>
                <a
                  href="https://github.com/vitiligo610"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors underline focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-pakistan-green rounded"
                  aria-label="Ahmed Javed's GitHub profile"
                >
                  GitHub
                </a>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="text-center md:text-right">
            <p className="text-xs sm:text-sm text-green-100">
              National University of Science and Technology
            </p>
            <p className="text-xs text-green-200 mt-1">
              © {new Date().getFullYear()} Iqrah - Urdu TTS
            </p>
          </div>
        </div>

        {/* Decorative Islamic pattern element */}
        <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-green-700 flex justify-center" aria-hidden="true">
          <div className="flex space-x-2">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="w-2 h-2 bg-white rounded-full opacity-50"
              ></div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
