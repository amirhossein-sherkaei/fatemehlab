'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Loader2, CheckCircle2, Trash2 } from 'lucide-react';

const statusLabels: Record<string, string> = {
  pending: 'در انتظار پرداخت',
  paid: 'پرداخت شده',
  processing: 'در حال پردازش',
  shipped: 'ارسال شده',
  delivered: 'تحویل داده شده',
  cancelled: 'لغو شده',
};
const optionsByStatus: Record<string, Array<{ value: string; label: string; color: string }>> = {
  pending: [{ value: 'cancelled', label: 'لغو سفارش بدون تراکنش فعال', color: 'bg-rose-500' }],
  paid: [
    { value: 'processing', label: 'در حال پردازش', color: 'bg-blue-500' },
    { value: 'cancelled', label: 'لغو پس از بازپرداخت', color: 'bg-rose-500' },
  ],
  processing: [
    { value: 'shipped', label: 'ارسال شده', color: 'bg-purple-500' },
    { value: 'cancelled', label: 'لغو پس از بازپرداخت', color: 'bg-rose-500' },
  ],
  shipped: [{ value: 'delivered', label: 'تحویل داده شده', color: 'bg-emerald-500' }],
  delivered: [],
  cancelled: [],
};

export default function StatusUpdater({ orderId, currentStatus }: { orderId: string; currentStatus: string }) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [loading, setLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleUpdate = async (newStatus: string) => {
    if (newStatus === status) return;
    const payload: { status: string; refundConfirmed?: boolean } = { status: newStatus };
    if (newStatus === 'cancelled' && ['paid', 'processing'].includes(status)) {
      const confirmed = window.confirm('ابتدا باید مبلغ سفارش را از پنل زرین‌پال به مشتری بازپرداخت کرده باشید. آیا بازپرداخت واقعی انجام شده است؟');
      if (!confirmed) return;
      payload.refundConfirmed = true;
    }
    if (newStatus === 'cancelled' && status === 'pending') {
      const confirmed = window.confirm('این سفارش فقط در صورتی لغو می‌شود که هنوز شناسه تراکنش درگاه برای آن صادر نشده باشد. ادامه می‌دهید؟');
      if (!confirmed) return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) { toast.error(data.message || 'خطا در تغییر وضعیت'); return; }
      setStatus(newStatus);
      toast.success('وضعیت سفارش با موفقیت به‌روزرسانی شد');
      router.refresh();
    } catch {
      toast.error('خطا در ارتباط با سرور');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (status !== 'cancelled') { toast.error('فقط سفارش لغوشده قابل حذف است.'); return; }
    if (!confirm('آیا از حذف کامل سابقه این سفارش لغوشده مطمئن هستید؟ این عمل غیرقابل بازگشت است.')) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, { method: 'DELETE' });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) { toast.error(data.message || 'خطا در حذف سفارش'); return; }
      toast.success('سفارش حذف شد');
      router.push('/admin/orders');
      router.refresh();
    } catch {
      toast.error('خطا در ارتباط با سرور');
    } finally {
      setIsDeleting(false);
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
              <button key={option.value} onClick={() => handleUpdate(option.value)} disabled={loading}
                className="flex min-h-12 items-center justify-center gap-2 rounded-xl border border-[#e9e5eb] bg-[#f8f7fa] p-3 text-sm font-bold text-[#77717b] transition-all hover:border-[#c61d70] hover:text-[#c61d70] disabled:opacity-50">
                <span className={`h-2.5 w-2.5 rounded-full ${option.color}`} />{option.label}
              </button>
            ))}
          </div>
        ) : <p className="rounded-xl bg-[#f8f7fa] p-4 text-xs text-[#77717b]">برای این وضعیت، تغییر مجاز دیگری وجود ندارد.</p>}
      </div>

      {status === 'cancelled' && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 shadow-sm">
          <h2 className="mb-2 flex items-center gap-2 text-base font-black text-rose-700"><Trash2 className="h-5 w-5" /> منطقه خطر</h2>
          <p className="mb-4 text-xs leading-relaxed text-rose-600/80">فقط سفارش لغوشده قابل حذف است؛ سوابق سفارش‌های پرداخت‌شده یا در جریان حذف نمی‌شوند.</p>
          <button onClick={handleDelete} disabled={isDeleting} className="flex w-full items-center justify-center gap-2 rounded-xl bg-rose-600 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-rose-700 disabled:opacity-50 sm:w-auto">
            {isDeleting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />} حذف سابقه سفارش لغوشده
          </button>
        </div>
      )}
    </div>
  );
}
