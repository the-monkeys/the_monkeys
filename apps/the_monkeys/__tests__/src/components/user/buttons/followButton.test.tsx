import type { ReactNode } from 'react';

import {
  FollowButton,
  FollowButtonIcon,
} from '@/components/user/buttons/followButton';
import { queryKeys } from '@/lib/queryKeys';
import * as UserAPI from '@/services/user/user';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render } from '@testing-library/react';
import { cleanup, fireEvent, screen, waitFor } from '@testing-library/react';
import { Toaster } from '@the-monkeys/ui/molecules/toaster';
import { afterEach, describe, expect, it, vi } from 'vitest';

const clients: QueryClient[] = [];
const viewer = {
  account_id: 'viewer-account',
  username: 'viewer',
  email: 'viewer@example.test',
};
const renderWithProviders = (children: ReactNode) => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  clients.push(queryClient);
  queryClient.setQueryDefaults(queryKeys.auth.session(), {
    staleTime: Infinity,
  });
  queryClient.setQueryData(queryKeys.auth.session(), viewer);
  return {
    queryClient,
    ...render(
      <QueryClientProvider client={queryClient}>
        <Toaster />
        {children}
      </QueryClientProvider>
    ),
  };
};
afterEach(() => {
  clients.splice(0).forEach((client) => client.clear());
});

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

describe('FollowButton', () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it('renders Follow button when not following', async () => {
    vi.spyOn(UserAPI, 'getFollowStatusApi').mockResolvedValue({
      isFollowing: false,
    });

    renderWithProviders(<FollowButton username='testuser' />);

    const followButton = await screen.findByTestId('follow-button');
    expect(followButton).toBeDefined();
    expect(followButton.textContent).toContain('Follow');
  });

  it('renders Unfollow button when already following', async () => {
    vi.spyOn(UserAPI, 'getFollowStatusApi').mockResolvedValue({
      isFollowing: true,
    });

    renderWithProviders(<FollowButton username='testuser' />);

    const unfollowButton = await screen.findByTestId('unfollow-button');
    expect(unfollowButton).toBeDefined();
    expect(unfollowButton.textContent).toContain('Unfollow');
  });

  it('calls follow API when Follow is clicked', async () => {
    vi.spyOn(UserAPI, 'getFollowStatusApi').mockResolvedValue({
      isFollowing: false,
    });
    const followSpy = vi
      .spyOn(UserAPI, 'followUserApi')
      .mockResolvedValue({} as never);

    renderWithProviders(<FollowButton username='testuser' />);
    const followButton = await screen.findByTestId('follow-button');

    fireEvent.click(followButton);

    await waitFor(() => {
      expect(followSpy).toHaveBeenCalledWith('testuser');
    });
  });

  it('calls unfollow API when Unfollow is clicked', async () => {
    vi.spyOn(UserAPI, 'getFollowStatusApi').mockResolvedValue({
      isFollowing: true,
    });
    const unfollowSpy = vi
      .spyOn(UserAPI, 'unfollowUserApi')
      .mockResolvedValue({} as never);

    renderWithProviders(<FollowButton username='testuser' />);
    const unfollowButton = await screen.findByTestId('unfollow-button');

    fireEvent.click(unfollowButton);

    await waitFor(() => {
      expect(unfollowSpy).toHaveBeenCalledWith('testuser');
    });
  });

  it('renders retry button after follow-status fetch fails', async () => {
    vi.spyOn(UserAPI, 'getFollowStatusApi').mockRejectedValue(
      new Error('Network error')
    );

    renderWithProviders(<FollowButton username='testuser' />);

    const retryButton = await screen.findByTestId('follow-button');
    expect(retryButton.textContent).toContain('Retry');

    expect(document.querySelector('.animate-opacity-pulse')).toBeNull();
  });

  it('shows skeleton while loading', () => {
    vi.spyOn(UserAPI, 'getFollowStatusApi').mockReturnValue(
      new Promise(() => {})
    );

    const { container } = renderWithProviders(
      <FollowButton username='testuser' />
    );

    const skeleton = container.querySelector('.animate-opacity-pulse');
    expect(skeleton).not.toBeNull();
  });

  it('disables Follow button when follow mutation is pending', async () => {
    vi.spyOn(UserAPI, 'getFollowStatusApi').mockResolvedValue({
      isFollowing: false,
    });
    vi.spyOn(UserAPI, 'followUserApi').mockReturnValue(new Promise(() => {}));

    const { container } = renderWithProviders(
      <FollowButton username='testuser' />
    );
    const followButton = await screen.findByTestId('follow-button');

    fireEvent.click(followButton);

    await waitFor(() => {
      expect((followButton as HTMLButtonElement).disabled).toBe(true);
      expect(container.querySelector('.animate-loader-rotate')).not.toBeNull();
    });
  });

  it('disables Unfollow button when unfollow mutation is pending', async () => {
    vi.spyOn(UserAPI, 'getFollowStatusApi').mockResolvedValue({
      isFollowing: true,
    });
    vi.spyOn(UserAPI, 'unfollowUserApi').mockReturnValue(new Promise(() => {}));

    const { container } = renderWithProviders(
      <FollowButton username='testuser' />
    );
    const unfollowButton = await screen.findByTestId('unfollow-button');

    fireEvent.click(unfollowButton);

    await waitFor(() => {
      expect((unfollowButton as HTMLButtonElement).disabled).toBe(true);
      expect(container.querySelector('.animate-loader-rotate')).not.toBeNull();
    });
  });

  it('calls onFollowSuccess callback after successful follow', async () => {
    const onFollowSuccess = vi.fn();
    vi.spyOn(UserAPI, 'getFollowStatusApi').mockResolvedValue({
      isFollowing: false,
    });
    const followSpy = vi
      .spyOn(UserAPI, 'followUserApi')
      .mockResolvedValue({} as never);

    renderWithProviders(
      <FollowButton username='testuser' onFollowSuccess={onFollowSuccess} />
    );
    const followButton = await screen.findByTestId('follow-button');

    fireEvent.click(followButton);

    await waitFor(() => {
      expect(followSpy).toHaveBeenCalledWith('testuser');
      expect(onFollowSuccess).toHaveBeenCalled();
    });
  });
});

