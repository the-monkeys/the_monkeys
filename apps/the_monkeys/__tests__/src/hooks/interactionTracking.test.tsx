import type { PropsWithChildren } from 'react';

import { LikesCount } from '@/components/blog/LikesCount';
import { BookmarkButton } from '@/components/blog/buttons/BookmarkButton';
import { LikeButton } from '@/components/blog/buttons/LikeButton';
import { RemoveBookmarkButton } from '@/components/blog/buttons/RemoveBookmarkButton';
import useGetBookmarkedBlogs from '@/hooks/blog/useGetBookmarkedBlogs';
import {
  useGetBookmarksCount,
  useIsPostBookmarked,
} from '@/hooks/user/useBookmarkStatus';
import { useGetLikesCount, useIsPostLiked } from '@/hooks/user/useLikeStatus';
import { queryKeys } from '@/lib/queryKeys';
import axiosInstance from '@/services/api/axiosInstance';
import axiosInstanceV2 from '@/services/api/axiosInstanceV2';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  act,
  cleanup,
  fireEvent,
  render,
  renderHook,
  screen,
  waitFor,
} from '@testing-library/react';
import { AxiosError } from 'axios';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';

vi.mock('next/navigation', () => ({
  usePathname: () => '/blog/post',
  useSearchParams: () => new URLSearchParams(),
}));
vi.mock('@/components/auth/AuthPromptDialog', () => ({
  AuthPromptDialog: () => null,
}));
vi.mock('@/components/blog/effects/HeartBurst', () => ({
  HeartBurst: () => null,
}));
vi.mock('@/components/icon', () => ({ default: () => null }));
vi.mock('@the-monkeys/ui/hooks/use-toast', () => ({ toast: vi.fn() }));
vi.mock('@/services/api/axiosInstance', () => ({
  default: { get: vi.fn(), post: vi.fn() },
}));
vi.mock('@/services/api/axiosInstanceV2', () => ({
  default: { get: vi.fn() },
}));
vi.mock('@/services/auth/auth', () => ({
  validateSession: vi.fn(() => new Promise(() => {})),
}));

const clients: QueryClient[] = [];
function setup(viewer: string | null = 'alice', retry: false | number = false) {
  const client = new QueryClient({
    defaultOptions: { queries: { retry, retryDelay: 1, staleTime: Infinity } },
  });
  clients.push(client);
  client.setQueryData(['auth'], viewer ? { username: viewer } : null);
  const wrapper = ({ children }: PropsWithChildren) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
  const login = (next: string | null) =>
    act(async () => {
      client.setQueryData(['auth'], next ? { username: next } : null);
    });
  return { client, wrapper, login };
}
function deferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (error: unknown) => void;
  const promise = new Promise<T>((yes, no) => {
    resolve = yes;
    reject = no;
  });
  return { promise, resolve, reject };
}
function httpError(status: number) {
  return new AxiosError('Request failed', undefined, undefined, undefined, {
    status,
    data: {},
    headers: {},
    statusText: 'Failed',
    config: {} as never,
  });
}
beforeEach(() => {
  vi.mocked(axiosInstance.get).mockImplementation(async (url) => ({
    data: String(url).includes('is-liked')
      ? { status: 'success', isLiked: false }
      : String(url).includes('is-bookmarked')
        ? { status: 'success', bookMarked: false }
        : { count: 7 },
  }));
  vi.mocked(axiosInstance.post).mockResolvedValue({ status: 200 });
  vi.mocked(axiosInstanceV2.get).mockResolvedValue({
    data: { blogs: [], total_blogs: 0 },
  });
});
afterEach(() => {
  cleanup();
  clients.forEach((client) => client.clear());
  clients.length = 0;
  vi.resetAllMocks();
});

it('loads personal status without waiting for public count metadata', async () => {
  const { wrapper } = setup();
  const { result } = renderHook(
    () => ({
      like: useIsPostLiked('post', true),
      bookmark: useIsPostBookmarked('post', true),
    }),
    { wrapper }
  );
  await waitFor(() =>
    expect(result.current.bookmark.bookmarkStatus?.bookMarked).toBe(false)
  );
  expect(
    vi
      .mocked(axiosInstance.get)
      .mock.calls.map(([url]) => url)
      .sort()
  ).toEqual(['/user/is-bookmarked/post', '/user/is-liked/post']);
});

