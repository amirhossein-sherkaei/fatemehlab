'use client';

import dynamic from 'next/dynamic';
import { formatToman } from '@/lib/currency';
import { AlertCircle, CheckCircle2, XCircle } from 'lucide-react';

// بارکد فقط در سمت کلاینت بارگذاری می‌شود تا SSR با react-barcode دچار خطا نشود.
const Barcode = dynamic(() => import('react-barcode'), { ssr: false });

const SETTLED_STATUSES = ['paid', 'processing', 'shipped', 'delivered'];

export default function InvoiceTemplate({ order, items, isAdmin = false, refund = null }: { order: any; items: any[]; isAdmin?: boolean; refund?: { reference: string; reason: string | null; amount: number; createdAt: Date | string } | null }) {
  const orderDate = new Date(order.createdAt).toLocaleDateString('fa-IR');
  const isSettled = SETTLED_STATUSES.includes(order.status);
  const isPending = order.status === 'pending';
  const isCancelled = order.status === 'cancelled';
  const isZeroAmountOrder = isSettled && Number(order.totalAmount) === 0;
  const totalDiscount = Math.max(0, Number(order.discountAmount) || 0);
  const pointsDiscount = Math.min(totalDiscount, Math.max(0, Number(order.usedPoints) || 0) * 10000);
  const couponDiscount = Math.max(0, totalDiscount - pointsDiscount);
  const itemSubtotal = items.reduce((sum, item) => {
    const price = Number(item.price) || 0;
    const quantity = Number(item.quantity) || 0;
    return sum + price * quantity;
  }, 0);
  const safeSubtotal = Number.isSafeInteger(itemSubtotal) ? itemSubtotal : Number(order.totalAmount) + totalDiscount;

  const documentTitle = isSettled ? 'فاکتور فروش' : isPending ? 'پیش‌فاکتور' : 'سند سفارش';
  const paymentLabel = isZeroAmountOrder
    ? 'بدون نیاز به پرداخت آنلاین'
    : isSettled
      ? 'پرداخت تأیید شده'
      : isPending
        ? 'در انتظار پرداخت'
        : isCancelled
          ? 'سفارش لغو شده'
          : 'وضعیت مالی نامشخص';

  return (
    <div id="print-area" className="mx-auto max-w-4xl border border-gray-100 bg-white p-8 text-[#28242b] shadow-sm print:border-none print:p-0 print:shadow-none md:p-12">
      <div className="mb-6 flex flex-col gap-4 border-b-2 border-[#c61d70]/20 pb-6 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="mb-2 text-2xl font-black text-[#c61d70]">فاطمه بیوتی لند</h1>
          <p className="text-xs text-gray-500">فروشگاه محصولات آرایشی و بهداشتی</p>
          <p className="mt-1 text-xs text-gray-500">تلفن: ۰۹۹۰۵۳۱۶۳۲۷</p>
          <p className="text-xs text-gray-500">آدرس: تهران</p>
        </div>
        <div className="text-left">
          <div className="inline-block rounded-lg border border-[#f2d7e5] bg-[#fff0f7] px-4 py-2 text-center">
            <p className="mb-1 text-[10px] font-bold text-[#c61d70]">{isAdmin ? `نسخه مدیریتی · ${documentTitle}` : documentTitle}</p>
            <p className="font-mono text-lg font-black" dir="ltr">{order.trackingCode}</p>
          </div>
          <p className="mt-2 text-right text-xs text-gray-500">تاریخ ثبت: {orderDate}</p>
          <p className="mt-1 text-right text-xs text-gray-600">
            وضعیت پرداخت: <span className={`font-bold ${isSettled ? 'text-emerald-700' : isPending ? 'text-amber-700' : 'text-rose-700'}`}>{paymentLabel}</span>
          </p>
          {order.paymentRefId && isSettled && (
            <p className="mt-1 text-right text-[10px] text-gray-500">شناسه مرجع: <span className="font-mono" dir="ltr">{order.paymentRefId}</span></p>
          )}
        </div>
      </div>

      {isPending && (
        <div className="mb-7 flex items-start gap-3 rounded-xl border-2 border-amber-300 bg-amber-50 p-4 text-amber-900 print:border-2 print:bg-white">
          <AlertCircle size={22} className="mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-black">پیش‌فاکتور — پرداخت انجام نشده است</p>
            <p className="mt-1 text-xs leading-6">این سند رسید پرداخت یا فاکتور نهایی نیست. سفارش تا زمان تأیید تراکنش توسط درگاه، پرداخت‌شده محسوب نمی‌شود.</p>
          </div>
        </div>
      )}

      {isCancelled && (
        <div className="mb-7 flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-rose-800 print:bg-white">
          <XCircle size={22} className="mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-black">این سفارش لغو شده است</p>
            <p className="mt-1 text-xs leading-6">این سند، تأییدیه پرداخت یا ارسال سفارش نیست. وضعیت هرگونه بازپرداخت باید جداگانه از سوابق مالی فروشگاه بررسی شود.</p>
          </div>
        </div>
      )}
      {isCancelled && refund && (
        <div className="mb-7 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-900 print:bg-white">
          <p className="text-sm font-black">بازپرداخت دستی در سوابق فروشگاه ثبت شده است</p>
          <div className="mt-2 grid gap-2 text-xs sm:grid-cols-2">
            <p>مبلغ ثبت‌شده: <strong>{formatToman(refund.amount)}</strong></p>
            <p>شناسه بازپرداخت: <strong className="font-mono" dir="ltr">{refund.reference}</strong></p>
            <p>تاریخ ثبت: <strong>{new Date(refund.createdAt).toLocaleDateString('fa-IR')}</strong></p>
            {isAdmin && refund.reason && <p className="sm:col-span-2">علت ثبت: <strong>{refund.reason}</strong></p>}
          </div>
          <p className="mt-2 text-[10px] leading-5">این سند، ثبت داخلی بازپرداخت را نشان می‌دهد؛ تأیید نهایی انتقال وجه باید با سوابق درگاه تطبیق داده شود.</p>
        </div>
      )}

      {isSettled && (
        <div className="mb-7 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-emerald-800 print:bg-white">
          <CheckCircle2 size={18} />
          <p className="text-xs font-bold">{isZeroAmountOrder ? 'این سفارش به دلیل صفر بودن مبلغ نهایی، نیازمند پرداخت آنلاین نبوده است.' : 'پرداخت این سفارش با تأیید سرور و درگاه ثبت شده است.'}</p>
        </div>
      )}

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-8">
        <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
          <h2 className="mb-3 border-b border-gray-200 pb-2 text-sm font-bold">اطلاعات خریدار</h2>
          <p className="mb-1 text-xs"><span className="inline-block w-16 text-gray-500">نام:</span> <span className="font-bold">{order.firstName} {order.lastName}</span></p>
          <p className="mb-1 text-xs"><span className="inline-block w-16 text-gray-500">تلفن:</span> <span className="font-mono" dir="ltr">{order.phone}</span></p>
        </div>
        <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
          <h2 className="mb-3 border-b border-gray-200 pb-2 text-sm font-bold">اطلاعات ارسال</h2>
          <p className="mb-1 text-xs"><span className="inline-block w-16 text-gray-500">استان/شهر:</span> <span className="font-bold">{order.city}</span></p>
          <p className="mb-1 text-xs"><span className="inline-block w-16 text-gray-500">کد پستی:</span> <span className="font-mono" dir="ltr">{order.postalCode}</span></p>
          <p className="mt-2 text-xs leading-relaxed"><span className="mb-1 block text-gray-500">آدرس:</span> {order.address}</p>
        </div>
      </div>

      <div className="mb-8 overflow-x-auto print:overflow-visible">
      <table className="w-full min-w-[620px] text-right print:min-w-0">
        <thead>
          <tr className="bg-[#28242b] text-xs text-white">
            <th className="rounded-r-xl px-4 py-3 font-medium">ردیف</th>
            <th className="px-4 py-3 font-medium">شرح کالا</th>
            <th className="px-4 py-3 text-center font-medium">تعداد</th>
            <th className="px-4 py-3 text-left font-medium">قیمت واحد</th>
            <th className="rounded-l-xl px-4 py-3 text-left font-medium">مبلغ کل</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {items.map((item, index) => (
            <tr key={item.id} className="text-xs">
              <td className="px-4 py-3 text-gray-500">{(index + 1).toLocaleString('fa-IR')}</td>
              <td className="px-4 py-3 font-bold">{item.productName}</td>
              <td className="px-4 py-3 text-center font-bold">{item.quantity.toLocaleString('fa-IR')}</td>
              <td className="px-4 py-3 text-left">{formatToman(item.price)}</td>
              <td className="px-4 py-3 text-left font-bold">{formatToman(item.price * item.quantity)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>

      <div className="flex flex-col gap-6 border-t-2 border-gray-200 pt-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="w-full sm:flex-1">
          {order.notes && (
            <div className="rounded-lg border border-amber-100 bg-amber-50 p-3 text-xs">
              <span className="mb-1 block font-bold text-amber-800">یادداشت:</span>
              <span className="text-amber-700">{order.notes}</span>
            </div>
          )}
        </div>
        <div className="w-full space-y-2 text-xs sm:max-w-sm">
          <div className="flex justify-between gap-4 text-gray-500">
            <span>جمع کل کالاها:</span>
            <span className="font-bold">{formatToman(safeSubtotal)}</span>
          </div>
          {couponDiscount > 0 && (
            <div className="flex justify-between gap-4 text-rose-600">
              <span>تخفیف کد {order.couponCode ? `(${order.couponCode})` : 'تخفیف'}:</span>
              <span>{formatToman(couponDiscount)}</span>
            </div>
          )}
          {pointsDiscount > 0 && (
            <div className="flex justify-between gap-4 text-rose-600">
              <span>تخفیف امتیاز باشگاه ({Number(order.usedPoints).toLocaleString('fa-IR')} امتیاز):</span>
              <span>{formatToman(pointsDiscount)}</span>
            </div>
          )}
          <div className="mt-2 flex justify-between gap-4 border-t border-gray-200 pt-3 text-base font-black text-[#c61d70]">
            <span>{isSettled ? 'مبلغ نهایی سفارش:' : isPending ? 'مبلغ قابل پرداخت:' : 'مبلغ سفارش هنگام ثبت:'}</span>
            <span className="whitespace-nowrap">{formatToman(order.totalAmount)}</span>
          </div>
          <p className="rounded-lg bg-slate-50 px-3 py-2 text-[10px] leading-5 text-slate-600">هزینه ارسال در این سند محاسبه نشده و در مبلغ فوق لحاظ نیست.</p>
          {!isSettled && <p className="rounded-lg bg-amber-50 px-3 py-2 text-[10px] leading-5 text-amber-800">مبالغ این پیش‌فاکتور تا زمان تأیید پرداخت قطعی نیستند.</p>}
        </div>
      </div>

      <div className="mt-12 flex items-end justify-between border-t border-dashed border-gray-300 pt-6">
        <div className="text-center">
          <p className="mb-2 text-[10px] text-gray-500">کد رهگیری سفارش</p>
          <Barcode value={order.trackingCode} width={1.5} height={50} fontSize={12} background="#ffffff" />
        </div>
        <div className="text-center opacity-70">
          <p className="mb-2 text-[10px] text-gray-500">مهر و امضای فروشنده</p>
          <div className="flex h-24 w-24 -rotate-12 items-center justify-center rounded-full border-2 border-dashed border-[#c61d70]">
            <span className="text-center text-[10px] font-black leading-tight text-[#c61d70]">فاطمه<br />بیوتی لند</span>
          </div>
        </div>
      </div>
    </div>
  );
}
