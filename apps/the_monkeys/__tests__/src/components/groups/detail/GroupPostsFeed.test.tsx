import { GroupPostsFeed } from '@/components/groups/detail/GroupPostsFeed';
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const state = vi.hoisted(() => ({
  session: { username: 'ada' } as { username: string } | null,
  list: vi.fn(),
  blogs: {
    data: { pages: [{ blogs: [] as any[] }] },
    isLoading: false,
    isError: false,
    hasNextPage: false,
    isFetchingNextPage: false,
    fetchNextPage: vi.fn(),
  },
}));
vi.mock('@/hooks/auth/useAuth', () => ({
  default: () => ({ data: state.session }),
}));
vi.mock('@/hooks/groups/useGroupQueries', () => ({
  useGroupBlogs: () => state.blogs,
}));
vi.mock('@/services/discussions/discussionsApi', () => ({
  listDiscussions: (...args: any[]) => state.list(...args),
}));
vi.mock('@/components/discussions/DiscussionCard', () => ({
  DiscussionCard: ({ post }: any) => <article>{post.body}</article>,
}));
vi.mock('@/components/discussions/DiscussionComposer', () => ({
  DiscussionComposer: ({ onPosted }: any) =>
    onPosted ? <button onClick={onPosted}>Post discussion</button> : null,
}));
vi.mock('@/components/discussions/DiscussionFeedActions', () => ({
  DiscussionFeedActions: () => null,
}));
vi.mock('@/components/cards/blog/FeedBlogCard', () => ({
  FeedBlogCard: ({ blog }: any) => <article>{blog.title}</article>,
}));
vi.mock('@/utils/blogCardAdapters', () => ({ fromBlog: (blog: any) => blog }));
vi.mock('@/components/icon', () => ({ default: () => null }));
const group = {
  id: 1,
  slug: 'writers',
  name: 'Writers',
  visibility: 'public',
  status: 'published',
  viewer_member_status: 'active',
} as const;
const page = (start: number, length: number) => ({
  discussions: Array.from({ length }, (_, i) => ({
    public_id: `d${start + i}`,
    body: `Discussion ${start + i}`,
    status: 'visible',
    created_at: '2026-10-01T10:00:00Z',
  })),
});

