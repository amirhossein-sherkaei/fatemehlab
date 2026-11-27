'use client';

import { useReportWebVitals } from 'next/web-vitals';

// The API's CSRF allowlist contains the store's canonical domains. Vercel's
// per-deployment *.vercel.app URLs are intentionally excluded to avoid sending
// telemetry requests that the API correctly rejects as untrusted origins.
const ALLOWED_VITAL_HOSTS = new Set([
  'fatemehbeautyland.ir',
  'www.fatemehbeautyland.ir',
  'fatemehlab.vercel.app',
  'fatemehlab.ir',
]);

if (process.env.NEXT_PUBLIC_BASE_URL) {
  try {
    ALLOWED_VITAL_HOSTS.add(new URL(process.env.NEXT_PUBLIC_BASE_URL).hostname.toLowerCase());
  } catch {
    // An invalid public base URL should not broaden telemetry permissions.
  }
}

function canReportFromCurrentHost(): boolean {
  if (typeof window === 'undefined') return false;
  return ALLOWED_VITAL_HOSTS.has(window.location.hostname.toLowerCase());
}

export default function WebVitals() {
  useReportWebVitals((metric) => {
    if (process.env.NODE_ENV !== 'production' || !canReportFromCurrentHost()) return;

    fetch('/api/vitals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(metric),
      keepalive: true,
    }).catch(() => {
      // Telemetry must never interrupt the shopping experience.
    });
  });

  return null;
}
