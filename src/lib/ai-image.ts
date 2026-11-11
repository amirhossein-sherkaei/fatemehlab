import { put } from '@vercel/blob';

const CLOUDFLARE_API_URL = `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/ai/run/@cf/black-forest-labs/flux-1-schnell`;

// Prompts ساده‌تر و ایمن‌تر — کلمات NSFW-trigger حذف شدند
const promptTemplates: Record<string, string> = {
  education: 'A minimalist magazine illustration, soft cream and dusty pink palette, gentle organic shapes, elegant composition, plain white background, no text, no people, no faces, 4:5 aspect ratio, 8k',
  'buying-guide': 'A clean magazine illustration, warm beige and muted sage palette, minimalist geometric composition, gentle abstract lines, plain background, no text, no people, no faces, 4:5 aspect ratio, 8k',
  skincare: 'An elegant beauty magazine illustration, soft rose and cream gradient, gentle abstract shapes, minimalist aesthetic, no text, no people, no faces, 4:5 aspect ratio, 8k',
  haircare: 'A premium magazine illustration, warm gold and cream tones, gentle flowing abstract lines, minimalist composition, no text, no people, no faces, 4:5 aspect ratio, 8k',
  makeup: 'A high-fashion magazine illustration, soft pink and beige tones, elegant abstract shapes, minimalist composition, no text, no people, no faces, 4:5 aspect ratio, 8k',
};

async function attemptGenerate(prompt: string): Promise<Buffer> {
  const response = await fetch(CLOUDFLARE_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ prompt, steps: 4 }),
  });

  if (!response.ok) {
    const errText = await response.text();
    const err: any = new Error(`CF ${response.status}: ${errText.substring(0, 200)}`);
    err.status = response.status;
    err.nsfw = errText.includes('NSFW') || errText.includes('8007');
    throw err;
  }

  const ct = response.headers.get('content-type') || '';
  if (ct.includes('application/json')) {
    const data = await response.json();
    if (!data.success || !data.result?.image) {
      throw new Error('Invalid CF response');
    }
    return Buffer.from(data.result.image, 'base64');
  }
  const ab = await response.arrayBuffer();
  return Buffer.from(ab);
}

export async function generateArticleCover(title: string, category: string): Promise<string> {
  const basePrompt = promptTemplates[category] || promptTemplates.education;
  
  // سه نسخه مختلف — اگر اولی NSFW داد، دومی و سومی ساده‌ترند
  const variations = [
    basePrompt,
    'Minimalist soft pastel abstract art, elegant geometric shapes, plain white background, no text, no people, no faces, 4:5 aspect ratio, 8k',
    'Clean modern magazine design, muted cream and blush colors, abstract pattern, no text, no people, no faces, 4:5 aspect ratio, 8k',
  ];

  let lastError: any = null;
  for (let i = 0; i < variations.length; i++) {
    try {
      console.log(`  🎨 تلاش ${i + 1}/${variations.length} برای: ${title}`);
      const buf = await attemptGenerate(variations[i]);
      
      const filename = `ai-cover-${Date.now()}.jpg`;
      const blob = await put(filename, buf, {
        access: 'public',
        contentType: 'image/jpeg',
        token: process.env.BLOB_READ_WRITE_TOKEN,
      });
      
      console.log(`  ✅ آپلود شد: ${blob.url}`);
      return blob.url;
    } catch (e: any) {
      lastError = e;
      if (e.nsfw) {
        console.log(`  ⚠️ NSFW — تلاش دوباره با prompt ساده‌تر`);
        await new Promise(r => setTimeout(r, 800));
        continue;
      }
      throw e;
    }
  }
  
  throw lastError || new Error('All attempts failed');
}