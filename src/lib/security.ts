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
  if (!file || typeof file.arrayBuffer !== 'function') return { valid: false, message: 'فایلی ارسال نشد' };
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return { valid: false, message: 'فرمت فایل مجاز نیست (فقط JPG, PNG, WebP, GIF)' };
  }
  if (file.size <= 0 || file.size > MAX_IMAGE_SIZE) {
    return { valid: false, message: 'حجم فایل باید بیشتر از صفر و حداکثر ۵ مگابایت باشد' };
  }

  const extension = file.name.split('.').pop()?.toLowerCase();
  const expectedExtension: Record<string, string[]> = {
    'image/jpeg': ['jpg', 'jpeg'],
    'image/png': ['png'],
    'image/webp': ['webp'],
    'image/gif': ['gif'],
  };
  if (!extension || !expectedExtension[file.type]?.includes(extension)) {
    return { valid: false, message: 'پسوند فایل با نوع تصویر مطابقت ندارد' };
  }
  return { valid: true };
}

export async function validateImageUploadContent(file: File): Promise<{ valid: boolean; message?: string }> {
  const basic = validateImageUpload(file);
  if (!basic.valid) return basic;

  try {
    const bytes = new Uint8Array(await file.slice(0, 12).arrayBuffer());
    const startsWith = (...signature: number[]) => signature.every((value, index) => bytes[index] === value);
    const ascii = (start: number, length: number) => String.fromCharCode(...bytes.slice(start, start + length));

    const matches = file.type === 'image/jpeg'
      ? startsWith(0xff, 0xd8, 0xff)
      : file.type === 'image/png'
        ? startsWith(0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a)
        : file.type === 'image/webp'
          ? ascii(0, 4) === 'RIFF' && ascii(8, 4) === 'WEBP'
          : file.type === 'image/gif'
            ? ascii(0, 6) === 'GIF87a' || ascii(0, 6) === 'GIF89a'
            : false;

    return matches ? { valid: true } : { valid: false, message: 'محتوای فایل با فرمت اعلام‌شده مطابقت ندارد' };
  } catch {
    return { valid: false, message: 'خواندن محتوای تصویر ناموفق بود' };
  }
}

export function isAllowedVercelBlobUrl(value: string): boolean {
  try {
    const url = new URL(value);
    if (url.protocol !== 'https:') return false;
    const hostname = url.hostname.toLowerCase();
    const configuredHost = process.env.BLOB_PUBLIC_HOST?.toLowerCase().trim();
    return hostname.endsWith('.public.blob.vercel-storage.com')
      || hostname === 'public.blob.vercel-storage.com'
      || Boolean(configuredHost && hostname === configuredHost);
  } catch {
    return false;
  }
}

export function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .replace(/\.(php|exe|sh|js|html|svg)$/i, '');
}


/**
 * Extract the client IP behind the hosting reverse proxy.
 * x-real-ip is preferred; if unavailable, the last X-Forwarded-For hop is used
 * (the common proxy convention is to append the address observed by the proxy).
 */
export function getClientIp(request: Request): string {
  const realIp = request.headers.get('x-real-ip')?.trim();
  if (realIp && realIp.length <= 64 && !/[\s,]/.test(realIp)) return realIp;
  const forwarded = request.headers.get('x-forwarded-for');
  const lastHop = forwarded?.split(',').map((value) => value.trim()).filter(Boolean).at(-1);
  if (lastHop && lastHop.length <= 64 && !/[\s,]/.test(lastHop)) return lastHop;
  return 'unknown';
}
