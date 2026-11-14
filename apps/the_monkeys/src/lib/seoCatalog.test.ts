import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  fetchPublicPosts,
  fetchRecentPublicPosts,
  normalizePublicEvents,
  normalizePublicGroups,
  normalizePublicPosts,
} from './seoCatalog';

describe('SEO public catalogs', () => {
  it('loads a bounded recent feed even when the public catalog exceeds ten thousand posts', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        blogs: [{ blog_id: 'recent', title: 'Recent post' }],
        total_blogs: 10001,
      }),
    });
    vi.stubGlobal('fetch', fetchMock);
    expect(
      (await fetchRecentPublicPosts()).map((post) => post.blog_id)
    ).toEqual(['recent']);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(String(fetchMock.mock.calls[0][0])).toContain('limit=100&offset=0');
  });
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

  it('excludes members-only posts from sitemap and RSS catalogs', () => {
    const posts = normalizePublicPosts({
      blogs: [
        { blog_id: 'old', title: 'Old public post' },
        { blog_id: 'public', title: 'Public post', audience: 'public' },
        {
          blog_id: 'private',
          title: 'Members post',
          audience: 'group_only',
        },
      ],
    });

    expect(posts.map((post) => post.blog_id)).toEqual(['old', 'public']);
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

  it('continues after a server-capped page when the total says more posts exist', async () => {
    const responses = [
      { blogs: [{ blog_id: '1', title: 'First' }], total_blogs: 2 },
      { blogs: [{ blog_id: '2', title: 'Second' }], total_blogs: 2 },
    ];
    const fetchMock = vi.fn().mockImplementation(async () => ({
      ok: true,
      status: 200,
      json: async () => responses.shift(),
    }));
    vi.stubGlobal('fetch', fetchMock);
    expect((await fetchPublicPosts(500)).map((post) => post.blog_id)).toEqual([
      '1',
      '2',
    ]);
    expect(String(fetchMock.mock.calls[1][0])).toContain('offset=1');
  });

  it('rejects a repeated catalog page instead of silently claiming complete discovery', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({
          blogs: [{ blog_id: '1', title: 'Repeated' }],
          total_blogs: 3,
        }),
      })
    );
    await expect(fetchPublicPosts(1)).rejects.toThrow(/progress|repeated/i);
  });

  it.each([[], null])(
    'rejects a premature empty page (%j) while the API reports remaining posts',
    async (empty) => {
      const responses = [
        { blogs: [{ blog_id: '1', title: 'First' }], total_blogs: 3 },
        { blogs: empty, total_blogs: 3 },
      ];
      vi.stubGlobal(
        'fetch',
        vi.fn().mockImplementation(async () => ({
          ok: true,
          status: 200,
          json: async () => responses.shift(),
        }))
      );
      await expect(fetchPublicPosts(1)).rejects.toThrow(
        /incomplete|remaining/i
      );
    }
  );

  it('excludes explicit drafts, archived, scheduled and unknown private audiences while preserving legacy public posts', () => {
    const blogs = [
      { blog_id: 'legacy', title: 'Legacy' },
      { blog_id: 'public', title: 'Public', audience: 'public' },
      { blog_id: 'draft', title: 'Draft', is_draft: true },
      { blog_id: 'archived', title: 'Archived', is_archived: true },
      { blog_id: 'scheduled', title: 'Scheduled', is_scheduled: true },
      { blog_id: 'other', title: 'Restricted', audience: 'private' },
    ];
    expect(normalizePublicPosts({ blogs }).map((post) => post.blog_id)).toEqual(
      ['legacy', 'public']
    );
  });
});
