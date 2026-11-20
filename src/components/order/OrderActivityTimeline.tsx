import { formatPersianDate } from '@/lib/format';
import { Activity, CheckCircle2, CreditCard, Package, ShieldCheck, Truck, XCircle, Clock } from 'lucide-react';

type OrderEvent = {
  id: string;
  eventType: string;
  summary: string;
  fromStatus: string | null;
  toStatus: string | null;
  createdAt: Date;
};

const STATUS_LABELS: Record<string, string> = {
  pending: 'در انتظار پرداخت',
  paid: 'پرداخت تأیید شد',
  processing: 'در حال آماده‌سازی',
  shipped: 'ارسال شد',
  delivered: 'تحویل شد',
  cancelled: 'لغو شد',
};

function eventPresentation(eventType: string) {
  if (eventType.includes('verified') || eventType.includes('settled')) return { Icon: CheckCircle2, tone: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
  if (eventType.includes('failed') || eventType.includes('reversed') || eventType.includes('cancelled')) return { Icon: XCircle, tone: 'text-rose-700 bg-rose-50 border-rose-200' };
  if (eventType.includes('request') || eventType.includes('authority') || eventType.includes('in_bank')) return { Icon: CreditCard, tone: 'text-sky-700 bg-sky-50 border-sky-200' };
  if (eventType.includes('status_changed')) return { Icon: Truck, tone: 'text-violet-700 bg-violet-50 border-violet-200' };
  if (eventType.includes('created')) return { Icon: Package, tone: 'text-[#a92768] bg-[#fff3f8] border-[#f2d7e5]' };
  if (eventType.includes('refund')) return { Icon: ShieldCheck, tone: 'text-amber-700 bg-amber-50 border-amber-200' };
  return { Icon: Activity, tone: 'text-slate-600 bg-slate-50 border-slate-200' };
}

export default function OrderActivityTimeline({ events, compact = false }: { events: OrderEvent[]; compact?: boolean }) {
  if (!events.length) {
    return (
      <div className="rounded-2xl border border-dashed border-[#e8e1e7] bg-[#fcfafc] px-4 py-6 text-center">
        <Clock className="mx-auto mb-2 text-[#a69aa5]" size={20} />
        <p className="text-xs text-[#837985]">تاریخچه رویدادهای این سفارش هنوز ثبت نشده است.</p>
      </div>
    );
  }

  return (
    <ol className={`relative ${compact ? 'space-y-3' : 'space-y-4'}`} aria-label="تاریخچه رویدادهای سفارش">
      {events.map((event, index) => {
        const { Icon, tone } = eventPresentation(event.eventType);
        const hasTransition = Boolean(event.fromStatus || event.toStatus);
        return (
          <li key={event.id} className="relative flex gap-3">
            {index < events.length - 1 && <span aria-hidden="true" className="absolute right-[17px] top-9 bottom-[-14px] w-px bg-[#ebe4eb]" />}
            <span className={`relative z-[1] flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${tone}`}>
              <Icon size={16} />
            </span>
            <div className="min-w-0 flex-1 pb-1">
              <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
                <p className="text-sm font-bold text-[#302832]">{event.summary}</p>
                <time className="shrink-0 text-[10px] tabular-nums text-[#958996]">{formatPersianDate(event.createdAt)}</time>
              </div>
              {hasTransition && (
                <p className="mt-1 text-[10px] text-[#887d89]">
                  {event.fromStatus ? STATUS_LABELS[event.fromStatus] || event.fromStatus : 'شروع'}
                  {event.toStatus ? ` ← ${STATUS_LABELS[event.toStatus] || event.toStatus}` : ''}
                </p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
