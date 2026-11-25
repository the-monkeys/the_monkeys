import type { ReactNode } from 'react';

import { FeedBlogCard } from '@/components/cards/blog/FeedBlogCard';
import { ProfileBlogCard } from '@/components/cards/blog/ProfileBlogCard';
import ScheduledBlogCard from '@/components/cards/blog/ScheduledBlogCard';
import {
  TrendingBlogCardLarge,
  TrendingBlogCardSmall,
} from '@/components/cards/blog/TrendingBlogCard';
import { EditorialHero } from '@/components/editorial/EditorialHero';
import { FeatureCard } from '@/components/editorial/FeatureCard';
import { FeedListItem } from '@/components/editorial/FeedListItem';
import { HorizontalFeatureCard } from '@/components/editorial/HorizontalFeatureCard';
import { MinimalBlogCard } from '@/components/editorial/MinimalBlogCard';
import { LandingEditorialFeed } from '@/components/landing/LandingEditorialFeed';
import { LandingHero } from '@/components/landing/LandingHero';
import { LandingMorePosts } from '@/components/landing/LandingMorePosts';
import type { MetaBlog } from '@/services/blog/blogTypes';
import { fromMetaBlog } from '@/utils/blogCardAdapters';
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('@tanstack/react-query', () => ({
  useQueryClient: () => ({ invalidateQueries: vi.fn() }),
}));
vi.mock('next/navigation', () => ({ useRouter: () => ({ push: vi.fn() }) }));
// The shared gate owns authorization. This integration test proves callers keep
// their actual text/media descendants behind it and pass the stable target/href.
vi.mock('@/components/moderation/ContentGate', () => ({
  ContentGate: ({ content, target, href, children }: any) =>
    content.is_nsfw ||
    content.content_rating?.is_nsfw ||
    content.content_unavailable ? (
      <div
        role='status'
        data-target={`${target.kind}:${target.id}`}
        data-href={href}
      >
        Sensitive content
      </div>
    ) : (
      <>{children}</>
    ),
}));
vi.mock('@/components/moderation/ContentOptions', () => ({
  ContentOptions: () => null,
}));
vi.mock('@/components/editorial/BlogActionBar', () => ({
  default: () => null,
}));
vi.mock('@/components/editorial/FeaturedAuthorsStrip', () => ({
  default: () => null,
}));
vi.mock('@/components/landing/LandingFeaturedEvent', () => ({
  LandingFeaturedEvent: () => null,
}));
vi.mock('@/components/user/userInfo', () => ({
  UserInfoCardShowcase: () => null,
}));
vi.mock('@/components/blog/actions/BlogShareDialog', () => ({
  BlogShareDialog: () => null,
}));
vi.mock('@/components/blog/actions/EditBlogDialog', () => ({
  EditBlogDialog: () => null,
}));
vi.mock('@/components/blog/actions/DeleteBlogDialog', () => ({
  DeleteBlogDialog: () => null,
}));
vi.mock('@/components/blog/buttons/LikeButton', () => ({
  LikeButton: () => null,
}));
vi.mock('@/components/blog/buttons/BookmarkButton', () => ({
  BookmarkButton: () => null,
}));
vi.mock('@/components/blog/LikesCount', () => ({ LikesCount: () => null }));
vi.mock('@/components/blog/getBlogContent', () => ({
  BlogTitle: ({ title }: any) => <h2>{title}</h2>,
  BlogDescription: ({ description }: any) => <p>{description}</p>,
  BlogImage: ({ image, title }: any) => <img src={image} alt={title} />,
  BlogPlaceholderImage: () => <img alt='Placeholder' />,
}));
const meta = {
  blog_id: '123',
  owner_account_id: 'author',
  title: 'Private headline',
  first_paragraph: 'Private body',
  first_image: 'https://example.com/private.jpg',
  tags: [],
  published_time: '2026-11-25',
  canonical_slug: 'original-123',
} as MetaBlog;
const renderers: [string, (blog: MetaBlog) => ReactNode, string?][] = [
  ...['list', 'vertical', 'horizontal', 'compact'].map(
    (variant): [string, (blog: MetaBlog) => ReactNode] => [
      variant,
      (blog) => (
        <FeedBlogCard blog={fromMetaBlog(blog)} variant={variant as any} />
      ),
    ]
  ),
  ['trending', (blog) => <TrendingBlogCardLarge blog={blog} />],
  ['trending small', (blog) => <TrendingBlogCardSmall blog={blog} />],
  [
    'profile',
    (blog) => (
      <ProfileBlogCard
        blog={blog}
        isAuthenticated={false}
        modificationEnable={false}
      />
    ),
  ],
  ['editorial hero', (blog) => <EditorialHero blog={blog} />],
  ['feature', (blog) => <FeatureCard blog={blog} />],
  ['horizontal feature', (blog) => <HorizontalFeatureCard blog={blog} />],
  ['feed item', (blog) => <FeedListItem blog={blog} />],
  ['minimal', (blog) => <MinimalBlogCard blog={blog} />],
  ['scheduled', (blog) => <ScheduledBlogCard blog={blog} />, '/edit/123'],
  ['landing more', (blog) => <LandingMorePosts posts={[blog]} />],
  [
    'landing feed',
    (blog) => <LandingEditorialFeed posts={[blog]} events={[]} />,
  ],
  ['landing lead', (lead) => <LandingHero lead={lead} />],
];
afterEach(cleanup);
describe.each(renderers)(
  '%s article gate integration',
  (_name, article, expectedHref = '/blog/original-123') => {
    it.each([
      { is_nsfw: true },
      { content_rating: { is_nsfw: true, revealed: true } },
      { content_unavailable: true },
    ])('does not mount text/media for %j', (flags) => {
      const { container } = render(article({ ...meta, ...flags }));
      expect(container.textContent).not.toContain('Private');
      expect(container.querySelector('img')).toBeNull();
      expect(screen.getByRole('status').getAttribute('data-target')).toBe(
        'blog:123'
      );
      expect(screen.getByRole('status').getAttribute('data-href')).toBe(
        expectedHref
      );
    });
    it('preserves legacy unflagged headline and canonical link', () => {
      const { container } = render(article(meta));
      expect(container.textContent).toContain('Private headline');
      if (_name !== 'scheduled')
        expect(
          container.querySelector('a[href="/blog/original-123"]')
        ).toBeTruthy();
      expect(screen.queryByRole('status')).toBeNull();
    });
  }
);
