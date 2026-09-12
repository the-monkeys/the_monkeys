import { describe, expect, it } from 'vitest';

import { landingCollectionSchema, landingMetadata } from './landingPageSeo';

describe('landing page SEO', () => {
  it('positions Monkeys around posts, events, groups, content, and community', () => {
    const metadata = JSON.stringify(landingMetadata).toLowerCase();

    for (const term of ['content', 'posts', 'events', 'groups', 'community']) {
      expect(metadata).toContain(term);
    }
    expect(metadata).not.toMatch(/blog|blogging/);
    expect(metadata).not.toContain('\u2014');
    expect(landingMetadata.title).toEqual({
      absolute: 'Monkeys | Posts, Events and Communities',
    });
  });

  it('publishes crawlable navigation for the current product areas', () => {
    const schema = JSON.stringify(landingCollectionSchema);

    expect(schema).toContain('CollectionPage');
    expect(schema).toContain('SiteNavigationElement');
    expect(schema).toContain('https://monkeys.com.co/events');
    expect(schema).toContain('https://monkeys.com.co/groups');
    expect(schema).toContain('https://monkeys.com.co/topics/explore');
  });
});
