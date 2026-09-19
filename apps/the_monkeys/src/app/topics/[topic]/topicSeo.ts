import type { Metadata } from 'next';

import { generateSlug } from '@/app/blog/utils/generateSlug';
import {
  LEGAL_PUBLISHER_ID,
  MONKEYS_WEBSITE_ID,
  absoluteUrl,
  pageMetadata,
} from '@/lib/seo';
import { MetaBlog } from '@/services/blog/blogTypes';
import { GetAllCategoriesAPIResponse } from '@/services/category/categoryTypes';
import { topicToSlug } from '@/utils/topicUtils';

export function findCatalogTopic(
  slug: string,
  catalog: GetAllCategoriesAPIResponse
): string | null {
  const topics = Object.values(catalog.category).flatMap(
    (category) => category.Topics
  );
  return topics.find((topic) => topicToSlug(topic) === slug) || null;
}

export function buildTopicMetadata(
  topic: string,
  slug: string,
  posts: MetaBlog[]
): Metadata {
  const countText = posts.length
    ? `Explore ${posts.length} public post${posts.length === 1 ? '' : 's'} about ${topic}`
    : `Explore public posts and community conversations about ${topic}`;
  return pageMetadata({
    title: `${topic} Posts and Community | Monkeys`,
    description: `${countText} on Monkeys. Discover ideas, authors, and related communities.`,
    path: `/topics/${slug}`,
    keywords: [topic, `${topic} posts`, `${topic} community`],
  });
}

export function buildTopicJsonLd(
  topic: string,
  slug: string,
  posts: MetaBlog[]
) {
  const url = absoluteUrl(`/topics/${slug}`);
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${url}#collection`,
    name: `${topic} Posts and Community`,
    description: `Public posts and community conversations about ${topic} on Monkeys.`,
    url,
    isPartOf: { '@id': MONKEYS_WEBSITE_ID },
    publisher: { '@id': LEGAL_PUBLISHER_ID },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: posts.length,
      itemListElement: posts.map((post, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: post.title,
        url: absoluteUrl(`/blog/${generateSlug(post.title)}-${post.blog_id}`),
      })),
    },
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: absoluteUrl('/'),
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Topics',
          item: absoluteUrl('/topics/explore'),
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: topic,
          item: url,
        },
      ],
    },
  };
}
