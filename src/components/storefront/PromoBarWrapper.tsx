import { db } from '@/lib/db';
import { siteSettings } from '@/db/schema';
import PromoBar from './PromoBar';

export default async function PromoBarWrapper() {
  try {
    const settings = await db.select().from(siteSettings);
    const textSetting = settings.find(s => s.key === 'promoBarText');
    const expiresSetting = settings.find(s => s.key === 'promoBarExpiresAt');

    const promoText = textSetting?.value as string | null;
    const promoExpiresAt = expiresSetting?.value as string | null;

    if (!promoText) return null;

    return <PromoBar text={promoText} expiresAt={promoExpiresAt} />;
  } catch (error) {
    // اگر دیتابیس در دسترس نبود (مثلاً در زمان build)، نوار نمایش داده نمی‌شود
    return null;
  }
}