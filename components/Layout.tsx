import Header from './Header';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-white via-gray-50 to-green-50">
      {/* Islamic geometric pattern overlay */}
      <div className="fixed inset-0 opacity-5 pointer-events-none" aria-hidden="true">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="islamic-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <path
                d="M50 0 L60 30 L90 30 L65 50 L75 80 L50 60 L25 80 L35 50 L10 30 L40 30 Z"
                fill="currentColor"
                className="text-pakistan-green"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#islamic-pattern)" />
        </svg>
      </div>

      <Header />
      
      <main className="flex-1 relative z-10" role="main">
        {children}
      </main>
      
      <Footer />
    </div>
  );
}
