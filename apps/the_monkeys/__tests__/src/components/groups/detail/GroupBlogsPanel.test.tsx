import { GroupBlogsPanel } from '@/components/groups/detail/GroupBlogsPanel';
import { useGroupBlogs } from '@/hooks/groups/useGroupQueries';
import { Blog } from '@/services/blog/blogTypes';
import { GroupItem } from '@/services/groups/groupsTypes';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/hooks/groups/useGroupQueries', () => ({
  useGroupBlogs: vi.fn(),
}));

vi.mock('@/hooks/auth/useAuth', () => ({
  default: vi.fn(() => ({ data: null })),
}));

vi.mock('@/components/cards/blog/FeedBlogCard', () => ({
  FeedBlogCard: ({ blog }: { blog: { title: string; audience?: string } }) => (
    <article>
      <span>{blog.title}</span>
      {blog.audience === 'group_only' && <span>Members only</span>}
    </article>
  ),
}));

const publicGroup = {
  id: 1,
  slug: 'writers',
  name: 'Writers',
  visibility: 'public',
  status: 'published',
} satisfies GroupItem;

const memberGroup = {
  ...publicGroup,
  viewer_role: 'member',
  viewer_member_status: 'active',
} satisfies GroupItem;

const membersOnlyBlog = {
  blog_id: 'post-1',
  owner_account_id: 'author-1',
  blog: {
    time: 1,
    blocks: [
      {
        id: 'title',
        type: 'header',
        data: { text: 'Draft craft' },
        author: [],
        time: 1,
      },
    ],
  },
  is_draft: false,
  published_time: '2026-09-19T10:00:00.000Z',
  tags: ['Writing'],
  LikeCount: 0,
  like_count: 0,
  BookmarkCount: 0,
  bookmark_count: 0,
  audience: 'group_only',
  group_slug: 'writers',
} satisfies Blog;

const mockedUseGroupBlogs = vi.mocked(useGroupBlogs);

describe('GroupBlogsPanel', () => {
  beforeEach(() => vi.clearAllMocks());

  it('asks logged-out visitors to log in and join when the public list is empty', () => {
    mockedUseGroupBlogs.mockReturnValue({
      data: { pages: [{ blogs: [] }], pageParams: [0] },
      isLoading: false,
      isError: false,
      hasNextPage: false,
      fetchNextPage: vi.fn(),
      isFetchingNextPage: false,
    } as never);

    render(<GroupBlogsPanel group={publicGroup} />);

    expect(
      screen.getByText('Log in and join this group to see posts.')
    ).toBeTruthy();
  });

  it('keeps the true-empty copy for members', () => {
    mockedUseGroupBlogs.mockReturnValue({
      data: { pages: [{ blogs: [] }], pageParams: [0] },
      isLoading: false,
      isError: false,
      hasNextPage: false,
      fetchNextPage: vi.fn(),
      isFetchingNextPage: false,
    } as never);

    render(<GroupBlogsPanel group={memberGroup} />);

    expect(
      screen.getByText('No posts have been published to this group yet.')
    ).toBeTruthy();
  });

  it('labels members-only posts, uses a mobile-first grid, and paginates', async () => {
    const fetchNextPage = vi.fn();
    mockedUseGroupBlogs.mockReturnValue({
      data: { pages: [{ blogs: [membersOnlyBlog] }], pageParams: [0] },
      isLoading: false,
      isError: false,
      hasNextPage: true,
      fetchNextPage,
      isFetchingNextPage: false,
    } as never);

    render(<GroupBlogsPanel group={publicGroup} />);

    expect(screen.getByText('Members only')).toBeTruthy();
    expect(screen.getByTestId('group-blog-grid').className).toContain(
      'grid-cols-1'
    );
    expect(screen.getByTestId('group-blog-grid').className).toContain(
      'md:grid-cols-2'
    );
    await userEvent.click(
      screen.getByRole('button', { name: 'Load more posts' })
    );
    expect(fetchNextPage).toHaveBeenCalledOnce();
  });
});
