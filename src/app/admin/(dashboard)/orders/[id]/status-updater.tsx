"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, ShieldCheck, X } from "lucide-react";

const statusLabels: Record<string, string> = {
  pending: "در انتظار پرداخت", paid: "پرداخت تأیید شده", processing: "در حال پردازش",
  shipped: "ارسال شده", delivered: "تحویل داده شده", cancelled: "لغو شده",
};
const optionsByStatus: Record<string, Array<{ value: string; label: string; color: string }>> = {
  pending: [{ value: "cancelled", label: "لغو سفارش بدون تراکنش فعال", color: "bg-rose-500" }],
  paid: [
    { value: "processing", label: "شروع آماده‌سازی سفارش", color: "bg-blue-500" },
    { value: "cancelled", label: "لغو پس از بازپرداخت واقعی", color: "bg-rose-500" },
  ],
  processing: [
    { value: "shipped", label: "ثبت ارسال سفارش", color: "bg-purple-500" },
    { value: "cancelled", label: "لغو پس از بازپرداخت واقعی", color: "bg-rose-500" },
  ],
  shipped: [{ value: "delivered", label: "ثبت تحویل سفارش", color: "bg-emerald-500" }],
  delivered: [], cancelled: [],
};

export default function StatusUpdater({ orderId, currentStatus }: { orderId: string; currentStatus: string }) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [loading, setLoading] = useState(false);
  const [showRefundDialog, setShowRefundDialog] = useState(false);
  const [refundReference, setRefundReference] = useState("");
  const [refundReason, setRefundReason] = useState("");
  const [refundAcknowledged, setRefundAcknowledged] = useState(false);

  const sendStatus = async (newStatus: string, refund?: { refundReference: string; refundReason: string }) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        credentials: "same-origin",
        cache: "no-store",
        body: JSON.stringify({ status: newStatus, ...refund }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        toast.error(data.message || "خطا در تغییر وضعیت");
        return;
      }
      setStatus(newStatus);
      setShowRefundDialog(false);
      setRefundReference("");
      setRefundReason("");
      setRefundAcknowledged(false);
      toast.success("وضعیت سفارش و سوابق عملیاتی به‌روزرسانی شد");
      router.refresh();
    } catch {
      toast.error("ارتباط با سرور برقرار نشد. وضعیت سفارش را دوباره بررسی کنید.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = (newStatus: string) => {
    if (newStatus === status || loading) return;
    if (newStatus === "cancelled" && ["paid", "processing"].includes(status)) {
      setShowRefundDialog(true);
      return;
    }
    if (newStatus === "cancelled" && status === "pending") {
      const confirmed = window.confirm("این سفارش فقط در صورتی لغو می‌شود که هیچ درخواست یا تراکنش فعال و نامشخصی نداشته باشد. ادامه می‌دهید؟");
      if (!confirmed) return;
    }
    void sendStatus(newStatus);
  };

  const submitRefundCancellation = () => {
    if (!refundAcknowledged) {
      toast.error("ابتدا تأیید کنید که بازپرداخت واقعی در پنل درگاه پرداخت انجام شده است.");
      return;
    }
    if (refundReference.trim().length < 4 || refundReason.trim().length < 8) {
      toast.error("شناسه بازپرداخت و علت آن را کامل وارد کنید.");
      return;
    }
    void sendStatus("cancelled", { refundReference: refundReference.trim(), refundReason: refundReason.trim() });
  };

  const options = optionsByStatus[status] || [];
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-[#e9e5eb] bg-white p-6 shadow-sm">
        <h2 className="mb-2 flex items-center gap-2 border-b border-[#e9e5eb] pb-3 text-lg font-black text-[#28242b]">
          تغییر وضعیت {loading && <Loader2 className="h-4 w-4 animate-spin text-[#c61d70]" />}
        </h2>
        <p className="mb-4 text-xs text-[#77717b]">وضعیت فعلی: <strong>{statusLabels[status] || status}</strong></p>
        {options.length ? (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {options.map((option) => (
              <button key={option.value} type="button" onClick={() => handleUpdate(option.value)} disabled={loading}
                className="flex min-h-12 items-center justify-center gap-2 rounded-xl border border-[#e9e5eb] bg-[#f8f7fa] p-3 text-sm font-bold text-[#77717b] transition-all hover:border-[#c61d70] hover:text-[#c61d70] disabled:opacity-50">
                <span className={`h-2.5 w-2.5 rounded-full ${option.color}`} />{option.label}
              </button>
            ))}
          </div>
        ) : <p className="rounded-xl bg-[#f8f7fa] p-4 text-xs text-[#77717b]">برای این وضعیت، تغییر مجاز دیگری وجود ندارد.</p>}
      </div>

      <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-slate-700">
        <ShieldCheck size={19} className="mt-0.5 shrink-0" />
        <p className="text-xs leading-6">سوابق سفارش، پرداخت، تغییر وضعیت و بازپرداخت ثبت و نگهداری می‌شوند. سفارش پرداخت‌شده فقط پس از ثبت شناسه واقعی بازپرداخت قابل لغو است.</p>
      </div>

      {showRefundDialog && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#211620]/55 p-4 backdrop-blur-sm" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget && !loading) setShowRefundDialog(false); }}>
          <section role="dialog" aria-modal="true" aria-labelledby="refund-dialog-title" className="w-full max-w-lg rounded-3xl border border-[#eadce6] bg-white p-5 shadow-2xl sm:p-7">
            <div className="mb-5 flex items-start justify-between gap-3">
              <div>
                <span className="mb-2 inline-flex rounded-full bg-rose-50 px-3 py-1 text-[10px] font-black text-rose-700">عملیات مالی حساس</span>
                <h3 id="refund-dialog-title" className="text-lg font-black text-[#28242b]">ثبت بازپرداخت و لغو سفارش</h3>
                <p className="mt-1 text-xs leading-6 text-[#77717b]">ابتدا بازپرداخت کامل را در پنل درگاه پرداخت انجام بده؛ سپس شناسه واقعی آن را اینجا ثبت کن.</p>
              </div>
              <button type="button" onClick={() => setShowRefundDialog(false)} disabled={loading} aria-label="بستن" className="rounded-xl border border-[#e9e5eb] p-2 text-[#77717b] hover:bg-[#f8f7fa]"><X size={17} /></button>
            </div>
            <div className="space-y-4">
              <label className="block space-y-1.5">
                <span className="text-xs font-bold text-[#342633]">شناسه / کد پیگیری بازپرداخت</span>
                <input value={refundReference} onChange={(event) => setRefundReference(event.target.value)} maxLength={120} autoComplete="off" dir="ltr" placeholder="Refund reference" className="min-h-11 w-full rounded-xl border border-[#e9e5eb] bg-[#faf9fb] px-3 text-sm outline-none focus:border-[#c61d70] focus:ring-2 focus:ring-[#c61d70]/10" />
              </label>
              <label className="block space-y-1.5">
                <span className="text-xs font-bold text-[#342633]">علت لغو و بازپرداخت</span>
                <textarea value={refundReason} onChange={(event) => setRefundReason(event.target.value)} maxLength={400} rows={3} placeholder="دلیل ثبت بازپرداخت را بنویسید..." className="w-full resize-y rounded-xl border border-[#e9e5eb] bg-[#faf9fb] px-3 py-2.5 text-sm leading-6 outline-none focus:border-[#c61d70] focus:ring-2 focus:ring-[#c61d70]/10" />
              </label>
              <label className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-[11px] leading-6 text-amber-900">
                <input type="checkbox" checked={refundAcknowledged} onChange={(event) => setRefundAcknowledged(event.target.checked)} className="mt-1 accent-[#c61d70]" />
                <span>تأیید می‌کنم مبلغ سفارش واقعاً از پنل درگاه به مشتری بازپرداخت شده و شناسه بالا متعلق به همان عملیات است. ثبت این فرم به‌تنهایی وجهی را منتقل نمی‌کند.</span>
              </label>
              <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                <button type="button" onClick={() => setShowRefundDialog(false)} disabled={loading} className="min-h-11 rounded-xl border border-[#e9e5eb] px-5 text-xs font-bold text-[#77717b]">انصراف</button>
                <button type="button" onClick={submitRefundCancellation} disabled={loading || !refundAcknowledged || refundReference.trim().length < 4 || refundReason.trim().length < 8} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-rose-600 px-5 text-xs font-black text-white hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-45">
                  {loading ? <Loader2 size={15} className="animate-spin" /> : <ShieldCheck size={15} />} ثبت بازپرداخت و لغو
                </button>
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