it('does not read or seed personal data for a null-success session', async () => {
  const { client, wrapper } = setup(null);
  const { result } = renderHook(
    () => ({
      like: useIsPostLiked('post', true, true),
      bookmark: useIsPostBookmarked('post', true, true),
      list: useGetBookmarkedBlogs({ limit: 10, offset: 0 }),
    }),
    { wrapper }
  );
  await act(async () => {});
  expect(result.current.like.likeStatus).toBe(false);
  expect(result.current.bookmark.bookmarkStatus).toBeUndefined();
  expect(result.current.list.blogs).toBeUndefined();
  expect(axiosInstance.get).not.toHaveBeenCalled();
  expect(axiosInstanceV2.get).not.toHaveBeenCalled();
  expect(
    client
      .getQueryCache()
      .findAll()
      .filter((query) => query.queryKey[0] !== 'auth')
      .every((query) => query.state.data === undefined)
  ).toBe(true);
});

it('does not carry initial personal card props into another account', async () => {
  const { wrapper, login } = setup();
  const { result } = renderHook(
    () => ({
      like: useIsPostLiked('post', true, true),
      bookmark: useIsPostBookmarked('post', true, true),
    }),
    { wrapper }
  );
  expect(result.current.like.likeStatus).toBe(true);
  expect(result.current.bookmark.bookmarkStatus?.bookMarked).toBe(true);
  await login('bob');
  await waitFor(() => expect(result.current.like.likeStatus).toBe(false));
  await waitFor(() =>
    expect(result.current.bookmark.bookmarkStatus?.bookMarked).toBe(false)
  );
});

it('keeps bookmarks cached separately for each viewer', async () => {
  const { wrapper, login } = setup();
  vi.mocked(axiosInstanceV2.get)
    .mockResolvedValueOnce({ data: { blogs: [{ blog_id: 'alice-post' }] } })
    .mockResolvedValue({ data: { blogs: [{ blog_id: 'bob-post' }] } });
  const { result } = renderHook(
    () => useGetBookmarkedBlogs({ limit: 10, offset: 0 }),
    { wrapper }
  );
  await waitFor(() =>
    expect(result.current.blogs?.blogs[0]?.blog_id).toBe('alice-post')
  );
  await login('bob');
  await waitFor(() =>
    expect(result.current.blogs?.blogs[0]?.blog_id).toBe('bob-post')
  );
});

it('caches an empty bookmark 404 as a successful empty page with one request', async () => {
  const { wrapper } = setup('alice', 2);
  vi.mocked(axiosInstanceV2.get).mockRejectedValue(httpError(404));
  const first = renderHook(
    () => useGetBookmarkedBlogs({ limit: 10, offset: 0 }),
    { wrapper }
  );
  await waitFor(() =>
    expect(first.result.current.blogs).toEqual({ blogs: [], total_blogs: 0 })
  );
  first.unmount();
  const second = renderHook(
    () => useGetBookmarkedBlogs({ limit: 10, offset: 0 }),
    { wrapper }
  );
  expect(second.result.current.isError).toBe(false);
  expect(axiosInstanceV2.get).toHaveBeenCalledTimes(1);
});

it.each([401, 403])('keeps bookmark HTTP %s an error', async (status) => {
  const { wrapper } = setup();
  vi.mocked(axiosInstanceV2.get).mockRejectedValue(httpError(status));
  const { result } = renderHook(
    () => useGetBookmarkedBlogs({ limit: 10, offset: 0 }),
    { wrapper }
  );
  await waitFor(() => expect(result.current.isError).toBe(true));
  expect(result.current.blogs).toBeUndefined();
});

it('updates likes optimistically and avoids redundant status/count GETs after success', async () => {
  const { client, wrapper } = setup();
  client.setQueryData(queryKeys.blog.likes.count('post'), { count: 7 });
  const pending = deferred<{ status: number }>();
  vi.mocked(axiosInstance.post).mockReturnValue(pending.promise);
  render(
    <>
      <LikeButton blogId='post' initialIsLiked={false} />
      <LikesCount blogId='post' initialCount={7} />
    </>,
    { wrapper }
  );
  fireEvent.click(screen.getByTitle('Like Post'));
  await screen.findByTitle('Unlike Post');
  await screen.findByLabelText('8 likes');
  expect(client.getQueryData(queryKeys.blog.likes.count('post'))).toEqual({
    count: 8,
  });
  await act(async () => pending.resolve({ status: 200 }));
  await waitFor(() =>
    expect(screen.getByTitle('Unlike Post').hasAttribute('disabled')).toBe(
      false
    )
  );
  expect(axiosInstance.get).not.toHaveBeenCalled();
});

