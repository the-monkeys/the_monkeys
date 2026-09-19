import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import Icon from '@/components/icon';
import Container from '@/components/layout/Container';
import {
  PageHeader,
  PageHeading,
  PageSubheading,
} from '@/components/layout/pageHeading';
import { JsonLd } from '@/components/seo/JsonLd';
import { noIndexFollowRobots } from '@/lib/seo';
import { fetchTopicCatalog } from '@/lib/topicCatalog';
import { Button } from '@the-monkeys/ui/atoms/button';

import { BlogsByTopic } from './components/BlogsByTopic';
import TopicFollowButton from './components/TopicFollowButton';
import { fetchTopicPosts } from './topicData';
import {
  buildTopicJsonLd,
  buildTopicMetadata,
  findCatalogTopic,
} from './topicSeo';

type Props = { params: { topic: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const catalog = await fetchTopicCatalog();
  const topic = findCatalogTopic(params.topic, catalog);
  if (!topic) {
    return {
      title: { absolute: 'Topic not found | Monkeys' },
      robots: noIndexFollowRobots,
    };
  }
  const topicData = await fetchTopicPosts(topic);
  return buildTopicMetadata(topic, params.topic, topicData.blogs);
}

export default async function TopicBlogsPage({ params }: Props) {
  const catalog = await fetchTopicCatalog();
  const topic = findCatalogTopic(params.topic, catalog);
  if (!topic) notFound();

  const topicData = await fetchTopicPosts(topic);
  const blogCount = topicData.blogs.length;

  return (
    <>
      <JsonLd data={buildTopicJsonLd(topic, params.topic, topicData.blogs)} />

      <Container className='pb-12 px-4 min-h-[800px]'>
        <nav className='my-6' aria-label='Breadcrumb'>
          <ol className='flex items-center space-x-1 text-sm'>
            <li>
              <Link href='/' className='opacity-80 hover:opacity-100'>
                Home
              </Link>
            </li>
            <li className='flex items-center'>
              <Icon name='RiArrowRight' className='mx-2' size={16} />
              <Link
                href='/topics/explore'
                className='opacity-80 hover:opacity-100'
              >
                Topics
              </Link>
            </li>
            <li className='flex items-center'>
              <Icon name='RiArrowRight' className='mx-2' size={16} />
              <span className='font-medium'>{topic}</span>
            </li>
          </ol>
        </nav>

        <PageHeader>
          <PageSubheading subheading='Explore more about' />
          <PageHeading heading={topic} className='text-center' />
          {blogCount > 0 && (
            <p className='text-center opacity-80 mt-2'>
              {blogCount} post{blogCount !== 1 ? 's' : ''} found
            </p>
          )}
        </PageHeader>

        <div className='pb-12 md:pb-16 flex justify-center gap-2 flex-wrap'>
          <TopicFollowButton topic={topic} />
          <Button
            variant='secondary'
            size='sm'
            className='rounded-full'
            asChild
          >
            <Link href='/topics/explore'>
              <Icon name='RiCompass' className='mr-1' />
              Explore Topics
            </Link>
          </Button>
        </div>

        <div className='mx-auto max-w-4xl min-h-[800px]'>
          <BlogsByTopic blogs={topicData.blogs} />
        </div>
      </Container>
    </>
  );
}
