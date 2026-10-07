import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DiscussionActions } from '@/components/discussions/DiscussionActions';
import type { Discussion } from '@/services/discussions/discussionsTypes';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const refresh = vi.fn();

vi.mock('next/navigation', () => ({ useRouter: () => ({ refresh }) }));
vi.mock('@/hooks/auth/useAuth', () => ({
  default: () => ({ data: { username: 'dave' } }),
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
  like_count: 0,
  liked: false,
  edited_until: '2000-01-01T00:00:00Z',
};

describe('DiscussionActions delete', () => {
  beforeEach(() => {
    refresh.mockClear();
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
    await waitFor(() => expect(refresh).toHaveBeenCalledTimes(1));
  });
});
