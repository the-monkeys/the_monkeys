import { Metadata } from 'next';
import Link from 'next/link';

import Icon from '@/components/icon';
import Container from '@/components/layout/Container';
import {
  PageHeader,
  PageHeading,
  PageSubheading,
} from '@/components/layout/pageHeading';
import { Button } from '@the-monkeys/ui/atoms/button';

import { BlogsByTopic } from './components/BlogsByTopic';
import TopicFollowButton from './components/TopicFollowButton';

export async function generateMetadata({
  params,
}: {
  params: {
    topic: string;
  };
}): Promise<Metadata> {
  const topic = decodeURIComponent(params.topic) || 'Various Topics';

  return {
    title: `Posts on ${topic}`,
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
    <Container className='pb-12 px-4 min-h-screen space-y-2'>
      <PageHeader>
        <PageSubheading subheading='Read about' />
        <PageHeading heading={topic} className='text-center' />
      </PageHeader>

      <div className='flex justify-center gap-2 flex-wrap'>
        <TopicFollowButton topic={topic} />

        <Button variant='outline' className='rounded-full' asChild>
          <Link href='/topics/explore' target='_blank'>
            <Icon name='RiCompass' className='mr-1' />
            Explore
          </Link>
        </Button>
      </div>

      <div className='pt-10 mx-auto max-w-4xl min-h-[800px]'>
        <BlogsByTopic topic={topic} />
      </div>
    </Container>
  );
};

export default TopicBlogsPage;
