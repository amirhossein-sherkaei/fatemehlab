import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  reactCompiler: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '*.public.blob.vercel-storage.com' },
      { protocol: 'https', hostname: '*.vercel-storage.com' },
    ],
  },
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: '/36668862.txt',
          destination: '/36668862.txt',
        },
      ],
    };
  },
};

export default nextConfig;