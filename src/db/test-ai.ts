import { generateArticleCover } from '../lib/ai-image';

async function testAI() {
  console.log('🧪 شروع تست تولید عکس با Cloudflare...');
  console.log('🔑 Account ID:', process.env.CLOUDFLARE_ACCOUNT_ID ? 'موجود ✅' : 'ناموجود ❌');
  console.log('🔑 API Token:', process.env.CLOUDFLARE_API_TOKEN ? 'موجود ✅' : 'ناموجود ❌');
  
  if (!process.env.CLOUDFLARE_ACCOUNT_ID || !process.env.CLOUDFLARE_API_TOKEN) {
    console.error('❌ متغیرهای محیطی تنظیم نشده‌اند.');
    process.exit(1);
  }

  try {
    const imageUrl = await generateArticleCover('تست تولید عکس', 'education');
    console.log('');
    console.log('🎉🎉🎉 موفقیت! 🎉🎉🎉');
    console.log('📸 لینک عکس:', imageUrl);
    console.log('حالا می‌توانید این لینک را در مرورگر باز کنید تا عکس را ببینید.');
  } catch (error: any) {
    console.error('');
    console.error('❌❌❌ خطا! ❌❌❌');
    console.error('پیام:', error.message);
  }
  process.exit(0);
}
testAI();