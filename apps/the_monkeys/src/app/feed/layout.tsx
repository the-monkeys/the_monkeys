import { Metadata } from 'next';

export const metadata: Metadata = {
  title:
    'Catch What’s Trending - Latest Technology, Business, Sports & Entertainment News',
  description:
    'Stay updated with the latest and most comprehensive news in technology, business, sports, and entertainment worldwide. Your go-to source for trending stories, expert insights, and breaking updates on Monkeys.',
  keywords: [
    'technology news',
    'business news',
    'sports updates',
    'entertainment news',
    'trending stories',
    'latest news',
    'breaking news',
    'global news',
  ],
  openGraph: {
    title:
      'Catch What’s Trending - Latest Technology, Business, Sports & Entertainment News',
    description:
      'Stay updated with the latest and most comprehensive news in technology, business, sports, and entertainment worldwide. Your go-to source for trending stories, expert insights, and breaking updates on Monkeys.',
    url: 'https://monkeys.com.co/feed',
    siteName: 'Monkeys',
    type: 'website',
  },
  alternates: {
    canonical: 'https://monkeys.com.co/feed',
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
    },
  },
};

const BlogFeedPageLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className='min-h-[800px]'>
      <h1 className='text-2xl font-bold hidden'>
        Monkeys Blog Feed - Latest Technology, Business, Sports & Entertainment
        News
      </h1>
      {children}
    </div>
  );
};

export default BlogFeedPageLayout;
