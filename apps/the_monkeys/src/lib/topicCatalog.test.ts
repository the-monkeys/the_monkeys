import { describe, expect, it } from 'vitest';

import {
  buildTopicCatalogJsonLd,
  fetchTopicCatalog,
  fetchTopicCatalogStrict,
  normalizeCategoryCatalog,
  summarizeTopicCatalog,
  topicCatalogOrigin,
} from './topicCatalog';

describe('topic catalog SEO', () => {
  it('uses the public production API when no deployment origin is configured', () => {
    expect(topicCatalogOrigin('')).toBe('https://monkeys.com.co/api/v1');
    expect(topicCatalogOrigin('https://dev.monkeys.support/api/v1/')).toBe(
      'https://dev.monkeys.support/api/v1'
    );
  });

  it('keeps unique non-empty topic strings from valid categories', () => {
    expect(
      normalizeCategoryCatalog({
        category: {
          Business: { Topics: ['AI', ' AI ', 'Markets', 9, ''] },
          Invalid: null,
        },
      })
    ).toEqual({
      category: { Business: { Topics: ['AI', 'Markets'] } },
    });
  });

  it('builds a crawlable ItemList with canonical topic URLs', () => {
    const schema = buildTopicCatalogJsonLd({
      category: { Business: { Topics: ['AI', 'Stock Market'] } },
    });
    const collection = schema['@graph'][0];
    const breadcrumbs = schema['@graph'][1];

    expect(collection.mainEntity.numberOfItems).toBe(2);
    expect(collection.mainEntity.itemListElement).toEqual([
      {
        '@type': 'ListItem',
        position: 1,
        name: 'AI',
        url: 'https://monkeys.com.co/topics/ai',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Stock Market',
        url: 'https://monkeys.com.co/topics/stock-market',
      },
    ]);
    expect(breadcrumbs).toMatchObject({
      '@type': 'BreadcrumbList',
      itemListElement: [
        expect.objectContaining({ name: 'Home' }),
        expect.objectContaining({ name: 'Topics' }),
      ],
    });
  });

  it('caps initial category markup and structured data without mutating the catalog', () => {
    const topics = Array.from({ length: 105 }, (_, index) => `Topic ${index}`);
    const catalog = {
      category: {
        Business: { Topics: topics },
        Culture: { Topics: ['Books', 'Film'] },
      },
    };

    const summary = summarizeTopicCatalog(catalog, 6);
    const schema = buildTopicCatalogJsonLd(catalog);
    const collection = schema['@graph'][0];

    expect(summary.category.Business.Topics).toEqual(topics.slice(0, 6));
    expect(summary.category.Culture.Topics).toEqual(['Books', 'Film']);
    expect(catalog.category.Business.Topics).toHaveLength(105);
    expect(collection.mainEntity.numberOfItems).toBe(100);
    expect(collection.mainEntity.itemListElement).toHaveLength(100);
  });

  it('keeps discovery pages resilient but rejects transient sitemap failures', async () => {
    const originalFetch = global.fetch;
    global.fetch = async () =>
      ({ ok: false, status: 503 }) as unknown as Response;

    await expect(fetchTopicCatalog()).resolves.toEqual({ category: {} });
    await expect(fetchTopicCatalogStrict()).rejects.toThrow(
      'Topic catalog request failed with status 503'
    );

    global.fetch = originalFetch;
  });
});
