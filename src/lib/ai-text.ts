// سرویس اصلی: LLM7.io
const LLM7_ENDPOINT = 'https://api.llm7.io/v1/chat/completions';
const LLM7_MODEL = 'default';
const LLM7_TOKEN = process.env.LLM7_API_KEY || 'unused';

// سرویس پشتیبان: Cloudflare
const CF_ENDPOINT = `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/ai/run/@cf/meta/llama-3.3-70b-instruct-fp8-fast`;
const CF_TOKEN = process.env.CLOUDFLARE_API_TOKEN || '';

interface ChatOpts {
  temperature?: number;
  maxTokens?: number;
  retries?: number;
}

function cleanPersianText(text: string): string {
  return text.replace(/[\u4e00-\u9fa5\u3040-\u30ff\uac00-\ud7af\u0100-\u024f\u1ea0-\u1ef9]/g, '');
}

async function makeLLM7Request(system: string, user: string, opts: ChatOpts): Promise<string> {
  const { temperature = 0.7, maxTokens = 2000 } = opts;
  const response = await fetch(LLM7_ENDPOINT, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${LLM7_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: LLM7_MODEL,
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
      temperature,
      max_tokens: maxTokens,
    }),
  });

  if (!response.ok) throw new Error(`LLM7 ${response.status}`);
  const data: any = await response.json();
  if (!data.choices?.[0]?.message?.content) throw new Error('Invalid LLM7 response');
  return data.choices[0].message.content;
}

async function makeCFRequest(system: string, user: string, opts: ChatOpts): Promise<string> {
  const { temperature = 0.7, maxTokens = 2000 } = opts;
  const response = await fetch(CF_ENDPOINT, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${CF_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
      temperature,
      max_tokens: maxTokens,
    }),
  });

  if (!response.ok) throw new Error(`Cloudflare ${response.status}`);
  const data: any = await response.json();
  const resp = data.result?.response ?? data.result ?? data.response;
  if (!resp) throw new Error('Invalid CF response');
  return typeof resp === 'string' ? resp : JSON.stringify(resp);
}

async function aiChat(system: string, user: string, opts: ChatOpts = {}): Promise<string> {
  const { retries = 1 } = opts;

  // تلاش اول: LLM7.io
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await makeLLM7Request(system, user, opts);
    } catch (e: any) {
      console.warn(`  [LLM7] تلاش ${attempt + 1} ناموفق: ${String(e.message).substring(0, 80)}`);
      if (attempt < retries) await new Promise(r => setTimeout(r, 1000));
    }
  }

  // تلاش دوم: Cloudflare
  console.warn(`  [هشدار] LLM7 وصل نشد. تلاش با Cloudflare...`);
  for (let attempt = 0; attempt <= 1; attempt++) {
    try {
      let text = await makeCFRequest(system, user, opts);
      return cleanPersianText(text);
    } catch (e: any) {
      console.warn(`  [Cloudflare] تلاش ${attempt + 1} ناموفق: ${String(e.message).substring(0, 80)}`);
      if (attempt < 1) await new Promise(r => setTimeout(r, 1500));
    }
  }

  throw new Error('اتصال به همه سرویس‌ها ناموفق بود.');
}

