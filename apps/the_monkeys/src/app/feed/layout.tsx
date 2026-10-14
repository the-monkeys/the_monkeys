import { Metadata } from 'next';

import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Latest Posts Across Topics | Monkeys',
  description:
    'Explore recent community posts across business, technology, science, culture, health, and more on Monkeys.',
  path: '/feed',
  rss: '/posts/feed.xml',
  keywords: [
    'latest posts',
    'community posts',
    'technology',
    'business',
    'science',
    'culture',
  ],
});

const BlogFeedPageLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className='min-h-[800px]'>
      <h1 className='text-2xl font-bold hidden'>
        Latest community posts across technology, business, science, culture,
        health, and more
      </h1>
      {children}
    </div>
  );
};

export default BlogFeedPageLayout;
