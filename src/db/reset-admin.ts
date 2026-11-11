import 'dotenv/config';
import { db } from '../lib/db';
import { adminUsers } from './schema';
import { eq } from 'drizzle-orm';
import * as argon2 from 'argon2';

async function resetAdmin() {
  const email = 'amirgt206@gmail.com';
  const password = '32842914';

  try {
    console.log('🔒 در حال هش کردن رمز عبور...');
    const passwordHash = await argon2.hash(password);

    // حذف ادمین قبلی (اگر وجود داشته باشد) برای جلوگیری از تداخل
    await db.delete(adminUsers).where(eq(adminUsers.email, email));

    // ساخت ادمین جدید
    await db.insert(adminUsers).values({
      email,
      passwordHash,
      role: 'super_admin',
    });

    console.log('✅ ادمین با موفقیت ساخته و بازنشانی شد!');
    console.log('📧 ایمیل:', email);
    console.log('🔑 رمز عبور:', password);
    process.exit(0);
  } catch (error) {
    console.error('❌ خطا در ساخت ادمین:', error);
    process.exit(1);
  }
}
resetAdmin();
