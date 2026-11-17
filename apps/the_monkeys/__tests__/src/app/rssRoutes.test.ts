import * as events from '@/app/events/feed.xml/route';
import * as groups from '@/app/groups/feed.xml/route';
import * as posts from '@/app/posts/feed.xml/route';
import { afterEach, describe, expect, it, vi } from 'vitest';

const routes = [
  ['events', events, { events: [], total: 0 }],
  ['groups', groups, { groups: [], total: 0 }],
  ['posts', posts, { blogs: [], total_blogs: 0 }],
] as const;

afterEach(() => vi.unstubAllGlobals());

describe.each(routes)('%s RSS availability', (_name, route, emptyCatalog) => {
  it('loads on request rather than depending on the API during a build', () => {
    expect(route).toHaveProperty('dynamic', 'force-dynamic');
  });

  it('preserves the RSS format and successful-response cache policy', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => Response.json(emptyCatalog))
    );
    const response = await route.GET();
    expect(response.status).toBe(200);
    expect(response.headers.get('Content-Type')).toBe(
      'application/rss+xml; charset=utf-8'
    );
    expect(response.headers.get('Cache-Control')).toBe(
      'public, s-maxage=300, stale-while-revalidate=600'
    );
    expect(await response.text()).toContain('<rss version="2.0">');
  });

  it('returns a retryable uncached error during an API outage and recovers', async () => {
    const fetch = vi
      .fn()
      .mockResolvedValueOnce(
        new Response('SSL handshake failed', { status: 525 })
      )
      .mockImplementation(async () => Response.json(emptyCatalog));
    vi.stubGlobal('fetch', fetch);
    const failed = await route.GET();
    expect(failed.status).toBe(503);
    expect(failed.headers.get('Cache-Control')).toBe('no-store');
    expect(failed.headers.get('Retry-After')).toBe('60');
    expect(await failed.text()).not.toContain('<rss');
    expect((await route.GET()).status).toBe(200);
  });

  it('handles a network failure without presenting an empty successful feed', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockRejectedValue(new TypeError('fetch failed'))
    );
    expect((await route.GET()).status).toBe(503);
  });
});

it('preserves public event items while excluding private events', async () => {
  const event = {
    id: 7,
    title: 'Community & research',
    slug: 'community-research',
    status: 'published',
    visibility: 'public',
    event_type: 'virtual',
    start_time: '2026-11-12T13:30:00Z',
  };
  vi.stubGlobal(
    'fetch',
    vi.fn(async () =>
      Response.json({
        events: [
          event,
          { ...event, id: 8, title: 'Private event', visibility: 'private' },
        ],
        total: 2,
      })
    )
  );
  const xml = await (await events.GET()).text();
  expect(xml).toContain('<title>Community &amp; research</title>');
  expect(xml).toContain('/events/community-research</link>');
  expect(xml).toContain('<pubDate>Thu, 12 Nov 2026 13:30:00 GMT</pubDate>');
  expect(xml).not.toContain('Private event');
});

it('preserves public group items while excluding private groups', async () => {
  const group = {
    id: 7,
    name: 'Research group',
    slug: 'research-group',
    status: 'published',
    visibility: 'public',
  };
  vi.stubGlobal(
    'fetch',
    vi.fn(async () =>
      Response.json({
        groups: [
          group,
          { ...group, id: 8, name: 'Private group', visibility: 'private' },
        ],
        total: 2,
      })
    )
  );
  const xml = await (await groups.GET()).text();
  expect(xml).toContain('<title>Research group</title>');
  expect(xml).toContain('/groups/research-group</link>');
  expect(xml).not.toContain('Private group');
});

it('keeps older public posts and their stable RSS identity', async () => {
  vi.stubGlobal(
    'fetch',
    vi.fn(async () =>
      Response.json({
        blogs: [
          { blog_id: 'older1', title: 'Older post' },
          {
            blog_id: 'private1',
            title: 'Members post',
            audience: 'group_only',
          },
        ],
        total_blogs: 2,
      })
    )
  );
  const xml = await (await posts.GET()).text();
  expect(xml).toContain('<title>Older post</title>');
  expect(xml).toContain('/blog/older-post-older1</link>');
  expect(xml).toMatch(
    /<guid isPermaLink="true">[^<]+\/blog\/older-post-older1<\/guid>/
  );
  expect(xml).not.toContain('Members post');
});
