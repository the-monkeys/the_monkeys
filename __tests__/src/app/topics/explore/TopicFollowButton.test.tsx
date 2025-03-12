import TopicFollowButton from '@/app/topics/[topic]/components/TopicFollowButton';
import * as toastModule from '@/components/ui/use-toast';
import useAuth from '@/hooks/auth/useAuth';
import useUser from '@/hooks/user/useUser';
import axiosInstance from '@/services/api/axiosInstance';
import '@/services/user/userService';
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { mutate } from 'swr';
import { afterEach, describe, expect, it, vi } from 'vitest';

export const followTopicApi = async (username: string, topic: string) => {
  return axiosInstance.put(`/user/follow-topics/${username}`, {
    topics: [topic],
  });
};
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
  useParams: () => ({ topic: 'myTestTopic' }),
}));

vi.mock('@/hooks/auth/useAuth');
vi.mock('@/hooks/user/useUser');
vi.mock('@/components/ui/use-toast', () => ({
  toast: vi.fn(),
}));
vi.mock('swr', () => ({
  mutate: vi.fn(),
}));
vi.mock('@/services/api/axiosInstance');
vi.mocked(followTopicApi);
vi.mock('@/services/userService', () => ({
  followTopicApi: vi.fn(),
}));
const mockFollowTopicApi = vi.fn();
vi.mock('@/services/userService', () => ({
  followTopicApi: mockFollowTopicApi,
}));

describe('Individual Topic Follow Button', () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it('should show an error toast when user is not present', () => {
    (useAuth as jest.Mock).mockReturnValue({ data: null });
    (useUser as jest.Mock).mockReturnValue({ user: null });
    render(<TopicFollowButton topic='myTestTopic' />);
    const followButton = screen.getByTestId('followButton');

    fireEvent.click(followButton);

    expect(toastModule.toast).toHaveBeenCalledWith({
      title: 'Error',
      description: 'Username is missing, please relogin.',
    });
  });

  it('should render a Follow Button when the topic is not followed', () => {
    const mockUser = { topics: [] };
    (useAuth as jest.Mock).mockReturnValue({ data: { username: 'testUser' } });
    (useUser as jest.Mock).mockReturnValue({ user: mockUser });

    render(<TopicFollowButton topic='myTestTopic' />);
    const followButton = screen.getByTestId('followButton');

    expect(followButton).toBeTruthy();
    expect(followButton.textContent).toContain('Follow Topic');
  });

  it('should render an Unfollow Button when the topic is already followed', () => {
    const mockUser = { username: 'testUser', topics: ['myTestTopic'] };
    (useAuth as jest.Mock).mockReturnValue({ data: { username: 'testUser' } });
    (useUser as jest.Mock).mockReturnValue({ user: mockUser });

    render(<TopicFollowButton topic='myTestTopic' />);
    const unFollowButton = screen.getByTestId('unFollowButton');

    expect(unFollowButton).toBeTruthy();
    expect(unFollowButton.textContent).toContain('Unfollow Topic');
  });
});

it('should show error toast when API call fails during follow operation', async () => {
  const mockUser = { username: 'testUser', topics: [] };
  (useAuth as jest.Mock).mockReturnValue({ data: { username: 'testUser' } });
  (useUser as jest.Mock).mockReturnValue({ user: mockUser });
  (axiosInstance.put as jest.Mock).mockRejectedValue(new Error('API Error'));

  render(<TopicFollowButton topic='myTestTopic' />);
  const followButton = screen.getByTestId('followButton');

  fireEvent.click(followButton);

  await waitFor(() => {
    expect(toastModule.toast).toHaveBeenCalledWith({
      title: 'Error',
      description: 'Something went wrong while following the topic.',
    });
  });
});
