'use client';

/* FBL_HIDE_ON_ROUTES_20261120 */
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

type HideOnRoutesProps = {
  children: ReactNode;
  hiddenOn: readonly string[];
};

export default function HideOnRoutes({ children, hiddenOn }: HideOnRoutesProps) {
  const pathname = usePathname();
  const shouldHide = hiddenOn.some((route) =>
    pathname === route || pathname.startsWith(`${route}/`)
  );

  return shouldHide ? null : <>{children}</>;
}