it('rolls back a failed optimistic like', async () => {
  const { client, wrapper } = setup();
  client.setQueryData(queryKeys.blog.likes.count('post'), { count: 7 });
  const pending = deferred<{ status: number }>();
  vi.mocked(axiosInstance.post).mockReturnValue(pending.promise);
  render(<LikeButton blogId='post' initialIsLiked={false} />, { wrapper });
  fireEvent.click(screen.getByTitle('Like Post'));
  await screen.findByTitle('Unlike Post');
  await act(async () => pending.reject(new Error('Write failed')));
  await screen.findByTitle('Like Post');
  expect(client.getQueryData(queryKeys.blog.likes.count('post'))).toEqual({
    count: 7,
  });
});

it('refreshes a fresh mounted saved-post list after both add and remove', async () => {
  const { wrapper } = setup();
  let saved = false;
  vi.mocked(axiosInstanceV2.get).mockImplementation(async () => ({
    data: {
      blogs: saved ? [{ blog_id: 'post' }] : [],
      total_blogs: saved ? 1 : 0,
    },
  }));
  vi.mocked(axiosInstance.post).mockImplementation(async (url) => {
    saved = String(url).includes('/bookmark/');
    return { status: 200 };
  });
  function Library() {
    const { blogs } = useGetBookmarkedBlogs({ limit: 10, offset: 0 });
    return (
      <>
        <p>
          {blogs
            ? blogs.blogs.map((blog) => blog.blog_id).join(',') ||
              'No saved posts'
            : 'Loading'}
        </p>
        <BookmarkButton blogId='post' initialIsBookmarked={false} />
      </>
    );
  }
  render(<Library />, { wrapper });
  await screen.findByText('No saved posts');
  fireEvent.click(screen.getByTitle('Add Bookmark'));
  await screen.findByText('post');
  await waitFor(() =>
    expect(screen.getByTitle('Remove Bookmark').hasAttribute('disabled')).toBe(
      false
    )
  );
  fireEvent.click(screen.getByTitle('Remove Bookmark'));
  await screen.findByText('No saved posts');
});

it.each(['toggle', 'library'])(
  'rolls back optimistic bookmark status/count/list on %s removal failure',
  async (button) => {
    const { client, wrapper } = setup();
    client.setQueryData(queryKeys.blog.bookmarks.count('post'), { count: 7 });
    const listKey = queryKeys.blog.bookmarks.list('alice', 10, 0);
    client.setQueryData(listKey, {
      blogs: [{ blog_id: 'post' }],
      total_blogs: 1,
    });
    const pending = deferred<{ status: number }>();
    vi.mocked(axiosInstance.post).mockReturnValue(pending.promise);
    render(
      button === 'toggle' ? (
        <BookmarkButton blogId='post' initialIsBookmarked />
      ) : (
        <RemoveBookmarkButton blogId='post' />
      ),
      { wrapper }
    );
    fireEvent.click(screen.getByTitle('Remove Bookmark'));
    await waitFor(() =>
      expect(
        client.getQueryData(queryKeys.blog.bookmarks.count('post'))
      ).toEqual({ count: 6 })
    );
    expect(client.getQueryData(listKey)).toEqual({ blogs: [], total_blogs: 0 });
    await act(async () => pending.reject(new Error('Write failed')));
    await waitFor(() =>
      expect(
        client.getQueryData(queryKeys.blog.bookmarks.count('post'))
      ).toEqual({ count: 7 })
    );
    expect(client.getQueryData(listKey)).toEqual({
      blogs: [{ blog_id: 'post' }],
      total_blogs: 1,
    });
  }
);

