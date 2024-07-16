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

      <div className='mt-10 grid grid-cols-4 gap-4'>
        <div className='col-span-4 lg:col-span-3'>
          <NewsSection />
        </div>

        <div className='hidden lg:block lg:col-span-1 py-2s'>
          <h4 className='w-fit font-josefin_Sans font-semibold text-xl'>
            Top <span className='text-primary-monkeyOrange'>Global</span>{' '}
            Headlines
          </h4>

          <p className='w-fit font-jost text-sm opacity-75'>
            Catch up on the latest worldwide news
          </p>

          <Separator className='my-2' />

          <TopNews />
        </div>
      </div>
    </Container>
  );
};

export default NewsPage;
