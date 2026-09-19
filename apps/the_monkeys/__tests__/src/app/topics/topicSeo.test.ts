import {
  buildTopicJsonLd,
  buildTopicMetadata,
  findCatalogTopic,
} from '@/app/topics/[topic]/topicSeo';
import { MetaBlog } from '@/services/blog/blogTypes';
import { GetAllCategoriesAPIResponse } from '@/services/category/categoryTypes';
import { describe, expect, it } from 'vitest';

const catalog: GetAllCategoriesAPIResponse = {
  category: {
    Business: { Topics: ['Business', 'Stock Market'] },
  },
};

const posts: MetaBlog[] = [
  {
    blog_id: '1',
    title: 'Market Structure',
    first_image: '',
    first_paragraph: 'A clear explanation of market structure.',
    owner_account_id: 'account-1',
    published_time: '2026-09-10T10:00:00.000Z',
    tags: ['Business'],
  },
  {
    blog_id: '2',
    title: 'Building Durable Companies',
    first_image: '',
    first_paragraph: 'Lessons for founders building durable companies.',
    owner_account_id: 'account-2',
    published_time: '2026-09-11T10:00:00.000Z',
    tags: ['Business'],
  },
];

describe('topic detail SEO', () => {
  it('resolves only a real topic from the public catalog', () => {
    expect(findCatalogTopic('stock-market', catalog)).toBe('Stock Market');
    expect(findCatalogTopic('invented-topic', catalog)).toBeNull();
  });

  it('builds topic metadata without blogging-only language', () => {
    const metadata = buildTopicMetadata('Business', 'business', posts);

    expect(metadata.title).toEqual({
      absolute: 'Business Posts and Community | Monkeys',
    });
    expect(metadata.alternates).toEqual({
      canonical: 'https://monkeys.com.co/topics/business',
    });
    expect(JSON.stringify(metadata).toLowerCase()).not.toContain(
      'blogging community'
    );
  });

  it('lists the real canonical post URLs in topic structured data', () => {
    const schema = buildTopicJsonLd('Business', 'business', posts);

    expect(schema.mainEntity.numberOfItems).toBe(2);
    expect(schema.mainEntity.itemListElement).toEqual([
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Market Structure',
        url: 'https://monkeys.com.co/blog/market-structure-1',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Building Durable Companies',
        url: 'https://monkeys.com.co/blog/building-durable-companies-2',
      },
    ]);
  });
});
