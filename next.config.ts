import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  // Neon serverless driver needs this on Vercel edge/serverless
  serverExternalPackages: ['bcryptjs'],
};

export default nextConfig;
