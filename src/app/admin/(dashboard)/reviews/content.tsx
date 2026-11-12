'use client';
import { formatPersianDate, formatPersianDateTime } from '@/lib/format';
import { useState, useEffect } from 'react';
import { Check, X, Star, Loader2, MessageSquare, ShieldCheck, Trash2, Mail, Package, User } from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  const fetchReviews = () => {
    fetch('/api/admin/reviews')
      .then(res => res.json())
      .then(data => { if (data.success) setReviews(data.reviews); })
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchReviews(); }, []);

  const handleAction = async (id: string, action: 'approve' | 'reject' | 'delete') => {
    if (action === 'delete' && !confirm('آیا از حذف این نظر مطمئن هستید؟')) return;
    
    setProcessing(id);
    try {
      const res = await fetch('/api/admin/reviews', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action }),
      });
      if (res.ok) {
        toast.success(action === 'approve' ? 'نظر تایید شد' : action === 'reject' ? 'نظر رد شد' : 'نظر حذف شد');
        fetchReviews();
      } else toast.error('خطا در انجام عملیات');
    } catch { toast.error('خطا در ارتباط با سرور'); }
    finally { setProcessing(null); }
  };

  if (loading) return <div className="p-12 text-center text-[#c61d70]"><Loader2 className="w-8 h-8 animate-spin mx-auto" /></div>;

  const filteredReviews = reviews.filter(r => filter === 'all' || r.status === filter);

  return (
    <div className="space-y-6 pb-20 md:pb-6 max-w-6xl mx-auto">
      {/* هدر صفحه */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#28242b] flex items-center gap-2">
            <MessageSquare className="text-[#c61d70]" size={26} /> مدیریت نظرات
          </h1>
          <p className="text-sm text-[#77717b] mt-1">
            {reviews.filter(r => r.status === 'pending').length} نظر در انتظار تایید
          </p>
        </div>
      </div>

      {/* نوار فیلتر شناور */}
      <div className="bg-white/70 backdrop-blur-xl border border-[#e9e5eb] rounded-2xl p-1.5 flex gap-1 overflow-x-auto shadow-sm w-fit">
        {[
          { k: 'all', label: 'همه نظرات' },
          { k: 'pending', label: 'در انتظار' },
          { k: 'approved', label: 'تایید شده' },
          { k: 'rejected', label: 'رد شده' },
        ].map((tab) => (
          <button
            key={tab.k}
            onClick={() => setFilter(tab.k as any)}
            className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all shrink-0 ${
              filter === tab.k ? 'bg-[#c61d70] text-white shadow-md' : 'text-[#77717b] hover:bg-[#f8f7fa]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {filteredReviews.length === 0 ? (
        <div className="bg-white border border-dashed border-[#e9e5eb] rounded-3xl p-16 text-center">
          <MessageSquare size={48} className="mx-auto text-[#c61d70]/30 mb-4" />
          <h3 className="font-black text-lg text-[#28242b]">نظری در این بخش یافت نشد</h3>
          <p className="text-sm text-[#77717b] mt-2">با فیلترهای دیگر امتحان کنید.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredReviews.map((review) => (
            <div key={review.id} className={`bg-white rounded-2xl border transition-all duration-300 overflow-hidden ${review.status === 'pending' ? 'border-amber-300 shadow-[0_8px_30px_-6px_rgba(251,191,36,0.15)]' : 'border-[#e9e5eb] shadow-sm'}`}>
              
              <div className="flex flex-col md:flex-row">
                {/* محصول */}
                <div className="md:w-48 shrink-0 bg-[#fafafc] p-4 flex flex-row md:flex-col items-center gap-3 border-b md:border-b-0 md:border-l border-[#e9e5eb]">
                  <div className="w-16 h-16 relative rounded-xl border border-[#e9e5eb] bg-white overflow-hidden shrink-0">
                    {review.productImage ? (
                      <Image src={review.productImage} alt={review.productName} fill className="object-contain p-1.5" />
                    ) : (
                      <Package className="w-6 h-6 m-auto text-[#918a95]" />
                    )}
                  </div>
                  <div className="text-center md:mt-2">
                    <span className="text-xs font-bold text-[#28242b] line-clamp-2 leading-relaxed">{review.productName || 'محصول حذف شده'}</span>
                  </div>
                </div>

                {/* محتوای نظر */}
                <div className="flex-1 p-5">
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#fff0f7] to-[#fce5f0] text-[#c61d70] flex items-center justify-center font-black text-lg shadow-sm">
                        {review.name.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-sm text-[#28242b] flex items-center gap-1"><User size={14} className="text-[#918a95]"/> {review.name}</span>
                          {review.verifiedPurchase && (
                            <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1 border border-emerald-100">
                              <ShieldCheck size={10} /> خریدار
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 mt-1 text-[10px] text-[#918a95]">
                          {review.email && <span className="flex items-center gap-1"><Mail size={10}/> {review.email}</span>}
                          <span>{formatPersianDate(review.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className="flex text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={14} fill={i < review.rating ? 'currentColor' : 'none'} className={i < review.rating ? '' : 'text-gray-200'} />
                        ))}
                      </div>
                      <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold border ${
                        review.status === 'approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 
                        review.status === 'pending' ? 'bg-amber-50 text-amber-700 border-amber-200' : 
                        'bg-rose-50 text-rose-700 border-rose-200'
                      }`}>
                        {review.status === 'approved' ? 'تایید شده' : review.status === 'pending' ? 'در انتظار' : 'رد شده'}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-[#3a333f] leading-loose bg-[#fafafc] p-4 rounded-xl border border-[#f5f0f2]">
                    {review.comment}
                  </p>

                  {/* دکمه‌های عملیات */}
                  <div className="flex items-center justify-end gap-2 mt-4 pt-4 border-t border-[#e9e5eb]">
                    <button onClick={() => handleAction(review.id, 'delete')} disabled={processing === review.id} className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-rose-500 hover:bg-rose-50 rounded-lg transition-colors disabled:opacity-50">
                      {processing === review.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />} حذف
                    </button>
                    {review.status !== 'rejected' && (
                      <button onClick={() => handleAction(review.id, 'reject')} disabled={processing === review.id} className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50">
                        <X size={14} /> رد کردن
                      </button>
                    )}
                    {review.status !== 'approved' && (
                      <button onClick={() => handleAction(review.id, 'approve')} disabled={processing === review.id} className="flex items-center gap-1.5 px-5 py-2 text-xs font-bold bg-[#c61d70] text-white rounded-lg shadow-md shadow-[#c61d70]/20 hover:bg-[#a9155d] transition-colors disabled:opacity-50">
                        {processing === review.id ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />} تایید نظر
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}