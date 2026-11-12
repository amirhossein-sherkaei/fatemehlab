'use client';

import { useState } from 'react';
import { 
  Search, LayoutDashboard, ShoppingBag, Package, Users, 
  MessageSquare, Settings, FileText, ChevronDown, BookOpen, 
  Sparkles, ShieldCheck, TicketPercent, Bell, Image as ImageIcon,
  CreditCard, HelpCircle, Activity
} from 'lucide-react';
import Link from 'next/link';

// ══════════ دیتای راهنما (بسیار کامل و دقیق) ══════════
const helpDatabase = [
  {
    category: 'داشبورد و تحلیل داده',
    icon: LayoutDashboard,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    faqs: [
      { q: 'نمودارهای صفحه اصلی (Recharts) چه چیزی را نشان می‌دهند؟', a: 'نمودار خطی (Area) روند درآمد ۷ روز اخیر و نمودار ستونی (Bar) تعداد سفارشات روزانه را نشان می‌دهد. با نگه داشتن موس روی نمودار، جزئیات آن روز نمایش داده می‌شود.' },
      { q: 'منظور از KPI «میانگین سبد خرید» (AOV) چیست؟', a: 'این عدد کل درآمد را بر تعداد سفارشات تقسیم می‌کند. این شاخص به شما نشان می‌دهد که هر مشتری به طور میانگین چه مبلغی را در سبد خرید خود قرار می‌دهد.' },
      { q: 'بخش «۵ محصول پرفروش» چگونه محاسبه می‌شود؟', a: 'سیستم به صورت خودکار به دیتابیس نگاه می‌کند و بر اساس مجموع تعدادی که از هر محصول فروخته شده (بدون احتساب سفارشات لغو شده)، ۵ محصول برتر را نشان می‌دهد.' },
    ]
  },
  {
    category: 'مدیریت محصولات',
    icon: ShoppingBag,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    faqs: [
      { q: 'چگونه محصول جدید اضافه کنم؟', a: 'از منوی «محصولات» روی دکمه «محصول جدید» کلیک کنید. نام، قیمت (به تومان)، موجودی و عکس را وارد کنید. حتماً وضعیت را روی «منتشر شده» قرار دهید تا در سایت دیده شود.' },
      { q: 'چرا قیمت محصول در سایت نمایش داده نمی‌شود؟', a: 'اگر قیمت محصول را صفر بگذارید، سیستم آن را به عنوان «قیمت ثبت نشده» در نظر می‌گیرد و دکمه خرید غیرفعال می‌شود. برای فروش، حتماً قیمت را وارد کنید.' },
      { q: 'چگونه محصول را «ناموجود» کنم؟', a: 'کافیست در صفحه ویرایش محصول، موجودی انبار را به صفر برسانید. سیستم به صورت خودکار برچسب «ناموجود» را روی محصول نمایش می‌دهد.' },
      { q: 'گالری تصاویر و مشخصات فنی چگونه کار می‌کند؟', a: 'می‌توانید چندین عکس آپلود کنید. در بخش مشخصات فنی (Specifications) می‌توانید کلید-مقدارهایی مثل «حجم: ۲۰۰ میلی‌لیتر» اضافه کنید تا در جدول صفحه محصول نمایش داده شود.' },
    ]
  },
  {
    category: 'مدیریت سفارشات و پرداخت',
    icon: Package,
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    faqs: [
      { q: 'وضعیت سفارشات به چه معناست؟', a: '«در انتظار پرداخت» یعنی مشتری سفارش داده اما به درگاه نرفته. «پرداخت شده» یعنی زرین‌پال تایید کرده است. «در حال پردازش» یعنی شما در حال آماده‌سازی هستید. «ارسال شده» و «تحویل شده» مراحل بعدی هستند.' },
      { q: 'آیا کم شدن موجودی انبار با پرداخت انجام می‌شود؟', a: 'بله، این یک قابلیت بسیار مهم است. موجودی محصولات فقط زمانی از انبار کم می‌شود که مشتری در درگاه زرین‌پال پرداخت را با موفقیت انجام دهد. اگر مشتری انصراف دهد، موجودی دست‌نخورده می‌ماند.' },
      { q: 'چگونه خروجی اکسل (CSV) از سفارشات بگیرم؟', a: 'در صفحه سفارشات، روی دکمه سبز رنگ «دانلود اکسل» کلیک کنید. فایلی شامل نام، آدرس، تلفن، مبلغ و محصولات دانلود می‌شود که در Excel قابل باز کردن است.' },
      { q: 'حذف یک سفارش چه تاثیری دارد؟', a: 'حذف سفارش غیرقابل بازگشت است و تمام اطلاعات (محصولات و آدرس) را پاک می‌کند. دقت کنید که این کار موجودی انبار را برنمی‌گرداند.' },
    ]
  },
  {
    category: 'مشتریان (CRM)',
    icon: Users,
    color: 'text-purple-600',
    bg: 'bg-purple-50',
    border: 'border-purple-200',
    faqs: [
      { q: 'پنل CRM چه اطلاعاتی به من می‌دهد؟', a: 'شما می‌توانید لیست تمام کاربران، تعداد سفارشات هر کدام و مجموع مبلغی که خرج کرده‌اند (LTV یا ارزش طول عمر) را ببینید. این برای شناسایی مشتریان وفادار عالی است.' },
      { q: 'تگ «OTP User» در کنار بعضی مشتریان چیست؟', a: 'این مشتریان با شماره موبایل (بدون ایمیل واقعی و رمز عبور) وارد شده‌اند. ایمیل آن‌ها موقت است و هنوز پروفایل خود را تکمیل نکرده‌اند.' },
      { q: 'آیا می‌توانم مشتری را حذف کنم؟', a: 'برای حفظ امنیت و جلوگیری از حذف اطلاعات مالی مرتبط با سفارشات، گزینه حذف مشتری در پنل فعلی وجود ندارد.' },
    ]
  },
  {
    category: 'کد تخفیف و بازاریابی',
    icon: TicketPercent,
    color: 'text-rose-600',
    bg: 'bg-rose-50',
    border: 'border-rose-200',
    faqs: [
      { q: 'چگونه کد تخفیف بسازم؟', a: 'در بخش کدهای تخفیف، نوع تخفیف (درصدی یا مبلغ ثابت)، مقدار، حداقل مبلغ سفارش و سقف استفاده را تعیین کنید. کدهایی که در سایت استفاده می‌شوند در اینجا قابل مدیریت هستند.' },
      { q: 'سقف تخفیف (Max Discount) چیست؟', a: 'اگر تخفیف درصدی (مثلاً ۲۰٪) بسازید، می‌توانید سقف بگذارید (مثلاً ۵۰,۰۰۰ تومان) تا برای سبدهای خرید بزرگ، مبلغ تخفیف سرسام‌آور نشود.' },
      { q: 'اگر کد تخفیف با سفارش همخوانی نداشته باشد چه می‌شود؟', a: 'اگر مشتری مبلغی کمتر از «حداقل سفارش» وارد کند، یا کد منقضی شده باشد، به او خطای مربوطه نشان داده می‌شود و کد اعمال نمی‌شود.' },
    ]
  },
  {
    category: 'مجله و محتوا (Articles)',
    icon: FileText,
    color: 'text-indigo-600',
    bg: 'bg-indigo-50',
    border: 'border-indigo-200',
    faqs: [
      { q: 'ادیتور متن (Tiptap) چه امکاناتی دارد؟', a: 'شما می‌توانید متن را با فرمت‌های مختلف (تیتر، لیست، رنگ، بولد) بنویسید، از داخل ادیتور عکس آپلود کنید و لینک بگذارید. نیازی به دانش HTML نیست.' },
      { q: 'تولید عکس کاور با هوش مصنوعی چگونه کار می‌کند؟', a: 'در صفحه نوشتن مقاله، روی دکمه «تولید با AI» کلیک کنید. سیستم بر اساس موضوع مقاله یک تصویر مینیمال و زیبا تولید می‌کند و به عنوان کاور قرار می‌دهد.' },
      { q: 'منظور از «مقاله شاخص» (Featured) چیست؟', a: 'اگر این گزینه را فعال کنید، مقاله در بالاترین قسمت صفحه مجله، با سایز بزرگتر و به عنوان مقاله اصلی نمایش داده می‌شود.' },
    ]
  },
  {
    category: 'نظرات و تنظیمات',
    icon: Settings,
    color: 'text-gray-600',
    bg: 'bg-gray-50',
    border: 'border-gray-200',
    faqs: [
      { q: 'چرا نظرات کاربران در سایت نمایش داده نمی‌شوند؟', a: 'تمامی نظرات ابتدا در وضعیت «در انتظار» ثبت می‌شوند تا از اسپم جلوگیری شود. شما باید از بخش مدیریت نظرات، آن‌ها را بررسی و تایید کنید.' },
      { q: 'پرداخت زرین‌پال چطور کار می‌کند؟', a: 'کافیست مرچنت‌کد (Merchant ID) خود را در متغیرهای محیطی Vercel قرار دهید. سیستم به صورت خودکار مشتری را به درگاه بانک هدایت کرده و پس از پرداخت، وضعیت سفارش را به‌روزرسانی می‌کند.' },
      { q: 'اطلاعات فروشگاه در تنظیمات به چه کار می‌آید؟', a: 'نام فروشگاه، شماره تماس و آدرس در این بخش ذخیره می‌شوند و در فوتر سایت (پایین صفحه) به کاربران نمایش داده می‌شوند.' },
    ]
  }
];

