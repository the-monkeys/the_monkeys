import {
  loadDiscussion,
  loadPublicDiscussionIds,
} from '@/lib/discussionPageData';
import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('discussionPageData', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
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
