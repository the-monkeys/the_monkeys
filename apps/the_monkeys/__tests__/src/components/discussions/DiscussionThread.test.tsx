import { DiscussionThread } from '@/components/discussions/DiscussionThread';
import { render, screen } from '@testing-library/react';
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

it('hides replies that are not visible and their children', () => {
  render(
    <DiscussionThread
      post={{
        public_id: 'abc',
        body: 'Root post',
        status: 'visible',
        author_username: 'dave',
        author_gone: false,
        group_slug: '',
        reply_count: 3,
        like_count: 0,
        liked: false,
        replies: [
          {
            public_id: 'r1',
            parent_public_id: '',
            body: 'Visible reply',
            status: 'visible',
            author_username: 'lee',
            author_gone: false,
          },
          {
            public_id: 'r2',
            parent_public_id: '',
            body: 'Secret note',
            status: 'hidden',
            author_username: 'lee',
            author_gone: false,
          },
          {
            public_id: 'r3',
            parent_public_id: 'r2',
            body: 'Child of hidden',
            status: 'visible',
            author_username: 'lee',
            author_gone: false,
          },
          {
            public_id: 'r4',
            parent_public_id: 'r1',
            body: 'Child of visible',
            status: 'visible',
            author_username: 'lee',
            author_gone: false,
          },
        ],
      }}
    />
  );
  expect(screen.getByText('Visible reply')).toBeTruthy();
  expect(screen.getByText('Child of visible')).toBeTruthy();
  expect(screen.queryByText('Secret note')).toBeNull();
  expect(screen.queryByText('Child of hidden')).toBeNull();
});
