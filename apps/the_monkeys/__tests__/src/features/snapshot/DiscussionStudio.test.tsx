import { SocialSnapshotCard } from '@/components/social/SocialSnapshot';
import { DiscussionStudio } from '@/features/snapshot/components/DiscussionStudio';
import { useSnapshotState } from '@/features/snapshot/hooks/useSnapshotState';
import type { SnapshotInput } from '@/features/snapshot/types';
import type { Blog } from '@/services/blog/blogTypes';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  profile: { username: 'alice', first_name: 'Alice', is_verified: true },
  loading: false,
  requested: vi.fn(),
}));
vi.mock('@/hooks/user/useUser', () => ({
  default: (handle: string) => {
    mocks.requested(handle);
    return { user: mocks.profile, isLoading: mocks.loading };
  },
}));
vi.mock('@/features/snapshot/hooks/useSnapshotAuthor', () => ({
  useSnapshotAuthor: (username: string, displayName: string) => ({
    author: username ? { username, displayName } : undefined,
    isReady: true,
  }),
}));
vi.mock('@/features/snapshot/components/SnapshotStudio', () => ({
  SnapshotStudio: ({
    input,
    initialTemplateId,
    isSourceLoading,
  }: {
    input: SnapshotInput;
    initialTemplateId: string;
    isSourceLoading: boolean;
  }) => (
    <pre data-testid='input'>
      {JSON.stringify({ ...input, initialTemplateId, isSourceLoading })}
    </pre>
  ),
}));
afterEach(cleanup);

it('prefills the original author rather than the logged-in viewer and carries the genuine badge', () => {
  render(
    <DiscussionStudio
      origin={window.location.origin}
      post={{
        public_id: 'abc',
        status: 'visible',
        body: 'नमस्ते 🌍',
        author_username: 'alice',
      }}
    />
  );
  expect(mocks.requested).toHaveBeenCalledWith('alice');
  const input = JSON.parse(screen.getByTestId('input').textContent!);
  expect(input.author).toEqual({
    username: 'alice',
    displayName: 'Alice',
    isVerified: true,
  });
  expect(input.description).toBe('नमस्ते 🌍');
  expect(input.initialTemplateId).toBe('quote-card');
  expect(input.sourceUrl).toBe(`${window.location.origin}/discussions/abc`);
  expect(
    screen
      .getByRole('link', { name: /Back to discussion/ })
      .getAttribute('href')
  ).toBe('/discussions/abc');
});

it('uses a stable configured original URL and waits for the author profile', () => {
  mocks.loading = true;
  const post = {
    public_id: 'abc',
    status: 'visible',
    body: 'Original',
    author_username: 'alice',
  };
  const { rerender } = render(
    <DiscussionStudio post={post} origin='https://example.test' />
  );
  expect(JSON.parse(screen.getByTestId('input').textContent!)).toMatchObject({
    sourceUrl: 'https://example.test/discussions/abc',
    isSourceLoading: true,
  });
  mocks.loading = false;
  rerender(<DiscussionStudio post={post} origin='https://example.test' />);
  expect(JSON.parse(screen.getByTestId('input').textContent!)).toMatchObject({
    isSourceLoading: false,
    author: { isVerified: true },
  });
});

it('updates a late verification result without overwriting user-edited content', () => {
  const initial: SnapshotInput = {
    source: 'discussion',
    title: 'Discussion',
    description: 'Original',
    author: { username: 'alice', displayName: 'Alice' },
  };
  function State({ input }: { input: SnapshotInput }) {
    const { state, updateInput } = useSnapshotState({ initialInput: input });
    return (
      <>
        <button onClick={() => updateInput({ description: 'My edit' })}>
          Edit
        </button>
        <pre data-testid='state'>{JSON.stringify(state.input)}</pre>
      </>
    );
  }
  const { rerender } = render(<State input={initial} />);
  fireEvent.click(screen.getByRole('button', { name: 'Edit' }));
  rerender(
    <State
      input={{ ...initial, author: { ...initial.author!, isVerified: true } }}
    />
  );
  expect(JSON.parse(screen.getByTestId('state').textContent!)).toMatchObject({
    description: 'My edit',
    author: { isVerified: true },
  });
});

it('reuses the article card while preserving existing article Studio links', () => {
  const { rerender } = render(
    <SocialSnapshotCard blog={{ blog_id: 'old123' } as Blog} />
  );
  expect(
    screen.getByRole('link', { name: 'Open Studio →' }).getAttribute('href')
  ).toBe('/snapshot/old123');
  rerender(<SocialSnapshotCard discussionId='abc123' />);
  expect(
    screen.getByRole('link', { name: 'Open Studio →' }).getAttribute('href')
  ).toBe('/snapshot/discussion/abc123');
  expect(screen.getByText(/for this discussion/)).toBeTruthy();
});
