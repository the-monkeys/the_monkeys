import { Metadata } from 'next';

import Container from '@/components/layout/Container';
import { Separator } from '@/components/ui/separator';

import { NewsSection1 } from './components/NewsSection1';
import { NewsSection2 } from './components/NewsSection2';
import { MarketData } from './components/news/MarketData';
import { TopHeadlines } from './components/news/TopHeadlines';
import { TopHeadlinesMobile } from './components/news/TopHeadlinesMobile';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Latest News Updates and Trending Headlines',
    description:
      'Stay in the loop with the latest headlines and breaking news on business, sports, politics, technology and stock market from around the world on Monkeys.',
  };
}

const NewsPage = () => {
  const currDate = new Date();
  const formattedDate = currDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const formattedTime = currDate.toUTCString().split(' ')[4]; // Extract the time part from the UTC string

  return (
    <Container className='pb-20 min-h-screen px-5'>
      <div className='flex justify-between flex-wrap'>
        <p className='font-roboto text-xs sm:text-sm opacity-75'>
          {formattedDate}
        </p>

        <p className='font-roboto text-xs sm:text-sm opacity-75'>
          {formattedTime} UTC
        </p>
      </div>

      <div className='pt-6 sm:pt-8 pb-6 space-y-2 sm:space-y-4'>
        <h1 className='font-playfair_Display font-bold text-4xl sm:text-5xl md:text-6xl text-primary-monkeyBlack dark:text-primary-monkeyWhite drop-shadow-sm text-center animate-appear-up'>
          Monkeys <span className='text-primary-monkeyOrange'>News</span>
        </h1>

        <p className='font-dm_sans text-sm sm:text-base text-secondary-darkGrey dark:text-secondary-white text-center animate-appear-up'>
          Latest news and highlights in Business, Technology, Sports and many
          more.
        </p>
      </div>

      {/* <MarketData /> */}

      {/* <TopHeadlinesMobile /> */}

      {/* <div className='mt-8 grid grid-cols-3'>
        <div className='col-span-3 lg:col-span-2'>
          <NewsSection1 />
        </div>

        <TopHeadlines />
      </div> */}

      <Separator className='hidden sm:block my-4' />

      <NewsSection2 />
    </Container>
  );
};

export default NewsPage;
