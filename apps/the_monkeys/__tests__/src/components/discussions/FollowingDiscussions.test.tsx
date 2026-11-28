import { FollowingDiscussions } from '@/components/feed/FollowingDiscussions';
import { listFollowingDiscussions } from '@/services/discussions/discussionsApi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, expect, it, vi } from 'vitest';

vi.mock('@/services/discussions/discussionsApi', () => ({
  listFollowingDiscussions: vi.fn(),
}));
vi.mock('@/components/discussions/DiscussionListClient', () => ({
  DiscussionFeed: ({
    posts,
  }: {
    posts: { public_id: string; body: string }[];
  }) => (
    <div>
      {posts.map((post) => (
        <p key={post.public_id}>{post.body}</p>
      ))}
    </div>
  ),
}));
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

function setup(username = 'dave') {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return {
    client,
    ...render(
      <QueryClientProvider client={client}>
        <FollowingDiscussions viewerAccountId={username} />
      </QueryClientProvider>
    ),
  };
}

it('uses only the authenticated following endpoint and provides independent pagination', async () => {
  const page = Array.from({ length: 20 }, (_, i) => ({
    public_id: `p${i}`,
    body: `Followed ${i}`,
  }));
  vi.mocked(listFollowingDiscussions)
    .mockResolvedValueOnce({ discussions: page as never[] })
    .mockResolvedValueOnce({
      discussions: [
        { public_id: 'older', body: 'Older followed discussion' } as never,
      ],
    });
  setup();
  expect(await screen.findByText('Followed 0')).toBeTruthy();
  await userEvent.click(
    screen.getByRole('button', { name: 'Older discussions' })
  );
  expect(await screen.findByText('Older followed discussion')).toBeTruthy();
  expect(listFollowingDiscussions).toHaveBeenNthCalledWith(
    1,
    undefined,
    expect.any(AbortSignal)
  );
  expect(listFollowingDiscussions).toHaveBeenNthCalledWith(
    2,
    'p19',
    expect.any(AbortSignal)
  );
});

it('does not reuse another viewers personalized list', async () => {
  vi.mocked(listFollowingDiscussions)
    .mockResolvedValueOnce({
      discussions: [
        { public_id: 'a', body: 'Only Dave follows this author' } as never,
      ],
    })
    .mockResolvedValueOnce({ discussions: [] });
  const { client, rerender } = setup();
  await screen.findByText('Only Dave follows this author');
  rerender(
    <QueryClientProvider client={client}>
      <FollowingDiscussions viewerAccountId='ada' />
    </QueryClientProvider>
  );
  expect(screen.queryByText('Only Dave follows this author')).toBeNull();
  expect(
    await screen.findByText('No discussions from people you follow yet')
  ).toBeTruthy();
});

it('shows a recoverable failure rather than substituting global discussions', async () => {
  vi.mocked(listFollowingDiscussions).mockRejectedValue(new Error('offline'));
  setup();
  expect(await screen.findByRole('alert')).toBeTruthy();
  expect(
    screen.queryByRole('link', { name: 'Explore all discussions' })
  ).toBeNull();
  await waitFor(() =>
    expect(listFollowingDiscussions).toHaveBeenCalledTimes(1)
  );
});
