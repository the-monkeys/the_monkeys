import { Metadata } from 'next';

export const metadata: Metadata = {
  title:
    'Monkeys Feed - Quality Blogs on Technology, Business, Science, Lifestyle & More',
  description:
    'Explore Monkeys Feed for the latest quality blogs and expert articles on technology, business, science, lifestyle, philosophy, and more. Stay informed with meaningful, accurate, and inspiring content.',
  keywords: [
    'quality blogs',
    'technology articles',
    'business insights',
    'science blogs',
    'philosophy content',
    'lifestyle blogs',
    'personal development articles',
    'trusted blogging community',
    'expert articles',
    'thoughtful content',
  ],
  openGraph: {
    title:
      'Monkeys Feed - Quality Blogs on Technology, Business, Science, Lifestyle & More',
    description:
      'Discover Monkeys Feed for trusted blogs and expert articles in technology, business, science, lifestyle, philosophy, and more. A community built for meaningful and inspiring content.',
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
        Monkeys - Quality Blogging Community for Technology, Business, Science,
        Lifestyle, Philosophy, and More
      </h1>
      {children}
    </div>
  );
};

export default BlogFeedPageLayout;
