'use client';

import dynamic from 'next/dynamic';
import { formatToman } from '@/lib/currency';
import { AlertCircle, CheckCircle2, XCircle } from 'lucide-react';

// بارکد فقط در سمت کلاینت بارگذاری می‌شود تا SSR با react-barcode دچار خطا نشود.
const Barcode = dynamic(() => import('react-barcode'), { ssr: false });

const SETTLED_STATUSES = ['paid', 'processing', 'shipped', 'delivered'];

export default function InvoiceTemplate({ order, items, isAdmin = false }: { order: any; items: any[]; isAdmin?: boolean }) {
  const orderDate = new Date(order.createdAt).toLocaleDateString('fa-IR');
  const isSettled = SETTLED_STATUSES.includes(order.status);
  const isPending = order.status === 'pending';
  const isCancelled = order.status === 'cancelled';
  const isZeroAmountOrder = isSettled && Number(order.totalAmount) === 0;

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
      <div className="mb-6 flex items-start justify-between border-b-2 border-[#c61d70]/20 pb-6">
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

      {isSettled && (
        <div className="mb-7 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-emerald-800 print:bg-white">
          <CheckCircle2 size={18} />
          <p className="text-xs font-bold">{isZeroAmountOrder ? 'این سفارش به دلیل صفر بودن مبلغ نهایی، نیازمند پرداخت آنلاین نبوده است.' : 'پرداخت این سفارش با تأیید سرور و درگاه ثبت شده است.'}</p>
        </div>
      )}

      <div className="mb-8 grid grid-cols-2 gap-8">
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

      <table className="mb-8 w-full text-right">
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

      <div className="flex items-end justify-between border-t-2 border-gray-200 pt-6">
        <div className="w-1/2">
          {order.notes && (
            <div className="rounded-lg border border-amber-100 bg-amber-50 p-3 text-xs">
              <span className="mb-1 block font-bold text-amber-800">یادداشت:</span>
              <span className="text-amber-700">{order.notes}</span>
            </div>
          )}
        </div>
        <div className="w-1/2 max-w-xs space-y-2 text-xs">
          <div className="flex justify-between text-gray-500">
            <span>جمع کل کالاها:</span>
            <span>{formatToman(order.totalAmount + order.discountAmount)}</span>
          </div>
          {order.discountAmount > 0 && (
            <div className="flex justify-between text-rose-500">
              <span>تخفیف {order.couponCode ? `(${order.couponCode})` : ''}:</span>
              <span>{formatToman(order.discountAmount)}</span>
            </div>
          )}
          <div className="mt-2 flex justify-between border-t border-gray-200 pt-2 text-base font-black text-[#c61d70]">
            <span>{isSettled ? 'مبلغ نهایی سفارش:' : 'مبلغ قابل پرداخت:'}</span>
            <span>{formatToman(order.totalAmount)}</span>
          </div>
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
