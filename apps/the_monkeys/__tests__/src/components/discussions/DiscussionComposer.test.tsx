import { DiscussionComposer } from '@/components/discussions/DiscussionComposer';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

afterEach(cleanup);

vi.mock('next/navigation', () => ({
  useRouter: () => ({ refresh: vi.fn() }),
  usePathname: () => '/discussions',
}));
vi.mock('@/hooks/search/useSearchV2', () => ({
  useSearchPeopleV2: () => ({ users: null, isLoading: false }),
}));
vi.mock('@/hooks/auth/useAuth', () => ({
  default: () => ({ data: { username: 'dave' } }),
}));
vi.mock('@/services/discussions/discussionsApi', () => ({
  createDiscussion: vi.fn(),
  discussionError: () => 'Something went wrong.',
}));

describe('DiscussionComposer', () => {
  it('offers a log in link instead of a box when signed out', () => {
    render(<DiscussionComposer locked='login' scope={{ kind: 'site' }} />);
    const link = screen.getByRole('link', { name: 'Log in' });
    expect(link.getAttribute('href')).toContain(
      encodeURIComponent('/discussions')
    );
    expect(link.parentElement?.textContent).toBe(
      'Log in to post a discussion.'
    );
    expect(screen.queryByRole('textbox')).toBeNull();
  });

  it('asks non-members to join', () => {
    render(<DiscussionComposer locked='join' scope={{ kind: 'site' }} />);
    expect(
      screen.getByText('Join the group to post a discussion.')
    ).toBeTruthy();
  });

  it('rejects an empty post before calling the API', async () => {
    const api = await import('@/services/discussions/discussionsApi');
    render(<DiscussionComposer locked={null} scope={{ kind: 'site' }} />);
    expect(screen.getByRole('textbox').getAttribute('placeholder')).toBe(
      'Start a discussion'
    );
    expect(screen.getByText('0/500')).toBeTruthy();
    await userEvent.click(
      screen.getByRole('button', { name: 'Post discussion' })
    );
    expect(screen.getByRole('alert').textContent).toBe('Write something.');
    expect(api.createDiscussion).not.toHaveBeenCalled();
  });

  it('defaults group posts to members only', async () => {
    const api = await import('@/services/discussions/discussionsApi');
    render(
      <DiscussionComposer
        chooseAudience
        locked={null}
        scope={{ kind: 'group', slug: 'tea' }}
      />
    );
    expect(screen.getByRole('radio', { name: 'Members only' })).toHaveProperty(
      'checked',
      true
    );
    await userEvent.type(screen.getByRole('textbox'), 'Hello hive');
    await userEvent.click(
      screen.getByRole('button', { name: 'Post discussion' })
    );
    expect(api.createDiscussion).toHaveBeenCalledWith(
      { kind: 'group', slug: 'tea' },
      'Hello hive',
      'group_only'
    );
  });
});
