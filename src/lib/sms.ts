import { Smsir } from 'sms-typescript';

function getSmsir(): Smsir {
  const apiKey = process.env.SMSIR_API_KEY;
  const lineRaw = process.env.SMSIR_LINE_NUMBER;

  if (!apiKey || !lineRaw) {
    throw new Error('SMS config missing: SMSIR_API_KEY / SMSIR_LINE_NUMBER');
  }

  const cleaned = lineRaw
    .trim()
    .replace(/[۰-۹]/g, (d) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d)))
    .replace(/[٠-٩]/g, (d) => String('٠١٢٣٤٥٦٧٨٩'.indexOf(d)));

  const lineNumber = Number(cleaned);
  if (!Number.isFinite(lineNumber) || lineNumber <= 0) {
    throw new Error(`SMSIR_LINE_NUMBER invalid: "${lineRaw}"`);
  }

  return new Smsir(apiKey, lineNumber);
}

function serializeError(err: any) {
  // SMS.ir SDK may throw errors with a "response" containing the API's JSON body
  const out: any = {
    message: err?.message,
    name: err?.name,
    code: err?.code,
    status: err?.status,
    response_status: err?.response?.status,
    response_data: err?.response?.data,
    raw: undefined,
  };
  try {
    out.raw = JSON.stringify(err);
  } catch {
    out.raw = String(err);
  }
  return out;
}

export async function sendOtpCode(mobile: string, code: string) {
  try {
    const templateIdRaw = process.env.SMSIR_OTP_TEMPLATE_ID;
    const templateId = Number(templateIdRaw);
    if (!Number.isFinite(templateId) || templateId <= 0) {
      throw new Error(`SMSIR_OTP_TEMPLATE_ID invalid: "${templateIdRaw}"`);
    }

    const smsir = getSmsir();
    console.log('[SMS OTP] Attempting send:', { mobile, templateId });

    const result = await smsir.sendVerifyCode(mobile, templateId, [
      { name: 'Code', value: code },
    ]);

    console.log('[SMS OTP] Send result:', JSON.stringify(result));
    return { success: true, result };
  } catch (error: any) {
    console.error('[SMS OTP Error] Full details:', JSON.stringify(serializeError(error)));
    return { success: false, error };
  }
}

export async function sendOrderNotification(mobile: string, trackingCode: string) {
  try {
    const templateIdRaw = process.env.SMSIR_ORDER_TEMPLATE_ID;
    const templateId = Number(templateIdRaw);
    if (!Number.isFinite(templateId) || templateId <= 0) {
      throw new Error(`SMSIR_ORDER_TEMPLATE_ID invalid: "${templateIdRaw}"`);
    }

    const smsir = getSmsir();
    const result = await smsir.sendVerifyCode(mobile, templateId, [
      { name: 'TrackingCode', value: trackingCode },
    ]);
    console.log('[SMS Order] Send result:', JSON.stringify(result));
    return { success: true, result };
  } catch (error: any) {
    console.error('[SMS Order Error] Full details:', JSON.stringify(serializeError(error)));
    return { success: false, error };
  }
}
/**
 * ارسال اطلاع‌رسانی پاسخ پشتیبانی
 * Note: You need to create a template in SMS.ir with ID SMSIR_SUPPORT_TEMPLATE_ID
 * Template suggestion: "فاطمه بیوتی لند | پشتیبانی به تیکت شما پاسخ داد. موضوع: {0}"
 */
export async function sendSupportNotification(mobile: string, subject: string) {
  try {
    const apiKey = process.env.SMSIR_API_KEY || '';
    if (!apiKey) return { success: false };
    
    const templateId = Number(process.env.SMSIR_SUPPORT_TEMPLATE_ID);
    if (!templateId) {
      console.warn('[SMS Support] SMSIR_SUPPORT_TEMPLATE_ID not set. Skipping SMS.');
      return { success: false };
    }

    const smsir = getSmsir();
    const shortSubject = subject.length > 30 ? subject.substring(0, 30) + '...' : subject;
    
    const result = await smsir.sendVerifyCode(mobile, templateId, [
      { name: 'Subject', value: shortSubject },
    ]);
    return { success: true, result };
  } catch (error) {
    console.error('[SMS Support Error]', error);
    return { success: false, error };
  }
}
export async function sendBackInStockSms(mobile: string, productName: string) {
  try {
    const apiKey = process.env.SMSIR_API_KEY || '';
    if (!apiKey) return { success: false };
    
    // استفاده از یک قالب فرضی یا لاگ کردن
    const templateId = Number(process.env.SMSIR_STOCK_TEMPLATE_ID);
    if (!templateId) {
      console.warn(`[SMS Stock Notify] SMSIR_STOCK_TEMPLATE_ID not set. Mock sending to ${mobile} for ${productName}`);
      return { success: true };
    }

    const smsir = getSmsir();
    const shortName = productName.length > 30 ? productName.substring(0, 30) + '...' : productName;
    
    const result = await smsir.sendVerifyCode(mobile, templateId, [
      { name: 'ProductName', value: shortName },
    ]);
    return { success: true, result };
  } catch (error) {
    console.error('[SMS Stock Notify Error]', error);
    return { success: false, error };
  }
}