import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://fatemehbeautyland.ir';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/account/', '/api/', '/cart', '/checkout', '/_next/'],
      },
      // 🤖 اجازه به ربات‌های AI برای درک بهتر محتوا
      {
        userAgent: ['GPTBot', 'Claude-Web', 'ClaudeBot', 'anthropic-ai', 'OAI-SearchBot', 'PerplexityBot'],
        allow: '/',
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}