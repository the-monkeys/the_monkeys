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
    vi.mocked(fetch).mockResolvedValue(
      new Response(JSON.stringify(publicPost), { status: 200 })
    );
    await loadDiscussion('abc', 'session=1');
    expect(fetch).toHaveBeenCalledTimes(1);
    const [url, init] = vi.mocked(fetch).mock.calls[0];
    expect(url).toBe('http://api.test/discussions/abc');
    expect(new Headers(init?.headers).has('Cookie')).toBe(false);
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
});
