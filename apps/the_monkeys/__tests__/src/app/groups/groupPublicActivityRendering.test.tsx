// @vitest-environment node
import { isValidElement } from 'react';

import GroupDetailClient from '@/app/groups/[slug]/GroupDetailClient';
import GroupPage from '@/app/groups/[slug]/page';
import { queryKeys } from '@/lib/queryKeys';
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from '@tanstack/react-query';
import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const state = vi.hoisted(() => ({ group: {} as any, fetch: vi.fn() }));
vi.mock('@/constants/api', () => ({
  API_URL: 'https://fixture.test/api/v1',
  API_URL_V2: 'https://fixture.test/api/v2',
  LIVE_URL: 'https://fixture.test',
  FRN_URL: 'https://fixture.test',
  WSS_URL: '',
  WSS_URL_V2: '',
}));
vi.mock('@/app/groups/[slug]/groupMetadata', () => ({
  loadGroupForMetadata: async () => ({ group: state.group }),
}));
vi.mock('@/utils/get-query-client', () => ({
  getQueryClient: () => new QueryClient(),
}));
vi.mock('@/hooks/auth/useAuth', () => ({
  default: () => ({ data: undefined }),
}));
vi.mock('@/hooks/groups/useGroupQueries', () => ({
  useGroupDetail: (slug: string) =>
    useQuery({
      queryKey: queryKeys.groups.detail(slug),
      queryFn: () => {
        throw new Error('No browser requests in initial HTML');
      },
    }),
  useGroupBlogs: () => ({ isLoading: true, data: undefined, isError: false }),
}));
vi.mock('@/components/groups/detail/GroupJoinButton', () => ({
  GroupJoinButton: () => null,
}));
vi.mock('@/components/groups/detail/GroupCreateMenu', () => ({
  GroupCreateMenu: () => null,
}));
vi.mock('@/components/discussions/DiscussionComposer', () => ({
  DiscussionComposer: () => null,
}));
vi.mock('@/components/discussions/DiscussionFeedActions', () => ({
  DiscussionFeedActions: () => <button>Like discussion</button>,
}));
vi.mock('@/components/discussions/DiscussionCard', () => ({
  DiscussionCard: ({ post, footer }: any) => (
    <article>
      <a href={`/discussions/${post.public_id}`}>{post.body}</a>
      {footer}
    </article>
  ),
}));
vi.mock('@/components/cards/blog/FeedBlogCard', () => ({
  FeedBlogCard: ({ blog }: any) => (
    <article>
      <a href={`/blog/${blog.slug}-${blog.blogId}`}>{blog.title}</a>
      <p>{blog.description}</p>
    </article>
  ),
}));

function detailProps(node: React.ReactNode): any {
  if (Array.isArray(node)) return node.map(detailProps).find(Boolean);
  if (!isValidElement<{ children?: React.ReactNode }>(node)) return undefined;
  if (node.type === GroupDetailClient) return node.props;
  return detailProps(node.props.children);
}

const blog = (id: string, extra = {}) => ({
  blog_id: id,
  owner_account_id: 'writer',
  published_time: '2026-10-01T10:00:00Z',
  audience: 'public',
  group_slug: 'writers',
  blog: {
    time: 1,
    blocks: [
      { type: 'header', data: { text: `Public title ${id}`, level: 1 } },
      { type: 'paragraph', data: { text: 'A public preview for visitors.' } },
      { type: 'paragraph', data: { text: 'UNUSED_FULL_DOCUMENT_SENTINEL' } },
    ],
  },
  ...extra,
});
const discussion = (id: string, extra = {}) => ({
  public_id: id,
  body: `Public discussion ${id}`,
  status: 'visible',
  group_slug: 'writers',
  audience: 'public',
  created_at: { seconds: '1790848800' },
  replies: [{ body: 'UNSERIALIZED_REPLY_SENTINEL' }],
  ...extra,
});

describe('group detail public activity in initial HTML', () => {
  beforeEach(() => {
    state.group = {
      id: 1,
      slug: 'writers',
      name: 'Writers',
      visibility: 'public',
      status: 'published',
      topics: ['Machine Learning', '!!!'],
    };
    state.fetch
      .mockReset()
      .mockImplementation(async (url: string) => ({
        ok: true,
        json: async () =>
          url.includes('/blogs?')
            ? {
                blogs: [
                  blog('public'),
                  blog('draft', { is_draft: true }),
                  blog('private', { audience: 'group_only' }),
                  blog('scheduled', { is_scheduled: true }),
                  blog('future', { published_time: '2999-01-01T00:00:00Z' }),
                  blog('removed', { status: 'removed' }),
                ],
              }
            : {
                discussions: [
                  discussion('public'),
                  discussion('private', { audience: 'group_only' }),
                  discussion('removed', { status: 'removed' }),
                  discussion('draft', { status: 'draft' }),
                  discussion('scheduled', { is_scheduled: true }),
                ],
              },
      }));
    vi.stubGlobal('fetch', state.fetch);
  });
  afterEach(() => vi.unstubAllGlobals());

  it('renders anonymous public blogs and discussions together in the existing Posts tab before effects', async () => {
    const page = await GroupPage({ params: { slug: 'writers' } });
    const html = renderToStaticMarkup(
      <QueryClientProvider client={new QueryClient()}>
        {page}
      </QueryClientProvider>
    );
    expect(html).toContain('Public title public');
    expect(html).toContain('A public preview for visitors.');
    expect(html).toContain('Public discussion public');
    expect(html).toContain('Like discussion');
    expect(html).not.toContain('Loading posts');
    expect(html).toContain('href="/topics/machine-learning"');
    expect(html).not.toContain('href="/topics/"');
    const payload = JSON.stringify(detailProps(page));
    for (const sentinel of [
      'UNUSED_FULL_DOCUMENT_SENTINEL',
      'UNSERIALIZED_REPLY_SENTINEL',
      'Public title draft',
      'Public title private',
      'Public title scheduled',
      'Public title future',
      'Public title removed',
      'Public discussion private',
      'Public discussion removed',
      'Public discussion draft',
      'Public discussion scheduled',
    ]) {
      expect(payload).not.toContain(sentinel);
      expect(html).not.toContain(sentinel);
    }
    expect(state.fetch.mock.calls.map(([url]) => url).sort()).toEqual([
      'https://fixture.test/api/v1/groups/writers/blogs?limit=20&offset=0',
      'https://fixture.test/api/v1/groups/writers/discussions?limit=20&offset=0',
    ]);
    for (const [, init] of state.fetch.mock.calls) {
      expect(init.cache).toBe('no-store');
      expect(init.credentials).toBe('omit');
      expect(init.headers).toBeUndefined();
      expect(init.signal).toBeInstanceOf(AbortSignal);
    }
  });

  it.each([
    { visibility: 'private', status: 'published' },
    { visibility: 'unlisted', status: 'published' },
    { visibility: 'public', status: 'draft' },
    { visibility: 'public', status: 'suspended' },
  ])(
    'does not fetch or serialize child activity for $visibility/$status groups',
    async (gate) => {
      Object.assign(state.group, gate);
      const page = await GroupPage({ params: { slug: 'writers' } });
      expect(state.fetch).not.toHaveBeenCalled();
      expect(detailProps(page).initialPublicActivity).toBeUndefined();
    }
  );
});
