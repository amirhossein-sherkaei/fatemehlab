'use client';

import dynamic from 'next/dynamic';

// بارگذاری بارکد فقط در سمت کلاینت برای جلوگیری از کرش SSR
const Barcode = dynamic(() => import('react-barcode'), { ssr: false });
import { formatToman } from '@/lib/currency';
import { CheckCircle2 } from 'lucide-react';

export default function InvoiceTemplate({ order, items, isAdmin = false }: { order: any; items: any[]; isAdmin?: boolean }) {
  const orderDate = new Date(order.createdAt).toLocaleDateString('fa-IR');
  
  return (
    <div id="print-area" className="bg-white p-8 md:p-12 max-w-4xl mx-auto text-[#28242b] border border-gray-100 shadow-sm print:shadow-none print:border-none print:p-0">
      
      {/* هدر فاکتور */}
      <div className="flex justify-between items-start border-b-2 border-[#c61d70]/20 pb-6 mb-6">
        <div>
          <h1 className="text-2xl font-black text-[#c61d70] mb-2">فاطمه بیوتی لند</h1>
          <p className="text-xs text-gray-500">فروشگاه محصولات آرایشی و بهداشتی</p>
          <p className="text-xs text-gray-500 mt-1">تلفن: ۰۹۹۰۵۳۱۶۳۲۷</p>
          <p className="text-xs text-gray-500">آدرس: تهران</p>
        </div>
        <div className="text-left">
          <div className="inline-block bg-[#fff0f7] border border-[#f2d7e5] rounded-lg px-4 py-2 text-center">
            <p className="text-[10px] text-[#c61d70] font-bold mb-1">{isAdmin ? 'لیبل پستی / فاکتور' : 'فاکتور رسمی فروش'}</p>
            <p className="text-lg font-black font-mono" dir="ltr">{order.trackingCode}</p>
          </div>
          <p className="text-xs text-gray-500 mt-2 text-right">تاریخ صدور: {orderDate}</p>
          <p className="text-xs text-gray-500 text-right">وضعیت پرداخت: <span className="font-bold text-emerald-600">پرداخت شده</span></p>
        </div>
      </div>

      {/* اطلاعات مشتری */}
      <div className="grid grid-cols-2 gap-8 mb-8">
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
          <h2 className="text-sm font-bold mb-3 border-b border-gray-200 pb-2">اطلاعات خریدار</h2>
          <p className="text-xs mb-1"><span className="text-gray-500 w-16 inline-block">نام:</span> <span className="font-bold">{order.firstName} {order.lastName}</span></p>
          <p className="text-xs mb-1"><span className="text-gray-500 w-16 inline-block">تلفن:</span> <span className="font-mono" dir="ltr">{order.phone}</span></p>
        </div>
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
          <h2 className="text-sm font-bold mb-3 border-b border-gray-200 pb-2">اطلاعات ارسال</h2>
          <p className="text-xs mb-1"><span className="text-gray-500 w-16 inline-block">استان/شهر:</span> <span className="font-bold">{order.city}</span></p>
          <p className="text-xs mb-1"><span className="text-gray-500 w-16 inline-block">کد پستی:</span> <span className="font-mono" dir="ltr">{order.postalCode}</span></p>
          <p className="text-xs leading-relaxed mt-2"><span className="text-gray-500 block mb-1">آدرس:</span> {order.address}</p>
        </div>
      </div>

      {/* جدول محصولات */}
      <table className="w-full text-right mb-8">
        <thead>
          <tr className="bg-[#28242b] text-white text-xs">
            <th className="py-3 px-4 rounded-r-xl font-medium">ردیف</th>
            <th className="py-3 px-4 font-medium">شرح کالا</th>
            <th className="py-3 px-4 font-medium text-center">تعداد</th>
            <th className="py-3 px-4 font-medium text-left">قیمت واحد</th>
            <th className="py-3 px-4 rounded-l-xl font-medium text-left">مبلغ کل</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {items.map((item, index) => (
            <tr key={item.id} className="text-xs hover:bg-gray-50">
              <td className="py-3 px-4 text-gray-500">{(index + 1).toLocaleString('fa-IR')}</td>
              <td className="py-3 px-4 font-bold">{item.productName}</td>
              <td className="py-3 px-4 text-center font-bold">{item.quantity.toLocaleString('fa-IR')}</td>
              <td className="py-3 px-4 text-left">{formatToman(item.price)}</td>
              <td className="py-3 px-4 text-left font-bold">{formatToman(item.price * item.quantity)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* اطلاعات مالی */}
      <div className="flex justify-between items-end border-t-2 border-gray-200 pt-6">
        <div className="w-1/2">
          {order.notes && (
            <div className="bg-amber-50 rounded-lg p-3 border border-amber-100 text-xs">
              <span className="font-bold text-amber-800 block mb-1">یادداشت:</span>
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
          <div className="flex justify-between text-base font-black text-[#c61d70] border-t border-gray-200 pt-2 mt-2">
            <span>مبلغ نهایی پرداخت شده:</span>
            <span>{formatToman(order.totalAmount)}</span>
          </div>
        </div>
      </div>

      {/* بارکد و مهر */}
      <div className="mt-12 pt-6 border-t border-dashed border-gray-300 flex justify-between items-end">
        <div className="text-center">
          <p className="text-[10px] text-gray-500 mb-2">کد رهگیری پستی</p>
          <Barcode value={order.trackingCode} width={1.5} height={50} fontSize={12} background="#ffffff" />
        </div>
        <div className="text-center opacity-70">
          <p className="text-[10px] text-gray-500 mb-2">مهر و امضای فروشنده</p>
          <div className="w-24 h-24 border-2 border-[#c61d70] border-dashed rounded-full flex items-center justify-center transform -rotate-12">
             <span className="text-[10px] font-black text-[#c61d70] leading-tight text-center">فاطمه<br/>بیوتی لند</span>
          </div>
        </div>
      </div>
    </div>
  );
}