'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function PrelineProvider() {
  const pathname = usePathname();

  useEffect(() => {
    const initPreline = async () => {
      if (typeof window === 'undefined') return;

      // Import build version (penting)
      await import('preline');

      // Destroy semua instance lama dulu (penting untuk SPA)
      if ((window as any).HSStaticMethods?.destroy) {
        (window as any).HSStaticMethods.destroy();
      }

      // Init ulang semua komponen di halaman baru
      (window as any).HSStaticMethods?.autoInit();
    };

    setTimeout(() => {
      initPreline();
    }, 100);
  }, [pathname]);

  return null;
}
