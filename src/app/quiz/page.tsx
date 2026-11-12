'use client';

import { useState } from 'react';
import Link from 'next/link';
import SafeImage from '@/components/product/SafeImage';
import { formatToman } from '@/lib/currency';
import { getPublicProductImage } from '@/lib/product-content';
import { Sparkles, ArrowLeft, ArrowRight, Check, Droplets, Sun, Moon, Heart, Shield, Wand2 } from 'lucide-react';

type Step = 1 | 2 | 3 | 'result';

const QUESTIONS = [
  {
    id: 1,
    title: 'نوع پوست شما چیست؟',
    options: [
      { label: 'خشک (حس کشیدگی)', value: 'پوست خشک', icon: Droplets },
      { label: 'چرب (براقی و جوش)', value: 'پوست چرب', icon: Sun },
      { label: 'مختلط (چرب در T Zone)', value: 'پوست مختلط', icon: Moon },
      { label: 'حساس (قرمزی و خارش)', value: 'پوست حساس', icon: Shield },
    ],
  },
  {
    id: 2,
    title: 'مهم‌ترین دغدغه شما چیست؟',
    options: [
      { label: 'آبرسانی و شادابی', value: 'آبرسان', icon: Droplets },
      { label: 'رفع لک و روشن‌کنندگی', value: 'روشن‌کننده', icon: Sparkles },
      { label: 'ضد چین و چروک (پیری)', value: 'ضد پیری', icon: Heart },
      { label: 'کنترل چربی و جوش', value: 'ضد جوش', icon: Shield },
    ],
  },
  {
    id: 3,
    title: 'روتین مورد علاقه شما چگونه است؟',
    options: [
      { label: 'سبک و سریع (۲ مرحله)', value: 'سبک', icon: Sun },
      { label: 'کامل و دقیق (۴+ مرحله)', value: 'کامل', icon: Moon },
      { label: 'فقط مراقبت‌های شب', value: 'شب', icon: Moon },
      { label: 'به دنبال محصولات آرایشی', value: 'آرایشی', icon: Wand2 },
    ],
  },
];

