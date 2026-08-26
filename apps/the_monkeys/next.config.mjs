import createMDX from '@next/mdx';

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  // Isolates production/CI builds from the dev server's cache when
  // NEXT_DIST_DIR is set (e.g. NEXT_DIST_DIR=.next-prod npx next build).
  distDir: process.env.NEXT_DIST_DIR || '.next',
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
    ],
  },
  transpilePackages: ['public-ip'],
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
};

const withMDX = createMDX({});

export default withMDX(nextConfig);
