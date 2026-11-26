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

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

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

function toFaDigits(value: number, minimumDigits = 2): string {
  return new Intl.NumberFormat('fa-IR', {
    minimumIntegerDigits: minimumDigits,
    useGrouping: false,
  }).format(value);
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
      // Keep the campaign available when browser storage is restricted.
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

    const updateCountdown = () => {
      const remaining = getTimeLeft(expiry);
      setTimeLeft(remaining);
      if (!remaining) {
        setIsVisible(false);
        return false;
      }
      return true;
    };

    if (!updateCountdown()) return;
    const timer = window.setInterval(() => {
      if (!updateCountdown()) window.clearInterval(timer);
    }, 1000);
    return () => window.clearInterval(timer);
  }, [campaignKey, expiresAt]);

  const handleDismiss = () => {
    setIsVisible(false);
    try {
      window.localStorage.setItem('fbl-promo-dismissed-campaign', campaignKey);
    } catch {
      // The close action still works for this page view.
    }
  };

  if (!isVisible || !text.trim()) return null;

  return (
    <aside
      className="fbl-campaign-ribbon"
      role="region"
      aria-label="پیشنهاد ویژه فاطمه بیوتی لند"
      data-campaign-banner
    >
      <span className="fbl-campaign-ribbon__glow" aria-hidden="true" />
      <span className="fbl-campaign-ribbon__sheen" aria-hidden="true" />

      <div className="container-custom fbl-campaign-ribbon__inner">
        <Link
          href={link}
          className="fbl-campaign-ribbon__link"
          aria-label={`${label}: ${text}`}
        >
          <span className="fbl-campaign-ribbon__seal" aria-hidden="true">
            <span className="fbl-campaign-ribbon__seal-ring">
              <Sparkles size={17} strokeWidth={1.7} />
            </span>
          </span>

          <span className="fbl-campaign-ribbon__copy">
            <span className="fbl-campaign-ribbon__eyebrow">
              <span className="fbl-campaign-ribbon__eyebrow-dot" aria-hidden="true" />
              {label}
            </span>
            <span className="fbl-campaign-ribbon__message">{text}</span>
          </span>

          <span className="fbl-campaign-ribbon__cta">
            <span>مشاهده پیشنهاد</span>
            <ArrowUpLeft size={15} strokeWidth={2} aria-hidden="true" />
          </span>
        </Link>

        {timeLeft && (
          <div
            className="fbl-campaign-ribbon__countdown"
            aria-label="زمان باقی‌مانده تا پایان پیشنهاد"
            dir="ltr"
          >
            <Clock3 size={13} aria-hidden="true" />
            {timeLeft.days > 0 && (
              <span className="fbl-campaign-ribbon__days">
                {new Intl.NumberFormat('fa-IR').format(timeLeft.days)} روز
              </span>
            )}
            <strong>
              {toFaDigits(timeLeft.hours)}:{toFaDigits(timeLeft.minutes)}:{toFaDigits(timeLeft.seconds)}
            </strong>
          </div>
        )}

        <button
          type="button"
          onClick={handleDismiss}
          className="fbl-campaign-ribbon__close"
          aria-label="بستن نوار پیشنهاد"
          title="بستن پیشنهاد"
        >
          <X size={16} strokeWidth={1.8} aria-hidden="true" />
        </button>
      </div>
    </aside>
  );
}