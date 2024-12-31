import { Metadata } from 'next';

import Container from '@/components/layout/Container';
import LinksRedirectArrow from '@/components/links/LinksRedirectArrow';
import { Separator } from '@/components/ui/separator';
import moment from 'moment';

import { NewsSection1 } from './components/NewsSection1';
import { NewsSection2 } from './components/NewsSection2';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Latest News and Trending Headlines',
    description:
      'Stay in the loop with the latest headlines and breaking news on business, sports, politics, technology and stock market from around the world on Monkeys.',
  };
}

const NewsPage = () => {
  const currDate = new Date();

  return (
    <Container className='mb-20 min-h-screen p-4 space-y-2'>
      <LinksRedirectArrow position='Left' link='/feed' className='w-fit'>
        <p className='font-dm_sans text-xs sm:text-sm'>Monkeys Blog</p>
      </LinksRedirectArrow>

      <p className='text-xs xl:text-sm opacity-80'></p>

      <div className='py-4 sm:py-6'>
        <p className='mx-auto w-fit font-dm_sans text-xs opacity-80'>
          {moment.utc(currDate).format('HH:MM A')} UTC
        </p>

        <p className='mx-auto w-fit font-dm_sans text-xs xl:text-sm opacity-80'>
          {moment(currDate).format('MMMM DD, YYYY')}
        </p>

        <h2 className='py-1 font-arvo text-[30px] sm:text-[40px] md:text-[50px] text-center drop-shadow-sm'>
          Monkeys <span className='text-brand-orange'>News</span>
        </h2>
      </div>

      <Separator />

      <NewsSection1 />

      <NewsSection2 />
    </Container>
  );
};

export default NewsPage;
