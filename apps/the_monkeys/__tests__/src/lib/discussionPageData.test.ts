import {
  loadDiscussion,
  loadPublicDiscussionIds,
  loadSiteDiscussions,
} from '@/lib/discussionPageData';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const api = vi.hoisted(() => ({ url: 'http://api.test' }));

vi.mock('@/constants/api', () => ({
  get API_URL() {
    return api.url;
  },
  get API_URL_V2() {
    return api.url;
  },
  WSS_URL: '',
  WSS_URL_V2: '',
  LIVE_URL: '',
  FRN_URL: '',
}));

const publicPost = {
  public_id: 'abc',
  body: 'Hello',
  status: 'visible',
  author_username: 'dave',
  author_gone: false,
  group_slug: '',
  reply_count: 0,
  like_count: 0,
  liked: false,
};

describe('discussionPageData', () => {
  beforeEach(() => {
    api.url = 'http://api.test';
    vi.stubGlobal('fetch', vi.fn());
  });

  it('refuses reads when the API URL is unset', async () => {
    api.url = '';
    expect(await loadDiscussion('abc', 'session=1')).toEqual({
      state: 'unavailable',
    });
    expect(await loadSiteDiscussions()).toBeNull();
    expect(await loadPublicDiscussionIds(20)).toEqual([]);
    expect(fetch).not.toHaveBeenCalled();
  });

  it('sends no Cookie header on the first request', async () => {
    vi.mocked(fetch)
      .mockResolvedValueOnce(
        new Response(JSON.stringify(publicPost), { status: 200 })
      )
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ ...publicPost, liked: true }), {
          status: 200,
        })
      );
    expect(await loadDiscussion('abc', 'session=1')).toMatchObject({
      state: 'ok',
      indexable: true,
      discussion: { liked: true },
    });
    expect(fetch).toHaveBeenCalledTimes(2);
    const [url, init] = vi.mocked(fetch).mock.calls[0];
    expect(url).toBe('http://api.test/discussions/abc');
    expect(new Headers(init?.headers).has('Cookie')).toBe(false);
    expect(
      new Headers(vi.mocked(fetch).mock.calls[1][1]?.headers).get('Cookie')
    ).toBe('session=1');
  });

  it('renders the author view of a hidden public thread without indexing it', async () => {
    const hidden = { ...publicPost, status: 'hidden', body: '' };
    vi.mocked(fetch)
      .mockResolvedValueOnce(
        new Response(JSON.stringify(hidden), { status: 200 })
      )
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ ...hidden, body: 'Author evidence' }), {
          status: 200,
        })
      );
    expect(await loadDiscussion('abc', 'session=1')).toMatchObject({
      state: 'ok',
      indexable: false,
      discussion: { body: 'Author evidence' },
    });
  });

  it('keeps authenticated-only content out of the public SEO payload', async () => {
    vi.mocked(fetch)
      .mockResolvedValueOnce(
        new Response(JSON.stringify(publicPost), { status: 200 })
      )
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            ...publicPost,
            body: 'Personalized body',
            liked: true,
          }),
          { status: 200 }
        )
      );
    expect(await loadDiscussion('abc', 'session=1')).toMatchObject({
      state: 'ok',
      indexable: true,
      discussion: { body: 'Personalized body', liked: true },
      publicDiscussion: { body: 'Hello', liked: false },
    });
  });

  it('stops indexing if the authenticated read reports members-only content', async () => {
    vi.mocked(fetch)
      .mockResolvedValueOnce(
        new Response(JSON.stringify(publicPost), { status: 200 })
      )
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({ ...publicPost, audience: 'group_only' }),
          { status: 200 }
        )
      );
    const loaded = await loadDiscussion('abc', 'session=1');
    expect(loaded).toMatchObject({ state: 'ok', indexable: false });
    expect(loaded).not.toHaveProperty('publicDiscussion');
  });

  it('does not reuse a public snapshot after the authorized read becomes private or missing', async () => {
    vi.mocked(fetch)
      .mockResolvedValueOnce(
        new Response(JSON.stringify(publicPost), { status: 200 })
      )
      .mockResolvedValueOnce(new Response('', { status: 404 }));
    expect(await loadDiscussion('abc', 'session=1')).toEqual({
      state: 'missing',
    });
  });

  it('retries a 404 with the member cookie header', async () => {
    vi.mocked(fetch)
      .mockResolvedValueOnce(new Response('', { status: 404 }))
      .mockResolvedValueOnce(
        new Response(JSON.stringify(publicPost), { status: 200 })
      );
    await loadDiscussion('abc', 'session=1');
    expect(fetch).toHaveBeenCalledTimes(2);
    const retry = vi.mocked(fetch).mock.calls[1][1];
    expect(new Headers(retry?.headers).get('Cookie')).toBe('session=1');
  });

  it('returns missing when the member retry is also 404', async () => {
    vi.mocked(fetch).mockResolvedValue(new Response('', { status: 404 }));
    expect(await loadDiscussion('abc', 'session=1')).toEqual({
      state: 'missing',
    });
    expect(fetch).toHaveBeenCalledTimes(2);
  });

  it('marks a public post indexable', async () => {
    vi.mocked(fetch).mockResolvedValue(
      new Response(
        JSON.stringify({
          public_id: 'abc',
          body: 'Hello',
          status: 'visible',
          author_username: 'dave',
          author_gone: false,
          group_slug: '',
          reply_count: 0,
          like_count: 0,
          liked: false,
        }),
        { status: 200 }
      )
    );
    const loaded = await loadDiscussion('abc', '');
    expect(loaded).toMatchObject({ state: 'ok', indexable: true });
  });

  it('hides a post that only the member cookie can read', async () => {
    vi.mocked(fetch)
      .mockResolvedValueOnce(new Response('', { status: 404 }))
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            public_id: 'abc',
            body: 'Secret',
            status: 'visible',
            author_username: 'dave',
            author_gone: false,
            group_slug: 'tea',
            reply_count: 0,
            like_count: 0,
            liked: false,
          }),
          { status: 200 }
        )
      );
    const loaded = await loadDiscussion('abc', 'session=1');
    expect(loaded).toMatchObject({ state: 'ok', indexable: false });
  });

  it('returns missing when nobody can read it', async () => {
    vi.mocked(fetch).mockResolvedValue(new Response('', { status: 404 }));
    expect(await loadDiscussion('abc', '')).toEqual({ state: 'missing' });
  });

  it('loads the site feed with the reader cookie and preserves the paging cursor', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(
        JSON.stringify({ discussions: [{ ...publicPost, liked: true }] }),
        { status: 200 }
      )
    );
    expect(
      await loadSiteDiscussions('older/id', 'session=reader')
    ).toMatchObject({ discussions: [{ liked: true }] });
    const [url, init] = vi.mocked(fetch).mock.calls[0];
    expect(url).toBe('http://api.test/discussions?before_id=older%2Fid');
    expect(new Headers(init?.headers).get('Cookie')).toBe('session=reader');
    expect(init?.cache).toBe('no-store');
  });

  it('collects only visible public ids and skips a failed group', async () => {
    vi.mocked(fetch)
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            discussions: [{ public_id: 's1', status: 'visible' }],
          }),
          { status: 200 }
        )
      )
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            groups: [
              {
                slug: 'tea',
                visibility: 'public',
                status: 'published',
                id: 1,
                name: 'Tea',
              },
            ],
          }),
          { status: 200 }
        )
      )
      .mockResolvedValueOnce(new Response('', { status: 404 }));
    await expect(loadPublicDiscussionIds(20)).resolves.toEqual(['s1']);
  });

  it.each(['bad cursor', 'x&before_id=y', 'x\nheader', 'x\n', 'x'.repeat(201)])(
    'does not forward an unsafe cursor: %s',
    async (cursor) => {
      vi.mocked(fetch).mockResolvedValue(new Response('{"discussions":[]}'));
      await loadSiteDiscussions(cursor);
      expect(vi.mocked(fetch).mock.calls[0][0]).toBe(
        'http://api.test/discussions'
      );
    }
  );

  it('filters restricted and removed feed rows while paging from the raw tail', async () => {
    const rows = Array.from({ length: 20 }, (_, i) => ({
      ...publicPost,
      public_id: `p${i}`,
    }));
    const restricted = [
      { ...publicPost, public_id: 'members', audience: 'group_only' },
      { ...publicPost, public_id: 'private', audience: 'private' },
      { ...publicPost, public_id: 'removed', status: 'removed' },
      { ...publicPost, public_id: 'hidden', status: 'hidden' },
    ];
    vi.mocked(fetch).mockResolvedValue(
      new Response(
        JSON.stringify({
          discussions: [...rows.slice(0, 16), ...restricted],
        })
      )
    );
    const page = await loadSiteDiscussions();
    expect(page?.discussions.map((post) => post.public_id)).toEqual(
      rows.slice(0, 16).map((post) => post.public_id)
    );
    expect(page).toHaveProperty('nextBeforeId', 'hidden');
  });

  it('walks older site and public group pages, deduplicating and respecting sparse legacy audiences', async () => {
    const site = Array.from({ length: 20 }, (_, i) => ({
      ...publicPost,
      public_id: `s${i}`,
    }));
    const group = Array.from({ length: 20 }, (_, i) => ({
      ...publicPost,
      public_id: `g${i}`,
      group_slug: 'tea',
    }));
    vi.mocked(fetch).mockImplementation(async (input) => {
      const url = String(input);
      const payload =
        url.endsWith('/discussions') && !url.includes('/groups/')
          ? { discussions: site }
          : url.endsWith('/discussions?before_id=s19')
            ? {
                discussions: [
                  {
                    ...publicPost,
                    public_id: 'older-site',
                    audience: 'public',
                  },
                ],
              }
            : url.includes('/groups?')
              ? {
                  groups: [
                    {
                      id: 1,
                      slug: 'tea',
                      name: 'Tea',
                      status: 'published',
                      visibility: 'public',
                    },
                    {
                      id: 2,
                      slug: 'secret',
                      name: 'Secret',
                      status: 'published',
                      visibility: 'private',
                    },
                  ],
                }
              : url.endsWith('/groups/tea/discussions')
                ? { discussions: group }
                : url.endsWith('/groups/tea/discussions?before_id=g19')
                  ? {
                      discussions: [
                        {
                          ...publicPost,
                          public_id: 'older-group',
                          group_slug: 'tea',
                          audience: '',
                        },
                        site[0],
                        {
                          ...publicPost,
                          public_id: 'secret',
                          audience: 'group_only',
                        },
                        {
                          ...publicPost,
                          public_id: 'private',
                          audience: 'private',
                        },
                        {
                          ...publicPost,
                          public_id: 'deleted',
                          status: 'deleted',
                        },
                      ],
                    }
                  : { discussions: [] };
      return new Response(JSON.stringify(payload));
    });
    const ids = await loadPublicDiscussionIds(100);
    expect(ids).toContain('older-site');
    expect(ids).toContain('older-group');
    expect(ids.filter((id) => id === 's0')).toHaveLength(1);
    expect(ids).not.toContain('secret');
    expect(ids).not.toContain('private');
    expect(ids).not.toContain('deleted');
    expect(
      vi
        .mocked(fetch)
        .mock.calls.some(([url]) => String(url).includes('/groups/secret/'))
    ).toBe(false);
    for (const [, init] of vi.mocked(fetch).mock.calls) {
      expect(new Headers(init?.headers).has('Cookie')).toBe(false);
    }
  });

  it('stops a repeating full page even when every row is ineligible', async () => {
    const rows = Array.from({ length: 20 }, (_, i) => ({
      ...publicPost,
      public_id: `hidden${i}`,
      audience: 'group_only',
    }));
    vi.mocked(fetch).mockImplementation(
      async (url) =>
        new Response(
          JSON.stringify(
            String(url).includes('/groups?')
              ? { groups: [] }
              : { discussions: rows }
          )
        )
    );
    expect(await loadPublicDiscussionIds(100)).toEqual([]);
    expect(
      vi
        .mocked(fetch)
        .mock.calls.filter(([url]) => String(url).includes('/discussions'))
    ).toHaveLength(2);
  });

  it('bounds sitemap requests even if every response has a new full page', async () => {
    let page = 0;
    vi.mocked(fetch).mockImplementation(
      async (url) =>
        new Response(
          JSON.stringify(
            String(url).includes('/groups?')
              ? {
                  groups: Array.from({ length: 40 }, (_, i) => ({
                    id: i,
                    slug: `g${i}`,
                    name: 'Group',
                    status: 'published',
                    visibility: 'public',
                  })),
                }
              : {
                  discussions: Array.from({ length: 20 }, (_, i) => ({
                    ...publicPost,
                    public_id: `p${page++}-${i}`,
                    audience: 'group_only',
                  })),
                }
          )
        )
    );
    expect(await loadPublicDiscussionIds(200)).toEqual([]);
    expect(vi.mocked(fetch).mock.calls.length).toBeLessThanOrEqual(41);
  });

  it.each([0, -1, NaN, Infinity])(
    'does not fetch for an invalid sitemap limit %s',
    async (limit) => {
      expect(await loadPublicDiscussionIds(limit)).toEqual([]);
      expect(fetch).not.toHaveBeenCalled();
    }
  );
});
