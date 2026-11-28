import { DiscussionFeedActions } from '@/components/discussions/DiscussionFeedActions';
import type { Discussion } from '@/services/discussions/discussionsTypes';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

const likeDiscussion = vi.hoisted(() => vi.fn());
const auth = vi.hoisted(() => ({
  session: { username: 'dave' } as { username: string } | null,
}));

vi.mock('next/navigation', () => ({
  usePathname: () => '/groups/tea',
  useSearchParams: () => new URLSearchParams(),
}));
vi.mock('@/hooks/auth/useAuth', () => ({
  default: () => ({ data: auth.session }),
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
    auth.session = { username: 'dave' };
  });

  it('likes the discussion and offers the same share control as a post', async () => {
    likeDiscussion.mockResolvedValue({ liked: true });
    render(<DiscussionFeedActions post={post} />);

    expect(
      screen.getByRole('button', { name: 'Share discussion' })
    ).toBeTruthy();
    expect(
      screen.getByRole('button', { name: 'Share discussion' }).textContent
    ).toContain('Share');
    expect(
      screen
        .getByRole('link', { name: 'Reply, 0 replies' })
        .getAttribute('href')
    ).toBe('/discussions/abc#replies');
    expect(
      screen.getByRole('button', { name: 'Like discussion' }).textContent
    ).toContain('Like');
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

  it('asks guests to log in without sending a like request', async () => {
    auth.session = null;
    render(<DiscussionFeedActions post={post} />);
    await userEvent.click(
      screen.getByRole('button', { name: 'Like discussion' })
    );
    expect(screen.getByRole('dialog')).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Log in' })).toBeTruthy();
    expect(likeDiscussion).not.toHaveBeenCalled();
  });

  it('restores the count and pressed state when liking fails', async () => {
    likeDiscussion.mockRejectedValue(new Error('offline'));
    render(<DiscussionFeedActions post={post} />);
    await userEvent.click(
      screen.getByRole('button', { name: 'Like discussion' })
    );
    await waitFor(() =>
      expect(
        screen
          .getByRole('button', { name: 'Like discussion' })
          .getAttribute('aria-pressed')
      ).toBe('false')
    );
    expect(screen.getByLabelText('0 likes').textContent).toBe('0');
  });
});