describe('FollowButtonIcon', () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it('renders follow icon button when not following', async () => {
    vi.spyOn(UserAPI, 'getFollowStatusApi').mockResolvedValue({
      isFollowing: false,
    });

    renderWithProviders(<FollowButtonIcon username='testuser' />);

    const followIconButton = await screen.findByTestId('follow-icon-button');
    expect(followIconButton).toBeDefined();
  });

  it('renders unfollow icon button when already following', async () => {
    vi.spyOn(UserAPI, 'getFollowStatusApi').mockResolvedValue({
      isFollowing: true,
    });

    renderWithProviders(<FollowButtonIcon username='testuser' />);

    const unfollowIconButton = await screen.findByTestId(
      'unfollow-icon-button'
    );
    expect(unfollowIconButton).toBeDefined();
  });

  it('calls follow API when icon button is clicked', async () => {
    vi.spyOn(UserAPI, 'getFollowStatusApi').mockResolvedValue({
      isFollowing: false,
    });
    const followSpy = vi
      .spyOn(UserAPI, 'followUserApi')
      .mockResolvedValue({} as never);

    renderWithProviders(<FollowButtonIcon username='testuser' />);
    const followIconButton = await screen.findByTestId('follow-icon-button');

    fireEvent.click(followIconButton);

    await waitFor(() => {
      expect(followSpy).toHaveBeenCalledWith('testuser');
    });
  });

  it('calls unfollow API when unfollow icon button is clicked', async () => {
    vi.spyOn(UserAPI, 'getFollowStatusApi').mockResolvedValue({
      isFollowing: true,
    });
    const unfollowSpy = vi
      .spyOn(UserAPI, 'unfollowUserApi')
      .mockResolvedValue({} as never);

    renderWithProviders(<FollowButtonIcon username='testuser' />);
    const unfollowIconButton = await screen.findByTestId(
      'unfollow-icon-button'
    );

    fireEvent.click(unfollowIconButton);

    await waitFor(() => {
      expect(unfollowSpy).toHaveBeenCalledWith('testuser');
    });
  });

  it('renders retry button after follow-status fetch fails', async () => {
    vi.spyOn(UserAPI, 'getFollowStatusApi').mockRejectedValue(
      new Error('Network error')
    );

    renderWithProviders(<FollowButtonIcon username='testuser' />);

    const retryButton = await screen.findByTestId('retry-follow-icon-button');
    expect(retryButton.getAttribute('aria-label')).toBe('Retry follow status');

    expect(document.querySelector('.animate-opacity-pulse')).toBeNull();
  });

  it('shows skeleton while loading', () => {
    vi.spyOn(UserAPI, 'getFollowStatusApi').mockReturnValue(
      new Promise(() => {})
    );

    const { container } = renderWithProviders(
      <FollowButtonIcon username='testuser' />
    );

    const skeleton = container.querySelector('.animate-opacity-pulse');
    expect(skeleton).not.toBeNull();
  });

  it('disables follow icon button when follow mutation is pending', async () => {
    vi.spyOn(UserAPI, 'getFollowStatusApi').mockResolvedValue({
      isFollowing: false,
    });
    vi.spyOn(UserAPI, 'followUserApi').mockReturnValue(new Promise(() => {}));

    const { container } = renderWithProviders(
      <FollowButtonIcon username='testuser' />
    );
    const followIconButton = await screen.findByTestId('follow-icon-button');

    fireEvent.click(followIconButton);

    await waitFor(() => {
      expect((followIconButton as HTMLButtonElement).disabled).toBe(true);
      expect(container.querySelector('.animate-loader-rotate')).not.toBeNull();
    });
  });

  it('disables unfollow icon button when unfollow mutation is pending', async () => {
    vi.spyOn(UserAPI, 'getFollowStatusApi').mockResolvedValue({
      isFollowing: true,
    });
    vi.spyOn(UserAPI, 'unfollowUserApi').mockReturnValue(new Promise(() => {}));

    const { container } = renderWithProviders(
      <FollowButtonIcon username='testuser' />
    );
    const unfollowIconButton = await screen.findByTestId(
      'unfollow-icon-button'
    );

    fireEvent.click(unfollowIconButton);

    await waitFor(() => {
      expect((unfollowIconButton as HTMLButtonElement).disabled).toBe(true);
      expect(container.querySelector('.animate-loader-rotate')).not.toBeNull();
    });
  });
});

it('refreshes the current viewer status and public counts after following', async () => {
  vi.spyOn(UserAPI, 'getFollowStatusApi')
    .mockResolvedValueOnce({ isFollowing: false })
    .mockResolvedValue({ isFollowing: true });
  vi.spyOn(UserAPI, 'followUserApi').mockResolvedValue({} as never);
  const { queryClient } = renderWithProviders(
    <FollowButton username='testuser' />
  );
  const countKey = queryKeys.profile.connectionCount('testuser');
  queryClient.setQueryData(countKey, { followers: 1, following: 0 });
  fireEvent.click(await screen.findByTestId('follow-button'));
  await screen.findByTestId('unfollow-button');
  expect(
    queryClient.getQueryData(
      queryKeys.profile.followStatus('testuser', viewer.account_id)
    )
  ).toMatchObject({ isFollowing: true });
  expect(queryClient.getQueryState(countKey)?.isInvalidated).toBe(true);
});
