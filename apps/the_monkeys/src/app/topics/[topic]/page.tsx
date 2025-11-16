import { Metadata } from 'next';
import { unstable_noStore as noStore } from 'next/cache';
import Link from 'next/link';

import Icon from '@/components/icon';
import Container from '@/components/layout/Container';
import {
  PageHeader,
  PageHeading,
  PageSubheading,
} from '@/components/layout/pageHeading';
import { LIVE_URL } from '@/constants/api';
import { slugToTopic, topicToSlug } from '@/utils/topicUtils';
import { Button } from '@the-monkeys/ui/atoms/button';

import { BlogsByTopic } from './components/BlogsByTopic';
import TopicFollowButton from './components/TopicFollowButton';

async function fetchTopicData(topic: string) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL_V2 || 'https://monkeys.support/api/v2'}/blog/meta-feed`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tags: [topic] }),
        next: { revalidate: 3600 }, // Cache for 1 hour
      }
    );

    if (!response.ok) return null;

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching topic data:', error);
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: {
    topic: string;
  };
}): Promise<Metadata> {
  noStore();

  // Convert slug back to topic name
  const topic = slugToTopic(params.topic) || 'Various Topics';
  const topicData = await fetchTopicData(topic);
  const blogCount = topicData?.blogs?.length || 0;

  const topicUrl = `${LIVE_URL}/topics/${params.topic}`;
  const topicImage = `${LIVE_URL}/opengraph-image.png?b7ef6eff2b7766be`;

  // Generate dynamic title and description based on content
  const title = `${topic} Articles & Posts | Monkeys Blogging Community`;
  const description =
    blogCount > 0
      ? `Discover ${blogCount} insightful articles and posts about ${topic} on Monkeys. Expert insights, guides, and discussions from our community of writers.`
      : `Explore articles and posts about ${topic} on Monkeys. Join our community of writers sharing insights, guides, and discussions.`;

  return {
    title: {
      absolute: title,
    },
    description,
    keywords: [
      topic,
      `${topic} articles`,
      `${topic} posts`,
      `${topic} blog`,
      `${topic} guides`,
      `${topic} insights`,
      'blogging community',
      'expert articles',
      'quality content',
    ],
    alternates: {
      canonical: topicUrl,
    },
    openGraph: {
      title,
      description,
      url: topicUrl,
      siteName: 'Monkeys',
      type: 'website',
      images: [
        {
          url: topicImage,
          width: 1200,
          height: 630,
          alt: `${topic} articles and posts on Monkeys`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [topicImage],
      site: '@monkeys_com_co',
    },
    robots: {
      index: true,
      follow: true,
      nocache: false,
      googleBot: {
        index: true,
        follow: true,
        noimageindex: false,
      },
    },
    other: {
      'article:tag': topic,
    },
  };
}

// Generate structured data for topic pages
function generateTopicSchema(topic: string, blogCount: number) {
  const topicUrl = `${LIVE_URL}/topics/${topicToSlug(topic)}`;

  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${topic} Articles & Posts`,
    description: `A collection of articles and posts about ${topic} on Monkeys blogging community`,
    url: topicUrl,
    mainEntity: {
      '@type': 'ItemList',
      name: `${topic} Articles`,
      numberOfItems: blogCount,
      itemListElement: blogCount > 0 ? [] : undefined, // Could be populated with actual blog items
    },
    publisher: {
      '@type': 'Organization',
      name: 'Monkeys',
      url: LIVE_URL,
      logo: {
        '@type': 'ImageObject',
        url: `${LIVE_URL}/opengraph-image.png?b7ef6eff2b7766be`,
      },
    },
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: LIVE_URL,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Topics',
          item: `${LIVE_URL}/topics/explore`,
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: topic,
          item: topicUrl,
        },
      ],
    },
  };
}

const TopicBlogsPage = async ({
  params,
}: {
  params: {
    topic: string;
  };
}) => {
  // Convert slug back to topic name
  const topic = slugToTopic(params.topic);
  const topicData = await fetchTopicData(topic);
  const blogCount = topicData?.blogs?.length || 0;
  const topicSchema = generateTopicSchema(topic, blogCount);

  return (
    <>
      {/* Structured Data */}
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(topicSchema) }}
      />

      <Container className='pb-12 px-4 min-h-[800px]'>
        {/* Breadcrumb Navigation */}
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
              {blogCount} article{blogCount !== 1 ? 's' : ''} found
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
            <Link href='/topics/explore' target='_blank'>
              <Icon name='RiCompass' className='mr-1' />
              Explore Topics
            </Link>
          </Button>
        </div>

        <div className='mx-auto max-w-4xl min-h-[800px]'>
          <BlogsByTopic topic={topic} />
        </div>
      </Container>
    </>
  );
};

export default TopicBlogsPage;
