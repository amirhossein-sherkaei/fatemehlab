import { NextResponse } from 'next/server';

// OWASP CSRF Protection: Validate Origin header against an allowlist.
// This prevents cross-origin state-changing requests.
const ALLOWED_ORIGINS = [
  'https://fatemehbeautyland.ir',
  'https://www.fatemehbeautyland.ir',
  'https://fatemehlab.vercel.app',
  'https://fatemehlab.ir',
  'http://localhost:3000',
];

export function validateOrigin(request: Request): { valid: boolean; origin: string | null } {
  const origin = request.headers.get('origin');
  const referer = request.headers.get('referer');

  // If Origin header is present, validate it
  if (origin) {
    const isValid = ALLOWED_ORIGINS.some(allowed => origin.startsWith(allowed));
    return { valid: isValid, origin };
  }

  // Fallback to Referer if Origin is missing (some browsers omit Origin for GET/HEAD)
  if (referer) {
    const isValid = ALLOWED_ORIGINS.some(allowed => referer.startsWith(allowed));
    return { valid: isValid, origin: referer };
  }

  // If neither is present, fail closed (reject) for security
  return { valid: false, origin: null };
}

export function rejectCsrf(request: Request): NextResponse {
  const { origin } = validateOrigin(request);
  console.error(`[CSRF BLOCKED] Origin: ${origin} | URL: ${request.url}`);
  return NextResponse.json(
    { success: false, message: 'درخواست نامعتبر (CSRF)' },
    { status: 403 }
  );
}

// File Upload Security: Validate MIME type and size
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
export const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB

export function validateImageUpload(file: File): { valid: boolean; message?: string } {
  if (!file) return { valid: false, message: 'فایلی ارسال نشد' };
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return { valid: false, message: 'فرمت فایل مجاز نیست (فقط JPG, PNG, WebP, GIF)' };
  }
  if (file.size > MAX_IMAGE_SIZE) {
    return { valid: false, message: 'حجم فایل بیش از ۵ مگابایت است' };
  }
  return { valid: true };
}

// Prevent path traversal & dangerous extensions
export function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .replace(/\.(php|exe|sh|js|html|svg)$/i, '');
}