import { createHmac, randomUUID } from "node:crypto";

type ZibalRelayAction = "request" | "verify" | "inquiry";

/**
 * Sends Zibal IPG calls through the authenticated Google Apps Script relay.
 * Local development can use the direct gateway when relay variables are absent.
 * Production fails closed instead of falling back to Vercel's variable egress IP.
 */
async function zibalRelayFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  const inputUrl =
    typeof input === "string" ? input :
    input instanceof URL ? input.toString() :
    input.url;

  let parsedUrl: URL;
  try {
    parsedUrl = new URL(inputUrl);
  } catch {
    return globalThis.fetch(input, init);
  }

  if (parsedUrl.hostname !== "gateway.zibal.ir") {
    return globalThis.fetch(input, init);
  }

  const pathActions: Record<string, ZibalRelayAction> = {
    "/v1/request": "request",
    "/v1/verify": "verify",
    "/v1/inquiry": "inquiry",
  };
  const action = pathActions[parsedUrl.pathname];
  if (!action) return globalThis.fetch(input, init);

  const relayUrl = process.env.ZIBAL_RELAY_URL?.trim();
  const secret = process.env.ZIBAL_RELAY_SECRET?.trim();

  if (!relayUrl || !secret) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("Zibal relay is not configured: ZIBAL_RELAY_URL and ZIBAL_RELAY_SECRET are required.");
    }
    return globalThis.fetch(input, init);
  }

  if (typeof init?.body !== "string") {
    throw new Error("Zibal relay requires a JSON string request body.");
  }

  let payload: unknown;
  try {
    payload = JSON.parse(init.body);
  } catch {
    throw new Error("Zibal relay received an invalid JSON request body.");
  }

  const timestamp = String(Math.floor(Date.now() / 1000));
  const nonce = randomUUID();
  const canonical = `1.${timestamp}.${nonce}.${action}.${JSON.stringify(payload)}`;
  const signature = createHmac("sha256", secret).update(canonical, "utf8").digest("base64");

  const relayResponse = await globalThis.fetch(relayUrl, {
    method: "POST",
    headers: { "content-type": "application/json", "accept": "application/json" },
    body: JSON.stringify({ version: 1, timestamp, nonce, action, payload, signature }),
    cache: "no-store",
    redirect: "follow",
  });

  if (!relayResponse.ok) {
    const detail = await relayResponse.text().catch(() => "");
    throw new Error(`Zibal relay HTTP ${relayResponse.status}: ${detail.slice(0, 300)}`);
  }

  const envelope = await relayResponse.json() as {
    data?: unknown;
    gatewayHttpStatus?: unknown;
  };

  if (!envelope || typeof envelope !== "object" || !("data" in envelope)) {
    throw new Error("Zibal relay returned an invalid response envelope.");
  }

  const candidateStatus = Number(envelope.gatewayHttpStatus);
  const status = Number.isInteger(candidateStatus) && candidateStatus >= 200 && candidateStatus <= 599
    ? candidateStatus
    : 200;

  return new Response(JSON.stringify(envelope.data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}
/** Server-only HTTP client for the Zibal IPG API. Never import this module in a client component. */

type ZibalEnvelope = {
  result?: unknown;
  status?: unknown;
  amount?: unknown;
  trackId?: unknown;
  refNumber?: unknown;
  message?: unknown;
  orderId?: unknown;
};

export type ZibalState = {
  result: number | null;
  status: number | null;
  amount: number | null;
  trackId: string | null;
  refNumber: string | null;
  message: string;
};

function safeInteger(value: unknown): number | null {
  const parsed = typeof value === 'number'
    ? value
    : typeof value === 'string' && /^-?\d+$/.test(value.trim())
      ? Number(value.trim())
      : NaN;
  return Number.isSafeInteger(parsed) ? parsed : null;
}

function optionalString(value: unknown): string | null {
  if (typeof value === 'string' && value.trim()) return value.trim().slice(0, 160);
  if (typeof value === 'number' && Number.isFinite(value)) return String(value);
  return null;
}

export function parseZibalState(data: unknown): ZibalState {
  const payload = data && typeof data === 'object' ? data as ZibalEnvelope : {};
  const normalizedTrackId = normalizeZibalTrackId(payload.trackId);
  return {
    result: safeInteger(payload.result),
    status: safeInteger(payload.status),
    amount: safeInteger(payload.amount),
    trackId: normalizedTrackId,
    refNumber: optionalString(payload.refNumber),
    message: typeof payload.message === 'string' ? payload.message.slice(0, 180) : '',
  };
}

export function normalizeZibalTrackId(value: unknown): string | null {
  if (typeof value !== 'string' && typeof value !== 'number') return null;
  const raw = String(value).trim();
  if (!/^\d{1,16}$/.test(raw)) return null;
  const parsed = Number(raw);
  if (!Number.isSafeInteger(parsed) || parsed <= 0) return null;
  return String(parsed);
}

export function zibalStartUrl(trackId: string): string {
  const normalized = normalizeZibalTrackId(trackId);
  if (!normalized) throw new Error('Invalid Zibal trackId');
  return `https://gateway.zibal.ir/start/${normalized}`;
}

export async function requestZibalPayment(input: {
  merchant: string;
  amount: number;
  callbackUrl: string;
  description: string;
  orderId: string;
}) {
  if (!input.merchant.trim() || input.merchant.length > 128) throw new Error('Invalid Zibal merchant configuration');
  if (!Number.isSafeInteger(input.amount) || input.amount <= 0) throw new Error('Invalid Zibal amount in Rials');
  const callback = new URL(input.callbackUrl);
  if (callback.protocol !== 'https:' && process.env.NODE_ENV === 'production') throw new Error('Zibal callback URL must use HTTPS');
  const response = await zibalRelayFetch('https://gateway.zibal.ir/v1/request', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      merchant: input.merchant,
      amount: input.amount,
      callbackUrl: input.callbackUrl,
      description: input.description.slice(0, 200),
      orderId: input.orderId,
    }),
    cache: 'no-store',
    signal: AbortSignal.timeout(15000),
  });
  const data = await response.json().catch(() => null) as ZibalEnvelope | null;
  return { response, data, state: parseZibalState(data) };
}

export async function verifyZibalPayment(merchant: string, trackId: string) {
  if (!merchant.trim() || merchant.length > 128) throw new Error('Invalid Zibal merchant configuration');
  const normalized = normalizeZibalTrackId(trackId);
  if (!normalized) throw new Error('Invalid Zibal trackId');

  const response = await zibalRelayFetch('https://gateway.zibal.ir/v1/verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ merchant, trackId: Number(normalized) }),
    cache: 'no-store',
    signal: AbortSignal.timeout(15000),
  });
  const data = await response.json().catch(() => null) as ZibalEnvelope | null;
  return { response, data, state: parseZibalState(data) };
}

/**
 * Zibal result 100 means the verification request succeeded; status 1 means paid.
 * Result 201 means the same transaction was already verified. In that case we
 * still require the exact amount, and reject a contradictory non-paid status.
 */
export function isZibalPaymentVerified(state: ZibalState, expectedAmount: number): boolean {
  if (state.amount !== expectedAmount) return false;
  if (state.result === 100) return state.status === 1;
  return state.result === 201 && (state.status === 1 || state.status === null);
}

export function isZibalInProgress(state: ZibalState): boolean {
  return state.status === -1 || state.status === 2;
}

/** A definitive 202 response is a failed payment unless the provider says it is still pending/unverified. */
export function isZibalDefinitiveFailure(state: ZibalState): boolean {
  return state.result === 202 && state.status !== 1 && !isZibalInProgress(state);
}