function extractJSON(raw: any): any {
  if (raw !== null && typeof raw === 'object') return raw;
  if (typeof raw !== 'string') throw new Error('Expected string/object');
  try { return JSON.parse(raw.trim()); } catch {}
  const fenced = raw.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenced) { try { return JSON.parse(fenced[1].trim()); } catch {} }
  const start = raw.search(/[{[]/);
  if (start === -1) throw new Error('No JSON in response');
  const openChar = raw[start];
  const closeChar = openChar === '{' ? '}' : ']';
  let depth = 0, inString = false, escape = false;
  for (let i = start; i < raw.length; i++) {
    const c = raw[i];
    if (escape) { escape = false; continue; }
    if (c === '\\') { escape = true; continue; }
    if (c === '"') { inString = !inString; continue; }
    if (inString) continue;
    if (c === openChar) depth++;
    if (c === closeChar) {
      depth--;
      if (depth === 0) {
        try { return JSON.parse(raw.substring(start, i + 1)); } 
        catch (e: any) { throw new Error(`JSON parse failed: ${e.message}`); }
      }
    }
  }
  throw new Error('Unbalanced JSON');
}

async function aiJSON<T>(system: string, user: string, opts: ChatOpts = {}): Promise<T> {
  const raw = await aiChat(
    system + '\n\nCRITICAL: Respond with VALID JSON ONLY. No markdown, no code blocks, no explanations.',
    user,
    { ...opts, temperature: opts.temperature ?? 0.4 }
  );
  return extractJSON(raw);
}

const STYLE_GUIDE = `You are a senior Persian content writer for "فاطمه بیوتی لند" (Fatemeh Beauty Land), a premium Iranian beauty shop.

CRITICAL LANGUAGE RULES:
- WRITE ONLY IN PERSIAN (FARSI). Absolutely NO English, Spanish, Vietnamese, Turkish, Chinese, or any other language mixed in.
- Do NOT use machine-translated or formal government style. Write like a popular Persian lifestyle blogger.
- Use: "می‌شود", "دقت کنید", "احتمالاً", "در واقع", "باید بدانید", "ممکن است".
- Avoid: "می‌باشد", "لذا", "علی‌رغم", "در ادامه مطلب", "قبل از هر چیز".

QUALITY RULES:
- Provide specific facts, numbers, and actionable advice. No vague claims.
- Never make medical claims without qualification.
- Paragraphs should be 3-5 sentences, varied in length.

FORMAT — ONLY these HTML tags:
<p>, <h2>, <h3>, <ul>, <ol>, <li>, <strong>, <em>`;

export interface ArticleMetadata {
  title: string; slug: string; excerpt: string; seoTitle: string; seoDescription: string; keywords: string[]; sections: string[];
}
export interface FAQ { q: string; a: string; }
const CATEGORY_LABELS: Record<string, string> = {
  education: 'آموزش', 'buying-guide': 'راهنمای خرید', skincare: 'مراقبت پوست', haircare: 'مراقبت مو', makeup: 'آرایشی',
};

export async function generateMetadata(topic: string, category: string, targetKeywords: string[] = []): Promise<ArticleMetadata> {
  const catLabel = CATEGORY_LABELS[category] || category;
  const system = `${STYLE_GUIDE}\n\nYour job: create an SEO-optimized article outline. Return ONLY valid JSON.`;
  const keywordsHint = targetKeywords.length > 0 ? targetKeywords.join('، ') : '(خودت ۴-۶ کلمه کلیدی مرتبط پیشنهاد بده)';
  const user = `موضوع: "${topic}"\nدسته‌بندی: ${catLabel}\nکلمات کلیدی: ${keywordsHint}\n\nJSON:\n{\n  "title": "...",\n  "slug": "...",\n  "excerpt": "...",\n  "seoTitle": "...",\n  "seoDescription": "...",\n  "keywords": ["..."],\n  "sections": ["...", "...", "...", "...", "...", "..."]\n}`;
  const meta = await aiJSON<ArticleMetadata>(system, user, { temperature: 0.4, maxTokens: 1200 });
  
  // فیلتر ایمنی: پاک کردن هرگونه تگ HTML از عنوان بخش‌ها
  if (meta.sections && Array.isArray(meta.sections)) {
    meta.sections = meta.sections.map(s => s.replace(/<[^>]+>/g, '').trim());
  }
  return meta;
}

export async function writeIntro(title: string, category: string, excerpt: string): Promise<string> {
  const catLabel = CATEGORY_LABELS[category] || category;
  const system = `${STYLE_GUIDE}\n\nYour job: write the OPENING of a Persian article. 2-3 paragraphs. Start with a HOOK. NEVER start with "در این مقاله". Return ONLY <p>...</p> tags.`;
  const user = `عنوان: "${title}"\nدسته: ${catLabel}\nخلاصه: ${excerpt}\n\nمقدمه را بنویس.`;
  return aiChat(system, user, { temperature: 0.8, maxTokens: 500 });
}

export async function writeSection(title: string, sectionTitle: string, previousContent: string, category: string, sectionIndex: number, totalSections: number): Promise<string> {
  const catLabel = CATEGORY_LABELS[category] || category;
  const system = `${STYLE_GUIDE}\n\nYour job: write ONE section. 200-350 words. Use <h3>, <ul>, <strong>. DO NOT output the section title in <h2> tags. Return ONLY HTML.`;
  const context = previousContent ? `محتوای قبلی (تکرار نکن):\n${previousContent.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').substring(0, 300)}...` : '';
  const user = `مقاله: "${title}"\nدسته: ${catLabel}\nبخش ${sectionIndex}/${totalSections}: "${sectionTitle}"\n\n${context}\n\nمحتوای این بخش را بنویس.`;
  
  let text = await aiChat(system, user, { temperature: 0.7, maxTokens: 1200 });
  text = text.replace(/<h2>.*?<\/h2>/gi, '');
  return text.trim();
}

export async function writeConclusion(title: string, category: string, fullContent: string): Promise<string> {
  const catLabel = CATEGORY_LABELS[category] || category;
  const system = `${STYLE_GUIDE}\n\nYour job: write the conclusion. 2-3 paragraphs. Return ONLY <p>...</p> tags.`;
  const user = `مقاله: "${title}"\nدسته: ${catLabel}\n\nخلاصه محتوا:\n${fullContent.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').substring(0, 500)}...\n\nنتیجه‌گیری را بنویس.`;
  return aiChat(system, user, { temperature: 0.6, maxTokens: 500 });
}

export async function generateFAQ(title: string, content: string): Promise<FAQ[]> {
  const system = `${STYLE_GUIDE}\n\nYour job: generate 3-5 FAQ questions. Return valid JSON.`;
  const user = `مقاله: "${title}"\n\nمحتوا:\n${content.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').substring(0, 1500)}\n\nJSON:\n{\n  "faqs": [\n    { "q": "...", "a": "..." }\n  ]\n}`;
  const result = await aiJSON<{ faqs: FAQ[] }>(system, user, { temperature: 0.5, maxTokens: 1000 });
  return result.faqs || [];
}

export function assembleArticle(intro: string, sections: { title: string; content: string }[], conclusion: string, faqs: FAQ[]): string {
  let html = intro.trim();
  for (const sec of sections) html += `\n\n<h2>${sec.title}</h2>\n${sec.content.trim()}`;
  html += `\n\n<h2>نتیجه‌گیری</h2>\n${conclusion.trim()}`;
  if (faqs.length > 0) {
    html += `\n\n<h2>سوالات متداول</h2>`;
    for (const f of faqs) html += `\n<h3>${f.q}</h3>\n<p>${f.a}</p>`;
  }
  return html;
}
export async function generateFullContent(title: string, category: string, excerpt: string): Promise<string> {
  const catLabel = CATEGORY_LABELS[category] || category;
  const system = `${STYLE_GUIDE}

Your job: write a COMPLETE 2000-word article in Persian.
RULES:
- Start with an engaging intro (no heading).
- Include 6-8 main sections using <h2> tags.
- Inside sections, use <h3>, <ul>, <li>, and <strong>.
- End with a conclusion section under <h2>نتیجه‌گیری</h2>.
- DO NOT repeat the article title in the body.
- DO NOT use markdown, code blocks, or <html> tags. Return ONLY the HTML content.
CRITICAL: Return ONLY valid HTML.`;

  const user = `عنوان: "${title}"
دسته: ${catLabel}
خلاصه: ${excerpt}

محتوای کامل مقاله را بنویس.`;
  
  return aiChat(system, user, { temperature: 0.7, maxTokens: 4000 });
}