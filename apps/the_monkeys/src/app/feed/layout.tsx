import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Latest Blog Feed',
  description:
    'Stay in the loop with the latest blogs and news on business, sports, politics, technology from around the world on Monkeys.',
};

const BlogFeedPageLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return <div className='min-h-screen'>{children}</div>;
};

export default BlogFeedPageLayout;
