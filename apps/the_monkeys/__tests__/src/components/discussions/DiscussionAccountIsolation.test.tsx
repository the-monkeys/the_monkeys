import { DiscussionListClient } from '@/components/discussions/DiscussionListClient';
import { GroupDiscussions } from '@/components/discussions/GroupDiscussions';
import type { GroupItem } from '@/services/groups/groupsTypes';
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  session: { account_id: 'adult', username: 'adult' } as {
    account_id: string;
    username: string;
  } | null,
  list: vi.fn(),
}));
vi.mock('@/hooks/auth/useAuth', () => ({
  default: () => ({ data: mocks.session }),
}));
vi.mock('@/services/discussions/discussionsApi', () => ({
  listDiscussions: mocks.list,
}));
vi.mock('@/components/discussions/DiscussionComposer', () => ({
  DiscussionComposer: () => null,
}));
vi.mock('@/components/discussions/DiscussionCard', () => ({
  DiscussionCard: ({ post }: { post: { body: string } }) => <p>{post.body}</p>,
}));
vi.mock('@/components/discussions/DiscussionFeedActions', () => ({
  DiscussionFeedActions: () => null,
}));
const post = (id: string) => ({ public_id: id, body: id, status: 'visible' });
afterEach(cleanup);
beforeEach(() => {
  mocks.session = { account_id: 'adult', username: 'adult' };
  mocks.list.mockReset();
  mocks.list.mockResolvedValue({ discussions: [post('fresh viewer post')] });
});

it('clears the site list immediately on logout and refetches without reusing initial adult data', async () => {
  const { rerender } = render(
    <DiscussionListClient initial={[post('private adult text')]} />
  );
  expect(screen.getByText('private adult text')).toBeTruthy();
  mocks.session = null;
  rerender(<DiscussionListClient initial={[post('private adult text')]} />);
  expect(screen.queryByText('private adult text')).toBeNull();
  await screen.findByText('fresh viewer post');
  mocks.session = { account_id: 'adult', username: 'adult' };
  rerender(<DiscussionListClient initial={[post('private adult text')]} />);
  expect(screen.queryByText('private adult text')).toBeNull();
  await waitFor(() => expect(mocks.list).toHaveBeenCalledTimes(2));
});

it('ignores an older page that finishes after the viewer switches accounts', async () => {
  let finish!: (value: unknown) => void;
  mocks.list.mockImplementationOnce(
    () =>
      new Promise((resolve) => {
        finish = resolve;
      })
  );
  const initial = Array.from({ length: 20 }, (_, i) => post(`adult-${i}`));
  const { rerender } = render(<DiscussionListClient initial={initial} />);
  fireEvent.click(screen.getByRole('button', { name: 'Older discussions' }));
  mocks.session = { account_id: 'minor', username: 'minor' };
  rerender(<DiscussionListClient initial={initial} />);
  await screen.findByText('fresh viewer post');
  await act(async () => finish({ discussions: [post('late adult page')] }));
  expect(screen.queryByText('late adult page')).toBeNull();
  expect(screen.queryByText('adult-0')).toBeNull();
});

it('clears group posts and ignores a pending response from the old account', async () => {
  let finish!: (value: unknown) => void;
  const group = { slug: 'hive', visibility: 'public' } as GroupItem;
  mocks.list.mockImplementationOnce(
    () =>
      new Promise((resolve) => {
        finish = resolve;
      })
  );
  const { rerender } = render(<GroupDiscussions group={group} />);
  mocks.session = null;
  rerender(<GroupDiscussions group={group} />);
  await screen.findByText('fresh viewer post');
  await act(async () => finish({ discussions: [post('old group secret')] }));
  expect(screen.queryByText('old group secret')).toBeNull();
  expect(mocks.list).toHaveBeenCalledTimes(2);
});

it('removes already loaded group posts before refetching for another account', async () => {
  const group = { slug: 'hive', visibility: 'public' } as GroupItem;
  mocks.list.mockResolvedValueOnce({
    discussions: [post('adult group secret')],
  });
  const { rerender } = render(<GroupDiscussions group={group} />);
  await screen.findByText('adult group secret');
  mocks.session = { account_id: 'minor', username: 'minor' };
  rerender(<GroupDiscussions group={group} />);
  expect(screen.queryByText('adult group secret')).toBeNull();
  await screen.findByText('fresh viewer post');
});

it('refetches client data after a server refresh following an account change', async () => {
  const initial = [post('original adult post')];
  const { rerender } = render(<DiscussionListClient initial={initial} />);
  mocks.session = null;
  rerender(<DiscussionListClient initial={initial} />);
  await screen.findByText('fresh viewer post');
  mocks.list.mockResolvedValue({
    discussions: [post('updated current viewer post')],
  });
  rerender(
    <DiscussionListClient initial={[post('untrusted server refresh')]} />
  );
  await screen.findByText('updated current viewer post');
  expect(screen.queryByText('untrusted server refresh')).toBeNull();
});
