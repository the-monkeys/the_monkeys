import { DiscussionActions } from '@/components/discussions/DiscussionActions';
import type { Discussion } from '@/services/discussions/discussionsTypes';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

afterEach(cleanup);

const mocks = vi.hoisted(() => ({
  refresh: vi.fn(),
  push: vi.fn(),
  session: { username: 'dave' } as { username: string } | null,
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({ refresh: mocks.refresh, push: mocks.push }),
  usePathname: () => '/discussions/d1',
}));
vi.mock('@/hooks/auth/useAuth', () => ({
  default: () => ({ data: mocks.session }),
}));
vi.mock('@/services/discussions/discussionsApi', () => ({
  deleteDiscussion: vi.fn().mockResolvedValue(undefined),
  editDiscussion: vi.fn(),
  likeDiscussion: vi.fn(),
  discussionError: () => 'Something went wrong.',
}));

const post: Discussion = {
  public_id: 'd1',
  body: 'Hello',
  status: 'active',
  author_username: 'dave',
  author_gone: false,
  group_slug: '',
  reply_count: 0,
  like_count: 2,
  liked: false,
  edited_until: '2000-01-01T00:00:00Z',
};

describe('DiscussionActions', () => {
  beforeEach(() => {
    mocks.refresh.mockClear();
    mocks.push.mockClear();
    mocks.session = { username: 'dave' };
  });

  it('asks for confirmation before deleting', async () => {
    const api = await import('@/services/discussions/discussionsApi');
    vi.mocked(api.deleteDiscussion).mockClear();
    render(<DiscussionActions post={post} />);

    expect(screen.queryByRole('button', { name: 'Edit' })).toBeNull();

    await userEvent.click(screen.getByRole('button', { name: 'Delete' }));
    expect(api.deleteDiscussion).not.toHaveBeenCalled();

    await userEvent.click(
      screen.getByRole('button', { name: 'Confirm delete' })
    );
    await waitFor(() => expect(api.deleteDiscussion).toHaveBeenCalledTimes(1));
    expect(api.deleteDiscussion).toHaveBeenCalledWith('d1');
    await waitFor(() => expect(mocks.refresh).toHaveBeenCalledTimes(1));
  });

  it('counts a like as soon as it is pressed', async () => {
    const api = await import('@/services/discussions/discussionsApi');
    vi.mocked(api.likeDiscussion).mockResolvedValue({ liked: true });
    render(<DiscussionActions post={post} />);

    const like = screen.getByRole('button', { name: 'Like, 2 likes' });
    expect(like.getAttribute('aria-pressed')).toBe('false');
    await userEvent.click(like);

    const liked = await screen.findByRole('button', { name: 'Like, 3 likes' });
    expect(liked.getAttribute('aria-pressed')).toBe('true');
    expect(api.likeDiscussion).toHaveBeenCalledWith('d1');
  });

  it('sends a signed out reader to log in when they like', async () => {
    mocks.session = null;
    const api = await import('@/services/discussions/discussionsApi');
    vi.mocked(api.likeDiscussion).mockClear();
    render(<DiscussionActions post={post} />);

    await userEvent.click(
      screen.getByRole('button', { name: 'Like, 2 likes' })
    );
    expect(mocks.push).toHaveBeenCalledTimes(1);
    expect(String(mocks.push.mock.calls[0][0])).toContain(
      encodeURIComponent('/discussions/d1')
    );
    expect(api.likeDiscussion).not.toHaveBeenCalled();
    expect(screen.queryByRole('button', { name: 'Delete' })).toBeNull();
  });
});
