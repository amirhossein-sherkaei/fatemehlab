import { NextResponse } from 'next/server';

const DEFAULT_ORIGINS = [
  'https://fatemehbeautyland.ir',
  'https://www.fatemehbeautyland.ir',
  'https://fatemehlab.vercel.app',
  'https://fatemehlab.ir',
  'http://localhost:3000',
];

const ALLOWED_ORIGINS: string[] = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map((s) => s.trim()).filter(Boolean)
  : DEFAULT_ORIGINS;

const ENABLE_VERCEL_PREVIEW = process.env.ENABLE_VERCEL_PREVIEW === 'true';

export function validateOrigin(request: Request): { valid: boolean; origin: string | null } {
  const origin = request.headers.get('origin');
  const referer = request.headers.get('referer');
  const candidate = origin || referer;

  if (!candidate) {
    return { valid: false, origin: null };
  }

  const isAllowed = ALLOWED_ORIGINS.some((allowed) => candidate.startsWith(allowed));
  if (isAllowed) return { valid: true, origin: candidate };

  if (ENABLE_VERCEL_PREVIEW) {
    try {
      const u = new URL(candidate);
      if (u.hostname.endsWith('.vercel.app') && u.hostname.includes('fatemehlab')) {
        return { valid: true, origin: candidate };
      }
    } catch {
      /* ignore */
    }
  }

  return { valid: false, origin: candidate };
}

export function rejectCsrf(request: Request): NextResponse {
  const { origin } = validateOrigin(request);
  console.error(`[CSRF BLOCKED] Origin: ${origin} | URL: ${request.url}`);
  return NextResponse.json(
    { success: false, message: 'درخواست نامعتبر (CSRF)' },
    { status: 403 }
  );
}

export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
export const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

export function validateImageUpload(file: File): { valid: boolean; message?: string } {
  if (!file) return { valid: false, message: 'فایلی ارسال نشد' };
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return { valid: false, message: 'فرمت فایل مجاز نیست (فقط JPG, PNG, WebP, GIF)' };
  }
  if (file.size > MAX_IMAGE_SIZE) {
    return { valid: false, message: 'حجم فایل بیش از ۵ مگابایت است' };
  }
  const ext = file.name.split('.').pop()?.toLowerCase();
  const allowedExts = ['jpg', 'jpeg', 'png', 'webp', 'gif'];
  if (!ext || !allowedExts.includes(ext)) {
    return { valid: false, message: 'پسوند فایل مجاز نیست' };
  }
  return { valid: true };
}

export function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .replace(/\.(php|exe|sh|js|html|svg)$/i, '');
}