it('updates bookmark icon and count before an add request finishes', async () => {
  const { client, wrapper } = setup();
  client.setQueryData(queryKeys.blog.bookmarks.count('post'), { count: 7 });
  const pending = deferred<{ status: number }>();
  vi.mocked(axiosInstance.post).mockReturnValue(pending.promise);
  render(<BookmarkButton blogId='post' initialIsBookmarked={false} />, {
    wrapper,
  });
  fireEvent.click(screen.getByTitle('Add Bookmark'));
  await screen.findByTitle('Remove Bookmark');
  expect(client.getQueryData(queryKeys.blog.bookmarks.count('post'))).toEqual({
    count: 8,
  });
  await act(async () => pending.resolve({ status: 200 }));
});

it.each(['like', 'bookmark'])(
  'prevents duplicate %s requests across mounted buttons',
  async (kind) => {
    const { wrapper } = setup();
    const pending = deferred<{ status: number }>();
    vi.mocked(axiosInstance.post).mockReturnValue(pending.promise);
    render(
      kind === 'like' ? (
        <>
          <LikeButton blogId='post' initialIsLiked={false} />
          <LikeButton blogId='post' initialIsLiked={false} />
        </>
      ) : (
        <>
          <BookmarkButton blogId='post' initialIsBookmarked={false} />
          <BookmarkButton blogId='post' initialIsBookmarked={false} />
        </>
      ),
      { wrapper }
    );
    const buttons = screen.getAllByTitle(
      kind === 'like' ? 'Like Post' : 'Add Bookmark'
    );
    act(() => {
      fireEvent.click(buttons[0]);
      fireEvent.click(buttons[1]);
    });
    await waitFor(() => expect(axiosInstance.post).toHaveBeenCalledTimes(1));
    await act(async () => pending.resolve({ status: 200 }));
  }
);

it.each(['like', 'bookmark'])(
  'does not resurrect private %s caches when a pending request fails after logout',
  async (kind) => {
    const { client, wrapper, login } = setup();
    const pending = deferred<{ status: number }>();
    vi.mocked(axiosInstance.post).mockReturnValue(pending.promise);
    render(
      kind === 'like' ? (
        <LikeButton blogId='post' initialIsLiked={false} />
      ) : (
        <BookmarkButton blogId='post' initialIsBookmarked={false} />
      ),
      { wrapper }
    );
    fireEvent.click(
      screen.getByTitle(kind === 'like' ? 'Like Post' : 'Add Bookmark')
    );
    await waitFor(() => expect(axiosInstance.post).toHaveBeenCalledTimes(1));
    await login(null);
    await screen.findByTitle(
      kind === 'like'
        ? 'Login to like this post'
        : 'Login to bookmark this post'
    );
    const statusKey =
      kind === 'like'
        ? queryKeys.blog.likes.status('post', 'alice')
        : queryKeys.blog.bookmarks.status('post', 'alice');
    client.removeQueries({ queryKey: statusKey, exact: true });
    await act(async () => pending.reject(new Error('Late failure')));
    expect(client.getQueryData(statusKey)).toBeUndefined();
    expect(
      screen.getByTitle(
        kind === 'like'
          ? 'Login to like this post'
          : 'Login to bookmark this post'
      )
    ).toBeTruthy();
  }
);

it('does not let a late Alice rollback overwrite Bob status or a newer public count', async () => {
  const { client, wrapper, login } = setup();
  client.setQueryData(queryKeys.blog.likes.count('post'), { count: 7 });
  const pending = deferred<{ status: number }>();
  vi.mocked(axiosInstance.post).mockReturnValue(pending.promise);
  render(<LikeButton blogId='post' initialIsLiked={false} />, { wrapper });
  fireEvent.click(screen.getByTitle('Like Post'));
  await screen.findByTitle('Unlike Post');
  await login('bob');
  const bobKey = queryKeys.blog.likes.status('post', 'bob');
  act(() => {
    client.setQueryData(bobKey, { status: 'success', isLiked: true });
    client.setQueryData(queryKeys.blog.likes.count('post'), { count: 20 });
  });
  await act(async () => pending.reject(new Error('Late failure')));
  expect(client.getQueryData(bobKey)).toEqual({
    status: 'success',
    isLiked: true,
  });
  expect(client.getQueryData(queryKeys.blog.likes.count('post'))).toEqual({
    count: 20,
  });
});

