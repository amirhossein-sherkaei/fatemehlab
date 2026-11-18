import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { siteSettings } from '@/db/schema';
import { verifyAdmin } from '@/lib/auth';
import { rejectCsrf, validateOrigin } from '@/lib/security';
import defaultBanners from '@/data/home-banners.json';

type BannerSlide = {
  id: string;
  title: string;
  image: string;
  mobileImage?: string;
  alt: string;
  href: string;
  active: boolean;
  order: number;
  objectPosition: string;
};

type BannerConfig = {
  slides: BannerSlide[];
  autoPlay: boolean;
  intervalMs: number;
};

const SETTING_KEY = 'homeBannerConfig';
const DEFAULT_CONFIG: BannerConfig = {
  slides: (defaultBanners as Array<{ id: string; image: string; mobileImage?: string; alt: string; href?: string }>).map((item, index) => ({
    id: item.id,
    title: `بنر ${index + 1}`,
    image: item.image,
    ...(item.mobileImage ? { mobileImage: item.mobileImage } : {}),
    alt: item.alt || `بنر تبلیغاتی ${index + 1} فاطمه بیوتی لند`,
    href: item.href || '/products',
    active: true,
    order: index,
    objectPosition: 'center center',
  })),
  autoPlay: true,
  intervalMs: 5600,
};

function isSafeImageSource(value: unknown): value is string {
  if (typeof value !== 'string' || value.length > 2048) return false;
  if (value.startsWith('/banners/') && !value.startsWith('//') && !value.includes('\\')) return true;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && (
      url.hostname.endsWith('.public.blob.vercel-storage.com')
    );
  } catch {
    return false;
  }
}

function isSafeHref(value: unknown): value is string {
  if (typeof value !== 'string' || value.length > 500 || value.includes('\\')) return false;
  if (value.startsWith('/') && !value.startsWith('//')) return true;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && !url.username && !url.password;
  } catch {
    return false;
  }
}

function cleanConfig(input: unknown): BannerConfig | null {
  if (!input || typeof input !== 'object') return null;
  const value = input as Record<string, unknown>;
  if (!Array.isArray(value.slides) || value.slides.length > 12) return null;

  const ids = new Set<string>();
  const slides: BannerSlide[] = [];
  for (let index = 0; index < value.slides.length; index += 1) {
    const raw = value.slides[index] as Record<string, unknown>;
    if (!raw || typeof raw !== 'object') return null;
    const id = typeof raw.id === 'string' ? raw.id.trim() : '';
    const image = raw.image;
    const mobileImage = raw.mobileImage;
    const alt = typeof raw.alt === 'string' ? raw.alt.trim() : '';
    const href = raw.href;
    if (!/^[a-zA-Z0-9_-]{1,80}$/.test(id) || ids.has(id)) return null;
    if (!isSafeImageSource(image)) return null;
    if (mobileImage !== undefined && mobileImage !== '' && !isSafeImageSource(mobileImage)) return null;
    if (!alt || alt.length > 160 || !isSafeHref(href)) return null;
    ids.add(id);

    const allowedPositions = ['center center', 'center top', 'center bottom', 'left center', 'right center'];
    const objectPosition = typeof raw.objectPosition === 'string' && allowedPositions.includes(raw.objectPosition)
      ? raw.objectPosition
      : 'center center';
    slides.push({
      id,
      title: typeof raw.title === 'string' ? raw.title.trim().slice(0, 100) : `بنر ${index + 1}`,
      image,
      ...(typeof mobileImage === 'string' && mobileImage ? { mobileImage } : {}),
      alt,
      href,
      active: raw.active !== false,
      order: Number.isInteger(raw.order) ? Math.max(0, Math.min(99, Number(raw.order))) : index,
      objectPosition,
    });
  }

  slides.sort((a, b) => a.order - b.order);
  const rawInterval = Number(value.intervalMs);
  const intervalMs = Number.isFinite(rawInterval) ? Math.max(3500, Math.min(15000, Math.round(rawInterval))) : 5600;
  return { slides, autoPlay: value.autoPlay !== false, intervalMs };
}

export async function GET() {
  try {
    await verifyAdmin();
    const [row] = await db.select({ value: siteSettings.value })
      .from(siteSettings)
      .where(eq(siteSettings.key, SETTING_KEY))
      .limit(1);
    const saved = row?.value ? cleanConfig(row.value) : null;
    return NextResponse.json({ success: true, config: saved ?? DEFAULT_CONFIG, usingDefaults: !saved });
  } catch (error) {
    if (error instanceof Error && ['UNAUTHORIZED', 'FORBIDDEN'].includes(error.message)) {
      return NextResponse.json({ success: false, message: 'دسترسی غیرمجاز' }, { status: 401 });
    }
    console.error('[ADMIN_BANNERS_GET]', error);
    return NextResponse.json({ success: false, message: 'دریافت تنظیمات اسلایدر انجام نشد.' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const origin = validateOrigin(req);
  if (!origin.valid) return rejectCsrf(req);

  try {
    await verifyAdmin();
    const body = await req.json();
    const config = cleanConfig(body);
    if (!config) {
      return NextResponse.json({ success: false, message: 'اطلاعات بنرها نامعتبر است. تصویر، متن جایگزین و لینک هر بنر را بررسی کن.' }, { status: 400 });
    }

    await db.insert(siteSettings)
      .values({ key: SETTING_KEY, value: config })
      .onConflictDoUpdate({
        target: siteSettings.key,
        set: { value: config, updatedAt: new Date() },
      });

    revalidatePath('/');
    revalidatePath('/admin/banners');
    return NextResponse.json({ success: true, config });
  } catch (error) {
    if (error instanceof Error && ['UNAUTHORIZED', 'FORBIDDEN'].includes(error.message)) {
      return NextResponse.json({ success: false, message: 'دسترسی غیرمجاز' }, { status: 401 });
    }
    console.error('[ADMIN_BANNERS_PUT]', error);
    return NextResponse.json({ success: false, message: 'ذخیره تنظیمات اسلایدر انجام نشد.' }, { status: 500 });
  }
}