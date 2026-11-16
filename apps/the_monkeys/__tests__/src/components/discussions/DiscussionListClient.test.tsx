import { DiscussionListClient } from '@/components/discussions/DiscussionListClient';
import type { Discussion } from '@/services/discussions/discussionsTypes';
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';

const listDiscussions = vi.hoisted(() => vi.fn());
vi.mock('@/services/discussions/discussionsApi', () => ({ listDiscussions }));
vi.mock('@/components/discussions/DiscussionAvatar', () => ({
  DiscussionAvatar: () => null,
}));
vi.mock('@/hooks/user/useUser', () => ({
  default: () => ({ user: undefined }),
}));
vi.mock('@/hooks/groups/useGroupQueries', () => ({
  useGroupDetail: () => ({ data: undefined }),
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({ refresh: vi.fn() }),
  usePathname: () => '/discussions',
  useSearchParams: () => new URLSearchParams(),
}));
vi.mock('@/hooks/auth/useAuth', () => ({ default: () => ({ data: null }) }));

afterEach(() => {
  cleanup();
  listDiscussions.mockReset();
});

const initial: Discussion[] = Array.from({ length: 20 }, (_, i) => ({
  public_id: `p${i}`,
  body: `Thread ${i}`,
  status: 'visible',
}));

it('asks a logged-out reader to log in', () => {
  render(<DiscussionListClient initial={[]} />);
  expect(screen.getByRole('link', { name: 'Log in' })).toBeTruthy();
  expect(screen.getByText('No discussions yet.')).toBeTruthy();
});

it('appends older public threads once and advances the link without adding browser history entries', async () => {
  listDiscussions.mockResolvedValue({
    discussions: [
      initial[19],
      ...Array.from({ length: 19 }, (_, i) => ({
        public_id: `older${i}`,
        body: `Older thread ${i}`,
        status: 'visible',
      })),
    ],
  });
  const before = window.location.href;
  render(<DiscussionListClient initial={initial} />);
  fireEvent.click(screen.getByText('Older discussions'));
  await screen.findByText('Older thread 18');
  expect(screen.getAllByText('Thread 19')).toHaveLength(1);
  expect(listDiscussions).toHaveBeenCalledWith({ kind: 'site' }, 'p19');
  expect(
    screen.getByRole('link', { name: 'Older discussions' }).getAttribute('href')
  ).toBe('/discussions?before_id=older18');
  expect(window.location.href).toBe(before);
});

it('leaves modified clicks to the browser', () => {
  let prevented: boolean | undefined;
  render(
    <div
      onClick={(event) => {
        prevented = event.defaultPrevented;
        event.preventDefault();
      }}
    >
      <DiscussionListClient initial={initial} />
    </div>
  );
  fireEvent.click(screen.getByText('Older discussions'), { ctrlKey: true });
  expect(prevented).toBe(false);
  expect(listDiscussions).not.toHaveBeenCalled();
});

it('keeps the same link available after a failed load for retry', async () => {
  listDiscussions
    .mockRejectedValueOnce(new Error('offline'))
    .mockResolvedValueOnce({
      discussions: [
        { public_id: 'old', body: 'Old thread', status: 'visible' },
      ],
    });
  render(<DiscussionListClient initial={initial} />);
  fireEvent.click(screen.getByText('Older discussions'));
  await screen.findByRole('alert');
  expect(
    screen.getByRole('link', { name: 'Older discussions' }).getAttribute('href')
  ).toBe('/discussions?before_id=p19');
  fireEvent.click(screen.getByText('Older discussions'));
  await screen.findByText('Old thread');
  expect(screen.queryByText('Older discussions')).toBeNull();
});

it('does not append private or removed rows and stops a repeated page', async () => {
  listDiscussions.mockResolvedValueOnce({
    discussions: [
      {
        public_id: 'secret',
        body: 'Secret thread',
        status: 'visible',
        audience: 'group_only',
      },
      { public_id: 'deleted', body: 'Deleted thread', status: 'deleted' },
      ...initial.slice(2),
    ],
  });
  render(<DiscussionListClient initial={initial} />);
  fireEvent.click(screen.getByText('Older discussions'));
  await waitFor(() =>
    expect(screen.queryByText('Older discussions')).toBeNull()
  );
  expect(screen.queryByText('Secret thread')).toBeNull();
  expect(screen.queryByText('Deleted thread')).toBeNull();
  expect(screen.getAllByRole('listitem')).toHaveLength(20);
});

it('blocks duplicate clicks while a page is loading', async () => {
  let finish!: (value: { discussions: Discussion[] }) => void;
  listDiscussions.mockReturnValue(
    new Promise((resolve) => {
      finish = resolve;
    })
  );
  render(<DiscussionListClient initial={initial} />);
  fireEvent.click(screen.getByText('Older discussions'));
  fireEvent.click(screen.getByText('Older discussions'));
  expect(listDiscussions).toHaveBeenCalledTimes(1);
  await act(async () => finish({ discussions: [] }));
});