it.each(['like', 'bookmark'])(
  'rejects a late %s rollback after switching away and back before React renders',
  async (kind) => {
    const { client, wrapper } = setup();
    const pending = deferred<{ status: number }>();
    vi.mocked(axiosInstance.post).mockReturnValue(pending.promise);
    render(
      kind === 'like' ? (
        <LikeButton blogId='post' initialIsLiked={false} />
      ) : (
        <BookmarkButton blogId='post' initialIsBookmarked={false} />
      ),
      { wrapper }
    );
    fireEvent.click(
      screen.getByTitle(kind === 'like' ? 'Like Post' : 'Add Bookmark')
    );
    await waitFor(() => expect(axiosInstance.post).toHaveBeenCalledTimes(1));
    const statusKey =
      kind === 'like'
        ? queryKeys.blog.likes.status('post', 'alice')
        : queryKeys.blog.bookmarks.status('post', 'alice');
    const newer =
      kind === 'like'
        ? { status: 'success', isLiked: true }
        : { status: 'success', bookMarked: true };
    act(() => {
      client.setQueryData(['auth'], { username: 'bob' });
      client.setQueryData(['auth'], { username: 'alice' });
      client.setQueryData(statusKey, newer);
    });
    await act(async () => pending.reject(new Error('Late failure')));
    expect(client.getQueryData(statusKey)).toEqual(newer);
    expect(client.getQueryState(statusKey)?.isInvalidated).toBe(false);
  }
);

it('does not refresh any personal bookmark lists after a late successful write for another account', async () => {
  const { client, wrapper, login } = setup();
  const aliceKey = queryKeys.blog.bookmarks.list('alice', 10, 0);
  const bobKey = queryKeys.blog.bookmarks.list('bob', 10, 0);
  client.setQueryData(aliceKey, { blogs: [], total_blogs: 0 });
  client.setQueryData(bobKey, { blogs: [], total_blogs: 0 });
  const pending = deferred<{ status: number }>();
  vi.mocked(axiosInstance.post).mockReturnValue(pending.promise);
  render(<BookmarkButton blogId='post' initialIsBookmarked={false} />, {
    wrapper,
  });
  fireEvent.click(screen.getByTitle('Add Bookmark'));
  await waitFor(() => expect(axiosInstance.post).toHaveBeenCalledTimes(1));
  await login('bob');
  client.removeQueries({ queryKey: aliceKey, exact: true });
  await act(async () => pending.resolve({ status: 200 }));
  expect(client.getQueryData(aliceKey)).toBeUndefined();
  expect(client.getQueryState(bobKey)?.isInvalidated).toBe(false);
});

it('prefills public counters without waiting for a session or personal status', () => {
  const { wrapper } = setup(null);
  const { result } = renderHook(
    () => ({
      likes: useGetLikesCount('post', 8),
      bookmarks: useGetBookmarksCount('post', 3),
    }),
    { wrapper }
  );
  expect(result.current.likes.likes).toBe(8);
  expect(result.current.bookmarks.bookmarks).toBe(3);
  expect(axiosInstance.get).not.toHaveBeenCalled();
});

it('cancels a pending status read so it cannot overwrite an optimistic library removal', async () => {
  const { client, wrapper } = setup();
  const read = deferred<{ data: unknown }>();
  const write = deferred<{ status: number }>();
  vi.mocked(axiosInstance.get).mockReturnValue(read.promise);
  vi.mocked(axiosInstance.post).mockReturnValue(write.promise);
  const statusKey = queryKeys.blog.bookmarks.status('post', 'alice');
  render(
    <>
      <BookmarkButton blogId='post' />
      <RemoveBookmarkButton blogId='post' />
    </>,
    { wrapper }
  );
  await waitFor(() => expect(axiosInstance.get).toHaveBeenCalledTimes(1));
  fireEvent.click(screen.getByTitle('Remove Bookmark'));
  await waitFor(() => expect(axiosInstance.post).toHaveBeenCalledTimes(1));
  await act(async () =>
    read.resolve({ data: { status: 'success', bookMarked: true } })
  );
  expect(client.getQueryData(statusKey)).toEqual({
    status: 'success',
    bookMarked: false,
  });
  await act(async () => write.resolve({ status: 200 }));
});

