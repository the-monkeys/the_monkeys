import { useFollowUser } from '@/hooks/user/useUserConnections';
import { followUserApi, unfollowUserApi } from '@/services/user/user';
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from '@tanstack/react-query';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, expect, it, vi } from 'vitest';

vi.mock('@/services/user/user', () => ({
  followUserApi: vi.fn(),
  unfollowUserApi: vi.fn(),
}));
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

it.each(['following-feed-blogs', 'following-discussions'])(
  'refreshes %s when a follow relationship changes',
  async (prefix) => {
    const fetch = vi
      .fn()
      .mockResolvedValueOnce('Old following results')
      .mockResolvedValue('Updated following results');
    vi.mocked(unfollowUserApi).mockResolvedValue({} as never);
    vi.mocked(followUserApi).mockResolvedValue({} as never);
    function Feed() {
      const { data } = useQuery({
        queryKey: [prefix, 'viewer'],
        queryFn: fetch,
        staleTime: Infinity,
      });
      const { unfollowMutation } = useFollowUser('author');
      return (
        <>
          <p>{data}</p>
          <button onClick={() => unfollowMutation.mutate()}>
            Unfollow author
          </button>
        </>
      );
    }
    const client = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    render(
      <QueryClientProvider client={client}>
        <Feed />
      </QueryClientProvider>
    );
    await screen.findByText('Old following results');
    await userEvent.click(
      screen.getByRole('button', { name: 'Unfollow author' })
    );
    expect(await screen.findByText('Updated following results')).toBeTruthy();
    expect(screen.queryByText('Old following results')).toBeNull();
  }
);
