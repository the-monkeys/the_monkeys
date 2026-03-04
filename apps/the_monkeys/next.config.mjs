import createMDX from '@next/mdx';

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  output: process.env.DOCKER_BUILD ? 'standalone' : undefined,
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ['monkeys.support', 'dev.themonkeys.site'],
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
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '8081',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8081',
      },
    ],
  },
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
};

const withMDX = createMDX({});

export default withMDX(nextConfig);
