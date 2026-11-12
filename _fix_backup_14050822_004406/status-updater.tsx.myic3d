'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Loader2, CheckCircle2, Trash2 } from 'lucide-react';


const statusOptions = [
  { value: 'processing', label: 'در حال پردازش', color: 'bg-blue-500' },
  { value: 'shipped', label: 'ارسال شده', color: 'bg-purple-500' },
  { value: 'delivered', label: 'تحویل داده شده', color: 'bg-emerald-500' },
  { value: 'cancelled', label: 'لغو شده', color: 'bg-rose-500' },
];

export default function StatusUpdater({ orderId, currentStatus }: { orderId: string, currentStatus: string }) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [loading, setLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleUpdate = async (newStatus: string) => {
    if (newStatus === status) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setStatus(newStatus);
        toast.success('وضعیت سفارش با موفقیت به‌روزرسانی شد');
        router.refresh();
      } else {
        toast.error('خطا در تغییر وضعیت');
      }
    } catch {
      toast.error('خطا در ارتباط با سرور');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('آیا از حذف کامل این سفارش مطمئن هستید؟ این عمل غیرقابل بازگشت است.')) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('سفارش حذف شد');
        router.push('/admin/orders');
        router.refresh();
      } else {
        toast.error('خطا در حذف سفارش');
      }
    } catch {
      toast.error('خطا در ارتباط با سرور');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-[#e9e5eb] bg-white p-6 shadow-sm">
        <h2 className="mb-4 flex items-center gap-2 border-b border-[#e9e5eb] pb-3 text-lg font-black text-[#28242b]">
          تغییر وضعیت
          {loading && <Loader2 className="h-4 w-4 animate-spin text-[#c61d70]" />}
        </h2>
        
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {statusOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => handleUpdate(opt.value)}
              disabled={loading || status === opt.value}
              className={`flex flex-col items-center gap-2 rounded-xl border p-4 text-sm font-bold transition-all ${
                status === opt.value
                  ? 'border-[#28242b] bg-[#28242b] text-white shadow-lg'
                  : 'border-[#e9e5eb] bg-[#f8f7fa] text-[#77717b] hover:border-[#c61d70] hover:text-[#c61d70]'
              } disabled:cursor-default`}
            >
              {status === opt.value ? <CheckCircle2 className="h-5 w-5" /> : <div className={`h-3 w-3 rounded-full ${opt.color}`} />}
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 shadow-sm">
        <h2 className="mb-2 flex items-center gap-2 text-base font-black text-rose-700">
          <Trash2 className="h-5 w-5" /> منطقه خطر
        </h2>
        <p className="mb-4 text-xs leading-relaxed text-rose-600/80">با حذف سفارش، تمام اطلاعات مربوط به آن (شامل محصولات و آدرس) برای همیشه پاک می‌شود.</p>
        <button onClick={handleDelete} disabled={isDeleting} className="flex w-full items-center justify-center gap-2 rounded-xl bg-rose-600 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-rose-700 disabled:opacity-50 sm:w-auto">
          {isDeleting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
          حذف کامل سفارش
        </button>
      </div>
    </div>
  );
}