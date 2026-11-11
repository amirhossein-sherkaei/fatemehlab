import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { customers } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { createCustomerToken } from '@/lib/customer-auth';
import { Redis } from '@upstash/redis';
import { cookies } from 'next/headers';

const memoryStore = new Map<string, string>();

function getRedis(): Redis | null {
  try {
    const url = process.env.UPSTASH_REDIS_REST_URL;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN;
    if (!url || !token || url.trim() === '' || token.trim() === '') return null;
    return new Redis({ url, token });
  } catch {
    return null;
  }
}

const IS_BYPASS = process.env.SMS_BYPASS_MODE === 'true';

export async function POST(req: Request) {
  try {
    const { mobile, code } = await req.json();

    if (!mobile || !code) {
      return NextResponse.json({ message: 'اطلاعات ناقص است.' }, { status: 400 });
    }

    // ===== OTP VALIDATION =====
    let isValid = false;

    if (IS_BYPASS) {
      console.log(`[Verify OTP] BYPASS mode active for ${mobile}`);
      isValid = true;
    } else {
      const redis = getRedis();
      let storedCode: string | null = null;

      if (redis) {
        storedCode = await redis.get(`otp:${mobile}`);
      } else {
        storedCode = memoryStore.get(mobile) || null;
      }

      // Cookie fallback for serverless without Redis
      if (!storedCode) {
        const cookieStore = await cookies();
        const otpCookie = cookieStore.get(`otp_${mobile}`)?.value;
        if (otpCookie) storedCode = otpCookie.split('.')[0];
      }

      if (storedCode && storedCode === code) isValid = true;
    }

    if (!isValid) {
      return NextResponse.json({ message: 'کد تأیید نامعتبر یا منقضی شده است.' }, { status: 400 });
    }

    // Clean up
    const redis = getRedis();
    if (redis) await redis.del(`otp:${mobile}`);
    memoryStore.delete(mobile);

    // ===== USER DETECTION =====
    // Look up ALL accounts with this phone number
    const existingUsers = await db
      .select()
      .from(customers)
      .where(eq(customers.phone, mobile));

    let customer;
    let isNewUser = false;
    let needsOnboarding = false;

    if (existingUsers.length === 0) {
      // ===== BRAND NEW USER =====
      console.log(`[OTP] New user - creating account for ${mobile}`);
      const [newCustomer] = await db
        .insert(customers)
        .values({
          name: `کاربر ${mobile.slice(-4)}`,
          email: `${mobile}@temp.fatemehlab.ir`,
          phone: mobile,
          passwordHash: '',
        })
        .returning();
      customer = newCustomer;
      isNewUser = true;
      needsOnboarding = true;
    } else if (existingUsers.length === 1) {
      // ===== EXISTING USER - WELCOME BACK =====
      customer = existingUsers[0];
      isNewUser = false;

      // Check if they completed onboarding
      needsOnboarding = customer.email.endsWith('@temp.fatemehlab.ir');

      console.log(`[OTP] Existing user logged in - ${mobile} | Onboarded: ${!needsOnboarding}`);
    } else {
      // ===== DATA INTEGRITY ISSUE (Multiple accounts with same phone) =====
      console.error(`[SECURITY ALERT] Multiple accounts (${existingUsers.length}) found with phone ${mobile}.`);
      console.error(`Account IDs: ${existingUsers.map(u => u.id).join(', ')}`);

      // Pick the oldest account (most likely the "real" one)
      // Sort by createdAt ascending to get the earliest
      existingUsers.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      customer = existingUsers[0];
      isNewUser = false;
      needsOnboarding = customer.email.endsWith('@temp.fatemehlab.ir');
    }

    // ===== CREATE JWT =====
    const token = await createCustomerToken({
      id: customer.id,
      email: customer.email,
      name: customer.name,
    });

    const response = NextResponse.json({
      success: true,
      isNewUser,
      needsOnboarding,
      // Legacy fields for backward compatibility
      customer: {
        id: customer.id,
        name: customer.name,
        email: customer.email,
      },
    });

    response.cookies.set('customer_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('[Verify OTP Error]', error);
    return NextResponse.json({ message: 'خطای سرور' }, { status: 500 });
  }
}