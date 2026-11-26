import Page from '@/app/snapshot/discussion/[id]/page';
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({ load: vi.fn() }));
vi.mock('@/lib/discussionPageData', () => ({ loadDiscussion: mocks.load }));
vi.mock('next/navigation', () => ({
  notFound: () => {
    throw new Error('NOT_FOUND');
  },
}));
vi.mock('@/features/snapshot/components/DiscussionStudio', () => ({
  DiscussionStudio: ({ post }: { post: { body: string } }) => (
    <div>{post.body}</div>
  ),
}));
afterEach(cleanup);
beforeEach(() => vi.clearAllMocks());

it('loads the authoritative public discussion without credentials or query text', async () => {
  mocks.load.mockResolvedValue({
    state: 'ok',
    indexable: true,
    discussion: {
      public_id: 'abc',
      body: 'Original discussion',
      status: 'visible',
    },
  });
  render(await Page({ params: { id: 'abc' } }));
  expect(mocks.load).toHaveBeenCalledWith('abc', '');
  expect(screen.getByText('Original discussion')).toBeTruthy();
});

it.each([
  { state: 'missing' },
  {
    state: 'ok',
    indexable: false,
    discussion: {
      public_id: 'abc',
      body: 'private',
      audience: 'group_only',
      status: 'visible',
    },
  },
  {
    state: 'ok',
    indexable: false,
    discussion: { public_id: 'abc', body: 'removed', status: 'deleted' },
  },
])('does not open a private, deleted or missing discussion', async (found) => {
  mocks.load.mockResolvedValue(found);
  await expect(Page({ params: { id: 'abc' } })).rejects.toThrow('NOT_FOUND');
});

it('shows a recoverable service error without spinning forever', async () => {
  mocks.load.mockResolvedValue({ state: 'unavailable' });
  render(await Page({ params: { id: 'abc' } }));
  expect(screen.getByText(/temporarily unavailable/i)).toBeTruthy();
  expect(
    screen.getByRole('link', { name: /discussion/i }).getAttribute('href')
  ).toBe('/discussions/abc');
});
