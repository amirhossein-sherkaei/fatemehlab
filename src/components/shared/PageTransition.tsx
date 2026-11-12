'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Fade out
    setIsVisible(false);
    // Fade in after path change
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <div
      className={`transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
      style={{ minHeight: '100dvh' }}
    >
      {children}
    </div>
  );
}