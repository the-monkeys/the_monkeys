import { DiscussionFeedActions } from '@/components/discussions/DiscussionFeedActions';
import type { Discussion } from '@/services/discussions/discussionsTypes';
import { act, cleanup, render, screen, waitFor } from '@testing-library/react';
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

  it('reconciles the same mounted public preview with authenticated liked state and refreshed counts', () => {
    auth.session = null;
    const view = render(
      <DiscussionFeedActions
        post={{ ...post, liked: undefined, like_count: 2 }}
      />
    );
    const button = screen.getByRole('button', { name: 'Like discussion' });
    auth.session = { username: 'dave' };
    view.rerender(
      <DiscussionFeedActions post={{ ...post, liked: true, like_count: 5 }} />
    );
    expect(screen.getByRole('button', { name: 'Unlike discussion' })).toBe(
      button
    );
    expect(button.getAttribute('aria-pressed')).toBe('true');
    expect(screen.getByLabelText('5 likes')).toBeTruthy();
    view.rerender(
      <DiscussionFeedActions post={{ ...post, liked: true, like_count: 8 }} />
    );
    expect(screen.getByLabelText('8 likes')).toBeTruthy();
    view.rerender(
      <DiscussionFeedActions
        post={{ ...post, liked: undefined, like_count: undefined }}
      />
    );
    expect(button.getAttribute('aria-pressed')).toBe('false');
    expect(screen.getByLabelText('0 likes')).toBeTruthy();
    expect(likeDiscussion).not.toHaveBeenCalled();
  });

  it('preserves the optimistic click and pending request across refreshed props, then accepts later server updates', async () => {
    let finish!: (value: { liked: boolean }) => void;
    likeDiscussion.mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          finish = resolve;
        })
    );
    const view = render(
      <DiscussionFeedActions post={{ ...post, like_count: 2 }} />
    );
    await userEvent.click(
      screen.getByRole('button', { name: 'Like discussion' })
    );
    const button = screen.getByRole('button', { name: 'Unlike discussion' });
    expect(button.hasAttribute('disabled')).toBe(true);
    expect(screen.getByLabelText('3 likes')).toBeTruthy();
    const refreshed = { ...post, like_count: 9 };
    view.rerender(<DiscussionFeedActions post={refreshed} />);
    expect(screen.getByRole('button', { name: 'Unlike discussion' })).toBe(
      button
    );
    expect(screen.getByLabelText('3 likes')).toBeTruthy();
    await userEvent.click(button);
    expect(likeDiscussion).toHaveBeenCalledTimes(1);
    await act(async () => finish({ liked: true }));
    expect(button.hasAttribute('disabled')).toBe(false);
    expect(button.getAttribute('aria-pressed')).toBe('true');
    expect(screen.getByLabelText('3 likes')).toBeTruthy();
    // A new object or an unrelated field must not replay the stale snapshot.
    view.rerender(
      <DiscussionFeedActions post={{ ...refreshed, reply_count: 1 }} />
    );
    expect(button.getAttribute('aria-pressed')).toBe('true');
    expect(screen.getByLabelText('3 likes')).toBeTruthy();
    view.rerender(
      <DiscussionFeedActions
        post={{ ...refreshed, liked: true, like_count: 10 }}
      />
    );
    expect(screen.getByLabelText('10 likes')).toBeTruthy();
  });

  it('restores the newest viewer snapshot when it arrives during a failed toggle', async () => {
    let fail!: (reason: Error) => void;
    likeDiscussion.mockImplementationOnce(
      () =>
        new Promise((_, reject) => {
          fail = reject;
        })
    );
    auth.session = null;
    const preview = { ...post, liked: undefined, like_count: 2 };
    const view = render(<DiscussionFeedActions post={preview} />);
    auth.session = { username: 'dave' };
    view.rerender(<DiscussionFeedActions post={preview} />);
    await userEvent.click(
      screen.getByRole('button', { name: 'Like discussion' })
    );
    const button = screen.getByRole('button', { name: 'Unlike discussion' });
    expect(screen.getByLabelText('3 likes')).toBeTruthy();
    view.rerender(
      <DiscussionFeedActions post={{ ...post, liked: true, like_count: 5 }} />
    );
    expect(button.hasAttribute('disabled')).toBe(true);
    expect(screen.getByLabelText('3 likes')).toBeTruthy();
    await act(async () => fail(new Error('offline')));
    expect(button.hasAttribute('disabled')).toBe(false);
    expect(button.getAttribute('aria-pressed')).toBe('true');
    expect(screen.getByLabelText('5 likes')).toBeTruthy();
    expect(likeDiscussion).toHaveBeenCalledTimes(1);
  });

  it('restores the pre-click local reaction if no newer viewer snapshot arrives during failure', async () => {
    let fail!: (reason: Error) => void;
    likeDiscussion
      .mockResolvedValueOnce({ liked: true })
      .mockImplementationOnce(
        () =>
          new Promise((_, reject) => {
            fail = reject;
          })
      );
    const unchanged = { ...post, like_count: 2 };
    const view = render(<DiscussionFeedActions post={unchanged} />);
    await userEvent.click(
      screen.getByRole('button', { name: 'Like discussion' })
    );
    expect(screen.getByLabelText('3 likes')).toBeTruthy();
    await userEvent.click(
      screen.getByRole('button', { name: 'Unlike discussion' })
    );
    expect(screen.getByLabelText('2 likes')).toBeTruthy();
    view.rerender(
      <DiscussionFeedActions post={{ ...unchanged, reply_count: 1 }} />
    );
    await act(async () => fail(new Error('offline')));
    expect(
      screen
        .getByRole('button', { name: 'Unlike discussion' })
        .getAttribute('aria-pressed')
    ).toBe('true');
    expect(screen.getByLabelText('3 likes')).toBeTruthy();
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
