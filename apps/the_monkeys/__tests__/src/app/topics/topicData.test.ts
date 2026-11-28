import { fetchTopicPosts } from '@/app/topics/[topic]/topicData';
import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/constants/api', () => ({ API_URL_V2: 'http://127.0.0.1:9/api/v2' }));

describe('public topic post loading', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('preserves an outage instead of reporting an empty topic', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(new Response('', { status: 503 }))
    );
    await expect(fetchTopicPosts('Go')).rejects.toThrow('503');
  });

  it('preserves network errors instead of changing indexing policy', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockRejectedValue(new Error('Local test network failure'))
    );
    await expect(fetchTopicPosts('Go')).rejects.toThrow(
      'Local test network failure'
    );
  });

  it('keeps old public records, removes restricted and blank records, and deduplicates IDs', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            blogs: [
              { blog_id: 'old', title: 'Legacy post', tags: ['Go'] },
              { blog_id: 'old', title: 'Duplicate', tags: ['Go'] },
              { blog_id: 'private', title: 'Private', audience: 'group_only' },
              { blog_id: 'draft', title: 'Draft', is_draft: true },
              { blog_id: 'blank', title: '   ' },
            ],
            total_blogs: 5,
          }),
          { status: 200 }
        )
      )
    );
    expect(
      (await fetchTopicPosts('Go')).blogs.map((post) => post.blog_id)
    ).toEqual(['old']);
  });

  it('accepts the legacy null list as a genuinely empty topic', async () => {
    vi.stubGlobal(
      'fetch',
      vi
        .fn()
        .mockResolvedValue(
          new Response(JSON.stringify({ blogs: null, total_blogs: 0 }), {
            status: 200,
          })
        )
    );
    expect(await fetchTopicPosts('Empty')).toEqual({
      blogs: [],
      total_blogs: 0,
    });
  });
});
