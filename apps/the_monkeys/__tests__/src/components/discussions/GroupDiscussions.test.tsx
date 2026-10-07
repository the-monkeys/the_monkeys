import { GroupDiscussions } from '@/components/discussions/GroupDiscussions';
import type { GroupItem } from '@/services/groups/groupsTypes';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AxiosError } from 'axios';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  session: null as { username: string } | null,
  listDiscussions: vi.fn(),
  createDiscussion: vi.fn(),
}));

vi.mock('next/navigation', () => ({ useRouter: () => ({ refresh: vi.fn() }) }));
vi.mock('@/hooks/auth/useAuth', () => ({
  default: () => ({ data: mocks.session }),
}));
vi.mock('@/services/discussions/discussionsApi', () => ({
  listDiscussions: mocks.listDiscussions,
  createDiscussion: mocks.createDiscussion,
  discussionError: () => 'Something went wrong.',
}));

function group(status?: string): GroupItem {
  return { slug: 'bees', viewer_member_status: status } as unknown as GroupItem;
}

function httpError(status: number) {
  const err = new AxiosError('failed');
  err.response = { status } as AxiosError['response'];
  return err;
}

const post = {
  public_id: 'd1',
  body: 'Hello hive',
  status: 'active',
  author_username: 'dave',
  author_gone: false,
  group_slug: 'bees',
  reply_count: 0,
  like_count: 0,
  liked: false,
};

describe('GroupDiscussions', () => {
  afterEach(cleanup);
  beforeEach(() => {
    mocks.session = null;
    mocks.listDiscussions.mockReset();
    mocks.createDiscussion.mockReset();
  });

  it('says the group is not available on a 404', async () => {
    mocks.listDiscussions.mockRejectedValue(httpError(404));
    render(<GroupDiscussions group={group()} />);
    expect(
      await screen.findByText('This group is not available.')
    ).toBeTruthy();
    expect(mocks.listDiscussions).toHaveBeenCalledWith({
      kind: 'group',
      slug: 'bees',
    });
  });

  it('shows a generic message for other errors', async () => {
    mocks.listDiscussions.mockRejectedValue(httpError(500));
    render(<GroupDiscussions group={group()} />);
    expect(await screen.findByText('Could not load discussions.')).toBeTruthy();
  });

  it('shows the empty state', async () => {
    mocks.listDiscussions.mockResolvedValue({ discussions: [] });
    render(<GroupDiscussions group={group()} />);
    expect(await screen.findByText('No discussions yet.')).toBeTruthy();
  });

  it('locks the composer for signed out readers', async () => {
    mocks.listDiscussions.mockResolvedValue({ discussions: [post] });
    render(<GroupDiscussions group={group()} />);
    expect(await screen.findByText('Hello hive')).toBeTruthy();
    expect(screen.getByText('Log in to post a discussion.')).toBeTruthy();
  });

  it('asks signed in non-members to join', async () => {
    mocks.session = { username: 'dave' };
    mocks.listDiscussions.mockResolvedValue({ discussions: [] });
    render(<GroupDiscussions group={group('none')} />);
    expect(
      await screen.findByText('Join the group to post a discussion.')
    ).toBeTruthy();
  });

  it('reloads the list after a successful post', async () => {
    mocks.session = { username: 'dave' };
    mocks.listDiscussions.mockResolvedValue({ discussions: [] });
    mocks.createDiscussion.mockResolvedValue(post);
    render(<GroupDiscussions group={group('active')} />);
    await screen.findByText('No discussions yet.');
    await userEvent.type(screen.getByRole('textbox'), 'Hello hive');
    mocks.listDiscussions.mockResolvedValue({ discussions: [post] });
    await userEvent.click(
      screen.getByRole('button', { name: 'Post discussion' })
    );
    expect(mocks.createDiscussion).toHaveBeenCalledWith(
      { kind: 'group', slug: 'bees' },
      'Hello hive'
    );
    await waitFor(() => expect(mocks.listDiscussions).toHaveBeenCalledTimes(2));
    expect(await screen.findByText('Hello hive')).toBeTruthy();
  });
});
