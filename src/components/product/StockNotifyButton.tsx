'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Bell, X, Loader2, CheckCircle2, Smartphone, ArrowLeft, UserRound } from 'lucide-react';
import { toast } from 'sonner';

type AccountState = 'checking' | 'signed-in' | 'guest' | 'needs-phone' | 'error';

export default function StockNotifyButton({ productId }: { productId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [contact, setContact] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [accountState, setAccountState] = useState<AccountState>('checking');
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    if (!isOpen) return;
    const controller = new AbortController();
    setAccountState('checking');

    fetch('/api/account/me', { cache: 'no-store', signal: controller.signal })
      .then(async (response) => {
        if (response.status === 401 || response.status === 404) {
          setAccountState('guest');
          return;
        }
        if (!response.ok) throw new Error('account_lookup_failed');
        const data = await response.json();
        if (!data?.success || !data?.customer?.email) throw new Error('account_lookup_failed');
        setAccountState('signed-in');
      })
      .catch((error) => {
        if (error?.name !== 'AbortError') setAccountState('error');
      });

    return () => controller.abort();
  }, [isOpen, retryKey]);

  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !loading) setIsOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen, loading]);

  useEffect(() => {
    if (!isOpen) return;
    const root = document.documentElement;
    const previousHeight = root.style.getPropertyValue('--fbl-visual-viewport-height');
    const viewport = window.visualViewport;
    const syncViewportHeight = () => {
      const height = viewport?.height || window.innerHeight;
      root.style.setProperty('--fbl-visual-viewport-height', `${Math.round(height)}px`);
    };

    syncViewportHeight();
    viewport?.addEventListener('resize', syncViewportHeight);
    window.addEventListener('resize', syncViewportHeight);
    return () => {
      viewport?.removeEventListener('resize', syncViewportHeight);
      window.removeEventListener('resize', syncViewportHeight);
      if (previousHeight) root.style.setProperty('--fbl-visual-viewport-height', previousHeight);
      else root.style.removeProperty('--fbl-visual-viewport-height');
    };
  }, [isOpen]);

  const closeDialog = () => {
    if (loading) return;
    setIsOpen(false);
    setContact('');
    setSuccess(false);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (accountState === 'checking' || accountState === 'error') return;

    if (accountState === 'guest') {
      const normalized = contact.trim()
        .replace(/[۰-۹]/g, (digit) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(digit)))
        .replace(/[٠-٩]/g, (digit) => String('٠١٢٣٤٥٦٧٨٩'.indexOf(digit)));
      if (!/^09\d{9}$/.test(normalized)) {
        toast.error('شماره موبایل ۱۱ رقمی معتبر وارد کنید.');
        return;
      }
    }

    setLoading(true);
    try {
      const body: { productId: string; contact?: string } = { productId };
      if (accountState === 'guest') {
        body.contact = contact.trim()
          .replace(/[۰-۹]/g, (digit) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(digit)))
          .replace(/[٠-٩]/g, (digit) => String('٠١٢٣٤٥٦٧٨٩'.indexOf(digit)));
      }

      const response = await fetch('/api/stock-notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await response.json();

      if (!response.ok) {
        if (response.status === 409 && data.requiresPhone) {
          setAccountState('needs-phone');
          return;
        }
        toast.error(data.message || 'ثبت درخواست انجام نشد.');
        return;
      }

      setSuccess(true);
      toast.success(data.message || 'درخواست اطلاع‌رسانی ثبت شد.');
    } catch {
      toast.error('ارتباط با سرور برقرار نشد. دوباره تلاش کنید.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => { setSuccess(false); setIsOpen(true); }}
        className="w-full min-h-12 h-12 bg-[#f8f7fa] border border-[#e9e5eb] text-[#28242b] text-sm font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-white hover:border-[#c61d70] transition-all"
      >
        <Bell size={18} className="text-[#c61d70]" aria-hidden="true" />
        به من اطلاع بده (موجود شد)
      </button>

      {isOpen && (
        <div
          className="fbl-stock-notify-overlay"
          onClick={(event) => { if (event.target === event.currentTarget) closeDialog(); }}
        >
          <section
            className="fbl-stock-notify-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="fbl-stock-notify-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={closeDialog}
              disabled={loading}
              className="fbl-stock-notify-close"
              aria-label="بستن پنجره"
            >
              <X size={19} aria-hidden="true" />
            </button>

            {success ? (
              <div className="fbl-stock-notify-success" role="status" aria-live="polite">
                <span className="fbl-stock-notify-icon is-success"><CheckCircle2 size={34} /></span>
                <h3 id="fbl-stock-notify-title">درخواست شما ثبت شد</h3>
                <p>به محض موجود شدن محصول، پیامک اطلاع‌رسانی برای شمارهٔ ثبت‌شده ارسال می‌شود.</p>
                <button type="button" onClick={closeDialog} className="fbl-stock-notify-submit">
                  متوجه شدم <ArrowLeft size={16} aria-hidden="true" />
                </button>
              </div>
            ) : (
              <>
                <div className="fbl-stock-notify-heading">
                  <span className="fbl-stock-notify-icon"><Smartphone size={25} aria-hidden="true" /></span>
                  <span className="fbl-stock-notify-kicker">FATEMEH BEAUTY LAND</span>
                  <h3 id="fbl-stock-notify-title">اطلاع‌رسانی موجودی</h3>
                  <p>به محض موجود شدن محصول، به شما خبر می‌دهیم.</p>
                </div>

                {accountState === 'checking' && (
                  <div className="fbl-stock-notify-state" role="status">
                    <Loader2 size={19} className="animate-spin" />
                    در حال بررسی وضعیت حساب شما…
                  </div>
                )}

                {accountState === 'error' && (
                  <div className="fbl-stock-notify-state is-error" role="alert">
                    <p>بررسی حساب انجام نشد. برای حفظ امنیت، اطلاعات را ثبت نمی‌کنیم تا وضعیت حساب مشخص شود.</p>
                    <button type="button" onClick={() => setRetryKey((value) => value + 1)}>تلاش دوباره</button>
                  </div>
                )}

                {accountState === 'needs-phone' && (
                  <div className="fbl-stock-notify-state is-error" role="status">
                    <p>شماره‌ای در حساب یا سفارش قبلی شما پیدا نشد. شماره را فقط یک‌بار در پروفایل حساب ثبت کنید تا درخواست‌های موجودی بدون پرسیدن دوبارهٔ شماره ثبت شوند.</p>
                    <Link href="/account/profile" onClick={closeDialog} className="fbl-stock-notify-profile-link">رفتن به تکمیل پروفایل</Link>
                  </div>
                )}

                {accountState === 'signed-in' && (
                  <form onSubmit={handleSubmit} className="fbl-stock-notify-form">
                    <div className="fbl-stock-notify-account-note">
                      <UserRound size={19} aria-hidden="true" />
                      <span>شما وارد حساب هستید. شماره از پروفایل، نشانی ذخیره‌شده یا سفارش قبلی شما برداشته می‌شود؛ نیازی به واردکردن دوبارهٔ آن نیست.</span>
                    </div>
                    <button type="submit" disabled={loading} className="fbl-stock-notify-submit">
                      {loading ? <Loader2 size={17} className="animate-spin" /> : <Bell size={17} />}
                      {loading ? 'در حال ثبت درخواست…' : 'ثبت درخواست اطلاع‌رسانی'}
                    </button>
                  </form>
                )}

                {accountState === 'guest' && (
                  <form onSubmit={handleSubmit} className="fbl-stock-notify-form">
                    <label htmlFor="fbl-stock-notify-contact">شماره موبایل</label>
                    <input
                      id="fbl-stock-notify-contact"
                      type="tel"
                      inputMode="numeric"
                      autoComplete="tel-national"
                      maxLength={11}
                      value={contact}
                      onChange={(event) => setContact(event.target.value)}
                      placeholder="09123456789"
                      className="fbl-stock-notify-input"
                      dir="ltr"
                      required
                    />
                    <p className="fbl-stock-notify-hint">برای اطلاع‌رسانی به‌محض موجود شدن محصول، پیامک ارسال می‌کنیم.</p>
                    <button type="submit" disabled={loading} className="fbl-stock-notify-submit">
                      {loading ? <Loader2 size={17} className="animate-spin" /> : <Bell size={17} />}
                      {loading ? 'در حال ثبت درخواست…' : 'ثبت درخواست'}
                    </button>
                  </form>
                )}
              </>
            )}
          </section>
        </div>
      )}
    </>
  );
}
