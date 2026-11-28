import SnapshotStudioPage from '@/app/snapshot/[blogId]/page';
import { SocialSnapshotCard } from '@/components/social/SocialSnapshot';
import { SocialSnapshotDialog } from '@/components/social/SocialSnapshotDialog';
import { DiscussionStudio } from '@/features/snapshot/components/DiscussionStudio';
import type { Blog } from '@/services/blog/blogTypes';
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';

const { state } = vi.hoisted(() => ({
  state: {
    isFresh: undefined as boolean | undefined,
    blog: {
      blog_id: '123',
      is_nsfw: true,
      blog: {
        blocks: [
          {
            type: 'image',
            data: { file: { url: 'https://example.com/private.jpg' } },
          },
        ],
      },
    },
  },
}));
vi.mock('@/hooks/blog/useGetPublishedBlogDetailByBlogId', () => ({
  default: () => ({
    blog: state.blog,
    isFresh: state.isFresh,
    isLoading: false,
    isError: false,
  }),
}));
vi.mock('@/hooks/user/useUser', () => ({ default: () => ({}) }));
vi.mock('@/hooks/user/useGetProfileInfoByUserId', () => ({
  default: () => ({}),
}));
vi.mock('@/features/snapshot/hooks/useSnapshotAuthor', () => ({
  useSnapshotAuthor: () => ({}),
}));
vi.mock('@/features/snapshot/components/SnapshotStudio', () => ({
  SnapshotStudio: () => <div data-testid='studio'>Studio mounted</div>,
}));
afterEach(() => {
  cleanup();
  state.isFresh = undefined;
  state.blog.is_nsfw = true;
});
it('blocks direct article Studio entry before transforming or mounting private media', () => {
  const { container } = render(
    <SnapshotStudioPage params={{ blogId: '123' }} />
  );
  expect(screen.queryByTestId('studio')).toBeNull();
  expect(container.querySelector('img')).toBeNull();
  expect(screen.getByText('Snapshot unavailable')).toBeTruthy();
});
it('blocks the legacy snapshot dialog before mounting hooks or media', () => {
  const { container } = render(
    <SocialSnapshotDialog blog={state.blog as Blog} />
  );
  expect(container.innerHTML).toBe('');
});
it('hides snapshot Studio promotion for flagged article data', () => {
  const { container } = render(
    <SocialSnapshotCard blog={state.blog as Blog} />
  );
  expect(container.innerHTML).toBe('');
});

it('blocks a directly mounted discussion Studio before running source hooks', () => {
  const { container } = render(
    <DiscussionStudio
      post={{
        public_id: '123',
        status: 'visible',
        body: 'Private body',
        is_nsfw: true,
      }}
    />
  );
  expect(container.innerHTML).toBe('');
});

it('waits for a fresh source read before mounting Studio from an old unflagged cache entry', () => {
  state.blog.is_nsfw = false;
  state.isFresh = false;
  const view = render(<SnapshotStudioPage params={{ blogId: '123' }} />);
  expect(screen.queryByTestId('studio')).toBeNull();
  state.isFresh = true;
  view.rerender(<SnapshotStudioPage params={{ blogId: '123' }} />);
  expect(screen.getByTestId('studio')).toBeTruthy();
});
