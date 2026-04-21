import Header from './Header';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-white via-gray-50 to-green-50">
      {/* Minimalistic Islamic geometric pattern overlay */}
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none" aria-hidden="true">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="islamic-pattern" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
              {/* Simple octagon pattern */}
              <circle cx="60" cy="60" r="25" fill="none" stroke="currentColor" strokeWidth="1" className="text-pakistan-green" />
              <circle cx="60" cy="60" r="15" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-pakistan-green" />
              <line x1="60" y1="35" x2="60" y2="85" stroke="currentColor" strokeWidth="0.5" className="text-pakistan-green" />
              <line x1="35" y1="60" x2="85" y2="60" stroke="currentColor" strokeWidth="0.5" className="text-pakistan-green" />
              <line x1="42" y1="42" x2="78" y2="78" stroke="currentColor" strokeWidth="0.5" className="text-pakistan-green" />
              <line x1="78" y1="42" x2="42" y2="78" stroke="currentColor" strokeWidth="0.5" className="text-pakistan-green" />
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
