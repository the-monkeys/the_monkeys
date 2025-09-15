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
    description: `Explore insightful posts, guides, and discussions on ${topic}. Stay informed with helpful information, tips, and resources.`,
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
    <Container className='pb-12 px-4 min-h-[800px]'>
      <PageHeader>
        <PageSubheading subheading='Explore more about' />
        <PageHeading heading={topic} className='text-center' />
      </PageHeader>

      <div className='pb-12 md:pb-16 flex justify-center gap-2 flex-wrap'>
        <TopicFollowButton topic={topic} />

        <Button variant='secondary' size='sm' className='rounded-full' asChild>
          <Link href='/topics/explore' target='_blank'>
            <Icon name='RiCompass' className='mr-1' />
            Explore
          </Link>
        </Button>
      </div>

      <div className='mx-auto max-w-4xl min-h-[800px]'>
        <BlogsByTopic topic={topic} />
      </div>
    </Container>
  );
};

export default TopicBlogsPage;
