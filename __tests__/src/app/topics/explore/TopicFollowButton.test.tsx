import TopicFollowButton from '@/app/topics/[topic]/components/TopicFollowButton';
import * as toastModule from '@/components/ui/use-toast';
import useAuth from '@/hooks/auth/useAuth';
import useUser from '@/hooks/user/useUser';
import axiosInstance from '@/services/api/axiosInstance';
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { mutate } from 'swr';
import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('next/navigation', () => ({
  useParams: () => ({ topic: 'myTestTopic' }),
}));

vi.mock('@/hooks/auth/useAuth');
vi.mock('@/hooks/user/useUser');
vi.mock('@/components/ui/use-toast', () => ({
  toast: vi.fn(),
}));
vi.mock('@/services/api/axiosInstance');
vi.mock('swr', () => ({
  mutate: vi.fn(),
}));

describe('Individual topic follow button', () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it('should show an error toast when user is not present', () => {
    (useAuth as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      data: null,
    });
    (useUser as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      user: null,
    });

    render(<TopicFollowButton />);
    const followButton = screen.getByTestId('followButton');
    fireEvent.click(followButton);

    expect(toastModule.toast).toHaveBeenCalledWith({
      title: 'Error',
      description: 'Username is missing, please relogin.',
    });
  });

  it('Should render a Follow Button when the topic is not followed', () => {
    const mockUser = { topics: [] };
    (useAuth as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      data: { username: 'testUser' },
    });
    (useUser as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      user: mockUser,
    });

    render(<TopicFollowButton />);
    const followButton = screen.getByTestId('followButton');
    expect(followButton).toBeTruthy();
    expect(followButton.textContent).toContain('Follow Topic');
  });

  it('Should render an Unfollow Button when the topic is already followed', () => {
    const mockUser = { username: 'testUser', topics: ['myTestTopic'] };
    (useAuth as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      data: { username: 'testUser' },
    });
    (useUser as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      user: mockUser,
    });

    render(<TopicFollowButton />);
    const unFollowButton = screen.getByTestId('unFollowButton');
    expect(unFollowButton).toBeTruthy();
    expect(unFollowButton.textContent).toContain('Unfollow Topic');
  });
  it('should call API and show success toast when following a topic', async () => {
    const mockUser = { username: 'testUser', topics: [] };
    (useAuth as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      data: { username: 'testUser' },
    });
    (useUser as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      user: mockUser,
    });
    (
      axiosInstance.put as unknown as ReturnType<typeof vi.fn>
    ).mockResolvedValue({ data: { success: true } });
    render(<TopicFollowButton />);
    const followButton = screen.getByTestId('followButton');
    fireEvent.click(followButton);
    await waitFor(() => {
      expect(axiosInstance.put).toHaveBeenCalledWith(
        '/user/follow-topics/testUser',
        { topics: ['myTestTopic'] }
      );
      expect(toastModule.toast).toHaveBeenCalledWith({
        variant: 'success',
        title: 'Topic Followed',
        description: 'You have successfully followed myTestTopic',
      });
      expect(mutate).toHaveBeenCalledWith('/user/topics');
      expect(mutate).toHaveBeenCalledWith('/user/public/testUser');
    });
  });

  it('should show error toast when API call fails during follow operation', async () => {
    const mockUser = { username: 'testUser', topics: [] };
    (useAuth as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      data: { username: 'testUser' },
    });
    (useUser as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      user: mockUser,
    });
    (
      axiosInstance.put as unknown as ReturnType<typeof vi.fn>
    ).mockRejectedValue(new Error('API Error'));
    render(<TopicFollowButton />);
    const followButton = screen.getByTestId('followButton');
    fireEvent.click(followButton);
    await waitFor(() => {
      expect(toastModule.toast).toHaveBeenCalledWith({
        title: 'Error',
        description: 'Something went wrong while following the topic.',
      });
    });
  });
});
