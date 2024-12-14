import { Metadata } from 'next';

import Container from '@/components/layout/Container';
import LinksRedirectArrow from '@/components/links/LinksRedirectArrow';
import { Separator } from '@/components/ui/separator';
import moment from 'moment';

import { NewsSection1 } from './components/NewsSection1';
import { NewsSection2 } from './components/NewsSection2';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Latest News Updates and Trending Headlines',
    description:
      'Stay in the loop with the latest headlines and breaking news on business, sports, politics, technology and stock market from around the world on Monkeys.',
  };
}

const NewsPage = () => {
  const currDate = new Date();

  return (
    <Container className='mb-20 min-h-screen p-4 space-y-2'>
      <div className='px-1 flex justify-between flex-wrap gap-1'>
        <p className='font-roboto text-xs xl:text-sm'>
          {moment(currDate).format('MMMM DD, YYYY')}
        </p>

        <p className='font-roboto text-xs xl:text-sm'>
          {moment.utc(currDate).format('HH:MM A')} UTC
        </p>
      </div>

      <div className='py-4 sm:py-6'>
        <LinksRedirectArrow
          position='Left'
          link='/feed'
          className='sm:mx-auto w-fit'
        >
          <p className='font-dm_sans text-sm sm:text-base'>Monkeys</p>
        </LinksRedirectArrow>

        <h1 className='py-2 font-arvo text-[30px] sm:text-[40px] md:text-[50px] text-center drop-shadow-sm'>
          Monkeys <span className='text-brand-orange'>News</span>
        </h1>

        <p className='font-dm_sans font-light text-sm sm:text-base md:text-lg text-center opacity-80'>
          Latest news and highlights in Business, Technology, Sports and many
          more.
        </p>
      </div>

      <Separator />


      <NewsSection1 />

      <NewsSection2 />
    </Container>
  );
};

export default NewsPage;
