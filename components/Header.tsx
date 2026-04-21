'use client';

import Image from 'next/image';
import { useState } from 'react';

export default function Header() {
  const [imageError, setImageError] = useState(false);
  const [logoSrc, setLogoSrc] = useState('/iqrah-logo.png');

  const handleImageError = () => {
    if (logoSrc === '/iqrah-logo.png') {
      // Try alternative path
      setLogoSrc('/logo.png');
    } else {
      // Show fallback SVG
      setImageError(true);
    }
  };

  return (
    <header className="bg-gradient-to-r from-pakistan-green via-pakistan-lightGreen to-pakistan-green text-white shadow-lg relative overflow-hidden" role="banner">
      <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6 relative z-10">
        <div className="flex items-center justify-center md:justify-start space-x-3 sm:space-x-4">
          {/* Logo */}
          <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-white rounded-xl flex items-center justify-center shadow-lg p-2" aria-hidden="true">
            {!imageError ? (
              <Image
                src={logoSrc}
                alt="Iqrah Logo"
                width={64}
                height={64}
                className="w-full h-full object-contain"
                priority
                onError={handleImageError}
                unoptimized
              />
            ) : (
              // Fallback SVG logo with Urdu text
              <svg className="w-full h-full" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{ stopColor: '#01411C', stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: '#0A6E3A', stopOpacity: 1 }} />
                  </linearGradient>
                </defs>
                {/* Stylized book/reading icon */}
                <path
                  d="M20 25 L50 20 L50 75 L20 80 Z M80 25 L50 20 L50 75 L80 80 Z"
                  fill="url(#logoGradient)"
                  stroke="#01411C"
                  strokeWidth="2"
                />
                {/* Urdu letter "alif" (ا) representing reading */}
                <text
                  x="50"
                  y="60"
                  fontSize="40"
                  fontWeight="bold"
                  fill="#C8102E"
                  textAnchor="middle"
                  fontFamily="serif"
                >
                  ا
                </text>
              </svg>
            )}
          </div>

          {/* Branding */}
          <div className="flex flex-col">
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight drop-shadow-md">
              Iqrah - Urdu TTS
            </h1>
            <p className="text-xs sm:text-sm md:text-base text-green-100 font-medium" lang="ur" dir="rtl">
              اردو ٹیکسٹ ٹو اسپیچ
            </p>
          </div>
        </div>
      </div>

      {/* Bottom decorative border */}
      <div className="h-1 bg-gradient-to-r from-transparent via-white to-transparent opacity-40" aria-hidden="true"></div>
    </header>
  );
}
