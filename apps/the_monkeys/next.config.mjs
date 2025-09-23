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
  images: {
    qualities: [80, 100],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'monkeys.support',
      },
      {
        protocol: 'https',
        hostname: 'dev.monkeys.support',
      },
    ],
  },
};

const withMDX = createMDX({});

export default withMDX(nextConfig);
