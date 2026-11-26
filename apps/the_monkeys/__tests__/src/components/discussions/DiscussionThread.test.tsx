import { DiscussionThread } from '@/components/discussions/DiscussionThread';
import type {
  Discussion,
  DiscussionReply,
} from '@/services/discussions/discussionsTypes';
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';

afterEach(cleanup);

vi.mock('@/components/discussions/DiscussionActions', () => ({
  DiscussionActions: () => null,
}));
vi.mock('@/components/discussions/ReplyForm', () => ({
  ReplyForm: () => null,
  ReplyToggle: ({ parentId }: { parentId: string }) => (
    <span>{`reply to ${parentId}`}</span>
  ),
}));
vi.mock('@/components/discussions/DiscussionAvatar', () => ({
  DiscussionAvatar: () => null,
}));
vi.mock('@/hooks/user/useUser', () => ({
  default: (username?: string) => ({
    user: username ? { username, first_name: `Name ${username}` } : undefined,
  }),
}));
vi.mock('@/hooks/groups/useGroupQueries', () => ({
  useGroupDetail: () => ({ data: undefined }),
}));

function reply(
  public_id: string,
  parent_public_id = '',
  status = 'visible'
): DiscussionReply {
  return {
    public_id,
    parent_public_id,
    body: status === 'visible' ? `Body ${public_id}` : '',
    status,
    author_username: `user_${public_id}`,
  };
}

function thread(replies: DiscussionReply[]): Discussion {
  return {
    public_id: 'abc',
    body: 'Root post',
    status: 'visible',
    author_username: 'dave',
    replies,
  };
}

it('prints the post and one reply level', () => {
  render(<DiscussionThread post={thread([reply('r1')])} />);
  expect(screen.getByText('Root post')).toBeTruthy();
  expect(screen.getByText('Body r1')).toBeTruthy();
  expect(
    screen.getByRole('link', { name: 'Discussions' }).getAttribute('href')
  ).toBe('/discussions');
  expect(screen.getByRole('heading', { name: 'Replies (1)' })).toBeTruthy();
});

it('shows replies at any depth with a reply button on each', () => {
  render(
    <DiscussionThread
      post={thread([
        reply('l1'),
        reply('l2', 'l1'),
        reply('l3', 'l2'),
        reply('l4', 'l3'),
        reply('l5', 'l4'),
      ])}
    />
  );
  for (const id of ['l1', 'l2', 'l3', 'l4', 'l5']) {
    expect(screen.getByText(`Body ${id}`)).toBeTruthy();
    expect(screen.getByText(`reply to ${id}`)).toBeTruthy();
  }
  expect(screen.getByRole('heading', { name: 'Replies (5)' })).toBeTruthy();
});

it('labels replies past the third level with who they answer', () => {
  render(
    <DiscussionThread
      post={thread([
        reply('l1'),
        reply('l2', 'l1'),
        reply('l3', 'l2'),
        reply('l4', 'l3'),
        reply('l5', 'l4'),
      ])}
    />
  );
  const l3 = screen.getByRole('link', { name: '@user_l3' });
  expect(l3.getAttribute('href')).toBe('#reply-l3');
  const l4 = screen.getByRole('link', { name: '@user_l4' });
  expect(l4.getAttribute('href')).toBe('#reply-l4');
  expect(screen.getAllByText(/Replying to/)).toHaveLength(2);
});

it('keeps replies under a removed reply and drops empty removed ones', () => {
  render(
    <DiscussionThread
      post={thread([
        reply('r1'),
        reply('r2', '', 'hidden'),
        reply('r3', 'r2'),
        reply('r4', 'r1', 'hidden'),
      ])}
    />
  );
  expect(screen.getAllByText('This reply was removed.')).toHaveLength(1);
  expect(screen.getByText('Body r3')).toBeTruthy();
  expect(screen.queryByText('reply to r2')).toBeNull();
  expect(screen.queryByText('reply to r4')).toBeNull();
  expect(screen.getByRole('heading', { name: 'Replies (2)' })).toBeTruthy();
});
