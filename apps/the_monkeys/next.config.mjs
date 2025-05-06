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
    ]
  },
};

const withMDX = createMDX({});

export default withMDX(nextConfig);
