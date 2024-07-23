import { Metadata } from 'next';

import Container from '@/components/layout/Container';
import { Separator } from '@/components/ui/separator';

import NewsBanner from '../../components/branding/NewsBanner';
import NewsSection from './components/NewsSection';
import TopNews from './components/TopNews';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Latest News Updates and Trending Headlines',
    description:
      'Stay in the loop with the latest headlines and breaking news on business, sports, politics, technology and stock market from around the world on Monkeys.',
  };
}

const NewsPage = () => {
  return (
    <Container className='pb-20 min-h-screen px-5 py-4'>
      <div>
        <NewsBanner />
      </div>

      <div className='mt-12 sm:mt-16 grid grid-cols-4 gap-2'>
        <div className='col-span-4 lg:col-span-3'>
          <NewsSection />
        </div>

        <div className='hidden lg:block lg:col-span-1 py-2s'>
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
    </Container>
  );
};

export default NewsPage;
