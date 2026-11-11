const ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;
const API_TOKEN = process.env.CLOUDFLARE_API_TOKEN;

if (!ACCOUNT_ID || !API_TOKEN) {
  console.error('❌ متغیرهای محیطی تنظیم نشده‌اند.');
  process.exit(1);
}

console.log('🔑 Account ID:', ACCOUNT_ID);
console.log('🔑 Token length:', API_TOKEN.length);
console.log('');

// لیست مدل‌ها و مسیرهای مختلف برای تست
const modelsToTest = [
  { name: 'FLUX Schnell (با عدد 1)', path: '@cf/black-forest-labs/flux-1-schnell' },
  { name: 'FLUX Schnell (بدون عدد 1)', path: '@cf/black-forest-labs/flux-schnell' },
  { name: 'Stable Diffusion XL', path: '@cf/stabilityai/stable-diffusion-xl-base-1.0' },
  { name: 'Stable Diffusion XL Lightning', path: '@cf/bytedance/stable-diffusion-xl-lightning' },
  { name: 'FLUX.1 Dev', path: '@cf/black-forest-labs/flux-1-dev' },
];

async function testAll() {
  for (const model of modelsToTest) {
    const url = `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/ai/run/${model.path}`;
    console.log(`🧪 تست: ${model.name}`);
    console.log(`   URL: ${url}`);
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: 'A minimalist editorial magazine cover, soft pink and cream tones, elegant, no text, 8k',
        }),
      });
      
      console.log(`   📡 وضعیت: ${response.status}`);
      
      if (response.ok) {
        console.log(`   ✅✅✅ این مدل کار می‌کند! ✅✅✅`);
        const contentType = response.headers.get('content-type');
        console.log(`   📋 نوع پاسخ: ${contentType}`);
        
        if (contentType?.includes('application/json')) {
          const data = await response.json();
          console.log(`   📦 success: ${data.success}`);
          if (data.result?.image) {
            console.log(`   🖼️ تصویر Base64 دریافت شد (طول: ${data.result.image.length})`);
          }
        } else {
          const buffer = await response.arrayBuffer();
          console.log(`   🖼️ تصویر مستقیم دریافت شد (${buffer.byteLength} بایت)`);
        }
        return model; // اولین مدل موفق را برگردان
      } else {
        const errText = await response.text();
        console.log(`   ❌ خطا: ${errText.substring(0, 200)}`);
      }
    } catch (error: any) {
      console.log(`   ❌ خطای شبکه: ${error.message}`);
    }
    console.log('');
  }
  
  console.error('❌ هیچ مدلی کار نکرد. لطفاً مستندات Cloudflare را بررسی کنید.');
  return null;
}

testAll().then((result) => {
  if (result) {
    console.log('');
    console.log('🎯 مدل پیشنهادی:');
    console.log(`   نام: ${result.name}`);
    console.log(`   مسیر: ${result.path}`);
  }
  process.exit(0);
});