export default function AdminHelpPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [openCategory, setOpenCategory] = useState<string | null>(helpDatabase[0].category);

  // جستجوی هوشمند
  const filteredData = helpDatabase.map(category => {
    const matchedFaqs = category.faqs.filter(faq => 
      faq.q.includes(searchTerm) || faq.a.includes(searchTerm)
    );
    return { ...category, faqs: matchedFaqs };
  }).filter(category => category.faqs.length > 0);

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20 animate-in fade-in duration-500">
      
      {/* هدر زیبا */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#fff0f7] via-[#fce5f0] to-[#f8f7fa] border border-[#f2d7e5] p-8 md:p-12 shadow-sm">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative z-10 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-sm text-[#c61d70] mb-6">
            <BookOpen size={32} />
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-[#28242b] mb-3">مرکز راهنمای مدیران</h1>
          <p className="text-sm md:text-base text-[#77717b] max-w-xl mx-auto leading-relaxed">
            پاسخ تمام سوالات شما درباره مدیریت فروشگاه، محصولات، سفارشات و تنظیمات در اینجا جمع‌آوری شده است.
          </p>
        </div>
      </div>

      {/* نوار جستجوی شناور */}
      <div className="relative -mt-16 z-20 max-w-2xl mx-auto px-4">
        <div className="relative flex items-center bg-white/90 backdrop-blur-xl border border-[#e9e5eb] shadow-xl rounded-2xl overflow-hidden transition-all focus-within:ring-4 focus-within:ring-[#c61d70]/20 focus-within:border-[#c61d70]">
          <div className="p-4 bg-[#f8f7fa] border-l border-[#e9e5eb]">
            <Search className="text-[#c61d70]" size={22} />
          </div>
          <input 
            type="text" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="چه چیزی می‌خواهید یاد بگیرید؟ (مثلاً: کد تخفیف، افزودن محصول...)" 
            className="w-full px-5 py-4 bg-transparent outline-none text-sm font-medium text-[#28242b] placeholder:text-[#918a95]"
          />
        </div>
      </div>

      {/* لیست آکاردئون‌ها */}
      <div className="grid gap-4 pt-4">
        {filteredData.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-[#e9e5eb]">
            <HelpCircle size={48} className="mx-auto text-[#c61d70]/30 mb-4" />
            <h3 className="text-lg font-black text-[#28242b]">نتیجه‌ای یافت نشد</h3>
            <p className="text-sm text-[#77717b] mt-2">عبارت دیگری را جستجو کنید یا به پشتیبانی فنی تماس بگیرید.</p>
          </div>
        ) : (
          filteredData.map((category) => {
            const Icon = category.icon;
            const isOpen = openCategory === category.category;
            
            return (
              <div key={category.category} className="bg-white rounded-3xl border border-[#e9e5eb] shadow-sm overflow-hidden transition-all duration-300">
                <button 
                  onClick={() => setOpenCategory(isOpen ? null : category.category)}
                  className="w-full flex items-center justify-between p-5 md:p-6 bg-white hover:bg-[#fafafc] transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${category.bg} ${category.color} ${category.border} border`}>
                      <Icon size={22} />
                    </div>
                    <div className="text-right">
                      <h2 className="text-base md:text-lg font-black text-[#28242b]">{category.category}</h2>
                      <p className="text-xs text-[#77717b] mt-1">{category.faqs.length} سوال در این بخش</p>
                    </div>
                  </div>
                  <ChevronDown size={20} className={`text-[#918a95] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                </button>

                {isOpen && (
                  <div className="border-t border-[#e9e5eb] bg-[#fafafc] p-4 md:p-6 space-y-3 animate-in slide-in-from-top-2">
                    {category.faqs.map((faq, idx) => (
                      <div key={idx} className="bg-white border border-[#e9e5eb] rounded-2xl p-5 shadow-sm">
                        <h3 className="font-bold text-sm text-[#28242b] flex items-start gap-2 mb-3">
                          <Sparkles size={16} className="text-[#c61d70] shrink-0 mt-0.5" />
                          {faq.q}
                        </h3>
                        <p className="text-xs md:text-sm text-[#5a535e] leading-loose pr-6 text-justify">
                          {faq.a}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
      
      {/* بخش تماس با پشتیبانی فنی */}
      <div className="mt-12 bg-gradient-to-r from-[#28242b] to-[#3a333f] rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#c61d70]/30 rounded-full blur-2xl" />
        <div className="relative z-10 text-center md:text-right">
          <h3 className="text-lg font-black text-white mb-1">پاسخ سوال خود را پیدا نکردید؟</h3>
          <p className="text-xs text-white/70">تیم فنی ما آماده پاسخگویی به سوالات پیچیده شماست.</p>
        </div>
        <a href="mailto:amirgt206@gmail.com" className="relative z-10 px-6 py-3 bg-white text-[#28242b] text-sm font-bold rounded-xl hover:bg-gray-100 transition-colors whitespace-nowrap">
          تماس با پشتیبانی
        </a>
      </div>

    </div>
  );
}