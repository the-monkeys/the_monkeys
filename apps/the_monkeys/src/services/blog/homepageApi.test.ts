import { fetcherV2 } from '@/services/fetcher';
import { QueryClient } from '@tanstack/react-query';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { homepageBlogQuery, readHomepageBlogs } from './homepageApi';

vi.mock('@/services/fetcher', () => ({ fetcherV2: vi.fn() }));
const assessment = {
  eligible: true,
  lead_eligible: false,
  word_count: 250,
  minimum_words: 250,
  reasons: [],
  version: 'homepage-v1',
};
const blog = {
  blog_id: 'qualified',
  title: 'Article',
  first_image: '',
  first_paragraph: 'Summary',
  owner_account_id: 'author',
  published_time: '2026-01-01',
  tags: ['Science'],
  homepage_eligibility: assessment,
};
const response = () => ({
  blogs: [blog],
  has_more: false,
  homepage_policy_version: 'homepage-v1',
});
beforeEach(() => vi.resetAllMocks());
describe('homepage-only feed contract', () => {
  it.each(['latest', 'trending'] as const)(
    'requests the policy endpoint for %s only',
    async (sort) => {
      vi.mocked(fetcherV2).mockResolvedValue(response());
      expect(await readHomepageBlogs({ limit: 12, offset: 0, sort })).toEqual(
        response()
      );
      expect(fetcherV2).toHaveBeenCalledTimes(1);
      expect(fetcherV2).toHaveBeenCalledWith(
        `/blog/homepage?limit=12&offset=0&sort=${sort}`
      );
    }
  );
  it.each([
    {},
    { blogs: [] },
    { ...response(), homepage_policy_version: 'homepage-v0' },
    { ...response(), has_more: undefined },
    { ...response(), blogs: [{ ...blog, homepage_eligibility: undefined }] },
    {
      ...response(),
      blogs: [
        {
          ...blog,
          homepage_eligibility: { ...assessment, version: 'homepage-v0' },
        },
      ],
    },
  ])(
    'rejects an old or unmarked backend without a legacy fallback: %j',
    async (data) => {
      vi.mocked(fetcherV2).mockResolvedValue(data);
      await expect(readHomepageBlogs()).rejects.toThrow(/homepage/i);
      expect(fetcherV2).toHaveBeenCalledTimes(1);
    }
  );
  it('keeps an empty confirmed policy response empty', async () => {
    vi.mocked(fetcherV2).mockResolvedValue({ ...response(), blogs: [] });
    expect((await readHomepageBlogs()).blogs).toEqual([]);
  });
  it('propagates an outage without calling the old feed', async () => {
    vi.mocked(fetcherV2).mockRejectedValue(new Error('Unavailable'));
    await expect(readHomepageBlogs()).rejects.toThrow('Unavailable');
    expect(fetcherV2).toHaveBeenCalledTimes(1);
  });
  it('drops explicitly ineligible and restricted records even if included by a server', async () => {
    vi.mocked(fetcherV2).mockResolvedValue({
      ...response(),
      blogs: [
        blog,
        { ...blog, blog_id: 'private', audience: 'group_only' },
        {
          ...blog,
          blog_id: 'thin',
          homepage_eligibility: { ...assessment, eligible: false },
        },
      ],
    });
    expect((await readHomepageBlogs()).blogs.map((b) => b.blog_id)).toEqual([
      'qualified',
    ]);
  });
  it('separates public policy/latest/trending/pagination caches and preserves meta-feed prefix invalidation', async () => {
    const qc = new QueryClient();
    const latest = homepageBlogQuery({ limit: 12 });
    const trending = homepageBlogQuery({ sort: 'trending' });
    const next = homepageBlogQuery({ offset: 12 });
    qc.setQueryData(['meta-feed-blogs', 12], { blogs: ['ordinary'] });
    qc.setQueryData(['trending-blogs'], { blogs: ['ordinary trending'] });
    for (const query of [latest, trending, next]) {
      expect(query.queryKey.slice(0, 3)).toEqual([
        'meta-feed-blogs',
        'homepage',
        'public',
      ]);
      expect(query.staleTime).toBe(0);
      qc.setQueryData(query.queryKey, response());
    }
    expect(
      new Set([latest, trending, next].map((q) => JSON.stringify(q.queryKey)))
        .size
    ).toBe(3);
    expect(qc.getQueryData(['meta-feed-blogs', 12])).toEqual({
      blogs: ['ordinary'],
    });
    await qc.invalidateQueries({ queryKey: ['meta-feed-blogs'] });
    for (const q of [latest, trending, next])
      expect(qc.getQueryState(q.queryKey)?.isInvalidated).toBe(true);
    expect(qc.getQueryState(['trending-blogs'])?.isInvalidated).toBe(false);
  });
});
