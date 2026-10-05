import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DiscussionComposer } from '@/components/discussions/DiscussionComposer';
import { describe, expect, it, vi } from 'vitest';

vi.mock('next/navigation', () => ({ useRouter: () => ({ refresh: vi.fn() }) }));
vi.mock('@/hooks/auth/useAuth', () => ({ default: () => ({ data: { username: 'dave' } }) }));
vi.mock('@/services/discussions/discussionsApi', () => ({
  createDiscussion: vi.fn(),
  discussionError: () => 'Something went wrong.',
}));

describe('DiscussionComposer', () => {
  it('shows the lock message instead of a box', () => {
    render(
      <DiscussionComposer
        scope={{ kind: 'site' }}
        lockedMessage='Log in to post a discussion.'
      />
    );
    expect(screen.getByText('Log in to post a discussion.')).toBeTruthy();
    expect(screen.queryByRole('textbox')).toBeNull();
  });

  it('rejects an empty post before calling the API', async () => {
    const api = await import('@/services/discussions/discussionsApi');
    render(<DiscussionComposer scope={{ kind: 'site' }} lockedMessage={null} />);
    await userEvent.click(screen.getByRole('button', { name: 'Post discussion' }));
    expect(screen.getByRole('alert').textContent).toBe('Write something.');
    expect(api.createDiscussion).not.toHaveBeenCalled();
  });
});
