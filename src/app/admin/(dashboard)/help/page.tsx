import { ShoppingBag, Package, MessageSquare, Bell, BookOpen, ShieldCheck, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export const instant = false;

const helpTopics = [
  {
    icon: ShoppingBag,
    title: 'مدیریت محصولات',
    desc: 'نحوه افزودن، ویرایش و حذف محصولات فروشگاه',
    faqs: [
      { q: 'چطور محصول جدید اضافه کنم؟', a: 'به بخش محصولات بروید، روی دکمه «محصول جدید» کلیک کنید. نام، قیمت (به تومان)، موجودی و تصاویر را وارد کنید و در نهایت وضعیت را روی «منتشر شده» بگذارید.' },
      { q: 'چرا قیمت محصول در سایت نمایش داده نمی‌شود؟', a: 'اگر قیمت محصول صفر باشد، سیستم آن را به عنوان «قیمت ثبت نشده» در نظر می‌گیرد و اجازه خرید نمی‌دهد. حتماً قیمت را در پنل وارد کنید.' },
      { q: 'چطور یک محصول را ناموجود کنم؟', a: 'کافیست موجودی انبار را در صفحه ویرایش محصول به صفر برسانید. سیستم به صورت خودکار برچسب «ناموجود» را روی محصول نمایش می‌دهد.' }
    ]
  },
  {
    icon: Package,
    title: 'مدیریت سفارشات',
    desc: 'بررسی، تغییر وضعیت و حذف سفارشات مشتریان',
    faqs: [
      { q: 'وضعیت‌های سفارش یعنی چه؟', a: '«در انتظار» یعنی هنوز پرداخت نشده. «در حال پردازش» یعنی پول واریز شده و در حال آماده‌سازی است. «ارسال شده» یعنی تحویل پست شده و «تحویل شده» یعنی به دست مشتری رسیده است.' },
      { q: 'چطور سفارش را حذف کنم؟', a: 'در جدول سفارشات، روی آیکون سطل زباله (قرمز) کلیک کنید. این عمل غیرقابل بازگشت است و تمام اطلاعات سفارش و محصولات آن پاک می‌شود.' },
      { q: 'آیا مشتری از تغییر وضعیت باخبر می‌شود؟', a: 'بله، با اتصال سیستم پیامک، وقتی وضعیت را به «ارسال شده» تغییر دهید، یک پیامک حاوی کد رهگیری برای مشتری ارسال می‌شود.' }
    ]
  },
  {
    icon: MessageSquare,
    title: 'نظرات کاربران',
    desc: 'تایید، رد و پاسخ به نظرات ثبت شده',
    faqs: [
      { q: 'چرا نظرات کاربران در سایت دیده نمی‌شوند؟', a: 'برای حفظ کیفیت، تمام نظرات ابتدا در وضعیت «در انتظار» ثبت می‌شوند. شما باید از بخش نظرات آن‌ها را تایید کنید تا در سایت نمایش داده شوند.' },
      { q: 'چطور به یک نظر پاسخ دهم؟', a: 'در حال حاضر امکان پاسخ متنی از طریق پنل ادمین وجود دارد. در بخش نظرات، روی گزینه پاسخ کلیک کرده و متن خود را ارسال کنید تا زیر نظر کاربر نمایش داده شود.' }
    ]
  },
  {
    icon: Bell,
    title: 'سیستم اعلان‌ها',
    desc: 'دریافت نوتیفیکیشن برای سفارشات و نظرات جدید',
    faqs: [
      { q: 'چطور اعلان‌ها را فعال کنم؟', a: 'در سایدبار یا هدر موبایل، روی دکمه صورتی «فعال‌سازی اعلان» کلیک کنید. مرورگر از شما اجازه می‌خواهد که باید Allow را بزنید تا نوتیفیکیشن‌ها روی دسکتاپ یا موبایل شما نمایش داده شوند.' },
      { q: 'اعلان‌ها برای چه مواردی ارسال می‌شوند؟', a: 'هر زمان سفارش جدیدی ثبت شود یا نظر جدیدی در انتظار تایید باشد، سیستم هر ۳۰ ثانیه یکبار چک می‌کند و به شما اعلان می‌دهد.' }
    ]
  }
];

export default function AdminHelpPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-[#28242b] md:text-2xl">مرکز راهنمای مدیران</h1>
          <p className="mt-1 text-xs text-[#77717b] md:text-sm">هر آنچه برای مدیریت فروشگاه نیاز دارید اینجاست.</p>
        </div>
        <Link href="/admin" className="hidden items-center gap-1.5 rounded-xl bg-white border border-[#e9e5eb] px-4 py-2 text-xs font-bold text-[#28242b] shadow-sm hover:bg-[#f8f7fa] sm:flex">
          <ArrowLeft size={14} /> بازگشت به داشبورد
        </Link>
      </div>

      <div className="grid gap-5">
        {helpTopics.map((topic, i) => (
          <div key={i} className="overflow-hidden rounded-3xl border border-[#e9e5eb] bg-white shadow-sm">
            <div className="flex items-center gap-4 border-b border-[#e9e5eb] bg-[#fafafc] p-5">
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#fff0f7] text-[#c61d70] shadow-sm">
                <topic.icon size={24} />
              </div>
              <div>
                <h2 className="text-base font-black text-[#28242b]">{topic.title}</h2>
                <p className="text-xs text-[#77717b]">{topic.desc}</p>
              </div>
            </div>
            <div className="divide-y divide-[#e9e5eb]">
              {topic.faqs.map((faq, j) => (
                <details key={j} className="group">
                  <summary className="flex cursor-pointer list-none items-center justify-between p-4 text-sm font-bold text-[#28242b] transition-colors hover:bg-[#fafafc]">
                    {faq.q}
                    <span className="text-[#918a95] transition-transform duration-300 group-open:rotate-180">▼</span>
                  </summary>
                  <div className="bg-[#f8f7fa] px-4 py-3 text-xs leading-relaxed text-[#5a535e] border-t border-[#e9e5eb]">
                    {faq.a}
                  </div>
                </details>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}