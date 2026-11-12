import { db } from '@/lib/db';
import { siteSettings } from '@/db/schema';
import PromoBar from './PromoBar';

export default async function PromoBarWrapper() {
  try {
    const settings = await db.select().from(siteSettings);
    const textSetting = settings.find(s => s.key === 'promoBarText');
    const expiresSetting = settings.find(s => s.key === 'promoBarExpiresAt');
    const activeSetting = settings.find(s => s.key === 'promoBarActive');

    const promoText = textSetting?.value as string | null;
    const promoExpiresAt = expiresSetting?.value as string | null;
    // پیش‌فرض: اگر تنظیمی وجود نداشت، فعال در نظر گرفته می‌شود
    const isActive = activeSetting ? Boolean(activeSetting.value) : true;

    // اگر غیرفعال است یا متنی وجود ندارد، هیچ چیزی نمایش داده نشود
    if (!promoText || !isActive) return null;

    return <PromoBar text={promoText} expiresAt={promoExpiresAt} />;
  } catch (error) {
    return null;
  }
}