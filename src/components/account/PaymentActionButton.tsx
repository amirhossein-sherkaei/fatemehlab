"use client";

import { useState } from "react";
import { CreditCard, Loader2, ShieldCheck } from "lucide-react";

type Props = {
  orderId: string;
  compact?: boolean;
  className?: string;
  label?: string;
};

function validatePaymentDestination(rawUrl: string): URL {
  const destination = new URL(rawUrl, window.location.origin);
  const ownSuccessPage = destination.origin === window.location.origin
    && destination.pathname === "/order/success"
    && Boolean(destination.searchParams.get("id"))
    && Boolean(destination.searchParams.get("code"));
  const gatewayPath = /^\/pg\/StartPay\/[A-Za-z0-9_-]{8,128}$/;
  const trustedGateway = destination.protocol === "https:"
    && destination.origin === "https://payment.zarinpal.com"
    && gatewayPath.test(destination.pathname)
    && !destination.username
    && !destination.password;
  if (!ownSuccessPage && !trustedGateway) throw new Error("نشانی مقصد پرداخت معتبر نیست؛ برای امنیت شما انتقال انجام نشد.");
  return destination;
}

export default function PaymentActionButton({
  orderId,
  compact = false,
  className = "",
  label = "ادامه پرداخت امن",
}: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isUncertain, setIsUncertain] = useState(false);

  const continuePayment = async () => {
    if (loading) return;
    setLoading(true);
    setError("");
    setIsUncertain(false);

    try {
      const response = await fetch("/api/payment/request", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ orderId }),
        cache: "no-store",
      });
      const data = await response.json().catch(() => null);
      if (!response.ok || !data?.success || typeof data?.redirectUrl !== "string") {
        setIsUncertain(Boolean(data?.uncertain) || response.status >= 500);
        throw new Error(data?.message || "امکان ادامه پرداخت وجود ندارد. وضعیت سفارش را دوباره بررسی کنید.");
      }
      const destination = validatePaymentDestination(data.redirectUrl);
      window.location.replace(destination.toString());
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "ارتباط با سرور برقرار نشد. دوباره تلاش کنید.");
      setLoading(false);
    }
  };

  return (
    <div className={className}>
      <button
        type="button"
        onClick={continuePayment}
        disabled={loading}
        aria-busy={loading}
        className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-[#c61d70] px-4 py-2.5 text-xs font-bold text-white shadow-sm transition-colors hover:bg-[#a9155d] disabled:cursor-not-allowed disabled:opacity-60 ${compact ? "whitespace-nowrap" : "w-full sm:w-auto"}`}
      >
        {loading ? <Loader2 size={15} className="animate-spin" /> : <CreditCard size={15} />}
        {loading ? "در حال استعلام تراکنش..." : label}
        {!loading && <ShieldCheck size={14} aria-hidden="true" />}
      </button>
      {error && (
        <p role="alert" aria-live="polite" className={`mt-2 max-w-sm text-right text-[11px] leading-6 ${isUncertain ? "text-amber-700" : "text-rose-600"}`}>
          {error}
          {isUncertain && " تا مشخص‌شدن نتیجه، پرداخت تازه‌ای انجام ندهید."}
        </p>
      )}
    </div>
  );
}
