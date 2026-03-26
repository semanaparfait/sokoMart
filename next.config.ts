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
  // Force these native/serverless packages to stay in Node.js runtime
  serverExternalPackages: ['bcryptjs', '@neondatabase/serverless', 'pg'],
};

export default nextConfig;
