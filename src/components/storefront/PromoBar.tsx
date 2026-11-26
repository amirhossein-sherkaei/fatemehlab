'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowUpLeft, Clock3, Sparkles, X } from 'lucide-react';

interface PromoBarProps {
  text: string;
  label?: string;
  expiresAt: string | null;
  link?: string;
}

type TimeLeft = { days: number; hours: number; minutes: number; seconds: number };

function getTimeLeft(expiry: number): TimeLeft | null {
  const distance = expiry - Date.now();
  if (!Number.isFinite(distance) || distance <= 0) return null;
  return {
    days: Math.floor(distance / 86_400_000),
    hours: Math.floor((distance % 86_400_000) / 3_600_000),
    minutes: Math.floor((distance % 3_600_000) / 60_000),
    seconds: Math.floor((distance % 60_000) / 1_000),
  };
}

export default function PromoBar({
  text,
  label = 'پیشنهاد ویژه',
  expiresAt,
  link = '/products',
}: PromoBarProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);
  const campaignKey = useMemo(
    () => JSON.stringify([text, label, expiresAt, link]),
    [text, label, expiresAt, link],
  );

  useEffect(() => {
    let dismissed = false;
    try {
      dismissed = window.localStorage.getItem('fbl-promo-dismissed-campaign') === campaignKey;
    } catch {
      // The announcement should still work if browser storage is unavailable.
    }

    if (dismissed) {
      setIsVisible(false);
      return;
    }

    const expiry = expiresAt ? new Date(expiresAt).getTime() : null;
    if (expiry !== null && (!Number.isFinite(expiry) || expiry <= Date.now())) {
      setIsVisible(false);
      setTimeLeft(null);
      return;
    }

    setIsVisible(true);
    if (expiry === null) {
      setTimeLeft(null);
      return;
    }

    const update = () => {
      const remaining = getTimeLeft(expiry);
      setTimeLeft(remaining);
      if (!remaining) setIsVisible(false);
    };

    update();
    const timer = window.setInterval(update, 1000);
    return () => window.clearInterval(timer);
  }, [campaignKey, expiresAt]);

  const handleDismiss = () => {
    setIsVisible(false);
    try {
      window.localStorage.setItem('fbl-promo-dismissed-campaign', campaignKey);
    } catch {
      // Dismiss for this render even when local storage is blocked.
    }
  };

  if (!isVisible || !text.trim()) return null;

  return (
    <aside className="fbl-promo-bar" role="region" aria-label="اطلاعیه و پیشنهاد ویژه فروشگاه">
      <span className="fbl-promo-bar__sheen" aria-hidden="true" />
      <div className="container-custom fbl-promo-bar__inner">
        <Link href={link} className="fbl-promo-bar__link" aria-label={`${label}: ${text}`}>
          <span className="fbl-promo-bar__mark" aria-hidden="true">
            <Sparkles size={17} strokeWidth={1.8} />
          </span>
          <span className="fbl-promo-bar__copy">
            <span className="fbl-promo-bar__label">{label}</span>
            <span className="fbl-promo-bar__text">{text}</span>
          </span>
          <span className="fbl-promo-bar__cta">
            مشاهده <ArrowUpLeft size={14} aria-hidden="true" />
          </span>
        </Link>

        {timeLeft && (
          <div className="fbl-promo-bar__countdown" aria-label="زمان باقی‌مانده تا پایان پیشنهاد" dir="ltr">
            <Clock3 size={13} aria-hidden="true" />
            {timeLeft.days > 0 && <span>{timeLeft.days}d</span>}
            <strong>
              {String(timeLeft.hours).padStart(2, '0')}:
              {String(timeLeft.minutes).padStart(2, '0')}:
              {String(timeLeft.seconds).padStart(2, '0')}
            </strong>
          </div>
        )}

        <button
          type="button"
          onClick={handleDismiss}
          className="fbl-promo-bar__close"
          aria-label="بستن اطلاعیه"
          title="بستن"
        >
          <X size={17} aria-hidden="true" />
        </button>
      </div>
    </aside>
  );
}
