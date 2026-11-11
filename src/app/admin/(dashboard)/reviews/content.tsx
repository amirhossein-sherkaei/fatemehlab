'use client';
import { useState, useEffect } from 'react';
import { Check, X, Star, Loader2, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';


export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);

  const fetchReviews = () => {
    fetch('/api/admin/reviews')
      .then(res => res.json())
      .then(data => { if (data.success) setReviews(data.reviews); })
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchReviews(); }, []);

  const handleAction = async (id: string, action: 'approve' | 'reject') => {
    setProcessing(id);
    try {
      const res = await fetch('/api/admin/reviews', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action }),
      });
      if (res.ok) {
        toast.success(action === 'approve' ? 'نظر تایید شد' : 'نظر حذف شد');
        fetchReviews();
      } else toast.error('خطا در انجام عملیات');
    } catch { toast.error('خطا در ارتباط با سرور'); }
    finally { setProcessing(null); }
  };

  if (loading) return <div className="p-8 text-center text-muted">در حال بارگذاری...</div>;

  return (
    <div className="space-y-6 pb-20 md:pb-6">
      <div>
        <h1 className="text-2xl font-bold text-ink">مدیریت نظرات</h1>
        <p className="text-sm text-muted mt-1">{reviews.filter(r => r.status === 'pending').length} نظر در انتظار تایید</p>
      </div>

      {reviews.length === 0 ? (
        <div className="bg-white border border-dashed border-line rounded-2xl p-12 text-center">
          <MessageSquare size={48} className="mx-auto text-muted/40 mb-4" />
          <h3 className="font-bold text-ink mb-2">نظری ثبت نشده است</h3>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {reviews.map((review) => (
            <div key={review.id} className={`bg-white border rounded-2xl p-5 ${review.status === 'pending' ? 'border-amber-300 shadow-md' : 'border-line'}`}>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4 pb-4 border-b border-line">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-sm text-ink">{review.name}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${review.status === 'approved' ? 'bg-emerald-100 text-emerald-700' : review.status === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'}`}>
                      {review.status === 'approved' ? 'تایید شده' : review.status === 'pending' ? 'در انتظار' : 'رد شده'}
                    </span>
                  </div>
                  <span className="text-xs text-muted" dir="ltr">{review.email || 'بدون ایمیل'}</span>
                </div>
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} fill={i < review.rating ? 'currentColor' : 'none'} className={i < review.rating ? '' : 'text-gray-300'} />
                  ))}
                </div>
              </div>
              
              <p className="text-sm text-ink leading-loose mb-4">{review.comment}</p>
              
              {review.status === 'pending' && (
                <div className="flex gap-2 justify-end">
                  <button onClick={() => handleAction(review.id, 'reject')} disabled={processing === review.id} className="flex items-center gap-1.5 px-4 py-2 bg-rose-50 text-rose-600 text-xs font-bold rounded-lg hover:bg-rose-100 transition-colors disabled:opacity-50">
                    {processing === review.id ? <Loader2 size={14} className="animate-spin" /> : <X size={14} />} رد
                  </button>
                  <button onClick={() => handleAction(review.id, 'approve')} disabled={processing === review.id} className="flex items-center gap-1.5 px-4 py-2 bg-emerald-50 text-emerald-600 text-xs font-bold rounded-lg hover:bg-emerald-100 transition-colors disabled:opacity-50">
                    {processing === review.id ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />} تایید
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}