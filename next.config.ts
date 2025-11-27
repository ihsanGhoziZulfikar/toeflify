import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Turbopack disabled due to Windows OS resource limitations (error 1450)
  // turbopack: {
  //   rules: { '*.svg': { loaders: ['@svgr/webpack'], as: '*.js' } },
  // },
  // experimental: {
  //   turbopackFileSystemCacheForDev: true,
  // },
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
      {
        protocol: 'https',
        hostname: 'bkclueacrypekqzkjevi.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
};

export default nextConfig;
