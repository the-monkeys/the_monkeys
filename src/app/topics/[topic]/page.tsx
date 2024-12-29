import { Metadata } from 'next';
import Link from 'next/link';

import Icon from '@/components/icon';
import Container from '@/components/layout/Container';
import {
  PageHeader,
  PageHeading,
  PageSubheading,
} from '@/components/layout/pageHeading';
import { Button } from '@/components/ui/button';

import { BlogsByTopic } from './components/BlogsByTopic';

export async function generateMetadata({
  params,
}: {
  params: {
    topic: string;
  };
}): Promise<Metadata> {
  const topic = decodeURIComponent(params.topic) || 'Various Topics';

  return {
    title: `Blogs on ${topic}`,
  };
}

const TopicBlogsPage = ({
  params,
}: {
  params: {
    topic: string;
  };
}) => {
  const topic = decodeURIComponent(params.topic);

  return (
    <Container className='pb-12 px-4 min-h-screen'>
      <PageHeader>
        <PageSubheading subheading='Read about' className='text-lg ' />
        <PageHeading heading={topic} />
      </PageHeader>

      <div className='mt-3 mb-10 flex justify-center gap-2 flex-wrap'>
        <Button
          variant='brand'
          size='sm'
          className='rounded-full'
          disabled={true}
        >
          <Icon name='RiAdd' className='mr-1' />
          Follow
        </Button>

        <Button size='sm' className='rounded-full' asChild>
          <Link href='/topics/explore' target='_blank'>
            <Icon name='RiCompass' className='mr-1' />
            Explore All
          </Link>
        </Button>
      </div>

      <div className='mx-auto max-w-3xl min-h-screen'>
        <BlogsByTopic topic={topic} />
      </div>
    </Container>
  );
};

export default TopicBlogsPage;
