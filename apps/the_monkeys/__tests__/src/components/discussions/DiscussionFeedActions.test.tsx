import { DiscussionFeedActions } from '@/components/discussions/DiscussionFeedActions';
import type { Discussion } from '@/services/discussions/discussionsTypes';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

const likeDiscussion = vi.hoisted(() => vi.fn());

vi.mock('next/navigation', () => ({
  usePathname: () => '/groups/tea',
  useSearchParams: () => new URLSearchParams(),
}));
vi.mock('@/hooks/auth/useAuth', () => ({
  default: () => ({ data: { username: 'dave' } }),
}));
vi.mock('@/services/discussions/discussionsApi', () => ({
  likeDiscussion,
  discussionError: () => 'Could not like this discussion.',
}));

const post: Discussion = {
  public_id: 'abc',
  body: 'Hello thread',
  status: 'visible',
  author_username: 'ada',
  author_gone: false,
  like_count: 0,
  liked: false,
  created_at: '2026-10-05T04:00:00Z',
};

describe('DiscussionFeedActions', () => {
  afterEach(() => {
    cleanup();
    likeDiscussion.mockReset();
  });

  it('likes the discussion and offers the same share control as a post', async () => {
    likeDiscussion.mockResolvedValue({ liked: true });
    render(<DiscussionFeedActions post={post} />);

    expect(screen.getByRole('button', { name: 'Share discussion' })).toBeTruthy();
    expect(screen.getByLabelText('0 likes').textContent).toBe('0');

    await userEvent.click(
      screen.getByRole('button', { name: 'Like discussion' })
    );

    expect(likeDiscussion).toHaveBeenCalledWith('abc');
    expect(screen.getByLabelText('1 like').textContent).toBe('1');
    expect(
      screen.getByRole('button', { name: 'Unlike discussion' })
    ).toBeTruthy();
  });
});
