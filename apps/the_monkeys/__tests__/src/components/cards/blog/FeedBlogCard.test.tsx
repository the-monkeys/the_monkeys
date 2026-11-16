import { FeedBlogCard } from '@/components/cards/blog/FeedBlogCard';
import { BlogCardData } from '@/services/blog/blogTypes';
import { cleanup, render, screen } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/components/blog/actions/BlogShareDialog', () => ({
  BlogShareDialog: () => <button type='button'>Share post</button>,
}));
vi.mock('@/components/blog/buttons/BookmarkButton', () => ({
  BookmarkButton: () => <button type='button'>Bookmark</button>,
}));
vi.mock('@/components/blog/buttons/LikeButton', () => ({
  LikeButton: () => <button type='button'>Like</button>,
}));
vi.mock('@/components/blog/LikesCount', () => ({
  LikesCount: () => <span>0 likes</span>,
}));
vi.mock('@/components/user/userInfo', () => ({
  UserInfoCardShowcase: ({ date }: { date?: string }) => (
    <span>Author {date}</span>
  ),
}));
vi.mock('@/components/blog/getBlogContent', () => ({
  BlogDescription: ({ description }: { description: string }) => (
    <p>{description}</p>
  ),
  BlogImage: ({ title }: { title: string }) => <img alt={title} />,
  BlogPlaceholderImage: ({ title }: { title: string }) => <img alt={title} />,
  BlogTitle: ({ title }: { title: string }) => <h2>{title}</h2>,
}));

const card: BlogCardData = {
  blogId: 'post-1',
  authorId: 'author-1',
  date: '2026-09-19T10:00:00.000Z',
  slug: 'draft-craft',
  tags: ['Writing'],
  title: 'Draft craft',
  description: 'How writers revise.',
  image: '',
};

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe('FeedBlogCard publication privacy', () => {
  it('uses a deterministic UTC date for compact cards before hydration', () => {
    const native = Date.prototype.toLocaleDateString;
    vi.spyOn(Date.prototype, 'toLocaleDateString').mockImplementation(function (
      this: Date,
      locale,
      options
    ) {
      return native.call(this, locale, {
        ...options,
        timeZone: options?.timeZone ?? 'America/Los_Angeles',
      });
    });
    const html = renderToString(
      <FeedBlogCard
        blog={{ ...card, date: '2020-09-19T00:30:00Z' }}
        variant='compact'
      />
    );
    expect(html).toContain('Sep 19, 2020');
  });
  it('hides sharing and labels members-only posts', () => {
    render(
      <FeedBlogCard blog={{ ...card, audience: 'group_only' }} variant='list' />
    );

    expect(screen.getByText('Members only')).toBeTruthy();
    expect(screen.queryByRole('button', { name: 'Share post' })).toBeNull();
  });

  it.each([undefined, 'public'] as const)(
    'keeps sharing for %s audience posts',
    (audience) => {
      render(<FeedBlogCard blog={{ ...card, audience }} variant='list' />);

      expect(screen.getByRole('button', { name: 'Share post' })).toBeTruthy();
      expect(screen.queryByText('Members only')).toBeNull();
    }
  );
});
