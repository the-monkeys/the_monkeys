// @vitest-environment node
import { loadGroupPublicActivity } from '@/lib/groupPublicActivity';
import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/constants/api', () => ({ API_URL: 'https://fixture.test/api/v1' }));
const group = {
  id: 1,
  slug: 'writers',
  name: 'Writers',
  status: 'published',
  visibility: 'public',
} as const;
const post = (id: string, extra = {}) => ({
  blog_id: id,
  owner_account_id: 'author',
  published_time: '2026-01-01T00:00:00Z',
  blog: {
    blocks: [
      { type: 'title', data: { text: 'Legacy title' } },
      { type: 'list', data: { items: ['First item', 'Second item'] } },
      {
        type: 'image',
        data: {
          file: {
            url: 'https://fixture.test/photo.jpg',
            private: 'private-file-data',
          },
        },
      },
      { type: 'paragraph', data: { text: 'Unused body sentinel' } },
    ],
  },
  LikeCount: 7,
  ...extra,
});
afterEach(() => vi.unstubAllGlobals());

describe('anonymous public group activity snapshot', () => {
  it('bounds oversize API responses and keeps only preview blocks and public discussion fields', async () => {
    const fetch = vi.fn(async (url: string) => ({
      ok: true,
      json: async () =>
        url.includes('/blogs?')
          ? { blogs: Array.from({ length: 25 }, (_, i) => post(String(i))) }
          : {
              discussions: Array.from({ length: 25 }, (_, i) => ({
                public_id: String(i),
                body: 'Hello',
                status: 'visible',
                liked: true,
                replies: [{ body: 'Secret reply' }],
                created_at: { seconds: '1767225600' },
              })),
            },
    }));
    vi.stubGlobal('fetch', fetch);
    const snapshot = await loadGroupPublicActivity(group);
    expect(snapshot?.blogs).toHaveLength(20);
    expect(snapshot?.discussions).toHaveLength(20);
    expect(snapshot?.blogs?.[0].blog.blocks).toHaveLength(3);
    expect(snapshot?.blogs?.[0].blog.blocks[1].data.items).toEqual([
      'First item',
      'Second item',
    ]);
    expect(snapshot?.blogs?.[0].LikeCount).toBe(7);
    expect(snapshot?.discussions?.[0].created_at).toEqual({
      seconds: '1767225600',
    });
    expect(JSON.stringify(snapshot)).not.toMatch(
      /Unused body sentinel|private-file-data|Secret reply|"liked"/
    );
    expect(fetch).toHaveBeenCalledTimes(2);
  });

  it('retains the successful feed when the other anonymous request fails', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async (url: string) => {
        if (url.includes('/discussions?')) throw new Error('offline');
        return { ok: true, json: async () => ({ blogs: [post('legacy')] }) };
      })
    );
    const snapshot = await loadGroupPublicActivity(group);
    expect(snapshot?.blogs?.map((blog) => blog.blog_id)).toEqual(['legacy']);
    expect(snapshot?.discussions).toBeUndefined();
  });

  it('rejects malformed, mismatched, restricted and unpublished children but accepts omitted legacy public flags', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async (url: string) => ({
        ok: true,
        json: async () =>
          url.includes('/blogs?')
            ? {
                blogs: [
                  null,
                  {},
                  post('legacy'),
                  post('other', { group_slug: 'other' }),
                  post('unlisted', { visibility: 'unlisted' }),
                  post('archived', { is_archived: true }),
                  post('scheduled', { status: 'scheduled' }),
                ],
              }
            : {
                discussions: [
                  null,
                  {},
                  {
                    public_id: 'old',
                    status: 'visible',
                    body: 'Legacy public',
                  },
                  { public_id: 'hidden', status: 'hidden', body: 'Restricted' },
                  {
                    public_id: 'other',
                    status: 'visible',
                    body: 'Wrong group',
                    group_slug: 'other',
                  },
                ],
              },
      }))
    );
    const snapshot = await loadGroupPublicActivity(group);
    expect(snapshot?.blogs?.map((blog) => blog.blog_id)).toEqual(['legacy']);
    expect(
      snapshot?.discussions?.map((discussion) => discussion.public_id)
    ).toEqual(['old']);
  });
});
