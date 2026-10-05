import { render, screen } from '@testing-library/react';
import { DiscussionThread } from '@/components/discussions/DiscussionThread';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@/components/discussions/DiscussionActions', () => ({
  DiscussionActions: () => null,
}));
vi.mock('@/components/discussions/ReplyForm', () => ({
  ReplyForm: () => null,
}));

it('prints the post and one reply level', () => {
  render(
    <DiscussionThread
      post={{
        public_id: 'abc',
        body: 'Root post',
        status: 'visible',
        author_username: 'dave',
        author_gone: false,
        group_slug: '',
        reply_count: 1,
        like_count: 0,
        liked: false,
        replies: [
          {
            public_id: 'r1',
            parent_public_id: '',
            body: 'First reply',
            status: 'visible',
            author_username: 'lee',
            author_gone: false,
          },
        ],
      }}
    />
  );
  expect(screen.getByText('Root post')).toBeTruthy();
  expect(screen.getByText('First reply')).toBeTruthy();
});
