import { describe, expect, it } from 'vitest';

import { buildRssXml } from './seoFeed';

describe('RSS generation', () => {
  it('emits canonical item links and escapes untrusted text', () => {
    const xml = buildRssXml({
      title: 'Posts & Community',
      description: 'Latest posts',
      path: '/feed',
      items: [
        {
          title: 'Research < Practice',
          link: 'https://monkeys.com.co/blog/research-practice-1',
          guid: 'https://monkeys.com.co/blog/research-practice-1',
          description: 'Ideas & evidence ]]> continued',
          pubDate: new Date('2026-09-10T10:00:00.000Z'),
        },
      ],
    });

    expect(xml).toContain('<title>Posts &amp; Community</title>');
    expect(xml).toContain('<title>Research &lt; Practice</title>');
    expect(xml).toContain(
      '<link>https://monkeys.com.co/blog/research-practice-1</link>'
    );
    expect(xml).toContain(
      '<description><![CDATA[Ideas & evidence ]]]]><![CDATA[> continued]]></description>'
    );
  });
});
