import { API_URL } from '@/constants/api';
import { MONKEYS_WEBSITE_ID, absoluteUrl } from '@/lib/seo';
import { GetAllCategoriesAPIResponse } from '@/services/category/categoryTypes';
import { topicToSlug } from '@/utils/topicUtils';

const PRODUCTION_API = 'https://monkeys.com.co/api/v1';

export function topicCatalogOrigin(configured = API_URL): string {
  return (configured || PRODUCTION_API).replace(/\/$/, '');
}

export function normalizeCategoryCatalog(
  value: unknown
): GetAllCategoriesAPIResponse {
  const source =
    value && typeof value === 'object' && 'category' in value
      ? (value as { category?: unknown }).category
      : null;
  const category: GetAllCategoriesAPIResponse['category'] = {};

  if (!source || typeof source !== 'object') return { category };

  for (const [name, rawCategory] of Object.entries(source)) {
    if (!rawCategory || typeof rawCategory !== 'object') continue;
    const rawTopics = (rawCategory as { Topics?: unknown }).Topics;
    if (!Array.isArray(rawTopics)) continue;
    const topics = Array.from(
      new Set(
        rawTopics
          .filter((topic): topic is string => typeof topic === 'string')
          .map((topic) => topic.trim())
          .filter(Boolean)
      )
    );
    if (topics.length) category[name] = { Topics: topics };
  }

  return { category };
}

export function summarizeTopicCatalog(
  catalog: GetAllCategoriesAPIResponse,
  maxTopicsPerCategory = 6
): GetAllCategoriesAPIResponse {
  return {
    category: Object.fromEntries(
      Object.entries(catalog.category).map(([name, category]) => [
        name,
        { Topics: category.Topics.slice(0, maxTopicsPerCategory) },
      ])
    ),
  };
}

async function requestTopicCatalog(): Promise<GetAllCategoriesAPIResponse> {
  const response = await fetch(`${topicCatalogOrigin()}/user/category`, {
    headers: { 'Content-Type': 'application/json' },
    next: { revalidate: 3600 },
  });
  if (!response.ok) {
    throw new Error(
      `Topic catalog request failed with status ${response.status}`
    );
  }
  return normalizeCategoryCatalog(await response.json());
}

export async function fetchTopicCatalog(): Promise<GetAllCategoriesAPIResponse> {
  try {
    return await requestTopicCatalog();
  } catch {
    return { category: {} };
  }
}

export function fetchTopicCatalogStrict(): Promise<GetAllCategoriesAPIResponse> {
  return requestTopicCatalog();
}

export function buildTopicCatalogJsonLd(catalog: GetAllCategoriesAPIResponse) {
  const topics = Array.from(
    new Set(
      Object.values(catalog.category).flatMap((category) => category.Topics)
    )
  ).slice(0, 100);
  const url = absoluteUrl('/topics/explore');

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': `${url}#collection`,
        name: 'Explore Topics on Monkeys',
        description:
          'Browse topics and discover public posts, authors, events, and communities on Monkeys.',
        url,
        isPartOf: { '@id': MONKEYS_WEBSITE_ID },
        mainEntity: {
          '@type': 'ItemList',
          numberOfItems: topics.length,
          itemListElement: topics.map((topic, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: topic,
            url: absoluteUrl(`/topics/${topicToSlug(topic)}`),
          })),
        },
      },
      {
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
            item: url,
          },
        ],
      },
    ],
  };
}
