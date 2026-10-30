import { mergeGroupFeedItems } from '@/lib/mergeGroupFeedItems';
import { describe, expect, it } from 'vitest';

describe('mergeGroupFeedItems', () => {
  it('interleaves by time newest first and uses stable prefixed ids', () => {
    const blogs = [
      { blog_id: 'b1', published_time: '2026-10-07T12:00:00.000Z' },
      { blog_id: 'b2', published_time: '2026-10-07T10:00:00.000Z' },
    ] as never[];
    const discussions = [
      { public_id: 'd1', body: 'hi', status: 'visible', created_at: '2026-10-07T11:00:00.000Z' },
    ] as never[];

    const items = mergeGroupFeedItems(blogs, discussions);
    expect(items.map((i) => `${i.kind}:${i.id}`)).toEqual([
      'blog:b1',
      'discussion:d1',
      'blog:b2',
    ]);
  });

  it('returns empty when both inputs are empty', () => {
    expect(mergeGroupFeedItems([], [])).toEqual([]);
  });

  it('ties break by kind then id for stable order', () => {
    const t = '2026-10-07T12:00:00.000Z';
    const items = mergeGroupFeedItems(
      [{ blog_id: 'b', published_time: t } as never],
      [{ public_id: 'd', body: 'x', status: 'visible', created_at: t } as never]
    );
    expect(items.map((i) => i.kind)).toEqual(['blog', 'discussion']);
  });
});