describe('GroupPostsFeed pagination', () => {
  beforeEach(() => {
    state.session = { username: 'ada' };
    state.list.mockReset().mockResolvedValue({ discussions: [] });
    state.blogs.data = { pages: [{ blogs: [] }] };
    state.blogs.isError = false;
    state.blogs.hasNextPage = false;
    state.blogs.fetchNextPage.mockReset();
    Element.prototype.scrollIntoView = vi.fn();
  });
  afterEach(cleanup);

  it('removes cached restricted blog previews immediately on logout, including a failed refetch', async () => {
    state.blogs.data.pages[0].blogs = [
      { blog_id: 'private', title: 'Secret preview', audience: 'group_only' },
      { blog_id: 'public', title: 'Public preview', audience: 'public' },
    ];
    const view = render(<GroupPostsFeed group={group} />);
    await screen.findByText('Secret preview');
    state.session = null;
    view.rerender(<GroupPostsFeed group={group} />);
    await screen.findByText('Public preview');
    expect(screen.queryByText('Secret preview')).toBeNull();
    state.blogs.isError = true;
    view.rerender(<GroupPostsFeed group={group} />);
    await screen.findByRole('alert');
    expect(screen.queryByText('Secret preview')).toBeNull();
  });

  it('removes cached restricted previews when membership is lost before the blog refetch completes', async () => {
    state.blogs.data.pages[0].blogs = [
      { blog_id: 'private', title: 'Secret preview', audience: 'group_only' },
    ];
    const view = render(<GroupPostsFeed group={group} />);
    await screen.findByText('Secret preview');
    view.rerender(
      <GroupPostsFeed group={{ ...group, viewer_member_status: 'left' }} />
    );
    await waitFor(() =>
      expect(screen.queryByLabelText('Loading posts')).toBeNull()
    );
    expect(screen.queryByText('Secret preview')).toBeNull();
  });

  it('hides cached restricted previews on a failed refetch even while group standing is stale', async () => {
    state.blogs.data.pages[0].blogs = [
      { blog_id: 'private', title: 'Secret preview', audience: 'group_only' },
    ];
    const view = render(<GroupPostsFeed group={group} />);
    await screen.findByText('Secret preview');
    state.blogs.isError = true;
    view.rerender(<GroupPostsFeed group={group} />);
    expect(screen.getByRole('alert')).toBeTruthy();
    expect(screen.queryByText('Secret preview')).toBeNull();
  });

  it('does not append blog pages to an unverified cache while discussions paginate independently', async () => {
    state.blogs.data.pages[0].blogs = [
      { blog_id: 'private', title: 'Secret preview', audience: 'group_only' },
    ];
    state.blogs.hasNextPage = true;
    state.blogs.isError = true;
    state.list
      .mockResolvedValueOnce(page(1, 20))
      .mockResolvedValueOnce(page(21, 1));
    render(<GroupPostsFeed group={group} />);
    await screen.findByText('Discussion 20');
    fireEvent.click(screen.getByRole('button', { name: 'Load more posts' }));
    await screen.findByText('Discussion 21');
    expect(state.blogs.fetchNextPage).not.toHaveBeenCalled();
    expect(screen.queryByText('Secret preview')).toBeNull();
  });

  it('loads older discussions even when the blog feed is exhausted', async () => {
    state.list
      .mockResolvedValueOnce(page(1, 20))
      .mockResolvedValueOnce(page(21, 1));
    render(<GroupPostsFeed group={group} />);
    await screen.findByText('Discussion 20');
    expect(state.list).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByRole('button', { name: 'Load more posts' }));
    await screen.findByText('Discussion 21');
    expect(state.list).toHaveBeenLastCalledWith(
      { kind: 'group', slug: 'writers' },
      'd20'
    );
    expect(state.blogs.fetchNextPage).not.toHaveBeenCalled();
    expect(
      screen.queryByRole('button', { name: 'Load more posts' })
    ).toBeNull();
  });

  it('keeps loaded discussions and retries the same page after a failure', async () => {
    state.list
      .mockResolvedValueOnce(page(1, 20))
      .mockRejectedValueOnce(new Error('offline'))
      .mockResolvedValueOnce(page(21, 1));
    render(<GroupPostsFeed group={group} />);
    await screen.findByText('Discussion 20');
    fireEvent.click(screen.getByRole('button', { name: 'Load more posts' }));
    await screen.findByRole('alert');
    expect(screen.getByText('Discussion 1')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Load more posts' }));
    await screen.findByText('Discussion 21');
    expect(state.list.mock.calls.slice(1).map((call) => call[1])).toEqual([
      'd20',
      'd20',
    ]);
  });

  it('bounds each click to one request per remaining feed and blocks duplicate clicks', async () => {
    let finish!: (value: any) => void;
    state.list.mockResolvedValueOnce(page(1, 20)).mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          finish = resolve;
        })
    );
    state.blogs.hasNextPage = true;
    render(<GroupPostsFeed group={group} />);
    await screen.findByText('Discussion 20');
    const button = screen.getByRole('button', { name: 'Load more posts' });
    fireEvent.click(button);
    fireEvent.click(button);
    expect(state.list).toHaveBeenCalledTimes(2);
    expect(state.blogs.fetchNextPage).toHaveBeenCalledTimes(1);
    await act(async () => finish(page(21, 1)));
  });

  it('drops previous membership results and ignores late responses after a standing change', async () => {
    let finish!: (value: any) => void;
    state.list
      .mockResolvedValueOnce(page(1, 20))
      .mockImplementationOnce(
        () =>
          new Promise((resolve) => {
            finish = resolve;
          })
      )
      .mockResolvedValueOnce(page(50, 1));
    const view = render(<GroupPostsFeed group={group} />);
    await screen.findByText('Discussion 20');
    fireEvent.click(screen.getByRole('button', { name: 'Load more posts' }));
    view.rerender(
      <GroupPostsFeed group={{ ...group, viewer_member_status: 'left' }} />
    );
    await screen.findByText('Discussion 50');
    await act(async () => finish(page(21, 1)));
    expect(screen.queryByText('Discussion 1')).toBeNull();
    expect(screen.queryByText('Discussion 21')).toBeNull();
    await waitFor(() => expect(state.list).toHaveBeenCalledTimes(3));
  });

  it('can paginate again after a newly posted discussion supersedes a pending older page', async () => {
    let finish!: (value: any) => void;
    state.list
      .mockResolvedValueOnce(page(1, 20))
      .mockImplementationOnce(
        () =>
          new Promise((resolve) => {
            finish = resolve;
          })
      )
      .mockResolvedValueOnce(page(30, 20))
      .mockResolvedValueOnce(page(50, 1));
    render(<GroupPostsFeed group={group} />);
    await screen.findByText('Discussion 20');
    fireEvent.click(screen.getByRole('button', { name: 'Load more posts' }));
    fireEvent.click(screen.getByRole('button', { name: 'Start a discussion' }));
    fireEvent.click(screen.getByRole('button', { name: 'Post discussion' }));
    await screen.findByText('Discussion 49');
    await act(async () => finish(page(21, 1)));
    const more = screen.getByRole('button', { name: 'Load more posts' });
    expect(more.hasAttribute('disabled')).toBe(false);
    fireEvent.click(more);
    await screen.findByText('Discussion 50');
    expect(screen.queryByText('Discussion 21')).toBeNull();
  });
});
