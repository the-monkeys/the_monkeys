import {
  FollowButton,
  FollowButtonIcon,
} from '@/components/user/buttons/followButton';
import * as Fetcher from '@/services/fetcher';
import * as UserAPI from '@/services/user/user';
import { cleanup, fireEvent, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { renderWithProviders } from '../../../../utils';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

vi.mock('@the-monkeys/ui/hooks/use-toast', () => ({
  toast: vi.fn(),
}));

describe('FollowButton', () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it('renders Follow button when not following', async () => {
    vi.spyOn(Fetcher, 'authFetcher').mockResolvedValue({
      isFollowing: false,
    });

    renderWithProviders(<FollowButton username='testuser' />);

    const followButton = await screen.findByTestId('follow-button');
    expect(followButton).toBeDefined();
    expect(followButton.textContent).toContain('Follow');
  });

  it('renders Unfollow button when already following', async () => {
    vi.spyOn(Fetcher, 'authFetcher').mockResolvedValue({
      isFollowing: true,
    });

    renderWithProviders(<FollowButton username='testuser' />);

    const unfollowButton = await screen.findByTestId('unfollow-button');
    expect(unfollowButton).toBeDefined();
    expect(unfollowButton.textContent).toContain('Unfollow');
  });

  it('calls follow API when Follow is clicked', async () => {
    vi.spyOn(Fetcher, 'authFetcher').mockResolvedValue({
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
    vi.spyOn(Fetcher, 'authFetcher').mockResolvedValue({
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

  it('returns null when there is an error fetching follow status', async () => {
    vi.spyOn(Fetcher, 'authFetcher').mockRejectedValue(
      new Error('Network error')
    );

    const { container } = renderWithProviders(
      <FollowButton username='testuser' />
    );

    await waitFor(() => {
      expect(container.querySelector('button')).toBeNull();
    });
  });

  it('shows skeleton while loading', () => {
    vi.spyOn(Fetcher, 'authFetcher').mockReturnValue(new Promise(() => {}));

    const { container } = renderWithProviders(
      <FollowButton username='testuser' />
    );

    const skeleton = container.querySelector('.animate-opacity-pulse');
    expect(skeleton).not.toBeNull();
  });

  it('disables Follow button when follow mutation is pending', async () => {
    vi.spyOn(Fetcher, 'authFetcher').mockResolvedValue({
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
    vi.spyOn(Fetcher, 'authFetcher').mockResolvedValue({
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
});

describe('FollowButtonIcon', () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it('renders follow icon button when not following', async () => {
    vi.spyOn(Fetcher, 'authFetcher').mockResolvedValue({
      isFollowing: false,
    });

    renderWithProviders(<FollowButtonIcon username='testuser' />);

    const followIconButton = await screen.findByTestId('follow-icon-button');
    expect(followIconButton).toBeDefined();
  });

  it('renders unfollow icon button when already following', async () => {
    vi.spyOn(Fetcher, 'authFetcher').mockResolvedValue({
      isFollowing: true,
    });

    renderWithProviders(<FollowButtonIcon username='testuser' />);

    const unfollowIconButton = await screen.findByTestId(
      'unfollow-icon-button'
    );
    expect(unfollowIconButton).toBeDefined();
  });

  it('calls follow API when icon button is clicked', async () => {
    vi.spyOn(Fetcher, 'authFetcher').mockResolvedValue({
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
    vi.spyOn(Fetcher, 'authFetcher').mockResolvedValue({
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

  it('returns null when there is an error fetching follow status', async () => {
    vi.spyOn(Fetcher, 'authFetcher').mockRejectedValue(
      new Error('Network error')
    );

    const { container } = renderWithProviders(
      <FollowButtonIcon username='testuser' />
    );

    await waitFor(() => {
      expect(container.querySelector('button')).toBeNull();
    });
  });

  it('shows skeleton while loading', () => {
    vi.spyOn(Fetcher, 'authFetcher').mockReturnValue(new Promise(() => {}));

    const { container } = renderWithProviders(
      <FollowButtonIcon username='testuser' />
    );

    const skeleton = container.querySelector('.animate-opacity-pulse');
    expect(skeleton).not.toBeNull();
  });

  it('disables follow icon button when follow mutation is pending', async () => {
    vi.spyOn(Fetcher, 'authFetcher').mockResolvedValue({
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
    vi.spyOn(Fetcher, 'authFetcher').mockResolvedValue({
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
