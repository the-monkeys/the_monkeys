import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  fetchPublicPosts,
  normalizePublicEvents,
  normalizePublicGroups,
  normalizePublicPosts,
} from './seoCatalog';

describe('SEO public catalogs', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('filters malformed posts before sitemap and feed generation', () => {
    expect(
      normalizePublicPosts({
        blogs: [
          {
            blog_id: '1',
            title: 'Valid Post',
            first_image: '',
            first_paragraph: 'Useful summary',
            owner_account_id: 'author-1',
            published_time: '2026-09-10T10:00:00.000Z',
            tags: ['AI'],
          },
          { blog_id: null, title: 'Missing ID' },
          { blog_id: '2', title: '' },
          null,
        ],
      })
    ).toEqual([
      {
        blog_id: '1',
        title: 'Valid Post',
        first_image: '',
        first_paragraph: 'Useful summary',
        owner_account_id: 'author-1',
        published_time: '2026-09-10T10:00:00.000Z',
        tags: ['AI'],
      },
    ]);
  });

  it('fails closed for private, unlisted, incomplete, and malformed events', () => {
    const events = normalizePublicEvents({
      events: [
        {
          id: 1,
          title: 'Public event',
          slug: 'public-event',
          event_type: 'virtual',
          status: 'published',
          visibility: 'public',
        },
        {
          id: 2,
          title: 'Private event',
          slug: 'private-event',
          event_type: 'virtual',
          status: 'published',
          visibility: 'private',
        },
        {
          id: 3,
          title: 'Missing visibility',
          slug: 'missing-visibility',
          event_type: 'virtual',
          status: 'published',
        },
        { id: 4, title: 'Draft', slug: 'draft', visibility: 'public' },
        null,
      ],
    });

    expect(events.map((event) => event.slug)).toEqual(['public-event']);
    expect(normalizePublicEvents({ events: 'invalid' })).toEqual([]);
  });

  it('keeps only explicit public published groups', () => {
    const groups = normalizePublicGroups({
      groups: [
        {
          id: 1,
          name: 'Public group',
          slug: 'public-group',
          visibility: 'public',
          status: 'published',
        },
        {
          id: 2,
          name: 'Private group',
          slug: 'private-group',
          visibility: 'private',
          status: 'published',
        },
        { id: 3, name: 'Missing status', slug: 'missing-status' },
      ],
    });

    expect(groups.map((group) => group.slug)).toEqual(['public-group']);
    expect(normalizePublicGroups({ groups: null })).toEqual([]);
  });

  it('paginates the public post catalog until the reported total is loaded', async () => {
    const responses = [
      {
        blogs: [{ blog_id: '1', title: 'First' }],
        total_blogs: 2,
      },
      {
        blogs: [{ blog_id: '2', title: 'Second' }],
        total_blogs: 2,
      },
    ];
    const fetchMock = vi.fn().mockImplementation(async () => ({
      ok: true,
      status: 200,
      json: async () => responses.shift(),
    }));
    vi.stubGlobal('fetch', fetchMock);

    const posts = await fetchPublicPosts(1);

    expect(posts.map((post) => post.blog_id)).toEqual(['1', '2']);
    expect(fetchMock.mock.calls.map(([url]) => String(url))).toEqual([
      expect.stringContaining('limit=1&offset=0'),
      expect.stringContaining('limit=1&offset=1'),
    ]);
  });
});
