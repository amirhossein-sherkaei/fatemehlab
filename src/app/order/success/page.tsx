import { CheckCircle2, ArrowRight, Clock3, XCircle, ShieldCheck } from "lucide-react";
import Link from "next/link";
import Header from "@/components/storefront/Header";
import Footer from "@/components/storefront/Footer";
import CopyButton from "./copy-button";
import PaymentActionButton from "@/components/account/PaymentActionButton";
import { db } from "@/lib/db";
import { orders } from "@/db/schema";
import { and, eq } from "drizzle-orm";

export const instant = false;

const CONFIRMED_STATUSES = ["paid", "processing", "shipped", "delivered"];
const ORDER_ID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const TRACKING_PATTERN = /^FL-[A-Z0-9-]{6,36}$/i;

export default async function OrderSuccessPage({ searchParams }: { searchParams: Promise<{ id?: string; code?: string }> }) {
  const { id, code } = await searchParams;
  let matchedOrder: { id: string; trackingCode: string; status: string; totalAmount: number } | undefined;

  if (id && code && ORDER_ID_PATTERN.test(id) && TRACKING_PATTERN.test(code)) {
    const [order] = await db.select({
      id: orders.id,
      trackingCode: orders.trackingCode,
      status: orders.status,
      totalAmount: orders.totalAmount,
    }).from(orders)
      .where(and(eq(orders.id, id), eq(orders.trackingCode, code)))
      .limit(1);
    matchedOrder = order;
  }

  const isConfirmed = Boolean(matchedOrder && CONFIRMED_STATUSES.includes(matchedOrder.status));
  const isPending = matchedOrder?.status === "pending";
  const isCancelled = matchedOrder?.status === "cancelled";
  const noPaymentRequired = Boolean(isConfirmed && matchedOrder?.totalAmount === 0);
  const showTracking = Boolean(matchedOrder);

  const title = noPaymentRequired
    ? "سفارش بدون نیاز به پرداخت ثبت شد"
    : isConfirmed
      ? "پرداخت و ثبت سفارش تأیید شد"
      : isPending
        ? "سفارش ثبت شده؛ پرداخت باقی مانده است"
        : isCancelled
          ? "این سفارش لغو شده است"
          : "وضعیت سفارش قابل تأیید نیست";

  const description = noPaymentRequired
    ? "مبلغ نهایی سفارش صفر بوده و نیازی به پرداخت آنلاین نداشته است. سفارش شما ثبت شده است."
    : isConfirmed
      ? "پرداخت با تأیید سرور و درگاه ثبت شده است. کد رهگیری را برای پیگیری سفارش نگه دارید."
      : isPending
        ? "سفارش و موجودی آن ثبت شده‌اند، اما تا وقتی سرور تأیید نهایی درگاه را دریافت نکند، پرداخت‌شده محسوب نمی‌شود. از همین صفحه می‌توانید وضعیت تراکنش را امن بررسی و ادامه دهید."
        : isCancelled
          ? "این سفارش لغو شده است و امکان پرداخت آن وجود ندارد. در صورت کسر وجه، برای بررسی سوابق مالی با پشتیبانی تماس بگیرید."
          : "اطلاعات این سفارش پیدا نشد یا با کد رهگیری مطابقت ندارد. برای جلوگیری از افشای اطلاعات، جزئیات سفارش نمایش داده نمی‌شود.";

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12 md:py-20 pb-24 md:pb-20">
        <div className="glass-panel w-full max-w-xl bg-white/90 p-6 text-center shadow-xl shadow-[#28242b]/5 md:p-10">
          <div className={`mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full ${isConfirmed ? "bg-emerald-50" : isPending ? "bg-amber-50" : isCancelled ? "bg-rose-50" : "bg-slate-100"}`}>
            {isConfirmed ? <CheckCircle2 className="h-10 w-10 text-emerald-600" /> : isPending ? <Clock3 className="h-10 w-10 text-amber-600" /> : isCancelled ? <XCircle className="h-10 w-10 text-rose-600" /> : <ShieldCheck className="h-10 w-10 text-slate-500" />}
          </div>
          <h1 className="mb-3 text-xl font-black text-ink md:text-2xl">{title}</h1>
          <p className="mb-7 text-sm leading-8 text-muted">{description}</p>

          {isPending && matchedOrder && (
            <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-right">
              <p className="mb-2 text-xs font-black text-amber-900">پیش‌فاکتور — رسید پرداخت نیست</p>
              <p className="text-[11px] leading-6 text-amber-800">در صورت قطع اینترنت یا بسته‌شدن درگاه، ابتدا تراکنش قبلی از زرین‌پال استعلام می‌شود. تا تعیین نتیجه، پرداخت جدیدی ساخته نخواهد شد.</p>
            </div>
          )}

          {showTracking && matchedOrder && (
            <div className="group relative mb-7 rounded-2xl border border-line bg-chalk p-5">
              <p className="mb-2 text-xs text-muted">کد رهگیری سفارش</p>
              <div className="flex items-center justify-center gap-3">
                <p className="font-mono text-2xl font-black tracking-widest text-sage md:text-3xl" dir="ltr">{matchedOrder.trackingCode}</p>
                <CopyButton text={matchedOrder.trackingCode} />
              </div>
              <p className="mt-3 text-[10px] leading-5 text-muted">کد رهگیری برای مشاهده وضعیت سفارش استفاده می‌شود و به‌تنهایی اثبات‌کننده پرداخت نیست.</p>
            </div>
          )}

          <div className="flex flex-col gap-3">
            {isPending && matchedOrder ? (
              <PaymentActionButton orderId={matchedOrder.id} label="استعلام و ادامه پرداخت امن" />
            ) : isConfirmed ? (
              <Link href="/track" className="btn-primary w-full justify-center">پیگیری سفارش <ArrowRight size={16} /></Link>
            ) : (
              <Link href="/account/orders" className="btn-primary w-full justify-center">مشاهده سفارش‌های من <ArrowRight size={16} /></Link>
            )}
            <Link href="/" className="btn-secondary w-full justify-center">بازگشت به صفحه اصلی</Link>
            {(isPending || isCancelled) && <Link href="/contact" className="text-xs font-bold text-muted transition-colors hover:text-[#c61d70]">نیاز به کمک دارید؟ تماس با پشتیبانی</Link>}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