it.each(['like', 'bookmark'])(
  'preserves the disabled %s button contract',
  async (kind) => {
    const { wrapper } = setup();
    render(
      kind === 'like' ? (
        <LikeButton blogId='post' initialIsLiked={false} isDisable />
      ) : (
        <BookmarkButton blogId='post' initialIsBookmarked={false} isDisable />
      ),
      { wrapper }
    );
    const button = screen.getByTitle(
      kind === 'like' ? 'Like Post' : 'Add Bookmark'
    );
    expect(button.hasAttribute('disabled')).toBe(true);
    fireEvent.click(button);
    await act(async () => {});
    expect(axiosInstance.post).not.toHaveBeenCalled();
  }
);

it('fetches protected counts for an authenticated viewer when metadata has no count fields', async () => {
  const { wrapper } = setup('alice');
  const { result } = renderHook(
    () => ({
      likes: useGetLikesCount('post', undefined),
      bookmarks: useGetBookmarksCount('post', undefined),
    }),
    { wrapper }
  );
  await waitFor(() => expect(result.current.likes.likes).toBe(7));
  await waitFor(() => expect(result.current.bookmarks.bookmarks).toBe(7));
  expect(
    vi
      .mocked(axiosInstance.get)
      .mock.calls.map(([url]) => url)
      .sort()
  ).toEqual(['/user/count-bookmarks/post', '/user/count-likes/post']);
});

it.each(['like', 'bookmark'])(
  'does not invent a public %s count from missing metadata during a mutation',
  async (kind) => {
    const { client, wrapper } = setup();
    const pending = deferred<{ status: number }>();
    vi.mocked(axiosInstance.post).mockReturnValue(pending.promise);
    render(
      kind === 'like' ? (
        <LikeButton blogId='post' initialIsLiked={false} />
      ) : (
        <BookmarkButton blogId='post' initialIsBookmarked={false} />
      ),
      { wrapper }
    );
    fireEvent.click(
      screen.getByTitle(kind === 'like' ? 'Like Post' : 'Add Bookmark')
    );
    await waitFor(() => expect(axiosInstance.post).toHaveBeenCalledTimes(1));
    const countKey =
      kind === 'like'
        ? queryKeys.blog.likes.count('post')
        : queryKeys.blog.bookmarks.count('post');
    expect(client.getQueryData(countKey)).toBeUndefined();
    await act(async () => pending.resolve({ status: 200 }));
    expect(client.getQueryData(countKey)).toBeUndefined();
  }
);

it('does not request protected counts for an anonymous session with missing metadata', async () => {
  const { wrapper } = setup(null);
  renderHook(
    () => ({
      likes: useGetLikesCount('post'),
      bookmarks: useGetBookmarksCount('post'),
    }),
    { wrapper }
  );
  await act(async () => {});
  expect(axiosInstance.get).not.toHaveBeenCalled();
});

it.each(['like', 'bookmark'] as const)(
  'reconciles an omitted zero %s count without displaying NaN',
  async (kind) => {
    const { client, wrapper } = setup();
    const key =
      kind === 'like'
        ? queryKeys.blog.likes.count('post')
        : queryKeys.blog.bookmarks.count('post');
    client.setQueryData(key, {});
    const pending = deferred<{ status: number }>();
    vi.mocked(axiosInstance.post).mockReturnValue(pending.promise);
    const counts = renderHook(
      () =>
        kind === 'like'
          ? useGetLikesCount('post').likes
          : useGetBookmarksCount('post').bookmarks,
      { wrapper }
    );
    render(
      kind === 'like' ? (
        <LikeButton blogId='post' initialIsLiked={false} />
      ) : (
        <BookmarkButton blogId='post' initialIsBookmarked={false} />
      ),
      { wrapper }
    );
    expect(counts.result.current).toBe(0);
    fireEvent.click(
      screen.getByTitle(kind === 'like' ? 'Like Post' : 'Add Bookmark')
    );
    await waitFor(() => expect(axiosInstance.post).toHaveBeenCalledTimes(1));
    expect(Number.isFinite(counts.result.current)).toBe(true);
    await act(async () => pending.resolve({ status: 200 }));
    await waitFor(() => expect(counts.result.current).toBe(7));
    expect(axiosInstance.get).toHaveBeenCalledTimes(1);
  }
);
