import { db } from '@/lib/db';
import { siteSettings } from '@/db/schema';
import PromoBar from './PromoBar';

function readText(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value.trim() : fallback;
}

function normalizePromoLink(value: unknown): string {
  const candidate = readText(value, '/products');
  if (!candidate) return '/products';
  if (candidate.startsWith('/') && !candidate.startsWith('//') && !candidate.includes('\\')) {
    return candidate;
  }
  try {
    const parsed = new URL(candidate);
    if (parsed.protocol === 'https:') return parsed.toString();
  } catch {
    // Invalid or unsafe URL falls back to the product catalogue.
  }
  return '/products';
}

export default async function PromoBarWrapper() {
  try {
    const settings = await db.select().from(siteSettings);
    const values = new Map<string, unknown>();
    for (const setting of settings) values.set(setting.key, setting.value);

    const promoText = readText(values.get('promoBarText'));
    const activeValue = values.get('promoBarActive');
    const isActive = activeValue === undefined ? true : activeValue === true || activeValue === 'true';
    if (!promoText || !isActive) return null;

    const label = readText(values.get('promoBarLabel'), 'پیشنهاد ویژه') || 'پیشنهاد ویژه';
    const link = normalizePromoLink(values.get('promoBarLink'));
    const rawExpiry = values.get('promoBarExpiresAt');
    const expiresAt = typeof rawExpiry === 'string' && rawExpiry.trim() ? rawExpiry : null;

    return <PromoBar text={promoText} label={label} link={link} expiresAt={expiresAt} />;
  } catch {
    return null;
  }
}
