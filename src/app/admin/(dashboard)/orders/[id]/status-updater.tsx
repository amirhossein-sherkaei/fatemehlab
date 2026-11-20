"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, ShieldCheck } from "lucide-react";

const statusLabels: Record<string, string> = {
  pending: "در انتظار پرداخت",
  paid: "پرداخت تأیید شده",
  processing: "در حال پردازش",
  shipped: "ارسال شده",
  delivered: "تحویل داده شده",
  cancelled: "لغو شده",
};
const optionsByStatus: Record<string, Array<{ value: string; label: string; color: string }>> = {
  pending: [{ value: "cancelled", label: "لغو سفارش بدون تراکنش فعال", color: "bg-rose-500" }],
  paid: [
    { value: "processing", label: "در حال پردازش", color: "bg-blue-500" },
    { value: "cancelled", label: "لغو پس از بازپرداخت واقعی", color: "bg-rose-500" },
  ],
  processing: [
    { value: "shipped", label: "ارسال شده", color: "bg-purple-500" },
    { value: "cancelled", label: "لغو پس از بازپرداخت واقعی", color: "bg-rose-500" },
  ],
  shipped: [{ value: "delivered", label: "تحویل داده شده", color: "bg-emerald-500" }],
  delivered: [],
  cancelled: [],
};

export default function StatusUpdater({ orderId, currentStatus }: { orderId: string; currentStatus: string }) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [loading, setLoading] = useState(false);

  const handleUpdate = async (newStatus: string) => {
    if (newStatus === status || loading) return;
    const payload: { status: string; refundConfirmed?: boolean } = { status: newStatus };
    if (newStatus === "cancelled" && ["paid", "processing"].includes(status)) {
      const confirmed = window.confirm("ابتدا باید مبلغ سفارش را واقعاً از پنل زرین‌پال به مشتری بازپرداخت کرده باشید. آیا بازپرداخت واقعی و قابل استناد انجام شده است؟");
      if (!confirmed) return;
      payload.refundConfirmed = true;
    }
    if (newStatus === "cancelled" && status === "pending") {
      const confirmed = window.confirm("این سفارش فقط در صورتی لغو می‌شود که هیچ تراکنش فعال یا نامشخصی نداشته باشد. ادامه می‌دهید؟");
      if (!confirmed) return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        credentials: "same-origin",
        cache: "no-store",
        body: JSON.stringify(payload),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        toast.error(data.message || "خطا در تغییر وضعیت");
        return;
      }
      setStatus(newStatus);
      toast.success("وضعیت سفارش با موفقیت به‌روزرسانی شد");
      router.refresh();
    } catch {
      toast.error("ارتباط با سرور برقرار نشد. وضعیت سفارش را دوباره بررسی کنید.");
    } finally {
      setLoading(false);
    }
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
        <p className="text-xs leading-6">سوابق سفارش برای حفظ ردپای مالی، کنترل موجودی و رسیدگی به اختلافات حذف نمی‌شوند. اصلاحات باید از مسیر تغییر وضعیت و بازپرداخت واقعی ثبت شوند.</p>
      </div>
    </div>
  );
}
