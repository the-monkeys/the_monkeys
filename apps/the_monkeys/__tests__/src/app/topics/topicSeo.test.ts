import {
  buildTopicJsonLd,
  buildTopicMetadata,
  findCatalogTopic,
  relatedTopicLinks,
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
  it('links only other catalog topics represented by the loaded public posts', () => {
    const result = relatedTopicLinks(
      'Business',
      [
        {
          ...posts[0],
          tags: ['Business', 'Stock Market', 'Invented', 'Stock Market'],
        },
      ],
      catalog
    );
    expect(result).toEqual([
      { name: 'Stock Market', href: '/topics/stock-market' },
    ]);
    expect(relatedTopicLinks('Business', [], catalog)).toEqual([]);
  });
  it('keeps a valid empty topic usable while asking crawlers not to index it', () => {
    expect(buildTopicMetadata('Business', 'business', []).robots).toMatchObject(
      { index: false, follow: true }
    );
    expect(
      buildTopicMetadata('Business', 'business', posts).robots
    ).toMatchObject({ index: true, follow: true });
  });
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
