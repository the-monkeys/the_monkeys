import { Metadata } from 'next';

import Container from '@/components/layout/Container';
import { Separator } from '@/components/ui/separator';

import NewsBanner from '../../components/branding/NewsBanner';
import NewsSection2 from './components/NewsSection2';
import TopNews from './components/TopNews';
import StockMarquee from './components/news/Marquee';
import TopNewsHeadingMobileView from './components/news/TopNewsHeadingMobilView';
import FooterSection from './components/news/TopSection';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Latest News Updates and Trending Headlines',
    description:
      'Stay in the loop with the latest headlines and breaking news on business, sports, politics, technology and stock market from around the world on Monkeys.',
  };
}

const NewsPage = () => {
  return (
    <Container className='pb-20 min-h-screen px-5 dark:text-white'>
      <StockMarquee />
      <div>
        {' '}
        <NewsBanner />
      </div>

      <div className='mt-12 sm:mt-16 grid grid-cols-4 gap-2'>
        <div className='col-span-4 lg:col-span-3'>
          <TopNewsHeadingMobileView />
          <NewsSection2 />
        </div>

        <div className='hidden lg:block lg:col-span-1 py-2s pt-3'>
          <h3 className='w-fit font-josefin_Sans font-semibold text-xl'>
            Top Headlines
          </h3>

          <p className='w-fit font-jost text-sm opacity-75'>
            See what&apos;s happening around the world
          </p>

          <Separator className='my-2' />

          <TopNews />
        </div>
      </div>
      <FooterSection />
    </Container>
  );
};

export default NewsPage;
