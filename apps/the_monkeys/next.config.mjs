import createMDX from '@next/mdx';

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ['monkeys.support', 'dev.themonkeys.site'],
  },
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/feed',
        permanent: false,
      },
    ];
  },
  async rewrites() {
    // Extract base URL from environment variables
    const apiUrlV1 = process.env.NEXT_PUBLIC_API_URL;
    const apiUrlV2 = process.env.NEXT_PUBLIC_API_URL_V2;

    // Only set up rewrites if environment variables are defined
    if (!apiUrlV1 || !apiUrlV2) {
      console.warn('API URLs not configured in environment variables');
      return [];
    }

    // Extract the base domain from the API URLs (remove /api/v1 and /api/v2)
    const baseUrlV1 = apiUrlV1.replace('/api/v1', '');
    const baseUrlV2 = apiUrlV2.replace('/api/v2', '');

    return [
      {
        source: '/api/v1/:path*',
        destination: `${baseUrlV1}/api/v1/:path*`,
      },
      {
        source: '/api/v2/:path*',
        destination: `${baseUrlV2}/api/v2/:path*`,
      },
    ];
  },
};

const withMDX = createMDX({});

export default withMDX(nextConfig);