export default function QuizPage() {
  const [step, setStep] = useState<Step>(1);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSelect = (questionId: number, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
    setTimeout(() => {
      if (step === 1) setStep(2);
      else if (step === 2) setStep(3);
      else if (step === 3) handleFinish({ ...answers, [questionId]: value });
    }, 300);
  };

  const handleFinish = async (finalAnswers: Record<number, string>) => {
    setStep('result');
    setLoading(true);
    
    try {
      const query = new URLSearchParams();
      query.set('skinType', finalAnswers[1]);
      query.set('concern', finalAnswers[2]);
      query.set('routine', finalAnswers[3]);
      
      const res = await fetch(`/api/quiz?${query.toString()}`);
      const data = await res.json();
      if (data.success) setResults(data.products);
    } catch (err) {
      console.error('Quiz error', err);
    } finally {
      setLoading(false);
    }
  };

  const resetQuiz = () => {
    setStep(1);
    setAnswers({});
    setResults([]);
  };

  return (
    <div className="min-h-screen bg-[#fafafc] relative overflow-hidden flex flex-col items-center justify-center p-4 py-12" dir="rtl">
      {/* افکت‌های پس‌زمینه */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute top-0 right-0 w-[40vw] h-[40vw] bg-[#c61d70]/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-[50vw] h-[50vw] bg-[#f4b7d5]/20 rounded-full blur-[80px]" />
      </div>

      <div className="relative z-10 w-full max-w-2xl">
        <Link href="/" className="inline-flex items-center gap-2 text-xs font-bold text-[#c61d70] mb-6 hover:underline transition-all">
          <ArrowLeft size={14} /> بازگشت به فروشگاه
        </Link>

        <div className="bg-white/80 backdrop-blur-3xl rounded-[2.5rem] shadow-[0_30px_80px_-20px_rgba(198,29,112,0.2)] border border-white p-8 md:p-12 overflow-hidden">
          
          {step !== 'result' && (
            <div className="mb-8 text-center">
              <div className="mx-auto w-16 h-16 bg-[#fff0f7] text-[#c61d70] rounded-2xl flex items-center justify-center mb-5 shadow-sm border border-[#f2d7e5]">
                <Wand2 size={28} />
              </div>
              <h1 className="text-2xl font-black text-[#28242b]">آزمون هوشمند پوست</h1>
              <p className="text-sm text-[#77717b] mt-2">به ۳ سوال پاسخ دهید تا محصول مناسب شما را پیدا کنیم</p>
            </div>
          )}

          {/* نوار پیشرفت */}
          {step !== 'result' && (
            <div className="flex items-center justify-center gap-2 mb-10">
              {[1, 2, 3].map((n) => (
                <div key={n} className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${step >= n ? 'bg-[#c61d70]' : 'bg-[#e9e5eb]'}`} />
              ))}
            </div>
          )}

          {/* سوالات */}
          {step !== 'result' && QUESTIONS[(step as number) - 1] && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
              <h2 className="text-lg font-black text-[#28242b] mb-6 text-center">{QUESTIONS[(step as number) - 1].title}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {QUESTIONS[(step as number) - 1].options.map((opt) => {
                  const Icon = opt.icon;
                  const isSelected = answers[(step as number)] === opt.value;
                  return (
                    <button
                      key={opt.value}
                      onClick={() => handleSelect((step as number), opt.value)}
                      className={`p-4 rounded-2xl border text-right flex items-center gap-3 transition-all duration-300 ${
                        isSelected 
                          ? 'border-[#c61d70] bg-[#fff0f7] text-[#c61d70] shadow-md shadow-[#c61d70]/10 scale-[1.02]' 
                          : 'border-[#e9e5eb] bg-white text-[#77717b] hover:border-[#c61d70]/40 hover:bg-[#fafafc]'
                      }`}
                    >
                      <div className={`p-2 rounded-xl ${isSelected ? 'bg-[#c61d70] text-white' : 'bg-[#f8f7fa] text-[#918a95]'}`}>
                        <Icon size={20} />
                      </div>
                      <span className="text-sm font-bold flex-1">{opt.label}</span>
                      {isSelected && <Check size={18} />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* نمایش نتیجه */}
          {step === 'result' && (
            <div className="animate-in zoom-in-95 duration-500">
              <div className="text-center mb-8">
                <div className="mx-auto w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-4 shadow-inner">
                  <Sparkles size={36} />
                </div>
                <h2 className="text-2xl font-black text-[#28242b]">محصولات پیشنهادی برای شما</h2>
                <p className="text-sm text-[#77717b] mt-2">بر اساس پاسخ‌های شما، این محصولات بهترین انتخاب هستند</p>
              </div>

              {loading ? (
                <div className="py-12 text-center">
                  <div className="w-10 h-10 border-4 border-[#c61d70] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                  <p className="text-sm text-[#77717b]">در حال پیدا کردن محصولات...</p>
                </div>
              ) : results.length === 0 ? (
                <div className="text-center py-10 bg-[#f8f7fa] rounded-2xl border border-[#e9e5eb]">
                  <p className="text-sm text-[#77717b]">متأسفانه محصولی با این مشخصات پیدا نشد. لطفاً با پشتیبانی تماس بگیرید.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {results.map((product) => {
                    const img = getPublicProductImage(product.mainImage);
                    return (
                      <Link key={product.id} href={`/products/${product.slug}`} className="group bg-white rounded-2xl border border-[#e9e5eb] overflow-hidden hover:shadow-xl transition-all duration-300">
                        <div className="relative aspect-square bg-[#fafafc] p-4">
                          <SafeImage src={img} alt={product.name} fill className="object-contain group-hover:scale-105 transition-transform" />
                        </div>
                        <div className="p-4">
                          <h3 className="text-sm font-black text-[#28242b] truncate group-hover:text-[#c61d70] transition-colors">{product.name}</h3>
                          <p className="text-xs font-black text-[#c61d70] mt-2">{product.price > 0 ? formatToman(product.price) : 'به زودی'}</p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}

              <div className="mt-8 flex justify-center">
                <button onClick={resetQuiz} className="px-6 py-3 bg-[#f8f7fa] border border-[#e9e5eb] text-[#28242b] text-sm font-bold rounded-xl hover:bg-white transition-all">
                  شرکت مجدد در آزمون
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}