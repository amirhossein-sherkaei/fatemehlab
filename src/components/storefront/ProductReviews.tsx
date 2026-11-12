'use client';
import { formatPersianDate, formatPersianDateTime } from '@/lib/format';

import { useState, useEffect } from 'react';
import { Star, Send, Loader2, User, UploadCloud, X, ThumbsUp, ThumbsDown, ShieldCheck, MessageCircle, Camera, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';

interface ReviewStats {
  total: number;
  average: string | null;
  distribution: { 5: number; 4: number; 3: number; 2: number; 1: number };
}

export default function ProductReviews({ productId }: { productId: string }) {
  const [reviews, setReviews] = useState<any[]>([]);
  const [stats, setStats] = useState<ReviewStats>({ total: 0, average: null, distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [sort, setSort] = useState('newest');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [formData, setFormData] = useState({ name: '', email: '', rating: 5, comment: '' });
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [votedReviews, setVotedReviews] = useState<Set<string>>(new Set());
  const [currentUser, setCurrentUser] = useState<{ name: string; email: string } | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  const fetchReviews = () => {
    const params = new URLSearchParams({ productId, sort, rating: ratingFilter });
    fetch(`/api/reviews?${params.toString()}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setReviews(data.reviews);
          setStats(data.stats);
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { 
    fetchReviews(); 
    
    // دریافت اطلاعات کاربر لاگین شده
    fetch('/api/account/me')
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data?.success && data.customer) {
          setCurrentUser({ name: data.customer.name, email: data.customer.email });
          setFormData(prev => ({ ...prev, name: data.customer.name, email: data.customer.email }));
        }
      })
      .catch(() => {})
      .finally(() => setCheckingAuth(false));
  }, [productId, sort, ratingFilter]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    if (uploadedImages.length + files.length > 3) {
      toast.error('حداکثر ۳ عکس مجاز است');
      return;
    }
    setUploadingImage(true);
    try {
      const urls = await Promise.all(files.map(async (file) => {
        const fd = new FormData();
        fd.append('file', file);
        const res = await fetch('/api/reviews/upload', { method: 'POST', body: fd });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        return data.url;
      }));
      setUploadedImages([...uploadedImages, ...urls]);
      toast.success('عکس اضافه شد');
    } catch (err: any) {
      toast.error(err.message || 'خطا در آپلود');
    } finally {
      setUploadingImage(false);
    }
  };

  const removeImage = (index: number) => {
    setUploadedImages(uploadedImages.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, productId, images: uploadedImages }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message);
        setShowForm(false);
        setFormData({ name: '', email: '', rating: 5, comment: '' });
        setUploadedImages([]);
      } else {
        toast.error(data.message);
      }
    } catch {
      toast.error('خطا در ارتباط با سرور');
    } finally {
      setSubmitting(false);
    }
  };

  const handleVote = async (id: string, action: 'helpful' | 'not-helpful') => {
    if (votedReviews.has(id)) {
      toast.error('شما قبلاً به این نظر رأی داده‌اید');
      return;
    }
    try {
      await fetch('/api/reviews', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action }),
      });
      setVotedReviews(new Set([...votedReviews, id]));
      fetchReviews();
      toast.success('ممنون از بازخورد شما');
    } catch {
      toast.error('خطا در ثبت رأی');
    }
  };

  const displayReviews = showAllReviews ? reviews : reviews.slice(0, 3);

  return (
    <>
      <div className="mt-12 md:mt-16 bg-white rounded-3xl border border-[#e9e5eb] p-6 md:p-10 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8 border-b border-[#e9e5eb] pb-6">
          <div className="flex-1">
            <h2 className="text-xl md:text-2xl font-black text-[#28242b] mb-4 flex items-center gap-2">
              <MessageCircle size={24} className="text-[#c61d70]" />
              نظرات و امتیازهای خریداران
            </h2>
            {stats.average && (
              <div className="flex flex-col md:flex-row gap-6 md:items-center">
                <div className="text-center md:text-right">
                  <div className="text-4xl md:text-5xl font-black text-[#28242b] mb-1">{stats.average}</div>
                  <div className="flex justify-center md:justify-start text-amber-400 mb-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={18} fill={i < Math.round(Number(stats.average)) ? 'currentColor' : 'none'} className={i < Math.round(Number(stats.average)) ? '' : 'text-gray-300'} />
                    ))}
                  </div>
                  <span className="text-xs text-[#77717b]">از {stats.total} نظر</span>
                </div>
                <div className="flex-1 space-y-1">
                  {[5, 4, 3, 2, 1].map(star => {
                    const count = stats.distribution[star as keyof typeof stats.distribution];
                    const percent = stats.total > 0 ? (count / stats.total) * 100 : 0;
                    return (
                      <div key={star} className="flex items-center gap-2 text-xs">
                        <span className="w-10 text-[#77717b]">{star} ★</span>
                        <div className="flex-1 h-2 bg-[#f8f7fa] rounded-full overflow-hidden">
                          <div className="h-full bg-amber-400 rounded-full transition-all" style={{ width: `${percent}%` }} />
                        </div>
                        <span className="w-8 text-left text-[#77717b]">{count.toLocaleString('fa-IR')}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-6 py-3 bg-[#c61d70] text-white text-sm font-bold rounded-xl shadow-lg shadow-[#c61d70]/20 hover:bg-[#a9155d] transition-all w-full md:w-auto flex items-center justify-center gap-2"
          >
            <Star size={16} />
            {showForm ? 'بستن فرم' : 'ثبت نظر و امتیاز'}
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="mb-10 bg-gradient-to-br from-[#fafafc] to-[#fff0f7] p-5 md:p-8 rounded-2xl border border-[#f2d7e5] space-y-5 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-[#28242b] mb-1.5 block">نام شما *</label>
                <input type="text" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-3 bg-white border border-[#e9e5eb] rounded-xl focus:border-[#c61d70] focus:ring-2 focus:ring-[#c61d70]/20 outline-none text-sm" />
              </div>
              <div>
                <label className="text-xs font-bold text-[#28242b] mb-1.5 block">ایمیل (اختیاری)</label>
                <input type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full px-4 py-3 bg-white border border-[#e9e5eb] rounded-xl focus:border-[#c61d70] focus:ring-2 focus:ring-[#c61d70]/20 outline-none text-sm" />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-[#28242b] mb-2 block">امتیاز شما به این محصول *</label>
              <div className="flex gap-2 items-center">
                {[1, 2, 3, 4, 5].map(star => (
                  <button key={star} type="button" onClick={() => setFormData({ ...formData, rating: star })} className="transition-transform hover:scale-110">
                    <Star size={32} fill={star <= formData.rating ? '#fbbf24' : 'none'} className={star <= formData.rating ? 'text-amber-400' : 'text-gray-300'} />
                  </button>
                ))}
                <span className="text-sm font-bold text-[#28242b] mr-2">{formData.rating} از ۵</span>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-[#28242b] mb-1.5 block">تجربه خود را بنویسید *</label>
              <textarea required rows={4} maxLength={1000} value={formData.comment} onChange={e => setFormData({ ...formData, comment: e.target.value })} placeholder="کیفیت، بسته‌بندی، تأثیر محصول روی پوست شما..." className="w-full px-4 py-3 bg-white border border-[#e9e5eb] rounded-xl focus:border-[#c61d70] focus:ring-2 focus:ring-[#c61d70]/20 outline-none text-sm resize-none"></textarea>
              <span className="text-[10px] text-[#918a95] mt-1 block">{formData.comment.length} / ۱۰۰۰ کاراکتر</span>
            </div>

            <div>
              <label className="text-xs font-bold text-[#28242b] mb-2 block flex items-center gap-1.5">
                <Camera size={14} /> افزودن عکس (اختیاری، حداکثر ۳ عکس)
              </label>
              <div className="flex flex-wrap gap-2 mb-3">
                {uploadedImages.map((url, i) => (
                  <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden border border-[#e9e5eb] bg-white">
                    <Image src={url} alt={`عکس ${i}`} fill className="object-cover" />
                    <button type="button" onClick={() => removeImage(i)} className="absolute top-1 right-1 bg-rose-500 text-white p-1 rounded-md hover:bg-rose-600">
                      <X size={10} />
                    </button>
                  </div>
                ))}
                {uploadedImages.length < 3 && (
                  <label className="w-20 h-20 rounded-xl border-2 border-dashed border-[#e9e5eb] bg-white flex flex-col items-center justify-center cursor-pointer hover:border-[#c61d70] transition-colors">
                    {uploadingImage ? <Loader2 size={18} className="animate-spin text-[#c61d70]" /> : (
                      <>
                        <UploadCloud size={20} className="text-[#c61d70] mb-1" />
                        <span className="text-[9px] text-[#77717b] font-bold">آپلود</span>
                      </>
                    )}
                    <input type="file" accept="image/*" multiple onChange={handleImageUpload} disabled={uploadingImage} className="hidden" />
                  </label>
                )}
              </div>
            </div>

            <button type="submit" disabled={submitting} className="flex items-center justify-center gap-2 px-8 py-3 bg-[#c61d70] text-white text-sm font-bold rounded-xl shadow-lg shadow-[#c61d70]/20 disabled:opacity-50 hover:bg-[#a9155d] transition-colors">
              {submitting ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
              ارسال نظر برای بررسی
            </button>
          </form>
        )}

        {loading ? (
          <div className="text-center py-12"><Loader2 className="w-8 h-8 animate-spin mx-auto text-[#c61d70]" /></div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-12 text-[#77717b] text-sm bg-[#fafafc] rounded-2xl border border-dashed border-[#e9e5eb]">
            <Star size={40} className="mx-auto mb-3 text-[#c61d70]/30" />
            هنوز نظری برای این محصول ثبت نشده. اولین نفر باشید!
          </div>
        ) : (
          <>
            {/* نوار مرتب‌سازی و فیلتر */}
            <div className="flex flex-col md:flex-row gap-3 mb-6 bg-[#fafafc] p-3 rounded-xl border border-[#e9e5eb]">
              <div className="flex items-center gap-2 flex-1">
                <span className="text-xs font-bold text-[#77717b] whitespace-nowrap">مرتب‌سازی:</span>
                <select value={sort} onChange={e => setSort(e.target.value)} className="flex-1 bg-white border border-[#e9e5eb] rounded-lg px-3 py-2 text-xs font-bold text-[#28242b] cursor-pointer">
                  <option value="newest">جدیدترین</option>
                  <option value="helpful">مفیدترین</option>
                  <option value="highest">بالاترین امتیاز</option>
                  <option value="lowest">پایین‌ترین امتیاز</option>
                </select>
              </div>
              <div className="flex items-center gap-2 flex-1">
                <span className="text-xs font-bold text-[#77717b] whitespace-nowrap">فیلتر:</span>
                <select value={ratingFilter} onChange={e => setRatingFilter(e.target.value)} className="flex-1 bg-white border border-[#e9e5eb] rounded-lg px-3 py-2 text-xs font-bold text-[#28242b] cursor-pointer">
                  <option value="all">همه امتیازها</option>
                  <option value="5">۵ ستاره</option>
                  <option value="4">۴ ستاره</option>
                  <option value="3">۳ ستاره</option>
                  <option value="2">۲ ستاره</option>
                  <option value="1">۱ ستاره</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              {displayReviews.map(review => (
                <div key={review.id} className="p-5 border border-[#e9e5eb] rounded-2xl bg-white hover:shadow-md transition-shadow">
                  <div className="flex flex-col md:flex-row justify-between items-start gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#fff0f7] to-[#fce5f0] text-[#c61d70] flex items-center justify-center font-black">
                        {review.name.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-sm text-[#28242b]">{review.name}</span>
                          {review.verifiedPurchase && (
                            <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded flex items-center gap-1">
                              <ShieldCheck size={10} /> خریدار تأیید شده
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-[#918a95]">{formatPersianDate(review.createdAt)}</span>
                      </div>
                    </div>
                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={16} fill={i < review.rating ? 'currentColor' : 'none'} className={i < review.rating ? '' : 'text-gray-300'} />
                      ))}
                    </div>
                  </div>

                  <p className="text-sm text-[#3a333f] leading-loose mb-4">{review.comment}</p>

                  {review.images && review.images.length > 0 && (
                    <div className="flex gap-2 mb-4 flex-wrap">
                      {review.images.map((img: string, i: number) => (
                        <button key={i} onClick={() => setLightboxImage(img)} className="relative w-20 h-20 rounded-xl overflow-hidden border border-[#e9e5eb] hover:scale-105 transition-transform">
                          <Image src={img} alt={`عکس نظر ${i}`} fill className="object-cover" />
                        </button>
                      ))}
                    </div>
                  )}

                  {review.adminReply && (
                    <div className="mb-4 bg-[#fff0f7] border-r-4 border-[#c61d70] p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <ShieldCheck size={14} className="text-[#c61d70]" />
                        <span className="text-xs font-black text-[#c61d70]">پاسخ فاطمه بیوتی لند</span>
                        <span className="text-[10px] text-[#918a95]">{formatPersianDate(review.adminReplyAt)}</span>
                      </div>
                      <p className="text-xs text-[#5a1038] leading-loose">{review.adminReply}</p>
                    </div>
                  )}

                  <div className="flex items-center gap-3 pt-3 border-t border-[#f5f0f2]">
                    <button onClick={() => handleVote(review.id, 'helpful')} disabled={votedReviews.has(review.id)} className="flex items-center gap-1.5 text-xs text-[#77717b] hover:text-emerald-600 transition-colors disabled:opacity-50 font-medium">
                      <ThumbsUp size={14} /> مفید ({review.helpfulCount.toLocaleString('fa-IR')})
                    </button>
                    <button onClick={() => handleVote(review.id, 'not-helpful')} disabled={votedReviews.has(review.id)} className="flex items-center gap-1.5 text-xs text-[#77717b] hover:text-rose-600 transition-colors disabled:opacity-50 font-medium">
                      <ThumbsDown size={14} /> غیرمفید ({review.notHelpfulCount.toLocaleString('fa-IR')})
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {reviews.length > 3 && (
              <button onClick={() => setShowAllReviews(!showAllReviews)} className="mt-6 mx-auto flex items-center gap-2 px-6 py-3 bg-[#f8f7fa] text-[#28242b] text-sm font-bold rounded-xl hover:bg-[#fff0f7] hover:text-[#c61d70] transition-colors">
                {showAllReviews ? 'نمایش کمتر' : `نمایش همه ${reviews.length} نظر`}
                <ChevronDown size={16} className={`transition-transform ${showAllReviews ? 'rotate-180' : ''}`} />
              </button>
            )}
          </>
        )}
      </div>

      {/* Lightbox */}
      {lightboxImage && (
        <div className="fixed inset-0 z-[200] bg-black/90 flex items-center justify-center p-4" onClick={() => setLightboxImage(null)}>
          <button onClick={() => setLightboxImage(null)} className="absolute top-4 right-4 text-white p-2 bg-white/10 rounded-full hover:bg-white/20">
            <X size={24} />
          </button>
          <div className="relative w-full max-w-2xl aspect-square" onClick={(e) => e.stopPropagation()}>
            <Image src={lightboxImage} alt="عکس نظر" fill className="object-contain" />
          </div>
        </div>
      )}
    </>
  );
}