import {
  FollowButton,
  FollowButtonIcon,
} from '@/components/user/buttons/followButton';
import { cleanup, fireEvent, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { renderWithProviders } from '../../../../utils';

const mockFollowMutation = vi.fn();
const mockUnfollowMutation = vi.fn();

let mockIsFollowing = false;
let mockIsLoading = false;
let mockIsError = false;
let mockFollowPending = false;
let mockUnfollowPending = false;

vi.mock('@/hooks/user/useUserConnections', () => ({
  useIsFollowingUser: () => ({
    followStatus: mockIsFollowing ? { isFollowing: true } : undefined,
    isLoading: mockIsLoading,
    isError: mockIsError,
  }),
  useFollowUser: () => ({
    followMutation: {
      mutate: mockFollowMutation,
      isPending: mockFollowPending,
    },
    unfollowMutation: {
      mutate: mockUnfollowMutation,
      isPending: mockUnfollowPending,
    },
  }),
}));

describe('FollowButton', () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
    mockIsFollowing = false;
    mockIsLoading = false;
    mockIsError = false;
    mockFollowPending = false;
    mockUnfollowPending = false;
  });

  it('renders Follow button when not following', () => {
    renderWithProviders(<FollowButton username='testuser' />);
    const followButton = screen.getByTestId('follow-button');
    expect(followButton).toBeDefined();
    expect(followButton.textContent).toContain('Follow');
  });

  it('renders Unfollow button when already following', () => {
    mockIsFollowing = true;
    renderWithProviders(<FollowButton username='testuser' />);
    const unfollowButton = screen.getByTestId('unfollow-button');
    expect(unfollowButton).toBeDefined();
    expect(unfollowButton.textContent).toContain('Unfollow');
  });

  it('calls follow mutation when Follow is clicked', () => {
    renderWithProviders(<FollowButton username='testuser' />);
    const followButton = screen.getByTestId('follow-button');

    fireEvent.click(followButton);

    expect(mockFollowMutation).toHaveBeenCalledTimes(1);
  });

  it('calls unfollow mutation when Unfollow is clicked', () => {
    mockIsFollowing = true;
    renderWithProviders(<FollowButton username='testuser' />);
    const unfollowButton = screen.getByTestId('unfollow-button');

    fireEvent.click(unfollowButton);

    expect(mockUnfollowMutation).toHaveBeenCalledTimes(1);
  });

  it('renders disabled Follow button on error', () => {
    mockIsError = true;
    renderWithProviders(<FollowButton username='testuser' />);
    const followButton = screen.getByRole('button', { name: /follow/i });
    expect(followButton).toBeDefined();
    expect((followButton as HTMLButtonElement).disabled).toBe(true);
  });

  it('disables Follow button when follow mutation is pending', () => {
    mockFollowPending = true;
    const { container } = renderWithProviders(
      <FollowButton username='testuser' />
    );
    const followButton = screen.getByTestId('follow-button');
    expect((followButton as HTMLButtonElement).disabled).toBe(true);
    expect(container.querySelector('.animate-loader-rotate')).not.toBeNull();
  });

  it('disables Unfollow button when unfollow mutation is pending', () => {
    mockIsFollowing = true;
    mockUnfollowPending = true;
    const { container } = renderWithProviders(
      <FollowButton username='testuser' />
    );
    const unfollowButton = screen.getByTestId('unfollow-button');
    expect((unfollowButton as HTMLButtonElement).disabled).toBe(true);
    expect(container.querySelector('.animate-loader-rotate')).not.toBeNull();
  });

  it('renders skeleton when loading', () => {
    mockIsLoading = true;
    const { container } = renderWithProviders(
      <FollowButton username='testuser' />
    );
    const skeleton = container.querySelector('.animate-opacity-pulse');
    expect(skeleton).not.toBeNull();
  });
});

describe('FollowButtonIcon', () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
    mockIsFollowing = false;
    mockIsLoading = false;
    mockIsError = false;
    mockFollowPending = false;
    mockUnfollowPending = false;
  });

  it('renders follow icon button when not following', () => {
    renderWithProviders(<FollowButtonIcon username='testuser' />);
    const followIconButton = screen.getByTestId('follow-icon-button');
    expect(followIconButton).toBeDefined();
  });

  it('renders unfollow icon button when already following', () => {
    mockIsFollowing = true;
    renderWithProviders(<FollowButtonIcon username='testuser' />);
    const unfollowIconButton = screen.getByTestId('unfollow-icon-button');
    expect(unfollowIconButton).toBeDefined();
  });

  it('calls follow mutation when icon button is clicked', () => {
    renderWithProviders(<FollowButtonIcon username='testuser' />);
    const followIconButton = screen.getByTestId('follow-icon-button');

    fireEvent.click(followIconButton);

    expect(mockFollowMutation).toHaveBeenCalledTimes(1);
  });

  it('calls unfollow mutation when unfollow icon button is clicked', () => {
    mockIsFollowing = true;
    renderWithProviders(<FollowButtonIcon username='testuser' />);
    const unfollowIconButton = screen.getByTestId('unfollow-icon-button');

    fireEvent.click(unfollowIconButton);

    expect(mockUnfollowMutation).toHaveBeenCalledTimes(1);
  });

  it('renders disabled icon button on error', () => {
    mockIsError = true;
    renderWithProviders(<FollowButtonIcon username='testuser' />);
    const iconButton = screen.getByRole('button');
    expect(iconButton).toBeDefined();
    expect((iconButton as HTMLButtonElement).disabled).toBe(true);
  });

  it('disables follow icon button when follow mutation is pending', () => {
    mockFollowPending = true;
    const { container } = renderWithProviders(
      <FollowButtonIcon username='testuser' />
    );
    const followIconButton = screen.getByTestId('follow-icon-button');
    expect((followIconButton as HTMLButtonElement).disabled).toBe(true);
    expect(container.querySelector('.animate-loader-rotate')).not.toBeNull();
  });

  it('disables unfollow icon button when unfollow mutation is pending', () => {
    mockIsFollowing = true;
    mockUnfollowPending = true;
    const { container } = renderWithProviders(
      <FollowButtonIcon username='testuser' />
    );
    const unfollowIconButton = screen.getByTestId('unfollow-icon-button');
    expect((unfollowIconButton as HTMLButtonElement).disabled).toBe(true);
    expect(container.querySelector('.animate-loader-rotate')).not.toBeNull();
  });

  it('renders skeleton when loading', () => {
    mockIsLoading = true;
    const { container } = renderWithProviders(
      <FollowButtonIcon username='testuser' />
    );
    const skeleton = container.querySelector('.animate-opacity-pulse');
    expect(skeleton).not.toBeNull();
  });
});
