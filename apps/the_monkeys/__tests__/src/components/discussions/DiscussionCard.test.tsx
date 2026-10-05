import { render, screen } from '@testing-library/react';
import { DiscussionCard } from '@/components/discussions/DiscussionCard';
import { describe, expect, it } from 'vitest';

const post = {
  public_id: 'abc',
  body: 'Hello thread',
  status: 'visible',
  author_username: 'dave',
  author_gone: false,
  group_slug: '',
  reply_count: 0,
  like_count: 3,
  liked: false,
  created_at: '2026-10-05T04:00:00Z',
};

describe('DiscussionCard', () => {
  it('prints the body in the article', () => {
    render(<DiscussionCard post={post} linked />);
    expect(screen.getByRole('article').textContent).toContain('Hello thread');
    expect(screen.getByRole('link', { name: 'Hello thread' }).getAttribute('href')).toBe(
      '/discussions/abc'
    );
  });
});
