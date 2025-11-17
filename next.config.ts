import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  turbopack: {
    rules: { '*.svg': { loaders: ['@svgr/webpack'], as: '*.js' } },
  },
  experimental: {
    turbopackFileSystemCacheForDev: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
    ],
  },
};

export default nextConfig;
