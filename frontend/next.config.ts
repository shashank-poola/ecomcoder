import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/favicon.ico',
        destination: '/ecom/logo.png',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
