import { GET as getLlmsText } from '@/app/llms.txt/route';
import robots from '@/app/robots';
import { describe, expect, it } from 'vitest';

describe('crawler discovery routes', () => {
  it('explicitly permits search and assistant crawlers on public pages', () => {
    const route = robots();

    expect(route.rules).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ userAgent: 'OAI-SearchBot', allow: '/' }),
        expect.objectContaining({ userAgent: 'ChatGPT-User', allow: '/' }),
      ])
    );
    const openAiRule = Array.isArray(route.rules)
      ? route.rules.find((rule) => rule.userAgent === 'OAI-SearchBot')
      : undefined;
    expect(openAiRule).toMatchObject({
      disallow: expect.arrayContaining(['/auth/', '/settings', '/library']),
    });
    expect(route.sitemap).toEqual(
      expect.arrayContaining([
        'https://monkeys.com.co/sitemap.xml',
        'https://monkeys.com.co/topics/sitemap.xml',
        'https://monkeys.com.co/events/sitemap.xml',
        'https://monkeys.com.co/groups/sitemap.xml',
      ])
    );
  });

  it('describes the current product, publisher, and discovery feeds', async () => {
    const response = getLlmsText();
    const body = await response.text();

    expect(body).toContain('Buddhicintaka (OPC) Pvt. Ltd.');
    expect(body).toContain('content and community platform');
    expect(body).toContain('/posts/feed.xml');
    expect(body).toContain('/topics/explore');
    expect(body.toLowerCase()).not.toContain('blogs');
    expect(body).not.toContain('\u2014');
  });
});
