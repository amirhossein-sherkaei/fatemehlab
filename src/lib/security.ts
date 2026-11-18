import { NextResponse } from 'next/server';

const DEFAULT_ORIGINS = [
  'https://fatemehbeautyland.ir',
  'https://www.fatemehbeautyland.ir',
  'https://fatemehlab.vercel.app',
  'https://fatemehlab.ir',
  'http://localhost:3000',
];

const CONFIGURED_ORIGINS = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',')
  : DEFAULT_ORIGINS;
const ALLOWED_ORIGINS = [
  ...CONFIGURED_ORIGINS,
  ...(process.env.NEXT_PUBLIC_BASE_URL ? [process.env.NEXT_PUBLIC_BASE_URL] : []),
].map((value) => value.trim()).filter(Boolean);

const ENABLE_VERCEL_PREVIEW = process.env.ENABLE_VERCEL_PREVIEW === 'true';

function getHttpOrigin(value: string): string | null {
  try {
    const parsed = new URL(value);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return null;
    return parsed.origin.toLowerCase();
  } catch {
    return null;
  }
}

export function validateOrigin(request: Request): { valid: boolean; origin: string | null } {
  const originHeader = request.headers.get('origin');
  const refererHeader = request.headers.get('referer');
  const candidate = originHeader || refererHeader;

  if (!candidate) return { valid: false, origin: null };

  const candidateOrigin = getHttpOrigin(candidate);
  if (!candidateOrigin) return { valid: false, origin: null };

  const isAllowed = ALLOWED_ORIGINS.some((allowed) => getHttpOrigin(allowed) === candidateOrigin);
  if (isAllowed) return { valid: true, origin: candidateOrigin };

  if (ENABLE_VERCEL_PREVIEW) {
    try {
      const hostname = new URL(candidateOrigin).hostname.toLowerCase();
      const isProjectPreview = hostname === 'fatemehlab.vercel.app' || /^fatemehlab-[a-z0-9-]+\.vercel\.app$/.test(hostname);
      if (isProjectPreview) return { valid: true, origin: candidateOrigin };
    } catch {
      // Invalid URLs are rejected below.
    }
  }

  return { valid: false, origin: candidateOrigin };
}

export function rejectCsrf(request: Request): NextResponse {
  const { origin } = validateOrigin(request);
  console.error('[CSRF BLOCKED] Origin: ' + String(origin) + ' | URL: ' + request.url);
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
