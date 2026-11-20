type GatewayEnvelope = {
  code?: number | string;
  message?: string;
  status?: string;
  ref_id?: string | number;
  data?: {
    code?: number | string;
    message?: string;
    status?: string;
    ref_id?: string | number;
  };
  errors?: { code?: number | string; message?: string };
};

export type ZarinpalInquiryState = {
  code: number;
  status: string;
  refId: string | null;
};

export type ZarinpalVerificationState = {
  code: number;
  refId: string | null;
};

function payloadOf(data: GatewayEnvelope) {
  return data?.data && typeof data.data === 'object' ? data.data : data;
}

export function parseZarinpalInquiry(data: GatewayEnvelope | null): ZarinpalInquiryState {
  const payload = data ? payloadOf(data) : undefined;
  const rawRef = payload?.ref_id ?? data?.ref_id;
  return {
    code: Number(payload?.code ?? data?.errors?.code ?? data?.code),
    status: String(payload?.status ?? data?.status ?? '').trim().toUpperCase(),
    refId: rawRef == null ? null : String(rawRef),
  };
}

export function parseZarinpalVerification(data: GatewayEnvelope | null): ZarinpalVerificationState {
  const payload = data ? payloadOf(data) : undefined;
  const rawRef = payload?.ref_id ?? data?.ref_id;
  return {
    code: Number(payload?.code ?? data?.errors?.code ?? data?.code),
    refId: rawRef == null ? null : String(rawRef),
  };
}

export async function inquireZarinpalAuthority(merchantId: string, authority: string) {
  const response = await fetch('https://payment.zarinpal.com/pg/v4/payment/inquiry.json', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ merchant_id: merchantId, authority }),
    cache: 'no-store',
    signal: AbortSignal.timeout(15000),
  });
  const data = await response.json().catch(() => null) as GatewayEnvelope | null;
  return { response, data, result: parseZarinpalInquiry(data) };
}

export async function verifyZarinpalAuthority(merchantId: string, amount: number, authority: string) {
  const response = await fetch('https://payment.zarinpal.com/pg/v4/payment/verify.json', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ merchant_id: merchantId, amount, authority }),
    cache: 'no-store',
    signal: AbortSignal.timeout(15000),
  });
  const data = await response.json().catch(() => null) as GatewayEnvelope | null;
  return { response, data, result: parseZarinpalVerification(data) };
}
