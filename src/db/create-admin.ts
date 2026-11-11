import 'dotenv/config';
import { db } from '../lib/db';
import { adminUsers } from './schema';
import * as argon2 from 'argon2';

async function createAdmin() {
  const email = process.argv[2];
  const password = process.argv[3];

  if (!email || !password) {
    console.log('❌ لطفاً ایمیل و رمز عبور را وارد کنید.');
    process.exit(1);
  }

  try {
    console.log('🔒 در حال هش کردن رمز عبور...');
    const passwordHash = await argon2.hash(password);

    await db.insert(adminUsers).values({
      email,
      passwordHash,
      role: 'super_admin',
    });

    console.log('✅ ادمین با موفقیت ساخته شد!');
    process.exit(0);
  } catch (error) {
    console.error('❌ خطا در ساخت ادمین:', error);
    process.exit(1);
  }
}
createAdmin();
