import createMDX from '@next/mdx';

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  images: {
    domains: ['monkeys.support', 'dev.themonkeys.site'],
  },
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
};

const withMDX = createMDX({});

export default withMDX(nextConfig);
