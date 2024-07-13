import { Metadata } from 'next';

import Container from '@/components/layout/Container';
import { Separator } from '@/components/ui/separator';

import NewsBanner from './components/NewsBanner';
import NewsSection from './components/NewsSection';
import TopNews from './components/TopNews';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'News',
    description:
      'Stay informed with the latest global news and updates. Read about current events, breaking news, and trending stories from around the world.',
  };
}

const NewsPage = () => {
  return (
    <Container className='pb-20 min-h-screen px-5 py-4'>
      <div>
        <NewsBanner />
      </div>

      <h3 className='mt-8 sm:mt-12 md:mt-16 font-josefin_Sans font-semibold text-2xl'>
        News
      </h3>

      <div className='grid grid-cols-4 gap-6'>
        <div className='col-span-4 md:col-span-3'>
          <NewsSection />
        </div>

        <div className='hidden md:block md:col-span-1 py-2'>
          <h4 className='w-fit font-josefin_Sans font-semibold text-xl'>
            Top <span className='text-primary-monkeyOrange'>Global</span>{' '}
            Headlines
          </h4>

          <p className='w-fit font-jost text-sm opacity-75'>
            Catch Up on the Latest Worldwide News
          </p>

          <Separator className='my-2' />

          <TopNews />
        </div>
      </div>
    </Container>
  );
};

export default NewsPage;
