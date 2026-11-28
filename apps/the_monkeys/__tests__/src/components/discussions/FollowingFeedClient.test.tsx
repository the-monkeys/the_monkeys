import FollowingFeedClient from '@/components/feed/FollowingFeedClient';
import useGetFollowingFeed from '@/hooks/blog/useGetFollowingFeed';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AxiosError } from 'axios';
import { afterEach, expect, it, vi } from 'vitest';

const state = vi.hoisted(() => ({
  pending: true,
  username: undefined as string | undefined,
  replace: vi.fn(),
  refresh: vi.fn(),
  error: null as unknown,
  refetch: vi
    .fn()
    .mockResolvedValue({
      data: { username: 'dave', account_id: 'account-dave' },
    }),
}));
vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace: state.replace, refresh: state.refresh }),
  useSearchParams: () => new URLSearchParams(),
}));
vi.mock('@/hooks/auth/useAuth', () => ({
  default: () => ({
    isPending: state.pending,
    isError: Boolean(state.error),
    error: state.error,
    refetch: state.refetch,
    data: state.username
      ? { username: state.username, account_id: `account-${state.username}` }
      : null,
  }),
}));
vi.mock('@/hooks/blog/useGetFollowingFeed', () => ({
  default: vi.fn(() => ({
    blogs: [],
    totalBlogs: 0,
    isLoading: false,
    isError: false,
  })),
}));
vi.mock('@/hooks/user/usePagination', () => ({
  usePagination: () => ({ page: 0, next: vi.fn(), prev: vi.fn() }),
}));
vi.mock('@/components/feed/FollowingDiscussions', () => ({
  FollowingDiscussions: ({ viewerAccountId }: { viewerAccountId: string }) => (
    <div>Discussions for {viewerAccountId}</div>
  ),
}));
vi.mock('@/components/skeletons/blogSkeleton', () => ({
  FeedBlogCardListSkeleton: () => <div role='status'>Checking access</div>,
}));
afterEach(() => {
  cleanup();
  state.pending = true;
  state.username = undefined;
  state.error = null;
  vi.clearAllMocks();
});

it('does not use a cached identity that disagrees with the server session', async () => {
  state.pending = false;
  state.username = 'dave';
  render(
    <FollowingFeedClient
      viewer={{ username: 'ada', accountId: 'account-ada' }}
    />
  );
  expect(useGetFollowingFeed).not.toHaveBeenCalled();
  expect(screen.queryByRole('heading', { name: 'Your feed' })).toBeNull();
  await waitFor(() => expect(state.refetch).toHaveBeenCalled());
});

it('rejects stale successful identity data after a 401 revalidation failure', async () => {
  state.pending = false;
  state.username = 'dave';
  const error = new AxiosError('expired');
  error.response = { status: 401 } as AxiosError['response'];
  state.error = error;
  render(
    <FollowingFeedClient
      viewer={{ username: 'dave', accountId: 'account-dave' }}
    />
  );
  expect(useGetFollowingFeed).not.toHaveBeenCalled();
  await waitFor(() =>
    expect(state.replace).toHaveBeenCalledWith(
      '/auth/login?callbackURL=%2Ffeed'
    )
  );
});

it('hides cached content after a session outage and retries client authentication', async () => {
  state.pending = false;
  state.username = 'dave';
  state.error = new Error('offline');
  render(
    <FollowingFeedClient
      viewer={{ username: 'dave', accountId: 'account-dave' }}
    />
  );
  expect(useGetFollowingFeed).not.toHaveBeenCalled();
  await userEvent.click(screen.getByRole('button', { name: 'Try again' }));
  expect(state.refetch).toHaveBeenCalled();
});

it('does not load personalized content while authentication is unresolved or missing', async () => {
  const { rerender } = render(
    <FollowingFeedClient
      viewer={{ username: 'dave', accountId: 'account-dave' }}
    />
  );
  expect(useGetFollowingFeed).not.toHaveBeenCalled();
  expect(screen.queryByRole('heading', { name: 'Your feed' })).toBeNull();
  state.pending = false;
  rerender(
    <FollowingFeedClient
      viewer={{ username: 'dave', accountId: 'account-dave' }}
    />
  );
  await waitFor(() =>
    expect(state.replace).toHaveBeenCalledWith(
      '/auth/login?callbackURL=%2Ffeed'
    )
  );
  expect(useGetFollowingFeed).not.toHaveBeenCalled();
});

it('offers followed discussions only after authentication and clears them on logout', async () => {
  state.pending = false;
  state.username = 'dave';
  const { rerender } = render(
    <FollowingFeedClient
      viewer={{ username: 'dave', accountId: 'account-dave' }}
    />
  );
  expect(useGetFollowingFeed).toHaveBeenCalledWith(
    expect.objectContaining({ viewerUsername: 'dave' })
  );
  await userEvent.click(screen.getByRole('button', { name: 'Discussions' }));
  expect(screen.getByText('Discussions for account-dave')).toBeTruthy();
  state.username = undefined;
  rerender(
    <FollowingFeedClient
      viewer={{ username: 'dave', accountId: 'account-dave' }}
    />
  );
  expect(screen.queryByText('Discussions for account-dave')).toBeNull();
});
