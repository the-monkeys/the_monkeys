import TopicFollowButton from '@/app/topics/[topic]/components/TopicFollowButton';
import useAuth from '@/hooks/auth/useAuth';
import useUser from '@/hooks/user/useUser';
import * as UserAPI from '@/services/user/user';
import { cleanup, fireEvent, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { renderWithProviders } from '../../../../utils';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
  useParams: () => ({ topic: 'myTestTopic' }),
  usePathname: () => '/topics/myTestTopic',
  useSearchParams: () => ({ toString: () => '' }),
}));

vi.mock('@/hooks/auth/useAuth');
vi.mock('@/hooks/user/useUser');

describe('TopicFollowButton Component', () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it('shows "Login Error" message when user is not logged in', async () => {
    useAuth.mockReturnValue({ data: null });
    useUser.mockReturnValue({ user: null });
    renderWithProviders(<TopicFollowButton topic='myTestTopic' />);
    const followButton = screen.getByTestId('followButton');

    fireEvent.click(followButton);
    await waitFor(() => {
      screen.getByText('Login Required');
    });
  });

  it('renders Follow button when topic is not followed', () => {
    useAuth.mockReturnValue({ data: { username: 'testUser' } });
    useUser.mockReturnValue({ user: { username: 'testUser', topics: [] } });

    renderWithProviders(<TopicFollowButton topic='myTestTopic' />);
    const followButton = screen.getByTestId('followButton');
    expect(followButton.textContent).toContain('Follow');
  });

  it('renders Unfollow button when topic is followed', () => {
    useAuth.mockReturnValue({ data: { username: 'testUser' } });
    useUser.mockReturnValue({
      user: { username: 'testUser', topics: ['myTestTopic'] },
    });

    renderWithProviders(<TopicFollowButton topic='myTestTopic' />);
    const unFollowButton = screen.getByTestId('unFollowButton');
    expect(unFollowButton.textContent).toContain('Unfollow');
  });

  it('calls API to follow topic when Follow button is clicked', async () => {
    useAuth.mockReturnValue({ data: { username: 'testUser' } });
    useUser.mockReturnValue({ user: { username: 'testUser', topics: [] } });
    const spy = vi.spyOn(UserAPI, 'followTopicApi').mockImplementation(() => ({
      status: 201,
      message: 'You have successfully followed myTestTopic',
    }));
    renderWithProviders(<TopicFollowButton topic='myTestTopic' />);
    const followButton = screen.getByTestId('followButton');

    fireEvent.click(followButton);

    await waitFor(() => {
      screen.getByText('You have successfully followed myTestTopic');
    });
  });
  it('calls API to Unfollow topic when Unfollow button is clicked', async () => {
    useAuth.mockReturnValue({ data: { username: 'testUser' } });
    useUser.mockReturnValue({
      user: { username: 'testUser', topics: ['myTestTopic'] },
    });
    const spy = vi
      .spyOn(UserAPI, 'unfollowTopicApi')
      .mockImplementation(() => ({
        status: 201,
        message: 'You have successfully Unfollowed myTestTopic',
      }));
    renderWithProviders(<TopicFollowButton topic='myTestTopic' />);
    const unfollowButton = screen.getByTestId('unFollowButton');

    fireEvent.click(unfollowButton);

    await waitFor(() => {
      screen.getByText('You have successfully unfollowed myTestTopic');
    });
  });
});
