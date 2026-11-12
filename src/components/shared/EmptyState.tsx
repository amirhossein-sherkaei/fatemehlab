import Link from 'next/link';
import { LucideIcon, ArrowLeft } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
  variant?: 'default' | 'cart' | 'wishlist' | 'orders' | 'search';
}

const VARIANT_STYLES: Record<string, { iconBg: string; iconColor: string; borderColor: string }> = {
  default: { iconBg: 'bg-[#fff0f7]', iconColor: 'text-[#c61d70]', borderColor: 'border-[#e9e5eb]' },
  cart: { iconBg: 'bg-[#fff0f7]', iconColor: 'text-[#c61d70]', borderColor: 'border-[#f2d7e5]' },
  wishlist: { iconBg: 'bg-rose-50', iconColor: 'text-rose-400', borderColor: 'border-rose-100' },
  orders: { iconBg: 'bg-blue-50', iconColor: 'text-blue-400', borderColor: 'border-blue-100' },
  search: { iconBg: 'bg-amber-50', iconColor: 'text-amber-500', borderColor: 'border-amber-100' },
};

export default function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
  variant = 'default',
}: EmptyStateProps) {
  const styles = VARIANT_STYLES[variant];

  const ActionButton = actionHref ? (
    <Link
      href={actionHref}
      className="inline-flex items-center gap-2 px-6 py-3 bg-[#c61d70] text-white text-sm font-bold rounded-xl shadow-lg shadow-[#c61d70]/20 hover:bg-[#a9155d] transition-all duration-300 hover:-translate-y-0.5"
    >
      {actionLabel}
      <ArrowLeft size={16} />
    </Link>
  ) : onAction ? (
    <button
      onClick={onAction}
      className="inline-flex items-center gap-2 px-6 py-3 bg-[#c61d70] text-white text-sm font-bold rounded-xl shadow-lg shadow-[#c61d70]/20 hover:bg-[#a9155d] transition-all duration-300 hover:-translate-y-0.5"
    >
      {actionLabel}
    </button>
  ) : null;

  return (
    <div
      className={`relative overflow-hidden rounded-3xl border-2 border-dashed ${styles.borderColor} bg-gradient-to-br from-white via-[#fafafc] to-[#f8f7fa] p-10 md:p-14 text-center`}
    >
      <div className="pointer-events-none absolute -top-20 -right-20 w-64 h-64 rounded-full bg-[#c61d70]/5 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-[#c61d70]/5 blur-3xl" />

      <div className="relative">
        <div
          className={`mx-auto w-24 h-24 rounded-full ${styles.iconBg} ${styles.iconColor} flex items-center justify-center mb-6 shadow-inner ring-8 ring-white/50`}
        >
          <Icon size={44} strokeWidth={1.5} />
        </div>

        <h3 className="text-xl md:text-2xl font-black text-[#28242b] mb-3">{title}</h3>
        <p className="text-sm text-[#77717b] leading-loose max-w-md mx-auto mb-8">{description}</p>

        {ActionButton}
      </div>
    </div>
  );
}