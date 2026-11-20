import { loadPublicRelatedPosts } from '@/lib/relatedPosts';
import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/constants/api', () => ({
  API_URL_V2: 'http://api.example.test/api/v2',
}));
const source = {
  blog_id: 'current',
  tags: ['JavaScript'],
  is_draft: false,
  audience: 'public' as const,
};
const post = (blog_id: string, patch = {}) => ({
  blog_id,
  title: `Post ${blog_id}`,
  tags: ['JavaScript'],
  published_time: '2026-01-01T00:00:00Z',
  ...patch,
});
afterEach(() => vi.unstubAllGlobals());

describe('anonymous server-rendered related posts', () => {
  it('keeps relevant public records, deduplicates and omits self, private, drafts and future posts', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        blogs: [
          post('current'),
          post('public'),
          post('public'),
          post('private', { audience: 'group_only' }),
          post('draft', { is_draft: true }),
          post('future', { published_time: '2099-01-01T00:00:00Z' }),
          post('unrelated', { tags: ['Cooking'] }),
        ],
      }),
    });
    vi.stubGlobal('fetch', fetchMock);
    expect(
      (await loadPublicRelatedPosts(source))?.map((p) => p.blog_id)
    ).toEqual(['public']);
    expect(fetchMock).toHaveBeenCalledWith(
      'http://api.example.test/api/v2/blog/meta-feed?limit=12&offset=0',
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tags: ['JavaScript'] }),
      })
    );
    expect(fetchMock.mock.calls[0][1]).not.toHaveProperty('credentials');
  });
  it('does not request recommendations for drafts or members-only articles', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    expect(
      await loadPublicRelatedPosts({ ...source, audience: 'group_only' })
    ).toEqual([]);
    expect(await loadPublicRelatedPosts({ ...source, is_draft: true })).toEqual(
      []
    );
    expect(await loadPublicRelatedPosts({ ...source, tags: [] })).toEqual([]);
    expect(fetchMock).not.toHaveBeenCalled();
  });
  it('retains the client fallback when the public catalog is unavailable or malformed', async () => {
    const fetchMock = vi
      .fn()
      .mockRejectedValueOnce(new Error('offline'))
      .mockResolvedValueOnce({ ok: false })
      .mockResolvedValueOnce({ ok: true, json: async () => ({ blogs: {} }) });
    vi.stubGlobal('fetch', fetchMock);
    expect(await loadPublicRelatedPosts(source)).toBeUndefined();
    expect(await loadPublicRelatedPosts(source)).toBeUndefined();
    expect(await loadPublicRelatedPosts(source)).toBeUndefined();
  });
});

it('handles missing or malformed legacy tags without throwing', async () => {
  vi.stubGlobal('fetch', vi.fn());
  expect(
    await loadPublicRelatedPosts({ ...source, tags: undefined as never })
  ).toEqual([]);
  expect(
    await loadPublicRelatedPosts({ ...source, tags: null as never })
  ).toEqual([]);
});
