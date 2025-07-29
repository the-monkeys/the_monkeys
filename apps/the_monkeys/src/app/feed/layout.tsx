import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Catch What’s Trending',
  description:
    'Your go-to source for the latest in technology, business, sports, and entertainment — worldwide, on Monkeys.',
};

const BlogFeedPageLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return <div className='min-h-[800px]'>{children}</div>;
};

export default BlogFeedPageLayout;
