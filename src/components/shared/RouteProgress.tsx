'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';

export default function RouteProgress() {
  const pathname = usePathname();
  const prevPathRef = useRef(pathname);
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (prevPathRef.current === pathname) return;
    prevPathRef.current = pathname;
    
    setVisible(true);
    setProgress(20);
    
    const t1 = setTimeout(() => setProgress(50), 80);
    const t2 = setTimeout(() => setProgress(85), 200);
    const t3 = setTimeout(() => setProgress(100), 350);
    const t4 = setTimeout(() => {
      setVisible(false);
      setProgress(0);
    }, 550);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [pathname]);

  if (!visible) return null;

  return (
    <div className="fixed top-0 left-0 right-0 h-[3px] z-[9999] pointer-events-none" aria-hidden="true">
      <div
        className="h-full bg-gradient-to-r from-[#c61d70] via-[#e84e9e] to-[#c61d70] shadow-[0_0_10px_rgba(198,29,112,0.6)] transition-all duration-200 ease-out"
        style={{ width: `${progress}%`, opacity: progress === 100 ? 0 : 1 }}
      />
    </div>
  );
}